import React, {useEffect, useState} from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import api from '../../services/api';
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

const Linha = (Objeto: any) => {
    const [linha, setLinha] = useState<Linha> ();
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [customMarkerIconFinalState, setcustomMarkerIconFinalState] = useState()

    const id_linha = Objeto.match.params.id;
    const id_parada_inicial = Objeto.match.params.parada;
    
    useEffect(() => {
        api.get('linhas-id/' + id_linha).then(response =>{
            setLinha(response.data.Linhas.Linha);
        })
    }, [])

    const iconMarkupInicial = renderToStaticMarkup(<i id="Inicial" className="fas fa-map-marker-alt fa-3x" />);
    const iconMarkupFinal = renderToStaticMarkup(<i id="Final" className="fas fa-map-marker-alt fa-2x" />);
    
    const customMarkerIconInicial = L.divIcon({
        html: iconMarkupInicial,
    });

    const customMarkerIconFinal = L.divIcon({
        html: iconMarkupFinal,
    });

    return (
        
        <div id="linha">
            <h2>{linha?.numero + ': ' + linha?.nome}</h2>
            <h3>Intinerario: {linha?.ruas}</h3>

            <MapContainer id="mapa" center={[-28.6800736, -49.3700013]} zoom={16}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                {linha?.Paradas.map(parada => {
                    if (parada.id == id_parada_inicial) {
                        return (
                            <Marker key={parada.id} position={[parada.latitude, parada.longitude]} icon={customMarkerIconInicial}>
                                <Popup>
                                    <h4>Ponto inicial</h4>
                                </Popup>
                            </Marker>
                        )
                    } else{
                        return (
                        <Marker key={parada.id} position={[parada.latitude, parada.longitude]}>                         
                            <Popup>
                                <a href={"/rastrear/" + id_parada_inicial + "/" + parada.id + "/" + linha.id}>
                                    <button>Deseja Descer nesta parada ?</button>
                                </a>
                            </Popup>
                        </Marker>
                    )}
                })}
            </MapContainer>

        </div>
    )
}

export default Linha;