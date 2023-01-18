<script setup>
const props = defineProps(["playerPos", "playerName", "WPM", "rank"]);

const ranks = {
  1: "1st Place",
  2: "2nd Place",
  3: "3rd Place",
  4: "4th Place",
  5: "5th Place",
};
</script>

<template>
  <div id="container">
    <div class="track">
      <div :style="props.playerPos" class="car">{{ props.playerName[0] }}</div>
    </div>
    <div>
      <p v-if="props.rank">{{ ranks[props.rank] }}</p>
      <p>{{ props.WPM }} WPM</p>
    </div>
  </div>
</template>

<style scoped>
#container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}
.track {
  display: flex;
  width: 90%;
  height: 50px;
  align-items: center;
  border-bottom: 2px dashed gray;
  position: relative;
}
.car {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  border: 2px solid red;
  position: absolute;
  transition: all 250ms;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
