<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  name: z.string().optional(),
  id_card: z.string().optional(),
  lat: z.string().optional(),
  long: z.string().optional() // ไม่ Required
})
const open = ref(false)

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
  id_card: undefined,
  lat: undefined,
  long: undefined
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log('event.data.name', event.data.name)
  console.log('event.data.id_card', event.data.id_card)
  console.log('event.data.lat', event.data.lat)
  console.log('event.data.long', event.data.long)

  try {
    await $fetch('http://localhost:3002/api/person', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        name: event.data.name,
        id_card: event.data.id_card,
        lat: event.data.lat,
        long: event.data.long
      }
    })

    toast.add({
      title: 'Success',
      description: `New customer ${event.data.name} added`,
      color: 'success'
    })
    open.value = false
  } catch (err) {
    console.error('Error adding person:', err)
    toast.add({
      title: 'Error',
      description: 'ไม่สามารถเพิ่มข้อมูลได้',
      color: 'error'
    })
  }
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormField label="Name" placeholder="John Doe" name="name">
      <UInput v-model="state.name" class="w-full" />
    </UFormField>
    <UFormField label="id_card" placeholder="id Card" name="id_card">
      <UInput v-model="state.id_card" class="w-full" />
    </UFormField>
    <UFormField label="lat" placeholder="Lat" name="lat">
      <UInput v-model="state.lat" class="w-full" />
    </UFormField>
    <UFormField label="long" placeholder="Long" name="long">
      <UInput v-model="state.long" class="w-full" />
    </UFormField>
    <div class="flex justify-end gap-2">
      <UButton
        label="Cancel"
        color="neutral"
        variant="subtle"
        @click="open = false"
      />
      <UButton
        label="Create"
        color="primary"
        variant="solid"
        type="submit"
      />
    </div>
  </UForm>
</template>
