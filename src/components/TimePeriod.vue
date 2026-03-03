<script setup lang="ts">
import { ref, watch, onUnmounted, computed } from "vue";

const TICK_INTERVAL = 1000;

const props = defineProps({
  id: Number,
  timer: Number,
  description: String,
  isStart: Boolean,
  isPaused: Boolean,
  isSkipSound: Boolean,
  remainingTime: Number
});

const emit = defineEmits(['finish', 'delete']);

// State
const currentTime = ref(props.remainingTime ?? props.timer ?? 0);
const timerFinished = ref(props.remainingTime === 0); // Initialize based on remainingTime
const intervalId = ref<number | null>(null);
const progress = ref(100);

// Computed
const formattedTime = computed(() => {
  const minutes = Math.floor(currentTime.value / 60);
  const seconds = currentTime.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const totalTime = computed(() => props.timer ?? 0);

const statusText = computed(() => {
  if (timerFinished.value) return '✓ Complete';
  if (props.isStart && !props.isPaused && currentTime.value > 0) return '▶ Running';
  if (props.isPaused) return '⏸ Paused';
  if (currentTime.value === 0) return '✓ Complete';
  return '⏹ Ready';
});

const statusColor = computed(() => {
  if (timerFinished.value || currentTime.value === 0) return 'text-gray-500';
  if (props.isStart && !props.isPaused) return 'text-green-600';
  if (props.isPaused) return 'text-yellow-600';
  return 'text-gray-400';
});

const borderColor = computed(() => {
  if (timerFinished.value || currentTime.value === 0) return 'border-gray-300';
  if (props.isStart && !props.isPaused) return 'border-green-500 shadow-green-200';
  if (props.isPaused) return 'border-yellow-500 shadow-yellow-200';
  return 'border-gray-200';
});

// Methods
function startTimer() {
  if (intervalId.value || currentTime.value <= 0) return;
  
  console.log(`Starting timer for task ${props.id}, time: ${currentTime.value}`);
  
  intervalId.value = setInterval(() => {
    if (currentTime.value > 0) {
      currentTime.value -= 1;
      progress.value = (currentTime.value / totalTime.value) * 100;
      
      console.log(`Task ${props.id} tick: ${currentTime.value}`);
    }
    
    if (currentTime.value === 0) {
      console.log(`Task ${props.id} finished!`);
      stopTimer();
      timerFinished.value = true;
      emit('finish', props.id);
    }
  }, TICK_INTERVAL);
}

function stopTimer() {
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
}

function deleteTask() {
  stopTimer();
  emit('delete', props.id);
}

// Watchers
watch(() => props.isStart, (newValue) => {
  console.log(`Task ${props.id} isStart changed to:`, newValue, 'paused:', props.isPaused, 'currentTime:', currentTime.value);
  
  if (newValue && !props.isPaused && currentTime.value > 0) {
    // Reset finished state if starting again
    if (timerFinished.value) {
      timerFinished.value = false;
    }
    startTimer();
  } else if (!newValue && props.isPaused) {
    stopTimer();
  }
}, { immediate: true });

watch(() => props.remainingTime, (newValue) => {
  console.log(`Task ${props.id} remainingTime changed to:`, newValue);
  
  if (newValue !== undefined) {
    currentTime.value = newValue;
    progress.value = (newValue / totalTime.value) * 100;
    
    // Update timerFinished based on remainingTime
    timerFinished.value = newValue === 0;
  }
}, { immediate: true });

watch(() => props.timer, (newValue) => {
  if (newValue !== undefined && !props.isStart) {
    currentTime.value = newValue;
    progress.value = 100;
    timerFinished.value = false;
  }
});

// Watch currentTime to detect when it reaches zero
watch(currentTime, (newValue) => {
  if (newValue === 0 && !timerFinished.value) {
    timerFinished.value = true;
  }
});

// Lifecycle
onUnmounted(() => {
  stopTimer();
});
</script>

<template>
  <div 
    class="relative overflow-hidden rounded-xl border-2 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
    :class="borderColor"
  >
    <!-- Progress bar - only show when running or paused -->
    <div 
      v-if="!timerFinished && currentTime > 0 && (props.isStart || props.isPaused)"
      class="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-green-400 transition-all duration-1000"
      :style="{ width: `${progress}%` }"
    ></div>
    
    <!-- Main content -->
    <div class="p-4">
      <div class="flex flex-wrap items-center gap-4">
        <!-- Timer -->
        <div class="font-mono text-4xl font-bold text-gray-800 min-w-[120px]">
          {{ formattedTime }}
        </div>
        
        <!-- Description -->
        <div class="flex-1 min-w-[200px]">
          <div class="text-lg font-medium text-gray-700">
            {{ description }}
          </div>
          <div class="text-sm text-gray-500">
            ID: #{{ id }} • {{ totalTime }} seconds
          </div>
        </div>
        
        <!-- Status -->
        <div class="min-w-[100px] text-right">
          <div class="font-semibold" :class="statusColor">
            {{ statusText }}
          </div>
          <div v-if="props.isStart && !props.isPaused && !timerFinished && currentTime > 0" class="text-xs text-gray-400">
            {{ currentTime }}s remaining
          </div>
          <div v-if="timerFinished || currentTime === 0" class="text-xs text-green-600">
            Completed
          </div>
        </div>
        
        <!-- Delete button - ALWAYS VISIBLE -->
        <button 
          @click="deleteTask"
          class="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200 flex-shrink-0"
          title="Delete task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 4V2h8v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
      
      <!-- Additional info for completed tasks -->
      <div v-if="timerFinished || currentTime === 0" class="mt-2 text-xs text-gray-400 border-t pt-2">
        Task completed • Click Start to run again
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Subtle pulse animation for running timers */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.border-green-500 {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Hover effect for delete button */
button:hover svg {
  transform: scale(1.1);
  transition: transform 0.2s;
}
</style>