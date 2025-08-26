<script setup lang="ts">
import { ref, onMounted } from 'vue'

const id = localStorage.getItem('customer') // ดึง id จาก localStorage
const person = ref<any>(null) // ref สำหรับเก็บข้อมูลที่ได้จาก API
const isEditing = ref(false) // state ว่ากำลังแก้ไขอยู่ไหม

// ฟอร์มแก้ไข
const editForm = ref({
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
    const res = await fetch(`http://localhost:3002/api/person/id/${id}`)
    person.value = await res.json()

    // เติมค่าเริ่มต้นลงใน form
    editForm.value.name = person.value.name
    editForm.value.lat = person.value.lat
    editForm.value.long = person.value.long
  } catch (err) {
    console.error('Error fetching person:', err)
  }
}

async function updatePerson() {
  if (!id) return
  try {
    const res = await fetch(`http://localhost:3002/api/person/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: editForm.value.name,
        lat: editForm.value.lat,
        long: editForm.value.long
      })
    })

    if (res.ok) {
      alert('อัปเดตข้อมูลสำเร็จ')
      isEditing.value = false
      await fetchPerson() // โหลดข้อมูลใหม่หลังแก้ไขเสร็จ
    } else {
      const error = await res.json()
      console.error('Update failed:', error)
      alert('อัปเดตไม่สำเร็จ')
    }
  } catch (err) {
    console.error('Error updating person:', err)
  }
}
</script>

<template>
  <div class="container">
    <div class="header">
      <h1 class="title">
        ข้อมูลลูกค้า
      </h1>
      <div class="id-badge">
        <span class="id-label">Customer ID:</span>
        <span class="id-value">{{ id }}</span>
      </div>
    </div>

    <div v-if="person" class="content">
      <div v-if="!isEditing" class="profile-card">
        <div class="profile-header">
          <div class="avatar">
            {{ person.name?.charAt(0)?.toUpperCase() || 'U' }}
          </div>
          <div class="profile-info">
            <h2 class="name">
              {{ person.name }}
            </h2>
            <p class="id-card">
              {{ person.id_card }}
            </p>
          </div>
          <button class="edit-btn" @click="isEditing = true">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
            แก้ไข
          </button>
        </div>

        <div class="details-grid">
          <div class="detail-item">
            <label class="detail-label">Database ID</label>
            <span class="detail-value">{{ person._id }}</span>
          </div>

          <div class="detail-item">
            <label class="detail-label">พิกัด Latitude</label>
            <span class="detail-value coordinate">{{ person.lat }}</span>
          </div>

          <div class="detail-item">
            <label class="detail-label">พิกัด Longitude</label>
            <span class="detail-value coordinate">{{ person.long }}</span>
          </div>

          <div class="detail-item">
            <label class="detail-label">วันที่สร้าง</label>
            <span class="detail-value">{{ new Date(person.createdAt).toLocaleString('th-TH') }}</span>
          </div>

          <div class="detail-item">
            <label class="detail-label">วันที่แก้ไขล่าสุด</label>
            <span class="detail-value">{{ new Date(person.updatedAt).toLocaleString('th-TH') }}</span>
          </div>

          <div class="detail-item">
            <label class="detail-label">เวอร์ชัน</label>
            <span class="detail-value version">v{{ person.__v }}</span>
          </div>
        </div>
      </div>

      <!-- ฟอร์มแก้ไข -->
      <div v-else class="edit-form">
        <div class="form-header">
          <h3>แก้ไขข้อมูลลูกค้า</h3>
        </div>

        <div class="form-group">
          <label class="form-label">ชื่อ-นามสกุล</label>
          <input
            v-model="editForm.name"
            type="text"
            class="form-input"
            placeholder="กรอกชื่อ-นามสกุล"
          >
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Latitude</label>
            <input
              v-model="editForm.lat"
              type="number"
              step="0.0001"
              class="form-input"
              placeholder="0.0000"
            >
          </div>

          <div class="form-group">
            <label class="form-label">Longitude</label>
            <input
              v-model="editForm.long"
              type="number"
              step="0.0001"
              class="form-input"
              placeholder="0.0000"
            >
          </div>
        </div>

        <div class="form-actions">
          <button class="btn-save" @click="updatePerson">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17,21 17,13 7,13 7,21" />
              <polyline points="7,3 7,8 15,8" />
            </svg>
            บันทึกการเปลี่ยนแปลง
          </button>
          <button class="btn-cancel" @click="isEditing = false">
            ยกเลิก
          </button>
        </div>
      </div>
    </div>

    <div v-else class="loading">
      <div class="loading-spinner" />
      <p>กำลังโหลดข้อมูล...</p>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.id-badge {
  display: inline-flex;
  align-items: center;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 25px;
  padding: 8px 20px;
  color: white;
}

.id-label {
  font-size: 0.9rem;
  margin-right: 8px;
  opacity: 0.9;
}

.id-value {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  background: rgba(255,255,255,0.2);
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
}

.content {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  overflow: hidden;
}

.profile-card {
  padding: 0;
}

.profile-header {
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  padding: 30px;
  color: white;
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  border: 3px solid rgba(255,255,255,0.3);
  backdrop-filter: blur(10px);
}

.profile-info {
  flex: 1;
}

.name {
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 5px 0;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.id-card {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
  font-family: 'Courier New', monospace;
}

.edit-btn {
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  padding: 12px 20px;
  border-radius: 25px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.edit-btn:hover {
  background: rgba(255,255,255,0.3);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.details-grid {
  padding: 30px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 1rem;
  color: #333;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #74b9ff;
  font-family: 'Courier New', monospace;
  word-break: break-all;
}

.coordinate {
  background: #e8f4fd;
  border-left-color: #0984e3;
}

.version {
  background: #f0f9ff;
  border-left-color: #0ea5e9;
  font-weight: 600;
}

.edit-form {
  padding: 30px;
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
}

.form-header h3 {
  color: #333;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 15px 20px;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #74b9ff;
  box-shadow: 0 0 0 3px rgba(116, 185, 255, 0.1);
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.btn-save {
  background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 184, 148, 0.3);
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 184, 148, 0.4);
}

.btn-cancel {
  background: #ddd;
  color: #666;
  border: none;
  padding: 15px 30px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background: #ccc;
  transform: translateY(-1px);
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: white;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255,255,255,0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

.loading p {
  font-size: 1.1rem;
  margin: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 15px;
  }

  .title {
    font-size: 2rem;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }

  .details-grid {
    grid-template-columns: 1fr;
    padding: 20px;
    gap: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-save,
  .btn-cancel {
    width: 100%;
  }
}
</style>
