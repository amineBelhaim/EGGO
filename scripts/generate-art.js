/* eslint-disable no-await-in-loop */
const fs = require('fs');
const path = require('path');
const PImage = require('pureimage');

const OUT_DIR = path.resolve(__dirname, '../assets/art');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const savePNG = async (img, name) => {
  const outPath = path.join(OUT_DIR, name);
  await PImage.encodePNGToStream(img, fs.createWriteStream(outPath));
  // eslint-disable-next-line no-console
  console.log(`Generated ${outPath}`);
};

const circle = (ctx, x, y, r, fill) => {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
};

const ellipse = (ctx, x, y, rx, ry, fill) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(rx, ry);
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(0, 0, 1, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

const poly = (ctx, points, fill) => {
  if (!points.length) {
    return;
  }
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0], points[i][1]);
  }
  ctx.closePath();
  ctx.fill();
};

const addSoftGlow = (ctx, x, y, r, color) => {
  for (let i = 6; i >= 1; i -= 1) {
    const alpha = (0.04 * i).toFixed(3);
    circle(ctx, x, y, r + i * 10, `${color}${alpha})`);
  }
};

const drawEggClosed = (shellColor, accentColor, crackColor) => {
  const img = PImage.make(640, 640);
  const ctx = img.getContext('2d');
  ctx.clearRect(0, 0, 640, 640);

  ellipse(ctx, 320, 530, 150, 44, 'rgba(75,88,110,0.10)');
  addSoftGlow(ctx, 320, 320, 120, 'rgba(205, 224, 246, ');

  ellipse(ctx, 320, 316, 168, 220, shellColor);
  ellipse(ctx, 262, 272, 62, 110, accentColor);
  ellipse(ctx, 364, 372, 44, 82, 'rgba(255,255,255,0.35)');

  ctx.strokeStyle = crackColor;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(286, 316);
  ctx.lineTo(312, 334);
  ctx.lineTo(298, 364);
  ctx.stroke();

  return img;
};

const drawEggCracked = (shellColor, eyeColor, noseColor) => {
  const img = PImage.make(640, 640);
  const ctx = img.getContext('2d');
  ctx.clearRect(0, 0, 640, 640);

  ellipse(ctx, 320, 530, 166, 44, 'rgba(75,88,110,0.1)');
  ellipse(ctx, 320, 296, 170, 212, shellColor);

  poly(
    ctx,
    [
      [158, 360],
      [204, 334],
      [242, 360],
      [278, 326],
      [312, 364],
      [344, 334],
      [386, 366],
      [426, 332],
      [468, 364],
      [468, 488],
      [158, 488],
    ],
    '#EEDFC8',
  );

  circle(ctx, 292, 392, 45, '#FAF7F1');
  circle(ctx, 348, 392, 45, '#FAF7F1');
  circle(ctx, 292, 392, 20, eyeColor);
  circle(ctx, 348, 392, 20, eyeColor);
  circle(ctx, 299, 384, 5, '#FFFFFF');
  circle(ctx, 355, 384, 5, '#FFFFFF');
  ellipse(ctx, 320, 432, 12, 8, noseColor);

  return img;
};

const drawEars = (ctx, trait, x, y, size, color, accent) => {
  if (trait === 'round') {
    circle(ctx, x - size, y, size, color);
    circle(ctx, x + size, y, size, color);
    circle(ctx, x - size, y, size * 0.45, accent);
    circle(ctx, x + size, y, size * 0.45, accent);
    return;
  }

  if (trait === 'horn') {
    poly(
      ctx,
      [
        [x - size - 8, y + 8],
        [x - size + 8, y + 8],
        [x - size, y - size - 12],
      ],
      accent,
    );
    poly(
      ctx,
      [
        [x + size - 8, y + 8],
        [x + size + 8, y + 8],
        [x + size, y - size - 12],
      ],
      accent,
    );
    return;
  }

  if (trait === 'fin') {
    ellipse(ctx, x - size - 6, y + 6, size * 0.9, size * 0.5, accent);
    ellipse(ctx, x + size + 6, y + 6, size * 0.9, size * 0.5, accent);
    return;
  }

  if (trait === 'wing') {
    ellipse(ctx, x - size - 16, y + 18, size * 1.2, size * 0.65, accent);
    ellipse(ctx, x + size + 16, y + 18, size * 1.2, size * 0.65, accent);
    return;
  }

  poly(
    ctx,
    [
      [x - size - 10, y + 12],
      [x - size + 10, y + 12],
      [x - size, y - size - 18],
    ],
    color,
  );
  poly(
    ctx,
    [
      [x + size - 10, y + 12],
      [x + size + 10, y + 12],
      [x + size, y - size - 18],
    ],
    color,
  );
};

const drawTail = (ctx, trait, x, y, stage, color, accent) => {
  if (stage < 2) {
    return;
  }

  if (trait === 'wing') {
    ellipse(ctx, x - 84, y + 22, 44, 24, accent);
    ellipse(ctx, x + 84, y + 22, 44, 24, accent);
    return;
  }

  if (trait === 'fin') {
    poly(
      ctx,
      [
        [x, y + 94],
        [x - 36, y + 132],
        [x + 36, y + 132],
      ],
      accent,
    );
    return;
  }

  ellipse(ctx, x, y + 88, 66, 22, accent);
  if (stage >= 3) {
    ellipse(ctx, x, y + 88, 36, 12, color);
  }
};

const drawPattern = (ctx, pattern, x, y, stage, accent) => {
  if (pattern === 'spots') {
    circle(ctx, x - 48, y + 10, 8 + stage * 2, accent);
    circle(ctx, x + 34, y + 22, 10 + stage * 2, accent);
    return;
  }
  if (pattern === 'stripe') {
    ellipse(ctx, x, y + 16, 54 + stage * 8, 8, accent);
    ellipse(ctx, x, y + 42, 44 + stage * 6, 7, accent);
    return;
  }
  if (pattern === 'cheek') {
    circle(ctx, x - 42, y + 30, 10 + stage, accent);
    circle(ctx, x + 42, y + 30, 10 + stage, accent);
    return;
  }
  if (pattern === 'star') {
    poly(
      ctx,
      [
        [x, y + 2],
        [x + 10, y + 26],
        [x + 34, y + 26],
        [x + 14, y + 42],
        [x + 22, y + 66],
        [x, y + 50],
        [x - 22, y + 66],
        [x - 14, y + 42],
        [x - 34, y + 26],
        [x - 10, y + 26],
      ],
      accent,
    );
  }
};

const drawCrown = (ctx, x, y, color) => {
  poly(
    ctx,
    [
      [x - 46, y],
      [x - 20, y - 34],
      [x, y - 10],
      [x + 20, y - 34],
      [x + 46, y],
      [x + 38, y + 18],
      [x - 38, y + 18],
    ],
    color,
  );
};

const drawPetVariant = (spec, stageName) => {
  const stageMap = {
    egg: 0,
    baby: 1,
    teen: 2,
    adult: 3,
  };
  const stage = stageMap[stageName];

  if (stage === 0) {
    return drawEggCracked(spec.shell, spec.eye, spec.accent);
  }

  const img = PImage.make(640, 640);
  const ctx = img.getContext('2d');
  ctx.clearRect(0, 0, 640, 640);

  ellipse(ctx, 320, 536, 160, 42, 'rgba(75,88,110,0.08)');
  addSoftGlow(ctx, 320, 330, 120, 'rgba(181, 204, 236, ');

  const bodyY = stage === 1 ? 352 : stage === 2 ? 338 : 324;
  const bodyR = stage === 1 ? 114 : stage === 2 ? 132 : 148;
  const headY = bodyY - (stage === 1 ? 102 : 116);
  const headR = stage === 1 ? 70 : stage === 2 ? 84 : 92;

  circle(ctx, 320, bodyY, bodyR, spec.body);
  circle(ctx, 320, headY, headR, spec.body);
  drawEars(ctx, spec.trait, 320, headY - 16, stage === 1 ? 28 : 34, spec.body, spec.secondary);
  drawTail(ctx, spec.trait, 320, bodyY, stage, spec.body, spec.secondary);
  drawPattern(ctx, spec.pattern, 320, bodyY - 38, stage, spec.accent);

  circle(ctx, 290, headY + 4, stage === 1 ? 14 : 16, spec.eye);
  circle(ctx, 350, headY + 4, stage === 1 ? 14 : 16, spec.eye);
  circle(ctx, 295, headY - 2, 4, '#FFFFFF');
  circle(ctx, 355, headY - 2, 4, '#FFFFFF');
  ellipse(ctx, 320, headY + 32, 11, 8, spec.accent);

  if (stage >= 2) {
    ellipse(ctx, 270, bodyY + 64, 24, 14, spec.secondary);
    ellipse(ctx, 370, bodyY + 64, 24, 14, spec.secondary);
  }

  if (stage >= 3) {
    drawCrown(ctx, 320, headY - 90, '#F3C87A');
  }

  return img;
};

const EGG_THEMES = [
  ['egg_forest.png', '#F4E6D3', '#FFF6E9', 'rgba(115,94,66,0.19)'],
  ['egg_ocean.png', '#DFEAF4', '#F7FCFF', 'rgba(98,117,146,0.18)'],
  ['egg_volcano.png', '#F0DFD8', '#FBEFEB', 'rgba(132,97,82,0.2)'],
  ['egg_cosmic.png', '#E5E0F2', '#F7F5FD', 'rgba(108,99,138,0.2)'],
  ['egg_mythic.png', '#F3E7D5', '#FFF8EC', 'rgba(136,116,87,0.2)'],
];

const SPECIES = [
  { id: 'flamby', body: '#F3D9BF', accent: '#EBA4AC', secondary: '#EFD0A5', shell: '#F8EEDC', eye: '#2E3443', trait: 'round', pattern: 'cheek' },
  { id: 'mochi', body: '#E9DFD8', accent: '#E9B7C4', secondary: '#D3BFAF', shell: '#F5EDE4', eye: '#34384B', trait: 'pointy', pattern: 'spots' },
  { id: 'nebulon', body: '#D2DFEE', accent: '#98C0E6', secondary: '#B8D5EA', shell: '#E8F0F7', eye: '#2C3A52', trait: 'fin', pattern: 'stripe' },
  { id: 'crysta', body: '#D3E8E1', accent: '#8ACDBE', secondary: '#B8E3D8', shell: '#EAF5F1', eye: '#2D4450', trait: 'wing', pattern: 'star' },
  { id: 'pyra', body: '#F1D8CC', accent: '#EFA18E', secondary: '#E6BC9E', shell: '#F8E7DF', eye: '#3B3637', trait: 'horn', pattern: 'stripe' },
  { id: 'voltix', body: '#ECE4CD', accent: '#E8C988', secondary: '#EAD8A9', shell: '#F8F1DE', eye: '#34364A', trait: 'pointy', pattern: 'star' },
  { id: 'drakanis', body: '#D8D7EF', accent: '#B6A9E5', secondary: '#CEC5F2', shell: '#ECEAF8', eye: '#333650', trait: 'horn', pattern: 'spots' },
  { id: 'phoenix', body: '#F0D7CD', accent: '#F2B28E', secondary: '#F4C9A4', shell: '#F8E9DF', eye: '#3E3431', trait: 'wing', pattern: 'stripe' },
  { id: 'aethon', body: '#E9E0D4', accent: '#CFAEDB', secondary: '#E0C7EB', shell: '#F6EFE5', eye: '#2F3347', trait: 'round', pattern: 'star' },
  { id: 'leviathan', body: '#CEDFDC', accent: '#92BDB4', secondary: '#B7D7D0', shell: '#E8F2F0', eye: '#2A4145', trait: 'fin', pattern: 'cheek' },
];

async function main() {
  for (const [file, shell, accent, crack] of EGG_THEMES) {
    await savePNG(drawEggClosed(shell, accent, crack), file);
  }

  for (const spec of SPECIES) {
    await savePNG(drawPetVariant(spec, 'egg'), `pet_${spec.id}_egg.png`);
    await savePNG(drawPetVariant(spec, 'baby'), `pet_${spec.id}_baby.png`);
    await savePNG(drawPetVariant(spec, 'teen'), `pet_${spec.id}_teen.png`);
    await savePNG(drawPetVariant(spec, 'adult'), `pet_${spec.id}_adult.png`);
  }
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
