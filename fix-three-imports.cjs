const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/components/character/HeroRobotCharacter.tsx');
let src = fs.readFileSync(filePath, 'utf8');

// Replace all THREE.XYZ with just XYZ (since we now have named imports)
src = src.replace(/THREE\./g, '');

fs.writeFileSync(filePath, src, 'utf8');
console.log('Replaced all THREE. references. Size:', fs.statSync(filePath).size);

// Verify no THREE. left
const remaining = (src.match(/THREE\./g) || []).length;
console.log('Remaining THREE. references:', remaining);
