<script>
  import { onMount, onDestroy } from "svelte";

  import { initApp } from "./game/App";

  export let startTime;
  export let selectedLevel;

  let canvas;
  let elapsedTime = 0;
  let interval;

  function nextLevel() {
    // Implement level transition logic
    alert("Next Level!"); // Placeholder for actual transition logic
  }

  onMount(async () => {
    initApp(canvas, selectedLevel, nextLevel);
    interval = setInterval(() => {
      elapsedTime = Math.floor((Date.now() - startTime) / 1000);
    }, 1000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });
</script>

<canvas bind:this={canvas} />
<div class="timer">time: {elapsedTime}s</div>

<style>
  canvas {
    border: 4px solid purple;
  }
  .timer{
    position: absolute;
    top: 30px;
    left: 23%;
    font-size: 2rem;
    color: white;
  }
</style>
