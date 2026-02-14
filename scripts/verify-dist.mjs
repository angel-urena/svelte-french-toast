import { readdir } from 'node:fs/promises';
import path from 'node:path';

const distDir = path.resolve('dist');

async function listFiles(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = await Promise.all(
		entries.map((entry) => {
			const fullPath = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				return listFiles(fullPath);
			}
			return [fullPath];
		})
	);
	return files.flat();
}

try {
	const files = await listFiles(distDir);
	const leakedTestFiles = files
		.filter((file) => file.includes('.test.'))
		.map((file) => path.relative(process.cwd(), file));

	if (leakedTestFiles.length > 0) {
		console.error('Found test files in dist:');
		for (const file of leakedTestFiles) {
			console.error(`- ${file}`);
		}
		process.exit(1);
	}

	console.log('Dist verification passed: no test files found.');
} catch (error) {
	console.error(`Failed to verify dist folder at ${distDir}.`);
	console.error(error);
	process.exit(1);
}
