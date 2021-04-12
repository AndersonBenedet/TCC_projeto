import React, {useEffect, useState} from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import api from '../../services/api';
import NodeGeocoder from 'node-geocoder'

interface Parada{
    id: number,
    latitude: number,
    longitude: number
}

const Home = () => {
    const [paradas, setParadas] = useState<Parada[]> ([]);
    const [error, setError] = useState();

    useEffect(() => {
        api.get('paradaAll').then(response =>{
            setParadas(response.data.parada);
        })
        .catch((err) => {
          setError(err);
        })
    }, [])

    //const geocoder = NodeGeocoder();

    //const res = geocoder.reverse({ lat: 45.767, lon: 4.833 });

    //console.log(res);

    return (
        <div id="Home">
            <a href="/create-parada">
                Criar parada
            </a>

            <MapContainer id="mapa" center={[-28.6800736, -49.3700013]} zoom={16}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                 {paradas.map((item: Parada) => (
                    <Marker key={item.id} position={[item.latitude, item.longitude]} >
                        <Popup>
                            
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                 ))}

            </MapContainer>
        </div>
    )
}

export default Home;