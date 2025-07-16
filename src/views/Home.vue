<script setup lang="ts">
import { ref } from 'vue'

const imageError = ref(false)

const handleImageError = () => {
  imageError.value = true
}
</script> 