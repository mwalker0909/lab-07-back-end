DROP TABLE IF EXISTS locations; 

CREATE TABLE locations(
  id SERIAL PRIMARY KEY,
  search_query TEXT,
  formatted_query TEXT,
  latitude NUMERIC (20, 8),
  longitude NUMERIC (20, 8)
);
