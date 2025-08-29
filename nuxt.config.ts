// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui-pro',
    '@vueuse/nuxt'
  ],
  plugins: [
    '~/plugins/keycloak.client.ts'
  ],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    // Public runtime config
    public: {
      apiUrl: process.env.API_URL,
      keycloakUrl: process.env.KEYCLOAK_ISSUER,
      keycloakRealm: process.env.KEYCLOAK_REALM,
      keycloakClientId: process.env.KEYCLOAK_ID
    },
    // Private runtime config (server side only)
    private: {
      apiUrl: process.env.API_URL
    }
  },

  compatibilityDate: '2024-07-11',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
