#!/usr/bin/env node

import * as cheerio from "cheerio";
import * as fsp from "node:fs/promises";

// url generated with https://skillicons.devkcud.com/
const darkUrl =
  "https://skillicons.dev/icons?i=apple,alpinejs,astro,docker,github,githubactions,bash,javascript,tailwindcss,regex,neovim,nodejs,pnpm,npm,cloudflare,react,remix,svelte,rust,golang,netlify,vercel,typescript,webassembly,sentry,vite,vitest,vuejs,nuxtjs,workers&theme=dark&perline=15" as const;

const lightUrl = darkUrl.replace("theme=dark", "theme=light");

const svgs = {
  light: {
    url: lightUrl,
    inputTheme: "#F4F2ED",
    outputTheme: "#EFF1F5",
  },
  dark: {
    url: darkUrl,
    inputTheme: "#242938",
    outputTheme: "#1e1e2e",
  },
};

for (const [theme, props] of Object.entries(svgs)) {
  const req = await fetch(props.url);
  const text = await req.text();
  const $ = cheerio.load(text, { xml: true });
  const filled = $(`[fill=${props.inputTheme}]`);

  for (const item of filled) {
    item.attribs.fill = props.outputTheme;
  }

  fsp.writeFile(`gh-skill-icons-${theme}.svg`, $.xml());
}
