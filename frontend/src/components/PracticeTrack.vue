<script setup>
import axios from "axios";
import { io } from "socket.io-client";
import { ref, computed, inject } from "vue";
import PlayerTrack from "../components/PlayerTrack.vue";

const url = inject("backendURL");

const emits = defineEmits(["quitRace"]);

const text = ref("");
const wordsPerMin = ref(0);
const isCongrats = ref({ display: "none" });
const isResult = ref(false);
const isPlayerReady = ref(false);
const startIn = ref(10);
const correct = ref(true);
let intervalId = ref(null);
const maxLength = ref(null);
const wordTyped = ref(0);
const timeConsumed = ref(0);
const wrongIdx = ref(-1);
const wrongCount = ref(0);
const playerRank = ref(0);

const playerPos = ref({
  left: "0%",
});
const sam = ref(
  `Some thing Went wrong while fetching the text, Try again later, or you can use this text also for practice.`
);

const sample = ref(sam.value.split(" "));
const allotedTime = ref(sample.value.length * (60 / 20));
const remainTime = ref(sample.value.length * (60 / 20));

const isCompleted = computed(() => {
  if (
    (text.value == sample.value[wordTyped.value] &&
      wordTyped.value == sample.value.length - 1 &&
      timeConsumed.value == 0) ||
    (remainTime.value == 0 && timeConsumed.value == 0)
  ) {
    timeConsumed.value = allotedTime.value - remainTime.value;
    playerRank.value++;
  }
  return (
    (text.value == sample.value[wordTyped.value] &&
      wordTyped.value == sample.value.length - 1) ||
    remainTime.value == 0
  );
});

const sampleIdx = computed(() => {
  if (
    text.value[text.value.length - 1] == " " &&
    wordTyped.value < sample.value.length - 1 &&
    correct.value &&
    text.value ==
      sample.value[wordTyped.value].slice(0, text.value.length) + " "
  ) {
    text.value = "";
    wordTyped.value++;
    let time = allotedTime.value - remainTime.value;
    calculateTime(sample.value.length, wordTyped.value, time);
  } else {
    if (
      text.value != sample.value[wordTyped.value].slice(0, text.value.length)
    ) {
      if (wrongIdx.value != wordTyped.value) {
        wrongIdx.value = wordTyped.value;
        wrongCount.value++;
      }

      maxLength.value = sample.value[wordTyped.value].length;
      correct.value = false;
    } else {
      if (isCompleted.value && !isResult.value) {
        let time = allotedTime.value - remainTime.value;
        calculateTime(sample.value.length, wordTyped.value, time);
        isResult.value = true;
        isCongrats.value = { display: "block" };
      }

      maxLength.value = null;
      correct.value = true;
    }
  }

  return wordTyped.value;
});

function calculateTime(totalWords, wordTyped, seconds) {
  let wordsRate = totalWords / 20;
  let move = (wordTyped / wordsRate) * 4.9;

  let wpm = (60 / seconds) * wordTyped;
  wordsPerMin.value = Math.round(wpm);
  playerPos.value = move;
}

function startTimer() {
  intervalId.value = setInterval(() => {
    remainTime.value--;
    if (remainTime.value == 0) {
      clearInterval(intervalId.value);

      if (!isCompleted) {
        let time = allotedTime.value - remainTime.value;
        calculateTime(sample.value.length, wordTyped.value, time);
      }
    }
  }, 1000);
}

function playerReady() {
  isPlayerReady.value = true;
  let startInId = setInterval(() => {
    startIn.value--;
    if (startIn.value == 0) {
      clearInterval(startInId);
      startTimer();
    }
  }, 1000);
}

function quitRace() {
  emits("quitRace");
}

async function getText() {
  try {
    let res = await axios.get(`${url}/text`);
    res = await res.data;
    if (res.status == "success") {
      console.log(res.text);
      sample.value = res.text.text.split(" ");
      allotedTime.value = sample.value.length * (60 / 20);
      remainTime.value = sample.value.length * (60 / 20);
    } else {
      toast.add({
        severity: "warn",
        summary: "Starting Race",
        detail: "Error occurred while starting race, try again later",
        life: 3000,
      });
    }
  } catch (err) {
    toast.add({
      severity: "warn",
      summary: "Starting Race",
      detail: "Error occurred while starting race, try again later",
      life: 3000,
    });
    console.log("error occurred while starting race, try again later");
  }
}

getText();
</script>

<template>
  <div class="about">
    <div class="timeDiv">
      <div>
        {{
          startIn == 0
            ? "Race has started, type the following Paragraph!"
            : "Race is starting soon, Please wait!"
        }}
      </div>
      <div v-if="startIn == 0">Time remains: {{ remainTime + " Secs" }}</div>
      <div
        v-else-if="!isPlayerReady"
        :style="{ display: 'flex', gap: '10px', alignItems: 'center' }"
      >
        <i class="pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        <h3>Waiting for Players!</h3>
      </div>
      <div class="startInDiv" v-else>
        <h3>Race is starting in {{ startIn }} Secs</h3>
      </div>
    </div>
    <h1 :style="isCongrats">Congratulations</h1>
    <PlayerTrack
      :playerPos="playerPos"
      :playerName="'playername'"
      :WPM="wordsPerMin"
      :rank="playerRank"
    />

    <div class="textBox">
      <span
        v-for="(el, index) in sample"
        :class="{ danger: index == sampleIdx }"
      >
        {{ el + " " }}
      </span>
    </div>
    <InputText
      type="text"
      v-model="text"
      class="inputText"
      :maxlength="maxLength"
      :class="{ danger: !correct }"
      placeholder="Type here"
      :autofocus="startIn == 0"
      :disabled="isCompleted || startIn != 0"
    />
    <div class="btnContainer">
      <Button
        v-if="!isPlayerReady"
        @click="playerReady"
        class="p-button-success"
        >Ready</Button
      >
      <Button @click="quitRace" class="p-button-warning">Quit Race</Button>
      <Button
        class="p-button-success"
        v-if="isCompleted"
        @click="
          () => {
            console.log('race again');
          }
        "
        >Race Again</Button
      >
    </div>

    <div class="resultStats" v-if="isCompleted">
      <h3 :style="{ marginBottom: '10px' }">Your performance:</h3>
      <table>
        <tr>
          <th>Your Speed:</th>
          <td>{{ wordsPerMin }} WPM</td>
        </tr>

        <tr>
          <th>time:</th>
          <td>{{ timeConsumed }} Secs</td>
        </tr>
        <tr>
          <th>Accuracy:</th>
          <td>Under Construction</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style>
.textBox {
  margin: 20px auto;
  border: 1px solid gray;
  padding: 10px;
  width: 90%;
  border-radius: 5px;
}

.about {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  justify-content: center;
}

.timeDiv {
  width: 100%;
  display: flex;
  justify-content: space-between;

  font-weight: 600;
  color: var(--text-color);
}

.inputText {
  padding: 10px;
  width: 90%;
}

.btnContainer {
  display: flex;
  gap: 20px;
}

.resultStats {
  background-color: var(--primary-color);
  color: white;
  width: 50%;
  padding: 20px;
  border-radius: var(--border-radius);
}

.resultStats > table {
  width: 100%;

  margin: auto;
}
table,
th {
  text-align: left;
  color: var(--text-color);
}
.danger {
  background-color: rgba(206, 77, 27, 0.462);
}
input.danger {
  background-color: rgba(206, 77, 27, 0.462);
}
a {
  text-decoration: none;
}
</style>
