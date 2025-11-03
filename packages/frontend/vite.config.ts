
import {defineConfig} from 'vite'
import solid from 'vite-plugin-solid'
import UnoCSS from 'unocss/vite';
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url';
import dts from 'vite-plugin-dts';
import { presetKobalte } from 'unocss-preset-primitives'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig(() => {

    return {
    build: {
        target: "esnext",
        lib: {
            entry: resolve(__dirname, 'src/index.tsx'),
            name: 'devtools-frontend',
            // the proper extensions will be added
            fileName: 'index',
        },
    },
    server: { port: 3006 },
    plugins: [
        solid(),
        presetKobalte(/* options */),
        UnoCSS({
            configFile: '../../uno.config.ts'
        }),
        dts(),
    ],
    }
})
