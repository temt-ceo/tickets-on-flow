export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "~/plugins/fcl.client.js", // only in client side
    { src: '~/plugins/vuex-persist', ssr: false }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/buefy
    'nuxt-buefy',
    '@nuxtjs/i18n',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios'
  ],

  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        file: 'en-US.js'
      },
      {
        code: 'es',
        iso: 'es-ES',
        file: 'es-ES.js'
      },
      {
        code: 'fr',
        iso: 'fr-FR',
        file: 'fr-FR.js'
      },
      {
        code: 'zh',
        iso: 'zh-CN',
        file: 'zh-CN.js'
      },
      {
        code: 'ar',
        iso: 'ar-SA',
        file: 'ar-SA.js'
      },
      {
        code: 'pt',
        iso: 'pt-PT',
        file: 'pt-PT.js'
      },
      {
        code: 'ja',
        iso: 'ja-JP',
        file: 'ja-JP.js'
      },
      {
        code: 'de',
        iso: 'de-DE',
        file: 'de-DE.js'
      },
      {
        code: 'ko',
        iso: 'en-US',
        file: 'ko-KR.js'
      }
    ],
    baseUrl: 'https://tickets-on-flow.web.app/',
    defaultLocale: 'en',
    langDir: 'lang/',
    lazy: true,
    strategy: 'no_prefix',
    vueI18n: {
      fallbackLocale: 'en'
    }
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: '/'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend (config, ctx) {
      config.performance.maxAssetSize = 1500 * 1024
    }
  }
}
