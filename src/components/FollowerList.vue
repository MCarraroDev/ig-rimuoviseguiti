<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <div 
      v-for="user in nonFollowers" 
      :key="user"
      class="bg-card-dark rounded-lg p-4 transition-all duration-300 hover:shadow-lg border-2 border-card-dark"
      :class="{ 'border-success bg-success/10': isChecked[user] }"
    >
      <div class="flex items-start justify-between">
        <a 
          :href="'https://instagram.com/' + user"
          target="_blank"
          rel="noopener noreferrer"
          class="text-white hover:text-primary font-medium transition-colors duration-300"
        >
          @{{ user }}
        </a>
        
        <div class="checkbox-wrapper">
          <input
            type="checkbox"
            :id="user"
            v-model="isChecked[user]"
            class="hidden"
          >
          <label 
            :for="user"
            class="w-5 h-5 border-2 rounded flex items-center justify-center cursor-pointer transition-colors duration-300"
            :class="[
              isChecked[user] 
                ? 'border-success bg-success' 
                : 'border-gray-400 hover:border-primary'
            ]"
          >
            <svg
              v-if="isChecked[user]"
              class="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  nonFollowers: {
    type: Array,
    required: true
  }
})

const isChecked = ref({})

// Inizializza lo stato delle checkbox
props.nonFollowers.forEach(user => {
  if (!(user in isChecked.value)) {
    isChecked.value[user] = false
  }
})
</script>
