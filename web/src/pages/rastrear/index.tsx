import React, {useEffect, useState} from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../../services/api';
import { useHistory } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import * as L from 'leaflet';

interface Parada {
    id: number;
    latitude: number;
    longitude: number;
    rua: string;
}

interface Linha {
    id: number;
    nome: string;
    numero: number;
    ruas: string;
    Paradas: Parada[];
}

interface ParadaLinha{
    id: number;
    linha_id: number;
    parada_id: number;
    descer: number;
    subir: number;
}

const Linha = (Objeto: any) => {
    const [linha, setLinha] = useState<Linha> ();
    const [paradaSubir, setParadaSubir] = useState<ParadaLinha> ();
    const [paradaDescer, setParadaDescer] = useState<ParadaLinha> ();
    const history = useHistory();

    const id_linha = Objeto.match.params.id_linha;
    const id_paradaLinha_inicial = Objeto.match.params.id_paradaLinha_inicial;
    const id_paradaLinha_final = Objeto.match.params.id_paradaLinha_final;
    
    useEffect(() => {
        api.get('linhas-id/' + id_linha).then(response =>{
            setLinha(response.data.Linhas.Linha);
        })
    }, [id_linha])

    useEffect(() => {
        api.get('buscar/' + id_paradaLinha_inicial).then(response =>{
            setParadaSubir(response.data);
        })
    }, [id_paradaLinha_inicial])

    useEffect(() => {
        api.get('buscar/' + id_paradaLinha_final).then(response =>{
            setParadaDescer(response.data);
        })
    }, [id_paradaLinha_final])

    async function handleClick(e: any, id_paradalinha: number) {
        e.preventDefault();

        const data = {
            id: id_paradalinha
        }

        try {
            await api.post('/limpar/', data);

            alert('Limpou')

            history.go(0);
        }catch(erro) {
            alert(erro)
        }
    }

    const iconMarkupInicial = renderToStaticMarkup(<i id="Inicial" className="fas fa-map-marker-alt fa-3x" />);
    const iconMarkupFinal = renderToStaticMarkup(<i id="Final" className="fas fa-map-marker-alt fa-3x" />);
    
    const customMarkerIconInicial = L.divIcon({
        html: iconMarkupInicial,
    });

    const customMarkerIconFinal = L.divIcon({
        html: iconMarkupFinal,
    });

    return (
        
        <div id="linha">
            <MapContainer id="mapa" center={[-28.6800736, -49.3700013]} zoom={16}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                {linha?.Paradas.map(parada => {
                    if (parada.id === paradaSubir?.parada_id) {
                        return (
                            <Marker key={parada.id} position={[parada.latitude, parada.longitude]} icon={customMarkerIconInicial}>
                                <Popup>
                                    <h4>Pessoas Subindo nesta parada: {paradaSubir?.subir}</h4>
                                    <h4>Pessoas descendo nesta parada: {paradaSubir?.descer}</h4>
                                    <button onClick={(e) => handleClick(e, paradaSubir?.id)}>Limpar ?</button>
                                </Popup>
                            </Marker>
                        )
                    } else{
                        if (parada.id === paradaDescer?.parada_id){
                            return (
                                <Marker key={parada.id} position={[parada.latitude, parada.longitude]} icon={customMarkerIconFinal}>                         
                                    <Popup>
                                        <h4>Pessoas Subindo nesta parada: {paradaDescer?.subir}</h4>
                                        <h4>Pessoas descendo nesta parada: {paradaDescer?.descer}</h4>
                                        <button onClick={(e) => handleClick(e, paradaDescer?.id)}>Limpar ?</button>
                                    </Popup>
                                </Marker>
                            )
                        }else{
                        return (
                            <Marker key={parada.id} position={[parada.latitude, parada.longitude]}>
                            </Marker>
                        )}
                    }
                })}
            </MapContainer>

        </div>
    )
}

export default Linha;