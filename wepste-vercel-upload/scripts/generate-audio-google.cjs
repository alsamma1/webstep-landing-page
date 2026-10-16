const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '../public/audio');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// Google Translate TTS — the same voice as Google Translate button
// API endpoint: translate.google.com/translate_tts
// This is the actual Google voice used by Google Translate — sounds very human
function downloadGoogleTTS(text, lang, outFile) {
  return new Promise((resolve, reject) => {
    const encoded = encodeURIComponent(text);
    // Use chunks if text is long (max ~200 chars per request)
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${lang}&client=tw-ob&ttsspeed=0.9`;
    
    const options = {
      hostname: 'translate.google.com',
      path: `/translate_tts?ie=UTF-8&q=${encoded}&tl=${lang}&client=tw-ob&ttsspeed=0.9`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://translate.google.com/',
        'Accept': 'audio/mpeg,audio/*',
      },
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        // Follow redirect
        const location = res.headers.location;
        console.log('Redirect to:', location);
        reject(new Error('Redirect: ' + location));
        return;
      }
      
      console.log(`  Status: ${res.statusCode}, Content-Type: ${res.headers['content-type']}`);
      
      const chunks = [];
      res.on('data', d => chunks.push(d));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        if (buf.length > 1000 && res.statusCode === 200) {
          fs.writeFileSync(outFile, buf);
          console.log(`✓ ${path.basename(outFile)} — ${(buf.length/1024).toFixed(0)} KB`);
          resolve();
        } else {
          reject(new Error(`Got ${buf.length} bytes, status ${res.statusCode}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.end();
  });
}

// Split long text into chunks for Google TTS (max ~180 chars)
function splitText(text, maxLen = 180) {
  const sentences = text.split(/[.،,!؟?]/);
  const chunks = [];
  let current = '';
  for (const s of sentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    if ((current + ' ' + trimmed).length > maxLen && current) {
      chunks.push(current.trim());
      current = trimmed;
    } else {
      current = current ? current + '، ' + trimmed : trimmed;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function generateTTS(text, lang, outFile) {
  const chunks = splitText(text);
  console.log(`  Chunks: ${chunks.length}`);
  
  if (chunks.length === 1) {
    await downloadGoogleTTS(chunks[0], lang, outFile);
  } else {
    // Download each chunk and concatenate
    const tmpFiles = [];
    for (let i = 0; i < chunks.length; i++) {
      const tmp = outFile + `.part${i}.mp3`;
      tmpFiles.push(tmp);
      await downloadGoogleTTS(chunks[i], lang, tmp);
      await new Promise(r => setTimeout(r, 300));
    }
    // Concatenate all parts
    const buffers = tmpFiles.map(f => fs.readFileSync(f));
    fs.writeFileSync(outFile, Buffer.concat(buffers));
    tmpFiles.forEach(f => { try { fs.unlinkSync(f); } catch {} });
    console.log(`✓ ${path.basename(outFile)} — ${(fs.statSync(outFile).size/1024).toFixed(0)} KB (${chunks.length} parts)`);
  }
}

const speeches = [
  {
    file: 'bashir-welcome.mp3',
    lang: 'ar',
    text: 'أهلاً وسهلاً. أنا بشير، مطوّر أنظمة في WebStep. نبني لك منتجاً رقمياً فائق الجودة، من تصميم الواجهات إلى تطوير المواقع والتطبيقات. فريقنا في خدمتك على مدار الساعة.',
  },
  {
    file: 'shereen-welcome.mp3',
    lang: 'ar',
    text: 'مرحباً بك. أنا شيرين، مصممة تجربة المستخدم في WebStep. نصمّم لك واجهات جذّابة تُذهل عملاءك. كل تفصيل مدروس بعناية ليجعل علامتك التجارية لا تُنسى.',
  },
  {
    file: 'bashir-services.mp3',
    lang: 'ar',
    text: 'خدماتنا تشمل تطوير مواقع الويب، وتطبيقات الجوال، والأنظمة السحابية. كل مشروع يُبنى بأحدث التقنيات وبأعلى معايير الجودة.',
  },
  {
    file: 'shereen-services.mp3',
    lang: 'ar',
    text: 'نقدّم تصميماً شاملاً من الهوية البصرية حتى واجهات المستخدم التفاعلية. كل لون وخط وتأثير مختار بعناية يعكس شخصية علامتك.',
  },
];

async function main() {
  console.log('Generating Arabic audio using Google Translate TTS...\n');
  for (const s of speeches) {
    console.log(`Generating: ${s.file}`);
    try {
      await generateTTS(s.text, s.lang, path.join(outDir, s.file));
    } catch (e) {
      console.error(`✗ ${s.file}:`, e.message);
    }
    await new Promise(r => setTimeout(r, 800));
  }
  
  console.log('\n=== Audio files ===');
  try {
    fs.readdirSync(outDir).filter(f => f.endsWith('.mp3')).forEach(f => {
      const sz = fs.statSync(path.join(outDir, f)).size;
      console.log(`  ${f} — ${(sz/1024).toFixed(0)} KB`);
    });
  } catch {}
}

main().catch(console.error);
