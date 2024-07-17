import { readFileSync, writeFileSync } from 'fs'
import { minify } from 'terser'
import { join } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const execAsync = promisify(exec)

const sourceFiles = [
	'../src/base/BaseElement.js',
	'../src/base/ShadowElement.js',
	'../src/utils/html.js',
	'../src/utils/router.js',
]

async function runPrettier() {
	console.log('Running Prettier...')
	try {
		await execAsync('npm run format')
		console.log('Prettier formatting completed.')
	} catch (error) {
		console.error('Error running Prettier:', error)
		process.exit(1)
	}
}

async function build() {
	await runPrettier()

	let concatenated = ''

	for (const file of sourceFiles) {
		concatenated += readFileSync(join(__dirname, file), 'utf8') + '\n'
	}

	const { version } = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'))
	const versionComment = `/** dim.js v${version} */`

	const minified = await minify(concatenated, { sourceMap: true })

	writeFileSync(join(__dirname, '../dist/dim.js'), concatenated)
	writeFileSync(join(__dirname, '../dist/dim.min.js'), versionComment + minified.code)
	writeFileSync(join(__dirname, '../dist/dim.min.js.map'), minified.map)

	console.log('Build completed successfully.')
}

build().catch(console.error)
