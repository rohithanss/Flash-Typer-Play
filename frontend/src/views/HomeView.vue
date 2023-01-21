<script setup>
import { ref } from "vue";
import { useToast } from "primevue/usetoast";

import RaceTrack from "../components/RaceTrack.vue";
import LeaderBoard from "../components/LeaderBoard.vue";

const toast = useToast();
const isRaceTrack = ref(false);

const startRace = () => {
  isRaceTrack.value = !isRaceTrack.value;
};
const createPersonalTrack = () => {
  toast.add({
    severity: "warn",
    summary: "Create Room Track",
    detail: "This Feature is under Construction.",
    life: 3000,
  });
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
          <div class="logo" style="display: none">
            <img src="../assets/flash-bit.png" alt="" />
          </div>
          <div class="logo" style="display: none">
            <img src="../assets/deadpoolBit.png" alt="" />
          </div>
          <div class="logo" style="display: none">
            <img src="../assets/captainBit.png" alt="" />
          </div>
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
          <p>Improve your typing skills on your own!</p>
        </div>
        <RouterLink to="/practicetrack">
          <Button class="practiceBtn p-button-info"
            >Practice Yourself</Button
          ></RouterLink
        >
      </div>
      <div v-show="!isRaceTrack" class="cards createTrackCard">
        <div>
          <h2>Race with your friends</h2>
          <p>Create your own racetrack and play with friends!</p>
        </div>
        <Button
          @click="createPersonalTrack"
          class="createTrackBtn p-button-warning"
          >Create Racetrack</Button
        >
      </div>
      <div class="cards createAccountCard">
        <div>
          <h2>Record your races with a TypeRacer Account!</h2>
          <p>
            Save your race history and scores. Customize your profile and car.
            It's free, why not?
          </p>
        </div>
        <RouterLink class="createAccountBtn" to="/signup">
          <Button class="p-button-warning">Create Account</Button></RouterLink
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
  gap: 15px;
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
  margin-top: 15px;
  width: 35%;
}

.p-button {
  justify-content: center;
  font-size: 20px;
  width: 60%;
  font-weight: 600;
}

.createAccountBtn {
  width: 30%;
}
.createAccountCard .p-button {
  width: 100%;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

@media screen and (max-width: 975px) {
  #card-container {
    grid-template-areas:
      "startRace startRace"
      "practice practice"
      "createTrack createTrack"
      "createAccount createAccount";
  }
  .startRaceCard .startBtn {
    width: 40%;
    font-size: 20px;
  }
  .logo {
    width: 16%;
  }
  .createAccountCard {
    flex-direction: column;
    align-items: flex-start;
  }
  .p-button {
    width: 40%;
  }
  .createAccountBtn {
    width: 40%;
  }
}
@media screen and (max-width: 655px) {
  .startRaceCard .startBtn {
    width: 50%;
    font-size: 20px;
  }
  .logo {
    display: none;
  }
  .p-button {
    width: 50%;
  }
  .createAccountBtn {
    width: 50%;
  }
}

@media screen and (max-width: 530px) {
  #card-container {
    width: 90%;
  }
  .startRaceCard .startBtn {
    width: 60%;
    font-size: 20px;
  }
  .cards h2 {
    font-size: 20px;
  }
  .logo {
    display: none;
  }
  .p-button {
    width: 60%;
  }
  .createAccountBtn {
    width: 60%;
  }
}
</style>
