import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const size = {
  width: 96,
  height: 96,
};
export const contentType = 'image/png';

export default async function Icon() {
  const cairoFont = await readFile(
    join(process.cwd(), 'public', 'fonts', 'cairo-arabic.ttf'),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 24,
          background: 'linear-gradient(135deg, #020617 0%, #0f766e 100%)',
          color: '#ffffff',
          fontFamily: 'Cairo',
          direction: 'rtl',
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: -1,
          whiteSpace: 'nowrap',
          border: '3px solid #34d399',
        }}
      >
        ويب ستيب
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: 'Cairo',
          data: cairoFont,
          style: 'normal',
          weight: 800,
        },
      ],
    },
  );
}
