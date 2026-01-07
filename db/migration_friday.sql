-- Add match_type to matches
ALTER TABLE matches ADD COLUMN match_type TEXT DEFAULT 'monday';

-- Create player_stats table
CREATE TABLE IF NOT EXISTS player_stats (
  player_id TEXT NOT NULL,
  match_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  total_matches INTEGER DEFAULT 0,
  PRIMARY KEY (player_id, match_type)
);

-- Migrate existing stats to 'monday'
INSERT OR IGNORE INTO player_stats (player_id, match_type, score, wins, losses, draws, total_matches)
SELECT id, 'monday', score, wins, losses, draws, total_matches FROM players;

-- Create record for 'friday' for all existing players
INSERT OR IGNORE INTO player_stats (player_id, match_type, score, wins, losses, draws, total_matches)
SELECT id, 'friday', score, 0, 0, 0, 0 FROM players;
