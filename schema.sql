DROP TABLE IF EXISTS city_explorer; 

CREATE TABLE city_explorer(
  id SERIAL PRIMARY KEY,
  latitude NUMERIC (20, 8),
  longitude NUMERIC (20, 8)
);
