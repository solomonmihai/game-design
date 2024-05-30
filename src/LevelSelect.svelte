<script>
  export let start;

  const levels = [1, 2, 3];
</script>

<div class="container">
  <h1>choose <br /><span>level</span></h1>
  <div class="levels">
    {#each levels as level, index}
      <div on:click={() => start(index)}>{index + 1}</div>
    {/each}
  </div>
</div>

<style>
  span {
    margin-left: 40px;
  }

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .levels {
    margin-top: 50px;
    max-width: 400px;
    display: flex;
    justify-content: left;
    align-items: left;
    gap: 32px;
    flex-wrap: wrap;
  }

  .levels > div {
    font-size: 1.4rem;
    background-color: #45277a;
    display: flex;
    justify-content: center;
    align-items: center;
    outline: 5px solid white;
    border-radius: 10px;
    width: 50px;
    height: 50px;
    cursor: pointer;
    transition: 0.1s ease all;
  }

  .levels > div:hover {
    transform: rotate(12deg);
  }
</style>
