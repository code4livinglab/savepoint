import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  important: true, // MUIとの競合を防ぐために追加
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  // MUIとの共存のための設定
  corePlugins: {
    preflight: false, // MUIのデフォルトスタイルとの競合を防ぐ
  },
  plugins: [require("@tailwindcss/typography")],
  // ビルド時の最適化設定
  future: {
    hoverOnlyWhenSupported: true,
  },
};

export default config;
