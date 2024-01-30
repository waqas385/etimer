<script setup>
import draggable from "vuedraggable";
import TimePeriod from "@components/TimePeriod/TimePeriod.vue";

const timePeriods = defineModel();
</script>
<template>
  <draggable
    v-model="timePeriods"
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
  </draggable>
</template>
