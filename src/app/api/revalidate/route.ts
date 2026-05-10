import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

// On-demand revalidation API
// Called by admin panel after data changes to purge cache for affected pages
const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'tripcngo-revalidate-2025';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, paths, type } = body;

    // Verify secret
    if (secret !== REVALIDATE_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    // Map data types to paths that need revalidation
    const pathMap: Record<string, string[]> = {
      cities: ['/cn', '/en', '/ja', '/ko', '/ru', '/fr', '/es', '/de', '/tw', '/it',
               '/cn/cities', '/en/cities', '/ja/cities', '/ko/cities', '/ru/cities',
               '/fr/cities', '/es/cities', '/de/cities', '/tw/cities', '/it/cities'],
      city_detail: paths || [],  // specific city pages like /cn/cities/beijing
      articles: ['/cn', '/en', '/ja', '/ko', '/ru', '/fr', '/es', '/de', '/tw', '/it',
                 '/cn/articles', '/en/articles', '/ja/articles', '/ko/articles', '/ru/articles',
                 '/fr/articles', '/es/articles', '/de/articles', '/tw/articles', '/it/articles'],
      article_detail: paths || [],
      guide: ['/cn/guide', '/en/guide', '/ja/guide', '/ko/guide', '/ru/guide',
              '/fr/guide', '/es/guide', '/de/guide', '/tw/guide', '/it/guide'],
      guide_detail: paths || [],
      apps: ['/cn/apps', '/en/apps', '/ja/apps', '/ko/apps', '/ru/apps',
             '/fr/apps', '/es/apps', '/de/apps', '/tw/apps', '/it/apps'],
      about: ['/cn/about', '/en/about', '/ja/about', '/ko/about', '/ru/about',
              '/fr/about', '/es/about', '/de/about', '/tw/about', '/it/about'],
      home: ['/cn', '/en', '/ja', '/ko', '/ru', '/fr', '/es', '/de', '/tw', '/it'],
      all: ['/', '/cn', '/en', '/ja', '/ko', '/ru', '/fr', '/es', '/de', '/tw', '/it'],
    };

    let revalidatedPaths: string[] = [];

    if (type === 'all') {
      // Revalidate everything
      revalidatePath('/', 'layout');
      revalidatedPaths.push('/ (layout - all pages)');
    } else {
      const targetPaths = pathMap[type] || paths || [];
      for (const path of targetPaths) {
        revalidatePath(path);
        revalidatedPaths.push(path);
      }
    }

    console.log(`[Revalidate] Type: ${type}, Paths: ${revalidatedPaths.join(', ')}`);

    return NextResponse.json({
      revalidated: true,
      type,
      paths: revalidatedPaths,
    });
  } catch (error: any) {
    console.error('[Revalidate] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
