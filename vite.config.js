// vite.config.js
const { resolve } = require('path')
const { defineConfig } = require('vite')
import { viteStaticCopy } from 'vite-plugin-static-copy'
import path from "path";

console.log(__dirname);

module.exports = defineConfig({
    root: 'src',
    build: {
        outDir: path.join(__dirname, "dist"),
        rollupOptions: {
            input: {
                main: resolve(__dirname, "src", 'index.html'),
                nested: resolve(__dirname, "src", 'privacy-policy/index.html')
            }
        }
    },
    plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: path.resolve(__dirname, './static') + '/[!.]*', // 1️⃣
                    dest: './', // 2️⃣
                },
            ],
        }),
    ]
})
