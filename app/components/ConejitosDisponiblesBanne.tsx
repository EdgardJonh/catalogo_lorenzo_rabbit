export default function ConejitosDisponiblesBanner() {
  return (
    <div className="w-full flex items-center justify-center py-10 px-4 bg-gradient-to-r from-violet-900 via-fuchsia-800 to-pink-700 rounded-3xl shadow-2xl">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 max-w-3xl w-full text-center">
        <div className="flex items-center justify-center mb-4">
          <span className="text-5xl animate-bounce">🐰</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-wide leading-tight">
          Conejitos disponibles
        </h1>

        <p className="mt-4 text-xl md:text-2xl font-semibold text-pink-100">
          para el <span className="text-yellow-300">31 de mayo 2026</span>
        </p>

        <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
          <span className="px-4 py-2 bg-white/20 text-white rounded-full text-sm md:text-base font-medium border border-white/20">
            🥕 Razas disponibles
          </span>

          <span className="px-4 py-2 bg-white/20 text-white rounded-full text-sm md:text-base font-medium border border-white/20">
            ❤️ Cuidados garantizados
          </span>

          <span className="px-4 py-2 bg-white/20 text-white rounded-full text-sm md:text-base font-medium border border-white/20">
            📍 Reserva anticipada
          </span>
        </div>
      </div>
    </div>
  );
}
