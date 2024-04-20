<script>
  import Game from "./Game.svelte";

  let started = true;
</script>

<main>
  <div class="container">
    <div class="background" />
    {#if started}
      <Game />
    {/if}
    {#if !started}
      <div class="menu">
        <h1>stealth<br /><span>stealth</span></h1>
        <div class="buttons">
          <button on:click={() => (started = true)}>play</button>
          <button>sound</button>
          <button>help</button>
        </div>
      </div>
    {/if}
  </div>
</main>

<style>
  :global(*) {
    margin: 0;
    padding: 0;
    color: white;
    font-family: Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif;
    font-style: italic;
  }

  :global(body) {
    overflow: hidden;
  }

  .container {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  @keyframes transitionIn {
    from {
      transform: translateX(-100vw);
    }
    to {
      transform: translateX(0%);
    }
  }

  .menu {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  .buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 50px;
  }

  button {
    border: 2px solid white;
    color: white;
    background-color: #0f0324;
    font-size: 1.3em;
    padding: 5px 60px;
    border-radius: 10px;
    cursor: pointer;
    transition: 0.2s ease transform;
  }

  button:nth-child(1) {
    animation: transitionIn 1.3s ease;
  }

  button:nth-child(2) {
    animation: transitionIn 1.4s ease;
  }

  button:nth-child(3) {
    animation: transitionIn 1.5s ease;
  }

  button:hover {
    transform: translateX(20px);
  }

  h1 {
    text-shadow: 5px 0 #000, -5px 0 #000, 0 5px #000, 0 -5px #000, 1px 1px #000, -1px -1px #000,
      1px -1px #000, -1px 1px #000;
    font-size: 4em;

    animation: transitionIn 1s ease;
  }

  span {
    margin-left: 40px;
  }

  .background {
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: -1;
    display: flex;
    background: repeating-linear-gradient(-45deg, #9c7bd5, #9c7bd5 70px, #6438b0 70px, #6438b0 140px);
  }
</style>
