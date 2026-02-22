(() => {
  const LIFE_LABELS = [
    "active",
    "study",
    "creative",
    "social",
    "cautious",
    "optimistic",
    "resilient",
    "curious",
    "focused",
    "expressive",
    "organized",
    "adventurous",
    "empathetic",
    "patient"
  ];

  const fillScores = (partial) => {
    const scores = {};
    LIFE_LABELS.forEach((k) => { scores[k] = 0; });
    Object.keys(partial).forEach((k) => { scores[k] = partial[k]; });
    return scores;
  };

  const toyDefs = [
    { id: "toy_ball", name: "Color Ball", kind: "ball",
      labels: fillScores({ active: 3, optimistic: 2, social: 1, adventurous: 1 }),
      audio: { density: [2, 3], pitchMotion: [1, 2], rhythmMotion: [1, 2], openness: [0, 1] } },
    { id: "toy_blocks", name: "Blocks", kind: "blocks",
      labels: fillScores({ study: 1, organized: 3, focused: 2, patient: 2 }),
      audio: { density: [1, 2], pitchMotion: [0, 1], rhythmMotion: [0, 1], openness: [0, 0] } },
    { id: "toy_book", name: "Story Book", kind: "book",
      labels: fillScores({ study: 3, focused: 2, patient: 2, curious: 1 }),
      audio: { density: [0, 1], pitchMotion: [0, 1], rhythmMotion: [0, 1], openness: [0, 0] } },
    { id: "toy_pencil", name: "Pencil", kind: "pencil",
      labels: fillScores({ study: 3, creative: 2, focused: 2, organized: 1 }),
      audio: { density: [1, 2], pitchMotion: [1, 2], rhythmMotion: [0, 1], openness: [0, 0] } },
    { id: "toy_drum", name: "Toy Drum", kind: "drum",
      labels: fillScores({ active: 2, expressive: 3, social: 2, optimistic: 1 }),
      audio: { density: [2, 3], pitchMotion: [1, 2], rhythmMotion: [2, 3], openness: [1, 2] } },
    { id: "toy_rocket", name: "Rocket", kind: "rocket",
      labels: fillScores({ adventurous: 3, curious: 2, optimistic: 2, active: 1 }),
      audio: { density: [1, 2], pitchMotion: [2, 3], rhythmMotion: [1, 2], openness: [1, 2] } },
    { id: "toy_kite", name: "Kite", kind: "kite",
      labels: fillScores({ active: 2, optimistic: 2, adventurous: 2, expressive: 1 }),
      audio: { density: [1, 2], pitchMotion: [1, 3], rhythmMotion: [1, 2], openness: [1, 2] } },
    { id: "toy_puzzle", name: "Puzzle", kind: "puzzle",
      labels: fillScores({ focused: 3, patient: 3, organized: 2, cautious: 1 }),
      audio: { density: [0, 1], pitchMotion: [0, 1], rhythmMotion: [0, 1], openness: [0, 0] } },
    { id: "toy_teddy", name: "Teddy Bear", kind: "teddy",
      labels: fillScores({ empathetic: 3, patient: 2, social: 1, cautious: 1 }),
      audio: { density: [0, 1], pitchMotion: [0, 1], rhythmMotion: [0, 1], openness: [0, 0] } },
    { id: "toy_train", name: "Toy Train", kind: "train",
      labels: fillScores({ organized: 2, active: 2, focused: 1, social: 1 }),
      audio: { density: [1, 2], pitchMotion: [0, 1], rhythmMotion: [2, 3], openness: [0, 1] } },
    { id: "toy_xylophone", name: "Xylophone", kind: "xylophone",
      labels: fillScores({ creative: 3, expressive: 2, curious: 2, optimistic: 1 }),
      audio: { density: [2, 3], pitchMotion: [2, 3], rhythmMotion: [1, 2], openness: [1, 2] } },
    { id: "toy_paint", name: "Paint Set", kind: "paint",
      labels: fillScores({ creative: 3, expressive: 3, patient: 1, optimistic: 1 }),
      audio: { density: [1, 2], pitchMotion: [2, 3], rhythmMotion: [1, 2], openness: [0, 1] } },
    { id: "toy_soccer", name: "Soccer Ball", kind: "soccer",
      labels: fillScores({ active: 3, social: 2, resilient: 2, adventurous: 1 }),
      audio: { density: [2, 3], pitchMotion: [1, 2], rhythmMotion: [2, 3], openness: [1, 2] } },
    { id: "toy_jump_rope", name: "Jump Rope", kind: "rope",
      labels: fillScores({ active: 3, focused: 2, resilient: 2, patient: 1 }),
      audio: { density: [2, 3], pitchMotion: [0, 1], rhythmMotion: [2, 3], openness: [0, 1] } },
    { id: "toy_globe", name: "Mini Globe", kind: "globe",
      labels: fillScores({ curious: 3, study: 2, optimistic: 1, adventurous: 2 }),
      audio: { density: [1, 2], pitchMotion: [1, 2], rhythmMotion: [0, 1], openness: [0, 1] } },
    { id: "toy_calculator", name: "Calculator", kind: "calc",
      labels: fillScores({ study: 3, organized: 2, focused: 2, cautious: 1 }),
      audio: { density: [1, 2], pitchMotion: [0, 1], rhythmMotion: [1, 2], openness: [0, 0] } },
    { id: "toy_chess", name: "Chess Piece", kind: "chess",
      labels: fillScores({ focused: 3, patient: 2, cautious: 2, study: 1 }),
      audio: { density: [0, 1], pitchMotion: [0, 1], rhythmMotion: [0, 1], openness: [0, 0] } },
    { id: "toy_camera", name: "Camera", kind: "camera",
      labels: fillScores({ creative: 2, curious: 2, expressive: 2, social: 1 }),
      audio: { density: [1, 2], pitchMotion: [1, 2], rhythmMotion: [1, 2], openness: [0, 1] } },
    { id: "toy_plant", name: "Small Plant", kind: "plant",
      labels: fillScores({ patient: 3, empathetic: 2, optimistic: 1, focused: 1 }),
      audio: { density: [0, 1], pitchMotion: [0, 1], rhythmMotion: [0, 1], openness: [0, 0] } },
    { id: "toy_notebook", name: "Notebook", kind: "notebook",
      labels: fillScores({ study: 2, organized: 2, focused: 2, creative: 1 }),
      audio: { density: [1, 2], pitchMotion: [0, 1], rhythmMotion: [0, 1], openness: [0, 0] } }
  ];
  const TOY_JA_BY_KIND = {
    ball: "カラーボール",
    blocks: "つみき",
    book: "えほん",
    pencil: "えんぴつ",
    drum: "おもちゃドラム",
    rocket: "ロケット",
    kite: "たこ",
    puzzle: "パズル",
    teddy: "くまのぬいぐるみ",
    train: "おもちゃのれっしゃ",
    xylophone: "シロフォン",
    paint: "えのぐセット",
    soccer: "サッカーボール",
    rope: "なわとび",
    globe: "ミニちきゅうぎ",
    calc: "けいさんき",
    chess: "チェスのこま",
    camera: "カメラ",
    plant: "ちいさなはちうえ",
    notebook: "ノート"
  };
  toyDefs.forEach((toy) => {
    toy.nameJa = TOY_JA_BY_KIND[toy.kind] || "どうぐ";
  });

  const rnd = (seed, a, b) => {
    const x = Math.sin(seed * 12.9898 + a * 78.233 + b * 19.17) * 43758.5453;
    return x - Math.floor(x);
  };

  function drawToy(ctx, toy, x, y, scale = 1, seed = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.globalAlpha = 0.96;

    const c1 = `hsl(${Math.floor(20 + rnd(seed, 1, 1) * 320)}, 80%, 64%)`;
    const c2 = `hsl(${Math.floor(20 + rnd(seed, 2, 1) * 320)}, 76%, 54%)`;
    const c3 = `hsl(${Math.floor(20 + rnd(seed, 3, 1) * 320)}, 62%, 80%)`;
    const dark = "rgba(45, 48, 58, 0.6)";

    // Grounded soft shadow for a more polished look.
    ctx.fillStyle = "rgba(45, 50, 70, 0.14)";
    ctx.beginPath();
    ctx.ellipse(0, 20, 32, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    const rect = (x0, y0, w, h, r = 4, fill = c1) => {
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.roundRect(x0, y0, w, h, r);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.38)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
    };
    const circ = (x0, y0, r, fill = c1) => {
      ctx.fillStyle = fill;
      ctx.beginPath();
      ctx.arc(x0, y0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.34)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
    };
    const line = (x1, y1, x2, y2, w = 2, stroke = dark) => {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    switch (toy.kind) {
      case "ball": {
        // Gradient sphere with curved panel lines and specular highlight
        const bg = ctx.createRadialGradient(-6, -14, 4, 0, -6, 24);
        bg.addColorStop(0, c3); bg.addColorStop(0.6, c1); bg.addColorStop(1, c2);
        ctx.fillStyle = bg;
        ctx.beginPath(); ctx.arc(0, -6, 22, 0, Math.PI * 2); ctx.fill();
        // Curved panel lines
        ctx.strokeStyle = "rgba(255,255,255,0.45)"; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.ellipse(0, -6, 22, 8, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(0, -6, 8, 22, 0, 0, Math.PI * 2); ctx.stroke();
        // Specular highlight
        const sp = ctx.createRadialGradient(-8, -16, 1, -8, -16, 10);
        sp.addColorStop(0, "rgba(255,255,255,0.7)"); sp.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = sp;
        ctx.beginPath(); ctx.arc(-8, -16, 10, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case "soccer": {
        // Gradient white sphere
        const sg = ctx.createRadialGradient(-5, -14, 3, 0, -6, 24);
        sg.addColorStop(0, "#ffffff"); sg.addColorStop(0.7, "#f0f0f0"); sg.addColorStop(1, "#d8d8d8");
        ctx.fillStyle = sg;
        ctx.beginPath(); ctx.arc(0, -6, 22, 0, Math.PI * 2); ctx.fill();
        // Pentagon pattern - center
        ctx.fillStyle = "rgba(30,35,48,0.78)";
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          const px = Math.cos(a) * 6, py = -6 + Math.sin(a) * 6;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath(); ctx.fill();
        // Outer pentagons
        for (let i = 0; i < 5; i++) {
          const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          const cx0 = Math.cos(a) * 14, cy0 = -6 + Math.sin(a) * 14;
          ctx.beginPath();
          for (let j = 0; j < 5; j++) {
            const b = (Math.PI * 2 * j) / 5 - Math.PI / 2 + a * 0.1;
            const px = cx0 + Math.cos(b) * 4.5, py = cy0 + Math.sin(b) * 4.5;
            j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.closePath(); ctx.fill();
        }
        // Specular
        const ssh = ctx.createRadialGradient(-7, -16, 1, -7, -16, 9);
        ssh.addColorStop(0, "rgba(255,255,255,0.65)"); ssh.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = ssh;
        ctx.beginPath(); ctx.arc(-7, -16, 9, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case "blocks": {
        // 3D isometric blocks with top/front/side faces
        const drawBlock = (bx, by, w, h, d, faceC, topC, sideC, letter) => {
          // Front face
          ctx.fillStyle = faceC;
          ctx.beginPath();
          ctx.moveTo(bx, by); ctx.lineTo(bx + w, by); ctx.lineTo(bx + w, by + h); ctx.lineTo(bx, by + h);
          ctx.closePath(); ctx.fill();
          // Top face
          ctx.fillStyle = topC;
          ctx.beginPath();
          ctx.moveTo(bx, by); ctx.lineTo(bx + d, by - d); ctx.lineTo(bx + w + d, by - d); ctx.lineTo(bx + w, by);
          ctx.closePath(); ctx.fill();
          // Side face
          ctx.fillStyle = sideC;
          ctx.beginPath();
          ctx.moveTo(bx + w, by); ctx.lineTo(bx + w + d, by - d); ctx.lineTo(bx + w + d, by + h - d); ctx.lineTo(bx + w, by + h);
          ctx.closePath(); ctx.fill();
          // Edges
          ctx.strokeStyle = "rgba(90,55,20,0.3)"; ctx.lineWidth = 1;
          ctx.strokeRect(bx, by, w, h);
          // Letter on front face
          if (letter) {
            ctx.fillStyle = "rgba(255,255,255,0.75)";
            ctx.font = "bold 11px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(letter, bx + w / 2, by + h / 2 + 1);
          }
        };
        drawBlock(-26, -12, 20, 20, 8, "#e4a55d", "#f0cf8e", "#c8903a", "A");
        drawBlock(-2, -12, 20, 20, 8, "#d88945", "#eaab6e", "#b06e2e", "B");
        drawBlock(-14, -38, 20, 20, 8, "#f0bf79", "#f8dca6", "#d9a254", "C");
        break;
      }
      case "book": {
        // Thick book with spine, pages, cover decoration
        const bookW = 44, bookH = 32, spineW = 8;
        // Pages (visible side)
        ctx.fillStyle = "#f8f4eb";
        ctx.beginPath(); ctx.roundRect(-bookW / 2 + spineW + 1, -bookH / 2 + 2, bookW - spineW - 3, bookH - 4, 1); ctx.fill();
        // Back cover
        ctx.fillStyle = c2;
        ctx.beginPath(); ctx.roundRect(-bookW / 2, -bookH / 2, bookW, bookH, [2, 6, 6, 2]); ctx.fill();
        // Spine
        const spG = ctx.createLinearGradient(-bookW / 2, 0, -bookW / 2 + spineW, 0);
        spG.addColorStop(0, c2); spG.addColorStop(1, c1);
        ctx.fillStyle = spG;
        ctx.beginPath(); ctx.roundRect(-bookW / 2, -bookH / 2, spineW, bookH, [2, 0, 0, 2]); ctx.fill();
        // Front cover
        ctx.fillStyle = c1;
        ctx.beginPath(); ctx.roundRect(-bookW / 2 + 1, -bookH / 2, bookW - 1, bookH, [0, 6, 6, 0]); ctx.fill();
        // Cover decoration - small star
        ctx.fillStyle = c3;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          const r = i % 2 === 0 ? 7 : 3;
          const px = 4 + Math.cos(a) * r, py = -4 + Math.sin(a) * r;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath(); ctx.fill();
        // Title lines
        ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(-6, 6); ctx.lineTo(16, 6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-2, 10); ctx.lineTo(12, 10); ctx.stroke();
        // Page edges
        ctx.strokeStyle = "rgba(180,170,150,0.4)"; ctx.lineWidth = 0.8;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath(); ctx.moveTo(bookW / 2 - 2, -bookH / 2 + 6 + i * 3); ctx.lineTo(bookW / 2 - 2, -bookH / 2 + 7 + i * 3); ctx.stroke();
        }
        break;
      }
      case "pencil": {
        // Classic yellow pencil with ferrule, eraser, wood tip
        ctx.rotate(-0.35);
        // Pencil body (yellow)
        const pG = ctx.createLinearGradient(0, -5, 0, 5);
        pG.addColorStop(0, "#fde67a"); pG.addColorStop(0.5, "#f5c623"); pG.addColorStop(1, "#e0a810");
        ctx.fillStyle = pG;
        ctx.beginPath(); ctx.roundRect(-26, -4.5, 48, 9, 1); ctx.fill();
        // Ferrule (metal band)
        const fG = ctx.createLinearGradient(0, -5, 0, 5);
        fG.addColorStop(0, "#d4c9a8"); fG.addColorStop(0.5, "#a89870"); fG.addColorStop(1, "#d4c9a8");
        ctx.fillStyle = fG;
        ctx.beginPath(); ctx.roundRect(-26, -4.5, 8, 9, 1); ctx.fill();
        // Ferrule lines
        ctx.strokeStyle = "rgba(80,60,30,0.4)"; ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.moveTo(-24, -4.5); ctx.lineTo(-24, 4.5); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-21, -4.5); ctx.lineTo(-21, 4.5); ctx.stroke();
        // Eraser
        ctx.fillStyle = "#e8829a";
        ctx.beginPath(); ctx.roundRect(-33, -3.5, 8, 7, [3, 0, 0, 3]); ctx.fill();
        // Wood tip
        ctx.fillStyle = "#f5d6a5";
        ctx.beginPath();
        ctx.moveTo(22, -4.5); ctx.lineTo(34, 0); ctx.lineTo(22, 4.5); ctx.closePath(); ctx.fill();
        // Graphite point
        ctx.fillStyle = "#3d3535";
        ctx.beginPath();
        ctx.moveTo(32, -1.2); ctx.lineTo(35, 0); ctx.lineTo(32, 1.2); ctx.closePath(); ctx.fill();
        // Body highlight
        ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-18, -3); ctx.lineTo(20, -3); ctx.stroke();
        break;
      }
      case "drum": {
        // Cylindrical body with elliptical top head
        // Body
        const dG = ctx.createLinearGradient(-22, 0, 22, 0);
        dG.addColorStop(0, c2); dG.addColorStop(0.5, c1); dG.addColorStop(1, c2);
        ctx.fillStyle = dG;
        ctx.beginPath(); ctx.roundRect(-22, -18, 44, 30, 4); ctx.fill();
        // Bottom ellipse
        ctx.fillStyle = c2;
        ctx.beginPath(); ctx.ellipse(0, 12, 22, 6, 0, 0, Math.PI * 2); ctx.fill();
        // Zigzag lacing
        ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const lx = -20 + i * 5.7;
          ctx.lineTo(lx, i % 2 === 0 ? -16 : 10);
        }
        ctx.stroke();
        // Top drum head (ellipse)
        ctx.fillStyle = "#f5efe6";
        ctx.beginPath(); ctx.ellipse(0, -18, 22, 6, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = c2; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.ellipse(0, -18, 22, 6, 0, 0, Math.PI * 2); ctx.stroke();
        // Rim highlight
        ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(0, -18, 20, 5, 0, Math.PI, Math.PI * 2); ctx.stroke();
        // Crossed drumsticks
        ctx.strokeStyle = "#b08450"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(-28, -28); ctx.lineTo(-4, -14); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(28, -28); ctx.lineTo(4, -14); ctx.stroke();
        // Stick tips (round)
        circ(-28, -28, 2.5, "#d4a86a");
        circ(28, -28, 2.5, "#d4a86a");
        ctx.lineCap = "butt";
        break;
      }
      case "rocket": {
        // Gradient body with porthole, detailed fins, exhaust
        // Body gradient
        const rG = ctx.createLinearGradient(-12, 0, 12, 0);
        rG.addColorStop(0, c2); rG.addColorStop(0.5, c1); rG.addColorStop(1, c2);
        ctx.fillStyle = rG;
        ctx.beginPath(); ctx.roundRect(-11, -32, 22, 42, 11); ctx.fill();
        // Nose cone
        ctx.fillStyle = c2;
        ctx.beginPath();
        ctx.moveTo(0, -48); ctx.quadraticCurveTo(-12, -34, -11, -30);
        ctx.lineTo(11, -30); ctx.quadraticCurveTo(12, -34, 0, -48);
        ctx.closePath(); ctx.fill();
        // Porthole window
        const wG = ctx.createRadialGradient(-1, -16, 1, 0, -14, 7);
        wG.addColorStop(0, "#e8f4ff"); wG.addColorStop(0.7, "#a8d4f0"); wG.addColorStop(1, "#6eb8e0");
        ctx.fillStyle = wG;
        ctx.beginPath(); ctx.arc(0, -14, 6, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(0, -14, 6, 0, Math.PI * 2); ctx.stroke();
        // Window glare
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.beginPath(); ctx.arc(-2, -16, 2, 0, Math.PI * 2); ctx.fill();
        // Left fin
        ctx.fillStyle = c2;
        ctx.beginPath();
        ctx.moveTo(-11, -2); ctx.quadraticCurveTo(-26, 6, -22, 14);
        ctx.lineTo(-11, 10); ctx.closePath(); ctx.fill();
        // Right fin
        ctx.beginPath();
        ctx.moveTo(11, -2); ctx.quadraticCurveTo(26, 6, 22, 14);
        ctx.lineTo(11, 10); ctx.closePath(); ctx.fill();
        // Exhaust flame
        const fG = ctx.createLinearGradient(0, 10, 0, 24);
        fG.addColorStop(0, "#ffcc44"); fG.addColorStop(0.5, "#ff7733"); fG.addColorStop(1, "rgba(255,60,20,0.3)");
        ctx.fillStyle = fG;
        ctx.beginPath();
        ctx.moveTo(-7, 10); ctx.quadraticCurveTo(-3, 18, 0, 24);
        ctx.quadraticCurveTo(3, 18, 7, 10); ctx.closePath(); ctx.fill();
        // Body highlight
        ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(-5, -30); ctx.lineTo(-5, 6); ctx.stroke();
        break;
      }
      case "kite": {
        // Colorful quartered diamond with cross supports and ribbon tail
        // Diamond shape - four colored quarters
        const colors = [c1, c2, c3, c1];
        // Top
        ctx.fillStyle = colors[0]; ctx.beginPath();
        ctx.moveTo(0, -34); ctx.lineTo(22, -10); ctx.lineTo(0, -10); ctx.closePath(); ctx.fill();
        ctx.fillStyle = colors[1]; ctx.beginPath();
        ctx.moveTo(0, -34); ctx.lineTo(-22, -10); ctx.lineTo(0, -10); ctx.closePath(); ctx.fill();
        // Bottom
        ctx.fillStyle = colors[2]; ctx.beginPath();
        ctx.moveTo(0, -10); ctx.lineTo(22, -10); ctx.lineTo(0, 14); ctx.closePath(); ctx.fill();
        ctx.fillStyle = colors[3]; ctx.beginPath();
        ctx.moveTo(0, -10); ctx.lineTo(-22, -10); ctx.lineTo(0, 14); ctx.closePath(); ctx.fill();
        // Outline
        ctx.strokeStyle = "rgba(255,255,255,0.6)"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, -34); ctx.lineTo(22, -10); ctx.lineTo(0, 14); ctx.lineTo(-22, -10); ctx.closePath();
        ctx.stroke();
        // Cross supports
        ctx.strokeStyle = "rgba(80,60,30,0.55)"; ctx.lineWidth = 1.5;
        line(-22, -10, 22, -10, 1.5, "rgba(80,60,30,0.55)");
        line(0, -34, 0, 14, 1.5, "rgba(80,60,30,0.55)");
        // Tail string
        ctx.strokeStyle = "rgba(60,50,40,0.5)"; ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, 14); ctx.quadraticCurveTo(6, 22, -2, 28);
        ctx.quadraticCurveTo(-8, 34, 4, 38); ctx.stroke();
        // Ribbon bows on tail
        const bowColors = [c2, c3, c1];
        [20, 28, 36].forEach((ty, i) => {
          ctx.fillStyle = bowColors[i];
          ctx.beginPath();
          ctx.ellipse(i % 2 === 0 ? 2 : -3, ty, 4, 2.5, (i % 2 === 0 ? 0.3 : -0.3), 0, Math.PI * 2);
          ctx.fill();
        });
        break;
      }
      case "puzzle": {
        // Two interlocking pieces with knobs and holes
        // Left piece
        ctx.fillStyle = c1;
        ctx.beginPath();
        ctx.moveTo(-26, -18); ctx.lineTo(-2, -18); ctx.lineTo(-2, -10);
        // Knob going right
        ctx.quadraticCurveTo(4, -12, 6, -6);
        ctx.quadraticCurveTo(4, 0, -2, -2);
        ctx.lineTo(-2, 10); ctx.lineTo(-26, 10); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 1.2;
        ctx.stroke();
        // Right piece
        ctx.fillStyle = c2;
        ctx.beginPath();
        ctx.moveTo(26, -18); ctx.lineTo(-2, -18); ctx.lineTo(-2, -10);
        // Hole receiving knob
        ctx.quadraticCurveTo(4, -12, 6, -6);
        ctx.quadraticCurveTo(4, 0, -2, -2);
        ctx.lineTo(-2, 10); ctx.lineTo(26, 10); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 1.2;
        ctx.stroke();
        // Highlights on pieces
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.beginPath(); ctx.roundRect(-24, -16, 18, 10, 2); ctx.fill();
        ctx.beginPath(); ctx.roundRect(6, -16, 18, 10, 2); ctx.fill();
        break;
      }
      case "teddy": {
        // Cute teddy bear with ears, belly patch, button nose, smile
        // Ears
        circ(-14, -22, 8, c1);
        circ(14, -22, 8, c1);
        // Inner ears
        circ(-14, -22, 5, c3);
        circ(14, -22, 5, c3);
        // Head
        circ(0, -10, 16, c1);
        // Body
        ctx.fillStyle = c1;
        ctx.beginPath(); ctx.ellipse(0, 10, 14, 12, 0, 0, Math.PI * 2); ctx.fill();
        // Belly patch
        ctx.fillStyle = c3;
        ctx.beginPath(); ctx.ellipse(0, 10, 9, 8, 0, 0, Math.PI * 2); ctx.fill();
        // Muzzle
        ctx.fillStyle = c3;
        ctx.beginPath(); ctx.ellipse(0, -5, 8, 6, 0, 0, Math.PI * 2); ctx.fill();
        // Eyes
        ctx.fillStyle = "rgba(35,35,45,0.85)";
        ctx.beginPath(); ctx.arc(-6, -12, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(6, -12, 2.5, 0, Math.PI * 2); ctx.fill();
        // Eye shine
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.beginPath(); ctx.arc(-5, -13, 1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(7, -13, 1, 0, Math.PI * 2); ctx.fill();
        // Button nose
        ctx.fillStyle = "rgba(50,40,35,0.8)";
        ctx.beginPath(); ctx.ellipse(0, -6, 3, 2.2, 0, 0, Math.PI * 2); ctx.fill();
        // Smile
        ctx.strokeStyle = "rgba(50,40,35,0.5)"; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(0, -4, 4, 0.2, Math.PI - 0.2); ctx.stroke();
        // Arms (little stubs)
        ctx.fillStyle = c1;
        ctx.beginPath(); ctx.ellipse(-16, 6, 5, 8, 0.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(16, 6, 5, 8, -0.3, 0, Math.PI * 2); ctx.fill();
        // Legs
        ctx.beginPath(); ctx.ellipse(-7, 20, 6, 4, 0.1, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(7, 20, 6, 4, -0.1, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case "train": {
        // Locomotive with smokestack, cabin, cow catcher, detailed wheels
        // Main body
        const tG = ctx.createLinearGradient(0, -20, 0, 6);
        tG.addColorStop(0, c1); tG.addColorStop(1, c2);
        ctx.fillStyle = tG;
        ctx.beginPath(); ctx.roundRect(-30, -14, 48, 22, 4); ctx.fill();
        // Cabin
        ctx.fillStyle = c2;
        ctx.beginPath(); ctx.roundRect(-30, -30, 20, 18, [4, 4, 0, 0]); ctx.fill();
        // Cabin window
        ctx.fillStyle = "#d6eaf8";
        ctx.beginPath(); ctx.roundRect(-26, -26, 12, 10, 2); ctx.fill();
        // Cabin roof
        ctx.fillStyle = c1;
        ctx.beginPath(); ctx.roundRect(-32, -33, 24, 4, 2); ctx.fill();
        // Smokestack
        ctx.fillStyle = "rgba(60,55,50,0.8)";
        ctx.beginPath(); ctx.roundRect(-2, -28, 8, 14, [3, 3, 0, 0]); ctx.fill();
        // Smokestack top
        ctx.fillStyle = "rgba(80,70,60,0.7)";
        ctx.beginPath(); ctx.roundRect(-4, -30, 12, 4, 2); ctx.fill();
        // Boiler front
        ctx.fillStyle = c1;
        ctx.beginPath(); ctx.arc(18, -4, 12, -Math.PI / 2, Math.PI / 2); ctx.fill();
        // Cow catcher
        ctx.fillStyle = "rgba(80,75,70,0.6)";
        ctx.beginPath();
        ctx.moveTo(22, 4); ctx.lineTo(30, 10); ctx.lineTo(14, 10); ctx.closePath(); ctx.fill();
        // Stripe
        ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-30, -4); ctx.lineTo(18, -4); ctx.stroke();
        // Wheels
        const wheelY = 12;
        [-20, -4, 12].forEach(wx => {
          ctx.fillStyle = "rgba(40,40,50,0.85)";
          ctx.beginPath(); ctx.arc(wx, wheelY, 6, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "rgba(70,70,80,0.7)";
          ctx.beginPath(); ctx.arc(wx, wheelY, 3, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "rgba(200,200,200,0.4)";
          ctx.beginPath(); ctx.arc(wx, wheelY, 1.5, 0, Math.PI * 2); ctx.fill();
        });
        // Rail
        ctx.strokeStyle = "rgba(80,80,90,0.3)"; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-34, 18); ctx.lineTo(32, 18); ctx.stroke();
        break;
      }
      case "xylophone": {
        // 5 rainbow bars on frame, two mallets
        // Frame
        ctx.fillStyle = "rgba(120,80,40,0.8)";
        ctx.beginPath(); ctx.roundRect(-30, 8, 60, 5, 2); ctx.fill();
        // Frame legs
        ctx.fillStyle = "rgba(100,65,30,0.7)";
        ctx.beginPath(); ctx.roundRect(-28, 10, 4, 8, 1); ctx.fill();
        ctx.beginPath(); ctx.roundRect(24, 10, 4, 8, 1); ctx.fill();
        // Rainbow bars (5 bars, decreasing width/height for pitch)
        const barColors = ["#ef5350", "#ff9800", "#fdd835", "#66bb6a", "#42a5f5"];
        const barWidths = [12, 11, 10, 9, 8];
        for (let i = 0; i < 5; i++) {
          const bx = -26 + i * 12;
          const bh = 20 - i * 2;
          const bG = ctx.createLinearGradient(bx, -bh / 2 - 2, bx + barWidths[i], -bh / 2 - 2);
          bG.addColorStop(0, barColors[i]); bG.addColorStop(1, barColors[i]);
          ctx.fillStyle = barColors[i];
          ctx.beginPath(); ctx.roundRect(bx, -bh / 2 - 4, barWidths[i], bh, 2); ctx.fill();
          // Bar highlight
          ctx.fillStyle = "rgba(255,255,255,0.3)";
          ctx.beginPath(); ctx.roundRect(bx + 1, -bh / 2 - 3, barWidths[i] - 2, 3, 1); ctx.fill();
        }
        // Mallets
        ctx.strokeStyle = "#8d6e42"; ctx.lineWidth = 2; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(-32, -22); ctx.lineTo(-20, -6); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(32, -22); ctx.lineTo(20, -6); ctx.stroke();
        circ(-32, -22, 3.5, "#e07050");
        circ(32, -22, 3.5, "#42a5f5");
        ctx.lineCap = "butt";
        break;
      }
      case "paint": {
        // Kidney-shaped palette with paint blobs and brush
        // Palette shape (kidney/oval)
        ctx.fillStyle = "#e8d4b8";
        ctx.beginPath();
        ctx.moveTo(-20, -14);
        ctx.quadraticCurveTo(-28, -18, -26, -6);
        ctx.quadraticCurveTo(-28, 8, -16, 10);
        ctx.quadraticCurveTo(0, 16, 18, 8);
        ctx.quadraticCurveTo(28, 2, 26, -8);
        ctx.quadraticCurveTo(24, -18, 12, -16);
        ctx.quadraticCurveTo(0, -20, -8, -14);
        ctx.closePath(); ctx.fill();
        // Palette edge
        ctx.strokeStyle = "rgba(160,130,90,0.5)"; ctx.lineWidth = 1.5; ctx.stroke();
        // Thumb hole
        ctx.fillStyle = "rgba(200,180,150,0.6)";
        ctx.beginPath(); ctx.ellipse(10, -6, 5, 4, 0.2, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(140,110,70,0.4)"; ctx.lineWidth = 1; ctx.stroke();
        // Paint blobs
        const blobs = [
          { x: -16, y: -10, r: 4.5, c: "#e53935" },
          { x: -6, y: -12, r: 4, c: "#1e88e5" },
          { x: 4, y: -12, r: 3.5, c: "#fdd835" },
          { x: -18, y: 0, r: 3.5, c: "#43a047" },
          { x: -8, y: 4, r: 4, c: "#8e24aa" },
          { x: 4, y: 2, r: 3, c: "#ff9800" }
        ];
        blobs.forEach(b => {
          ctx.fillStyle = b.c;
          ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
          // Blob highlight
          ctx.fillStyle = "rgba(255,255,255,0.35)";
          ctx.beginPath(); ctx.arc(b.x - 1, b.y - 1, b.r * 0.4, 0, Math.PI * 2); ctx.fill();
        });
        // Brush
        ctx.strokeStyle = "#8d6e42"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(18, -20); ctx.lineTo(22, 4); ctx.stroke();
        // Brush tip
        ctx.fillStyle = "#e53935";
        ctx.beginPath();
        ctx.moveTo(20, 0); ctx.quadraticCurveTo(18, 8, 22, 10);
        ctx.quadraticCurveTo(26, 6, 24, 0); ctx.closePath(); ctx.fill();
        ctx.lineCap = "butt";
        break;
      }
      case "rope": {
        // U-shaped curved rope with cylindrical handles
        // Rope curve (bezier U-shape)
        ctx.strokeStyle = c2; ctx.lineWidth = 3.5; ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(-20, -22);
        ctx.bezierCurveTo(-24, 10, 24, 10, 20, -22);
        ctx.stroke();
        // Rope texture (parallel line)
        ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(-19, -20);
        ctx.bezierCurveTo(-22, 8, 22, 8, 19, -20);
        ctx.stroke();
        // Left handle (cylinder)
        const lhG = ctx.createLinearGradient(-24, 0, -16, 0);
        lhG.addColorStop(0, c2); lhG.addColorStop(0.5, c1); lhG.addColorStop(1, c2);
        ctx.fillStyle = lhG;
        ctx.beginPath(); ctx.roundRect(-24, -34, 8, 16, 3); ctx.fill();
        // Handle grip lines
        ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 0.8;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath(); ctx.moveTo(-23, -30 + i * 4); ctx.lineTo(-17, -30 + i * 4); ctx.stroke();
        }
        // Right handle
        const rhG = ctx.createLinearGradient(16, 0, 24, 0);
        rhG.addColorStop(0, c2); rhG.addColorStop(0.5, c1); rhG.addColorStop(1, c2);
        ctx.fillStyle = rhG;
        ctx.beginPath(); ctx.roundRect(16, -34, 8, 16, 3); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 0.8;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath(); ctx.moveTo(17, -30 + i * 4); ctx.lineTo(23, -30 + i * 4); ctx.stroke();
        }
        ctx.lineCap = "butt";
        break;
      }
      case "globe": {
        // Blue sphere with green continents, lat/lon grid, arc stand
        // Stand base
        ctx.fillStyle = "rgba(100,90,80,0.6)";
        ctx.beginPath(); ctx.ellipse(0, 14, 16, 4, 0, 0, Math.PI * 2); ctx.fill();
        // Stand arc
        ctx.strokeStyle = "rgba(120,110,100,0.7)"; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(0, -8, 22, 0.25, Math.PI - 0.25); ctx.stroke();
        // Stand post
        ctx.strokeStyle = "rgba(110,100,90,0.6)"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(0, 14); ctx.stroke();
        // Globe sphere
        const gG = ctx.createRadialGradient(-5, -14, 3, 0, -8, 20);
        gG.addColorStop(0, "#6ec6f0"); gG.addColorStop(0.6, "#3a8fd4"); gG.addColorStop(1, "#2468a8");
        ctx.fillStyle = gG;
        ctx.beginPath(); ctx.arc(0, -8, 18, 0, Math.PI * 2); ctx.fill();
        // Green continents (abstract blobs)
        ctx.fillStyle = "rgba(76,160,76,0.6)";
        ctx.beginPath(); ctx.ellipse(-6, -14, 7, 5, -0.3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(8, -4, 5, 6, 0.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(-8, -2, 4, 3, 0, 0, Math.PI * 2); ctx.fill();
        // Latitude lines
        ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.ellipse(0, -8, 18, 5, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(0, -14, 16, 3, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.ellipse(0, -2, 16, 3, 0, 0, Math.PI * 2); ctx.stroke();
        // Longitude line
        ctx.beginPath(); ctx.ellipse(0, -8, 6, 18, 0, 0, Math.PI * 2); ctx.stroke();
        // Specular
        const gSp = ctx.createRadialGradient(-6, -16, 1, -6, -16, 8);
        gSp.addColorStop(0, "rgba(255,255,255,0.45)"); gSp.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gSp;
        ctx.beginPath(); ctx.arc(-6, -16, 8, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case "calc": {
        // Calculator with LCD screen, button grid, colored = button
        // Body
        const cG = ctx.createLinearGradient(-22, -30, -22, 16);
        cG.addColorStop(0, c2); cG.addColorStop(1, c1);
        ctx.fillStyle = cG;
        ctx.beginPath(); ctx.roundRect(-22, -30, 44, 46, 5); ctx.fill();
        // LCD screen
        ctx.fillStyle = "#c8dfc4";
        ctx.beginPath(); ctx.roundRect(-16, -26, 32, 12, 2); ctx.fill();
        // Digits on screen
        ctx.fillStyle = "rgba(30,40,30,0.7)";
        ctx.font = "bold 9px monospace"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
        ctx.fillText("12345", 14, -20);
        // Button grid (4x3)
        const btnColors = c3;
        for (let r = 0; r < 4; r++) {
          for (let cc = 0; cc < 3; cc++) {
            ctx.fillStyle = (r === 3 && cc === 2) ? "#f5a623" : btnColors;
            const bx = -14 + cc * 10, by = -10 + r * 9;
            ctx.beginPath(); ctx.roundRect(bx, by, 8, 6.5, 1.5); ctx.fill();
            // Button highlight
            ctx.fillStyle = "rgba(255,255,255,0.2)";
            ctx.beginPath(); ctx.roundRect(bx + 1, by + 0.5, 6, 2, 1); ctx.fill();
          }
        }
        // "=" text on colored button
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.font = "bold 6px sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("=", 10, 30);
        break;
      }
      case "chess": {
        // Knight silhouette (horse head) with proper base
        // Base (two tiers)
        ctx.fillStyle = c3;
        ctx.beginPath(); ctx.roundRect(-18, 4, 36, 8, 3); ctx.fill();
        ctx.fillStyle = c2;
        ctx.beginPath(); ctx.roundRect(-14, -2, 28, 8, 2); ctx.fill();
        // Neck/body column
        ctx.fillStyle = c1;
        ctx.beginPath(); ctx.roundRect(-6, -22, 12, 22, 3); ctx.fill();
        // Horse head (knight profile)
        ctx.fillStyle = c1;
        ctx.beginPath();
        ctx.moveTo(-6, -22);
        ctx.quadraticCurveTo(-10, -28, -8, -36);
        ctx.quadraticCurveTo(-4, -42, 4, -40);
        ctx.quadraticCurveTo(12, -38, 14, -30);
        ctx.quadraticCurveTo(16, -24, 12, -20);
        // Muzzle
        ctx.lineTo(16, -22);
        ctx.quadraticCurveTo(18, -18, 14, -16);
        ctx.lineTo(6, -18);
        ctx.lineTo(6, -22);
        ctx.closePath(); ctx.fill();
        // Eye
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.beginPath(); ctx.arc(4, -30, 2, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(30,30,40,0.8)";
        ctx.beginPath(); ctx.arc(4, -30, 1, 0, Math.PI * 2); ctx.fill();
        // Nostril
        ctx.fillStyle = "rgba(30,30,40,0.4)";
        ctx.beginPath(); ctx.arc(14, -19, 1, 0, Math.PI * 2); ctx.fill();
        // Mane detail
        ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-4, -26); ctx.quadraticCurveTo(-8, -32, -6, -36);
        ctx.stroke();
        // Base highlight
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.beginPath(); ctx.roundRect(-16, 5, 32, 3, 1); ctx.fill();
        break;
      }
      case "camera": {
        // Detailed camera body with lens, flash, grip
        // Body
        const camG = ctx.createLinearGradient(-24, -20, -24, 8);
        camG.addColorStop(0, c1); camG.addColorStop(1, c2);
        ctx.fillStyle = camG;
        ctx.beginPath(); ctx.roundRect(-24, -18, 48, 28, 5); ctx.fill();
        // Grip texture (right side)
        ctx.fillStyle = "rgba(0,0,0,0.12)";
        ctx.beginPath(); ctx.roundRect(14, -16, 8, 24, [0, 4, 4, 0]); ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 0.7;
        for (let i = 0; i < 4; i++) {
          ctx.beginPath(); ctx.moveTo(15, -12 + i * 5); ctx.lineTo(21, -12 + i * 5); ctx.stroke();
        }
        // Viewfinder bump
        ctx.fillStyle = c2;
        ctx.beginPath(); ctx.roundRect(-16, -24, 14, 7, 2); ctx.fill();
        // Flash
        ctx.fillStyle = "#f5f0e0";
        ctx.beginPath(); ctx.roundRect(12, -24, 8, 6, 2); ctx.fill();
        ctx.fillStyle = "rgba(255,250,200,0.5)";
        ctx.beginPath(); ctx.roundRect(13, -23, 6, 4, 1); ctx.fill();
        // Lens (concentric circles)
        ctx.fillStyle = "rgba(30,35,50,0.85)";
        ctx.beginPath(); ctx.arc(-2, -4, 12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(50,60,80,0.7)";
        ctx.beginPath(); ctx.arc(-2, -4, 9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "rgba(80,100,140,0.6)";
        ctx.beginPath(); ctx.arc(-2, -4, 6, 0, Math.PI * 2); ctx.fill();
        // Lens glass reflection
        const lG = ctx.createRadialGradient(-4, -7, 1, -2, -4, 8);
        lG.addColorStop(0, "rgba(180,210,255,0.5)"); lG.addColorStop(0.5, "rgba(100,140,200,0.15)"); lG.addColorStop(1, "rgba(30,40,60,0.1)");
        ctx.fillStyle = lG;
        ctx.beginPath(); ctx.arc(-2, -4, 8, 0, Math.PI * 2); ctx.fill();
        // Lens ring
        ctx.strokeStyle = "rgba(200,200,210,0.5)"; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(-2, -4, 11, 0, Math.PI * 2); ctx.stroke();
        // Shutter button
        ctx.fillStyle = "rgba(220,220,225,0.7)";
        ctx.beginPath(); ctx.roundRect(-6, -22, 6, 3, 1.5); ctx.fill();
        break;
      }
      case "plant": {
        // Terracotta pot, stem, leaves, flower
        // Pot
        const potG = ctx.createLinearGradient(-14, 2, 14, 2);
        potG.addColorStop(0, "#c67a4a"); potG.addColorStop(0.5, "#d4946a"); potG.addColorStop(1, "#b56a3a");
        ctx.fillStyle = potG;
        ctx.beginPath();
        ctx.moveTo(-14, 2); ctx.lineTo(-10, 18); ctx.lineTo(10, 18); ctx.lineTo(14, 2);
        ctx.closePath(); ctx.fill();
        // Pot rim
        ctx.fillStyle = "#c67a4a";
        ctx.beginPath(); ctx.roundRect(-15, 0, 30, 5, 2); ctx.fill();
        // Dirt
        ctx.fillStyle = "rgba(90,60,30,0.5)";
        ctx.beginPath(); ctx.ellipse(0, 3, 12, 3, 0, 0, Math.PI * 2); ctx.fill();
        // Stem
        ctx.strokeStyle = "#5a8a42"; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.moveTo(0, 2); ctx.quadraticCurveTo(-2, -12, 0, -22); ctx.stroke();
        // Leaves
        const drawLeaf = (lx, ly, angle, size) => {
          ctx.save(); ctx.translate(lx, ly); ctx.rotate(angle);
          ctx.fillStyle = "#6ab04c";
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(size * 0.6, -size * 0.5, size, 0);
          ctx.quadraticCurveTo(size * 0.6, size * 0.5, 0, 0);
          ctx.fill();
          // Leaf vein
          ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 0.6;
          ctx.beginPath(); ctx.moveTo(1, 0); ctx.lineTo(size * 0.7, 0); ctx.stroke();
          ctx.restore();
        };
        drawLeaf(-2, -8, -0.8, 14);
        drawLeaf(2, -12, 0.5, 12);
        drawLeaf(-1, -16, -0.4, 10);
        drawLeaf(3, -6, 0.9, 11);
        // Small flower
        ctx.fillStyle = c1;
        for (let i = 0; i < 5; i++) {
          const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          ctx.beginPath();
          ctx.ellipse(Math.cos(a) * 5, -24 + Math.sin(a) * 5, 3.5, 2, a, 0, Math.PI * 2);
          ctx.fill();
        }
        // Flower center
        ctx.fillStyle = "#f5c542";
        ctx.beginPath(); ctx.arc(0, -24, 2.5, 0, Math.PI * 2); ctx.fill();
        break;
      }
      case "notebook": {
        // Spiral-bound notebook with lined pages and colored tab
        const nbW = 44, nbH = 34;
        // Back cover
        ctx.fillStyle = c1;
        ctx.beginPath(); ctx.roundRect(-nbW / 2, -nbH / 2, nbW, nbH, 3); ctx.fill();
        // Pages (slightly offset)
        ctx.fillStyle = "#f8f5ec";
        ctx.beginPath(); ctx.roundRect(-nbW / 2 + 8, -nbH / 2 + 2, nbW - 10, nbH - 4, 2); ctx.fill();
        // Lines on page
        ctx.strokeStyle = "rgba(100,130,180,0.25)"; ctx.lineWidth = 0.7;
        for (let i = 0; i < 5; i++) {
          const ly = -nbH / 2 + 8 + i * 5;
          ctx.beginPath(); ctx.moveTo(-nbW / 2 + 12, ly); ctx.lineTo(nbW / 2 - 4, ly); ctx.stroke();
        }
        // Red margin line
        ctx.strokeStyle = "rgba(220,80,80,0.35)"; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(-nbW / 2 + 14, -nbH / 2 + 3); ctx.lineTo(-nbW / 2 + 14, nbH / 2 - 2); ctx.stroke();
        // Spiral binding (loops along left edge)
        ctx.strokeStyle = "rgba(120,120,130,0.6)"; ctx.lineWidth = 1.5;
        for (let i = 0; i < 5; i++) {
          const sy = -nbH / 2 + 6 + i * 6.5;
          ctx.beginPath();
          ctx.arc(-nbW / 2 + 6, sy, 3.5, 0, Math.PI * 2);
          ctx.stroke();
        }
        // Colored tab sticking out
        ctx.fillStyle = c2;
        ctx.beginPath();
        ctx.roundRect(nbW / 2 - 4, -nbH / 2 + 4, 8, 10, [0, 3, 3, 0]);
        ctx.fill();
        // Second tab
        ctx.fillStyle = c3;
        ctx.beginPath();
        ctx.roundRect(nbW / 2 - 4, -nbH / 2 + 16, 8, 8, [0, 3, 3, 0]);
        ctx.fill();
        break;
      }
      default:
        rect(-22, -20, 44, 30, 6, c1);
    }
    // Top highlight
    const hl = ctx.createRadialGradient(-8, -18, 2, -8, -18, 22);
    hl.addColorStop(0, "rgba(255,255,255,0.35)");
    hl.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = hl;
    ctx.beginPath();
    ctx.ellipse(0, -8, 26, 18, -0.22, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  window.TTLToyData = {
    LIFE_LABELS,
    TOY_LIBRARY: toyDefs,
    drawToy
  };
})();
