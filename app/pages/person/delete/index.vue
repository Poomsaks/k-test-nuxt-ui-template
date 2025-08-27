<script setup lang="ts">
import { ref, onMounted } from 'vue'

const id = localStorage.getItem('customer') // ดึง id จาก localStorage
const loading = ref(false)
const person = ref<any>(null)

onMounted(async () => {
  if (!id) return
  try {
    const res = await fetch(`http://localhost:3002/api/person/id/${id}`)
    person.value = await res.json()
  } catch (err) {
    console.error('❌ ดึงข้อมูลไม่สำเร็จ:', err)
  }
})

const deletePerson = async () => {
  if (!id) {
    alert('ไม่พบ customer id ใน localStorage')
    return
  }

  if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?')) {
    return
  }

  try {
    loading.value = true
    const res = await fetch(`http://localhost:3002/api/person/${id}`, {
      method: 'DELETE'
    })

    if (!res.ok) {
      throw new Error(`Delete failed: ${res.status}`)
    }

    const data = await res.json()
    console.log('✅ ลบสำเร็จ:', data)
    alert('ลบข้อมูลสำเร็จ')
    localStorage.removeItem('customer')
  } catch (err) {
    console.error('❌ ลบไม่สำเร็จ:', err)
    alert('เกิดข้อผิดพลาดในการลบ')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
    <h2 class="text-xl font-bold text-red-600 mb-4">ลบข้อมูลลูกค้า</h2>

    <div v-if="person" class="space-y-2 mb-6">
      <p><span class="font-semibold">ID:</span> {{ person._id }}</p>
      <p><span class="font-semibold">ชื่อ:</span> {{ person.name }}</p>
      <p><span class="font-semibold">เลขบัตร:</span> {{ person.id_card }}</p>
    </div>

    <div v-else class="text-gray-500 mb-6">
      กำลังโหลดข้อมูล...
    </div>

    <button
      :disabled="loading"
      class="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
      @click="deletePerson"
    >
      {{ loading ? 'กำลังลบ...' : 'ลบข้อมูล' }}
    </button>
  </div>
</template>
