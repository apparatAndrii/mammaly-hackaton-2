import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SOURCE = path.join(process.cwd(), "assets", "dog-sprites-source.png");
const OUTPUT_DIR = path.join(process.cwd(), "public", "dog-emotions");

const EMOTIONS = [
  "happy",
  "curious",
  "wink",
  "neutral",
  "shocked",
  "laughing",
  "angry",
  "excited",
  "skeptical",
  "very-happy",
  "sleepy",
  "playful",
  "content",
  "pouty",
  "guilty",
  "cheerful",
];

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const metadata = await sharp(SOURCE).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Could not read image dimensions");
  }

  const cellWidth = Math.floor(metadata.width / 4);
  const cellHeight = Math.floor(metadata.height / 4);

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const index = row * 4 + col;
      const name = EMOTIONS[index];

      await sharp(SOURCE)
        .extract({
          left: col * cellWidth,
          top: row * cellHeight,
          width: cellWidth,
          height: cellHeight,
        })
        .png()
        .toFile(path.join(OUTPUT_DIR, `${name}.png`));
    }
  }

  console.log(`Saved ${EMOTIONS.length} emotion sprites to ${OUTPUT_DIR}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
