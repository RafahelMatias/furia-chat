/*
  Este arquivo representa a interface do chat, diretamente no navegador.
  Aqui usamos React para gerenciar o estado, enviar e receber mensagens via WebSocket (Socket.IO).
  Explicamos de forma simples como o usuário pode interagir: 
  - Digitar mensagens e comandos especiais (/cheer, /vote, 1 ou 2).
  - Observar atualizações do placar e animações da torcida.
  - O componente se conecta ao servidor Socket.IO para enviar e receber eventos.
*/

'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket;

export default function Home() {
  // Estado para armazenar mensagens, entradas de texto e nome do usuário.
  const [msgs, setMsgs] = useState<{ user: string; msg: string }[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    console.log('→ Iniciando conexão WebSocket…');
    socket = io({ path: '/api/socket' });

    // Quando a conexão é estabelecida, mostramos o ID do socket.
    socket.on('connect', () =>
      console.log('✅ WS conectado, id:', socket.id)
    );
    // Ao receber mensagens do servidor, atualizamos a lista de mensagens.
    socket.on('chat:message', (data: { user: string; msg: string }) => {
      console.log('↩️ Recebido no cliente:', data);
      // Atualiza a mensagem de placar se for do bot.
      if (data.user === 'FURIA Bot' && data.msg.startsWith('Placar ao vivo:')) {
        setMsgs(prev => {
          const newMsgs = prev.filter(m => !(m.user === 'FURIA Bot' && m.msg.startsWith('Placar ao vivo:')));
          return [...newMsgs, data];
        });
      } else {
        setMsgs(prev => [...prev, data]);
      }
    });
  }, []);

  // Função para tratar o envio de mensagens ou comandos especiais.
  const sendMessage = () => {
    if (!input.trim() || !username.trim()) return;
    const trimmed = input.trim();
    if (trimmed === '/cheer') {
      setMsgs(prev => [...prev, { user: 'Torcida', msg: 'Animação de torcida: 🎉🎉🎉' }]);
    } else if (trimmed === '/vote') {
      setMsgs(prev => [...prev, { user: 'Enquete', msg: 'Vote: Digite 1 para FURIA ou 2 para Team Liquid.' }]);
    } else if (trimmed === '1' || trimmed === '2') {
      setMsgs(prev => [
        ...prev,
        { user: 'Enquete', msg: trimmed === '1' ? 'Obrigado pelo voto na FURIA! Rumo a vitória!' : 'Voto confirmado para o Team Liquid' }
      ]);
    } else {
      // Mensagem normal enviada pelo usuário.
      console.log('📤 Enviando:', input);
      socket.emit('chat:message', { user: username, msg: input });
    }
    setInput('');
  };

  return (
    <main className="max-w-xl mx-auto p-6 bg-black text-white">
      <h1 className="text-4xl font-bold mb-6 text-yellow-500">FURIA CS:GO Chat</h1>

      {/* Seção de informações do chat */}
      <div className="mb-6">
        <p>Bem-vindo ao chat oficial da FURIA! Aqui você pode interagir com outros fãs e acompanhar as novidades do time de CS:GO em tempo real.</p>
        <p className="mt-2 text-yellow-400">Próximo jogo: FURIA vs. Team Liquid - Hoje às 18h!</p>
      </div>

      {/* Input para o nome do usuário */}
      <div className="mb-6">
        <input
          className="w-full border rounded px-3 py-2 text-white bg-gray-800 placeholder-gray-400"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Digite seu nome..."
        />
      </div>

      {/* Área de exibição das mensagens */}
      <div className="border rounded h-96 p-4 overflow-y-auto mb-6 bg-gray-900 text-white">
        {msgs.map((m, i) => (
          <div key={i} className={`mb-1 ${m.user === 'FURIA Bot' ? 'font-bold text-yellow-500' : ''}`}>
            <span>{m.user}: </span>
            {m.msg}
          </div>
        ))}
      </div>

      {/* Área de digitação e envio de mensagens */}
      <div className="flex">
        <input
          className="flex-1 border rounded-l px-3 py-2 text-white bg-gray-800 placeholder-gray-400"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Escreva algo…"
        />
        <button
          className="bg-yellow-500 text-black px-4 rounded-r"
          onClick={sendMessage}
        >
          Enviar
        </button>
      </div>
    </main>
  );
}
