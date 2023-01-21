<script setup>
import axios from "axios";
import { ref, inject } from "vue";

const url = inject("backendURL");

const topPlayers = ref(null);

async function getTopPlayers() {
  try {
    let res = await axios.get(`${url}/user/topplayers`);
    res = await res.data;
    if (res.status == "success") {
      topPlayers.value = res.players;
    } else {
      topPlayers.value = false;
    }
  } catch (err) {
    console.log(err);
    topPlayers.value = false;
  }
}
getTopPlayers();
</script>
<template>
  <div id="container">
    <h1 :style="{ marginBottom: '15px' }">Leader Board</h1>

    <table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Name</th>
          <th>Speed</th>
          <th>Races Played</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="topPlayers == null">
          <td :style="{ width: '100%', textAlign: 'center' }" colspan="4">
            <i class="pi pi-spin pi-spinner"></i> Loading
          </td>
        </tr>
        <tr v-else-if="topPlayers == false">
          <td :style="{ width: '100%', textAlign: 'center' }" colspan="4">
            <i class="pi pi-exclamation-triangle"></i> Something Went Wrong
            while Loading Top Players.
          </td>
        </tr>
        <tr
          v-else
          v-for="({ name, speed, totalRaces }, idx) of topPlayers"
          :class="[idx % 2 == 0 ? 'white' : 'gray']"
        >
          <td>{{ idx + 1 }}</td>
          <td>{{ name }}</td>
          <td>{{ speed }}</td>
          <td>{{ totalRaces }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
#container {
  width: 80vw;
}
th {
  color: white;
  background-color: var(--primary-color);
  padding: 5px;
  text-align: left;
}
table {
  border-radius: var(--border-radius);
  border: 1px solid var(--primary-color);
  border-collapse: collapse;
  width: 80%;
}
td {
  border: 1px solid var(--primary-color);
  padding: 5px;
}
tr.white {
  background-color: white;
}
tr.gray {
  background-color: var(--surface-200);
}
</style>
