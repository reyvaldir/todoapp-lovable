-- Add deadline column to todos table
ALTER TABLE public.todos 
ADD COLUMN deadline timestamptz;