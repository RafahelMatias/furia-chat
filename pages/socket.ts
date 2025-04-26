import { Server as IOServer } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { Server as HTTPServer } from 'http';

// Estender o tipo de res.socket para incluir a propriedade server
type CustomSocket = {
  server: HTTPServer & {
    io?: IOServer;
  };
};

type CustomNextApiResponse = NextApiResponse & {
  socket: CustomSocket;
};

export default function handler(req: NextApiRequest, res: CustomNextApiResponse) {
  if (!res.socket.server.io) {
    console.log('🔧 Iniciando servidor Socket.IO...');
    const io = new IOServer(res.socket.server, {
      path: '/api/socket',
    });
    res.socket.server.io = io;

    io.on('connection', socket => {
      console.log('🔗 Cliente conectado:', socket.id);

      // Receber mensagens do cliente
      socket.on('chat:message', ({ user, msg }: { user: string; msg: string }) => {
        console.log(`↩️ Mensagem de ${user}:`, msg);
        io.emit('chat:message', { user, msg });
      });

      // Enviar mensagens automáticas do time
      const welcomeMessage = {
        user: 'FURIA Bot',
        msg: 'Bem-vindo ao chat oficial da FURIA! Acompanhe as novidades do time aqui.',
      };
      socket.emit('chat:message', welcomeMessage);

      // Exemplo de mensagem automática após 10 segundos
      setTimeout(() => {
        io.emit('chat:message', {
          user: 'FURIA Bot',
          msg: 'Próximo jogo: FURIA vs. Team Liquid - Hoje às 18h!',
        });
      }, 10000);
    });
  } else {
    console.log('✅ Servidor Socket.IO já iniciado.');
  }

  res.end();
}