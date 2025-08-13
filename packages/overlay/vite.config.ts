
import {defineConfig} from 'vite'
import solid from 'vite-plugin-solid'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig(() => {

    return {
        build: {
            lib: {
                entry: resolve(__dirname, 'src/index.tsx'),
                name: 'devtools/overlay',
                fileName: 'index',
            },
        },
        server: {port: 3006},
        plugins: [
            solid({ hot: true, dev: true }),
        ],
        
        optimizeDeps: {
            exclude: ['devtools', '@devtools/*']
        },
    }
})
