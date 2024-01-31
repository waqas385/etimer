<script setup>
import { ref, watch } from "vue";
import { playSound } from "@components/PlaySound";

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
  emit('delete', props.timerIndex);
}

// Start timer
function startTimePeriod() {
  let timer = props.timer; // seconds
  timerFinished.value = false;
  let intervalID = setInterval(() => {
    --timer;
    if (timer === 0) {
      if (!props.isSkipSound) {
        playSound("change.m4a");
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
  <div :class="[
    'text-5xl clock rounded-xl p-4 shadow-lg border mb-6 cursor-move',
    { 'shadow-red-700 border-red-700': isStart && timerFinished },
    { 'shadow-green-700 border-green-700': isStart && !timerFinished },
  ]">
    <div class="flex justify-between">
      <div id="timerContainer">{{ formatTimer }}</div>
      <div>{{ description }}</div>
      <div class="flex">
        <button title="Delete time">
          <img src="./images/delete.svg" width="40" height="40" @click="deleteTimeSlot" />
        </button>
      </div>
    </div>
  </div>
</template>
