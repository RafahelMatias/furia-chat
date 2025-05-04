/*
  Este arquivo configura o servidor de WebSocket usando Socket.IO no Next.js.
  
  Funcionalidades:
  1) Inicializa o Socket.IO uma única vez na instância do servidor.
  2) Simula interações de torcida e atualizações de placar para um jogo.
  3) Recebe e retransmite mensagens dos clientes (aceitando tanto strings quanto objetos com usuário e mensagem).

  Nota:
  - As simulações (torcida e placar) são executadas periodicamente via setInterval.
  - A rota desabilita o body parser do Next.js para melhor compatibilidade com o Socket.IO.
*/

import { NextApiRequest, NextApiResponse } from 'next'
import { Server as HttpServer } from 'http'
import { Socket as NetSocket } from 'net'
import { Server as IOServer } from 'socket.io'

type NextApiResponseWithIO = NextApiResponse & {
  socket: NetSocket & { server: HttpServer & { io?: IOServer } }
}

export const config = { api: { bodyParser: false } }

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithIO
) {
  // Só inicializa o Socket.IO se ainda não estiver ativo
  if (!res.socket.server.io) {
    console.log('🔌 Inicializando Socket.io…')
    const io = new IOServer(res.socket.server, { path: '/api/socket' })
    res.socket.server.io = io

    // Variáveis para simular o placar
    let furiaScore = 1
    let opponentScore = 0
    let round = 1

    // Lida com a conexão de um novo cliente
    io.on('connection', socket => {
      console.log('🔗 Cliente conectado:', socket.id)

      // Boas-vindas imediata ao conectar
      socket.emit('chat:message', {
        user: 'FURIA Bot',
        msg: 'Bem-vindo ao chat oficial da FURIA! Acompanhe as novidades do time aqui.'
      })


      // Recebe e retransmite mensagens dos clientes.
      // Aceita mensagem como string ou objeto com "user" e "msg".
      socket.on(
        'chat:message',
        (data: string | { user: string; msg: string }) => {
          if (typeof data === 'string') {
            console.log('📨 Mensagem do usuário:', data)
            io.emit('chat:message', { user: 'Usuário', msg: data })
          } else {
            console.log(`↩️ Mensagem de ${data.user}:`, data.msg)
            io.emit('chat:message', { user: data.user, msg: data.msg })
          }
        }
      )
    })

    // Simulações de torcida
    // A cada intervalo definido, disparar mensagens automáticas de torcida.
    setInterval(() => {
      io.emit('chat:message', {
        user: 'Torcedor',
        msg: 'Vamos FURIA! Rumo à vitória! 🔥'
      })
    }, 40000)

    setInterval(() => {
      io.emit('chat:message', {
        user: 'Torcedor',
        msg: 'Vamos, para cima deles!'
      })
    }, 50000)

    setInterval(() => {
      io.emit('chat:message', {
        user: 'Torcedor',
        msg: 'Vamoss!'
      })
    }, 75000)

    setInterval(() => {
      io.emit('chat:message', {
        user: 'Torcedor',
        msg: 'Alguém sabe o placar?'
      })
    }, 100000)

    setInterval(() => {
      io.emit('chat:message', {
        user: 'Torcedor',
        msg: `Está FURIA ${furiaScore} x ${opponentScore} Team Liquid`
      })
    }, 105000)

    // Atualiza placar e round periodicamente
    // Com 40% de chance, incrementa o placar e o número do round
    setInterval(() => {
      const atualizar = Math.random() < 0.4
      if (atualizar) {
        furiaScore++
        if (Math.random() < 0.4 && opponentScore < furiaScore) {
          opponentScore++
        }
        round++
      }
      io.emit('chat:message', {
        user: 'FURIA Bot',
        msg: `Round ${round}: Placar ao vivo: FURIA ${furiaScore} x ${opponentScore} Team Liquid`
      })
    }, 90000)
  }

  res.end()
}
