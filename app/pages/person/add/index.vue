<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

// ✅ สร้าง schema ตรวจสอบ input
const schema = z.object({
  name: z.string().optional(),
  id_card: z.string().optional(),
  lat: z.string().optional(),
  long: z.string().optional()
})

type Schema = z.output<typeof schema>

// ✅ state สำหรับผูกกับ input
const state = reactive<Partial<Schema>>({
  name: '',
  id_card: '',
  lat: '',
  long: ''
})

const open = ref(false)
const toast = useToast()

// ✅ ฟังก์ชัน submit
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    await $fetch('http://localhost:3002/api/person', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        name: event.data.name,
        id_card: event.data.id_card,
        lat: event.data.lat,
        long: event.data.long
      }
    })

    toast.add({
      title: 'Success',
      description: `เพิ่มลูกค้าใหม่: ${event.data.name}`,
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
  <!-- ✅ Card Layout ของ Nuxt UI -->
  <UCard class="max-w-md mx-auto">
    <template #header>
      <h2 class="text-lg font-semibold">เพิ่มลูกค้าใหม่</h2>
    </template>

    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormGroup label="ชื่อ" name="name">
        <UInput v-model="state.name" placeholder="John Doe" />
      </UFormGroup>

      <UFormGroup label="เลขบัตรประชาชน" name="id_card">
        <UInput v-model="state.id_card" placeholder="เลขบัตรประชาชน" />
      </UFormGroup>

      <UFormGroup label="Latitude" name="lat">
        <UInput v-model="state.lat" placeholder="เช่น 13.7563" />
      </UFormGroup>

      <UFormGroup label="Longitude" name="long">
        <UInput v-model="state.long" placeholder="เช่น 100.5018" />
      </UFormGroup>

      <div class="flex justify-end gap-2 pt-2">
        <UButton
          label="ยกเลิก"
          color="neutral"
          variant="subtle"
          @click="open = false"
        />
        <UButton
          label="บันทึก"
          color="primary"
          type="submit"
        />
      </div>
    </UForm>
  </UCard>
</template>
