import React from 'react'
import {
    GoogleMap,
    LoadScript,
    Autocomplete,
    Marker,
    InfoWindow
} from '@react-google-maps/api';

const Map = props => (
    <LoadScript
        id="script-loader"
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_APIKEY}
        libraries={["drawing", "places"]}
    >
        <GoogleMap
            mapContainerStyle={props.containerStyle}
            center={props.center}
            height={props.height}
            zoom={props.zoom}
        >
            <Autocomplete
                onLoad={props.autoCompleteLoad}
                onPlaceChanged={props.placeChanged}
            >
                <input
                    type="text"
                    placeholder="Enter your address"
                    style={props.autoCompleteStyle}
                />
            </Autocomplete>
            {props.address &&
                <InfoWindow
                    position={{
                        lat: (props.markerPosition.lat + 0.0018),
                        lng: props.markerPosition.lng
                    }}
                >                
                    <span style={{ padding: 0, margin: 0 }}>
                        {props.address}
                    </span>
                </InfoWindow>
            }
            <Marker
                onLoad={props.markerLoad}
                position={props.markerPosition}
                draggable={props.draggable}
                onDragEnd={props.markerDragged}
            />
        </GoogleMap>
    </LoadScript>
);

export default Map