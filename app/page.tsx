import Image from "next/image";
import CatalogoConejos from "./components/CatalogoConejos";
import conejosData from "../public/data/conejos.json";


export default function Home() {
  
  return (
    <main className="min-h-screen bg-gradient-to-r from-slate-900 to-slate-700 p-8">
      <CatalogoConejos conejos={conejosData} />
    </main>
  );
}
