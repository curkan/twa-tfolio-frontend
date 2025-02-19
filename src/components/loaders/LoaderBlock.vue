<template>
  <div class="container-loader">
    <span class="loader"></span>
  </div>
</template>
<style scoped>
.container-loader {
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loader {
  display: block;
  position: relative;
  width: 64px;
  height: 60px;
}
.loader::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  background: #fff;
  width: 64px;
  height: 32px;
  border-radius: 0 0 50px 50px;
  animation: move 0.5s linear infinite alternate;
}
.loader::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  background: #FF3D00;
  width: 24px;
  height: 24px;
  transform: translateX(-50%) rotate(0deg);
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  100% { transform: translateX(-50%) rotate(360deg)}
}
@keyframes move {
  0% { transform: rotate(10deg)}
  100% { transform: rotate(-10deg)}
}
</style>
