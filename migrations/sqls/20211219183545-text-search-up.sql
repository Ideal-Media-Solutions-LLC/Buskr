ALTER TABLE event ADD COLUMN search tsvector;

UPDATE event
    SET search = to_tsvector('english', event.name || ' ' || event.description || ' ' || busker.name)
    FROM busker WHERE event.busker_id = busker.id;

WITH tags AS (
    SELECT event_id, to_tsvector('english', string_agg(' ', name)) as tag_names
    FROM event_tag
    JOIN tag ON tag_id = id
    GROUP BY event_id
) UPDATE event
    SET search = search || ' ' || tag_names
    FROM tags WHERE event_id = id;

ALTER TABLE event ALTER COLUMN search SET NOT NULL;
CREATE INDEX event_search ON event USING GIN (search);
