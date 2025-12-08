"use client"
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function Bots() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('bronze'); // 'bronze' ou 'turbo'
  const [chatLog, setChatLog] = useState([
    { role: 'bot', content: 'SYSTEM READY. Escolha seu Neural Link acima.' }
  ]);
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  const API_URL = "https://chatboteg.onrender.com/api/chat"; // SUA URL DO RENDER AQUI

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom() }, [chatLog]);

  async function enviarMensagem(e) {
    e.preventDefault();
    if (!input) return;

    const novaMsg = { role: 'user', content: input };
    setChatLog(prev => [...prev, novaMsg]);
    const texto = input;
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: texto, modo: mode }),
      });
      const data = await res.json();
      setChatLog(prev => [...prev, { role: 'bot', content: data.resposta }]);
    } catch (error) {
      setChatLog(prev => [...prev, { role: 'bot', content: "⚠️ ERRO DE CONEXÃO COM O SERVIDOR." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-[#FCEE0A] font-mono flex flex-col">
      {/* Header Cyberpunk */}
      <div className="border-b-2 border-[#FCEE0A] p-4 flex justify-between items-center bg-[#111]">
        <Link href="/" className="text-2xl font-black italic tracking-tighter text-[#00F0FF]">ZYTECH</Link>
        <Link href="/planos" className="text-sm underline hover:text-[#00F0FF]">VER PLANOS</Link>
      </div>

      <div className="flex justify-center gap-4 p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        <button 
          onClick={() => {setMode('bronze'); setChatLog([])}}
          className={`px-6 py-2 font-bold uppercase tracking-widest transition-all ${mode === 'bronze' ? 'bg-[#CD7F32] text-black scale-110 shadow-[4px_4px_0px_#fff]' : 'border border-[#CD7F32] text-[#CD7F32] opacity-50'}`}
          style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 80%, 90% 100%, 0 100%, 0 20%)' }}
        >
          Bronze (Clássico)
        </button>

        <button 
          onClick={() => {setMode('turbo'); setChatLog([])}}
          className={`px-6 py-2 font-bold uppercase tracking-widest transition-all ${mode === 'turbo' ? 'bg-[#00F0FF] text-black scale-110 shadow-[4px_4px_0px_#FCEE0A]' : 'border border-[#00F0FF] text-[#00F0FF] opacity-50'}`}
          style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 80%, 90% 100%, 0 100%, 0 20%)' }}
        >
          💎 Prata/Ouro/Dima (AI)
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/90 relative">
        {/* Grid de fundo */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(50,50,50,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(50,50,50,0.2)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

        {chatLog.map((msg, i) => (
          <div key={i} className={`relative z-10 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] p-4 text-sm md:text-base border-l-4 ${
                msg.role === 'user' 
                  ? 'bg-[#FCEE0A] text-black border-white' 
                  : mode === 'turbo' ? 'bg-[#000510] border-[#00F0FF] text-[#00F0FF] shadow-[0_0_10px_#00F0FF33]' : 'bg-[#1a1a1a] border-[#CD7F32] text-[#CD7F32]'
              }`}
              style={{ clipPath: msg.role === 'user' ? 'polygon(100% 0, 100% 100%, 0 100%, 10% 0)' : 'polygon(0 0, 100% 0, 90% 100%, 0 100%)' }}
            >
              <span className="block text-[10px] font-bold opacity-70 mb-1">
                {msg.role === 'user' ? 'YOU' : mode === 'turbo' ? 'NETRUNNER_AI' : 'BASIC_BOT'}
              </span>
              <div className="whitespace-pre-wrap font-semibold">{msg.content}</div>
            </div>
          </div>
        ))}
        {loading && <div className="text-[#00F0FF] text-xs animate-pulse text-center">PROCESSING DATA...</div>}
        <div ref={endOfMessagesRef} />
      </div>

      <form onSubmit={enviarMensagem} className="p-4 bg-[#111] border-t-2 border-[#FCEE0A] flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-black border border-[#333] text-[#FCEE0A] p-3 focus:outline-none focus:border-[#FCEE0A] focus:shadow-[0_0_15px_#FCEE0A44]"
          placeholder="Digite sua mensagem..."
        />
        <button type="submit" className="bg-[#FCEE0A] text-black font-bold px-6 hover:bg-white transition-colors uppercase">
          SEND
        </button>
      </form>
    </div>
  );
}