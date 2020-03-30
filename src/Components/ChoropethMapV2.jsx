import React, {useState} from "react";
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { MagicSpinner } from "react-spinners-kit";

function ChoropethMap({center, zoom, data, fillColor, borderColor}) {
    //let _message = 'El tipo del parametro data es requerido y debe ser de tipo .json, con estructura geometrica (geojson).';
    const _center = center? center : [20.678416, -101.354231];
    const _zoom = zoom? zoom : 12;
    const _data = data ? data : null;
    const flag = Object.keys(_data).length === 0 ? false : true; 
    const _fillColor = fillColor? fillColor : '#F28F3B';
    const _borderColor = borderColor? borderColor : 'White';

    const [prop, setProp] = useState({'nom_mun':'','cve_mun':''});

    const style = {
        fillColor: _fillColor,
        weight: 2,
        opacity: 1,
        color: _borderColor,
        dashArray: '3',
        fillOpacity: 0.5
    }

    const highlightFeature = (e) =>{
        //Aqui ponemos la configuracion para resaltar el Feture en donde esta el mouse.
        var layer = e.target;
        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });
        console.log("highlightFeature",layer);
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
        setProp({
            'nom_mun':e.target.feature.properties.nom_mun,
            'cve_mun':e.target.feature.properties.cve_mun
        });
    }

    const clickFeature = (e) =>  {
        //Aqui configuramos lo que queremos que haga un feature cuando le den click.
        alert(e.target.feature.properties.nom_mun);
    }


    const resetHighlight = (e) => {
        //Con esto reseteamos el color en donde paso el mouse, para que no siga marcado.
        var layer = e.target;
        layer.setStyle(style);
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    const onEachFeature = (feature, layer) => {
        //Organizamos los eventos del GeoJson.
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: clickFeature
        });
    }

    var geojson = (
        <GeoJSON onEachFeature={onEachFeature} style={style} key={"1"} data={_data}></GeoJSON>
    )

    return (
        <>
        {
            flag ?
            <Map zoom={_zoom} center={_center} style={{ width: '100%', height: '100vh'}}>
                
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <div className="leaflet-control-container">
                <div className="leaflet-top leaflet-right">
                    <div className="leaflet-control" style={{
                        'padding': '6px 8px',
                        'font': '14px/16px Arial, Helvetica, sans-serif',
                        'background': 'rgba(255,255,255,0.8)',
                        'boxShadow': '0 0 15px rgba(0,0,0,0.2)',
                        'bordeRadius': '5px',
                    }}>
                            <h4>Nombre y Clave del Estado:</h4>
                            {(prop.nom_mun !== '') ?
                            <>
                            <b>{prop.nom_mun }</b> {prop.cve_mun} <br></br>   
                            </>
                            : <b> Pase el mouse sobre un estado</b> }
                    </div>
                </div>
                </div>
                {geojson}
            </Map>
            : 
            
            <div style={{
                'height': '500pt',
                'display': 'flex',
                'justifyContent': 'center',
                'alignItems': 'center'
              }}>
                <MagicSpinner size={70} color={"#008000"} loading={true}></MagicSpinner>
            </div>
        }
        </> 
    );
}

export default ChoropethMap;