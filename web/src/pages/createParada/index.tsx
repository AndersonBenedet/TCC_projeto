import React, {useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios';

interface Parada{
    id: number,
    latitude: number,
    longitude: number
}

interface Adress{
    address: 
        {
            road: '', 
            suburb: '', 
            city: ''
        }
    category: '',
    name: ''
}

const CreateParada = () => {
    const [AreaSelecionada, setAreaSelecionada] = useState<[number, number]>([0, 0]);
    const [AreaInicial, setAreaInicial] = useState<[number, number]>([0, 0]);
    const [paradas, setParadas] = useState<Parada[]> ([]);
    const [error, setError] = useState();
    const [ruas, setRuas] = useState<Adress> ();
    const history = useHistory();
    
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords;

            setAreaInicial([latitude, longitude])
        })
    }, [])

    useEffect(() => {
        api.get('paradaAll').then(response =>{
            setParadas(response.data.parada);
        })
        .catch((err) => {
          setError(err);
        })
    }, [])

    async function getEndereco(lat: number, lon: number) {
		const apiNominatim = axios.create({
			baseURL: 'https://nominatim.openstreetmap.org'
		})

		await apiNominatim.get(`/reverse?format=jsonv2&lat=${lat}6&lon=${lon}`).then(response =>{
			setRuas(response.data);
		})
		.catch((err) => {
			return(err);
		})
	}

    function Markers(){
        const map = useMapEvents({
            click(e) {
                setAreaSelecionada([
                    e.latlng.lat,
                    e.latlng.lng,
                ])
                map.flyTo(e.latlng, map.getZoom())
                getEndereco(e.latlng.lat, e.latlng.lng)
            }
        })
    
        return (
            AreaSelecionada[0] !== 0 ? 
                <Marker 
                    position={[AreaSelecionada[0], AreaSelecionada[1]]}
                    />
    
                : null
        )   
    }

    async function handleSubmit(){
        const [latitude, longitude] = AreaSelecionada;
        const rua = ruas?.address.road

        const data = {
            longitude,
            latitude,
            rua
        }

        try {
            console.log(data);

            await api.post('parada', data);

            alert('Parada cadastrada')

            history.push('/')
        }catch(erro) {
            alert(erro)
        }
    }

    return (
            <div id="create-parada">
                <Link to="/">
                    Voltar
                </Link>

                <form onSubmit={handleSubmit}>
                    <h3>Cadastro de parada</h3>
                    <fieldset>
                        <h4>Endereço</h4>
                        <span>Selecione o local do mapa</span>
                        <MapContainer id="mapa" center={[-28.6800736, -49.3700013]} zoom={16}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Markers />
                            {paradas.map((item) => (
                                <Marker key={item.id} position={[item.latitude, item.longitude]} />
                            ))}
                        </MapContainer>
                        
                    </fieldset>
                    <input type="submit" />
                </form>
            </div>
        )
}

export default CreateParada;