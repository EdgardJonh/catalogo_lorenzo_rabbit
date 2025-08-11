export default function Direccion() {

    return (
<section className="bg-white rounded-tl-4xl py-12 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    <div className="lg:grid lg:grid-cols-2 lg:gap-8">
      {/* Información de contacto */}
      <div className="mb-8 lg:mb-0">
        <h2 className="text-3xl font-extrabold text-purple-700 mb-6">Nuestra Dirección de Conejitos</h2>
        
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-orange-100 p-2 rounded-lg">
              <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Dirección</h3>
              {/* <p className="mt-1 text-gray-600">KM 4 Ruta U-40</p> */}
              <p className="text-gray-600">Osorno, Región de Los Lagos</p>
              <p className="text-gray-600">Chile</p>
            </div>
          </div>
          
          {/* <div className="flex items-start">
            <div className="flex-shrink-0 bg-purple-100 p-2 rounded-lg">
              <svg className="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Teléfono</h3>
              <p className="mt-1 text-gray-600">+56 64 2123 456</p>
            </div>
          </div> */}
          
          {/* <div className="flex items-start">
            <div className="flex-shrink-0 bg-gray-100 p-2 rounded-lg">
              <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Correo electrónico</h3>
              <p className="mt-1 text-gray-600">ventas@conejitosdelsur.cl</p>
            </div>
          </div> */}
          
          {/* <div className="flex items-start">
            <div className="flex-shrink-0 bg-orange-100 p-2 rounded-lg">
              <svg className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Horario de atención</h3>
              <p className="mt-1 text-gray-600">Lunes a Viernes: 9:00 - 18:00</p>
              <p className="text-gray-600">Sábados: 10:00 - 14:00</p>
            </div>
          </div> */}
        </div>
      </div>
      
      {/* Mapa */}
      {/* <div className="rounded-lg overflow-hidden shadow-lg h-64 sm:h-80 lg:h-96">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3113.037537715738!2d-73.2028339241365!3d-40.5607779713476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDMzJzM4LjgiUyA3M8KwMTInMDQuMiJX!5e0!3m2!1ses-419!2scl!4v1622673084255!5m2!1ses-419!2scl" 
          width="100%" 
          height="100%" 
          style={{border:0}}
          allowFullScreen
          loading="lazy"
          title="Ubicación de Conejitos del Sur"
          className="filter grayscale-20 hover:grayscale-0 transition-all duration-300"
        ></iframe>
      </div> */}
    </div>
  </div>
</section>
    )
}