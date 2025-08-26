<script setup lang="ts">
// import { useRoute } from 'vue-router'

// const route = useRoute()
// const id = route.params.id // ดึง id จาก URL เช่น /users/123
const id = sessionStorage.getItem('memberName')
</script>

<template>
  <p>Id จาก URL: {{ id }}</p>
</template>
