
import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import UnoCSS from 'unocss/vite';
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    build: {
        target: "esnext",
        lib: {
            entry: resolve(__dirname, 'src/index.tsx'),
            name: 'devtools-frontend',
            // the proper extensions will be added
            fileName: 'index',
        },
    },
    server: {
        open: true,
        port: 3006,

        proxy: {
            '/graphql': {
                target: 'http://localhost:4000/',
            },
        },
    },
    plugins: [
        solid(),
        UnoCSS({
            configFile: '../../uno.config.ts'
        }),
        dts(),
    ],
})
