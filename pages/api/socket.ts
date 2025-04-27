// pages/api/socket.ts
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as HttpServer }      from 'http'
import { Socket as NetSocket }       from 'net'
import { Server as IOServer }        from 'socket.io'

// Extende o NextApiResponse para incluir `socket.server.io`
type NextApiResponseWithIO = NextApiResponse & {
  socket: NetSocket & { server: HttpServer & { io?: IOServer } }
}

export const config = { api: { bodyParser: false } }

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithIO
) {
  if (!res.socket.server.io) {
    console.log('🔌 Inicializando Socket.io…')
    const io = new IOServer(res.socket.server, { path: '/api/socket' })
    res.socket.server.io = io

    // Variáveis para o placar e rounds
    let furiaScore = 1;
    let opponentScore = 0;
    let round = 1;

    io.on('connection', socket => {
      console.log('🔗 Cliente conectado:', socket.id);

      // Receber mensagens do cliente
      socket.on('chat:message', (msg: string) => {
        console.log('📨 Mensagem no servidor:', msg);
        io.emit('chat:message', msg);
      });

      // Enviar mensagem de boas-vindas
      const welcomeMessage = {
        user: 'FURIA Bot',
        msg: 'Bem-vindo ao chat oficial da FURIA! Acompanhe as novidades do time aqui.',
      };
      socket.emit('chat:message', welcomeMessage);
    });

    // Simular interações de torcida (serão emitidas apenas uma vez para todos)
    setInterval(() => {
      io.emit('chat:message', {
        user: 'Torcedor',
        msg: 'Vamos FURIA! Rumo à vitória! 🔥',
      });
    }, 40000);

    setInterval(() => {
      io.emit('chat:message', {
        user: 'Torcedor',
        msg: 'Vamos, para cima deles!',
      });
    }, 50000);

    setInterval(() => {
      io.emit('chat:message', {
        user: 'Torcedor',
        msg: 'Vamoss!',
      });
    }, 75000);

    setInterval(() => {
      io.emit('chat:message', {
        user: 'Torcedor',
        msg: 'Alguem sabe o placar?',
      });
    }, 100000);

    setInterval(() => {
      io.emit('chat:message', {
        user: 'Torcedor',
        msg: `Está FURIA ${furiaScore} x ${opponentScore} Team Liquid`,	
      });
    }, 105000);

    // Atualizações ao vivo do placar com rounds - atualizando a cada 10 segundos
    setInterval(() => {
      const atualizar = Math.random() < 0.40; // 40% de chance de atualizar o placar
      if (atualizar) {
        // FURIA sempre marca um ponto
        furiaScore++;
        // Com 40% de chance, o adversário marca um ponto (se ainda estiver abaixo de FURIA)
        if (Math.random() < 0.4 && opponentScore < furiaScore) {
          opponentScore++;
        }
        round++; // Incrementa o número do round quando há atualização
      }
      io.emit('chat:message', {
        user: 'FURIA Bot',
        msg: `Round ${round}: Placar ao vivo: FURIA ${furiaScore} x ${opponentScore} Team Liquid`
      });
    }, 90000);
  }

  res.end();
}
