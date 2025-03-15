<template>
  <div class="mb-8">
    <div 
      v-if="!filesLoaded"
      class="flex flex-col sm:flex-row items-center justify-center gap-4" 
      :class="{ 'opacity-50': isProcessing }"
    >
      <label 
        for="followers"
        class="w-full sm:w-64 px-6 py-4 bg-primary hover:bg-primary/90 rounded-lg cursor-pointer transition-all duration-300 text-center relative overflow-hidden"
        :class="{
          'bg-success hover:bg-success/90': followersFile && !followersError,
          'bg-red-500 hover:bg-red-600': followersError
        }"
      >
        <span v-if="followersError" class="text-white font-medium">
          File non valido
        </span>
        <span v-else-if="followersFile" class="text-white font-medium">
          ✓
        </span>
        <span v-else class="text-white font-medium">
          Followers
          <span class="block text-sm opacity-75 mt-1">Carica file HTML</span>
        </span>
        <input
          type="file"
          id="followers"
          accept=".html"
          class="hidden"
          @change="handleFollowersFile"
          :disabled="isProcessing"
        >
      </label>

      <label 
        for="following"
        class="w-full sm:w-64 px-6 py-4 bg-primary hover:bg-primary/90 rounded-lg cursor-pointer transition-all duration-300 text-center relative overflow-hidden"
        :class="{
          'bg-success hover:bg-success/90': followingFile && !followingError,
          'bg-red-500 hover:bg-red-600': followingError
        }"
      >
        <span v-if="followingError" class="text-white font-medium">
          File non valido
        </span>
        <span v-else-if="followingFile" class="text-white font-medium">
          ✓
        </span>
        <span v-else class="text-white font-medium">
          Following
          <span class="block text-sm opacity-75 mt-1">Carica file HTML</span>
        </span>
        <input
          type="file"
          id="following"
          accept=".html"
          class="hidden"
          @change="handleFollowingFile"
          :disabled="isProcessing"
        >
      </label>
    </div>

    <div v-if="isProcessing" class="mt-6 text-center">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mb-2"></div>
      <p class="text-lg text-gray-300">Elaborazione in corso...</p>
    </div>

    <div v-if="errorMessage" class="mt-6 text-center text-red-500">
      <p class="text-lg">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isProcessing: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['files-loaded'])

const followersFile = ref(null)
const followingFile = ref(null)
const followersError = ref(false)
const followingError = ref(false)
const errorMessage = ref('')
const filesLoaded = ref(false)

const validateFile = (file) => {
  if (!file) return false
  if (!file.name.toLowerCase().endsWith('.html')) {
    errorMessage.value = 'Per favore, seleziona un file HTML'
    return false
  }
  return true
}

const handleFollowersFile = (event) => {
  const file = event.target.files[0]
  followersError.value = !validateFile(file)
  followersFile.value = followersError.value ? null : file
  if (!followersError.value) errorMessage.value = ''
  checkAndEmitFiles()
}

const handleFollowingFile = (event) => {
  const file = event.target.files[0]
  followingError.value = !validateFile(file)
  followingFile.value = followingError.value ? null : file
  if (!followingError.value) errorMessage.value = ''
  checkAndEmitFiles()
}

const checkAndEmitFiles = () => {
  if (followersFile.value && followingFile.value) {
    filesLoaded.value = true
    emit('files-loaded', {
      followers: followersFile.value,
      following: followingFile.value
    })
  }
}

// Reset dei file quando isProcessing cambia da true a false
watch(() => props.isProcessing, (newVal, oldVal) => {
  if (oldVal && !newVal) {
    followersFile.value = null
    followingFile.value = null
    followersError.value = false
    followingError.value = false
    errorMessage.value = ''
  }
})
</script>
