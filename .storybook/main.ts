import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  stories: [
    "../src/components/**/*.stories.tsx",
    "../docs/foundations/**/*.mdx",
    "../docs/conventions/**/*.mdx",
    "../docs/patterns/**/*.mdx",
    "../docs/recipes/**/*.mdx",
  ],
  addons: ["@storybook/addon-docs", "@storybook/addon-mcp"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  async viteFinal(viteConfig) {
    viteConfig.plugins = viteConfig.plugins ?? [];
    viteConfig.plugins.push(tailwindcss());
    return viteConfig;
  },
};

export default config;
