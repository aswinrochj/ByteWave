# Supabase Migration Plan: Videos & Certifications

Moving to Supabase provides a powerful Postgres backend and flexible storage for your media. Follow these steps to set it up:

## Step 1: Project Initialization
1.  Sign in to [Supabase](https://supabase.com/).
2.  Create a new project named **ByteWave**.
3.  Once the project is ready, go to **Project Settings > API**.
4.  Copy the `Project URL` and `anon public` key.

## Step 2: Environment Configuration
Update your `.env.local` file with the following (replace with your actual values):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Database & Storage Setup (SQL)
Go to the **SQL Editor** in Supabase and run this script to create the infrastructure:

```sql
-- 1. Create Storage Buckets
-- Run this in the SQL editor or create manually in the "Storage" tab
INSERT INTO storage.buckets (id, name, public) 
VALUES ('videos', 'videos', true), ('certs', 'certs', true);

-- 2. Create the Database Table for Certifications
CREATE TABLE public.certifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  issuer TEXT,
  issue_date DATE,
  description TEXT,
  file_url TEXT NOT NULL,
  verification_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Table for Video Introductions
CREATE TABLE public.video_intros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  video_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_intros ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies (Tables)
-- Certifications
DROP POLICY IF EXISTS "Anyone can view certs" ON public.certifications;
CREATE POLICY "Anyone can view certs" ON public.certifications FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage own certs" ON public.certifications;
CREATE POLICY "Users can manage own certs" ON public.certifications FOR ALL USING (true);

-- Video Intros
DROP POLICY IF EXISTS "Anyone can view videos" ON public.video_intros;
CREATE POLICY "Anyone can view videos" ON public.video_intros FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can manage own videos" ON public.video_intros;
CREATE POLICY "Users can manage own videos" ON public.video_intros FOR ALL USING (true);

-- 6. Storage Bucket Policies (CRITICAL FOR UPLOADS)
-- These allow the app to save files to your buckets
CREATE POLICY "Public Upload Video" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'videos');
CREATE POLICY "Public Upload Certs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'certs');
CREATE POLICY "Public View Video" ON storage.objects FOR SELECT USING (bucket_id = 'videos');
CREATE POLICY "Public View Certs" ON storage.objects FOR SELECT USING (bucket_id = 'certs');


```

## Step 4: Install Dependencies
Run this command in your terminal:
```bash
npm install @supabase/supabase-js
```

## Step 5: Initialize the Client
I will create a `lib/supabase/client.ts` file for you once you have the environment variables ready.
