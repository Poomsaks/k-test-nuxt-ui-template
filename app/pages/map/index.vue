<script setup lang="ts">
import { onMounted, ref, nextTick, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const persons = ref<any[]>([])
const mapElement = ref<HTMLDivElement | null>(null)

let map: L.Map | null = null
let markers: L.Marker[] = []

// โหลดข้อมูล
const fetchPersons = async () => {
  try {
    const res = await fetch('http://localhost:3002/api/person')
    const data = await res.json()
    persons.value = data
    await nextTick()
    updateMap()
  } catch (err) {
    console.error('❌ fetch error:', err)
    await nextTick()
    updateMap()
  }
}

// สร้าง/อัปเดตแผนที่
const updateMap = () => {
  if (!mapElement.value) return

  // init map แค่ครั้งเดียว
  if (!map) {
    map = L.map(mapElement.value).setView([13.7563, 100.5018], 12)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)
  }

  // ลบ marker เดิม
  markers.forEach(m => m.remove())
  markers = []

  // เพิ่ม marker ใหม่
  persons.value.forEach((person) => {
    if (person.lat && person.long) {
      const marker = L.marker([Number(person.lat), Number(person.long)]).addTo(map!)
      marker.bindPopup(`
        <div style="min-width:200px">
          <h3>${person.name}</h3>
          <p>ID: ${person.id_card}</p>
        </div>
      `)
      markers.push(marker)
    }
  })
}

onMounted(() => {
  fetchPersons()
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <div style="width: 100vw; height: 100vh; position: relative">
    <div ref="mapElement" style="width: 100%; height: 100%" />
  </div>
</template>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
</style>
