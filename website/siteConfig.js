const pswpExampleMarkdownFence = require('./photoswipe-markdown/pswp-example-fence');

const siteConfig = {
  title: 'PhotoSwipe 5.0 beta', // Title for your website.
  tagline: 'A website for testing',
  url: 'https://photoswipe.com', // Your website URL
  baseUrl: '/v5/', // Base URL for your project */


  // Used for publishing and more
  projectName: 'photoswipe-site',
  organizationName: 'photoswipe',

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    { doc: 'getting-started', label: 'Documentation' },
    { href: 'https://github.com/dimsemenov/photoswipe', label: 'GitHub' },
    // { href: '', label: 'WordPress Plugin' },
    // { search: false },
  ],

  // algolia: {
  //   apiKey: 'my-api-key',
  //   indexName: 'my-index-name',
  //   algoliaOptions: {} // Optional, if provided by Algolia
  // },

  // If you have users set above, you add it here:
  users: null,

  /* path to images for header/footer */
  // headerIcon: false,
  // footerIcon: false,
  favicon: 'img/favicon-16x16.png',
  // ogImage: false,
  // twitterImage: false,


  /* Colors for website */
  colors: {
    primaryColor: '#1B57A5',
    secondaryColor: '#c00',
  },

  copyright: `Copyright © ${new Date().getFullYear()} Dmytro Semenov`,

  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks.
    theme: 'xcode',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: [],

  // CSS files in these directories will not be
  // concateneted to the main docusaurus CSS file
  separateCss: ['photoswipe.css'],
  stylesheets: [
    '/v5/photoswipe/photoswipe.css'
  ],

  onPageNav: false,
  cleanUrl: true,

  markdownPlugins: [
    pswpExampleMarkdownFence
  ],

  gaTrackingId: 'UA-49016964-1'
  // repoUrl: 'https://github.com/dimsemenov/photoswipe'
};

module.exports = siteConfig;
