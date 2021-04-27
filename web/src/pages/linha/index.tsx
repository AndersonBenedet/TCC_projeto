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

const Linha = (Objeto: any) => {
    const [linha, setLinha] = useState<Linha> ();
    const history = useHistory();

    const id_linha = Objeto.match.params.id;
    const id_parada_inicial = Objeto.match.params.parada;
    
    useEffect(() => {
        api.get('linhas-id/' + id_linha).then(response =>{
            setLinha(response.data.Linhas.Linha);
        })
    }, [id_linha])

    const iconMarkupInicial = renderToStaticMarkup(<i id="Inicial" className="fas fa-map-marker-alt fa-3x" />);
    
    const customMarkerIconInicial = L.divIcon({
        html: iconMarkupInicial,
    });

    async function handleClick(e: any, linhaId: number, paradaId: number) {
        e.preventDefault();

        const dataSubir = {
            linhaId: linhaId,
            paradaId: id_parada_inicial
        }

        const dataDescer = {
            linhaId: linhaId,
            paradaId: paradaId
        }

        try {
            var subir = await api.post('/subir/', dataSubir);
            var descer = await api.post('/descer/', dataDescer);

            history.push('/rastrear/'+linhaId+"/"+subir.data.id+"/"+descer.data.id)
        }catch(erro) {
            alert(erro)
        }
    }

    return (
        
        <div id="linha">
            <h2>{linha?.numero + ': ' + linha?.nome}</h2>
            <h3>Intinerario: {linha?.ruas}</h3>

            <MapContainer id="mapa" center={[-28.6800736, -49.3700013]} zoom={16}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                {linha?.Paradas.map(parada => {
                    if (parada.id === id_parada_inicial) {
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
                                <button onClick={(e) => handleClick(e, linha.id, parada.id)}>Deseja Descer nesta parada ?</button>
                            </Popup>
                        </Marker>
                    )}
                })}
            </MapContainer>

        </div>
    )
}

export default Linha;