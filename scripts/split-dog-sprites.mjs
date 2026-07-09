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

function isBackgroundPixel(r, g, b) {
  const brightness = (r + g + b) / 3;
  const isBlack = brightness < 42 && r < 55 && g < 55 && b < 55;
  const isWhite = brightness > 220 && r > 200 && g > 200 && b > 200;
  return isBlack || isWhite;
}

async function removeSolidBackground(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const pixels = new Uint8Array(data);
  const visited = new Uint8Array(width * height);
  const queue = [];

  const pushIfBackground = (x, y) => {
    const index = y * width + x;
    if (visited[index]) return;

    const offset = index * 4;
    const r = pixels[offset];
    const g = pixels[offset + 1];
    const b = pixels[offset + 2];

    if (!isBackgroundPixel(r, g, b)) return;

    visited[index] = 1;
    queue.push(index);
  };

  for (let x = 0; x < width; x++) {
    pushIfBackground(x, 0);
    pushIfBackground(x, height - 1);
  }

  for (let y = 0; y < height; y++) {
    pushIfBackground(0, y);
    pushIfBackground(width - 1, y);
  }

  while (queue.length > 0) {
    const index = queue.pop();
    const offset = index * 4;
    pixels[offset + 3] = 0;

    const x = index % width;
    const y = Math.floor(index / width);

    if (x > 0) pushIfBackground(x - 1, y);
    if (x < width - 1) pushIfBackground(x + 1, y);
    if (y > 0) pushIfBackground(x, y - 1);
    if (y < height - 1) pushIfBackground(x, y + 1);
  }

  return sharp(Buffer.from(pixels), {
    raw: {
      width,
      height,
      channels: 4,
    },
  })
    .png()
    .toBuffer();
}

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

      const cropped = await sharp(SOURCE)
        .extract({
          left: col * cellWidth,
          top: row * cellHeight,
          width: cellWidth,
          height: cellHeight,
        })
        .png()
        .toBuffer();

      const transparent = await removeSolidBackground(cropped);

      await sharp(transparent)
        .trim({ threshold: 12 })
        .resize(320, 320, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
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
