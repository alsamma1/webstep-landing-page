const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/audio');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const speeches = [
  {
    file: 'bashir-welcome.mp3',
    voice: 'ar-SA-NaayifNeural',
    text: 'أهلاً وسهلاً! أنا بشير، مطوّر أنظمة WebStep. نحن نبني لك منتجاً رقمياً فائق السرعة والجودة. من تصميم الواجهات، إلى تطوير المواقع والتطبيقات، فريقنا في خدمتك على مدار الساعة.',
    rate: '+20%',
    pitch: '-5Hz',
  },
  {
    file: 'shereen-welcome.mp3',
    voice: 'ar-SA-ZariyahNeural',
    text: 'مرحباً بك! أنا شيرين، مصممة تجربة المستخدم في WebStep. نصمّم لك واجهات جذّابة تُذهل عملاءك وتزيد من معدلات التحويل. كل تفصيل مدروس بعناية ليجعل علامتك التجارية لا تُنسى.',
    rate: '+15%',
    pitch: '+5Hz',
  },
  {
    file: 'bashir-services.mp3',
    voice: 'ar-SA-NaayifNeural',
    text: 'خدماتنا تشمل تطوير مواقع الويب، تطبيقات الجوال، الأنظمة السحابية، والمتاجر الإلكترونية. كل مشروع يُبنى بأحدث التقنيات وبأعلى معايير الجودة.',
    rate: '+20%',
    pitch: '-5Hz',
  },
  {
    file: 'shereen-services.mp3',
    voice: 'ar-SA-ZariyahNeural',
    text: 'نقدّم لك تصميماً شاملاً يبدأ من الهوية البصرية وينتهي بواجهات المستخدم التفاعلية. كل لون وخط وتأثير مختار بعناية.',
    rate: '+15%',
    pitch: '+5Hz',
  },
];

async function generate(s) {
  const tts = new MsEdgeTTS();
  await tts.setMetadata(s.voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

  const ssml = `
<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="ar-SA">
  <voice name="${s.voice}">
    <prosody rate="${s.rate}" pitch="${s.pitch}">
      ${s.text}
    </prosody>
  </voice>
</speak>`;

  const filePath = path.join(outDir, s.file);

  return new Promise((resolve, reject) => {
    const { audioStream } = tts.toStream(ssml);
    const chunks = [];
    audioStream.on('data', d => chunks.push(d));
    audioStream.on('end', () => {
      const buf = Buffer.concat(chunks);
      fs.writeFileSync(filePath, buf);
      console.log('✓', s.file, '—', buf.length, 'bytes');
      resolve();
    });
    audioStream.on('error', reject);
    setTimeout(() => reject(new Error('timeout')), 30000);
  });
}

async function main() {
  for (const s of speeches) {
    console.log('Generating:', s.file, '(', s.voice, ')');
    try {
      await generate(s);
    } catch (e) {
      console.error('✗ Failed:', s.file, '—', e.message);
    }
    // Small delay between requests
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('\n=== Audio files in public/audio/ ===');
  fs.readdirSync(outDir).forEach(f => {
    const size = fs.statSync(path.join(outDir, f)).size;
    console.log(' ', f, '—', (size/1024).toFixed(0), 'KB');
  });
}

main().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
