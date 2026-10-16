const fs = require('fs');
const path = require('path');

// ── Update HeroExperience to use 2D character ─────────────────
let hero = fs.readFileSync(
  path.join(__dirname, '../src/components/sections/HeroExperience.tsx'),
  'utf8'
);

// 1. Swap import
hero = hero.replace(
  "import WebStepPhotoCharacterRig from '@/components/character/WebStepPhotoCharacterRig'",
  "import HeroCharacter2D from '@/components/character/HeroCharacter2D'"
);

// 2. Add state to destructured useCharacter hook call
if (!hero.includes('state,')) {
  hero = hero.replace(
    '  const { setState,',
    '  const { state, setState,'
  );
}

// 3. Replace interactive character in hero (with onClick)
const rigWithClick = /<WebStepPhotoCharacterRig[\s\S]*?onClick=\{[\s\S]*?\}[\s\S]*?\/>/;
hero = hero.replace(rigWithClick, [
  '<HeroCharacter2D',
  '                  size="xl"',
  '                  forcePose={state as any}',
  '                  onClick={() => {',
  "                    setState('wave', 2000)",
  '                    speakPhrase(HERO_SPEECH[currentGender as \'boy\' | \'girl\'])',
  '                  }}',
  '                />',
].join('\n'));

// 4. Replace static character in cinematic section
hero = hero.replace(
  /<WebStepPhotoCharacterRig size="xl" showBadge={false} showVoiceButton={false} \/>/g,
  '<HeroCharacter2D size="xl" forcePose={sc.characterState as any} />'
);

fs.writeFileSync(
  path.join(__dirname, '../src/components/sections/HeroExperience.tsx'),
  hero,
  'utf8'
);
console.log('HeroExperience.tsx updated — size:', fs.statSync(
  path.join(__dirname, '../src/components/sections/HeroExperience.tsx')
).size, 'bytes');

// ── Also check CharacterController exports speakPhrase properly ─
const controller = fs.readFileSync(
  path.join(__dirname, '../src/components/character/CharacterController.tsx'),
  'utf8'
);
if (controller.includes('speakPhrase')) {
  console.log('CharacterController: speakPhrase OK');
} else {
  console.log('WARNING: speakPhrase not found in CharacterController!');
}
