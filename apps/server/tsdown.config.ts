import { defineConfig } from 'tsdown'

export default defineConfig({
	entry: './src/index.ts',
	format: 'module',
	outDir: './public',
	clean: true,
	noExternal: [/@file-drive\/.*/],
})
