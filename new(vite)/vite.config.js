import hotReloadExtension from 'hot-reload-extension-vite';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: './src/navkeys.ts',
            output: {
                assetFileNames: '[name].[ext]',
                entryFileNames: '[name].js'
            }
        },
        minify: false
    },
    plugins: [
        hotReloadExtension({
        log: true,
          backgroundPath: 'src/worker.ts' // src/pages/background/index.ts
        })
    ]
});