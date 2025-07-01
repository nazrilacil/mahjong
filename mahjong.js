    const symbols = Array.from({ length: 30 }, (_, i) => `${i + 1}.png`);
    const scatterSymbol = "30.png"; // hanya 1 jenis scatter

    const slotGrid = document.getElementById("slot-grid");
    const coinsEl = document.getElementById("coins");
    const betInput = document.getElementById("bet");
    const spinBtn = document.getElementById("spinBtn");
    const autoSpinBtn = document.getElementById("autoSpinBtn");
    const toggleDark = document.getElementById("toggleDark");
    const freeSpinEl = document.getElementById("freeSpin");
    const win = document.getElementById("win");
    const los = document.getElementById("lose");

    let coins = 1000;
    let freeSpins = 0;
    let autoSpinning = false;

    toggleDark.addEventListener("click", () => {
      document.body.classList.toggle("dark");
    });

    document.getElementById("increaseBet").onclick = () => betInput.value = Math.min(coins, +betInput.value + 10);
    document.getElementById("decreaseBet").onclick = () => betInput.value = Math.max(1, +betInput.value - 10);

    function randomSymbol() {
      return symbols[Math.floor(Math.random() * symbols.length)];
    }

    function generateGrid() {
      slotGrid.innerHTML = "";
      for (let y = 0; y < 3; y++) {
        for (let x = 0; x < 5; x++) {
          const img = document.createElement("img");
          const symbol = randomSymbol();
          img.src = symbol;
          img.dataset.symbol = symbol;
          img.className = `w-16 h-16 mx-auto rounded shadow-md ${x % 2 === 0 ? 'spin-down' : 'spin-up'}`;
          img.dataset.x = x;
          img.dataset.y = y;
          slotGrid.appendChild(img);
        }
      }
    }

    function matchCheckAndReward() {
      let matched = false;
      let totalWin = 0;

      // Horizontal match
      for (let y = 0; y < 3; y++) {
        const row = Array.from(slotGrid.children).filter(img => img.dataset.y == y);
        const names = row.map(img => img.dataset.symbol);
        if (names.every(src => src === names[0])) {
          row.forEach(img => img.classList.add("match-anim"));
          matched = true;
          totalWin += +betInput.value * 3;
        }
      }

      // Scatter fix: match exact filename
      const scatters = Array.from(slotGrid.children).filter(img => img.dataset.symbol === scatterSymbol);
      scatters.forEach(img => img.classList.add("scatter-anim"));

      if (scatters.length >= 3) {
        freeSpins += 5;
        freeSpinEl.textContent = freeSpins;
      }

      if (totalWin > 0) {
        setTimeout(() => {
          coins += totalWin;
          coinsEl.classList.add("coin-anim");
          coinsEl.textContent = coins;
          setTimeout(() => coinsEl.classList.remove("coin-anim"), 500);
        }, 700);
      }
    }
    let total = 0
    async function spin() {
        win.innerHTML = total - betInput.value
        los.innerHTML = total + betInput.value
      if (freeSpins > 0) {
        freeSpins--;
        freeSpinEl.textContent = freeSpins;
      } else {
        if (coins < +betInput.value) return alert("Koin tidak cukup!");
        coins -= +betInput.value;
        coinsEl.textContent = coins;
      }
      generateGrid();
      setTimeout(matchCheckAndReward, 700);
    }

    spinBtn.onclick = spin;

    autoSpinBtn.onclick = async () => {
      autoSpinning = !autoSpinning;
      autoSpinBtn.textContent = autoSpinning ? "Stop Auto" : "Auto Spin";
      while (autoSpinning) {
        await spin();
        await new Promise(r => setTimeout(r, 1600));
      }
    };

    generateGrid();
