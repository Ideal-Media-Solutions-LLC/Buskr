# Setup

## Servers

If you want to run your own version of this database, you will need a PostgreSQL service and a Redis service. You can point the app to your services with the environment variables specified in `.env`. (The easiest thing to do is copy `.env` to your own private `.env.local` file.) We also have a dedicated Redis server running; check the AWS account if you want to get its IP address.

##  Initializing

To create all tables and indices:

```sh
npm run migrate
```

## Seeding

Random data can be generated and added to the database from the command line:

```sh
npm run seed
```

# Endpoints
## [GET /api/calendar](https://www.buskr.life/api/calendar?lat=29.954767355989652&lng=-90.06911208674771)

Returns an array of dates on which events will occur.

### Query Parameters

- `lng: number` - Longitude around which to center results. Required.
- `lat: number` - Latitude around which to center results. Required.
- `offset: number` - Time zone offset from UTC in minutes. Defaults to 0.
- `dist: number` - If specified, restrict events to a maximum distance from `lng, lat`.
- `search: string` - If specified, filter events by text search.

### Sample Output

```json
[
  "2021-12-30T08:00:00.000Z","2022-01-15T08:00:00.000Z",
  "2021-12-29T08:00:00.000Z","2022-01-09T08:00:00.000Z"
]
```

## [GET /api/conflicts](https://www.buskr.life/api/conflicts?lat=29.954767355989652&lng=-90.06911208674771)

Returns a list of event IDs that conflict with a prospective new event.

### Query Parameters

- `lng: number` - Longitude around which to center results. Required.
- `lat: number` - Latitude around which to center results. Required.
- `from: Date` - Filter out events that started before the parameter. Required.
- `to: Date` - Filter out events that will end after the parameter. Required.
- `dist: number` - Restrict events to a maximum distance from `lng, lat`.

### Sample Output

```json
[
  3606,
  893,
  852,
  4832,
  1244,
  294
]
```

## [GET /api/events](https://www.buskr.life/api/events?lat=29.954767355989652&lng=-90.06911208674771)

Returns an array of events in [GeoJSON](https://geojson.org/) format.

### Query Parameters

- `lng: number` - Longitude around which to center results. Required.
- `lat: number` - Latitude around which to center results. Required.
- `from: Date` - If specified, filter out events that started before the parameter.
- `to: Date` - If specified, filter out events that will end after the parameter.
- `limit: number` - If specified, no more than `limit` results are returned.
- `offset: number` - If specified, the first `offset` results are skipped.
- `sort: string` - If `distance`, sort by distance from center. If `time`, sort by time. Defaults to `distance`.
- `dist: number` - If specified, restrict events to a maximum distance from `lng, lat`.
- `search: string` - If specified, filter events by text search.

### Sample Output

```json
[
    {
        "distance": 0.00963223560190963,
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [
                -90.06911208674771,
                29.954767355989652
            ]
        },
        "properties": {
            "id": 2,
            "ends": "2022-01-12T07:55:37.880Z",
            "name": "Event name",
            "tags": [
                "acrobatics",
                "dance",
                "puppet show"
            ],
            "photos": [
                "https://someurl.com/someimage.jpeg"
            ],
            "starts": "2022-01-12T07:21:37.880Z",
            "buskerId": "628077f5-6f30-4be1-955a-167eaec7062c",
            "buskerName": "John Smith",
            "description": "Event description",
            "location": {
                "neighborhood": "Seventh Ward",
                "locality": "New Orleans",
                "administrative_area_level_2": "Orleans Parish",
                "administrative_area_level_1": "LA",
                "country": "US",
                "postal_code": "70116",
                "postal_code_suffix": "1741",
                "address": "1932 Lapeyrouse St"
            }
        }
    }
]
```

## [GET /api/locate](https://www.buskr.life/locate)

Returns an approximation of the user's location based on their IP address.

### Sample Output

```json
{
  "lng":-90.0691,
  "lat":29.9547
}
```

## [GET /api/suggestions](https://www.buskr.life/suggestions?lng=-90.06911208674771&lat=29.954767355989652&from=2021-12-23T08%3A00%3A00.000Z&to=2022-12-23T08%3A00%3A00.000Z)

Returns an array of autocompletion strings for the search input. Includes tags, event names, and performer names.

### Query Parameters

- `lng: number` - Longitude around which to center results. Required.
- `lat: number` - Latitude around which to center results. Required.
- `from: Date` - Filter out events that started before the parameter. Required.
- `to: Date` - Filter out events that will end after the parameter. Required.
- `dist: number` - Restrict events to a maximum distance from `lng, lat`.

### Sample Output

```json
[
  "Aaron Lake",
  "Accordion Solos in the Park",
  "acrobatics"
]
```

## POST /api/events

Creates an event. Requires authentication.

### Body Parameters

- `name: string` - Event name. Required.
- `description: string` - Event description. Required.
- `center: {lng: number, lat: number}` - Event longitude and latitude. Required.
- `tags: string[]` - Event tags. Defaults to an empty array.
- `starts: Date` - When the event will begin.
- `ends: Date` - When the event will end. Must be greater than both `starts` and the current time.
- `photos: string[]` - Event photo URLs. Defaults to an empty array.
