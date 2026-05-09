import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';

export async function POST(req: NextRequest) {
  try {
    const { dishName } = await req.json();
    if (!dishName) {
      return NextResponse.json({ error: 'Missing dishName' }, { status: 400 });
    }

    const { env } = getCloudflareContext();
    const ai = env.AI;

    if (!ai) {
      // No Workers AI - return placeholder
      return NextResponse.json({ imageUrl: null });
    }

    // Use Workers AI text-to-image model
    const response = await ai.run(
      '@cf/stabilityai/stable-diffusion-xl-base-1.0',
      {
        prompt: `Professional food photography of ${dishName}, Chinese cuisine, steaming hot, restaurant setting, top-down view, high quality, appetizing, vibrant colors, shallow depth of field`,
        n: 1,
        size: '512x512',
      }
    );

    // Response is a ReadableStream of image data
    if (response instanceof ReadableStream) {
      const blob = await new Response(response).arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(blob)));
      return NextResponse.json({
        imageUrl: `data:image/png;base64,${base64}`
      });
    }

    return NextResponse.json({ imageUrl: null });
  } catch (error: any) {
    console.error('Image generation error:', error);
    return NextResponse.json({ imageUrl: null });
  }
}
