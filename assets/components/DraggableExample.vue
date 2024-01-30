<script setup>
import { ref } from "vue";
import draggable from "vuedraggable";
import TimePeriod from "@components/TimePeriod/TimePeriod.vue";

let idCounter = 0;
const myArray = ref([]); //defineModel('myArray');
const drag = ref(false);

function addItemInArray() {
  if (!myArray.value) {
    myArray.value = [];
  }
  myArray.value.push({
    id: idCounter++,
    timer: 10,
    description: "Description " + (idCounter - 1),
  });
}
</script>
<template>
  <button @click="addItemInArray">Add Item</button>
  <!-- <draggable
    v-model="myArray"
    tag="transition-group"
    :component-data="{ name: 'fade' }"
  >
    <template #item="{ element }">
      <div>{{ element.description }}</div>
    </template>
  </draggable> -->
  <draggable
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
  </draggable>
  <!-- <div v-for="item in myArray">
    <span>{{ item.description }}</span>
  </div> -->
</template>
