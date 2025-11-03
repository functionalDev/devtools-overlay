
import {defineConfig} from 'vite'
import solid from 'vite-plugin-solid'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url))

// @ts-ignore I don't know why there is an error here. Seems like it has a problem with the solid plugin
export default defineConfig(() => {

    return {
        build: {
            lib: {
                entry: resolve(__dirname, 'src/index.ts'),
                name: 'devtools/shared',
                fileName: 'index',
            },
        },
        server: {port: 3006},
        plugins: [
            solid({ hot: true, dev: true }),
            dts(),
        ],
        
        optimizeDeps: {
            exclude: ['devtools', '@devtoolsoverlay/*']
        },
    }
})
