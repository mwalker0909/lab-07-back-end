DROP TABLE IF EXISTS weathers;
DROP TABLE IF EXISTS yelp;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS meetups;
DROP TABLE IF EXISTS trails;
DROP TABLE IF EXISTS locations;
-- found information in class 9 video @ 2:31.34 --

CREATE TABLE locations(
  id SERIAL PRIMARY KEY,
  search_query VARCHAR(255),
  formatted_query VARCHAR(255),
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  created_at BIGINT
);

CREATE TABLE weathers (
  id SERIAL PRIMARY KEY, 
  forcast VARCHAR(255), 
  time VARCHAR(255),
  created_at BIGINT, 
  location_id INTEGER NOT NULL REFERENCES locations(id)
);

  CREATE TABLE yelp (
   id SERIAL PRIMARY KEY,
   name VARCHAR(255),
   image_url VARCHAR(255),
   price CHAR(5),
   rating NUMERIC(2,1),
   url VARCHAR(255),
   created_at BIGINT,
   location_id INTEGER NOT NULL REFERENCES locations(id) 
  );

  CREATE TABLE movies (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255),
      overview VARCHAR(1000),
      average_votes NUMERIC(4,2),
      total_votes INTEGER,
      image_url VARCHAR(255),
      popularity NUMERIC(6,4),
      release_on CHAR(10),
      created_at BIGINT,
      location_id INTEGER NOT NULL REFERENCES location_id
    );

