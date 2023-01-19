<script setup>
import { ref } from "vue";
import RaceTrack from "../components/RaceTrack.vue";
import LeaderBoard from "../components/LeaderBoard.vue";

const isRaceTrack = ref(false);

const startRace = () => {
  isRaceTrack.value = !isRaceTrack.value;
};
</script>
<template>
  <div id="container">
    <Transition>
      <RaceTrack
        class="cards"
        :style="{ width: '80vw' }"
        v-if="isRaceTrack"
        @quitRace="isRaceTrack = false"
      />
    </Transition>
    <div id="card-container">
      <div v-show="!isRaceTrack" class="startRaceCard cards">
        <div>
          <div class="logo"><img src="../assets/flash-typer.png" alt="" /></div>
          <div>
            <h2>Flash Typer Play - The Global Typing Competition</h2>
            <p>Increase your typing speed while racing against others!</p>
          </div>
        </div>
        <Button @click="startRace" class="startBtn p-button-success"
          >Start Race</Button
        >
      </div>
      <div v-show="!isRaceTrack" class="cards practiceCard">
        <div>
          <h2>Typing Test</h2>
          <p>Increase your typing speed while racing against others!</p>
        </div>
        <Button @click="startRace" class="practiceBtn p-button-info"
          >Practice Yourself</Button
        >
      </div>
      <div v-show="!isRaceTrack" class="cards createTrackCard">
        <div>
          <h2>Race your friends</h2>
          <p>Increase your typing speed while racing against others!</p>
        </div>
        <Button @click="startRace" class="createTrackBtn p-button-warning"
          >Create Racetrack</Button
        >
      </div>
      <div class="cards createAccountCard">
        <div>
          <h2>Record your races with a TypeRacer Account!</h2>
          <p>Increase your typing speed while racing against others!</p>
        </div>
        <Button @click="startRace" class="createAccountBtn p-button-warning"
          >Create Account</Button
        >
      </div>
    </div>
    <LeaderBoard class="cards" :style="{ width: '80vw' }" />
  </div>
</template>

<style scoped>
#container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 30px 0;
  width: 100vw;
}

#card-container {
  display: grid;
  gap: 30px;
  width: 80%;
  grid-template-areas:
    "startRace startRace"
    "practice createTrack"
    "createAccount createAccount";
}
.cards {
  border-radius: var(--border-radius);
  background-color: var(--surface-100);
  padding: 20px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  color: var(--primary-color);
  min-height: 20vh;

  width: 100%;
}

.startRaceCard {
  grid-area: startRace;
}
.practiceCard {
  grid-area: practice;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.createTrackCard {
  grid-area: createTrack;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.createAccountCard {
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-area: createAccount;
  background-color: var(--primary-color);
  color: white;
}

.startRaceCard > div:first-child {
  display: flex;
  align-items: center;
  gap: 15px;
}
.logo {
  width: 12%;
}
.logo > img {
  width: 100%;
}
.logo + div {
  height: 100%;
  display: flex;
  color: var(--primary-color);
  flex-direction: column;
}
.startRaceCard .startBtn {
  font-size: 30px;
  width: 30%;
}

.p-button {
  justify-content: center;
  font-size: 20px;
  width: 50%;
  font-weight: 600;
}

.createAccountCard .p-button {
  width: 30%;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
