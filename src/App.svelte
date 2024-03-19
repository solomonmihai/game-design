<script>
  import Game from "./Game.svelte";
</script>

<main>
  <div class="container">
    <Game />
  </div>
</main>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
  }

  .container {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #0F0324;
  }
</style>
