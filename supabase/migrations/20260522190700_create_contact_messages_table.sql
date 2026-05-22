CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  telefono VARCHAR(100) NOT NULL,
  mensaje TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Only authenticated users can view contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);
