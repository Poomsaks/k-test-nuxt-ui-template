<script setup lang="ts">
// const id = sessionStorage.getItem('memberName')
const id = localStorage.getItem('memberName')
</script>

<template>
  <p>Id จาก URL: {{ id }}</p>
</template>
