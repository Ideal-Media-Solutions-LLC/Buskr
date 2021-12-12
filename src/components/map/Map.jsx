import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import styles from '../../styles/map.module.css';

const InfoBox = function InfoBox(props) {
  const { feature } = props;
  const buskerName = feature.getProperty('buskerName');
  const name = feature.getProperty('name');
  const photos = feature.getProperty('photos');
  const starts = feature.getProperty('starts');
  const description = feature.getProperty('description');
  return (
    <article className={styles.infobox}>
          <img className={styles.infoPhoto} src={photos[0]} alt={name}/>
          <div className={styles.infoDetails}>
            <div className={styles.infoBoxName}>{name}</div>
            <div className={styles.infoBoxBuskerName}>{buskerName}</div>
          </div>
    </article>
  );
};

const MapWithLessStuff = function MapWithLessStuff({ containerStyle, center }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    googleMapsClientId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_CLIENT_ID,
    version: 3,
  });

  // const [position, setPosition] = useState(center);
  // const [visible, setVisible] = useState(false);

  const onLoad = React.useCallback((/** @type {google.maps.Map} */ map) => {
    // const pin = new google.maps.Marker({
    //   position: center,
    //   map,
    //   draggable: true,
    // }).setMap(map);

    // map.addListener('drag', () => {
    //   console.log(pin.getPosition());
    // });
  }, []);

  // style={{ width: '100vw', height: '100vh' }}>
  return isLoaded ? (
    <div className={styles.mapContainer}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={17}
        onLoad={onLoad}
        options={{ mapId: 'c4f800a3ac3629c2' }}
      >
      </GoogleMap>
    </div>
  ) : null;
};

const Map = function Map({ containerStyle, center, withInfoBoxes }) {
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
    map.data.loadGeoJson('/sample_events.json', { idPropertyName: 'storeid' });
  }, []);

  // style={{ width: '100vw', height: '100vh' }}>
  return isLoaded ? (
    <div className={styles.mapContainer}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={17}
        onLoad={onLoad}
        options={{ mapId: 'c4f800a3ac3629c2' }}
      >
        {withInfoBoxes && infoFeature && <InfoBox feature={infoFeature} />}
      </GoogleMap>
    </div>
  ) : null;
};

export default React.memo(Map);
export { MapWithLessStuff };
