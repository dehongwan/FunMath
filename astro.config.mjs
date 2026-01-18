// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightScrollToTop from 'starlight-scroll-to-top';
import starlightFullViewMode from 'starlight-fullview-mode'
import starlightImageZoom from 'starlight-image-zoom'
import remarkWikiLink from "@braindb/remark-wiki-link";
import starlightSiteGraph from 'starlight-site-graph'
import { brainDbAstro, getBrainDb } from "@braindb/astro";
import starlightThemeGalaxy from 'starlight-theme-galaxy'

const bdb = getBrainDb();
await bdb.ready();

// https://astro.build/config
export default defineConfig({
	 site: 'https://dehongwan.github.io',
	 base: '/FunMath',
	integrations: [
		brainDbAstro({ remarkWikiLink: false }),
		starlight({
		components: {
        PageFrame: "./src/components/PageFrame.astro",
      },
		plugins: [
		starlightThemeGalaxy(),
		starlightSiteGraph(),
		starlightScrollToTop({
          position: 'right',         
          showTooltip: true,
          smoothScroll: true,
          threshold: 10,
          svgPath: 'M12 4L6 10H9V16H15V10H18L12 4M9 16L12 20L15 16',
          svgStrokeWidth: 2,
          borderRadius: '20',
          showProgressRing:true,     
          showOnHomepage: true,                 
          tooltipText: 'Back to top',
        } ),
    starlightImageZoom(),
	starlightFullViewMode({
           // Configuration options go here.
        })],
			title: 'My Docs',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
markdown: {
    remarkPlugins: [
      [
        remarkWikiLink,
        {
          linkTemplate: ({ slug, alias }) => {
            const [slugWithoutAnchor, anchor] = slug.split("#");
            if (slugWithoutAnchor) {
              const doc = bdb.documentsSync({ slug: slugWithoutAnchor })[0];
              if (doc) {
                if (!doc.frontmatter().draft || import.meta.env.DEV) {
                  return {
                    hName: "a",
                    hProperties: {
                      href: anchor ? `${doc.url()}#${anchor}` : doc.url(),
                      class: doc.frontmatter().draft ? "draft-link" : "",
                    },
                    hChildren: [
                      {
                        type: "text",
                        value:
                          alias == null ? doc.frontmatter().title : alias,
                      },
                    ],
                  };
                }
              }
            }

            return {
              hName: "span",
              hProperties: {
                class: "broken-link",
                title: `Can't resolve link to ${slug}`,
              },
              hChildren: [{ type: "text", value: alias || slug }],
            };
          },
        },
      ],
    ],
  },


  // 👇👇👇 新增这段代码 👇👇👇
  vite: {
    define: {
      // 告诉浏览器：如果看到 "process.env"，就把它当成一个空对象处理
      'process.env': {},
      // 或者更彻底一点，模拟整个 process 对象（如果上面那个不管用，就用下面这个）
      // 'process': { env: {} },
    },
    // 有些旧库可能还需要这个
    resolve: {
      alias: {
        process: "process/browser",
      },
    },
  },
  // 👆👆👆 新增结束 👆👆👆npm
	
});
