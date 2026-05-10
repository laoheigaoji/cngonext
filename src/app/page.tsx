import { redirect } from "next/navigation";
import { headers } from "next/headers";

const langPrefixMap: Record<string, string> = {
  zh: 'cn',
  'zh-cn': 'cn',
  'zh-tw': 'tw',
  'zh-hk': 'tw',
  tw: 'tw',
  en: 'en',
  ja: 'ja',
  ko: 'ko',
  ru: 'ru',
  fr: 'fr',
  es: 'es',
  de: 'de',
  it: 'it',
};

export default async function RootPage() {
  const headersList = await headers();
  const acceptLang = headersList.get("accept-language") || "";
  
  // Parse accept-language header to find best match
  const browserLangs = acceptLang
    .split(",")
    .map((lang) => {
      const [code, priority] = lang.trim().split(";q=");
      return { code: code.toLowerCase().trim(), priority: priority ? parseFloat(priority) : 1 };
    })
    .sort((a, b) => b.priority - a.priority);

  let prefix = "en"; // default
  for (const { code } of browserLangs) {
    // Try exact match first
    if (langPrefixMap[code]) {
      prefix = langPrefixMap[code];
      break;
    }
    // Try prefix match (e.g. "zh-cn" matches "zh")
    const baseCode = code.split("-")[0];
    if (langPrefixMap[baseCode]) {
      prefix = langPrefixMap[baseCode];
      break;
    }
  }

  redirect(`/${prefix}`);
}
