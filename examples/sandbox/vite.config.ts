
import {defineConfig} from 'vite'
import solid from 'vite-plugin-solid'
import dts from 'vite-plugin-dts';

const is_ext = process.argv.includes('--ext')

// @ts-ignore I don't know why there is an error here. Seems like it has a problem with the solid plugin
export default defineConfig(() => {

    return {
        server: {port: 3005},
        plugins: [
            solid({hot: true, dev: true}),
            dts(),
        ],
        define: {
            'import.meta.env.EXT': JSON.stringify(is_ext),
        },
        // base: '', // for github pages to not start with absolute "/"
        mode: 'development',
        resolve: {
            conditions: ['browser', 'development']
        },
        build: {
            target: 'esnext',
            minify: false,
            sourcemap: true,
        },
        optimizeDeps: {
            exclude: ['devtools', '@devtoolsoverlay/*']
        },
    }
})
