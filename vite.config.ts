import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        "/api/exchange": {
          target: "https://oapi.koreaexim.go.kr",
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(/^\/api\/exchange/, "/site/program/financial/exchangeJSON"),
        },
        "/api/yahoo-chart": {
          target: "https://query1.finance.yahoo.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/yahoo-chart/, "/v8/finance/chart"),
        },
        "/api/yahoo-quote": {
          target: "https://query1.finance.yahoo.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/yahoo-quote/, "/v7/finance/quote"),
        },
        "/api/naver-news": {
          target: "https://openapi.naver.com",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/naver-news/, "/v1/search/news.json"),
          headers: {
            "X-Naver-Client-Id": env.NAVER_CLIENT_ID || "",
            "X-Naver-Client-Secret": env.NAVER_CLIENT_SECRET || "",
          },
        },
      },
    },
    plugins: [react()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
