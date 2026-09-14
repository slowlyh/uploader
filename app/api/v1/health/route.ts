import { NextResponse } from "next/server";
import { isServerSupabaseConfigured } from "@/lib/supabase-server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      service: "HyuuCdn",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
      storage: {
        provider: "supabase",
        bucket: "public-files",
        configured: isServerSupabaseConfigured,
      },
      limits: {
        max_upload_size: "10MB",
        max_upload_bytes: 10485760,
        retention_options: ["7d", "permanent"],
        rate_limit: "10 uploads per minute per IP",
      },
    },
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}
