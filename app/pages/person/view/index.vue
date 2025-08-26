<script setup lang="ts">
import { ref, onMounted } from 'vue'

const id = localStorage.getItem('customer') // ดึง id ที่เก็บไว้ใน localStorage
const person = ref<any>(null) // ref สำหรับเก็บข้อมูลที่ได้จาก API

onMounted(async () => {
  if (id) {
    try {
      const res = await fetch(`http://localhost:3002/api/person/id/${id}`)
      person.value = await res.json()
    } catch (err) {
      console.error('Error fetching person:', err)
    }
  }
})
</script>

<template>
  <div>
    <p>Id จาก localStorage: {{ id }}</p>

    <div v-if="person">
      <h2>ข้อมูลลูกค้า</h2>
      <p><strong>_id:</strong> {{ person._id }}</p>
      <p><strong>ชื่อ:</strong> {{ person.name }}</p>
      <p><strong>เลขบัตร:</strong> {{ person.id_card }}</p>
      <p><strong>Latitude:</strong> {{ person.lat }}</p>
      <p><strong>Longitude:</strong> {{ person.long }}</p>
      <p><strong>วันที่สร้าง:</strong> {{ person.createdAt }}</p>
      <p><strong>วันที่แก้ไข:</strong> {{ person.updatedAt }}</p>
      <p><strong>เวอร์ชัน:</strong> {{ person.__v }}</p>
    </div>

    <p v-else>กำลังโหลดข้อมูล...</p>
  </div>
</template>
