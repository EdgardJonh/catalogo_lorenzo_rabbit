"use client";
import { Luckiest_Guy } from "next/font/google";
import { FaSeedling, FaBaby, FaPaw } from "react-icons/fa";

const luckiestGuy = Luckiest_Guy({
  subsets: ["latin"],
  weight: "400",
});

type SeccionCatalogo = "todos" | "reproductores" | "nueva-camada" | "otros";

interface CatalogoMenuProps {
  seccionActiva: SeccionCatalogo;
  onSeccionChange: (seccion: SeccionCatalogo) => void;
  contadores: {
    todos: number;
    reproductores: number;
    nuevaCamada: number;
    otros: number;
  };
}

export default function CatalogoMenu({
  seccionActiva,
  onSeccionChange,
  contadores,
}: CatalogoMenuProps) {
  const secciones = [
    {
      id: "todos" as SeccionCatalogo,
      label: "Todos",
      icon: FaPaw,
      color: "blue",
      count: contadores.todos,
    },
    {
      id: "reproductores" as SeccionCatalogo,
      label: "Reproductores",
      icon: FaSeedling,
      color: "purple",
      count: contadores.reproductores,
    },
    {
      id: "nueva-camada" as SeccionCatalogo,
      label: "Nueva Camada",
      icon: FaBaby,
      color: "green",
      count: contadores.nuevaCamada,
    },
    {
      id: "otros" as SeccionCatalogo,
      label: "Otros Conejitos",
      icon: FaPaw,
      color: "gray",
      count: contadores.otros,
    },
  ];

  return (
    <div className="mb-8 flex flex-wrap justify-center gap-4">
      {secciones.map((seccion) => {
        const Icon = seccion.icon;
        const isActive = seccionActiva === seccion.id;
        const bgColorClass = {
          blue: "bg-blue-500",
          purple: "bg-purple-500",
          green: "bg-green-500",
          gray: "bg-gray-500",
        }[seccion.color];

        const hoverColorClass = {
          blue: "hover:bg-blue-600",
          purple: "hover:bg-purple-600",
          green: "hover:bg-green-600",
          gray: "hover:bg-gray-600",
        }[seccion.color];

        const activeBorderClass = {
          blue: "border-blue-400",
          purple: "border-purple-400",
          green: "border-green-400",
          gray: "border-gray-400",
        }[seccion.color];

        return (
          <button
            key={seccion.id}
            onClick={() => onSeccionChange(seccion.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 transform ${
              isActive
                ? `${bgColorClass} ${activeBorderClass} border-2 shadow-lg scale-105`
                : `bg-gray-700 ${hoverColorClass} border-2 border-transparent hover:scale-105`
            }`}
          >
            <Icon className="text-lg" />
            <span className={`${luckiestGuy.className} text-base md:text-lg`}>
              {seccion.label}
            </span>
            {seccion.count > 0 && (
              <span
                className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                  isActive
                    ? "bg-white bg-opacity-20"
                    : "bg-white bg-opacity-10"
                }`}
              >
                {seccion.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

