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
  // Agora o TS sabe que `res.socket.server.io` pode existir
  if (!res.socket.server.io) {
    console.log('🔌 Inicializando Socket.io…')
    const io = new IOServer(res.socket.server, { path: '/api/socket' })
    res.socket.server.io = io

    io.on('connection', socket => {
      console.log('🔗 Cliente conectado:', socket.id);

      // Receber mensagens do cliente
      socket.on('chat:message', (msg: string) => {
        console.log('📨 Mensagem no servidor:', msg);
        io.emit('chat:message', msg);
      });

      // Enviar mensagens automáticas do time
      const welcomeMessage = {
        user: 'FURIA Bot',
        msg: 'Bem-vindo ao chat oficial da FURIA! Acompanhe as novidades do time aqui.',
      };
      socket.emit('chat:message', welcomeMessage);

      // Simular interações de torcida
      setInterval(() => {
        io.emit('chat:message', {
          user: 'Torcedor',
          msg: 'Vamos FURIA! Rumo à vitória! 🔥',
        });
      }, 15000);

      // Atualizações ao vivo de jogos
      setTimeout(() => {
        io.emit('chat:message', {
          user: 'FURIA Bot',
          msg: 'Placar ao vivo: FURIA 1 x 0 Team Liquid',
        });
      }, 30000);
    });
  }

  res.end();
}
