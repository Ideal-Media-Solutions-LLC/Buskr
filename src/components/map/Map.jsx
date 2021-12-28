import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import Link from 'next/link';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { LocationContext } from '../../contexts';
import styles from '../../styles/Map.module.css';

const fmtTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' });
const fmtDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const InfoBox = function InfoBox(props) {
  const { feature } = props;
  const id = feature.getProperty('id');
  const name = feature.getProperty('name');
  const buskerId = feature.getProperty('buskerId');
  const buskerName = feature.getProperty('buskerName');
  const photos = feature.getProperty('photos');
  const starts = new Date(feature.getProperty('starts'));
  return (
    <article className={styles.infobox}>
      <img className={styles.infoPhoto} src={photos[0]} alt={name}/>
      <div className={styles.infoDetails}>
        <div className={styles.infoboxName}>
          <span className={styles.infoboxTime}>
            {fmtTime.format(starts)}
          </span>
          <Link href={`/event/${id}`}>
            {name}
          </Link>
        </div>
        <div className={styles.infoboxBuskerName}>
          <span className={styles.infoboxTime}>
            {fmtDate.format(starts)}
          </span>
          <Link href={`/profile/${buskerId}`}>{buskerName}</Link>
        </div>
      </div>
    </article>
  );
};

const timesSquare = {
  lng: -73.9877313,
  lat: 40.7579787,
};

/**
 * @typedef {Object} GeoJson
 * @property {'Feature'} type
 * @property {Object} geometry
 * @property {'Point'} geometry.type
 * @property {[lng: number, lat: number]} geometry.coordinates
 * @property {Object} properties
*/

/**
* @param {Object} props
* @param {React.CSSProperties} props.containerStyle
* @param {google.maps.LatLngLiteral} props.center
* @param {(position: google.maps.LatLngLiteral) => void} props.onDrop
* @param {GeoJson[]} props.events
*/
const Map = function Map({ containerStyle, center, onDrop, events }) {
  const loc = useContext(LocationContext);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_KEY,
    googleMapsClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT,
    version: 3,
  });
  const [map, setMap] = useState(null);
  const [infoFeature, setInfoFeature] = useState(null);
  const onLoad = useCallback((/** @type {google.maps.Map} */ map) => {
    setMap(map);
    map.data.setStyle({
      icon: '/imgs/marker.png',
    });
    map.addListener('click', ({ latLng: { lng, lat } }) => {
      setInfoFeature(null);
      if (onDrop === undefined) {
        return;
      }

      const center = { lat: lat(), lng: lng() };

      if (map.currentMarker) {
        map.currentMarker.setPosition(center);
      } else {
        map.currentMarker = new google.maps.Marker({
          position: center,
          map,
          draggable: true,
        });
      }

      onDrop(center);
    });

    map.data.addListener('click', ({ feature }) => {
      setInfoFeature(feature);
    });
  }, [onDrop]);

  useEffect(() => {
    if (!map || !loc) {
      return;
    }
    if (map.location) {
      map.location.setPosition(loc);
    } else {
      map.location = new google.maps.Marker({
        map,
        position: loc,
        title: 'You are here',
        icon: {
          fillColor: '#ff7585',
          fillOpacity: 1,
          path: google.maps.SymbolPath.CIRCLE,
          strokeWeight: 2,
          strokeColor: 'white',
          scale: 8,
        },
      });
    }
  }, [loc, map]);

  useEffect(() => {
    if (map) {
      map.data.forEach(feature => map.data.remove(feature));
      if (events) {
        for (const event of events) {
          map.data.addGeoJson(event);
        }
      }
    }
  }, [map, events]);

  // style={{ width: '100vw', height: '100vh' }}>
  return isLoaded ? (
    <div className={styles.mapContainer}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center || loc || timesSquare}
        zoom={17}
        onLoad={onLoad}
        options={{ mapId: process.env.NEXT_PUBLIC_MAP_ID }}
      >
        {infoFeature && <InfoBox feature={infoFeature} />}
      </GoogleMap>
    </div>
  ) : null;
};

export default React.memo(Map);
