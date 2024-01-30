<script setup>
import { ref, watch, defineEmits } from 'vue';
import draggable from "vuedraggable";
import TimePeriod from "@components/TimePeriod/TimePeriod.vue";
import { playSound } from "./PlaySound.js";

const timePeriods = defineModel();
const playIndex = ref(0);
const emit = defineEmits(['finish']);

watch(playIndex, (newValue) => {
  if (timePeriods.value[playIndex.value]) {
    timePeriods.value[playIndex.value].isStart = true;
  }
  if (newValue === timePeriods.value.length) {
    playSound("finish-celebration.wav");
    emit('finish');
    // Reset playIndex
    playIndex.value = 0;
  }
});

function updatePlayingIndex() {
  playIndex.value = playIndex.value + 1;
}

function deleteTimePeriod(index) {
  timePeriods.value.splice(index, 1);
}

</script>
<template>
  <draggable
    v-model="timePeriods"
    group="people"
    item-key="id"
  >
    <template #item="{ element }">
      <TimePeriod
        :timer="element.timer"
        :description="element.description"
        :timer-index="element.id"
        :is-start="element.isStart"
        :is-skip-sound="element.isSkipSound"
        @finish="updatePlayingIndex"
        @delete="deleteTimePeriod"
      />
    </template>
  </draggable>
</template>
