import express from 'express';
import routes from './routes';
import path from 'path';
import cors from 'cors';

const app = express();

app.use(cors());

app.use(express.json());
app.use(routes);

const server = app.listen(3333, () => console.log('Olhando porta 3333'))

const Http = require('http').Server(server)
const io = require('socket.io')(Http)

app.set('socket', io)

Http.listen(3334, () => {
    console.log(' Olhando porta 3334')
})

