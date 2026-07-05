import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          short_name: "PowerFindParts",
          name: "Power Find Parts - Sagacitas Industrial",
          description: "Precisão de Peças Vinculadas",
          theme_color: "#002630",
          background_color: "#f8fafb",
          display: "standalone",
          icons: [
            {
              src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJh1pQBzRjhwiCiRv8rr5sjNgN-fDh0GeuwgA65Oqoh67U7iC56cTP_KgGcdPrJlzAITDAQV0oIbXmNjtHmb8lMNCsf6Rn-ATMyjiJ_9Af1SqDBBloTs2_loN1gVHOCcxlu5_yUNdZZAw9EyTSfPnWBiP6LnOB3F-NVYf8QAAFjNGSaS79QS0uQLyS7I4Sfa0G6UjNFiEgEFmQL7LftO3LmFa_fL6M3pqo3C93wDgtv-Psb7LAns3qRg",
              sizes: "192x192",
              type: "image/png",
              purpose: "any maskable"
            },
            {
              src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJh1pQBzRjhwiCiRv8rr5sjNgN-fDh0GeuwgA65Oqoh67U7iC56cTP_KgGcdPrJlzAITDAQV0oIbXmNjtHmb8lMNCsf6Rn-ATMyjiJ_9Af1SqDBBloTs2_loN1gVHOCcxlu5_yUNdZZAw9EyTSfPnWBiP6LnOB3F-NVYf8QAAFjNGSaS79QS0uQLyS7I4Sfa0G6UjNFiEgEFmQL7LftO3LmFa_fL6M3pqo3C93wDgtv-Psb7LAns3qRg",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable"
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}']
        },
        devOptions: {
          enabled: true
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
