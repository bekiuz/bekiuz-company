CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  service TEXT NOT NULL,
  brief TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','in_progress','closed')),
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  details TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','done')),
  due_date TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

CREATE TABLE IF NOT EXISTS quotes (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  project TEXT NOT NULL,
  scope TEXT NOT NULL,
  estimate REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'UZS',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','approved','sent')),
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);

CREATE TABLE IF NOT EXISTS agent_usage (
  day TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  requests INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, ip_hash)
);