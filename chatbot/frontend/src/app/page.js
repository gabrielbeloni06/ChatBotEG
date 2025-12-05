"use client"
import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('basic');
  const [chatLog, setChatLog] = useState([
    { role: 'bot', content: 'Olá! Selecione o nível do bot acima para testar.' }
  ]);
  const [loading, setLoading] = useState(false);
  const getTheme = () => {
    switch(mode) {
      case 'smart': return { bg: 'bg-purple-600', hover: 'hover:bg-purple-700', light: 'bg-purple-100', text: 'text-purple-900', title: 'Bot Smart (Fuzzy)' };
      case 'premium': return { bg: 'bg-amber-500', hover: 'hover:bg-amber-600', light: 'bg-amber-100', text: 'text-amber-900', title: 'Bot Premium (IA Real) ✨' };
      default: return { bg: 'bg-green-600', hover: 'hover:bg-green-700', light: 'bg-green-100', text: 'text-green-900', title: 'Bot Básico (Regras)' };
    }
  };
  const theme = getTheme();

  async function enviarMensagem(e) {
    e.preventDefault();
    if (!input) return;

    const novaMsg = { role: 'user', content: input };
    setChatLog(prev => [...prev, novaMsg]);
    const textoAtual = input;
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://chatboteg.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: textoAtual, modo: mode }),
      });
      const data = await response.json();
      setChatLog(prev => [...prev, { role: 'bot', content: data.resposta }]);
    } catch (error) {
      setChatLog(prev => [...prev, { role: 'bot', content: "Erro de conexão." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
        <div className={`${theme.bg} p-4 text-white transition-colors duration-500`}>
          <h1 className="font-bold text-center text-lg mb-4">{theme.title}</h1>
          <div className="flex bg-black/20 p-1 rounded-lg gap-1">
            {['basic', 'smart', 'premium'].map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setChatLog([]); }}
                className={`flex-1 py-1 px-2 rounded-md text-xs font-bold uppercase transition-all ${
                  mode === m 
                    ? 'bg-white text-gray-800 shadow-md transform scale-105' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="h-96 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
          {chatLog.map((msg, index) => (
            <div 
              key={index} 
              className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
                msg.role === 'user' 
                  ? `${theme.light} ${theme.text} self-end rounded-br-none` 
                  : 'bg-white border border-gray-100 text-gray-700 self-start rounded-bl-none'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          ))}
          {loading && <div className="text-gray-400 text-xs ml-2 animate-pulse">Pensando...</div>}
        </div>
        <form onSubmit={enviarMensagem} className="p-3 border-t border-gray-100 flex gap-2 bg-white">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3 bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 text-black text-sm"
            placeholder={`Conversar com ${mode}...`}
          />
          <button type="submit" disabled={loading} className={`${theme.bg} text-white p-3 rounded-full ${theme.hover} shadow-lg transition-transform active:scale-95`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </form>

      </div>
    </div>
  );
}