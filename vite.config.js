import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return defineConfig({
    plugins: [
      react(),
      tailwindcss(),
    ],
    server: {
      host: env.VITE_MYIPADDR,
      port: parseInt(env.VITE_MYPORT),
    },
    define: {
      'process.env': {}
    }
  })
}
