CREATE TABLE tag (
    id  serial  PRIMARY KEY,
    name  text  NOT NULL  UNIQUE,
    popularity  integer  NOT NULL  DEFAULT 0
);
CREATE INDEX tag_name ON tag (name);
CREATE INDEX tag_popularity ON tag (popularity);

CREATE TABLE event_tag (
    event_id  integer  REFERENCES event (id)  ON DELETE CASCADE,
    tag_id  integer  REFERENCES tag (id)  ON DELETE CASCADE,
    PRIMARY KEY (event_id, tag_id)
);
