const fs = require('fs');
const path = require('path');

const brain = 'C:\\Users\\USER\\.gemini\\antigravity-ide\\brain\\3578e744-7654-4a64-a6a8-5491b88ce3aa';
const dest = path.join(__dirname, '../public/assets/characters');

const files = [
  ['bashir_idle_char_1791084363978.jpg', 'bashir-idle.jpg'],
  ['bashir_wave_char_1791084391914.jpg', 'bashir-wave.jpg'],
  ['shereen_idle_char_1791084417492.jpg', 'shereen-idle.jpg'],
  ['shereen_wave_char_1791084451453.jpg', 'shereen-wave.jpg'],
];

files.forEach(([src, dst]) => {
  const srcPath = path.join(brain, src);
  const dstPath = path.join(dest, dst);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, dstPath);
    const size = fs.statSync(dstPath).size;
    console.log(`✓ ${dst} — ${(size/1024).toFixed(0)} KB`);
  } else {
    console.log(`✗ Not found: ${src}`);
  }
});

console.log('\nFiles in characters dir:');
fs.readdirSync(dest).forEach(f => {
  const s = fs.statSync(path.join(dest, f)).size;
  console.log(`  ${f} — ${(s/1024).toFixed(0)} KB`);
});
