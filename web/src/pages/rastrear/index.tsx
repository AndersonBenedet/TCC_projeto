import React, {useEffect, useState} from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import api from '../../services/api';
import { useHistory } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import * as L from 'leaflet';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
    quantidade: number;
    ordem: number;
}

const Linha = (Objeto: any) => {
    const [linha, setLinha] = useState<Linha> ();
    const [paradas, setParadas] = useState<ParadaLinha[]> ([]);
    const history = useHistory();
    const [open, setOpen] = useState(true);

    const id_linha = Objeto.match.params.id_linha;
    const id_paradaLinha_inicial = Objeto.match.params.id_paradaLinha_inicial;
    const id_paradaLinha_final = Objeto.match.params.id_paradaLinha_final;
    
    useEffect(() => {
        api.get('linhas-id/' + id_linha).then(response =>{
            setLinha(response.data.Linhas.Linha);
        })
    }, [id_linha])

    useEffect(() => {
        api.get('buscar/' + id_linha).then(response =>{
            setParadas(response.data);
        })
    }, [id_linha])

    async function handleClick(e: any, id_paradalinha?: number) {
        e.preventDefault();
        if (id_paradalinha) return 

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

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    return (
        
        <div id="linha">
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth={true}
            >
                
                    <DialogTitle id="alert-dialog-title"> Ola: {"Usuario"} </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Sua Viagem: <br />
                            Linha: <b>{linha?.nome}</b> <br />
                            Onibus: <b>{linha?.numero}</b> <br />
                            Origem: Parada de nr <b>{paradas?.find(busca => busca.parada_id == id_paradaLinha_inicial)?.parada_id}</b> <br />
                            Destino: Parada de nr <b>{paradas?.find(busca => busca.parada_id == id_paradaLinha_final)?.parada_id}</b> <br />
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary" size="large">
                            Ok
                        </Button>
                    </DialogActions>
            </Dialog>

            <MapContainer id="mapa2" center={[-28.6800736, -49.3700013]} zoom={16}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                {linha?.Paradas.map(parada => {
                    var local = paradas?.find(busca => busca.parada_id == parada.id)
                    if(parada.id == id_paradaLinha_inicial){
                        return (
                            <Marker key={parada.id} position={[parada.latitude, parada.longitude]} icon={customMarkerIconInicial}>
                                <Popup>
                                    <h4>Pessoas Subindo nesta parada: {local?.subir}</h4>
                                    <h4>Pessoas descendo nesta parada: {local?.descer}</h4>
                                    <h5>Quantidade: {local?.quantidade}</h5>
                                    <button onClick={(e) => handleClick(e, local?.id)}>Limpar ?</button>
                                </Popup>
                            </Marker>
                        )
                    }else{
                        if (parada.id == id_paradaLinha_final){
                            return (
                                <Marker key={parada.id} position={[parada.latitude, parada.longitude]} icon={customMarkerIconFinal}>                         
                                    <Popup>
                                        <h4>Pessoas Subindo nesta parada: {local?.subir}</h4>
                                        <h4>Pessoas descendo nesta parada: {local?.descer}</h4>
                                        <h5>Quantidade: {local?.quantidade}</h5>
                                        <button onClick={(e) => handleClick(e, local?.id)}>Limpar ?</button>
                                    </Popup>
                                </Marker>
                            )
                        }else{
                            return (
                                <Marker key={parada.id} position={[parada.latitude, parada.longitude]} >                         
                                    <Popup>
                                        <h4>Pessoas Subindo nesta parada: {local?.subir}</h4>
                                        <h4>Pessoas descendo nesta parada: {local?.descer}</h4>
                                        <h5>Quantidade: {local?.quantidade}</h5>
                                        <button onClick={(e) => handleClick(e, local?.id)}>Limpar ?</button>
                                    </Popup>
                                </Marker>
                            )
                        }
                    }
                })}
            </MapContainer>

        </div>
    )
}

export default Linha;