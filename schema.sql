DROP TABLE IF EXISTS locations; 

CREATE TABLE locations(
  id SERIAL PRIMARY KEY,
  city_name TEXT,
  latitude NUMERIC (20, 8),
  longitude NUMERIC (20, 8)
);
