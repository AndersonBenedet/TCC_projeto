import React, {useEffect, useState} from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import api from '../../services/api';

interface Linha {
    id: number;
    Nome: string;
    Numero: number;
    Rua: string;
}

interface ParadaLinha {
        id: number,
        latitude: number,
        longitude: number,
        Linha: Linha[]
}

const Home = () => {
    const [error, setError] = useState();
    const [paradasLinhas, setParadasLinhas] = useState<ParadaLinha[]> ();

    async function BuscarParadasLinhas(){
        await useEffect(() => {
            api.get('getParadasLinhas').then(response =>{
                try{
                    if (response.data.Paradas && response.data.Paradas != undefined) setParadasLinhas(response.data.Paradas.ParadaLinha)
                }catch(erro){
                    console.log(erro)
                }
            })
            .catch((err) => {
            setError(err);
            })
        }, [])
    }

    BuscarParadasLinhas();

    return (
        <div id="Home">
            <a href="/create-parada">
                Criar parada
            </a>

            <MapContainer id="mapa" center={[-28.6800736, -49.3700013]} zoom={16}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                {paradasLinhas?.map(Parada => (
                        <Marker key={Parada.id} position={[Parada.latitude, Parada.longitude]}>
                            <Popup>
                                {Parada.Linha.map(Linha => (
                                        <div key={Linha.id}>
                                            <a href={"linha/"+Linha.id+"/"+Parada.id}>{Linha.Numero + ':' + Linha.Nome + " 46" }</a>
                                            <br />
                                        </div>
                                    )
                                )}
                            </Popup>
                        </Marker>   
                    ))}

            </MapContainer>

        </div>
    )
}

export default Home;