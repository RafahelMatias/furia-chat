'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket;

export default function Home() {
  const [msgs, setMsgs] = useState<{ user: string; msg: string }[]>([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const mounted = useRef(false);
  
  // Referência para o auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Função para rolar o chat para baixo automaticamente
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [msgs]);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    socket = io({ path: '/api/socket' });

    socket.on('connect', () => console.log('✅ WS conectado, id:', socket.id));
    
    socket.on('chat:message', (data: { user: string; msg: string }) => {
      if (data.user === 'FURIA Bot' && data.msg.startsWith('Round')) {
        // Atualiza a mensagem de placar sem duplicar
        setMsgs(prev => {
          const newMsgs = prev.filter(m => !(m.user === 'FURIA Bot' && m.msg.startsWith('Round')));
          return [...newMsgs, data];
        });
      } else {
        setMsgs(prev => [...prev, data]);
      }
    });
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !username.trim()) return;
    
    const trimmed = input.trim();
    
    // Lógica Profissional: Comandos emitem para o servidor para todos verem!
    if (trimmed === '/cheer') {
      socket.emit('chat:message', { user: username, msg: '🎉🎉🎉 VAMOS FURIA! PRA CIMA! 🎉🎉🎉' });
    } else if (trimmed === '/vote') {
      // O voto continua sendo uma interação com o bot local
      setMsgs(prev => [...prev, { user: 'FURIA Bot', msg: 'Enquete: Digite 1 para FURIA ou 2 para Team Liquid.' }]);
    } else if (trimmed === '1' || trimmed === '2') {
      setMsgs(prev => [
        ...prev,
        { user: 'FURIA Bot', msg: trimmed === '1' ? 'Voto computado: FURIA! 🐾' : 'Voto computado: Team Liquid 💧' }
      ]);
    } else {
      // Mensagem normal
      socket.emit('chat:message', { user: username, msg: input });
    }
    setInput('');
  };

  return (
    <main className="max-w-2xl mx-auto p-6 bg-zinc-950 text-white min-h-screen">
      <div className="flex items-center gap-3 mb-6 border-b border-zinc-800 pb-4">
        <h1 className="text-4xl font-black text-white">
          FURIA <span className="text-yellow-500">CHAT</span>
        </h1>
      </div>

      <div className="mb-6 bg-zinc-900 p-4 rounded-lg border border-zinc-800">
        <p className="text-sm text-zinc-300">Acompanhe a transmissão e torça em tempo real.</p>
        <p className="mt-1 text-sm font-bold text-yellow-500">🎮 FURIA vs. Team Liquid - AO VIVO!</p>
      </div>

      <div className="mb-4">
        <input
          className="w-full border border-zinc-700 rounded px-4 py-3 text-white bg-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-yellow-500 transition-colors"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Digite seu Nickname para entrar..."
        />
      </div>

      <div className="border border-zinc-800 rounded-lg h-[400px] p-4 overflow-y-auto mb-4 bg-zinc-900 shadow-inner flex flex-col gap-2">
        {msgs.length === 0 && <p className="text-zinc-500 text-center mt-auto mb-auto">Nenhuma mensagem ainda. Seja o primeiro!</p>}
        {msgs.map((m, i) => (
          <div key={i} className={`p-2 rounded w-fit max-w-[85%] ${m.user === 'FURIA Bot' ? 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500' : 'bg-zinc-800 text-zinc-100'}`}>
            <span className="font-bold mr-2 text-xs opacity-75">{m.user}:</span>
            <span className="text-sm">{m.msg}</span>
          </div>
        ))}
        {/* Div invisível para ancorar o scroll */}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border border-zinc-700 rounded px-4 py-3 text-white bg-zinc-900 placeholder-zinc-500 focus:outline-none focus:border-yellow-500 transition-colors"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder={username ? "Escreva sua mensagem ou use /cheer..." : "Digite um nickname primeiro..."}
          disabled={!username}
        />
        <button
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold px-6 rounded transition-colors disabled:opacity-50"
          onClick={sendMessage}
          disabled={!username}
        >
          Enviar
        </button>
      </div>
    </main>
  );
}