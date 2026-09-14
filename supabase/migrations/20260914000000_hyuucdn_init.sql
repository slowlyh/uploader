-- HyuuCdn Supabase Database Migration
-- Timestamp: 2026-09-14

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Recreate table
DROP TABLE IF EXISTS public.files_metadata CASCADE;

CREATE TABLE public.files_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    storage_path TEXT NOT NULL UNIQUE,
    url TEXT NOT NULL,
    size BIGINT NOT NULL,
    type TEXT NOT NULL DEFAULT 'application/octet-stream',
    expired_type TEXT NOT NULL CHECK (expired_type IN ('7d', 'permanent')) DEFAULT '7d',
    expires_at TIMESTAMPTZ DEFAULT NULL,
    ip_hash TEXT DEFAULT NULL,
    downloads BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_files_metadata_expires_at 
    ON public.files_metadata (expires_at) 
    WHERE expires_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_files_metadata_created_at 
    ON public.files_metadata (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_files_metadata_storage_path 
    ON public.files_metadata (storage_path);

ALTER TABLE public.files_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view file metadata"
    ON public.files_metadata FOR SELECT USING (true);

CREATE POLICY "Public can insert file metadata"
    ON public.files_metadata FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can update file metadata"
    ON public.files_metadata FOR UPDATE USING (true);

CREATE POLICY "Public can delete file metadata"
    ON public.files_metadata FOR DELETE USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.files_metadata;

-- Setup Storage
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('public-files', 'public-files', true, 10485760, NULL)
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 10485760;

DROP POLICY IF EXISTS "Public file access" ON storage.objects;
CREATE POLICY "Public file access" ON storage.objects FOR SELECT USING (bucket_id = 'public-files');

DROP POLICY IF EXISTS "Public file upload" ON storage.objects;
CREATE POLICY "Public file upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'public-files');

DROP POLICY IF EXISTS "Public file delete" ON storage.objects;
CREATE POLICY "Public file delete" ON storage.objects FOR DELETE USING (bucket_id = 'public-files');

CREATE OR REPLACE FUNCTION public.clean_expired_files()
RETURNS TABLE (deleted_count INT) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    del_count INT := 0;
    rec RECORD;
BEGIN
    FOR rec IN 
        SELECT id, storage_path 
        FROM public.files_metadata 
        WHERE expires_at IS NOT NULL AND expires_at < now()
    LOOP
        DELETE FROM storage.objects 
        WHERE bucket_id = 'public-files' AND name = rec.storage_path;
        
        DELETE FROM public.files_metadata 
        WHERE id = rec.id;
        
        del_count := del_count + 1;
    END LOOP;

    RETURN QUERY SELECT del_count;
END;
$$;
