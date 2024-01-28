<script setup>
import { ref, watch } from "vue";
import TimePeriod from "@components/TimePeriod/TimePeriod.vue";
import { playSound } from "./PlaySound.js";

const appData = ref([]);
const time = ref("");
const description = ref("");
const playIndex = ref(0);
const resetButtonDisabled = ref(false);

watch(playIndex, (newValue) => {
  if (appData.value[playIndex.value]) {
    appData.value[playIndex.value].isStart = true;
  }
  if (newValue === appData.value.length) {
    resetButtonDisabled.value = false;
    playSound('finish-celebration.wav');
  }
});

function addTimePeriod() {
  appData.value.push({
    timer: time.value,
    description: description.value,
    isSkipSound: false,
  });
  time.value = description.value = ""; // reset
}

function start() {
  playSound('start-fire.mp3');
  playIndex.value = 0;
  resetButtonDisabled.value = true;
  appData.value[playIndex.value].isStart = true;
  // Skip sound for the last item
  const appDataCount = appData.value.length;
  appData.value[appDataCount - 1].isSkipSound = true;
}

function updatePlayingIndex() {
  playIndex.value = playIndex.value + 1;
}

function reset() {
  appData.value = appData.value.map((timer) => {
    timer.isStart = false;
    return timer;
  });
}

function deleteTimePeriod(index) {
  appData.value.splice(index, 1);
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
    <TimePeriod
      v-for="(timePeriod, timeIndex) in appData"
      :timer="timePeriod.timer"
      :description="timePeriod.description"
      :timer-index="timeIndex"
      :is-start="timePeriod.isStart"
      :is-skip-sound="timePeriod.isSkipSound"
      @finish="updatePlayingIndex"
      @delete="deleteTimePeriod"
    ></TimePeriod>
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
