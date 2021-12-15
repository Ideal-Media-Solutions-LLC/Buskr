CREATE TABLE busker (
    id  uuid  PRIMARY KEY,
    name  text  NOT NULL,
    email  text  NOT NULL,
    email_verified  boolean  NOT NULL  DEFAULT false,
    photo  text,
    bio  text
);
