(() => {
  const STEPS_PER_BEAT = 4; // 16th grid
  const TOTAL_BARS = 4;
  const BEATS_PER_BAR = 4;
  const TOTAL_BEATS = TOTAL_BARS * BEATS_PER_BAR; // 16 beats
  const TOTAL_STEPS = TOTAL_BEATS * STEPS_PER_BEAT; // 64 steps

  const RULES = {
    // Rule 1: A,A,A,B x3 then A,A,A,C
    rule1: [
      "A","A","A","B",
      "A","A","A","B",
      "A","A","A","B",
      "A","A","A","C"
    ],
    // Rule 2: A,A,B,A x3 then A,B,A,C
    rule2: [
      "A","A","B","A",
      "A","A","B","A",
      "A","A","B","A",
      "A","B","A","C"
    ],
    // Rule 3: A,B,A,A x3 then A,A,B,C
    rule3: [
      "A","B","A","A",
      "A","B","A","A",
      "A","B","A","A",
      "A","A","B","C"
    ]
  };

  // 1 beat = 4 steps
  const KICK_MOTIF_SETS = [
    { A:[1,0,0,0], B:[1,0,1,0], C:[0,0,1,0] },
    { A:[1,0,0,0], B:[1,0,0,1], C:[0,1,0,0] },
    { A:[1,0,0,0], B:[1,0,1,0], C:[0,0,0,1] },
    { A:[1,0,0,0], B:[1,0,0,1], C:[0,0,1,0] }
  ];

  const HAT_MOTIF_SETS = [
    { A:[0,0,1,0], B:[0,1,0,1], C:[0,0,0,1] },
    { A:[0,1,0,0], B:[0,0,1,1], C:[0,1,0,1] },
    { A:[0,0,1,0], B:[0,1,1,0], C:[0,0,0,1] },
    { A:[0,1,0,1], B:[0,0,1,0], C:[0,1,0,0] }
  ];

  function expandRule(ruleLetters, motifMap) {
    const steps = [];
    for (const letter of ruleLetters) {
      steps.push(...motifMap[letter]);
    }
    return steps;
  }

  function rotateBeats(ruleLetters, offsetBeat) {
    const out = [];
    for (let i = 0; i < ruleLetters.length; i++) {
      out.push(ruleLetters[(i + offsetBeat) % ruleLetters.length]);
    }
    return out;
  }

  function makeSamples() {
    const sampleDefs = [];
    const ruleNames = ["rule1", "rule2", "rule3"];
    for (let i = 0; i < 10; i++) {
      const ruleName = ruleNames[i % ruleNames.length];
      const ruleBase = RULES[ruleName];
      const rotated = rotateBeats(ruleBase, i % 4);
      const kickMotifs = KICK_MOTIF_SETS[i % KICK_MOTIF_SETS.length];
      const hatMotifs = HAT_MOTIF_SETS[(i + 1) % HAT_MOTIF_SETS.length];
      sampleDefs.push({
        id: i + 1,
        name: `Sample ${i + 1}`,
        ruleName,
        letters: rotated,
        kickSteps: expandRule(rotated, kickMotifs),
        hatSteps: expandRule(rotated, hatMotifs),
      });
    }
    return sampleDefs;
  }

  const samples = makeSamples();

  let kickSynth = null;
  let hatSynth = null;
  let hatFilter = null;
  let stepEventId = null;
  let playingId = null;
  let audioStarted = false;
  let currentStep = 0;
  let currentSample = null;

  const grid = document.getElementById("sample-grid");
  const startBtn = document.getElementById("start-audio");
  const stopBtn = document.getElementById("stop-all");
  const bpmInput = document.getElementById("bpm");

  function render() {
    grid.innerHTML = "";
    for (const s of samples) {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.sampleId = String(s.id);
      card.innerHTML = `
        <h3>${s.name} (${s.ruleName})</h3>
        <p class="mono">Rule: ${s.letters.join(",")}</p>
        <button data-play="${s.id}">Play</button>
      `;
      grid.appendChild(card);
    }
  }

  function setPlayingCard(sampleId) {
    for (const el of grid.querySelectorAll(".card")) {
      el.classList.toggle("playing", Number(el.dataset.sampleId) === sampleId);
    }
  }

  async function ensureAudio() {
    await Tone.start();
    if (Tone.context.state !== "running") {
      await Tone.context.resume();
    }
    if (audioStarted) return;
    kickSynth = new Tone.MembraneSynth({
      pitchDecay: 0.06,
      octaves: 5,
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.42, sustain: 0, release: 0.2 },
      volume: -8
    }).toDestination();
    hatFilter = new Tone.Filter(8500, "highpass").toDestination();
    hatSynth = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.02 },
      volume: -14
    }).connect(hatFilter);
    audioStarted = true;
  }

  function stopCurrent() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    stepEventId = null;
    currentStep = 0;
    currentSample = null;
    playingId = null;
    setPlayingCard(null);
  }

  async function playSample(sampleId) {
    await ensureAudio();
    const sample = samples.find(s => s.id === sampleId);
    if (!sample) return;
    if (playingId === sampleId) {
      stopCurrent();
      return;
    }

    stopCurrent();
    Tone.Transport.bpm.value = Number(bpmInput.value) || 74;
    currentSample = sample;
    currentStep = 0;
    stepEventId = Tone.Transport.scheduleRepeat((time) => {
      const stepIndex = currentStep;
      if (currentSample.kickSteps[stepIndex]) {
        kickSynth.triggerAttackRelease("C1", "8n", time);
      }
      if (currentSample.hatSteps[stepIndex]) {
        hatSynth.triggerAttackRelease("32n", time);
      }
      currentStep = (currentStep + 1) % TOTAL_STEPS;
    }, "16n");
    Tone.Transport.position = 0;
    Tone.Transport.start("+0.02");
    playingId = sampleId;
    setPlayingCard(sampleId);
  }

  startBtn.addEventListener("click", async () => {
    await ensureAudio();
  });

  stopBtn.addEventListener("click", () => {
    stopCurrent();
  });

  grid.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-play]");
    if (!btn) return;
    const sampleId = Number(btn.dataset.play);
    await playSample(sampleId);
  });

  render();
})();
