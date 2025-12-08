"use client"
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function Bots() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('bronze'); 
  const [chatLog, setChatLog] = useState([
    { role: 'bot', content: 'Olá! Escolha o tipo de atendimento acima para começar.' }
  ]);
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);

  const API_URL = "https://chatboteg.onrender.com/api/chat"; 

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
      setChatLog(prev => [...prev, { role: 'bot', content: "⚠️ Erro de conexão." }]);
    } finally {
      setLoading(false);
    }
  }
  const activeColor = mode === 'turbo' ? 'bg-[#FCEE0A] text-black' : 'bg-[#CD7F32] text-black';
  const borderColor = mode === 'turbo' ? 'border-[#FCEE0A]' : 'border-[#CD7F32]';

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-200 font-sans flex flex-col items-center py-10 px-4">
      
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-[#FCEE0A]">ZYTECH <span className="text-white opacity-50 font-normal">| Demo</span></Link>
        <Link href="/planos" className="text-sm text-gray-400 hover:text-white transition-colors">Ver Planos →</Link>
      </div>

      <div className="w-full max-w-2xl bg-[#111] rounded-2xl shadow-2xl overflow-hidden border border-[#333] flex flex-col h-[70vh] md:h-[600px]">
        
        <div className="flex border-b border-[#333]">
          <button 
            onClick={() => {setMode('bronze'); setChatLog([])}}
            className={`flex-1 py-4 text-sm font-bold uppercase transition-all ${mode === 'bronze' ? 'bg-[#CD7F32] text-black' : 'text-gray-500 hover:bg-[#1a1a1a]'}`}
          >
            Bronze (Botões)
          </button>
          <button 
            onClick={() => {setMode('turbo'); setChatLog([])}}
            className={`flex-1 py-4 text-sm font-bold uppercase transition-all ${mode === 'turbo' ? 'bg-[#FCEE0A] text-black' : 'text-gray-500 hover:bg-[#1a1a1a]'}`}
          >
            IA Turbo (Llama 3)
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#111]">
          {chatLog.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] p-3 rounded-2xl text-sm md:text-base shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#333] text-white rounded-br-none' 
                    : `bg-[#1a1a1a] border ${borderColor} text-gray-200 rounded-bl-none`
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
               <div className="bg-[#1a1a1a] p-3 rounded-2xl rounded-bl-none text-xs text-gray-500 italic flex items-center gap-2">
                 <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                 Digitando...
               </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>

        <form onSubmit={enviarMensagem} className="p-4 bg-[#050505] border-t border-[#333] flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-[#1a1a1a] text-white rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-[#FCEE0A] transition-all placeholder-gray-600"
            placeholder={mode === 'bronze' ? "Digite o número..." : "Faça seu pedido..."}
          />
          <button 
            type="submit" 
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-105 ${activeColor}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>

      </div>

      <div className="mt-6 text-gray-600 text-xs uppercase tracking-widest">
        Powered by Zytech System
      </div>
    </div>
  );
}