import {JSZip} from 'https://deno.land/x/jszip/mod.ts';

const notZipped = ['.DS_Store'];

const zipSource = async () => {
  const zip = new JSZip();
  for await (const dirEntry of Deno.readDir('./src')) {
    if (dirEntry.isFile && !notZipped.includes(dirEntry.name)) {
      const sourceFile = await Deno.readTextFile(`./src/${dirEntry.name}`);
      zip.addFile(dirEntry.name, sourceFile);
    }
  }

  await zip.writeZip('./source.zip');
};

export default zipSource;
