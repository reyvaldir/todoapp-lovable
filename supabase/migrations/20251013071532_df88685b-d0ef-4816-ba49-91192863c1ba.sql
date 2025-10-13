-- Create todos table
CREATE TABLE public.todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  task TEXT NOT NULL,
  is_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own todos"
  ON public.todos
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own todos"
  ON public.todos
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own todos"
  ON public.todos
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own todos"
  ON public.todos
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_todos_user_id ON public.todos(user_id);
CREATE INDEX idx_todos_created_at ON public.todos(created_at DESC);