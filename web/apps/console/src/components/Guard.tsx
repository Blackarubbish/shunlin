// src/components/AppGuard.tsx

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface AppGuardProps {
  children: React.ReactNode;
}

export const AppGuard = ({ children }: AppGuardProps) => {
  const { isAuthenticated, isLoading, refreshTokenMutation } = useAuth();
  const location = useLocation();

  // 自动刷新token
  useEffect(() => {
    const interval = setInterval(() => {
      refreshTokenMutation.mutate();
    }, 1000 * 60 * 30);
    return () => clearInterval(interval);
  }, [refreshTokenMutation]);

  // 记录访问日志
  useEffect(() => {
    console.log("页面访问:", location.pathname);
  }, [location.pathname]);

  if (isLoading) {
    return <div>加载中...</div>;
  }

  if (!isAuthenticated) {
    return <div>请先登录</div>;
  }
  return <>{children}</>;
};
