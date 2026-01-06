<script setup lang="ts">
defineProps<{
  total: number
  pending: number
  confirmed: number
  cancelled: number
}>()
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div class="card">
      <p class="text-sm text-gray-600">Tổng cộng</p>
      <p class="text-2xl font-bold">{{ total }}</p>
    </div>

    <div class="card">
      <p class="text-sm text-gray-600">Chờ xử lý</p>
      <p class="text-2xl font-bold text-orange-600">{{ pending }}</p>
    </div>

    <div class="card">
      <p class="text-sm text-gray-600">Đã xác nhận</p>
      <p class="text-2xl font-bold text-green-600">{{ confirmed }}</p>
    </div>

    <div class="card">
      <p class="text-sm text-gray-600">Đã hủy</p>
      <p class="text-2xl font-bold text-red-600">{{ cancelled }}</p>
    </div>
  </div>
</template>
