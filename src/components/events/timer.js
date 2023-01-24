export default function startTimer() {
  let timer = 0; //seconds

  document.addEventListener("loading", () => {
    timerStart();
  });

  document.addEventListener("wereReady", () => {
    timerStop();
  });

  function timerStart() {
    setInterval(tickTimer, 1000);
  }

  function tickTimer(){
    timer++;
  }

  function timerStop() {
    let seconds = timer;
    let minutes = 0;
    let hours = 0;
    while (seconds > 59) {
      seconds -= 60;
      minutes++;
    }
    while (minutes > 59) {
      minutes -= 60;
      hours++;
    }
    const message = `
        Time elapsed: ${hours}h ${minutes}m ${seconds}s
    `;
    alert(message);
  }
}
