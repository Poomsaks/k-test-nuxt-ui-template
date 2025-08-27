<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const id = localStorage.getItem('customer') // ดึง id จาก localStorage
const person = ref<any>(null) // เก็บข้อมูลจาก API
const isEditing = ref(false) // สลับโหมด edit/view
const toast = useToast()

// ✅ สร้าง schema สำหรับ validate ฟอร์ม
const schema = z.object({
  name: z.string().optional(),
  lat: z.string().optional(),
  long: z.string().optional()
})

type Schema = z.output<typeof schema>

// ✅ state ฟอร์มแก้ไข
const state = reactive<Partial<Schema>>({
  name: '',
  lat: '',
  long: ''
})

onMounted(async () => {
  if (id) {
    await fetchPerson()
  }
})

async function fetchPerson() {
  try {
    const res = await $fetch(`http://localhost:3002/api/person/id/${id}`)
    person.value = res

    // เติมค่าในฟอร์ม
    state.name = person.value.name
    state.lat = person.value.lat
    state.long = person.value.long
  } catch (err) {
    console.error('Error fetching person:', err)
  }
}

// ✅ ฟังก์ชันบันทึกการแก้ไข
async function updatePerson(event: FormSubmitEvent<Schema>) {
  if (!id) return
  try {
    await $fetch(`http://localhost:3002/api/person/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: {
        name: event.data.name,
        lat: event.data.lat,
        long: event.data.long
      }
    })

    toast.add({
      title: 'Success',
      description: 'อัปเดตข้อมูลสำเร็จ',
      color: 'success'
    })

    isEditing.value = false
    await fetchPerson() // โหลดใหม่หลังแก้ไข
  } catch (err) {
    console.error('Error updating person:', err)
    toast.add({
      title: 'Error',
      description: 'ไม่สามารถอัปเดตข้อมูลได้',
      color: 'error'
    })
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto">
    <!-- แสดง Loading -->
    <div v-if="!person" class="flex flex-col items-center justify-center py-10">
      <ULoader size="lg" />
      <p class="mt-2">กำลังโหลดข้อมูล...</p>
    </div>

    <!-- ข้อมูลลูกค้า -->
    <UCard v-else>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">ข้อมูลลูกค้า</h2>
          <UBadge color="primary">ID: {{ id }}</UBadge>
        </div>
      </template>

      <!-- ✅ โหมดแสดงผล -->
      <div v-if="!isEditing" class="space-y-4">
        <div>
          <p class="font-medium">ชื่อ:</p>
          <p>{{ person.name }}</p>
        </div>
        <div>
          <p class="font-medium">บัตรประชาชน:</p>
          <p>{{ person.id_card }}</p>
        </div>
        <div>
          <p class="font-medium">Latitude:</p>
          <p>{{ person.lat }}</p>
        </div>
        <div>
          <p class="font-medium">Longitude:</p>
          <p>{{ person.long }}</p>
        </div>
        <div>
          <p class="font-medium">วันที่สร้าง:</p>
          <p>{{ new Date(person.createdAt).toLocaleString('th-TH') }}</p>
        </div>
        <div>
          <p class="font-medium">อัปเดตล่าสุด:</p>
          <p>{{ new Date(person.updatedAt).toLocaleString('th-TH') }}</p>
        </div>

        <div class="flex justify-end">
          <UButton label="แก้ไข" icon="i-heroicons-pencil-square" @click="isEditing = true" />
        </div>
      </div>

      <!-- ✅ โหมดแก้ไข -->
      <div v-else>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="updatePerson"
        >
          <UFormGroup label="ชื่อ-นามสกุล" name="name">
            <UInput v-model="state.name" placeholder="กรอกชื่อ-นามสกุล" />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Latitude" name="lat">
              <UInput v-model="state.lat" placeholder="13.7563" />
            </UFormGroup>
            <UFormGroup label="Longitude" name="long">
              <UInput v-model="state.long" placeholder="100.5018" />
            </UFormGroup>
          </div>

          <div class="flex justify-end gap-2 pt-2">
            <UButton
              label="ยกเลิก"
              color="neutral"
              variant="subtle"
              @click="isEditing = false"
            />
            <UButton
              label="บันทึกการเปลี่ยนแปลง"
              color="primary"
              type="submit"
            />
          </div>
        </UForm>
      </div>
    </UCard>
  </div>
</template>
