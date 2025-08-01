// Ubicación: `/components/VisitUs.jsx`
import Link from 'next/link';

export default function VisitUs() {
  return (
    <div>
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
      >
        Visítanos en lorenzorabbit.cl
      </Link>
    </div>
  );
}