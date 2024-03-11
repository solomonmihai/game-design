<script>
  import {onMount} from "svelte";

  import { initApp } from "./game/App";

  let canvas;

  onMount(async () => {
    initApp(canvas);
  });

</script>

<canvas bind:this={canvas} />

<style>
</style>
