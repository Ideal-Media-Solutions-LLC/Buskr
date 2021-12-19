ALTER TABLE event ADD COLUMN search tsvector;

UPDATE event
    SET search = (event.name || ' ' || event.description || ' ' || busker.name)::tsvector
    FROM busker WHERE event.busker_id = busker.id;

WITH tags AS (
    SELECT event_id, string_agg(' ', name)::tsvector as tag_names
    FROM event_tag
    JOIN tag ON tag_id = id
    GROUP BY event_id
) UPDATE event
    SET search = search || ' ' || tag_names
    FROM tags WHERE event_id = id;

ALTER TABLE event ALTER COLUMN search SET NOT NULL;
CREATE INDEX event_search ON event USING GIN (search);
