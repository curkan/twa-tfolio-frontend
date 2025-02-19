<template>
  <div class="container-loader">
    <span class="loader">tF &nbsp; lio</span>
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
  display: inline-block;
  font-size: 48px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  color: #FFF;
  position: relative;
}
.loader::before {
  content: '';
  position: absolute;
  left: 50px;
  bottom: 21px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 5px solid #FFF;
  border-bottom-color: #FF3D00;
  box-sizing: border-box;
  animation: rotation 0.6s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

