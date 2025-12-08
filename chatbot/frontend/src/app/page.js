import Link from 'next/link';
import Image from 'next/image'; 

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col items-center justify-center relative overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#1a1a1a] via-black to-black opacity-80"></div>
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="z-10 flex flex-col items-center space-y-6 p-8 max-w-2xl w-full">
        <div className="w-32 h-32 relative mb-4 drop-shadow-[0_0_15px_rgba(252,238,10,0.5)]">
            <img src="./public/logo.png" alt="Zytech Logo" className="object-contain w-full h-full" />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#FCEE0A] to-[#fff]">
          ZYTECH
        </h1>
        
        <p className="text-gray-400 text-lg tracking-widest uppercase border-b border-[#FCEE0A] pb-2">
          Soluções em Automação
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full justify-center">
          <Link href="/bots" className="w-full sm:w-auto">
            <button className="w-full px-8 py-4 bg-[#FCEE0A] text-black font-bold text-lg hover:bg-white hover:scale-105 transition-all duration-300 rounded-sm shadow-[0_0_20px_rgba(252,238,10,0.3)]">
              TESTAR BOTS
            </button>
          </Link>
          
          <Link href="/planos" className="w-full sm:w-auto">
            <button className="w-full px-8 py-4 border border-[#333] text-gray-300 font-bold text-lg hover:border-[#FCEE0A] hover:text-[#FCEE0A] transition-all duration-300 rounded-sm">
              VER PLANOS
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}