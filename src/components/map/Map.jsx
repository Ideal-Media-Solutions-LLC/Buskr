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

/**
* @param {Object} props
* @param {React.CSSProperties} props.containerStyle
* @param {google.maps.LatLngLiteral} props.center
* @param {'view' | 'create'} props.mode
* @param {(google.maps.LatLngLiteral) => void=} props.onDrop
*/
const Map = function Map({ containerStyle, center, mode, onDrop }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    googleMapsClientId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_CLIENT_ID,
    version: 3,
  });
  const [infoFeature, setInfoFeature] = useState(null);
  const onLoad = React.useCallback((/** @type {google.maps.Map} */ map) => {
    /* eslint-disable-next-line no-new */
    new google.maps.Marker({
      position: center,
      map,
      title: 'You are here',
      icon: {
        path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
        scale: 5,
      },
    });

    map.addListener('click', ({ latLng: { lng, lat } }) => {
      setInfoFeature(null);

      const center = { lat: lat(), lng: lng() };

      if (map.currentMarker) {
        map.currentMarker = new google.maps.Marker({
          position: center,
          map,
          draggable: true,
        });
      } else {
        map.currentMarker.setPosition(center);
      }

      onDrop(center);
    });

    map.data.addListener('click', ({ feature }) => {
      setInfoFeature(feature);
    });
    if (mode === 'view') {
      map.data.loadGeoJson('/sample_events.json', { idPropertyName: 'storeid' });
    }
  }, [center, mode, onDrop]);

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
    {mode === 'view' && infoFeature && <InfoBox feature={infoFeature} />}
    </GoogleMap>
    </div>
  ) : null;
};

export default React.memo(Map);
