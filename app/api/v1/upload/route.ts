import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limiter";
import { getAdminSupabase, isServerSupabaseConfigured } from "@/lib/supabase-server";

// CORS headers for all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const BUCKET_NAME = "public-files";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);

  // 1. Rate limiting check (10 uploads / 60 seconds per IP)
  const rateLimit = checkRateLimit(clientIp);

  const rateLimitHeaders = {
    ...corsHeaders,
    "X-RateLimit-Limit": rateLimit.limit.toString(),
    "X-RateLimit-Remaining": rateLimit.remaining.toString(),
    "X-RateLimit-Reset": rateLimit.reset.toString(),
  };

  if (!rateLimit.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Rate limit exceeded. Maximum 10 uploads per minute.",
        retry_after: rateLimit.retryAfter,
      },
      {
        status: 429,
        headers: {
          ...rateLimitHeaders,
          "Retry-After": rateLimit.retryAfter.toString(),
        },
      }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required 'file' parameter in multipart form data.",
        },
        { status: 400, headers: rateLimitHeaders }
      );
    }

    // 2. Validate file size (max 10MB)
    if (file.size > MAX_FILE_SIZE) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds the 10MB limit (uploaded file is ${sizeMb} MB).`,
        },
        { status: 413, headers: rateLimitHeaders }
      );
    }

    // 3. Parse expiration parameter
    // Accepts: '7d', '7day', '7', 'permanent', 'never', '0'
    const rawExpired =
      (formData.get("expired") as string | null) ||
      (formData.get("expiration") as string | null) ||
      req.nextUrl.searchParams.get("expired") ||
      "7d";

    const normalizedExpired = rawExpired.trim().toLowerCase();
    let expiredType: "7d" | "permanent" = "7d";
    let expiresAt: string | null = null;

    if (
      normalizedExpired === "permanent" ||
      normalizedExpired === "never" ||
      normalizedExpired === "0" ||
      normalizedExpired === "forever"
    ) {
      expiredType = "permanent";
      expiresAt = null;
    } else {
      // Default to 7 days
      expiredType = "7d";
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);
      expiresAt = expirationDate.toISOString();
    }

    // 4. Verify Supabase configuration
    if (!isServerSupabaseConfigured) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Supabase credentials are not configured on the server. Please check your environment variables.",
        },
        { status: 503, headers: rateLimitHeaders }
      );
    }

    const supabase = getAdminSupabase();

    // 5. Generate unique safe file name
    const timestamp = Date.now();
    const randomHex = Math.random().toString(36).substring(2, 9);
    const cleanOriginalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileExt = cleanOriginalName.includes(".")
      ? cleanOriginalName.split(".").pop()
      : "bin";
    const storagePath = `${timestamp}_${randomHex}.${fileExt}`;

    // 6. Upload file buffer to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (storageError) {
      console.error("[HyuuCdn Upload Error]", storageError);
      return NextResponse.json(
        {
          success: false,
          error: `Failed to upload to storage: ${storageError.message}`,
        },
        { status: 500, headers: rateLimitHeaders }
      );
    }

    // 7. Get public CDN URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;

    // 8. Insert metadata into database
    const { data: metaData, error: dbError } = await supabase
      .from("files_metadata")
      .insert({
        name: file.name,
        storage_path: storagePath,
        url: publicUrl,
        size: file.size,
        type: file.type || "application/octet-stream",
        expired_type: expiredType,
        expires_at: expiresAt,
        ip_hash: clientIp,
      })
      .select()
      .single();

    if (dbError) {
      console.error("[HyuuCdn DB Insert Error]", dbError);
      // Clean up uploaded file in storage
      await supabase.storage.from(BUCKET_NAME).remove([storagePath]);

      return NextResponse.json(
        {
          success: false,
          error: `Failed to record metadata: ${dbError.message}`,
        },
        { status: 500, headers: rateLimitHeaders }
      );
    }

    // 9. Return success response
    return NextResponse.json(
      {
        success: true,
        message: "File uploaded successfully to HyuuCdn",
        data: {
          id: metaData.id,
          name: metaData.name,
          size: metaData.size,
          type: metaData.type,
          url: metaData.url,
          storage_path: metaData.storage_path,
          expired: metaData.expired_type,
          expires_at: metaData.expires_at,
          created_at: metaData.created_at,
        },
      },
      {
        status: 201,
        headers: rateLimitHeaders,
      }
    );
  } catch (error) {
    console.error("[HyuuCdn Unexpected Upload Error]", error);
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500, headers: rateLimitHeaders }
    );
  }
}
