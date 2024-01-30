<script setup>
import { ref, watch } from "vue";
// import TimePeriod from "@components/TimePeriod/TimePeriod.vue";
import { playSound } from "./PlaySound.js";
// import draggable from "vuedraggable";
import DraggableTimePeriod from "@components/DraggableTimePeriod.vue";
import DraggableExample from "./DraggableExample.vue";
import DraggableExample2 from "./DraggableExample2.vue";

let appDataCounter = 0;
// const timePeriods = defineModel('timePeriods');
const timePeriods = ref([]);//defineModel();
const time = ref("");
const description = ref("");
const playIndex = ref(0);
const resetButtonDisabled = ref(false);

timePeriods.value = []; // Initialize 

watch(playIndex, (newValue) => {
  if (timePeriods.value[playIndex.value]) {
    timePeriods.value[playIndex.value].isStart = true;
  }
  if (newValue === timePeriods.value.length) {
    resetButtonDisabled.value = false;
    playSound("finish-celebration.wav");
  }
});

let counterTest = 5;
function addTimePeriod() {
  if (time.value.trim() === '' || description.value.trim() === '') {
    return; // do nothing
  }
  timePeriods.value.push({
    id: appDataCounter++,
    timer: time.value,
    description: description.value,
    isSkipSound: false,
  });
  /*
  myArray.value.push({
    id: ++counterTest,
    timer: time.value,
    description: description.value,
    isSkipSound: false,
  })
  */
  time.value = description.value = ""; // reset
}

function start() {
  playSound("start-fire.mp3");
  playIndex.value = 0;
  resetButtonDisabled.value = true;
  timePeriods.value[playIndex.value].isStart = true;
  // Skip sound for the last item
  const appDataCount = timePeriods.value.length;
  timePeriods.value[appDataCount - 1].isSkipSound = true;
}

function updatePlayingIndex() {
  playIndex.value = playIndex.value + 1;
}

function reset() {
  timePeriods.value = timePeriods.value.map((timer) => {
    timer.isStart = false;
    return timer;
  });
}

function deleteTimePeriod(index) {
  timePeriods.value.splice(index, 1);
}

const myArray = defineModel('myArray');
/*
myArray.value = [
  {
    "id":0,
    "timer": "5",
    "description": "test 1",
    "isSkipSound": false
  },
  {
    "id":1,
    "timer": "5",
    "description": "test 2",
    "isSkipSound": false
  },
  {
    "id":2,
    "timer": "5",
    "description": "test 3",
    "isSkipSound": false
  },
  {
    "id":3,
    "timer": "5",
    "description": "test 4",
    "isSkipSound": false
  },
  {
    "id":4,
    "timer": "5",
    "description": "test 5",
    "isSkipSound": false
  }
];
*/
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
    <h2>Example One</h2>
    <DraggableExample v-model="myArray" />
    <!-- <draggable
      v-model="myArray"
      group="people"
      @start="drag = true"
      @end="drag = false"
      item-key="id"
    >
      <template #item="{ element }">
        <TimePeriod
          :timer="element.timer"
          :description="element.description"
          :timer-index="element.id"
        />
      </template>
    </draggable> -->
    <!-- <draggable
      v-model="timePeriods"
      group="time"
      @start="drag = true"
      @end="drag = false"
      item-key="name"
    >
      <template #item="{ timePeriod }">
        <TimePeriod
          :timer="timePeriod.timer"
          :description="timePeriod.description"
          :timer-index="timePeriod.id"
          :is-start="timePeriod.isStart"
          :is-skip-sound="timePeriod.isSkipSound"
          @finish="updatePlayingIndex"
          @delete="deleteTimePeriod"
        />
      </template>
    </draggable> -->
    <h2>Example 2</h2>
    <DraggableTimePeriod :time-periods="timePeriods"/>
    <h3>Example 3</h3>
    <DraggableExample2 v-model="timePeriods" />
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
