import hotReloadExtension from 'hot-reload-extension-vite';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: './src/navkeys.js',
            output: {
                assetFileNames: '[name].[ext]',
                entryFileNames: '[name].js'
            }
        }
    },
    plugins: [
        hotReloadExtension({
        log: true,
        //   backgroundPath: 'path/to/background' // src/pages/background/index.ts
        })
    ]
});