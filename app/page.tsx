'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket;

export default function Home() {
  const [msgs, setMsgs] = useState<{ user: string; msg: string }[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    console.log('→ Iniciando conexão WebSocket…');
    socket = io({ path: '/api/socket' });

    socket.on('connect', () =>
      console.log('✅ WS conectado, id:', socket.id)
    );
    socket.on('chat:message', (data: { user: string; msg: string }) => {
      console.log('↩️ Recebido no cliente:', data);
      // Se a mensagem é um placar (FURIA Bot) atualiza a mensagem existente
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

  const sendMessage = () => {
    if (!input.trim() || !username.trim()) return;
    console.log('📤 Enviando:', input);
    socket.emit('chat:message', { user: username, msg: input });
    setInput('');
  };

  return (
    <main className="max-w-xl mx-auto p-6 bg-black text-white">
      <h1 className="text-4xl font-bold mb-6 text-yellow-500">FURIA CS:GO Chat</h1>

      {/* Landing page com informações */}
      <div className="mb-6">
        <p>Bem-vindo ao chat oficial da FURIA! Aqui você pode interagir com outros fãs e acompanhar as novidades do time de CS:GO em tempo real.</p>
        <p className="mt-2 text-yellow-400">Próximo jogo: FURIA vs. Team Liquid - Hoje às 18h!</p>
      </div>

      {/* Input para nome de usuário */}
      <div className="mb-6">
        <input
          className="w-full border rounded px-3 py-2 text-white bg-gray-800 placeholder-gray-400"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Digite seu nome..."
        />
      </div>

      {/* Container branco com texto em preto */}
      <div className="border rounded h-96 p-4 overflow-y-auto mb-6 bg-gray-900 text-white">
        {msgs.map((m, i) => (
          <div key={i} className={`mb-1 ${m.user === 'FURIA Bot' ? 'font-bold text-yellow-500' : ''}`}>
            <span>{m.user}: </span>
            {m.msg}
          </div>
        ))}
      </div>

      {/* Input e botão chamam sendMessage */}
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
