// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
const path = require('path');
const lightCodeTheme = require('prism-react-renderer/themes/github');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'PhotoSwipe',
  tagline: '',
  url: 'https://photoswipe.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon-16x16.png',
  organizationName: 'dimsemenov', // Usually your GitHub org/user name.
  projectName: 'photoswipe', // Usually your repo name.


  // scripts: [
  //   'https://docusaurus.io/slash.js',
  //   {
  //     src:
  //       'https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js',
  //     async: true,
  //   },
  // ],
  stylesheets: [
    {
      href: '/photoswipe/photoswipe.css',
      type: 'text/css',
    },
  ],

  plugins: [
    [
      '@docusaurus/plugin-google-gtag',
      {
        trackingID: 'G-57MLE6HBT9',
      },
    ],
  ],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: '../docs/',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/dimsemenov/PhotoSwipe/tree/master/docs',
          breadcrumbs: false
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'light',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'PhotoSwipe',
        
        // logo: {
        //   alt: 'My Site Logo',
        //   src: 'img/logo.svg',
        // },
        items: [
          {
            type: 'doc',
            docId: 'getting-started',
            position: 'left',
            label: 'Docs',
          }
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {

          },
          {
            title: 'Community',
            items: [
              {
                label: 'Twitter',
                href: 'https://twitter.com/photoswipe',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/dimsemenov/photoswipe',
              },
            ],
          },
        ],
        copyright: 'Made in Ukraine<span class="ukraine-flag"></span> by <a href="https://twitter.com/dimsemenov">Dmytro Semenov</a>',
      },
      prism: {
        theme: lightCodeTheme,
      },

    }),
};

module.exports = config;
