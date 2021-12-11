import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import Image from 'next/image';
import styles from '../../styles/map.module.css';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lng: -90.06911208674771,
  lat: 29.954767355989652,
};

const InfoBox = function InfoBox(props) {
  const { feature } = props;
  const buskerName = feature.getProperty('buskerName');
  const eventName = feature.getProperty('eventName');
  const eventPicture = feature.getProperty('eventPicture');
  const eventDate = feature.getProperty('eventDate');
  const eventDescription = feature.getProperty('eventDescription');
  return (
    <article id={styles.infobox}>
      <figure >
          <Image
          // className={styles.infoboxImage}
          width='100px'
          height='100px'
          src={eventPicture}
          alt={eventName}
          />
          </figure>
          <figcaption>{`${eventName}\n${buskerName}`}</figcaption>
    </article>
  );
};

const Map = function Map() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    googleMapsClientId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_CLIENT_ID,
    version: 3,
  });

  const [infoFeature, setInfoFeature] = useState(null);

  const onLoad = React.useCallback((/** @type {google.maps.Map} */ map) => {
    new google.maps.Marker({
      position: center,
      map,
      title: 'You are here',
    }).setMap(map);

    map.addListener('click', (/* { latLng: { lng, lat } } */) => {
      setInfoFeature(null);
      /*
      const center = { lat: lat(), lng: lng() };

      new google.maps.Marker({
        position: center,
        map,
        title: 'Hello World!',
      }).setMap(map);
      */
    });

    map.data.addListener('click', ({ feature }) => {
      setInfoFeature(feature);
    });
    map.data.loadGeoJson('/sampleEvents.json', { idPropertyName: 'storeid' });
  }, []);

  // style={{ width: '100vw', height: '100vh' }}>
  return isLoaded ? (
    <div style={{ height: '100vh' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={17}
        onLoad={onLoad}
        options={{ mapId: 'c4f800a3ac3629c2' }}
      >
        {infoFeature && <InfoBox feature={infoFeature} />}
      </GoogleMap>
    </div>
  ) : null;
};

export default React.memo(Map);
