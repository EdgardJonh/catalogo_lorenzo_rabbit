import { FaWhatsapp } from "react-icons/fa";

export default function WhatsappButton() {
  return (
    <a
      href="https://wa.me/56992977211?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20los%20conejos%20disponibles." // Cambia este número y mensaje por el tuyo
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-gray-700 hover:bg-green-500 text-white rounded-full shadow-lg p-4 flex items-center justify-center transition-colors duration-200"
      aria-label="Contactar por WhatsApp"
    >
      <FaWhatsapp size={28} />
    </a>
  );
} 