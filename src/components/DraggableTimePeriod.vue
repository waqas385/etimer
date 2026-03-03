<script setup lang="ts">
import TimePeriod from './TimePeriod.vue';

interface TimePeriod {
  id: number;
  timer: number;
  description: string;
  isStart: boolean;
  isPaused: boolean;
  isSkipSound: boolean;
  remainingTime?: number;
}

const props = defineProps<{
  modelValue: TimePeriod[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: TimePeriod[]): void;
  (e: 'task-finish', taskId: number): void;
  (e: 'delete-task', taskId: number): void;
}>();

// Manual reordering functions
function moveItemUp(index: number) {
  if (index > 0) {
    const newList = [...props.modelValue];
    // Use a temporary variable to help TypeScript understand the types
    const itemAbove = newList[index - 1];
    const currentItem = newList[index];
    
    if (itemAbove && currentItem) {
      newList[index - 1] = currentItem;
      newList[index] = itemAbove;
      emit('update:modelValue', newList);
    }
  }
}

function moveItemDown(index: number) {
  if (index < props.modelValue.length - 1) {
    const newList = [...props.modelValue];
    const currentItem = newList[index];
    const itemBelow = newList[index + 1];
    
    if (currentItem && itemBelow) {
      newList[index] = itemBelow;
      newList[index + 1] = currentItem;
      emit('update:modelValue', newList);
    }
  }
}

function moveToTop(index: number) {
  if (index > 0) {
    const newList = [...props.modelValue];
    const [item] = newList.splice(index, 1);
    // Add a type guard to ensure item exists
    if (item) {
      newList.unshift(item);
      emit('update:modelValue', newList);
    }
  }
}

function moveToBottom(index: number) {
  if (index < props.modelValue.length - 1) {
    const newList = [...props.modelValue];
    const [item] = newList.splice(index, 1);
    // Add a type guard to ensure item exists
    if (item) {
      newList.push(item);
      emit('update:modelValue', newList);
    }
  }
}

function handleTaskFinish(taskId: number) {
  emit('task-finish', taskId);
}

function deleteTask(taskId: number) {
  emit('delete-task', taskId);
}
</script>

<template>
  <div class="space-y-3">
    <div v-for="(element, index) in modelValue" :key="element.id">
      <div class="flex items-start gap-2">
        <!-- Reorder controls -->
        <div class="flex flex-col items-center bg-gray-100 rounded-lg p-1 shadow-inner">
          <button 
            @click="moveToTop(index)" 
            :disabled="index === 0"
            class="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded disabled:opacity-30 disabled:hover:bg-transparent transition"
            title="Move to top"
          >
            ⏫
          </button>
          <button 
            @click="moveItemUp(index)" 
            :disabled="index === 0"
            class="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded disabled:opacity-30 disabled:hover:bg-transparent transition"
            title="Move up"
          >
            ↑
          </button>
          <div class="drag-handle w-8 h-8 flex items-center justify-center cursor-move text-gray-500 hover:bg-gray-200 rounded">
            ⋮⋮
          </div>
          <button 
            @click="moveItemDown(index)" 
            :disabled="index === modelValue.length - 1"
            class="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded disabled:opacity-30 disabled:hover:bg-transparent transition"
            title="Move down"
          >
            ↓
          </button>
          <button 
            @click="moveToBottom(index)" 
            :disabled="index === modelValue.length - 1"
            class="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded disabled:opacity-30 disabled:hover:bg-transparent transition"
            title="Move to bottom"
          >
            ⏬
          </button>
        </div>
        
        <!-- Timer component -->
        <div class="flex-1">
          <TimePeriod
            :id="element.id"
            :timer="element.timer"
            :description="element.description"
            :is-start="element.isStart"
            :is-paused="element.isPaused"
            :is-skip-sound="element.isSkipSound"
            :remaining-time="element.remainingTime"
            @finish="handleTaskFinish"
            @delete="deleteTask"
          />
        </div>
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-if="modelValue.length === 0" class="text-center text-gray-500 py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      <p class="text-lg mb-2">No tasks yet</p>
      <p class="text-sm">Add a task using the form above</p>
    </div>
  </div>
</template>