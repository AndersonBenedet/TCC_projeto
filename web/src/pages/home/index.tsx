import React, {useEffect, useState} from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import api from '../../services/api';

interface Parada{
    id: number,
    latitude: number,
    longitude: number,
    rua: string
}

interface linhas{
    Nome: string,
    Numero: number,
    Rua: string,
    id: number
}

const Home = () => {
    const [paradas, setParadas] = useState<Parada[]> ([]);
    const [linha, setLinha] = useState([]);
    const [error, setError] = useState();

    useEffect(() => {
        api.get('paradaAll').then(response =>{
            setParadas(response.data.parada);
        })
        .catch((err) => {
          setError(err);
        })
    }, [])

    async function BuscaLinhas(rua: string){
        await useEffect(() => {
            api.get('linhas/' + rua).then(response =>{
                setLinha(response.data.linhas);
            })
            .catch((err) => {
              setError(err);
            })
        }, [])
    }

    BuscaLinhas('Rua Visconde de Cairu');

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
                            {linha.map((li: linhas) => (
                                <div key={li.id} >
                                    <a href={"linha/"+li.Rua}>{li.Numero}</a>
                                    <br />
                                </div>
                            ))}
                        </Popup>
                    </Marker>
                 ))}

            </MapContainer>
        </div>
    )
}

export default Home;