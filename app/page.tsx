import Image from "next/image";
import CatalogoConejos from "./components/CatalogoConejos";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-r from-slate-900 to-slate-700 p-8">
      <CatalogoConejos />
    </main>
  );
}
