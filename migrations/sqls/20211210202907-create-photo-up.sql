CREATE TABLE photo (
    id  serial  PRIMARY KEY,
    url  text  NOT NULL
);

CREATE TABLE event_photo (
    event_id  integer  REFERENCES event (id)  ON DELETE CASCADE,
    photo_id  integer  REFERENCES photo (id)  ON DELETE CASCADE,
    PRIMARY KEY (event_id, photo_id)
);
