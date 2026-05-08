"use client";

import NextLink from "next/link";
import { usePathname, useRouter, useParams as useNextParams } from "next/navigation";
import React, { useMemo } from "react";

const LANG_PREFIXES = ['cn', 'en', 'ja', 'ko', 'ru', 'fr', 'es', 'de', 'tw', 'it'];

// Get current language prefix from URL path
function useLangPrefix(): string {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0] || '';
  return LANG_PREFIXES.includes(first) ? first : 'en';
}

// Compatibility Link: maps react-router-dom's `to` prop to Next.js `href`
// Automatically prepends /{lang}/ prefix if the `to` path doesn't already have one
export const Link = React.forwardRef<HTMLAnchorElement, any>(function Link(
  { to, href, replace: replaceProp, ...rest },
  ref
) {
  const langPrefix = useLangPrefix();
  const rawTarget = to || href;
  
  const targetHref = useMemo(() => {
    if (!rawTarget) return rawTarget;
    // External links, anchors, or already has lang prefix - pass through
    if (rawTarget.startsWith('http') || rawTarget.startsWith('#') || rawTarget.startsWith('mailto:')) {
      return rawTarget;
    }
    // Already has a known lang prefix (e.g. /en/visa)
    const segments = rawTarget.split('/').filter(Boolean);
    if (segments.length > 0 && LANG_PREFIXES.includes(segments[0])) {
      return rawTarget;
    }
    // Prepend lang prefix
    return `/${langPrefix}${rawTarget.startsWith('/') ? rawTarget : '/' + rawTarget}`;
  }, [rawTarget, langPrefix]);

  return <NextLink ref={ref} href={targetHref} {...rest} />;
});

// Simple compatibility for react-router-dom in Next.js
export const useLocation = () => {
  const pathname = usePathname();
  
  return useMemo(() => ({
    pathname,
    search: typeof window !== 'undefined' ? window.location.search : "",
    hash: typeof window !== 'undefined' ? window.location.hash : "",
    state: null,
    key: "default"
  }), [pathname]);
};

export const useNavigate = () => {
  const router = useRouter();
  const langPrefix = useLangPrefix();
  
  return useMemo(() => {
    return (to: any, options?: { replace?: boolean, state?: any }) => {
      let finalTo = to;
      if (typeof to === 'string' && !to.startsWith('http') && !to.startsWith('#') && !to.startsWith('mailto:')) {
        const segments = to.split('/').filter(Boolean);
        if (segments.length > 0 && !LANG_PREFIXES.includes(segments[0])) {
          finalTo = `/${langPrefix}${to.startsWith('/') ? to : '/' + to}`;
        }
      }
      if (options?.replace) {
        router.replace(finalTo);
      } else {
        router.push(finalTo);
      }
    };
  }, [router, langPrefix]);
};

export const useParams = <T extends Record<string, string | string[]> = Record<string, string | string[]>>() => {
  return useNextParams() as T; 
};

// We will also need a special Navigate component
export const Navigate = ({ to, replace }: { to: string, replace?: boolean }) => {
  const router = useRouter();
  const langPrefix = useLangPrefix();
  React.useEffect(() => {
    let finalTo = to;
    if (!to.startsWith('http') && !to.startsWith('#') && !to.startsWith('mailto:')) {
      const segments = to.split('/').filter(Boolean);
      if (segments.length > 0 && !LANG_PREFIXES.includes(segments[0])) {
        finalTo = `/${langPrefix}${to.startsWith('/') ? to : '/' + to}`;
      }
    }
    if (replace) {
      router.replace(finalTo);
    } else {
      router.push(finalTo);
    }
  }, [to, replace, router, langPrefix]);
  return null;
};
