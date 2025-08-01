// Ubicación: `/components/VisitUs.jsx`
import Link from 'next/link';
import { FaGlobe } from "react-icons/fa";

export default function VisitUs() {
  return (
    <div className='relative inline-block'>
      {/* <h1 className="text-3xl md:text-4xl font-bold text-purple-800 mb-4">
        ¡Bienvenido a Lorenzo Rabbit!
      </h1>
      <p className="text-gray-700 mb-6">
        Descubre el adorable mundo de nuestros conejitos y vive una experiencia única.
      </p> */}
      <Link
        href="https://criaderolorenzo.cl/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-300"
      > <FaGlobe className="inline-block mr-2" />
        Visítanos en Criadero Lorenzorabbit.cl
        <div className="absolute -bottom-2 right-10  top-8 translate-x-1/4 translate-y-1/4 w-36  bg-black bg-opacity-50 text-white px-1 py-1  rounded-full text-xs">
            Click para visitar
          </div>
      </Link>
       
    </div>
  );
}