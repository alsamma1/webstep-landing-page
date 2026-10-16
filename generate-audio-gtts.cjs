const gTTS = require('node-gtts');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/audio');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Arabic Google TTS — sounds like a real human voice (the same voice as Google Translate)
const speeches = [
  {
    file: 'bashir-welcome.mp3',
    lang: 'ar',
    text: 'أهلاً وسهلاً! أنا بشير، مطوّر أنظمة في WebStep. نحن نبني لك منتجاً رقمياً فائق الجودة. من تصميم الواجهات، إلى تطوير المواقع والتطبيقات. فريقنا في خدمتك على مدار الساعة.',
  },
  {
    file: 'shereen-welcome.mp3',
    lang: 'ar',
    text: 'مرحباً بك! أنا شيرين، مصممة تجربة المستخدم في WebStep. نصمّم لك واجهات جذّابة تُذهل عملاءك. كل تفصيل مدروس بعناية ليجعل علامتك التجارية لا تُنسى.',
  },
  {
    file: 'bashir-services.mp3',
    lang: 'ar',
    text: 'خدماتنا تشمل تطوير مواقع الويب، تطبيقات الجوال، والأنظمة السحابية. كل مشروع يُبنى بأحدث التقنيات وبأعلى معايير الجودة.',
  },
  {
    file: 'shereen-services.mp3',
    lang: 'ar',
    text: 'نقدّم لك تصميماً شاملاً من الهوية البصرية حتى واجهات المستخدم التفاعلية. كل لون وخط وتأثير مختار بعناية يعكس شخصية علامتك.',
  },
  {
    file: 'bashir-contact.mp3',
    lang: 'ar',
    text: 'يسعدني مساعدتك! أخبرنا عن فكرتك، وسيرد فريقنا عليك خلال أربع وعشرين ساعة باستشارة تقنية مجانية.',
  },
  {
    file: 'shereen-contact.mp3',
    lang: 'ar',
    text: 'كل مشروع يبدأ بخطوة. شاركينا رؤيتك لنقترح عليك أفضل خطة عمل تناسب أهدافك وميزانيتك.',
  },
];

function generateOne(s) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(outDir, s.file);
    const tts = gTTS(s.text, s.lang);
    tts.save(filePath, (err) => {
      if (err) {
        reject(err);
      } else {
        const size = fs.statSync(filePath).size;
        console.log(`✓ ${s.file} — ${(size/1024).toFixed(0)} KB`);
        resolve();
      }
    });
  });
}

async function main() {
  console.log('Generating Arabic audio files using Google TTS...\n');
  for (const s of speeches) {
    try {
      await generateOne(s);
    } catch (e) {
      console.error(`✗ ${s.file}:`, e.message);
    }
    // Small delay between requests
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('\n=== Generated files ===');
  fs.readdirSync(outDir).forEach(f => {
    const sz = fs.statSync(path.join(outDir, f)).size;
    console.log(`  ${f} — ${(sz/1024).toFixed(0)} KB`);
  });
}

main().catch(console.error);
