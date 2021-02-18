import zipSource from './zipSource.ts';
import magic from './magic.ts';

const [filename, doZip] = Deno.args;

const file = await Deno.readTextFile(`./in/${filename}`);

const result = magic(file);

await Deno.writeTextFile(`./out/${filename}`, result.join('\n'));

if (doZip) {
  zipSource();
}
