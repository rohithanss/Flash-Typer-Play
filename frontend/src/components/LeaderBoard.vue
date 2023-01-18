<script setup></script>
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
        <tr>
          <td>1</td>
          <td>Rohit Hans</td>
          <td>50 WPM</td>
          <td>4</td>
        </tr>
        <tr>
          <td>1</td>
          <td>Rohit Hans</td>
          <td>50 WPM</td>
          <td>4</td>
        </tr>
        <tr>
          <td>1</td>
          <td>Rohit Hans</td>
          <td>50 WPM</td>
          <td>4</td>
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
</style>
