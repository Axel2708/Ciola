/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vvrqybbuvrdhmrknnrvm.supabase.co', // Reemplaza con tu ID real
        pathname: '/storage/v1/object/public/productos/*', //Reemplaza con el nombre de tu carpeta
      },
    ],
  },
};
 
export default nextConfig;

//https://vvrqybbuvrdhmrknnrvm.supabase.co/storage/v1/object/public/productos/prod1.png