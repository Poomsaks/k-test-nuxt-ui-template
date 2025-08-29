// plugins/keycloak.client.ts
import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import Keycloak from 'keycloak-js'

function getRelativeRoute(route: string) {
  return `${window.location.origin}/${route}`
}

function parseJwt(token: string | undefined) {
  if (!token) {
    return null
  }
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))
  return JSON.parse(jsonPayload)
}

export default defineNuxtPlugin({
  name: 'keycloak',
  parallel: true,
  setup(nuxtApp) {
    const runtimeConfig = useRuntimeConfig()
    if (import.meta.client) {
      const keycloak = new Keycloak({
        url: runtimeConfig.public.keycloakUrl,
        realm: runtimeConfig.public.keycloakRealm,
        clientId: runtimeConfig.public.keycloakClientId
      })

      keycloak
        .init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: getRelativeRoute('silent-check-sso.html')
        })
        .then(async (authenticated) => {
          if (authenticated) {
            const tokenPayload = parseJwt(keycloak.token)
            console.log('tokenPayload', tokenPayload)
            console.log('authenticated', authenticated)

            sessionStorage.setItem('user', JSON.stringify(tokenPayload))
            sessionStorage.setItem('token', authenticated.toString())
            navigateTo('/map/google')
          }
        })
        .catch((err: any) => {
          console.error('Keycloak init failed:', err)
        })
      // Make the keycloak instance available throughout your app
      nuxtApp.provide('keycloak', keycloak)
    }
  }
})
