<script setup lang="ts">
import { ref, onMounted } from "vue";
import DraggableTimePeriod from "./components/DraggableTimePeriod.vue";

interface TimePeriod {
  id: number;
  timer: number;
  description: string;
  isStart: boolean;
  isPaused: boolean;
  isSkipSound: boolean;
  remainingTime?: number;
}

let appDataCounter = 0;
const timePeriods = ref<TimePeriod[]>([]);
const timeInput = ref("");
const descriptionInput = ref("");
const isPlaying = ref(false);
const currentTaskIndex = ref(0);

// Pre-load sounds
const sounds = {
  start: null as HTMLAudioElement | null,
  change: null as HTMLAudioElement | null,
  finish: null as HTMLAudioElement | null
};

// Initialize sounds on component mount
onMounted(() => {
  try {
    sounds.start = new Audio('/sounds/start-fire.mp3');
    sounds.change = new Audio('/sounds/change.m4a');
    sounds.finish = new Audio('/sounds/finish-celebration.wav');
    
    // Pre-load sounds
    sounds.start.load();
    sounds.change.load();
    sounds.finish.load();
  } catch (error) {
    console.error('Error loading sounds:', error);
  }
});

async function playSound(soundType: 'start' | 'change' | 'finish') {
  try {
    const audio = sounds[soundType];
    if (audio) {
      audio.currentTime = 0;
      await audio.play();
    }
  } catch (error) {
    console.error('Error playing sound:', error);
  }
}

function addTimePeriod() {
  const seconds = parseInt(timeInput.value);
  if (isNaN(seconds) || seconds <= 0 || descriptionInput.value.trim() === "") {
    alert("Please enter valid seconds and description");
    return;
  }
  
  timePeriods.value.push({
    id: appDataCounter++,
    timer: seconds,
    description: descriptionInput.value,
    isStart: false,
    isPaused: false,
    isSkipSound: false,
    remainingTime: seconds
  });
  
  timeInput.value = "";
  descriptionInput.value = "";
}

function startAll() {
  if (timePeriods.value.length === 0) return;
  
  // Play start sound immediately
  playSound("start");
  
  isPlaying.value = true;
  currentTaskIndex.value = 0;
  
  // Reset ALL tasks to initial state with full time
  // This ensures completed tasks start from beginning again
  timePeriods.value = timePeriods.value.map(task => ({
    ...task,
    isStart: false,           // Will set first task to start below
    isPaused: false,
    remainingTime: task.timer, // Reset to full original time
    isSkipSound: false
  }));
  
  // Mark last task to skip completion sound
  const lastTask = timePeriods.value[timePeriods.value.length - 1];
  if (lastTask) {
    lastTask.isSkipSound = true;
  }
  
  // Start first task immediately
  // This will trigger the timer in TimePeriod component
  const firstTask = timePeriods.value[0];
  if (firstTask) {
    firstTask.isStart = true;
  }
  
  console.log('Started tasks:', timePeriods.value); // Debug log
}

function pauseAll() {
  if (!isPlaying.value) return;
  
  isPlaying.value = false;
  timePeriods.value = timePeriods.value.map(task => {
    if (task.isStart) {
      task.isPaused = true;
      task.isStart = false;
    }
    return task;
  });
}

function continueAll() {
  if (timePeriods.value.length === 0 || isPlaying.value) return;
  
  isPlaying.value = true;
  
  // Find the current task (paused or next to start)
  const currentTask = timePeriods.value.find(task => 
    task.isPaused || (!task.isStart && task.remainingTime && task.remainingTime > 0 && task.remainingTime < task.timer)
  );
  
  if (currentTask) {
    currentTask.isPaused = false;
    currentTask.isStart = true;
  } else {
    // Start from beginning if no task is in progress
    startAll();
  }
}

function stopAll() {
  if (timePeriods.value.length > 0) {
    playSound("finish");
  }
  
  isPlaying.value = false;
  currentTaskIndex.value = 0;
  
  // Reset all tasks to full time but not started
  timePeriods.value = timePeriods.value.map(task => ({
    ...task,
    isStart: false,
    isPaused: false,
    remainingTime: task.timer,
    isSkipSound: false
  }));
}

function handleTaskFinish(finishedTaskId: number) {
  const finishedIndex = timePeriods.value.findIndex(t => t.id === finishedTaskId);
  
  console.log('Task finished:', finishedTaskId, 'at index:', finishedIndex); // Debug log
  
  // Mark current task as completed (remainingTime already 0 from TimePeriod)
  const finishedTask = timePeriods.value[finishedIndex];
  if (finishedTask) {
    finishedTask.isStart = false;
    finishedTask.remainingTime = 0;
  }
  
  // Play completion sound if not the last task
  if (finishedIndex !== timePeriods.value.length - 1) {
    playSound("change");
  }
  
  // Start next task if available
  const nextIndex = finishedIndex + 1;
  if (nextIndex < timePeriods.value.length) {
    // Small delay before starting next task for better UX
    setTimeout(() => {
      const nextTask = timePeriods.value[nextIndex];
      if (nextTask) {
        nextTask.isStart = true;
        nextTask.isPaused = false;
        currentTaskIndex.value = nextIndex;
        console.log('Starting next task:', nextTask); // Debug log
      }
    }, 100);
  } else {
    // All tasks completed
    console.log('All tasks completed'); // Debug log
    playSound("finish");
    isPlaying.value = false;
    currentTaskIndex.value = 0;
    
    // All tasks are now completed (remainingTime already 0)
    // They will be reset when user clicks Start again
  }
}

function deleteTask(taskId: number) {
  const taskIndex = timePeriods.value.findIndex(t => t.id === taskId);
  
  // If we're deleting a task that's currently playing or upcoming
  if (isPlaying.value && taskIndex <= currentTaskIndex.value) {
    stopAll();
  }
  
  timePeriods.value = timePeriods.value.filter(t => t.id !== taskId);
  
  // Reset counter if no tasks left
  if (timePeriods.value.length === 0) {
    appDataCounter = 0;
  }
}

// function saveList() {
//   const dataToSave = timePeriods.value.map(({ id, timer, description }) => ({ 
//     id, 
//     timer, 
//     description 
//   }));
//   localStorage.setItem('timerList', JSON.stringify(dataToSave));
//   alert('List saved to browser storage!');
// }

function resetList() {
  if (confirm('Are you sure you want to reset all tasks?')) {
    stopAll();
    timePeriods.value = [];
    appDataCounter = 0;
    localStorage.removeItem('timerList');
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-xl shadow-xl p-6 mb-6">
        <h1 class="text-4xl font-bold text-center text-gray-800 mb-2">My E-Timer App</h1>
        <p class="text-center text-gray-600">Manage your tasks with ease</p>
      </div>
      
      <!-- Input Form -->
      <div class="bg-white rounded-xl shadow-xl p-6 mb-6">
        <div class="flex flex-wrap gap-3">
          <input
            type="number"
            placeholder="Time in seconds"
            class="flex-1 min-w-[200px] border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-400 focus:outline-none transition"
            v-model="timeInput"
            min="1"
            @keyup.enter="addTimePeriod"
          />
          <input
            type="text"
            placeholder="Task description..."
            class="flex-1 min-w-[200px] border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-400 focus:outline-none transition"
            v-model="descriptionInput"
            @keyup.enter="addTimePeriod"
          />
          <button
            class="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition flex items-center gap-2 shadow-md hover:shadow-lg"
            @click="addTimePeriod"
          >
            <span class="text-xl">+</span> Add Task
          </button>
        </div>
        
        <div class="mt-2 text-sm text-gray-500">
          Press Enter to quickly add task
        </div>
      </div>

      <!-- Task List -->
      <div class="bg-white rounded-xl shadow-xl p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-700">Tasks</h2>
          <div class="flex gap-2">
            <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {{ timePeriods.length }} {{ timePeriods.length === 1 ? 'task' : 'tasks' }}
            </span>
            <span v-if="isPlaying" class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Task {{ currentTaskIndex + 1 }} of {{ timePeriods.length }}
            </span>
          </div>
        </div>
        <DraggableTimePeriod
          v-model="timePeriods"
          @task-finish="handleTaskFinish"
          @delete-task="deleteTask"
        />
      </div>

      <!-- Control Buttons -->
      <div class="bg-white rounded-xl shadow-xl p-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            class="col-span-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-500"
            @click="startAll"
            :disabled="timePeriods.length === 0 || isPlaying"
          >
            ▶ Start
          </button>
          <button
            class="col-span-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-yellow-500"
            @click="pauseAll"
            :disabled="!isPlaying"
          >
            ⏸ Pause
          </button>
          <button
            class="col-span-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
            @click="continueAll"
            :disabled="isPlaying || timePeriods.length === 0"
          >
            ▶ Continue
          </button>
          <button
            class="col-span-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition shadow-md hover:shadow-lg"
            @click="stopAll"
          >
            ⏹ Stop
          </button>
          <button
            class="col-span-2 md:col-span-4 px-4 py-3 bg-red-700 hover:bg-red-800 text-white rounded-lg font-semibold transition shadow-md hover:shadow-lg"
            @click="resetList"
          >
            ↺ Reset All Tasks
          </button>
        </div>
        
        <!-- Status indicator -->
        <div v-if="timePeriods.length > 0" class="mt-4 text-center">
          <div class="text-sm font-medium" :class="{
            'text-green-600': isPlaying,
            'text-gray-600': !isPlaying && timePeriods.every(t => t.remainingTime === 0),
            'text-gray-400': !isPlaying && !timePeriods.every(t => t.remainingTime === 0)
          }">
            <span v-if="isPlaying">● Timer running - Task {{ currentTaskIndex + 1 }} of {{ timePeriods.length }}</span>
            <span v-else-if="timePeriods.every(t => t.remainingTime === 0)" class="text-gray-600">● All tasks completed - Click Start to begin again</span>
            <span v-else class="text-gray-400">● Timer stopped</span>
          </div>
          
          <!-- Progress bar for overall completion -->
          <div v-if="timePeriods.length > 0" class="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-blue-600 h-2 rounded-full transition-all duration-300"
              :style="{ 
                width: `${(timePeriods.filter(t => t.remainingTime === 0).length / timePeriods.length) * 100}%` 
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>