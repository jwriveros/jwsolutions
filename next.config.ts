import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        // Ruta corta que irá dentro del código QR y tarjetas
        source: '/dm',
        // Destino real donde está tu galería
        destination: '/boda',
        // false (redirección temporal 307) evita que los navegadores guarden caché si luego cambias el destino
        permanent: false,
      },
    ];
  },
};

export default nextConfig;