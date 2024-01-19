<script setup>
import { ref, watch } from "vue";

const EXERCISE_TIME_UNIT = 1000; // seconds
const props = defineProps({
  timer: String,
  description: String,
  timerIndex: Number,
  isStart: Boolean,
  isSkipSound: Boolean
});
const formatTimer = ref(timeFormater(props.timer));
const timerFinished = ref(false);
const emit = defineEmits(['finish', 'delete']);

watch(
  () => props.isStart,
  (newValue) => {
    if (newValue) {
      startTimePeriod();
    }
  }
);

function timeFormater(timer) {
  return (
    parseInt(timer / 60)
      .toString()
      .padStart(2, "0") +
    ":" +
    (timer % 60).toString().padStart(2, "0")
  );
}

// @click delete time period from data
function deleteTimeSlot() {
  emit('delete',props.timerIndex);
}

// Start timer
function startTimePeriod() {
  let timer = props.timer; // seconds
  let sound = new Audio("./../assets/tones/change.m4a");
  timerFinished.value = false;
  let intervalID = setInterval(() => {
    --timer;
    if (timer === 0) {
      if (!props.isSkipSound) {
        sound.play().catch(e => alert(e));
      }
      clearInterval(intervalID);
      timerFinished.value = true;
      formatTimer.value = timeFormater(props.timer);
      emit('finish');
      return;
    }
    formatTimer.value = timeFormater(timer);
  }, EXERCISE_TIME_UNIT);
}
</script>

<template>
  <div
    :class="[
      'text-5xl clock rounded-xl p-4 shadow-lg border mb-4',
      { 'shadow-red-700 border-red-700': isStart && timerFinished },
      { 'shadow-green-700 border-green-700': isStart && !timerFinished },
    ]"
  >
    <div class="flex justify-between">
      <div id="timerContainer">{{ formatTimer }}</div>
      <div>{{ description }}</div>
      <div class="flex">
        <img
          src="./../images/delete.svg"
          width="56"
          height="56"
          @click="deleteTimeSlot"
        />
      </div>
    </div>
  </div>
</template>
