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

const Linha = (Objeto: any) => {
    const [linha, setLinha] = useState<Linha> ();
    const [paradaFinal, setparadaFinal] = useState(0);
    const [open, setOpen] = useState(false);
    const history = useHistory();

    const id_linha = Objeto.match.params.id;
    const id_parada_inicial = Objeto.match.params.parada;
    const iconMarkupInicial = renderToStaticMarkup(<i id="Inicial" className="fas fa-map-marker-alt fa-3x" />);
    
    useEffect(() => {
        api.get('linhas-id/' + id_linha).then(response =>{
            setLinha(response.data.Linhas.Linha);
        })
    }, [id_linha])

    const customMarkerIconInicial = L.divIcon({
        html: iconMarkupInicial,
    });

    async function handleClick(e: any, paradaId: number) {
        e.preventDefault();
        setparadaFinal(paradaId)
        handleClickOpen();
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    async function handleConfirmar(){
        const data = {
            linhaId: linha?.id,
            paradaIdSubir: id_parada_inicial,
            paradaIdDescer: paradaFinal
        }

        try{

            var controle = await api.post('/controle/', data);

            history.push('/rastrear/'+linha?.id+"/"+controle.data.paradaLinhaInicial+"/"+controle.data.paradaLinhaFinal)
        }catch(erro) {
            alert(erro)
        }

        setOpen(false);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

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
                                <button onClick={(e) => handleClick(e, parada.id)}>Deseja Descer nesta parada ?</button>
                            </Popup>
                        </Marker>
                    )}
                })}
            </MapContainer>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title"> Parada final definida </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Deseja confirmar a rota ?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Não
                    </Button>
                    <Button onClick={handleConfirmar} color="primary" autoFocus>
                        Sim
                    </Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}

export default Linha;