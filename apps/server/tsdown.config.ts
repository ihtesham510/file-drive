import { defineConfig } from 'tsdown'

export default defineConfig({
	entry: './src/index.ts',
	format: ['es'],
	dts: {
		sourcemap: true,
	},
	outDir: './dist',
	platform: 'node',
	clean: true,
	noExternal: [/@file-drive\/.*/],
})
