<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div class="card">
    <h2 class="text-xl font-bold text-gray-800 mb-4">Vị trí</h2>
    
    <!-- Map Container -->
    <div ref="mapContainer" class="h-96 rounded-lg overflow-hidden border"></div>

    <!-- Coordinates Info -->
    <div class="mt-4 flex items-center gap-2 text-sm text-gray-600">
      <MapPinIcon class="w-5 h-5" />
      <span>{{ location.lat }}, {{ location.lng }}</span>
      <!-- eslint-disable-next-line vue/no-parsing-error -->
      <a
        :href="googleMapsUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="ml-auto text-blue-600 hover:text-blue-800 flex items-center gap-1"
      >
        <span>Xem trên Google Maps</span>
        <ArrowTopRightOnSquareIcon class="w-4 h-4" />
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { MapPinIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icon issue
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const props = defineProps({
  location: {
    type: Object,
    required: true,
    validator: (val) => val.lat && val.lng
  }
})

const mapContainer = ref(null)
let map = null
let marker = null

const googleMapsUrl = computed(() => {
  return `https://www.google.com/maps?q=${props.location.lat},${props.location.lng}`
})

const initMap = () => {
  if (!mapContainer.value) return

  // Create map
  map = L.map(mapContainer.value).setView(
    [props.location.lat, props.location.lng],
    15
  )

  // Add OpenStreetMap tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map)

  // Add marker with popup
  marker = L.marker([props.location.lat, props.location.lng])
    .addTo(map)
    .bindPopup('Vị trí tiệm cắt tóc')
    .openPopup()
}

const updateMap = () => {
  if (!map || !marker) return

  const newLatLng = [props.location.lat, props.location.lng]
  
  marker.setLatLng(newLatLng)
  map.setView(newLatLng, 15)
}

watch(() => props.location, () => {
  updateMap()
}, { deep: true })

onMounted(() => {
  initMap()
})
</script>

<style scoped>
:deep(.leaflet-container) {
  height: 100%;
  z-index: 1;
}
</style>