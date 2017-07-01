CREATE TABLE locations(
	id SERIAL PRIMARY KEY NOT NULL,
   name VARCHAR(85),
   street VARCHAR(85),
   city VARCHAR(35),
   state VARCHAR(2),
   zipcode INT,
   phone VARCHAR(15),
   website VARCHAR(85),
   description VARCHAR(1400),
   latitude VARCHAR(55),
   longitude VARCHAR(55),
   types_id INT REFERENCES types (id)

);

CREATE TABLE locations_trips (
    id SERIAL PRIMARY KEY NOT NULL,
    locations_id INT REFERENCES locations (id) ON DELETE CASCADE,
    trips_id INT REFERENCES trips (id) ON DELETE CASCADE,
    stop_number INTEGER
);

CREATE TABLE admins(
    id SERIAL PRIMARY KEY NOT NULL,
   email VARCHAR(50),
   admin BOOLEAN
);

CREATE TABLE types(
id SERIAL PRIMARY KEY NOT NULL,
category TEXT
);


CREATE TABLE trips (
id SERIAL PRIMARY KEY NOT NULL,
name VARCHAR(55),
description VARCHAR(2400)
);

COPY locations(NAME,STREET,CITY,STATE,ZIPCODE,PHONE,WEBSITE,DESCRIPTION,LATITUDE,LONGITUDE,TYPES_ID) FROM '/Users/seanfelling/Desktop/locations.sql' DELIMITERS ',' CSV;
