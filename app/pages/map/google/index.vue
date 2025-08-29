<script setup>
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#app'

const mapData = ref(null)
const mapRef = ref(null)
const map = ref(null)
const kmlLayers = ref([])
const selectedKMLUrl = ref('')

const kmlUrls = ref([])
const kmlUrlsOption = ref([])

const config = useRuntimeConfig()
const GOOGLE_MAPS_API_KEY = config.public.googleMapsApiKey

const loadGoogleMapsScript = () => {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) return resolve(window.google.maps)

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`
    script.async = true
    script.onload = () => resolve(window.google.maps)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

const initMap = () => {
  if (!mapRef.value) return

  const loader = new window.google.maps.Map(mapRef.value, {
    center: { lat: 13.7563, lng: 100.5018 }, // Bangkok
    zoom: 15,
    mapTypeId: 'hybrid', // 'satellite' or 'hybrid'
    tilt: 45
  })

  map.value = loader

  // เพิ่ม Marker
  new window.google.maps.Marker({
    position: { lat: 13.7563, lng: 100.5018 },
    map: loader,
    title: 'Bangkok'
  })

  console.log(' kmlUrls map:', kmlUrls.value)

  // เคลียร์ KML layers เก่าก่อนโหลดใหม่
  kmlLayers.value.forEach(layer => layer.setMap(null))
  kmlLayers.value = []

  if (!kmlUrls.value.length) {
    console.warn('No KML')
    return
  }

  kmlUrls.value.forEach((url) => {
    const layer = new google.maps.KmlLayer({
      url: url,
      map: map.value,
      preserveViewport: true
    })

    layer.addListener('status_changed', () => {
      console.log(`KML status ${url}:`, layer.getStatus())
    })

    kmlLayers.value.push(layer)
  })
}

const token = ''

// const user = ref<any>(null)

onMounted(() => {
  const storedUser = sessionStorage.getItem('user')
  // user.value = storedUser ? JSON.parse(storedUser) : null
  console.log('user', storedUser)
})

// if (authenticated) {
//   const tokenPayload = parseJwt(keycloak.token)
//   if (tokenPayload) {
//     sessionStorage.setItem('user', JSON.stringify(tokenPayload))
//     sessionStorage.setItem('token', keycloak.token)
//     navigateTo('/map/google')
//   } else {
//     console.error('Invalid token payload')
//   }
// }

// onMounted(async () => {
//   try {
//     // await fetchMapData()
//     // await loadGoogleMapsScript()
//     // initMap()

//     const userStr = sessionStorage.getItem('user')
//     const user = userStr ? JSON.parse(userStr) : null
//     console.log('user', user)
//   } catch (error) {
//     console.error('Error:', error)
//   }
// })

const fetchMapData = async (page = 1, perPage = 10) => {
  console.log('token', token)

  try {
    const response = await useFetch(`https://aliza.kudsonmoo.co/red/maps/kml`, {
      query: {
        page,
        perPages: perPage
      },
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      }
    })

    if (response.data.value) {
      mapData.value = response.data.value.files

      kmlUrlsOption.value = mapData.value.map(file => ({
        url: `http://aliza.kudsonmoo.co/s3${file.path}.${file.fileType}`,
        name: file.name
      }))
    }
    // mapData.value = response.data.value.files
    // // console.log('mapData.value', mapData.value)
    // response.data.value.files.forEach(file => {
    //   const fullUrl = `http://aliza.kudsonmoo.co/s3${file.path}.${file.fileType}`
    //   kmlUrls.value.push(fullUrl)
    //   // console.log('Added KML URL:', fullUrl)
    // })
  } catch (err) {
    error.value = err
    console.error('Error fetching map data:', err)
  }
}

const handleSelectChange = async () => {
  if (!selectedKMLUrl.value || selectedKMLUrl.value === 'all') return

  console.log('token', token)

  const apiUrl = `https://aliza.kudsonmoo.co/red/maps/kml/file?filename=${selectedKMLUrl.value}&expiresIn=60`

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      }
    })

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)

    // แปลง response เป็น JSON
    const data = await response.json()

    // ตรวจสอบว่ามี signedUrl หรือไม่
    if (data.signedUrl) {
      kmlUrls.value.push(data.signedUrl)
      initMap()
      console.log('File download:', selectedKMLUrl.value)
    } else {
      console.error('Error:URL API')
    }
  } catch (err) {
    console.error('download file:', err)
  }
}
</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="'map'">
        <template #right>
          <Notification />
          <SwitchLang />
        </template>
      </UDashboardNavbar>

      <div class="container">
        <div class="row visibility-box" style="display: flex;">
          <p>TODAY : 11 Mar, 2024 10:00 น.</p>
          <select id="style-selector-groups" class="styled-select" style="margin-left: 10px;">
            <option value="all" selected>
              TRAFFIC: OFF
            </option>
          </select>
          <select id="style-selector-groups" class="styled-select" style="margin-left: 10px;">
            <option value="all" selected>
              GROUP: ทั้งหมด
            </option>
          </select>

          <select
            v-model="selectedKMLUrl"
            class="styled-select camera-select"
            @change="handleSelectChange"
          >
            <option value="all" selected>
              CAMERA:RC-541 หนองใหญ่ก้าวหน้า
            </option>
            <option v-for="(item, index) in kmlUrlsOption" :key="index" :value="item.name">
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="row map-box">
          <div ref="mapRef" style="width: 100%; height: 500px;" />
          <!-- <div id="map" class="full-size-map"></div> -->
        </div>
      </div>

      <UDashboardPanelContent />
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style scoped>
.styled-select-button {
  appearance: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 5px 5px;
  font-size: 16px;
  background-color: #fff;
  background-position: right 12px center;
  background-repeat: no-repeat;
  cursor: pointer;
  width: 50%;
  box-sizing: border-box;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
}

.row {
  width: 100%;
}

.visibility-box {
  background: white;
  padding: 10px;
  /* text-align: start; */
  font-size: 16px;
  align-items: center;
}

.camera-select {
  margin-left: auto;
}

.map-box {
  flex-grow: 1;
  position: relative;
}

.full-size-map {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  height: 100%;
  width: 100%;
}
</style>
