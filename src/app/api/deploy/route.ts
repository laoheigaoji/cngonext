import { NextRequest } from 'next/server';

const CF_ACCOUNT_ID = '0a28250e63bf217f833feabaf84a25a1';
const CF_PROJECT_NAME = 'tripcngo-cngo';

export async function POST(_req: NextRequest) {
  // 优先使用 Deploy Hook URL（推荐，用户可在 Cloudflare 面板创建）
  const deployHookUrl = process.env.DEPLOY_HOOK_URL;
  if (deployHookUrl) {
    try {
      const res = await fetch(deployHookUrl, { method: 'POST' });
      const ok = res.ok || res.status === 200;
      return Response.json({
        success: ok,
        message: ok ? '部署已触发' : `部署触发失败 (${res.status})`,
        method: 'hook',
      });
    } catch (e: any) {
      return Response.json({ success: false, message: `部署触发失败: ${e.message}`, method: 'hook' }, { status: 500 });
    }
  }

  // 备用：使用 Cloudflare Pages API
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  if (!apiToken) {
    return Response.json({
      success: false,
      message: '未配置 DEPLOY_HOOK_URL 或 CLOUDFLARE_API_TOKEN 环境变量',
    }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/pages/projects/${CF_PROJECT_NAME}/deployments`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }
    );
    const data = await res.json();
    if (data.success) {
      return Response.json({ success: true, message: '部署已触发' });
    }
    return Response.json({ success: false, message: data.errors?.[0]?.message || '部署失败' }, { status: 500 });
  } catch (e: any) {
    return Response.json({ success: false, message: `部署失败: ${e.message}` }, { status: 500 });
  }
}
