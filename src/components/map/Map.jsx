import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import moment from 'moment-timezone';
import Link from 'next/link';
import React, { useState } from 'react';
import styles from '../../styles/Map.module.css';

const InfoBox = function InfoBox(props) {
  const { feature } = props;
  const id = feature.getProperty('buskerId');
  const name = feature.getProperty('name');
  const buskerId = feature.getProperty('buskerId');
  const buskerName = feature.getProperty('buskerName');
  const photos = feature.getProperty('photos');
  const starts = new Date(feature.getProperty('starts'));
  const time = moment(starts);
  return (
    <article className={styles.infobox}>
      <img className={styles.infoPhoto} src={photos[0]} alt={name}/>
      <div className={styles.infoDetails}>
        <div className={styles.infoboxName}>
          <span className={styles.infoboxTime}>
            {time.format('h:mm A')}
          </span>
          <Link href={`/event/${id}`}>
            {name}
          </Link>
        </div>
        <div className={styles.infoboxBuskerName}>
          <span className={styles.infoboxTime}>
            {time.format('MMM DDD YYYY')}
          </span>
          <Link href={`/profile/${buskerId}`}>{buskerName}</Link>
        </div>
      </div>
    </article>
  );
};

/**
* @param {Object} props
* @param {React.CSSProperties} props.containerStyle
* @param {google.maps.LatLngLiteral} props.center
* @param {(google.maps.LatLngLiteral) => void=} props.onDrop
*/
const Map = function Map({ containerStyle, center, onDrop }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_KEY,
    googleMapsClientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT,
    version: 3,
  });
  const [infoFeature, setInfoFeature] = useState(null);
  const onLoad = React.useCallback((/** @type {google.maps.Map} */ map) => {
    /* eslint-disable-next-line no-new */
    new google.maps.Marker({
      map,
      position: center,
      title: 'You are here',
      icon: {
        fillColor: '#ff7585',
        fillOpacity: 1,
        path: google.maps.SymbolPath.CIRCLE,
        strokeColor: '#ff7585',
        scale: 5,
      },
    });

    if (onDrop === undefined) {
      map.data.loadGeoJson(`/api/events?features=coords,photos&lat=${center.lat}&lng=${center.lng}`, { idPropertyName: 'storeid' });
    }
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
  }, [center, onDrop]);

  // style={{ width: '100vw', height: '100vh' }}>
  return isLoaded ? (
    <div className={styles.mapContainer}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
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
