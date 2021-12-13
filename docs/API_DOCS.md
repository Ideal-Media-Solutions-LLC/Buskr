# Setup

## Servers

If you want to run your own version of this database, you will need a PostgreSQL service and a Redis service. You can point the app to your services with the environment variables specified in `.env`. (The easiest thing to do is copy `.env` to your own private `.env.local` file.) We also have a dedicated Redis server running; check the AWS account if you want to get its IP address.

##  Initializing

To create all tables and indices:

```sh
npm run migrate
```

## Seeding

Random data can be generated and added to the database from the command line. The syntax looks like this:

```sh
npm run seed 100 -90.06911208674771,29.954767355989652 0.02
```

The first argument specifies the number of buskers to add. The second argument specifies longitude and latitude. The third argument specifies the maximum distance of new events, given in the same units as longitude and latitude.

# Endpoints

## [GET /event/:id](http://www.buskr.life/api/event/1)

Returns information about a single event.

### Path Parameters

- `id: number` - ID to look up in the event table. Required.

### Query Parameters

- `limit: number` - If specified, no more than `limit` results are returned.
- `offset: number` - If specified, the first `offset` results are skipped.

## [GET /profile/:id](http://www.buskr.life/api/profile/1)

Returns information about a performer and their upcoming events.

### Path Parameters

- `id: number` - ID to look up in the performer database. Required.

## [GET /events](http://www.buskr.life/api/events?features=coords,location,photos,tags&lat=29.954767355989652&lng=-90.06911208674771)

### Query Parameters

- `lat: number` - Latitude around which to center results. Required.
- `lng: number` - Longitude around which to center results. Required.
- `from: Date` - If specified, filter out events that started before the parameter.
- `to: Date` - If specified, filter out events that will end after the parameter.
- `limit: number` - If specified, no more than `limit` results are returned.
- `offset: number` - If specified, the first `offset` results are skipped.
- `sort: string` - If `distance`, sort by distance from center. If `time`, sort by time. Defaults to `distance`.
- `features: string[]` - Optional string-separated list of one or more of the following:
  - `coords`
  - `location`
  - `photos`
  - `tags`

### Features

The following pieces of event data are only queried if their feature is included in the `features` query parameter.

#### coords

Retrieves the `geometry` property, which stores the latitude and longitude of the event in GeoJSON format.

```json
"geometry": {
   "type": "Point",
   "coordinates": [
      -90.06911208674771,
      29.954767355989652
   ]
}
```

#### location

Retrieves the `properties.location` property, which stores human-readable address data.

```json
"location": {
   "neighborhood": "French Quarter",
   "locality": "New Orleans",
   "administrative_area_level_2": "Orleans Parish",
   "administrative_area_level_1": "LA",
   "country": "US",
   "postal_code": "70130",
   "postal_code_suffix": "2204",
   "address": "201 Bourbon St"
}
```

### photos

Retrieves the `properties.photos` property, which store an array of photo URLs.

```json
"photos": [
  "http://placeimg.com/640/480/city1",
  "http://placeimg.com/640/480/city2"
]
```

### tags

Retrieves the `properties.tags` property, which stores an array of string tags.

```json
"tags": [
  "puppet show",
  "magic",
  "juggling",
  "living statue"
]
```