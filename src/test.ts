import sharp from 'sharp';
import { createCanvas, loadImage, registerFont } from 'canvas';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { pipeline } from 'stream';
import { promisify } from 'util';

const root = '/Users/spankyed/Develop/Projects/PdfToVid/src/files';

// Register the font
registerFont(path.join(root, 'input', 'Roboto-Bold.ttf'), { family: 'Roboto' });

// Function to download an image and save it to a file
async function downloadImage(url: string, outputPath: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
  await promisify(pipeline)(response.body, fs.createWriteStream(outputPath));
}

// Function to get the URL of an emoji image in the Twemoji repository
function getEmojiUrl(unicode: string) {
  const codePoints = unicode.codePointAt(0).toString(16);
  return `https://twemoji.maxcdn.com/v/latest/72x72/${codePoints}.png`;
}

async function createCircularImage(imagePath: string, size: number): Promise<Buffer> {
  console.log('createCircularImage: ');

  const circleSvg = `<svg><circle cx="${size/2}" cy="${size/2}" r="${size/2}"/></svg>`;
  const compositeOptions = [{ input: Buffer.from(circleSvg), blend: 'dest-in' as const }];

  return await sharp(imagePath)
    .resize(size, size)
    .composite(compositeOptions)
    .toBuffer();
}

async function createThumbnail(backgroundPath: string, themePath: string, decorationPath: string, outputPath: string, width: number, height: number): Promise<void> {
  console.log('createThumbnail: ');

  const size = height * 1.3; // Increase the size of the theme image by 3/10ths

  try {
    const circularThemeBuffer = await createCircularImage(themePath, size);

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.antialias = 'subpixel'; // Enable subpixel antialiasing

    // Load images
    const background = await loadImage(backgroundPath);
    const theme = await loadImage(circularThemeBuffer);
    const decoration = await loadImage(decorationPath);

    // Download emoji images
    const robotEmojiPath = path.join(root, 'input', 'robot_emoji.png');
    const packageEmojiPath = path.join(root, 'input', 'package_emoji.png');
    await downloadImage(getEmojiUrl('🤖'), robotEmojiPath);
    await downloadImage(getEmojiUrl('📦'), packageEmojiPath);

    const robotEmoji = await loadImage(robotEmojiPath);
    const packageEmoji = await loadImage(packageEmojiPath);

    // Calculate positions
    const themePosition = width * .45; // Move the theme image to the right such that 55% is visible
    const themeVerticalPosition = (height - theme.height) / 2;
    const decorationVerticalPosition = height - (decoration.height * .35);
    const decorationHorizontalPosition = (width - decoration.width) * .51;

    // Draw images on canvas
    ctx.drawImage(background, 0, 0, width, height);
    ctx.drawImage(theme, themePosition, themeVerticalPosition, theme.width, theme.height);
    ctx.drawImage(decoration, decorationHorizontalPosition, decorationVerticalPosition, decoration.width, decoration.height);

    // Add text
    const fontSize = 120;
    const lineHeight = fontSize * 0.8;
    const letterSpacing = fontSize * 0.09;
    const textX = width * 0.03;
    const textY = height * .4;
    ctx.font = `${fontSize}px Roboto`;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('AI', textX, textY);
    ctx.fillStyle = '#FF7832';
    ctx.fillText('Unboxed', textX, textY + lineHeight + letterSpacing);

    // Add emoji images
    const emojiFontSize = 170;
    const emojiTextX = textX;
    const emojiTextY = textY + lineHeight + letterSpacing + emojiFontSize;
    ctx.drawImage(robotEmoji, emojiTextX, emojiTextY, emojiFontSize, emojiFontSize);
    ctx.drawImage(packageEmoji, emojiTextX + emojiFontSize, emojiTextY, emojiFontSize, emojiFontSize);

    // Write the result to a file
    const out = fs.createWriteStream(outputPath);
    const stream = canvas.createJPEGStream();
    stream.pipe(out);

    console.log('Thumbnail created successfully');
  } catch (error) {
    console.error(`Error creating thumbnail: ${error}`);
  }
}

const bgPath = path.join(root, 'input', 'background.png');
const themePath = path.join(root, 'input', 'theme.png');
const decorationPath = path.join(root, 'input', 'decoration.png');
const outPath = path.join(root, 'output', 'thumbnail.jpg');

createThumbnail(bgPath, themePath, decorationPath, outPath, 1280, 720);
