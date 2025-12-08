import Link from 'next/link';

export default function Planos() {
  const planos = [
    {
      nome: "BRONZE",
      preco: "R$ 97",
      setup: "R$ 200",
      cor: "border-[#CD7F32] text-[#CD7F32]",
      features: ["Bot Básico (Regras)", "Cardápio Digital", "Suporte Horário Comercial"]
    },
    {
      nome: "PRATA",
      preco: "R$ 247",
      setup: "R$ 450",
      cor: "border-gray-300 text-gray-300",
      features: ["IA TURBO (Llama 3.3)", "Conversa Natural", "Setup Personalizado"]
    },
    {
      nome: "OURO",
      preco: "R$ 477",
      setup: "R$ 750",
      cor: "border-[#FCEE0A] text-[#FCEE0A] shadow-[0_0_20px_#FCEE0A33]",
      features: ["IA TURBO", "Dashboard de Vendas", "Relatórios em Excel", "Suporte Prioritário"]
    },
    {
      nome: "DIAMANTE",
      preco: "R$ 997",
      setup: "R$ 1.100",
      cor: "border-[#00F0FF] text-[#00F0FF] shadow-[0_0_20px_#00F0FF33]",
      features: ["TUDO DO OURO", "Disparos em Massa", "Marketing Ativo", "Consultoria Mensal"]
    }
  ];

  return (
    <div className="min-h-screen bg-black font-mono text-white p-6 overflow-y-auto">
       <div className="flex justify-between items-center mb-10 border-b border-gray-800 pb-4">
        <h1 className="text-4xl font-black text-[#FCEE0A] italic">SYSTEM CONFIGS</h1>
        <Link href="/bots" className="bg-[#00F0FF] text-black px-4 py-2 font-bold hover:bg-white">VOLTAR AO TESTE</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {planos.map((plano) => (
          <div key={plano.nome} className={`bg-[#0a0a0a] border-2 ${plano.cor} p-6 relative group transition-transform hover:-translate-y-2`}>
            
            {/* Corner Deco */}
            <div className={`absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 ${plano.cor}`}></div>
            <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 ${plano.cor}`}></div>

            <h2 className="text-3xl font-black mb-2">{plano.nome}</h2>
            <div className="text-4xl font-bold mb-1">{plano.preco}<span className="text-sm opacity-50">/mês</span></div>
            <div className="text-xs uppercase mb-6 opacity-70">Setup Inicial: {plano.setup}</div>

            <ul className="space-y-3 mb-8">
              {plano.features.map((feat, i) => (
                <li key={i} className="flex items-start text-sm">
                  <span className="mr-2 text-xl leading-none">»</span>
                  {feat}
                </li>
              ))}
            </ul>

            <button className={`w-full py-3 font-bold border ${plano.cor} hover:bg-white hover:text-black hover:border-white transition-all uppercase tracking-widest`}>
              Selecionar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}