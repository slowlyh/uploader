import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase, isServerSupabaseConfigured } from "@/lib/supabase-server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const fileId = params.id;

  if (!isServerSupabaseConfigured) {
    return NextResponse.json(
      { success: false, error: "Supabase not configured" },
      { status: 503, headers: corsHeaders }
    );
  }

  try {
    const supabase = getAdminSupabase();

    // Look up file by ID or storage_path
    const { data: file, error } = await supabase
      .from("files_metadata")
      .select("*")
      .or(`id.eq.${fileId},storage_path.eq.${fileId}`)
      .single();

    if (error || !file) {
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Check expiration
    if (file.expires_at && new Date(file.expires_at) < new Date()) {
      return NextResponse.json(
        {
          success: false,
          error: "File has expired and is no longer available",
          expired_at: file.expires_at,
        },
        { status: 410, headers: corsHeaders }
      );
    }

    // Optionally increment download counter in background
    supabase
      .from("files_metadata")
      .update({ downloads: (file.downloads || 0) + 1 })
      .eq("id", file.id)
      .then(() => {});

    return NextResponse.json(
      {
        success: true,
        data: {
          id: file.id,
          name: file.name,
          size: file.size,
          type: file.type,
          url: file.url,
          expired: file.expired_type,
          expires_at: file.expires_at,
          downloads: (file.downloads || 0) + 1,
          created_at: file.created_at,
        },
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const fileId = params.id;

  if (!isServerSupabaseConfigured) {
    return NextResponse.json(
      { success: false, error: "Supabase not configured" },
      { status: 503, headers: corsHeaders }
    );
  }

  try {
    const supabase = getAdminSupabase();

    const { data: file, error: fetchErr } = await supabase
      .from("files_metadata")
      .select("id, storage_path")
      .eq("id", fileId)
      .single();

    if (fetchErr || !file) {
      return NextResponse.json(
        { success: false, error: "File not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Delete from storage
    await supabase.storage.from("public-files").remove([file.storage_path]);

    // Delete record
    await supabase.from("files_metadata").delete().eq("id", file.id);

    return NextResponse.json(
      { success: true, message: "File deleted successfully" },
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500, headers: corsHeaders }
    );
  }
}
