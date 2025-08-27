<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css' // ✅ ต้อง import css ด้วย

const persons = ref<any[]>([])
const mapElement = ref<HTMLDivElement | null>(null)
let map: L.Map | null = null

const fetchPersons = async () => {
  try {
    const res = await fetch('http://localhost:3002/api/person')
    persons.value = await res.json()
    await nextTick() // ✅ รอ DOM พร้อม
    initMap()
  } catch (err) {
    console.error('❌ fetch error:', err)
  }
}

const initMap = () => {
  if (!mapElement.value) return

  // ถ้ามี map เดิมแล้วลบก่อน (ป้องกันซ้ำ)
  if (map) {
    map.remove()
  }

  // สร้างแผนที่
  map = L.map(mapElement.value).setView([13.7563, 100.5018], 6)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  // สร้าง marker ตามข้อมูล
  persons.value.forEach((p) => {
    if (p.lat && p.long) {
      const marker = L.marker([p.lat, p.long]).addTo(map)
      marker.bindPopup(`<b>${p.name}</b><br>ID: ${p.id_card}`)
    }
  })
}

onMounted(() => {
  fetchPersons()
})
</script>

<template>
  <div style="width:100%; height:100%;">
    <p>Page Map (Leaflet)</p>
    <div ref="mapElement" style="width:100%; height:100%;" />
  </div>
</template>
