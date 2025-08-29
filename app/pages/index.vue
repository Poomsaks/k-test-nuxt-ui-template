<script setup>
import { useNuxtApp } from '#app'

definePageMeta({
  layout: false
})
// const router = useRouter()
const { $keycloak } = useNuxtApp()

const providers = [
  {
    label: 'continueSSO',
    icon: 'i-simple-icons-keystone',
    color: 'white',
    click: () => {
      console.log('Redirect to IDP')
    }
  }
]

function onSubmit() {
  console.log('Submitted')
  navigateTo('/map')
  // $keycloak.login()
}
</script>

<template>
  <UContainer class="grid place-content-center h-screen">
    <NuxtLayout name="login">
      <UCard class="max-w-sm w-full">
        <UAuthForm
          :providers="providers"
          :title="'welcome'"
          align="top"
          icon="i-heroicons-lock-closed"
          :ui="{ base: 'text-center', footer: 'text-center' }"
          @click="onSubmit()"
        >
        </UAuthForm>
      </UCard>
    </NuxtLayout>
  </UContainer>
</template>
