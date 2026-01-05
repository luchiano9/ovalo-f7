CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  score INTEGER NOT NULL,
  description TEXT,
  image TEXT,
  position TEXT,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  total_matches INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY,
  date TEXT DEFAULT CURRENT_TIMESTAMP,
  team_a_players TEXT NOT NULL, -- JSON array
  team_b_players TEXT NOT NULL, -- JSON array
  team_a_score INTEGER DEFAULT 0,
  team_b_score INTEGER DEFAULT 0,
  winner TEXT -- 'teamA', 'teamB', or 'draw'
);
