import zipSource from "./zipSource.ts";
import magic from "./magic.ts";

const [filename, bestScore, doZip] = Deno.args;
if (!filename || bestScore === undefined) {
  console.error("💥 Missing args");
  Deno.exit(1);
}

const file = await Deno.readTextFile(`./in/${filename}`);

// let the magic happen
const { result, score } = magic(file);

// log stats
console.log({ bestScore: parseInt(bestScore), score });

// save better versions
if (score > parseInt(bestScore)) {
  const magicFile = await Deno.readTextFile("./src/magic.ts");
  await Deno.writeTextFile(`./backup/${score}_${filename}_magic.ts`, magicFile);
}

const lines = result.join("\n");
// console.log(lines);

await Deno.writeTextFile(`./out/${filename}`, lines);

if (doZip) {
  zipSource();
}
