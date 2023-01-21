<script setup>
import { computed } from "vue";

const props = defineProps([
  "playerPos",
  "playerName",
  "WPM",
  "rank",
  "image",
  "idx",
]);

const ranks = {
  0: "no",
  1: "1st Place",
  2: "2nd Place",
  3: "3rd Place",
  4: "4th Place",
  5: "5th Place",
};

const playerStyle = computed(() => {
  return { left: `${props.playerPos}%` };
});
</script>

<template>
  <div id="container">
    <div class="track">
      <div :style="playerStyle" class="car">
        <div
          :style="{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }"
        >
          <p :style="{ fontSize: '14px', color: 'var(--text-color)' }">
            {{ props.playerName }}
          </p>
          <p
            v-if="props.idx == 0"
            :style="{ fontSize: '12px', color: 'var(--text-color-secondary)' }"
          >
            You
          </p>
        </div>
        <img
          :src="[
            props.idx == 0
              ? '../src/assets/flash-bit.png'
              : `../src/assets/${props.image}`,
          ]"
          alt=""
          class="emoji"
        />
      </div>
    </div>
    <div class="stats">
      <p v-if="props.rank" style="font-size: 14px; color: var(--text-color)">
        {{ ranks[props.rank] }}
      </p>
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

.stats {
  display: flex;
  flex-direction: column;
  align-items: center;
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

  position: absolute;
  transition: all 250ms;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji {
  height: 50px;
  width: 50px;
  border-radius: 50%;
}
</style>
