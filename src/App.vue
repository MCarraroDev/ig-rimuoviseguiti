<template>
  <div class="min-h-screen bg-app-dark text-white">
    <header class="py-6">
      <h1 class="text-3xl font-bold text-center">Gestione Follower Instagram</h1>
      <p class="text-center mt-2 text-gray-300">Scopri chi non ti segue su Instagram in modo sicuro e privato</p>
    </header>

    <main class="container mx-auto px-4">
      <!-- Istruzioni -->
      <div v-if="!nonFollowers.length" class="mb-8 bg-card-dark rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Come Scaricare i Dati da Instagram</h2>
        <ol class="list-decimal list-inside space-y-2 text-gray-300">
          <li>Vai nella home del tuo profilo Instagram</li>
          <li>Apri le impostazioni (3 linee orizzontali in alto a destra)</li>
          <li>Seleziona "La tua attività"</li>
          <li>Scorri fino in fondo e clicca "Scarica le tue informazioni"</li>
          <li>Clicca "Scarica o trasferisci informazioni"</li>
          <li>Seleziona l'account desiderato</li>
          <li>Clicca "Alcune delle tue informazioni"</li>
          <li>Nella voce "Contatti" seleziona "Follower e persone/Pagine seguite"</li>
          <li>Clicca "Scarica sul dispositivo"</li>
          <li>Attendi la mail con il file .zip (potrebbe richiedere diverse ore)</li>
        </ol>

        <div class="mt-6 p-4 bg-blue-900/30 rounded-lg">
          <h3 class="text-lg font-medium mb-2">📱 Dopo aver ricevuto il file:</h3>
          <ol class="list-decimal list-inside space-y-2 text-gray-300">
            <li>Estrai il file .zip scaricato (ti servirà solo la cartella "connections")</li>
            <li>Carica i file HTML dei follower e following qui sotto</li>
          </ol>
        </div>

        <div class="mt-6 p-4 bg-green-900/30 rounded-lg">
          <h3 class="text-lg font-medium mb-2">🔒 Privacy Garantita</h3>
          <p class="text-gray-300">L'applicazione elabora i dati completamente nel tuo browser. Nessuna informazione viene inviata a server esterni o memorizzata online, garantendo la massima sicurezza e privacy dei tuoi dati.</p>
        </div>
      </div>

      <file-upload-section 
        @files-loaded="handleFilesLoaded"
        :isProcessing="isProcessing" 
      />

      <follower-list 
        v-if="nonFollowers.length > 0"
        :nonFollowers="nonFollowers"
      />
    </main>

    <footer class="py-6 mt-8 border-t border-gray-800">
      <p class="text-center text-gray-400">
        Sviluppato con ❤️ da 
        <a href="https://github.com/MCarraroDev" target="_blank" rel="noopener noreferrer" class="text-primary hover:text-primary/80">Marco Carraro</a>
      </p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FileUploadSection from './components/FileUploadSection.vue'
import FollowerList from './components/FollowerList.vue'
import { processFiles } from './assets/js/fileProcessor'

const isProcessing = ref(false)
const nonFollowers = ref([])

const handleFilesLoaded = async (files) => {
  isProcessing.value = true
  try {
    const result = await processFiles(files)
    nonFollowers.value = result
  } catch (error) {
    console.error('Errore durante l\'elaborazione dei file:', error)
    // Qui potremmo usare SweetAlert2 per mostrare l'errore
  } finally {
    isProcessing.value = false
  }
}
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
