/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React from 'react';
import { func, string, number, shape, arrayOf } from 'prop-types';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import { getColor } from '../Sidebar';
import mapStyle from './mapStyle';
import { FONT_FAMILY } from '../../styleConstants';

const Icon = (available, active) => {
  const encoded =
    window &&
    window.btoa(`
      <svg style="color: white;" width="40" height="40" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="-7 -7 14 14">
        <circle r="5.5" stroke="${
          active ? 'red' : 'transparent'
        }" strokeWidth="2" fill="transparent" />
        <circle r="4.5" fill="white" />
        <circle r="4" fill="${getColor(available)}" />
      </svg>
    `);
  return `data:image/svg+xml;base64,${encoded}`;
};

const Map = withScriptjs(
  withGoogleMap(({ racks, activeId, position, onDragEnd, onRackInteract }) => {
    const refs = {
      map: undefined,
    };
    return (
      <GoogleMap
        defaultZoom={14}
        defaultCenter={{ lat: position.lat, lng: position.lng }}
        defaultOptions={{
          styles: mapStyle,
          backgroundColor: 'black',
          streetViewControl: false,
          mapTypeControlOptions: {
            mapTypeIds: [],
          },
        }}
        onDragEnd={() => {
          const lat = refs.map.getCenter().lat();
          const lng = refs.map.getCenter().lng();
          return onDragEnd({ lat, lng });
        }}
        ref={map => {
          if (map) {
            refs.map = map;
            map.panTo({ lat: position.lat, lng: position.lng });
          }
        }}
      >
        {racks.map(rack => (
          <Marker
            key={rack.id}
            labelColor="white"
            label={{
              text: rack.bikesAvail.toString(),
              color: 'white',
              fontFamily: FONT_FAMILY,
              fontSize: '12px',
            }}
            icon={Icon(rack.bikesAvail, activeId === rack.id)}
            position={{ lat: rack.lat, lng: rack.lon }}
            onMouseOver={event => onRackInteract(rack.id, 'mouseover', event)}
            onMouseOut={event => onRackInteract(rack.id, 'mouseout', event)}
            onClick={event => onRackInteract(rack.id, 'click', event)}
          />
        ))}
      </GoogleMap>
    );
  }),
);

Map.propTypes = {
  racks: arrayOf(
    shape({
      id: string,
      stopCode: string,
      name: string,
      lat: number,
      lon: number,
      bikesAvail: number,
      slotsTotal: number,
    }),
  ),
  activeId: string,
  position: shape({
    lat: number,
    lng: number,
  }).isRequired,
  onDragEnd: func.isRequired,
  onRackInteract: func.isRequired,
};

Map.defaultProps = {
  racks: [],
  activeId: null,
};

export default Map;
