<script setup>
import { ref } from 'vue';
import draggable from "vuedraggable";
import TimePeriod from "./TimePeriod/TimePeriod.vue";

const props = defineProps({
  timePeriods: []
});
const timePeriodsRef = ref(props.timePeriods);
// const drag = ref(false);

</script>
<template>
  <draggable
    v-model="timePeriodsRef"
    group="timeperiods"
    item-key="id"
    >
    <!-- @start="drag = true"
    @end="drag = false" -->
    <template #item="{ element }">
      <TimePeriod
        :timer="element.timer"
        :description="element.description"
        :timer-index="element.id"
      />
    </template>
  </draggable>
</template>
