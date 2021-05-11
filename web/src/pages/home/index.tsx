import React, {useEffect, useState} from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

interface PopupParadaProps {
    paradaId: number,
    linhas: Linha[]
}

const PopupParada = ({linhas, paradaId} : PopupParadaProps) => {
    if (linhas.length <= 0) {
        return <Popup>Sem linha cadastrada para esta rua</Popup>
    }

    return (
        <Popup>
            {linhas.map(Linha => (
                    <div key={Linha.id}>
                        <a href={"linha/"+Linha.id+"/"+paradaId}>{Linha.Numero + ':' + Linha.Nome }</a>
                        <br />
                    </div>
                )
            )}
        </Popup>
    )
}

const Home = () => {
    const [paradasLinhas, setParadasLinhas] = useState<ParadaLinha[]> ();

    async function BuscarParadasLinhas(){
        await useEffect(() => {
            api.get('getParadasLinhas').then(response =>{
                try{
                    if (response.data.Paradas && response.data.Paradas !== undefined) setParadasLinhas(response.data.Paradas.ParadaLinha)
                }catch(erro){
                    console.log(erro)
                }
            })
            .catch((err) => {
                console.log(err);
            })
        }, [])
    }

    BuscarParadasLinhas();

    return (
        <div id="Home">
            <a href="/create-parada">
                Criar parada
            </a>
            <br />
            <a href="/cadastro-motorista">
                Criar Motorista
            </a>

            <MapContainer id="mapa" center={[-28.6800736, -49.3700013]} zoom={16}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                {paradasLinhas?.map(Parada => (
                        <Marker key={Parada.id} position={[Parada.latitude, Parada.longitude]}>
                           <PopupParada linhas={Parada.Linha} paradaId={Parada.id}></PopupParada>
                        </Marker>   
                    ))}

            </MapContainer>

        </div>
    )
}

export default Home;