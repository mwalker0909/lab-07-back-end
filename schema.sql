
DROP TABLE IF EXISTS weather, yelp, movies, meetups, trails, locations;
-- found information in class 9 video @ 2:31.34 --

CREATE TABLE locations(
  id SERIAL PRIMARY KEY,
  search_query VARCHAR(255),
  formatted_query VARCHAR(255),
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  created_at BIGINT
);

CREATE TABLE IF NOT EXISTS weather (
  id SERIAL PRIMARY KEY, 
  forcast VARCHAR(255), 
  time VARCHAR(255),
  created_at BIGINT, 
  location_id INTEGER NOT NULL REFERENCES locations(id)
);


  CREATE TABLE IF NOT EXISTS yelp (
   id SERIAL PRIMARY KEY,
   name VARCHAR(255),
   image_url VARCHAR(255),
   price CHAR(5),
   rating NUMERIC(2,1),
   url VARCHAR(255),
   created_at BIGINT,
   location_id INTEGER NOT NULL REFERENCES locations(id) 
  );

    CREATE TABLE IF NOT EXISTS movies (
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

    CREATE TABLE IF NOT EXISTS meetups (
      id SERIAL PRIMARY KEY,
      link VARCHAR(255),
      name VARCHAR(255),
      event_date CHAR(15),
      host VARCHAR(255),
      created_at BIGINT,
      location_id INTEGER NOT NULL REFERENCES location_id
    );

    CREATE TABLE IF NOT EXISTS trails (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      location VARCHAR(255),
      length NUMERIC(4, 1),
      stars NUMERIC(2, 1),
      summary VARCHAR(255),
      conditions TEXT,
      conditions_date CHAR(10),
      conditions_time CHAR(8),
      created_at BIGINT,
      location_id INTEGER NOT NULL REFERENCES location_id
    );