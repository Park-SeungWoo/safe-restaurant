import React from 'react';
import {StyleSheet, Dimensions, View} from 'react-native';
import PropTypes from 'prop-types';
import MapView, {Marker} from 'react-native-maps';

let pwidth = Dimensions.get('window').width;
let pheight = Dimensions.get('window').height;

MapApp.propTypes = {
  lat: PropTypes.number.isRequired,
  long: PropTypes.number.isRequired,
};

function MapApp({lat, long}) {
  return (
    <MapView
      style={styles.map}
      region={{
        latitude: lat,
        longitude: long,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009,
      }}>
      <Marker
        coordinate={{latitude: lat, longitude: long}}
        title={'current'}
        description={'current position'}
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: pwidth,
    height: pheight,
    position: 'absolute',
    zIndex: 0,
  },
});

export default MapApp;
