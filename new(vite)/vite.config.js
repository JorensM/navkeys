import hotReloadExtension from 'hot-reload-extension-vite';
import { defineConfig, loadEnv } from 'vite';



export default defineConfig(( { mode }) => {
    const outDir = mode == 'development' ? 'dist_dev' : 'dist';

    return {
        build: {
            outDir,
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
    }
});