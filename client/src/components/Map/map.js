import React, { useState, useRef, useEffect } from 'react';
import ReactMapGL, {Marker, NavigationControl, FlyToInterpolator, Popup} from 'react-map-gl';
import './map.css';
import { DEFAULT_VIEWPORT, MAPBOX_STYLES } from './constants';
import socketIOClient from "socket.io-client";


const Map = ()=>{

    const [viewport, setViewport] = useState(DEFAULT_VIEWPORT)
    const [mapStyle, setMapStyle] = useState(MAPBOX_STYLES['Satellite'])
    const [mapStyleIcon, showMapStyle] = useState(false)
    const [showPopup, togglePopup] = useState(false);
    const [popup, setPopup] = useState(false);

    // position setting for navigation control
    const navControlStyle = {
        bottom: 10,
        margin: '1.3rem',
        opacity: 0.85,
      };

      useEffect(() => {
        const socket = socketIOClient('http://localhost:3600')

        socket.on('newMessage', data => {
            let newData = JSON.parse(data)
            console.log(newData)

                setViewport({
                    ...viewport,
                    longitude: newData.geometry.coordinates[1],
                    latitude: newData.geometry.coordinates[0]
                })
        })
        
        return () => {
            socket.disconnect()
        }
    },[])

    return(
        <div>
            <div className="sidebar">
                Longitude: {viewport.longitude.toFixed(4)}| Latitude: {' '}
                {viewport.latitude.toFixed(4)}| Zoom: {viewport.zoom.toFixed(2)}
            </div>
            <div className='dashBoard'>
                <h4>Lagos Yellow Bus</h4>
            </div>
            <div>{!mapStyleIcon? 
                <div className='mapStyle-icon' onClick={()=> showMapStyle(true)}><i className="fas fa-folder-open" style={{fontSize:'24px'}}></i></div>:
                <div className='mapStyle'>
                {
                    Object.entries(MAPBOX_STYLES).map((styles, index)=>{
                    return(
                        <button className={styles[1]===mapStyle? styles[0]+' active': styles[0]}
                            style={{cursor: 'pointer'}} 
                            onClick={()=>{
                                setMapStyle(styles[1])
                                showMapStyle(false)
                            }}
                            key={index}
                        >
                        {styles[0]}
                        </button>
                    )
                    })
                }
            </div>
            }</div>

            <ReactMapGL 
            {...viewport}
            mapStyle= {mapStyle}
            mapboxApiAccessToken= "pk.eyJ1Ijoib21vYm9sYWppLWtveWkiLCJhIjoiY2txZm50eWUwMHQ1bzJxcGd1ODBxM2d1bSJ9.HTGUO42-AiI6NwJf-oZ5vw"
            onViewportChange = {(newViewport) => {
                return setViewport({...newViewport})
              }}
              width='100vw'
              height='100vh'
            >
                <Marker key={Math.random()} longitude={viewport.longitude} latitude={viewport.latitude} draggable={true}>
                <div className='train-marker' onClick={()=>{
                    togglePopup((val)=> !val)
                    }}>
                    <i className="fas fa-bus-alt fa-2x" style={{color: 'yellow', cursor:'pointer'}}></i>
                </div>
                </Marker>
                 {showPopup && <Popup 
                    longitude={viewport.longitude} 
                    latitude={viewport.latitude}
                    closeButton = {true}
                    closeOnClick={true}
                    onClose={() => togglePopup(false)}
                    anchor = "bottom"
                >
                    <div>
                        👨: Hello
                    </div>
                </Popup>}
                <NavigationControl style={navControlStyle} />
            </ReactMapGL>
        </div>
    )
}
export default Map