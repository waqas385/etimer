<script setup>
import { ref } from "vue";
import { playSound } from "./PlaySound.js";
import DraggableTimePeriod from "@components/DraggableTimePeriod.vue";

let appDataCounter = 0;
const timePeriods = ref([]);
const time = ref("");
const description = ref("");
const resetButtonDisabled = ref(false);

timePeriods.value = []; // Initialize
function addTimePeriod() {
  if (time.value.trim() === "" || description.value.trim() === "") {
    return; // do nothing
  }
  timePeriods.value.push({
    id: appDataCounter++,
    timer: time.value,
    description: description.value,
    isSkipSound: false,
  });
  time.value = description.value = ""; // reset
}

function start() {
  playSound("start-fire.mp3");
  resetButtonDisabled.value = true;

  const TIME_PERIODS_START_INDEX = 0;
  timePeriods.value[TIME_PERIODS_START_INDEX].isStart = true;
  // Skip sound for the last item
  // timePeriods.value[timePeriods.value.length - 1].isSkipSound = true;
}

function reset() {
  timePeriods.value = timePeriods.value.map((timer, timerIndex) => {
    timer.isStart = false;
    timer.isSkipSound = timerIndex === timePeriods.value.length - 1;
    return timer;
  });
}
</script>

<template>
  <div class="p-6">
    <div class="flex pb-6">
      <input
        type="text"
        placeholder="time in seconds"
        class="border rounded-md p-4 shadow-lg"
        :value="time"
        @keyup="time = $event.target.value"
        @change="time = $event.target.value"
      />&nbsp;
      <input
        type="text"
        placeholder="Description..."
        class="border rounded-md p-4 shadow-lg"
        :value="description"
        @keyup="description = $event.target.value"
        @change="description = $event.target.value"
      />
      <button
        class="flex justify-center ml-3 p-4 shadow-lg bg-blue-400 border-r-slate-50 rounded-md"
        @click="addTimePeriod"
      >
        <img src="./../images/addtime.svg" height="24" width="24" />&nbsp;Add
      </button>
    </div>
    <DraggableTimePeriod
      v-model="timePeriods"
      @finish="resetButtonDisabled = false"
    />
    <div class="pt-2">
      <button
        class="p-4 shadow-lg bg-blue-400 border-r-slate-50 rounded-md"
        @click="start"
      >
        Start
      </button>
      <button
        class="ml-3 p-4 shadow-lg bg-blue-400 border-r-slate-50 rounded-md"
        @click="save"
      >
        Save
      </button>
      <button
        :class="[
          'ml-3 p-4 shadow-lg border-r-slate-50 rounded-md',
          { 'bg-red-500': !resetButtonDisabled },
          { 'bg-red-400 text-gray-700': resetButtonDisabled },
        ]"
        :disabled="resetButtonDisabled"
        @click="reset"
      >
        Reset
      </button>
    </div>
  </div>
</template>
