import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-[#FCEE0A] font-mono flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Background Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

      <div className="z-10 text-center space-y-8 p-6">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter glitch-text uppercase" style={{ textShadow: '4px 4px 0px #00F0FF' }}>
          ZYTECH
        </h1>
        <p className="text-xl md:text-2xl text-[#00F0FF] tracking-widest uppercase border-b-2 border-[#FCEE0A] inline-block pb-2">
          Systems Online // 2077
        </p>

        <div className="flex flex-col gap-4 mt-10">
          <Link href="/bots">
            <button className="px-10 py-4 bg-[#FCEE0A] text-black font-black text-xl uppercase tracking-widest hover:bg-[#00F0FF] hover:text-white transition-all duration-200" style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}>
              Testar Bots
            </button>
          </Link>
          
          <Link href="/planos">
            <button className="px-10 py-4 border-2 border-[#FCEE0A] text-[#FCEE0A] font-bold text-lg uppercase tracking-widest hover:bg-[#FCEE0A] hover:text-black transition-all duration-200" style={{ clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)' }}>
              Ver Configurações (Planos)
            </button>
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-5 text-[#00F0FF] text-xs opacity-50">
        SYSTEM_ID: ZY-900 // NETRUNNER_ACCESS
      </div>
    </div>
  );
}