import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const [status, setStatus] = useState('正在登录，请稍候... Logging in...');

  useEffect(() => {
    const finalizeAuth = () => {
      setStatus('登录成功！Login successful!');
      if (window.opener) {
        window.opener.postMessage({ type: 'AUTH_SUCCESS' }, '*');
        window.close();
        
        // Fallback info if window hasn't closed
        setTimeout(() => {
          setStatus('登录成功！您可以关闭此窗口。Login successful! You can close this window.');
        }, 500);
      } else {
        window.location.replace('/');
      }
    };

    const handleAuth = async () => {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === 'SIGNED_IN' || session) {
            finalizeAuth();
          }
        }
      );

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        finalizeAuth();
      } else {
        // 如果没有 session，等待一会儿后返回首页(没有opener时)或者关闭
        setTimeout(() => {
          if (window.opener) {
            window.close();
          } else {
            window.location.replace('/');
          }
        }, 3000);
      }

      return () => {
        subscription.unsubscribe();
      };
    };

    handleAuth();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-8 max-w-sm w-full">
        {!status.includes('成功') && !status.includes('successful') && (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1b887a] mx-auto mb-4"></div>
        )}
        {(status.includes('成功') || status.includes('successful')) && (
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        <p className="text-gray-700 font-medium text-lg">{status.split('。')[0]}。</p>
        {status.split('。')[1] && (
          <p className="text-gray-500 mt-2 text-sm">{status.split('。')[1]}</p>
        )}
      </div>
    </div>
  );
}
