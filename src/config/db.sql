CREATE TABLE boards (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  owner_ids UUID[] NOT NULL DEFAULT '{}',
  member_ids UUID[] NOT NULL DEFAULT '{}',
  column_order_ids UUID[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NULL,
  _destroy BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE columns (
  id UUID PRIMARY KEY,
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  position INTEGER NOT NULL
);

CREATE TABLE cards (
  id UUID PRIMARY KEY,
  board_id UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  column_id UUID NOT NULL REFERENCES columns(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover TEXT,
  position INTEGER NOT NULL
);