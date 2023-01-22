<script setup></script>
<template>
  <div id="footer">
    <div class="footer-logo">
      <img src="../assets/flash-type-h.png" alt="" />
    </div>
    <div class="contact">
      <p><i class="pi pi-github"></i> Github</p>
      <i class="pi pi-minus separator"></i>
      <p><i class="pi pi-linkedin"></i> LinkedIn</p>
      <i class="pi pi-minus separator"></i>
      <p><i class="pi pi-envelope"></i> Email</p>
    </div>
    <div class="copyRight">Made with CODE by Rohit Hans</div>
  </div>
</template>

<style scoped>
.footer-logo {
  display: flex;
  justify-content: center;
  height: 60px;
  background-color: var(--surface-200);
  padding: 10px 0;
}
.footer-logo img {
  height: 100%;
}
.contact {
  width: 100vw;
  background-color: var(--surface-200);
  color: var(--primary-color);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
  gap: 25px;
}
p {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
}
.separator {
  transform: rotateZ("90deg");
}

.copyRight {
  background-color: black;
  color: white;
  padding: 5px;
  display: flex;
  justify-content: center;
  font-size: 12px;
}
</style>
