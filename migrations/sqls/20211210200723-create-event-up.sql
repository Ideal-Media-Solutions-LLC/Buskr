CREATE TABLE event (
    id  serial  PRIMARY KEY,
    location  geography  NOT NULL,
    name  text  NOT NULL,
    description  text  NOT NULL,
    starts  timestamp with time zone  NOT NULL,
    ends  timestamp with time zone  NOT NULL,
    busker_id  uuid  NOT NULL  REFERENCES busker (id)  ON DELETE CASCADE
);
CREATE INDEX event_location ON event (location);
CREATE INDEX event_start ON event (starts);
CREATE INDEX event_end ON event (ends);
CREATE INDEX event_busker_id ON event (busker_id);
