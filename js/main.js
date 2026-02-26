        // ==========================================
        // System: Setup & Utilities
        // ==========================================
        const canvas = document.getElementById('main-canvas');
        const ctx = canvas.getContext('2d');
        let width, height;
        let mouseX = 0, mouseY = 0;
        let orbWorldX = 0, orbWorldY = 0;
        let orbDragging = false;
        let orbParticles = [];       // {x, y, life, maxLife, size, vx, vy}
        let uiHoveredTone = null;
        let worldWidth = 0;
        let cameraX = 0;
        let baby = null;
        let chosenColor = '';
        let leftTrack = null;
        let middleTrack = null;
        let rightTrack = null;
        let fastTrack = null;
        let baseRhythmBpm = null;
        let choiceRhythm = {
            left: { bpm: 0, sample: null },
            middle: { bpm: 0, sample: null },
            right: { bpm: 0, sample: null },
            fast: { bpm: 0, sample: null }
        };
        let baseRhythmInfo = null;
        let baseGroove = null;
        let toneDrops = [];
        let phaseOneToyIds = [];
        let phaseTwoToyIds = [];
        let selectedToys = [];
        let inheritedHatPattern = null;
        let inheritedHatStyleClass = 'hat';
        let inheritedHatSoundConfig = null;
        let inheritedHatVolumeDb = -25;
        let inheritedSnarePattern = null;
        let inheritedSnareVelocity = null;
        let inheritedSnareStyleClass = 'snare';
        let inheritedSnareSoundConfig = null;
        let inheritedSnareVolumeDb = -20;
        let inheritedSnareBodyVolumeDb = -18;
        let level2TransitionLock = false;
        let toddlerTransitionLock = false;
        let carryHatFilter = null;
        let carryHatSynth = null;
        let carrySnareFilter = null;
        let carrySnareSynth = null;
        let carrySnareBody = null;
        let carryCymbalSynth = null;
        let inheritedCymbalPattern = null;
        let inheritedCymbalVelocity = null;
        let inheritedCymbalStyleClass = 'cymbal';
        let inheritedCymbalSoundConfig = null;
        let inheritedCymbalVolumeDb = -30;
        let inheritedChordProgression = null;
        let childLifeChoice = null;
        let childTransitionLock = false;
        let childHouseVariant = 0;
        let childFacilities = []; // 4 selected facilities for this playthrough
        let childFacilityLayouts = []; // [{cx, bW, bH}] per-facility layout info

        // CHILD2 (中学校の休み時間) variables
        let inheritedBassPattern = null;
        let inheritedBassNotes = null;
        let inheritedBassAttacks = null;
        let inheritedBassDurations = null;
        let inheritedBassSustainType = null;
        let inheritedBassStyleClass = 'bass';
        let inheritedBassSoundConfig = null;
        let child2TransitionLock = false;
        let child2ActivityChoice = null;
        let carryChordSynth = null;
        let carryChordPattern = null;
        let schoolBgNpcs = null;
        let schoolBgObjects = null;
        let hoveredSchoolActivity = null; // activityId of hovered bass drop

        let activeMinigame = null;
        let isMinigameActive = false;
        let minigameMuteGroove = false;
        let minigameTriggerDrop = null;
        const inputKeys = { w: false, a: false, s: false, d: false, space: false };
        let minigameClick = false;

        // 12 facility types for CHILD1 scene
        const CHILD_FACILITIES = [
            { id: "kindergarten", name: "ようちえん", chordMode: "major",
              color: "hsl(210, 60%, 65%)", oscType: "triangle4",
              affinity: { social: 3, optimistic: 2, expressive: 1 },
              buildingColor: "#f5e6b8", roofColor: "#d45b5b",
              sizeW: 1.3, sizeH: 0.55 },
            { id: "home", name: "おうち", chordMode: "minor",
              color: "hsl(25, 70%, 62%)", oscType: "sine4",
              affinity: { cautious: 3, patient: 2, empathetic: 1 },
              buildingColor: "#e8d8c4", roofColor: "#6a5040",
              sizeW: 0.85, sizeH: 0.48 },
            { id: "atelier", name: "アトリエ", chordMode: "major",
              color: "hsl(320, 55%, 65%)", oscType: "triangle4",
              affinity: { creative: 3, expressive: 2, curious: 1 },
              buildingColor: "#f0dce8", roofColor: "#b86090",
              sizeW: 0.9, sizeH: 0.42 },
            { id: "swimming", name: "スイミング", chordMode: "major",
              color: "hsl(195, 60%, 58%)", oscType: "sine4",
              affinity: { active: 3, resilient: 2, focused: 1 },
              buildingColor: "#d0e8f0", roofColor: "#4898b0",
              sizeW: 1.4, sizeH: 0.38 },
            { id: "baseball", name: "やきゅう場", chordMode: "major",
              color: "hsl(120, 45%, 55%)", oscType: "triangle4",
              affinity: { active: 3, social: 2, resilient: 1 },
              buildingColor: "#d8e8c8", roofColor: "#5a8838",
              sizeW: 1.5, sizeH: 0.52 },
            { id: "english", name: "えいご教室", chordMode: "minor",
              color: "hsl(270, 50%, 68%)", oscType: "sine4",
              affinity: { study: 3, social: 2, curious: 1 },
              buildingColor: "#e0d8f0", roofColor: "#7858a0",
              sizeW: 0.8, sizeH: 0.50 },
            { id: "library", name: "としょかん", chordMode: "minor",
              color: "hsl(45, 55%, 60%)", oscType: "sine4",
              affinity: { study: 3, focused: 2, patient: 1 },
              buildingColor: "#f0e8d0", roofColor: "#a08850",
              sizeW: 1.1, sizeH: 0.58 },
            { id: "piano", name: "ピアノ教室", chordMode: "major",
              color: "hsl(345, 55%, 65%)", oscType: "triangle4",
              affinity: { creative: 2, focused: 3, expressive: 1 },
              buildingColor: "#f0e0e0", roofColor: "#c06878",
              sizeW: 0.75, sizeH: 0.45 },
            { id: "park", name: "こうえん", chordMode: "major",
              color: "hsl(150, 50%, 55%)", oscType: "triangle4",
              affinity: { adventurous: 3, optimistic: 2, active: 1 },
              buildingColor: "#c8e8c0", roofColor: "#489040",
              sizeW: 1.35, sizeH: 0.40 },
            { id: "soccer", name: "サッカー場", chordMode: "major",
              color: "hsl(160, 55%, 50%)", oscType: "triangle4",
              affinity: { active: 2, social: 3, adventurous: 1 },
              buildingColor: "#c0e0c8", roofColor: "#388848",
              sizeW: 1.45, sizeH: 0.48 },
            { id: "dance", name: "ダンス教室", chordMode: "major",
              color: "hsl(290, 50%, 62%)", oscType: "triangle4",
              affinity: { expressive: 3, active: 2, social: 1 },
              buildingColor: "#e8d0f0", roofColor: "#9058a8",
              sizeW: 0.95, sizeH: 0.52 },
            { id: "science", name: "かがく教室", chordMode: "minor",
              color: "hsl(200, 55%, 58%)", oscType: "sine4",
              affinity: { curious: 3, study: 2, organized: 1 },
              buildingColor: "#d0e0f0", roofColor: "#4878a8",
              sizeW: 0.85, sizeH: 0.46 }
        ];

        // 7 school break-time activities for CHILD2 scene (baseline selection)
        const SCHOOL_ACTIVITIES = [
            { id: "sports_field", name: "運動場", bassStyle: "energetic",
              color: "hsl(15, 65%, 58%)", worldFraction: [0.02, 0.12],
              labels: { active: 3, resilient: 2, social: 1 } },
            { id: "library", name: "図書館", bassStyle: "soft",
              color: "hsl(45, 50%, 62%)", worldFraction: [0.16, 0.28],
              labels: { study: 3, focused: 2, patient: 1 } },
            { id: "science_room", name: "理科室", bassStyle: "quirky",
              color: "hsl(180, 50%, 55%)", worldFraction: [0.34, 0.48],
              labels: { curious: 3, study: 2, creative: 1 } },
            { id: "reading", name: "読書", bassStyle: "contemplative",
              color: "hsl(210, 45%, 65%)", worldFraction: [0.63, 0.71],
              labels: { study: 2, focused: 3, patient: 1 } },
            { id: "chatting", name: "おしゃべり", bassStyle: "groovy",
              color: "hsl(330, 55%, 62%)", worldFraction: [0.72, 0.80],
              labels: { social: 3, expressive: 2, optimistic: 1 } },
            { id: "doodle", name: "落書き", bassStyle: "playful",
              color: "hsl(280, 50%, 62%)", worldFraction: [0.81, 0.89],
              labels: { creative: 3, expressive: 2, adventurous: 1 } },
            { id: "organ", name: "オルガン", bassStyle: "melodic",
              color: "hsl(350, 55%, 60%)", worldFraction: [0.90, 0.98],
              labels: { creative: 2, expressive: 3, focused: 1 } }
        ];

        function selectChildFacilities() {
            // Accumulate life labels from all previously selected toys
            const totals = {};
            selectedToys.forEach(t => {
                if (!t.labels) return;
                Object.entries(t.labels).forEach(([k, v]) => {
                    totals[k] = (totals[k] || 0) + v;
                });
            });

            // Score each facility by affinity match with player's labels
            const scored = CHILD_FACILITIES.map(fac => {
                let score = 0;
                Object.entries(fac.affinity).forEach(([label, weight]) => {
                    score += (totals[label] || 0) * weight;
                });
                // Add small random jitter so ties are broken differently each time
                score += Math.random() * 2;
                return { fac, score };
            });

            // Sort by score descending and pick top 4
            scored.sort((a, b) => b.score - a.score);
            return scored.slice(0, 4).map(s => s.fac);
        }
        const scoreHudState = { rows: [], totalSteps: 0, currentStep: -1, previewDropIndex: -1, chordCells: null, barLabelCells: null };
        let scoreHudEnabled = true;
        const toySystem = window.TTLToyData || { LIFE_LABELS: [], TOY_LIBRARY: [], drawToy: () => {} };

        // シーン管理
        const SCENE = { TITLE: 0, CHOICE: 1, TRANSITION: 2, CRAWL: 3, CRAWL2: 4, TODDLE1: 5, CHILD1: 6, CHILD2: 7, LESSON: 8, ADULT: 9 };
        let currentScene = SCENE.TITLE;
        const RHYTHM_BARS = 4;
        const STEPS_PER_BEAT = 4;
        const ROOM_WALL_RATIO = 0.50;
        const TONE_FLOOR_OFFSET = 56;

        // カラーパレット生成 (Calm/Pastel)
        function generatePalette() {
            const hue = Math.floor(Math.random() * 360);
            return {
                bg: `hsl(${hue}, 20%, 96%)`,
                colors: [
                    `hsl(${hue}, 60%, 75%)`,
                    `hsl(${(hue + 60)%360}, 60%, 75%)`,
                    `hsl(${(hue + 150)%360}, 60%, 75%)`,
                    `hsl(${(hue + 210)%360}, 60%, 75%)`,
                    `hsl(${(hue + 300)%360}, 60%, 75%)`
                ],
                btnColor: `hsl(${hue}, 60%, 60%)`
            };
        }
        const palette = generatePalette();
        const choiceColors = [palette.colors[1], palette.colors[2], palette.colors[3], palette.colors[4]];

        function getHslLightness(hsl) {
            const m = hsl.match(/hsl\(\s*[-\d.]+\s*,\s*[-\d.]+%\s*,\s*([-\d.]+)%\s*\)/i);
            return m ? Number(m[1]) : 0;
        }

        function getBrightestChoiceColor(colors) {
            return colors.reduce((best, current) => {
                return getHslLightness(current) > getHslLightness(best) ? current : best;
            });
        }

        const brightestChoiceColor = getBrightestChoiceColor(choiceColors);
        function pickPacifierColor(excludedColors) {
            const candidates = [palette.colors[3], palette.btnColor, palette.bg, "hsl(330, 70%, 62%)"];
            return candidates.find(color => !excludedColors.has(color)) || "hsl(330, 70%, 62%)";
        }
        function pickFloorColor() {
            return palette.colors[Math.floor(Math.random() * palette.colors.length)];
        }
        const babyFaceType = Math.floor(Math.random() * 5);
        const babyIsBoy = Math.random() < 0.5;
        const babyHue = parseInt((palette.colors[0].match(/hsl\(\s*(\d+)/) || [0, '200'])[1]);
        const babyColorScheme = {
            body: `hsl(${babyHue}, 82%, 68%)`,
            limb: `hsl(${(babyHue + 50) % 360}, 78%, 66%)`,
            head: `hsl(25, 68%, 84%)`,
            skin: `hsl(25, 68%, 84%)`,
            cheek: `hsl(350, 62%, 78%)`,
            hair: `hsl(28, 42%, 55%)`
        };
        babyColorScheme.pacifier = pickPacifierColor(new Set([
            babyColorScheme.body,
            babyColorScheme.limb,
            babyColorScheme.head,
            babyColorScheme.skin
        ]));
        let floorColor = palette.colors[2];
        
        // 初期スタイル適用
        document.body.style.backgroundColor = palette.bg;
        document.getElementById('start-btn').style.backgroundColor = palette.btnColor;
        document.getElementById('btn-left').style.backgroundColor = palette.colors[1];
        document.getElementById('btn-middle').style.backgroundColor = palette.colors[2];
        document.getElementById('btn-right').style.backgroundColor = palette.colors[3];
        document.getElementById('btn-fast').style.backgroundColor = palette.colors[4];

        // リサイズ処理
        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            worldWidth = Math.max(width * 1.5, 1200);
            cameraX = Math.max(0, Math.min(cameraX, Math.max(0, worldWidth - width)));
            if (baby) {
                baby.x = Math.max(80, Math.min(worldWidth - 80, baby.x));
                baby.y = height * ROOM_WALL_RATIO;
            }
            if (toneDrops.length) {
                const floorY = height * ROOM_WALL_RATIO + TONE_FLOOR_OFFSET;
                toneDrops.forEach((drop, i) => {
                    drop.x = Math.max(180, Math.min(worldWidth - 180, drop.x));
                    drop.y = floorY + (i % 2 === 0 ? -8 : 8);
                });
            }
        }
        window.addEventListener('resize', resize);
        resize();

        // オーブ & マウス追従
        const orbEl = document.getElementById('custom-cursor');
        const hoverInfoEl = document.getElementById('tone-hover-info');

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX; mouseY = e.clientY;
            const isGameplay = currentScene >= SCENE.CRAWL;
            orbWorldX = isGameplay ? e.clientX + cameraX : e.clientX;
            orbWorldY = e.clientY;
            if (orbDragging) {
                emitOrbParticles(orbWorldX, orbWorldY, 2);
            }
        });

        function getUiToneAtScreenPoint(screenX, screenY) {
            startBtn.classList.remove('orb-hover');
            btnLeft.classList.remove('orb-hover');
            btnMiddle.classList.remove('orb-hover');
            btnRight.classList.remove('orb-hover');
            btnFast.classList.remove('orb-hover');

            const list = [];
            if (currentScene === SCENE.TITLE) {
                list.push({ id: 'start', el: startBtn });
            } else if (currentScene === SCENE.CHOICE) {
                list.push({ id: 'left', el: btnLeft }, { id: 'middle', el: btnMiddle }, { id: 'right', el: btnRight }, { id: 'fast', el: btnFast });
            }
            for (const c of list) {
                const r = c.el.getBoundingClientRect();
                const cx = r.left + r.width / 2;
                const cy = r.top + r.height / 2;
                const hit = Math.hypot(screenX - cx, screenY - cy) <= r.width / 2 + 10;
                c.el.classList.toggle('orb-hover', hit);
                if (!hit) continue;
                return c;
            }
            return null;
        }

        function getToneDropAtScreenPoint(screenX, screenY) {
            if (currentScene < SCENE.CRAWL || !toneDrops.length) return null;
            const wx = screenX + cameraX;
            const wy = screenY;
            const picked = toneDrops.find(drop => {
                return Math.hypot(wx - drop.x, wy - drop.y) <= 60;
            });
            return picked || null;
        }

        // ドラッグ開始・終了
        window.addEventListener('mousedown', (e) => {
            orbDragging = true;
            orbEl.classList.add('dragging');
        });
        window.addEventListener('mouseup', () => {
            orbDragging = false;
            orbEl.classList.remove('dragging');
        });

        function updateOrbScreenPosition() {
            orbEl.style.left = mouseX + 'px';
            orbEl.style.top = mouseY + 'px';
            orbEl.style.opacity = '1';
        }

        // 初期オーブ配置（DOMContentLoaded後）
        function initOrbPosition() {
            const btnRect = startBtn.getBoundingClientRect();
            orbWorldX = btnRect.left + btnRect.width / 2;
            orbWorldY = btnRect.top - 60;
            updateOrbScreenPosition();
        }

        function clamp01(v) {
            return Math.max(0, Math.min(1, v));
        }

        function getUiToneInfo(toneId) {
            if (toneId === 'start') {
                return { title: 'Start Tone', meta: 'Sound: Cmaj7 Chime', label: 'Begin a life rhythm' };
            }
            const side = toneId;
            const rhythm = choiceRhythm[side];
            const sideLabel = side === 'left'
                ? 'Calm'
                : (side === 'middle'
                    ? 'Steady'
                    : (side === 'right' ? 'Eager' : 'Rapid'));
            if (!rhythm || !rhythm.sample) {
                return { title: `${sideLabel} Tone`, meta: 'Sound: Kick Preview', label: `Style: ${sideLabel}` };
            }
            return {
                title: `${sideLabel} Tone`,
                meta: `Sound: Kick ${rhythm.sample.ruleName} / ${Math.round(rhythm.bpm)} BPM`,
                label: `Letters: ${rhythm.sample.letters.join('-')}`
            };
        }

        function getDropToneInfo(drop) {
            if (!drop) return null;
            const toyTop = drop.toy?.labels
                ? Object.entries(drop.toy.labels)
                    .filter(([, v]) => v > 0)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([k]) => k)
                    .join(', ')
                : '';
            if (drop.instrument === 'chord') {
                return {
                    title: drop.facilityName || 'Chord Tone',
                    meta: `Sound: Chord ${drop.chordProgression?.chords?.[0] || ''}`,
                    label: toyTop ? `Labels: ${toyTop}` : 'Labels: harmonic'
                };
            }
            if (drop.instrument === 'bass') {
                return {
                    title: drop.activityName || 'Bass Tone',
                    meta: `Sound: Bass ${drop.bassStyle || ''}`,
                    label: `Labels: ${Object.keys(drop.activityLabels || {}).slice(0, 3).join(', ') || 'activity'}`
                };
            }
            const soundName = drop.instrument === 'hat'
                ? 'Hi-Hat'
                : (drop.instrument === 'snare' ? 'Snare' : (drop.instrument === 'cymbal' ? 'Cymbal' : 'Tone'));
            return {
                title: drop.toy?.name || `${soundName} Tone`,
                meta: `Sound: ${soundName}`,
                label: toyTop ? `Labels: ${toyTop}` : 'Labels: rhythm'
            };
        }

        function setHoverInfo(info) {
            if (!hoverInfoEl || !info) {
                if (hoverInfoEl) hoverInfoEl.classList.remove('visible');
                return;
            }
            hoverInfoEl.innerHTML = `<strong>${info.title}</strong><span>${info.meta}</span><span>${info.label}</span>`;
            hoverInfoEl.style.left = `${mouseX + 18}px`;
            hoverInfoEl.style.top = `${mouseY + 18}px`;
            hoverInfoEl.classList.add('visible');
        }

        async function pickToneDropAt(screenX, screenY) {
            if (currentScene < SCENE.CRAWL || !toneDrops.length) return;
            await ensureAudioReady();
            const picked = getToneDropAtScreenPoint(screenX, screenY);
            if (!picked) return;
            if (currentScene === SCENE.CRAWL) {
                transitionToLevel2(picked);
            } else if (currentScene === SCENE.CRAWL2) {
                transitionToToddler1(picked);
            } else if (currentScene === SCENE.TODDLE1) {
                transitionToChild1(picked);
            } else if (currentScene === SCENE.CHILD1) {
                handleChildChoice(picked);
            } else if (currentScene === SCENE.CHILD2) {
                handleChild2Choice(picked);
            }
        }

        window.addEventListener('click', (e) => {
            if (isMinigameActive) {
                minigameClick = true;
            } else {
                void pickToneDropAt(e.clientX, e.clientY);
            }
        });

        // パーティクルトレイル
        function emitOrbParticles(wx, wy, count) {
            for (let i = 0; i < count; i++) {
                if (orbParticles.length >= 200) orbParticles.shift();
                orbParticles.push({
                    x: wx + (Math.random() - 0.5) * 10,
                    y: wy + (Math.random() - 0.5) * 10,
                    life: 0,
                    maxLife: 30 + Math.random() * 30,
                    size: 3 + Math.random() * 5,
                    vx: (Math.random() - 0.5) * 1.2,
                    vy: -0.5 - Math.random() * 1.0
                });
            }
        }

        function updateAndDrawOrbParticles() {
            if (!orbParticles.length) return;
            const isGameplay = currentScene >= SCENE.CRAWL;
            ctx.save();
            for (let i = orbParticles.length - 1; i >= 0; i--) {
                const p = orbParticles[i];
                p.life++;
                p.x += p.vx;
                p.y += p.vy;
                if (p.life >= p.maxLife) {
                    orbParticles.splice(i, 1);
                    continue;
                }
                const progress = p.life / p.maxLife;
                const alpha = 1 - progress;
                const sz = p.size * (1 - progress * 0.6);
                const sx = isGameplay ? p.x - cameraX : p.x;
                const sy = p.y;

                // Pastel pink/purple glow matching tone drop palette
                const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sz);
                const mix = p.vx > 0 ? 0.6 : 0.4; // vary pink vs purple per particle
                if (mix > 0.5) {
                    grad.addColorStop(0, `rgba(229, 142, 170, ${alpha * 0.8})`);
                    grad.addColorStop(0.6, `rgba(229, 142, 170, ${alpha * 0.3})`);
                } else {
                    grad.addColorStop(0, `rgba(198, 128, 219, ${alpha * 0.8})`);
                    grad.addColorStop(0.6, `rgba(198, 128, 219, ${alpha * 0.3})`);
                }
                grad.addColorStop(1, `rgba(198, 128, 219, 0)`);
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.arc(sx, sy, sz, 0, Math.PI * 2);
                ctx.fill();

                // White sparkle center
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
                ctx.beginPath();
                ctx.arc(sx, sy, sz * 0.3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
        // Visuals: Classes
        class OrganicBlob {
            constructor(color) {
                this.color = color;
                this.init();
            }
            init() {
                this.x = Math.random() * width; this.y = Math.random() * height;
                this.radius = Math.min(width, height) * (Math.random() * 0.2 + 0.15);
                this.points = []; const numPoints = 7;
                for(let i=0; i<numPoints; i++) {
                    this.points.push({
                        angle: (Math.PI*2/numPoints)*i,
                        rOffset: this.radius * (Math.random()*0.4 + 0.8),
                        speed: Math.random()*0.003 + 0.001,
                        phase: Math.random()*Math.PI*2
                    });
                }
                this.vx = (Math.random()-0.5)*0.3; this.vy = (Math.random()-0.5)*0.3;
            }
            update() {
                this.x += this.vx; this.y += this.vy;
                if(this.x < -200) this.x = width+200; if(this.x > width+200) this.x = -200;
                if(this.y < -200) this.y = height+200; if(this.y > height+200) this.y = -200;
                this.points.forEach(p => p.phase += p.speed);
            }
            draw(ctx) {
                ctx.fillStyle = this.color; ctx.beginPath();
                const getPt = (i) => {
                    const p = this.points[(i+this.points.length)%this.points.length];
                    const r = p.rOffset + Math.sin(p.phase)*15;
                    return { x: this.x + Math.cos(p.angle)*r, y: this.y + Math.sin(p.angle)*r };
                };
                const p0 = getPt(0); const p1 = getPt(1);
                ctx.moveTo((p0.x+p1.x)/2, (p0.y+p1.y)/2);
                for(let i=1; i<=this.points.length; i++) {
                    const pc = getPt(i); const pn = getPt(i+1);
                    ctx.quadraticCurveTo(pc.x, pc.y, (pc.x+pn.x)/2, (pc.y+pn.y)/2);
                }
                ctx.fill();
            }
        }

        // 2. The Baby Rig (Crawling)
        class Baby {
            constructor(colors) {
                this.x = width / 2;
                this.y = height * ROOM_WALL_RATIO; // Floor level
                this.scale = 0.8;
                this.colors = colors;
                this.direction = 1; 
                this.walkCycle = 0;
                // Colors from palette
                this.bodyColor = colors.body;
                this.limbColor = colors.limb;
                this.headColor = colors.head;
                this.skinColor = colors.skin;
                this.pacifierColor = colors.pacifier;
                this.cheekColor = colors.cheek || "hsl(350, 62%, 78%)";
                this.hairColor = colors.hair || "hsl(28, 42%, 55%)";
                this.faceType = babyFaceType;
            }
            update(tx) {
                const dx = tx - this.x;
                if(Math.abs(dx) > 10) {
                    this.direction = dx > 0 ? 1 : -1;
                    const speed = Math.min(Math.abs(dx)*0.04, 2.5);
                    this.x += speed * this.direction;
                    this.walkCycle += 0.15;
                } else {
                    this.walkCycle += 0.05; // Idle breathing
                }
                this.x = Math.max(80, Math.min(worldWidth - 80, this.x));
            }
            drawPart(ctx, x, y, ang, fn) {
                ctx.save(); ctx.translate(x, y); ctx.rotate(ang); fn(ctx); ctx.restore();
            }
            draw(ctx) {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.scale(this.direction * this.scale, this.scale);

                const t = this.walkCycle;
                const bodyBob = 2 + Math.sin(t * 2) * 1.8;
                const headNod = Math.sin(t * 2 + 0.5) * 0.05;

                // Crawl gait (diagonal alternation)
                const armUpperL = -0.52 + Math.sin(t + Math.PI) * 0.32;
                const armUpperR = -0.52 + Math.sin(t) * 0.32;
                // Legs: keep a kneeling posture and move on knees.
                const legUpperL = 0.36 + Math.sin(t) * 0.28;
                const legUpperR = 0.36 + Math.sin(t + Math.PI) * 0.28;

                // Keep forearm/shin nearly parallel to the ground.
                const armLowerL = -armUpperL + Math.sin(t + Math.PI) * 0.06;
                const armLowerR = -armUpperR + Math.sin(t) * 0.06;
                // Keep shin always parallel to the ground (absolute angle ~= 90deg).
                const shinParallel = Math.PI * 0.5;
                const legLowerL = shinParallel - legUpperL;
                const legLowerR = shinParallel - legUpperR;

                const drawArm = (x, y, upperAng, lowerAng) => {
                    this.drawPart(ctx, x, y + bodyBob, upperAng, c => {
                        // Upper arm = onesie sleeve
                        c.fillStyle = this.limbColor;
                        c.beginPath(); c.roundRect(-6, 0, 12, 22, 6); c.fill();
                        this.drawPart(c, 0, 22, lowerAng, c2 => {
                            // Forearm = skin color, chubby
                            c2.fillStyle = this.skinColor;
                            c2.beginPath(); c2.roundRect(-5, 0, 10, 20, 5); c2.fill();
                            // Chubby hand
                            c2.fillStyle = this.skinColor;
                            c2.beginPath(); c2.ellipse(0, 22, 9, 5, 0, 0, Math.PI * 2); c2.fill();
                        });
                    });
                };

                const drawLeg = (x, y, upperAng, lowerAng) => {
                    this.drawPart(ctx, x, y + bodyBob, upperAng, c => {
                        // Upper leg = onesie
                        c.fillStyle = this.limbColor;
                        c.beginPath(); c.roundRect(-7, 0, 14, 14, 7); c.fill();
                        // Knee (skin)
                        c.fillStyle = this.skinColor;
                        c.beginPath(); c.ellipse(0, 14, 8, 5, 0, 0, Math.PI * 2); c.fill();
                        this.drawPart(c, 0, 14, lowerAng, c2 => {
                            // Lower leg = skin, chubby
                            c2.fillStyle = this.skinColor;
                            c2.beginPath(); c2.roundRect(-5, 0, 10, 14, 5); c2.fill();
                            // Chubby foot
                            c2.fillStyle = this.skinColor;
                            c2.beginPath(); c2.ellipse(7, 14, 8.5, 5, 0, 0, Math.PI * 2); c2.fill();
                        });
                    });
                };

                // Back limbs
                drawArm(9, -34, armUpperL, armLowerL);
                drawLeg(-16, -15, legUpperL, legLowerL);

                // Body (round onesie)
                ctx.translate(0, bodyBob);
                ctx.fillStyle = this.bodyColor;
                ctx.beginPath(); ctx.ellipse(-10, -25, 26, 21, 0, 0, Math.PI*2); ctx.fill(); // Hip
                ctx.beginPath(); ctx.ellipse(10, -35, 23, 19, -0.2, 0, Math.PI*2); ctx.fill(); // Chest
                // Belly detail (slightly lighter patch)
                ctx.fillStyle = "rgba(255,255,255,0.1)";
                ctx.beginPath(); ctx.ellipse(0, -28, 14, 12, -0.1, 0, Math.PI*2); ctx.fill();
                // Snap button hints on belly
                ctx.fillStyle = "rgba(255,255,255,0.3)";
                ctx.beginPath(); ctx.arc(-4, -24, 1.5, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(4, -25, 1.5, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(12, -27, 1.5, 0, Math.PI * 2); ctx.fill();

                ctx.translate(0, -bodyBob);

                // Front limbs (drawn BEFORE head so head is on top)
                drawLeg(-16, -15, legUpperR, legLowerR);
                drawArm(9, -34, armUpperR, armLowerR);

                // Head (drawn last = frontmost layer)
                ctx.translate(0, bodyBob);
                this.drawPart(ctx, 25, -50, -0.2 + headNod, c => {
                    // Head (skin tone, bigger)
                    c.fillStyle = this.skinColor;
                    c.beginPath(); c.arc(0, 0, 30, 0, Math.PI * 2); c.fill();

                    // Small ear circles
                    c.fillStyle = this.skinColor;
                    c.beginPath(); c.arc(-26, 4, 7, 0, Math.PI * 2); c.fill();
                    c.beginPath(); c.arc(20, 8, 7, 0, Math.PI * 2); c.fill();
                    // Inner ear pink
                    c.fillStyle = this.cheekColor;
                    c.beginPath(); c.arc(-26, 4, 4, 0, Math.PI * 2); c.fill();
                    c.beginPath(); c.arc(20, 8, 4, 0, Math.PI * 2); c.fill();

                    // Hair wisps on top
                    c.strokeStyle = this.hairColor;
                    c.lineWidth = 2.5; c.lineCap = "round";
                    c.beginPath(); c.moveTo(-6, -30);
                    c.quadraticCurveTo(-8, -38, -4, -32); c.stroke();
                    c.beginPath(); c.moveTo(-2, -30);
                    c.quadraticCurveTo(2, -40, 6, -32); c.stroke();
                    c.beginPath(); c.moveTo(4, -30);
                    c.quadraticCurveTo(10, -37, 12, -28); c.stroke();
                    c.lineCap = "butt";

                    // --- 5 face types ---
                    const ft = this.faceType;

                    // Rosy cheeks (all faces)
                    c.fillStyle = this.cheekColor;
                    c.globalAlpha = 0.45;
                    c.beginPath(); c.ellipse(-14, 6, 7, 5, 0, 0, Math.PI * 2); c.fill();
                    c.beginPath(); c.ellipse(20, 6, 6, 4.5, 0, 0, Math.PI * 2); c.fill();
                    c.globalAlpha = 1;

                    if (ft === 0) {
                        // Type 0: Big round eyes, happy (default cute)
                        // Left eye
                        c.fillStyle = "#fff";
                        c.beginPath(); c.ellipse(-8, -6, 9, 10, 0, 0, Math.PI * 2); c.fill();
                        c.fillStyle = "rgba(50,40,35,0.9)";
                        c.beginPath(); c.arc(-6, -4, 5, 0, Math.PI * 2); c.fill();
                        c.fillStyle = "#1a1a22";
                        c.beginPath(); c.arc(-5, -4, 3, 0, Math.PI * 2); c.fill();
                        c.fillStyle = "#fff";
                        c.beginPath(); c.arc(-7, -6, 2, 0, Math.PI * 2); c.fill();
                        c.beginPath(); c.arc(-4, -2, 1, 0, Math.PI * 2); c.fill();
                        // Right eye
                        c.fillStyle = "#fff";
                        c.beginPath(); c.ellipse(12, -6, 8, 9, 0, 0, Math.PI * 2); c.fill();
                        c.fillStyle = "rgba(50,40,35,0.9)";
                        c.beginPath(); c.arc(14, -4, 4.5, 0, Math.PI * 2); c.fill();
                        c.fillStyle = "#1a1a22";
                        c.beginPath(); c.arc(15, -4, 2.8, 0, Math.PI * 2); c.fill();
                        c.fillStyle = "#fff";
                        c.beginPath(); c.arc(13, -6, 1.8, 0, Math.PI * 2); c.fill();
                        c.beginPath(); c.arc(16, -2, 0.9, 0, Math.PI * 2); c.fill();
                        // Nose
                        c.fillStyle = "rgba(200,150,130,0.6)";
                        c.beginPath(); c.ellipse(4, 4, 3, 2.2, 0, 0, Math.PI * 2); c.fill();
                    } else if (ft === 1) {
                        // Type 1: Sleepy/droopy eyes, relaxed smile
                        // Left eye (half-closed)
                        c.fillStyle = "#fff";
                        c.beginPath(); c.ellipse(-8, -4, 8, 5, 0, 0, Math.PI * 2); c.fill();
                        c.fillStyle = "rgba(50,40,35,0.9)";
                        c.beginPath(); c.arc(-6, -3, 4, 0, Math.PI * 2); c.fill();
                        c.fillStyle = "#1a1a22";
                        c.beginPath(); c.arc(-5, -3, 2.5, 0, Math.PI * 2); c.fill();
                        c.fillStyle = "#fff";
                        c.beginPath(); c.arc(-7, -4, 1.5, 0, Math.PI * 2); c.fill();
                        // Eyelid (droopy top)
                        c.fillStyle = this.skinColor;
                        c.beginPath(); c.ellipse(-8, -7, 9, 5, 0, 0, Math.PI); c.fill();
                        // Right eye (half-closed)
                        c.fillStyle = "#fff";
                        c.beginPath(); c.ellipse(12, -4, 7, 4.5, 0, 0, Math.PI * 2); c.fill();
                        c.fillStyle = "rgba(50,40,35,0.9)";
                        c.beginPath(); c.arc(14, -3, 3.5, 0, Math.PI * 2); c.fill();
                        c.fillStyle = "#1a1a22";
                        c.beginPath(); c.arc(15, -3, 2.2, 0, Math.PI * 2); c.fill();
                        c.fillStyle = "#fff";
                        c.beginPath(); c.arc(13, -4, 1.3, 0, Math.PI * 2); c.fill();
                        c.fillStyle = this.skinColor;
                        c.beginPath(); c.ellipse(12, -7, 8, 4.5, 0, 0, Math.PI); c.fill();
                        // Nose
                        c.fillStyle = "rgba(200,150,130,0.6)";
                        c.beginPath(); c.ellipse(4, 4, 3, 2.2, 0, 0, Math.PI * 2); c.fill();
                        // Relaxed smile
                        c.strokeStyle = "rgba(160,100,80,0.5)"; c.lineWidth = 1.5;
                        c.beginPath(); c.arc(6, 10, 6, -0.3, Math.PI + 0.3); c.stroke();
                    } else if (ft === 2) {
                        // Type 2: Sparkling star eyes, excited
                        // Left eye (star-shaped sparkle)
                        c.fillStyle = "#fff";
                        c.beginPath(); c.ellipse(-8, -6, 9, 10, 0, 0, Math.PI * 2); c.fill();
                        c.fillStyle = "rgba(50,40,35,0.9)";
                        c.beginPath(); c.arc(-6, -4, 5, 0, Math.PI * 2); c.fill();
                        // Star sparkle instead of round catchlight
                        c.fillStyle = "#fff";
                        c.beginPath();
                        for (let i = 0; i < 4; i++) {
                            const a = (Math.PI * 2 * i) / 4 - Math.PI / 4;
                            const r = i % 2 === 0 ? 3 : 1.2;
                            const sx = -7 + Math.cos(a) * r, sy = -5 + Math.sin(a) * r;
                            i === 0 ? c.moveTo(sx, sy) : c.lineTo(sx, sy);
                        }
                        c.closePath(); c.fill();
                        // Right eye
                        c.fillStyle = "#fff";
                        c.beginPath(); c.ellipse(12, -6, 8, 9, 0, 0, Math.PI * 2); c.fill();
                        c.fillStyle = "rgba(50,40,35,0.9)";
                        c.beginPath(); c.arc(14, -4, 4.5, 0, Math.PI * 2); c.fill();
                        c.fillStyle = "#fff";
                        c.beginPath();
                        for (let i = 0; i < 4; i++) {
                            const a = (Math.PI * 2 * i) / 4 - Math.PI / 4;
                            const r = i % 2 === 0 ? 2.6 : 1;
                            const sx = 13 + Math.cos(a) * r, sy = -5 + Math.sin(a) * r;
                            i === 0 ? c.moveTo(sx, sy) : c.lineTo(sx, sy);
                        }
                        c.closePath(); c.fill();
                        // Nose
                        c.fillStyle = "rgba(200,150,130,0.6)";
                        c.beginPath(); c.ellipse(4, 4, 3, 2.2, 0, 0, Math.PI * 2); c.fill();
                        // Open excited mouth
                        c.fillStyle = "rgba(180,90,90,0.45)";
                        c.beginPath(); c.ellipse(6, 12, 5, 3.5, 0, 0, Math.PI * 2); c.fill();
                    } else if (ft === 3) {
                        // Type 3: Dot eyes (^_^), happy squint
                        // Left eye (closed happy arc)
                        c.strokeStyle = "rgba(50,40,35,0.85)"; c.lineWidth = 2.5; c.lineCap = "round";
                        c.beginPath(); c.arc(-6, -4, 5, -Math.PI * 0.8, -Math.PI * 0.2); c.stroke();
                        // Right eye
                        c.beginPath(); c.arc(14, -4, 4.5, -Math.PI * 0.8, -Math.PI * 0.2); c.stroke();
                        c.lineCap = "butt";
                        // Nose
                        c.fillStyle = "rgba(200,150,130,0.6)";
                        c.beginPath(); c.ellipse(4, 4, 3, 2.2, 0, 0, Math.PI * 2); c.fill();
                        // Happy wide smile
                        c.strokeStyle = "rgba(160,100,80,0.5)"; c.lineWidth = 1.5;
                        c.beginPath(); c.arc(4, 8, 8, 0.1, Math.PI - 0.1); c.stroke();
                    } else {
                        // Type 4: Wide curious eyes, small 'o' mouth
                        // Left eye (wide open, looking up)
                        c.fillStyle = "#fff";
                        c.beginPath(); c.ellipse(-8, -6, 10, 11, 0, 0, Math.PI * 2); c.fill();
                        c.fillStyle = "rgba(70,50,30,0.85)";
                        c.beginPath(); c.arc(-6, -6, 5.5, 0, Math.PI * 2); c.fill();
                        c.fillStyle = "#1a1a22";
                        c.beginPath(); c.arc(-5, -6, 3.5, 0, Math.PI * 2); c.fill();
                        c.fillStyle = "#fff";
                        c.beginPath(); c.arc(-7, -8, 2.2, 0, Math.PI * 2); c.fill();
                        c.beginPath(); c.arc(-4, -4, 1, 0, Math.PI * 2); c.fill();
                        // Right eye
                        c.fillStyle = "#fff";
                        c.beginPath(); c.ellipse(12, -6, 9, 10, 0, 0, Math.PI * 2); c.fill();
                        c.fillStyle = "rgba(70,50,30,0.85)";
                        c.beginPath(); c.arc(14, -6, 5, 0, Math.PI * 2); c.fill();
                        c.fillStyle = "#1a1a22";
                        c.beginPath(); c.arc(15, -6, 3.2, 0, Math.PI * 2); c.fill();
                        c.fillStyle = "#fff";
                        c.beginPath(); c.arc(13, -8, 2, 0, Math.PI * 2); c.fill();
                        c.beginPath(); c.arc(16, -4, 0.9, 0, Math.PI * 2); c.fill();
                        // Nose
                        c.fillStyle = "rgba(200,150,130,0.6)";
                        c.beginPath(); c.ellipse(4, 4, 3, 2.2, 0, 0, Math.PI * 2); c.fill();
                        // Small 'o' mouth
                        c.fillStyle = "rgba(180,100,90,0.4)";
                        c.beginPath(); c.arc(6, 12, 3.5, 0, Math.PI * 2); c.fill();
                    }

                    // Pacifier (positioned at the mouth)
                    // Shield (centered on mouth area)
                    c.fillStyle = this.pacifierColor;
                    c.beginPath();
                    c.moveTo(10, 8);
                    c.quadraticCurveTo(6, 18, 14, 20);
                    c.quadraticCurveTo(22, 20, 22, 13);
                    c.quadraticCurveTo(22, 6, 14, 6);
                    c.closePath();
                    c.fill();
                    // Shield highlight
                    c.fillStyle = "rgba(255,255,255,0.25)";
                    c.beginPath();
                    c.ellipse(15, 11, 4, 2.5, 0, 0, Math.PI * 2);
                    c.fill();
                    // Ring (handle, hangs below)
                    c.strokeStyle = "rgba(255, 255, 255, 0.6)";
                    c.lineWidth = 2;
                    c.beginPath();
                    c.arc(14, 22, 4, 0, Math.PI * 2);
                    c.stroke();
                });

                ctx.translate(0, -bodyBob);
                ctx.restore();
            }
        }

        // Shared face drawing helper (used by Baby and Toddler)
        function drawBabyFace(c, faceType, skinColor, cheekColor, pacifierColor, drawPacifier) {
            const ft = faceType;

            // Rosy cheeks (all faces)
            c.fillStyle = cheekColor;
            c.globalAlpha = 0.45;
            c.beginPath(); c.ellipse(-14, 6, 7, 5, 0, 0, Math.PI * 2); c.fill();
            c.beginPath(); c.ellipse(20, 6, 6, 4.5, 0, 0, Math.PI * 2); c.fill();
            c.globalAlpha = 1;

            if (ft === 0) {
                c.fillStyle = "#fff";
                c.beginPath(); c.ellipse(-8, -6, 9, 10, 0, 0, Math.PI * 2); c.fill();
                c.fillStyle = "rgba(50,40,35,0.9)";
                c.beginPath(); c.arc(-6, -4, 5, 0, Math.PI * 2); c.fill();
                c.fillStyle = "#1a1a22";
                c.beginPath(); c.arc(-5, -4, 3, 0, Math.PI * 2); c.fill();
                c.fillStyle = "#fff";
                c.beginPath(); c.arc(-7, -6, 2, 0, Math.PI * 2); c.fill();
                c.beginPath(); c.arc(-4, -2, 1, 0, Math.PI * 2); c.fill();
                c.fillStyle = "#fff";
                c.beginPath(); c.ellipse(12, -6, 8, 9, 0, 0, Math.PI * 2); c.fill();
                c.fillStyle = "rgba(50,40,35,0.9)";
                c.beginPath(); c.arc(14, -4, 4.5, 0, Math.PI * 2); c.fill();
                c.fillStyle = "#1a1a22";
                c.beginPath(); c.arc(15, -4, 2.8, 0, Math.PI * 2); c.fill();
                c.fillStyle = "#fff";
                c.beginPath(); c.arc(13, -6, 1.8, 0, Math.PI * 2); c.fill();
                c.beginPath(); c.arc(16, -2, 0.9, 0, Math.PI * 2); c.fill();
                c.fillStyle = "rgba(200,150,130,0.6)";
                c.beginPath(); c.ellipse(4, 4, 3, 2.2, 0, 0, Math.PI * 2); c.fill();
            } else if (ft === 1) {
                c.fillStyle = "#fff";
                c.beginPath(); c.ellipse(-8, -4, 8, 5, 0, 0, Math.PI * 2); c.fill();
                c.fillStyle = "rgba(50,40,35,0.9)";
                c.beginPath(); c.arc(-6, -3, 4, 0, Math.PI * 2); c.fill();
                c.fillStyle = "#1a1a22";
                c.beginPath(); c.arc(-5, -3, 2.5, 0, Math.PI * 2); c.fill();
                c.fillStyle = "#fff";
                c.beginPath(); c.arc(-7, -4, 1.5, 0, Math.PI * 2); c.fill();
                c.fillStyle = skinColor;
                c.beginPath(); c.ellipse(-8, -7, 9, 5, 0, 0, Math.PI); c.fill();
                c.fillStyle = "#fff";
                c.beginPath(); c.ellipse(12, -4, 7, 4.5, 0, 0, Math.PI * 2); c.fill();
                c.fillStyle = "rgba(50,40,35,0.9)";
                c.beginPath(); c.arc(14, -3, 3.5, 0, Math.PI * 2); c.fill();
                c.fillStyle = "#1a1a22";
                c.beginPath(); c.arc(15, -3, 2.2, 0, Math.PI * 2); c.fill();
                c.fillStyle = "#fff";
                c.beginPath(); c.arc(13, -4, 1.3, 0, Math.PI * 2); c.fill();
                c.fillStyle = skinColor;
                c.beginPath(); c.ellipse(12, -7, 8, 4.5, 0, 0, Math.PI); c.fill();
                c.fillStyle = "rgba(200,150,130,0.6)";
                c.beginPath(); c.ellipse(4, 4, 3, 2.2, 0, 0, Math.PI * 2); c.fill();
                c.strokeStyle = "rgba(160,100,80,0.5)"; c.lineWidth = 1.5;
                c.beginPath(); c.arc(6, 10, 6, -0.3, Math.PI + 0.3); c.stroke();
            } else if (ft === 2) {
                c.fillStyle = "#fff";
                c.beginPath(); c.ellipse(-8, -6, 9, 10, 0, 0, Math.PI * 2); c.fill();
                c.fillStyle = "rgba(50,40,35,0.9)";
                c.beginPath(); c.arc(-6, -4, 5, 0, Math.PI * 2); c.fill();
                c.fillStyle = "#fff";
                c.beginPath();
                for (let i = 0; i < 4; i++) {
                    const a = (Math.PI * 2 * i) / 4 - Math.PI / 4;
                    const r = i % 2 === 0 ? 3 : 1.2;
                    const sx = -7 + Math.cos(a) * r, sy = -5 + Math.sin(a) * r;
                    i === 0 ? c.moveTo(sx, sy) : c.lineTo(sx, sy);
                }
                c.closePath(); c.fill();
                c.fillStyle = "#fff";
                c.beginPath(); c.ellipse(12, -6, 8, 9, 0, 0, Math.PI * 2); c.fill();
                c.fillStyle = "rgba(50,40,35,0.9)";
                c.beginPath(); c.arc(14, -4, 4.5, 0, Math.PI * 2); c.fill();
                c.fillStyle = "#fff";
                c.beginPath();
                for (let i = 0; i < 4; i++) {
                    const a = (Math.PI * 2 * i) / 4 - Math.PI / 4;
                    const r = i % 2 === 0 ? 2.6 : 1;
                    const sx = 13 + Math.cos(a) * r, sy = -5 + Math.sin(a) * r;
                    i === 0 ? c.moveTo(sx, sy) : c.lineTo(sx, sy);
                }
                c.closePath(); c.fill();
                c.fillStyle = "rgba(200,150,130,0.6)";
                c.beginPath(); c.ellipse(4, 4, 3, 2.2, 0, 0, Math.PI * 2); c.fill();
                c.fillStyle = "rgba(180,90,90,0.45)";
                c.beginPath(); c.ellipse(6, 12, 5, 3.5, 0, 0, Math.PI * 2); c.fill();
            } else if (ft === 3) {
                c.strokeStyle = "rgba(50,40,35,0.85)"; c.lineWidth = 2.5; c.lineCap = "round";
                c.beginPath(); c.arc(-6, -4, 5, -Math.PI * 0.8, -Math.PI * 0.2); c.stroke();
                c.beginPath(); c.arc(14, -4, 4.5, -Math.PI * 0.8, -Math.PI * 0.2); c.stroke();
                c.lineCap = "butt";
                c.fillStyle = "rgba(200,150,130,0.6)";
                c.beginPath(); c.ellipse(4, 4, 3, 2.2, 0, 0, Math.PI * 2); c.fill();
                c.strokeStyle = "rgba(160,100,80,0.5)"; c.lineWidth = 1.5;
                c.beginPath(); c.arc(4, 8, 8, 0.1, Math.PI - 0.1); c.stroke();
            } else {
                c.fillStyle = "#fff";
                c.beginPath(); c.ellipse(-8, -6, 10, 11, 0, 0, Math.PI * 2); c.fill();
                c.fillStyle = "rgba(70,50,30,0.85)";
                c.beginPath(); c.arc(-6, -6, 5.5, 0, Math.PI * 2); c.fill();
                c.fillStyle = "#1a1a22";
                c.beginPath(); c.arc(-5, -6, 3.5, 0, Math.PI * 2); c.fill();
                c.fillStyle = "#fff";
                c.beginPath(); c.arc(-7, -8, 2.2, 0, Math.PI * 2); c.fill();
                c.beginPath(); c.arc(-4, -4, 1, 0, Math.PI * 2); c.fill();
                c.fillStyle = "#fff";
                c.beginPath(); c.ellipse(12, -6, 9, 10, 0, 0, Math.PI * 2); c.fill();
                c.fillStyle = "rgba(70,50,30,0.85)";
                c.beginPath(); c.arc(14, -6, 5, 0, Math.PI * 2); c.fill();
                c.fillStyle = "#1a1a22";
                c.beginPath(); c.arc(15, -6, 3.2, 0, Math.PI * 2); c.fill();
                c.fillStyle = "#fff";
                c.beginPath(); c.arc(13, -8, 2, 0, Math.PI * 2); c.fill();
                c.beginPath(); c.arc(16, -4, 0.9, 0, Math.PI * 2); c.fill();
                c.fillStyle = "rgba(200,150,130,0.6)";
                c.beginPath(); c.ellipse(4, 4, 3, 2.2, 0, 0, Math.PI * 2); c.fill();
                c.fillStyle = "rgba(180,100,90,0.4)";
                c.beginPath(); c.arc(6, 12, 3.5, 0, Math.PI * 2); c.fill();
            }

            // Pacifier (only if requested)
            if (drawPacifier && pacifierColor) {
                c.fillStyle = pacifierColor;
                c.beginPath();
                c.moveTo(10, 8);
                c.quadraticCurveTo(6, 18, 14, 20);
                c.quadraticCurveTo(22, 20, 22, 13);
                c.quadraticCurveTo(22, 6, 14, 6);
                c.closePath();
                c.fill();
                c.fillStyle = "rgba(255,255,255,0.25)";
                c.beginPath();
                c.ellipse(15, 11, 4, 2.5, 0, 0, Math.PI * 2);
                c.fill();
                c.strokeStyle = "rgba(255, 255, 255, 0.6)";
                c.lineWidth = 2;
                c.beginPath();
                c.arc(14, 22, 4, 0, Math.PI * 2);
                c.stroke();
            }
        }

        // 3. The Toddler Rig (Upright wobbling walk)
        class Toddler {
            constructor(colors) {
                this.x = width / 2;
                this.y = height * ROOM_WALL_RATIO;
                this.scale = 1.0;
                this.colors = colors;
                this.direction = 1;
                this.walkCycle = 0;
                this.bodyColor = colors.body;
                this.limbColor = colors.limb;
                this.headColor = colors.head;
                this.skinColor = colors.skin;
                this.cheekColor = colors.cheek || "hsl(350, 62%, 78%)";
                this.hairColor = colors.hair || "hsl(28, 42%, 55%)";
                this.faceType = babyFaceType;
            }
            update(tx) {
                const dx = tx - this.x;
                if (Math.abs(dx) > 10) {
                    this.direction = dx > 0 ? 1 : -1;
                    const speed = Math.min(Math.abs(dx) * 0.035, 2.2);
                    this.x += speed * this.direction;
                    this.walkCycle += 0.12;
                } else {
                    this.walkCycle += 0.04;
                }
                this.x = Math.max(80, Math.min(worldWidth - 80, this.x));
            }
            drawPart(ctx, x, y, ang, fn) {
                ctx.save(); ctx.translate(x, y); ctx.rotate(ang); fn(ctx); ctx.restore();
            }
            draw(ctx) {
                ctx.save();
                ctx.translate(this.x, this.y);

                const t = this.walkCycle;
                const bodySway = Math.sin(t) * 0.07; // lateral wobble
                const forwardLean = Math.sin(t * 0.5) * 0.10; // forward-backward よちよち
                const verticalBob = Math.abs(Math.sin(t)) * 4;

                ctx.scale(this.direction * this.scale, this.scale);
                ctx.rotate(bodySway + forwardLean);
                ctx.translate(0, -verticalBob);

                // Short stubby leg swing
                const legSwingL = Math.sin(t) * 0.30;
                const legSwingR = Math.sin(t + Math.PI) * 0.30;
                const kneeCounterL = -legSwingL * 0.35;
                const kneeCounterR = -legSwingR * 0.35;

                // Short arms out for balance, slight counter-swing
                const armAngleL = -0.75 + Math.sin(t + Math.PI) * 0.18;
                const armAngleR = 0.75 + Math.sin(t) * 0.18;
                const armLowerL = 0.15;
                const armLowerR = -0.15;

                const headBob = Math.sin(t * 2) * 0.04;

                // Short stubby arms (shorter segments)
                const drawArm = (x, y, upperAng, lowerAng) => {
                    this.drawPart(ctx, x, y, upperAng, c => {
                        c.fillStyle = this.limbColor;
                        c.beginPath(); c.roundRect(-6, 0, 12, 13, 6); c.fill();
                        this.drawPart(c, 0, 13, lowerAng, c2 => {
                            c2.fillStyle = this.skinColor;
                            c2.beginPath(); c2.roundRect(-5, 0, 10, 11, 5); c2.fill();
                            // Chubby hand
                            c2.fillStyle = this.skinColor;
                            c2.beginPath(); c2.ellipse(0, 13, 7, 5, 0, 0, Math.PI * 2); c2.fill();
                        });
                    });
                };

                // Short stubby legs (shorter segments, chubbier)
                const drawLeg = (x, y, upperAng, lowerAng) => {
                    this.drawPart(ctx, x, y, upperAng, c => {
                        c.fillStyle = this.limbColor;
                        c.beginPath(); c.roundRect(-8, 0, 16, 14, 8); c.fill();
                        this.drawPart(c, 0, 14, lowerAng, c2 => {
                            c2.fillStyle = this.skinColor;
                            c2.beginPath(); c2.roundRect(-7, 0, 14, 12, 7); c2.fill();
                            // Chubby foot
                            c2.fillStyle = this.skinColor;
                            c2.beginPath(); c2.ellipse(3, 12, 10, 6, 0, 0, Math.PI * 2); c2.fill();
                        });
                    });
                };

                // Back leg
                drawLeg(-10, -6, legSwingL, kneeCounterL);
                // Back arm
                drawArm(-18, -50, armAngleL, armLowerL);

                // Body (round, ずんぐりむっくり — wider & shorter)
                ctx.fillStyle = this.bodyColor;
                ctx.beginPath(); ctx.ellipse(0, -26, 26, 24, 0, 0, Math.PI * 2); ctx.fill();
                // Belly detail
                ctx.fillStyle = "rgba(255,255,255,0.1)";
                ctx.beginPath(); ctx.ellipse(0, -24, 16, 14, 0, 0, Math.PI * 2); ctx.fill();
                // Snap buttons
                ctx.fillStyle = "rgba(255,255,255,0.3)";
                ctx.beginPath(); ctx.arc(-4, -16, 1.5, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(4, -18, 1.5, 0, Math.PI * 2); ctx.fill();

                // Front leg
                drawLeg(10, -6, legSwingR, kneeCounterR);
                // Front arm
                drawArm(18, -50, armAngleR, armLowerR);

                // Head (drawn last = frontmost, big relative to body)
                this.drawPart(ctx, 0, -64, headBob, c => {
                    // Head circle (big round head on stubby body)
                    c.fillStyle = this.skinColor;
                    c.beginPath(); c.arc(0, 0, 28, 0, Math.PI * 2); c.fill();

                    // Ears
                    c.fillStyle = this.skinColor;
                    c.beginPath(); c.arc(-24, 4, 7, 0, Math.PI * 2); c.fill();
                    c.beginPath(); c.arc(24, 4, 7, 0, Math.PI * 2); c.fill();
                    c.fillStyle = this.cheekColor;
                    c.beginPath(); c.arc(-24, 4, 4, 0, Math.PI * 2); c.fill();
                    c.beginPath(); c.arc(24, 4, 4, 0, Math.PI * 2); c.fill();

                    // Hair wisps (4 strands, more than baby's 3)
                    c.strokeStyle = this.hairColor;
                    c.lineWidth = 2.5; c.lineCap = "round";
                    c.beginPath(); c.moveTo(-8, -28);
                    c.quadraticCurveTo(-10, -36, -6, -30); c.stroke();
                    c.beginPath(); c.moveTo(-3, -28);
                    c.quadraticCurveTo(0, -38, 4, -30); c.stroke();
                    c.beginPath(); c.moveTo(3, -28);
                    c.quadraticCurveTo(8, -35, 10, -26); c.stroke();
                    c.beginPath(); c.moveTo(8, -26);
                    c.quadraticCurveTo(14, -34, 16, -24); c.stroke();
                    c.lineCap = "butt";

                    // Face (reuse shared helper, no pacifier)
                    drawBabyFace(c, this.faceType, this.skinColor, this.cheekColor, null, false);
                });

                ctx.restore();
            }
        }

        // 4. The Child Rig — T-shirt + shorts, socks, shoes, backpack, proper hair
        class Child {
            constructor(colors) {
                this.x = width / 2;
                this.y = height * ROOM_WALL_RATIO;
                this.scale = 1.05;
                this.colors = colors;
                this.direction = 1;
                this.walkCycle = 0;
                this.bodyColor = colors.body;      // T-shirt
                this.limbColor = colors.limb;      // Shorts & sleeves
                this.skinColor = colors.skin;
                this.cheekColor = colors.cheek || "hsl(350, 62%, 78%)";
                this.hairColor = colors.hair || "hsl(28, 42%, 55%)";
                this.shoeColor = "hsl(25, 15%, 30%)";
                this.soleColor = "hsl(25, 10%, 22%)";
                this.sockColor = "hsl(0, 0%, 93%)";
                this.backpackColor = colors.limb;
                this.faceType = babyFaceType;
                this.isBoy = babyIsBoy;
                this.hairStyle = Math.floor(Math.random() * 3); // 0-2, 男女各3種
            }
            update(tx) {
                const dx = tx - this.x;
                if (Math.abs(dx) > 10) {
                    this.direction = dx > 0 ? 1 : -1;
                    const speed = Math.min(Math.abs(dx) * 0.04, 2.8);
                    this.x += speed * this.direction;
                    this.walkCycle += 0.13;
                } else {
                    this.walkCycle += 0.03;
                }
                this.x = Math.max(80, Math.min(worldWidth - 80, this.x));
            }
            drawPart(ctx, x, y, ang, fn) {
                ctx.save(); ctx.translate(x, y); ctx.rotate(ang); fn(ctx); ctx.restore();
            }
            draw(ctx) {
                ctx.save();
                ctx.translate(this.x, this.y);

                const t = this.walkCycle;
                const verticalBob = Math.abs(Math.sin(t)) * 2.5;

                // direction flipped: character faces the direction they walk
                ctx.scale(-this.direction * this.scale, this.scale);
                ctx.translate(0, -verticalBob);

                // Walk animation
                const legSwingL = Math.sin(t) * 0.26;
                const legSwingR = Math.sin(t + Math.PI) * 0.26;
                const kneeL = Math.max(0, -legSwingL) * 0.4;
                const kneeR = Math.max(0, -legSwingR) * 0.4;
                const armSwingL = Math.sin(t + Math.PI) * 0.22;
                const armSwingR = Math.sin(t) * 0.22;
                const headBob = Math.sin(t * 2) * 0.02;

                // --- Leg helper: shorts → knee-cover → shin → sock → shoe ---
                const drawLeg = (x, y, upperAng, kneeAng) => {
                    this.drawPart(ctx, x, y, upperAng, c => {
                        // Shorts (upper leg) — long enough to cover past knee pivot
                        c.fillStyle = this.limbColor;
                        c.beginPath(); c.roundRect(-7, -3, 14, 25, 5); c.fill();
                        // Shorts hem highlight
                        c.fillStyle = "rgba(0,0,0,0.06)";
                        c.beginPath(); c.roundRect(-7, 17, 14, 4, [0,0,3,3]); c.fill();
                        // Lower leg pivots at y=17
                        this.drawPart(c, 0, 17, kneeAng, c2 => {
                            // Shin (skin) — starts below shorts overlap
                            c2.fillStyle = this.skinColor;
                            c2.beginPath(); c2.roundRect(-5, 2, 10, 16, 4); c2.fill();
                            // Shorts-color cap over knee joint (hides skin/shorts seam)
                            c2.fillStyle = this.limbColor;
                            c2.beginPath(); c2.roundRect(-6.5, -4, 13, 9, 4); c2.fill();
                            // Hem line at knee cap bottom
                            c2.fillStyle = "rgba(0,0,0,0.05)";
                            c2.beginPath(); c2.roundRect(-6, 3, 12, 2, 1); c2.fill();
                            // Sock
                            c2.fillStyle = this.sockColor;
                            c2.beginPath(); c2.roundRect(-5.5, 13, 11, 7, 3); c2.fill();
                            // Sock band
                            c2.fillStyle = "rgba(0,0,0,0.05)";
                            c2.beginPath(); c2.roundRect(-5.5, 13, 11, 2, 1); c2.fill();
                            // Shoe body
                            c2.fillStyle = this.shoeColor;
                            c2.beginPath(); c2.ellipse(2, 20, 10, 5.5, 0, 0, Math.PI * 2); c2.fill();
                            // Shoe top
                            c2.beginPath(); c2.roundRect(-5, 16, 12, 5, [3,3,0,0]); c2.fill();
                            // Sole
                            c2.fillStyle = this.soleColor;
                            c2.beginPath();
                            c2.moveTo(-6, 21); c2.lineTo(12, 21);
                            c2.lineTo(11, 24); c2.lineTo(-5, 24);
                            c2.closePath(); c2.fill();
                            // Shoe detail line
                            c2.strokeStyle = "rgba(255,255,255,0.18)";
                            c2.lineWidth = 0.8;
                            c2.beginPath(); c2.moveTo(-2, 18); c2.lineTo(8, 18); c2.stroke();
                        });
                    });
                };

                // --- Arm helper: short sleeve → skin arm → hand ---
                const drawArm = (x, y, swingAng) => {
                    this.drawPart(ctx, x, y, swingAng, c => {
                        // Short sleeve (T-shirt color)
                        c.fillStyle = this.bodyColor;
                        c.beginPath(); c.roundRect(-5.5, -2, 11, 10, 4); c.fill();
                        // Sleeve hem shadow
                        c.fillStyle = "rgba(0,0,0,0.05)";
                        c.beginPath(); c.roundRect(-5.5, 6, 11, 2, 1); c.fill();
                        // Upper arm (skin)
                        c.fillStyle = this.skinColor;
                        c.beginPath(); c.roundRect(-4.5, 8, 9, 12, 4); c.fill();
                        // Forearm + hand
                        this.drawPart(c, 0, 20, 0.12, c2 => {
                            c2.fillStyle = this.skinColor;
                            c2.beginPath(); c2.roundRect(-3.5, 0, 7, 11, 3.5); c2.fill();
                            // Hand
                            c2.beginPath(); c2.ellipse(0, 12, 4.5, 3.5, 0, 0, Math.PI * 2); c2.fill();
                        });
                    });
                };

                // === Draw order: back-leg → back-arm → backpack → body → front-leg → front-arm → straps → head ===

                // Back leg (pivot at hip joint center)
                drawLeg(-8, -7, legSwingL, kneeL);
                // Back arm
                drawArm(-15, -54, armSwingL);

                // Backpack (behind body)
                ctx.save();
                ctx.fillStyle = this.backpackColor;
                ctx.globalAlpha = 0.82;
                // Main bag
                ctx.beginPath(); ctx.roundRect(-22, -52, 16, 26, 5); ctx.fill();
                // Flap
                ctx.fillStyle = "rgba(0,0,0,0.07)";
                ctx.beginPath(); ctx.roundRect(-22, -52, 16, 9, [5,5,0,0]); ctx.fill();
                // Flap buckle
                ctx.fillStyle = "rgba(255,255,255,0.25)";
                ctx.beginPath(); ctx.roundRect(-16, -44, 4, 3, 1); ctx.fill();
                // Side pocket
                ctx.fillStyle = "rgba(0,0,0,0.04)";
                ctx.beginPath(); ctx.roundRect(-8, -40, 3, 12, 1); ctx.fill();
                ctx.globalAlpha = 1;
                ctx.restore();

                // Body — T-shirt
                ctx.fillStyle = this.bodyColor;
                ctx.beginPath(); ctx.roundRect(-17, -58, 34, 32, 8); ctx.fill();
                // Collar (V-neck)
                ctx.fillStyle = this.skinColor;
                ctx.beginPath();
                ctx.moveTo(-7, -58);
                ctx.quadraticCurveTo(0, -51, 7, -58);
                ctx.fill();
                // T-shirt highlight
                ctx.fillStyle = "rgba(255,255,255,0.08)";
                ctx.beginPath(); ctx.ellipse(2, -44, 10, 12, 0, 0, Math.PI * 2); ctx.fill();
                // Pocket (small square on chest)
                ctx.strokeStyle = "rgba(0,0,0,0.06)";
                ctx.lineWidth = 0.8;
                ctx.beginPath(); ctx.roundRect(4, -50, 8, 8, 2); ctx.stroke();

                // Shorts (waistband + shorts body)
                ctx.fillStyle = this.limbColor;
                ctx.beginPath(); ctx.roundRect(-16, -28, 32, 24, [0,0,6,6]); ctx.fill();
                // Waistband
                ctx.fillStyle = "rgba(0,0,0,0.08)";
                ctx.beginPath(); ctx.roundRect(-16, -28, 32, 3, 1); ctx.fill();
                // Center seam
                ctx.strokeStyle = "rgba(0,0,0,0.04)";
                ctx.lineWidth = 0.8;
                ctx.beginPath(); ctx.moveTo(0, -25); ctx.lineTo(0, -6); ctx.stroke();
                // Hip joints — shorts-color to hide leg pivot seam
                ctx.fillStyle = this.limbColor;
                ctx.beginPath(); ctx.ellipse(-8, -7, 10, 9, 0, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(8, -7, 10, 9, 0, 0, Math.PI * 2); ctx.fill();
                // Subtle shadow at hip
                ctx.fillStyle = "rgba(0,0,0,0.04)";
                ctx.beginPath(); ctx.ellipse(-8, -5, 7, 4, 0, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(8, -5, 7, 4, 0, 0, Math.PI * 2); ctx.fill();

                // Front leg (pivot at hip joint center)
                drawLeg(8, -7, legSwingR, kneeR);
                // Front arm
                drawArm(15, -54, armSwingR);

                // Backpack straps (visible from front, over shoulders)
                ctx.strokeStyle = this.backpackColor;
                ctx.globalAlpha = 0.55;
                ctx.lineWidth = 2.5;
                ctx.lineCap = "round";
                // Left strap
                ctx.beginPath(); ctx.moveTo(-10, -56); ctx.quadraticCurveTo(-12, -48, -10, -42); ctx.stroke();
                // Right strap
                ctx.beginPath(); ctx.moveTo(4, -56); ctx.quadraticCurveTo(6, -48, 4, -42); ctx.stroke();
                ctx.globalAlpha = 1;
                ctx.lineCap = "butt";

                // Head (radius 21, child proportions)
                this.drawPart(ctx, 0, -72, headBob, c => {
                    c.scale(-1, 1); // 顔を進行方向に向ける
                    const HR = 21;
                    c.fillStyle = this.hairColor;

                    // 1. BACK HAIR
                    if (this.isBoy) {
                        if (this.hairStyle === 1) {
                            c.beginPath(); c.arc(0, -1, HR + 5, Math.PI * 0.95, Math.PI * 0.05, false); c.closePath(); c.fill();
                        } else if (this.hairStyle === 2) {
                            c.beginPath(); c.arc(0, -1, HR + 2, Math.PI, 0, false); c.closePath(); c.fill();
                        }
                    } else {
                        if (this.hairStyle === 0) {
                            c.beginPath(); c.arc(0, -1, HR + 4, Math.PI, 0, false); c.closePath(); c.fill();
                            c.beginPath(); c.roundRect(-HR - 5, -6, 9, 22, 4); c.fill();
                            c.beginPath(); c.roundRect(HR - 4, -6, 9, 22, 4); c.fill();
                        } else if (this.hairStyle === 1) {
                            c.beginPath(); c.arc(0, -1, HR + 3, Math.PI, 0, false); c.closePath(); c.fill();
                            c.beginPath(); c.ellipse(-20, -8, 8, 14, -0.2, 0, Math.PI * 2); c.fill();
                            c.beginPath(); c.ellipse(20, -8, 8, 14, 0.2, 0, Math.PI * 2); c.fill();
                        } else {
                            c.beginPath(); c.arc(0, -1, HR + 4, Math.PI, 0, false); c.closePath(); c.fill();
                            c.beginPath(); c.ellipse(-18, -4, 7, 16, 0.25, 0, Math.PI * 2); c.fill();
                        }
                    }

                    // 2. FACE BASE
                    c.fillStyle = this.skinColor;
                    c.beginPath(); c.arc(0, 0, HR, 0, Math.PI * 2); c.fill();

                    // 3. FRONT HAIR
                    c.fillStyle = this.hairColor;
                    if (this.isBoy) {
                        if (this.hairStyle === 1) {
                            c.beginPath();
                            c.moveTo(-19, -21); c.lineTo(-19, -10);
                            c.quadraticCurveTo(-10, -13, 0, -10);
                            c.quadraticCurveTo(10, -13, 19, -10);
                            c.lineTo(19, -21); c.closePath(); c.fill();
                        } else if (this.hairStyle === 2) {
                            c.globalAlpha = 0.45;
                            c.beginPath(); c.moveTo(-16, -21); c.lineTo(-16, -17); c.lineTo(16, -17); c.lineTo(16, -21); c.closePath(); c.fill();
                            c.globalAlpha = 1;
                        }
                    } else {
                        if (this.hairStyle === 0) {
                            c.beginPath(); c.moveTo(-18, -21); c.lineTo(-18, -11); c.lineTo(18, -11); c.lineTo(18, -21); c.closePath(); c.fill();
                        } else if (this.hairStyle === 1) {
                            c.beginPath(); c.moveTo(-17, -21); c.lineTo(-17, -11); c.lineTo(17, -11); c.lineTo(17, -21); c.closePath(); c.fill();
                            c.fillStyle = "hsl(345, 65%, 65%)";
                            [[-20, -14], [20, -14]].forEach(([rx, ry]) => {
                                c.beginPath(); c.ellipse(rx - 4, ry, 4, 2.5, -0.3, 0, Math.PI * 2); c.fill();
                                c.beginPath(); c.ellipse(rx + 4, ry, 4, 2.5, 0.3, 0, Math.PI * 2); c.fill();
                                c.beginPath(); c.arc(rx, ry, 1.5, 0, Math.PI * 2); c.fill();
                            });
                        } else {
                            c.beginPath(); c.moveTo(-15, -21); c.lineTo(-15, -12);
                            c.quadraticCurveTo(0, -10, 17, -13); c.lineTo(17, -21); c.closePath(); c.fill();
                        }
                    }

                    // 4. FEATURES
                    drawBabyFace(c, this.faceType, this.skinColor, this.cheekColor, null, false);
                });

                ctx.restore();
            }
        }

        function updateCamera() {
            if (!baby) return;
            const leftTrigger = width * 0.3;
            const rightTrigger = width * 0.7;
            const babyScreenX = baby.x - cameraX;

            if (babyScreenX > rightTrigger) cameraX = baby.x - rightTrigger;
            if (babyScreenX < leftTrigger) cameraX = baby.x - leftTrigger;

            const maxCamera = Math.max(0, worldWidth - width);
            cameraX = Math.max(0, Math.min(cameraX, maxCamera));
        }

        function drawCrawlBackground() {
            const wallHeight = height * ROOM_WALL_RATIO;

            // Wall - warm gradient
            const wallG = ctx.createLinearGradient(0, 0, 0, wallHeight);
            wallG.addColorStop(0, "#f8f6f2");
            wallG.addColorStop(1, "#f0ece4");
            ctx.fillStyle = wallG;
            ctx.fillRect(0, 0, worldWidth, wallHeight);

            // Wainscoting (lower wall panel)
            const wainscotH = wallHeight * 0.32;
            const wainscotY = wallHeight - wainscotH;
            ctx.fillStyle = "rgba(230, 222, 210, 0.5)";
            ctx.fillRect(0, wainscotY, worldWidth, wainscotH);
            // Wainscot top rail
            ctx.fillStyle = "rgba(200, 190, 175, 0.45)";
            ctx.fillRect(0, wainscotY, worldWidth, 4);
            // Wainscot panel rectangles
            ctx.strokeStyle = "rgba(195, 185, 170, 0.3)";
            ctx.lineWidth = 1.5;
            for (let x = 30; x < worldWidth; x += 160) {
                ctx.beginPath();
                ctx.roundRect(x, wainscotY + 12, 120, wainscotH - 24, 3);
                ctx.stroke();
            }

            // Crown molding (top of wall)
            ctx.fillStyle = "rgba(220, 215, 205, 0.5)";
            ctx.fillRect(0, 0, worldWidth, 6);
            ctx.fillStyle = "rgba(200, 195, 185, 0.35)";
            ctx.fillRect(0, 6, worldWidth, 3);

            // Baseboard
            ctx.fillStyle = "rgba(190, 180, 165, 0.55)";
            ctx.fillRect(0, wallHeight - 10, worldWidth, 10);
            ctx.fillStyle = "rgba(170, 160, 145, 0.3)";
            ctx.fillRect(0, wallHeight - 12, worldWidth, 3);

            // Ceiling lamps (pendant style)
            for (let x = 300; x < worldWidth; x += 650) {
                // Cord
                ctx.strokeStyle = "rgba(80, 75, 70, 0.4)";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(x, 0); ctx.lineTo(x, 45);
                ctx.stroke();
                // Canopy (ceiling mount)
                ctx.fillStyle = "rgba(100, 95, 85, 0.5)";
                ctx.beginPath(); ctx.ellipse(x, 4, 10, 3, 0, 0, Math.PI * 2); ctx.fill();
                // Shade (dome shape)
                const shadeG = ctx.createLinearGradient(x - 32, 45, x + 32, 45);
                shadeG.addColorStop(0, "rgba(240, 230, 210, 0.9)");
                shadeG.addColorStop(0.5, "rgba(250, 245, 230, 0.95)");
                shadeG.addColorStop(1, "rgba(235, 225, 205, 0.9)");
                ctx.fillStyle = shadeG;
                ctx.beginPath();
                ctx.moveTo(x - 30, 65);
                ctx.quadraticCurveTo(x - 32, 45, x, 42);
                ctx.quadraticCurveTo(x + 32, 45, x + 30, 65);
                ctx.closePath(); ctx.fill();
                // Shade rim
                ctx.strokeStyle = "rgba(180, 170, 150, 0.5)";
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.ellipse(x, 65, 30, 5, 0, 0, Math.PI * 2); ctx.stroke();
                // Warm glow
                const glow = ctx.createRadialGradient(x, 80, 5, x, 80, 140);
                glow.addColorStop(0, "rgba(255, 245, 200, 0.28)");
                glow.addColorStop(1, "rgba(255, 245, 200, 0)");
                ctx.fillStyle = glow;
                ctx.beginPath(); ctx.arc(x, 80, 140, 0, Math.PI * 2); ctx.fill();
            }

            // Windows with curtains and light
            for (let x = 150; x < worldWidth; x += 580) {
                const w = 150, h = wallHeight * 0.5;
                const wy = wallHeight * 0.12;

                // Window light glow
                const wGlow = ctx.createRadialGradient(x + w / 2, wy + h / 2, 10, x + w / 2, wy + h / 2, h);
                wGlow.addColorStop(0, "rgba(255, 252, 240, 0.15)");
                wGlow.addColorStop(1, "rgba(255, 252, 240, 0)");
                ctx.fillStyle = wGlow;
                ctx.beginPath(); ctx.arc(x + w / 2, wy + h / 2, h, 0, Math.PI * 2); ctx.fill();

                // Window sky
                const skyG = ctx.createLinearGradient(x, wy, x, wy + h);
                skyG.addColorStop(0, "#d4e8f8");
                skyG.addColorStop(0.6, "#e8f2fc");
                skyG.addColorStop(1, "#f0f6fa");
                ctx.fillStyle = skyG;
                ctx.beginPath(); ctx.roundRect(x, wy, w, h, 2); ctx.fill();

                // Window frame
                ctx.strokeStyle = "rgba(160, 150, 135, 0.6)";
                ctx.lineWidth = 6;
                ctx.beginPath(); ctx.roundRect(x, wy, w, h, 2); ctx.stroke();
                // Cross bars
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(x + w / 2, wy); ctx.lineTo(x + w / 2, wy + h);
                ctx.moveTo(x, wy + h / 2); ctx.lineTo(x + w, wy + h / 2);
                ctx.stroke();
                // Window sill
                ctx.fillStyle = "rgba(200, 195, 185, 0.7)";
                ctx.beginPath(); ctx.roundRect(x - 8, wy + h - 2, w + 16, 8, 2); ctx.fill();

                // Curtains (soft draping)
                const curtainColor = "rgba(200, 180, 155, 0.55)";
                // Left curtain
                ctx.fillStyle = curtainColor;
                ctx.beginPath();
                ctx.moveTo(x - 14, wy - 6);
                ctx.quadraticCurveTo(x - 40, wy + h * 0.35, x - 18, wy + h + 4);
                ctx.lineTo(x + 6, wy + h + 4);
                ctx.quadraticCurveTo(x - 18, wy + h * 0.38, x + 10, wy - 6);
                ctx.closePath(); ctx.fill();
                // Left curtain fold highlight
                ctx.strokeStyle = "rgba(220, 210, 190, 0.4)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x - 6, wy); ctx.quadraticCurveTo(x - 20, wy + h * 0.4, x - 8, wy + h);
                ctx.stroke();
                // Right curtain
                ctx.fillStyle = curtainColor;
                ctx.beginPath();
                ctx.moveTo(x + w + 14, wy - 6);
                ctx.quadraticCurveTo(x + w + 40, wy + h * 0.35, x + w + 18, wy + h + 4);
                ctx.lineTo(x + w - 6, wy + h + 4);
                ctx.quadraticCurveTo(x + w + 18, wy + h * 0.38, x + w - 10, wy - 6);
                ctx.closePath(); ctx.fill();
                ctx.strokeStyle = "rgba(220, 210, 190, 0.4)";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x + w + 6, wy); ctx.quadraticCurveTo(x + w + 20, wy + h * 0.4, x + w + 8, wy + h);
                ctx.stroke();
                // Curtain rod
                ctx.strokeStyle = "rgba(150, 140, 125, 0.55)";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(x - 24, wy - 8); ctx.lineTo(x + w + 24, wy - 8);
                ctx.stroke();
                // Rod finials
                ctx.fillStyle = "rgba(140, 130, 115, 0.6)";
                ctx.beginPath(); ctx.arc(x - 24, wy - 8, 4, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(x + w + 24, wy - 8, 4, 0, Math.PI * 2); ctx.fill();
            }

            // Picture frames on wall (between windows)
            for (let x = 480; x < worldWidth; x += 580) {
                const fw = 60, fh = 48;
                const fy = wallHeight * 0.18;
                // Frame
                ctx.strokeStyle = "rgba(170, 155, 130, 0.5)";
                ctx.lineWidth = 4;
                ctx.beginPath(); ctx.roundRect(x, fy, fw, fh, 2); ctx.stroke();
                // Inner mat
                ctx.fillStyle = "rgba(245, 242, 235, 0.7)";
                ctx.beginPath(); ctx.roundRect(x + 5, fy + 5, fw - 10, fh - 10, 1); ctx.fill();
                // Abstract art (colored shapes)
                ctx.fillStyle = "rgba(180, 140, 120, 0.3)";
                ctx.beginPath(); ctx.arc(x + fw / 2 - 6, fy + fh / 2, 10, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = "rgba(120, 160, 140, 0.3)";
                ctx.beginPath(); ctx.arc(x + fw / 2 + 8, fy + fh / 2 + 4, 8, 0, Math.PI * 2); ctx.fill();
            }

            // Small shelf between windows
            for (let x = 440; x < worldWidth; x += 580) {
                const sy = wallHeight * 0.48;
                // Shelf bracket
                ctx.fillStyle = "rgba(180, 170, 155, 0.45)";
                ctx.beginPath();
                ctx.moveTo(x, sy + 4); ctx.lineTo(x, sy + 16); ctx.lineTo(x + 8, sy + 4);
                ctx.closePath(); ctx.fill();
                ctx.beginPath();
                ctx.moveTo(x + 72, sy + 4); ctx.lineTo(x + 72, sy + 16); ctx.lineTo(x + 64, sy + 4);
                ctx.closePath(); ctx.fill();
                // Shelf surface
                ctx.fillStyle = "rgba(195, 185, 170, 0.55)";
                ctx.beginPath(); ctx.roundRect(x - 4, sy, 80, 5, 1); ctx.fill();
                // Small book on shelf
                ctx.fillStyle = "rgba(180, 120, 100, 0.5)";
                ctx.beginPath(); ctx.roundRect(x + 8, sy - 18, 8, 18, 1); ctx.fill();
                ctx.fillStyle = "rgba(100, 140, 170, 0.5)";
                ctx.beginPath(); ctx.roundRect(x + 18, sy - 22, 7, 22, 1); ctx.fill();
                ctx.fillStyle = "rgba(160, 150, 100, 0.5)";
                ctx.beginPath(); ctx.roundRect(x + 27, sy - 16, 9, 16, 1); ctx.fill();
                // Small plant on shelf
                ctx.fillStyle = "rgba(180, 120, 80, 0.5)";
                ctx.beginPath();
                ctx.moveTo(x + 52, sy); ctx.lineTo(x + 48, sy - 10); ctx.lineTo(x + 60, sy - 10); ctx.lineTo(x + 56, sy);
                ctx.closePath(); ctx.fill();
                ctx.fillStyle = "rgba(100, 160, 80, 0.5)";
                ctx.beginPath(); ctx.arc(x + 54, sy - 16, 6, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(x + 50, sy - 14, 4, 0, Math.PI * 2); ctx.fill();
            }

            // Floor - wood plank pattern
            ctx.fillStyle = floorColor;
            ctx.fillRect(0, wallHeight, worldWidth, height - wallHeight);
            // Wood planks
            const plankW = 90;
            const floorH = height - wallHeight;
            ctx.strokeStyle = "rgba(80, 60, 40, 0.08)";
            ctx.lineWidth = 1;
            for (let x = 0; x < worldWidth; x += plankW) {
                ctx.beginPath();
                ctx.moveTo(x, wallHeight);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            // Horizontal plank seams (staggered)
            for (let y = wallHeight; y < height; y += 28) {
                const offset = ((y - wallHeight) / 28) % 2 === 0 ? 0 : plankW / 2;
                ctx.beginPath();
                ctx.moveTo(offset, y);
                ctx.lineTo(worldWidth, y);
                ctx.stroke();
            }
            // Floor light reflection
            const floorGlow = ctx.createLinearGradient(0, wallHeight, 0, wallHeight + 30);
            floorGlow.addColorStop(0, "rgba(255, 255, 255, 0.06)");
            floorGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.fillStyle = floorGlow;
            ctx.fillRect(0, wallHeight, worldWidth, 30);
        }

        // Child outdoor background
        let childBgClouds = null;
        let childBgTrees = null;
        function ensureChildBgObjects() {
            if (!childBgClouds) {
                childBgClouds = [];
                for (let i = 0; i < 6; i++) {
                    childBgClouds.push({
                        x: randInt(50, worldWidth - 50),
                        y: randInt(20, 80),
                        w: randInt(80, 160),
                        h: randInt(30, 50),
                        speed: 0.08 + Math.random() * 0.12
                    });
                }
            }
            if (!childBgTrees) {
                childBgTrees = [];
                for (let i = 0; i < 5; i++) {
                    childBgTrees.push({
                        x: randInt(100, worldWidth - 100),
                        trunkH: randInt(40, 65),
                        crownR: randInt(22, 36),
                        hue: randInt(90, 140)
                    });
                }
            }
        }

        function drawChildBackground() {
            ensureChildBgObjects();
            const wallHeight = height * ROOM_WALL_RATIO;
            const groundY = wallHeight;

            // Sky gradient
            const skyG = ctx.createLinearGradient(0, 0, 0, groundY);
            skyG.addColorStop(0, "#87ceeb");
            skyG.addColorStop(0.6, "#b8e0f0");
            skyG.addColorStop(1, "#dceef8");
            ctx.fillStyle = skyG;
            ctx.fillRect(0, 0, worldWidth, groundY);

            // Clouds
            childBgClouds.forEach(cl => {
                cl.x += cl.speed;
                if (cl.x > worldWidth + 200) cl.x = -200;
                ctx.fillStyle = "rgba(255,255,255,0.82)";
                ctx.beginPath();
                ctx.ellipse(cl.x, cl.y, cl.w * 0.5, cl.h * 0.5, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(cl.x - cl.w * 0.25, cl.y + 5, cl.w * 0.3, cl.h * 0.35, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.ellipse(cl.x + cl.w * 0.28, cl.y + 3, cl.w * 0.35, cl.h * 0.4, 0, 0, Math.PI * 2);
                ctx.fill();
            });

            // Grass ground
            const grassG = ctx.createLinearGradient(0, groundY, 0, height);
            grassG.addColorStop(0, "#7ec850");
            grassG.addColorStop(0.3, "#6ab840");
            grassG.addColorStop(1, "#4a9030");
            ctx.fillStyle = grassG;
            ctx.fillRect(0, groundY, worldWidth, height - groundY);

            // Path (dirt)
            const pathY = groundY + 30;
            ctx.fillStyle = "rgba(180, 155, 120, 0.45)";
            ctx.beginPath();
            ctx.moveTo(worldWidth * 0.3, pathY);
            ctx.quadraticCurveTo(worldWidth * 0.5, pathY + 15, worldWidth * 0.7, pathY);
            ctx.lineTo(worldWidth * 0.7, pathY + 18);
            ctx.quadraticCurveTo(worldWidth * 0.5, pathY + 33, worldWidth * 0.3, pathY + 18);
            ctx.closePath();
            ctx.fill();

            // Trees (behind buildings)
            childBgTrees.forEach(tr => {
                // Trunk
                ctx.fillStyle = "hsl(28, 35%, 38%)";
                ctx.beginPath();
                ctx.roundRect(tr.x - 6, groundY - tr.trunkH, 12, tr.trunkH, 3);
                ctx.fill();
                // Crown
                ctx.fillStyle = `hsl(${tr.hue}, 55%, 42%)`;
                ctx.beginPath();
                ctx.arc(tr.x, groundY - tr.trunkH - tr.crownR * 0.5, tr.crownR, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = `hsl(${tr.hue}, 50%, 48%)`;
                ctx.beginPath();
                ctx.arc(tr.x - tr.crownR * 0.3, groundY - tr.trunkH - tr.crownR * 0.3, tr.crownR * 0.7, 0, Math.PI * 2);
                ctx.fill();
            });

            // Fence
            ctx.strokeStyle = "rgba(160, 140, 100, 0.5)";
            ctx.lineWidth = 2;
            const fenceY = groundY - 5;
            ctx.beginPath();
            ctx.moveTo(0, fenceY); ctx.lineTo(worldWidth, fenceY);
            ctx.moveTo(0, fenceY + 16); ctx.lineTo(worldWidth, fenceY + 16);
            ctx.stroke();
            for (let x = 30; x < worldWidth; x += 60) {
                ctx.fillStyle = "rgba(160, 140, 100, 0.5)";
                ctx.beginPath(); ctx.roundRect(x - 3, fenceY - 8, 6, 30, 2); ctx.fill();
            }

            // === Draw 4 facility buildings — each with unique size & spacing ===
            const facCount = Math.min(childFacilities.length, childFacilityLayouts.length) || 4;

            for (let fi = 0; fi < facCount; fi++) {
                const fac = childFacilities[fi] || CHILD_FACILITIES[fi];
                const layout = childFacilityLayouts[fi];
                if (!layout) continue;
                const cx = layout.cx;
                const bW = layout.bW;
                const bH = layout.bH;
                const bX = cx - bW / 2;
                const bY = groundY - bH;
                const rc = fac.roofColor;
                const bc = fac.buildingColor;

                ctx.save();
                if (fac.id === "kindergarten") {
                    // Colorful kindergarten — arched entrance, rainbow trim, playground slide
                    ctx.fillStyle = bc; ctx.beginPath(); ctx.roundRect(bX, bY, bW, bH, 6); ctx.fill();
                    ctx.fillStyle = rc; ctx.beginPath();
                    ctx.moveTo(bX - 12, bY); ctx.lineTo(cx, bY - bH * 0.32); ctx.lineTo(bX + bW + 12, bY);
                    ctx.closePath(); ctx.fill();
                    // Rainbow trim under roof
                    ["#e85050","#e8a030","#e8e040","#50c860","#5080e8","#9050c8"].forEach((col, ri) => {
                        ctx.fillStyle = col; ctx.fillRect(bX, bY + ri * 2, bW, 2);
                    });
                    // Arched entrance
                    ctx.fillStyle = fac.color;
                    ctx.beginPath(); ctx.arc(cx, groundY, 18, Math.PI, 0, false); ctx.rect(cx - 18, groundY - 18, 36, 18); ctx.fill();
                    // Windows (round)
                    [[-bW * 0.28, bH * 0.35], [bW * 0.28, bH * 0.35]].forEach(([ox, oy]) => {
                        ctx.fillStyle = "#a8d8f0"; ctx.beginPath(); ctx.arc(cx + ox, bY + oy, 12, 0, Math.PI * 2); ctx.fill();
                        ctx.strokeStyle = "#c8b890"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx + ox, bY + oy, 12, 0, Math.PI * 2); ctx.stroke();
                    });
                    // Slide on the side
                    ctx.strokeStyle = "#e85050"; ctx.lineWidth = 3; ctx.lineCap = "round";
                    ctx.beginPath(); ctx.moveTo(bX + bW + 8, bY + bH * 0.3);
                    ctx.quadraticCurveTo(bX + bW + 20, groundY - 10, bX + bW + 28, groundY);
                    ctx.stroke(); ctx.lineCap = "butt";

                } else if (fac.id === "home") {
                    // Cozy house — chimney, curtained windows, welcome mat
                    ctx.fillStyle = bc; ctx.beginPath(); ctx.roundRect(bX, bY, bW, bH, 4); ctx.fill();
                    ctx.fillStyle = rc; ctx.beginPath();
                    ctx.moveTo(bX - 8, bY); ctx.lineTo(cx, bY - bH * 0.35); ctx.lineTo(bX + bW + 8, bY);
                    ctx.closePath(); ctx.fill();
                    // Chimney
                    ctx.fillStyle = "#8a6050"; ctx.beginPath(); ctx.roundRect(bX + bW * 0.7, bY - bH * 0.28, 14, bH * 0.28, [3,3,0,0]); ctx.fill();
                    ctx.fillStyle = "#a07060"; ctx.beginPath(); ctx.roundRect(bX + bW * 0.7 - 2, bY - bH * 0.28, 18, 4, 2); ctx.fill();
                    // Windows with curtains
                    [[-bW * 0.25, bH * 0.3], [bW * 0.25, bH * 0.3]].forEach(([ox, oy]) => {
                        const wx = cx + ox - 13, wy = bY + oy - 10;
                        ctx.fillStyle = "#f8e8a0"; ctx.beginPath(); ctx.roundRect(wx, wy, 26, 20, 2); ctx.fill();
                        ctx.fillStyle = "#e8c0a0"; ctx.beginPath(); ctx.roundRect(wx, wy, 6, 20, [2,0,0,2]); ctx.fill();
                        ctx.beginPath(); ctx.roundRect(wx + 20, wy, 6, 20, [0,2,2,0]); ctx.fill();
                        ctx.strokeStyle = "#b8a080"; ctx.lineWidth = 1; ctx.beginPath(); ctx.roundRect(wx, wy, 26, 20, 2); ctx.stroke();
                    });
                    // Door with welcome mat
                    ctx.fillStyle = "#8a5830"; ctx.beginPath(); ctx.roundRect(cx - 12, groundY - 34, 24, 34, [5,5,0,0]); ctx.fill();
                    ctx.fillStyle = "#c8a050"; ctx.beginPath(); ctx.arc(cx + 6, groundY - 16, 2, 0, Math.PI * 2); ctx.fill();
                    ctx.fillStyle = "#a08060"; ctx.beginPath(); ctx.roundRect(cx - 16, groundY - 3, 32, 3, 1); ctx.fill();

                } else if (fac.id === "atelier") {
                    // Art studio — colorful splashes, easel outside, palette on wall
                    ctx.fillStyle = bc; ctx.beginPath(); ctx.roundRect(bX, bY, bW, bH, 5); ctx.fill();
                    ctx.fillStyle = rc; ctx.beginPath();
                    ctx.moveTo(bX - 8, bY); ctx.lineTo(cx, bY - bH * 0.28); ctx.lineTo(bX + bW + 8, bY);
                    ctx.closePath(); ctx.fill();
                    // Color splashes on wall
                    [["#e85050",-20,15],["#50a0e8",18,22],["#e8d040",-8,35],["#50c868",25,12]].forEach(([col,ox,oy]) => {
                        ctx.fillStyle = col; ctx.globalAlpha = 0.4;
                        ctx.beginPath(); ctx.arc(cx + ox, bY + oy, 8 + Math.random() * 4, 0, Math.PI * 2); ctx.fill();
                    });
                    ctx.globalAlpha = 1;
                    // Big window (studio style)
                    ctx.fillStyle = "#d8e8f0"; ctx.beginPath(); ctx.roundRect(cx - bW * 0.3, bY + 16, bW * 0.6, bH * 0.35, 3); ctx.fill();
                    ctx.strokeStyle = "#b090a0"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(cx - bW * 0.3, bY + 16, bW * 0.6, bH * 0.35, 3); ctx.stroke();
                    // Easel outside
                    ctx.strokeStyle = "#8a6848"; ctx.lineWidth = 2;
                    const ex = bX + bW + 12;
                    ctx.beginPath(); ctx.moveTo(ex, groundY); ctx.lineTo(ex + 6, groundY - 35); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(ex + 12, groundY); ctx.lineTo(ex + 6, groundY - 35); ctx.stroke();
                    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.roundRect(ex - 2, groundY - 40, 16, 18, 1); ctx.fill();
                    ctx.fillStyle = "#e890b0"; ctx.beginPath(); ctx.arc(ex + 6, groundY - 33, 4, 0, Math.PI * 2); ctx.fill();
                    // Door
                    ctx.fillStyle = fac.color; ctx.beginPath(); ctx.roundRect(cx - 11, groundY - 30, 22, 30, [4,4,0,0]); ctx.fill();

                } else if (fac.id === "swimming") {
                    // Swimming school — wave pattern, pool lanes visible
                    ctx.fillStyle = bc; ctx.beginPath(); ctx.roundRect(bX, bY, bW, bH, 5); ctx.fill();
                    // Flat wide roof
                    ctx.fillStyle = rc; ctx.beginPath(); ctx.roundRect(bX - 8, bY - 6, bW + 16, 12, 4); ctx.fill();
                    // Wave pattern on wall
                    ctx.strokeStyle = "#70c0e0"; ctx.lineWidth = 2;
                    for (let wi = 0; wi < 3; wi++) {
                        const wy = bY + 18 + wi * 14;
                        ctx.beginPath(); ctx.moveTo(bX + 8, wy);
                        for (let wx = bX + 8; wx < bX + bW - 8; wx += 16) {
                            ctx.quadraticCurveTo(wx + 4, wy - 5, wx + 8, wy);
                            ctx.quadraticCurveTo(wx + 12, wy + 5, wx + 16, wy);
                        }
                        ctx.stroke();
                    }
                    // Pool lanes (visible through big window)
                    ctx.fillStyle = "#88d4f0"; ctx.beginPath(); ctx.roundRect(cx - bW * 0.35, bY + bH * 0.55, bW * 0.7, bH * 0.25, 3); ctx.fill();
                    ctx.strokeStyle = "#fff"; ctx.lineWidth = 1;
                    for (let li = 1; li < 4; li++) {
                        const lx = cx - bW * 0.35 + li * (bW * 0.7 / 4);
                        ctx.beginPath(); ctx.moveTo(lx, bY + bH * 0.55); ctx.lineTo(lx, bY + bH * 0.8); ctx.stroke();
                    }
                    // Door
                    ctx.fillStyle = fac.color; ctx.beginPath(); ctx.roundRect(cx - 11, groundY - 30, 22, 30, [4,4,0,0]); ctx.fill();

                } else if (fac.id === "baseball") {
                    // Baseball field — diamond, backstop fence, dugout
                    ctx.fillStyle = "#c8a870"; ctx.beginPath(); ctx.roundRect(bX, bY + bH * 0.4, bW, bH * 0.6, 3); ctx.fill();
                    // Grass field
                    ctx.fillStyle = "#68b848"; ctx.beginPath(); ctx.arc(cx, bY + bH * 0.4, bW * 0.45, Math.PI, 0, false); ctx.fill();
                    // Diamond
                    ctx.fillStyle = "#e8d0a0";
                    ctx.beginPath(); ctx.moveTo(cx, bY + bH * 0.15); ctx.lineTo(cx + 22, bY + bH * 0.38);
                    ctx.lineTo(cx, bY + bH * 0.55); ctx.lineTo(cx - 22, bY + bH * 0.38); ctx.closePath(); ctx.fill();
                    // Bases
                    ctx.fillStyle = "#fff";
                    [[0, bH*0.15],[22, bH*0.38],[0, bH*0.55],[-22, bH*0.38]].forEach(([ox,oy]) => {
                        ctx.beginPath(); ctx.roundRect(cx + ox - 3, bY + oy - 3, 6, 6, 1); ctx.fill();
                    });
                    // Backstop fence
                    ctx.strokeStyle = "rgba(100,100,100,0.5)"; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.moveTo(cx - 30, bY + bH * 0.1); ctx.lineTo(cx, bY - 5);
                    ctx.lineTo(cx + 30, bY + bH * 0.1); ctx.stroke();
                    // Dugout
                    ctx.fillStyle = bc; ctx.beginPath(); ctx.roundRect(bX, groundY - 22, bW * 0.25, 22, [3,3,0,0]); ctx.fill();
                    ctx.fillStyle = rc; ctx.beginPath(); ctx.roundRect(bX - 3, groundY - 25, bW * 0.25 + 6, 5, 2); ctx.fill();

                } else if (fac.id === "english") {
                    // English classroom — "ABC" on building, speech bubbles, globe
                    ctx.fillStyle = bc; ctx.beginPath(); ctx.roundRect(bX, bY, bW, bH, 5); ctx.fill();
                    ctx.fillStyle = rc; ctx.beginPath();
                    ctx.moveTo(bX - 8, bY); ctx.lineTo(cx, bY - bH * 0.28); ctx.lineTo(bX + bW + 8, bY);
                    ctx.closePath(); ctx.fill();
                    // "ABC" letters on facade
                    ctx.fillStyle = "#fff"; ctx.font = "700 22px 'Zen Maru Gothic', sans-serif";
                    ctx.textAlign = "center"; ctx.textBaseline = "middle";
                    ctx.fillText("ABC", cx, bY + bH * 0.3);
                    // Speech bubbles
                    ctx.fillStyle = "rgba(255,255,255,0.7)";
                    ctx.beginPath(); ctx.roundRect(bX + bW + 4, bY + 10, 28, 16, 6); ctx.fill();
                    ctx.fillStyle = "#7858a0"; ctx.font = "600 9px sans-serif";
                    ctx.fillText("Hi!", bX + bW + 18, bY + 18);
                    // Windows
                    [[- bW * 0.25, bH * 0.55], [bW * 0.25, bH * 0.55]].forEach(([ox, oy]) => {
                        ctx.fillStyle = "#a8d8f0"; ctx.beginPath(); ctx.roundRect(cx + ox - 12, bY + oy - 9, 24, 18, 2); ctx.fill();
                    });
                    // Door
                    ctx.fillStyle = fac.color; ctx.beginPath(); ctx.roundRect(cx - 11, groundY - 30, 22, 30, [4,4,0,0]); ctx.fill();

                } else if (fac.id === "library") {
                    // Library — book-shaped facade, columns, book stack outside
                    ctx.fillStyle = bc; ctx.beginPath(); ctx.roundRect(bX, bY, bW, bH, 4); ctx.fill();
                    // Pediment (Greek style)
                    ctx.fillStyle = rc;
                    ctx.beginPath(); ctx.moveTo(bX - 5, bY); ctx.lineTo(cx, bY - bH * 0.22);
                    ctx.lineTo(bX + bW + 5, bY); ctx.closePath(); ctx.fill();
                    // Columns
                    ctx.fillStyle = "#e8e0d0";
                    [bX + 12, bX + bW - 18].forEach(colX => {
                        ctx.beginPath(); ctx.roundRect(colX, bY + 8, 6, bH - 8, 2); ctx.fill();
                    });
                    // Big arched window with book shelf
                    ctx.fillStyle = "#d8c8a0"; ctx.beginPath(); ctx.roundRect(cx - 20, bY + 14, 40, 30, [8,8,0,0]); ctx.fill();
                    // Book spines inside
                    ["#c85050","#5080c8","#50a850","#c8a030","#8050a0"].forEach((col, bi) => {
                        ctx.fillStyle = col; ctx.fillRect(cx - 18 + bi * 7, bY + 20, 6, 22);
                    });
                    // Book stack outside
                    [["#c06060",0],["#5090d0",5],["#60a060",10]].forEach(([col, oy]) => {
                        ctx.fillStyle = col;
                        ctx.beginPath(); ctx.roundRect(bX - 14, groundY - 12 - oy, 16, 4, 1); ctx.fill();
                    });
                    // Door
                    ctx.fillStyle = fac.color; ctx.beginPath(); ctx.roundRect(cx - 11, groundY - 30, 22, 30, [4,4,0,0]); ctx.fill();

                } else if (fac.id === "piano") {
                    // Piano classroom — piano keys on facade, music notes
                    ctx.fillStyle = bc; ctx.beginPath(); ctx.roundRect(bX, bY, bW, bH, 5); ctx.fill();
                    ctx.fillStyle = rc; ctx.beginPath();
                    ctx.moveTo(bX - 8, bY); ctx.lineTo(cx, bY - bH * 0.25); ctx.lineTo(bX + bW + 8, bY);
                    ctx.closePath(); ctx.fill();
                    // Piano keys on wall
                    const keysX = cx - 28, keysY = bY + 14;
                    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.roundRect(keysX, keysY, 56, 24, 2); ctx.fill();
                    for (let ki = 0; ki < 8; ki++) {
                        ctx.strokeStyle = "#ddd"; ctx.lineWidth = 0.5;
                        ctx.beginPath(); ctx.moveTo(keysX + ki * 7, keysY); ctx.lineTo(keysX + ki * 7, keysY + 24); ctx.stroke();
                    }
                    // Black keys
                    ctx.fillStyle = "#333";
                    [1,2,4,5,6].forEach(ki => { ctx.fillRect(keysX + ki * 7 - 2, keysY, 4, 14); });
                    // Music notes floating
                    ctx.fillStyle = fac.roofColor; ctx.font = "16px serif";
                    ctx.textAlign = "center";
                    ctx.fillText("\u266A", cx - 20, bY + bH * 0.6);
                    ctx.fillText("\u266B", cx + 15, bY + bH * 0.5);
                    // Window
                    ctx.fillStyle = "#f0d8d8"; ctx.beginPath(); ctx.roundRect(cx - 14, bY + bH * 0.55, 28, 18, 2); ctx.fill();
                    // Door
                    ctx.fillStyle = fac.color; ctx.beginPath(); ctx.roundRect(cx - 11, groundY - 30, 22, 30, [4,4,0,0]); ctx.fill();

                } else if (fac.id === "park") {
                    // Park — no building, just trees, bench, flower bed, arch gate
                    // Arch gate
                    ctx.fillStyle = "#a08060"; ctx.lineWidth = 3;
                    ctx.beginPath(); ctx.arc(cx, bY + bH * 0.4, 28, Math.PI, 0, false);
                    ctx.lineTo(cx + 28, groundY); ctx.lineTo(cx + 24, groundY); ctx.lineTo(cx + 24, bY + bH * 0.4);
                    ctx.arc(cx, bY + bH * 0.4, 24, 0, Math.PI, true);
                    ctx.lineTo(cx - 28, groundY); ctx.lineTo(cx - 24, groundY);
                    ctx.closePath(); ctx.fill();
                    // "こうえん" on arch
                    ctx.fillStyle = "#5a4a3e"; ctx.font = "700 10px 'Zen Maru Gothic', sans-serif";
                    ctx.textAlign = "center"; ctx.textBaseline = "middle";
                    ctx.fillText(fac.name, cx, bY + bH * 0.33);
                    // Park trees
                    [[-bW * 0.35, 50], [bW * 0.35, 40]].forEach(([ox, th]) => {
                        ctx.fillStyle = "#8a6840"; ctx.beginPath(); ctx.roundRect(cx + ox - 4, groundY - th, 8, th, 2); ctx.fill();
                        ctx.fillStyle = "#4a9838"; ctx.beginPath(); ctx.arc(cx + ox, groundY - th - 14, 18, 0, Math.PI * 2); ctx.fill();
                        ctx.fillStyle = "#58a840"; ctx.beginPath(); ctx.arc(cx + ox - 8, groundY - th - 8, 12, 0, Math.PI * 2); ctx.fill();
                    });
                    // Bench
                    ctx.fillStyle = "#a08060"; ctx.beginPath(); ctx.roundRect(cx - 16, groundY - 14, 32, 4, 1); ctx.fill();
                    ctx.fillRect(cx - 14, groundY - 14, 3, 14); ctx.fillRect(cx + 11, groundY - 14, 3, 14);
                    // Flowers
                    ["#e85070","#e8d040","#d070e0","#50a8e0"].forEach((col, i) => {
                        ctx.fillStyle = col;
                        ctx.beginPath(); ctx.arc(cx - 22 + i * 12, groundY - 4, 3, 0, Math.PI * 2); ctx.fill();
                        ctx.fillStyle = "#50a050"; ctx.fillRect(cx - 22 + i * 12 - 0.5, groundY - 4, 1, 4);
                    });

                } else if (fac.id === "soccer") {
                    // Soccer field — goal, field lines, ball
                    ctx.fillStyle = "#58a838"; ctx.beginPath(); ctx.roundRect(bX, bY + bH * 0.3, bW, bH * 0.7, 3); ctx.fill();
                    // Field lines
                    ctx.strokeStyle = "rgba(255,255,255,0.5)"; ctx.lineWidth = 1.5;
                    ctx.beginPath(); ctx.arc(cx, bY + bH * 0.65, 16, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(cx, bY + bH * 0.3); ctx.lineTo(cx, groundY); ctx.stroke();
                    // Goal
                    ctx.strokeStyle = "#fff"; ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.roundRect(cx - 24, bY + bH * 0.3, 48, 28, [3,3,0,0]); ctx.stroke();
                    // Net pattern
                    ctx.strokeStyle = "rgba(200,200,200,0.3)"; ctx.lineWidth = 0.5;
                    for (let ni = 0; ni < 5; ni++) { ctx.beginPath(); ctx.moveTo(cx - 20 + ni * 10, bY + bH * 0.3); ctx.lineTo(cx - 20 + ni * 10, bY + bH * 0.3 + 26); ctx.stroke(); }
                    // Scoreboard
                    ctx.fillStyle = "#333"; ctx.beginPath(); ctx.roundRect(bX - 10, bY, 30, 20, 3); ctx.fill();
                    ctx.fillStyle = "#0f0"; ctx.font = "700 12px monospace"; ctx.textAlign = "center";
                    ctx.fillText("0-0", bX + 5, bY + 12);
                    // Soccer ball
                    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(cx + 20, groundY - 6, 6, 0, Math.PI * 2); ctx.fill();
                    ctx.strokeStyle = "#333"; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(cx + 20, groundY - 6, 6, 0, Math.PI * 2); ctx.stroke();

                } else if (fac.id === "dance") {
                    // Dance studio — mirrors, barre, stage lights
                    ctx.fillStyle = bc; ctx.beginPath(); ctx.roundRect(bX, bY, bW, bH, 5); ctx.fill();
                    ctx.fillStyle = rc; ctx.beginPath(); ctx.roundRect(bX - 5, bY - 4, bW + 10, 10, 4); ctx.fill();
                    // Mirror wall (big reflective rectangle)
                    ctx.fillStyle = "rgba(180,210,230,0.5)"; ctx.beginPath(); ctx.roundRect(cx - bW * 0.35, bY + 12, bW * 0.7, bH * 0.5, 2); ctx.fill();
                    ctx.strokeStyle = "rgba(160,160,180,0.6)"; ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.roundRect(cx - bW * 0.35, bY + 12, bW * 0.7, bH * 0.5, 2); ctx.stroke();
                    // Barre (horizontal bar)
                    ctx.strokeStyle = "#c8a878"; ctx.lineWidth = 3; ctx.lineCap = "round";
                    ctx.beginPath(); ctx.moveTo(bX + 10, bY + bH * 0.55); ctx.lineTo(bX + bW - 10, bY + bH * 0.55); ctx.stroke();
                    ctx.lineCap = "butt";
                    // Stage lights on top
                    ["#e8e050","#e850a0","#50a0e8"].forEach((col, li) => {
                        const lx = cx - 20 + li * 20;
                        ctx.fillStyle = col; ctx.globalAlpha = 0.6;
                        ctx.beginPath(); ctx.arc(lx, bY + 2, 4, 0, Math.PI * 2); ctx.fill();
                        ctx.globalAlpha = 1;
                    });
                    // Music note
                    ctx.fillStyle = rc; ctx.font = "14px serif"; ctx.textAlign = "center";
                    ctx.fillText("\u266B", cx + bW * 0.3, bY + bH * 0.35);
                    // Door
                    ctx.fillStyle = fac.color; ctx.beginPath(); ctx.roundRect(cx - 11, groundY - 30, 22, 30, [4,4,0,0]); ctx.fill();

                } else if (fac.id === "science") {
                    // Science lab — flask, molecule model, periodic table
                    ctx.fillStyle = bc; ctx.beginPath(); ctx.roundRect(bX, bY, bW, bH, 5); ctx.fill();
                    ctx.fillStyle = rc; ctx.beginPath(); ctx.roundRect(bX - 5, bY - 4, bW + 10, 10, 4); ctx.fill();
                    // Flask on wall
                    ctx.strokeStyle = "#70a0d0"; ctx.lineWidth = 2; ctx.fillStyle = "#a0d8f0";
                    ctx.beginPath(); ctx.moveTo(cx - 5, bY + 16); ctx.lineTo(cx - 5, bY + 28);
                    ctx.lineTo(cx - 14, bY + 44); ctx.lineTo(cx + 14, bY + 44);
                    ctx.lineTo(cx + 5, bY + 28); ctx.lineTo(cx + 5, bY + 16); ctx.closePath();
                    ctx.fill(); ctx.stroke();
                    // Liquid in flask
                    ctx.fillStyle = "#60d890"; ctx.globalAlpha = 0.6;
                    ctx.beginPath(); ctx.moveTo(cx - 10, bY + 36); ctx.lineTo(cx - 14, bY + 44);
                    ctx.lineTo(cx + 14, bY + 44); ctx.lineTo(cx + 10, bY + 36); ctx.closePath(); ctx.fill();
                    ctx.globalAlpha = 1;
                    // Bubbles
                    ctx.fillStyle = "rgba(255,255,255,0.5)";
                    ctx.beginPath(); ctx.arc(cx - 3, bY + 38, 2, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.arc(cx + 4, bY + 34, 1.5, 0, Math.PI * 2); ctx.fill();
                    // Atom model outside
                    ctx.strokeStyle = "#4878a8"; ctx.lineWidth = 1;
                    const ax = bX + bW + 14, ay = bY + bH * 0.5;
                    ctx.beginPath(); ctx.ellipse(ax, ay, 12, 6, 0, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.ellipse(ax, ay, 12, 6, Math.PI / 3, 0, Math.PI * 2); ctx.stroke();
                    ctx.beginPath(); ctx.ellipse(ax, ay, 12, 6, -Math.PI / 3, 0, Math.PI * 2); ctx.stroke();
                    ctx.fillStyle = "#e85050"; ctx.beginPath(); ctx.arc(ax, ay, 3, 0, Math.PI * 2); ctx.fill();
                    // Window
                    ctx.fillStyle = "#d0e0f0"; ctx.beginPath(); ctx.roundRect(cx - 22, bY + bH * 0.6, 44, 16, 2); ctx.fill();
                    // Door
                    ctx.fillStyle = fac.color; ctx.beginPath(); ctx.roundRect(cx - 11, groundY - 30, 22, 30, [4,4,0,0]); ctx.fill();

                } else {
                    // Fallback generic building
                    ctx.fillStyle = bc; ctx.beginPath(); ctx.roundRect(bX, bY, bW, bH, 5); ctx.fill();
                    ctx.fillStyle = rc; ctx.beginPath();
                    ctx.moveTo(bX - 8, bY); ctx.lineTo(cx, bY - bH * 0.28); ctx.lineTo(bX + bW + 8, bY);
                    ctx.closePath(); ctx.fill();
                    ctx.fillStyle = fac.color; ctx.beginPath(); ctx.roundRect(cx - 11, groundY - 30, 22, 30, [4,4,0,0]); ctx.fill();
                }

                // Sign (all facilities)
                ctx.fillStyle = "rgba(255,255,255,0.9)";
                const signW = Math.min(bW - 6, 90);
                ctx.beginPath(); ctx.roundRect(cx - signW / 2, groundY - bH - 22, signW, 18, 3); ctx.fill();
                ctx.fillStyle = "#4a3a2e"; ctx.font = "700 11px 'Zen Maru Gothic', sans-serif";
                ctx.textAlign = "center"; ctx.textBaseline = "middle";
                ctx.fillText(fac.name, cx, groundY - bH - 13);

                ctx.restore();
            }

            ctx.textAlign = "left";
        }

        // School interior background objects (lazy init)
        // Character reference height: Child at scale 1.05 is ~120px tall (feet to head top)
        // Door height should match: ~120px. Desk top at waist (~50px from floor).
        function ensureSchoolBgObjects() {
            if (!schoolBgNpcs) {
                schoolBgNpcs = [];
                for (let i = 0; i < 3; i++) {
                    const goingRight = Math.random() < 0.5;
                    schoolBgNpcs.push({
                        x: goingRight ? -100 - randInt(0, 400) : worldWidth + 100 + randInt(0, 400),
                        dir: goingRight ? 1 : -1,
                        speed: 0.6 + Math.random() * 0.5,
                        scale: 0.92 + Math.random() * 0.18,
                        walkCycle: Math.random() * Math.PI * 2,
                        bodyHue: randInt(0, 360),
                        limbHue: randInt(0, 360),
                        skinTone: `hsl(25, ${58 + randInt(0, 20)}%, ${78 + randInt(0, 10)}%)`,
                        hairColor: `hsl(${randInt(15, 45)}, ${30 + randInt(0, 25)}%, ${35 + randInt(0, 25)}%)`,
                        faceType: randInt(0, 4),
                        isBoy: Math.random() < 0.5,
                        hairStyle: randInt(0, 2),
                        cheekColor: "hsl(350, 62%, 78%)"
                    });
                }
            }
            if (!schoolBgObjects) {
                schoolBgObjects = { lockers: [], desks: [], books: [], chattingPair: null };
                const wallH = height * ROOM_WALL_RATIO;
                const floorY = wallH;
                // Locker positions in hallway (between library and science room doors)
                const lockerStart = worldWidth * 0.30;
                const lockerEnd = worldWidth * 0.38;
                for (let x = lockerStart; x < lockerEnd; x += 48) {
                    schoolBgObjects.lockers.push({ x, hue: randInt(200, 260) });
                }
                // Desk positions in classroom (4 columns x 5 rows)
                const classStart = worldWidth * 0.64;
                const classEnd = worldWidth * 0.95;
                const deskCols = 4, deskRows = 5;
                const colSpan = (classEnd - classStart) / (deskCols + 1);
                const floorH = height - wallH;
                const rowStart = floorY + 20;
                const rowEnd = floorY + floorH * 0.85;
                const rowSpan = (rowEnd - rowStart) / (deskRows);
                for (let r = 0; r < deskRows; r++) {
                    for (let c = 0; c < deskCols; c++) {
                        schoolBgObjects.desks.push({
                            x: classStart + (c + 1) * colSpan,
                            y: rowStart + r * rowSpan
                        });
                    }
                }
                // Books stack for 読書 area (near worldFraction 0.52-0.60)
                const bookAreaX = worldWidth * 0.67;
                const bookColors = [
                    "hsl(350, 55%, 55%)", "hsl(210, 55%, 50%)", "hsl(45, 65%, 55%)",
                    "hsl(140, 45%, 50%)", "hsl(280, 45%, 55%)", "hsl(20, 60%, 52%)"
                ];
                for (let i = 0; i < 6; i++) {
                    schoolBgObjects.books.push({
                        x: bookAreaX - 25 + i * 10 + randInt(-2, 2),
                        color: bookColors[i],
                        h: 18 + randInt(0, 8),
                        w: 6 + randInt(0, 3),
                        tilt: (Math.random() - 0.5) * 0.15
                    });
                }
                // Chatting pair for おしゃべり area (worldFraction 0.62-0.72)
                // Chatting pair uses same NPC data shape as walking NPCs
                const makeChatNpc = (xPos) => ({
                    x: xPos,
                    dir: 1,
                    speed: 0,
                    scale: 1.0,
                    walkCycle: 0,
                    bodyHue: randInt(0, 360),
                    limbHue: randInt(0, 360),
                    skinTone: `hsl(25, ${58 + randInt(0, 20)}%, ${78 + randInt(0, 10)}%)`,
                    hairColor: `hsl(${randInt(15, 45)}, ${30 + randInt(0, 25)}%, ${35 + randInt(0, 25)}%)`,
                    faceType: randInt(0, 4),
                    isBoy: Math.random() < 0.5,
                    hairStyle: randInt(0, 2),
                    cheekColor: "hsl(350, 62%, 78%)"
                });
                schoolBgObjects.chattingPair = {
                    x: worldWidth * 0.76,
                    student1: makeChatNpc(worldWidth * 0.76 - 28),
                    student2: makeChatNpc(worldWidth * 0.76 + 28)
                };
            }
        }

        function updateSchoolNpcs() {
            if (!schoolBgNpcs) return;
            schoolBgNpcs.forEach(npc => {
                npc.x += npc.speed * npc.dir;
                npc.walkCycle += 0.12;
                // One-way: respawn from opposite side when off-screen
                if (npc.dir > 0 && npc.x > worldWidth + 200) {
                    npc.x = -150 - randInt(0, 300);
                    npc.speed = 0.6 + Math.random() * 0.5;
                    npc.scale = 0.92 + Math.random() * 0.18;
                }
                if (npc.dir < 0 && npc.x < -200) {
                    npc.x = worldWidth + 150 + randInt(0, 300);
                    npc.speed = 0.6 + Math.random() * 0.5;
                    npc.scale = 0.92 + Math.random() * 0.18;
                }
            });
        }

        // Draw NPC using full Child rig (same design, different colors)
        // opts: { standing: bool, gesturePhase: number, facing: number } for chatting pose
        function drawSchoolNpc(npc, opts) {
            const wallH = height * ROOM_WALL_RATIO;
            ctx.save();
            ctx.globalAlpha = 1.0;
            ctx.translate(npc.x, wallH);

            const standing = opts && opts.standing;
            const t = standing ? (opts.gesturePhase || 0) : npc.walkCycle;
            const verticalBob = standing ? Math.sin(t * 2.5) * 1.2 : Math.abs(Math.sin(t)) * 2.5;
            const s = npc.scale;
            const dir = standing ? (opts.facing || 1) : -npc.dir;
            ctx.scale(dir * s, s);
            ctx.translate(0, -verticalBob);

            const bodyColor = `hsl(${npc.bodyHue}, 55%, 65%)`;
            const limbColor = `hsl(${npc.limbHue}, 45%, 55%)`;
            const skinColor = npc.skinTone;
            const hairColor = npc.hairColor;
            const shoeColor = "hsl(25, 15%, 30%)";
            const soleColor = "hsl(25, 10%, 22%)";
            const sockColor = "hsl(0, 0%, 93%)";
            const backpackColor = limbColor;

            let legSwingL, legSwingR, kneeL, kneeR, armSwingL, armSwingR, headBob;
            if (standing) {
                // Standing still — slight weight shift, gesture arms
                legSwingL = 0;
                legSwingR = 0;
                kneeL = 0;
                kneeR = 0;
                armSwingL = Math.sin(t * 3) * 0.2 - 0.3; // gesturing arm
                armSwingR = -0.1; // relaxed arm
                headBob = Math.sin(t * 2) * 0.03;
            } else {
                legSwingL = Math.sin(t) * 0.26;
                legSwingR = Math.sin(t + Math.PI) * 0.26;
                kneeL = Math.max(0, -legSwingL) * 0.4;
                kneeR = Math.max(0, -legSwingR) * 0.4;
                armSwingL = Math.sin(t + Math.PI) * 0.22;
                armSwingR = Math.sin(t) * 0.22;
                headBob = Math.sin(t * 2) * 0.02;
            }

            const dp = (x, y, ang, fn) => { ctx.save(); ctx.translate(x, y); ctx.rotate(ang); fn(ctx); ctx.restore(); };

            const drawLeg = (x, y, upperAng, kneeAng) => {
                dp(x, y, upperAng, c => {
                    c.fillStyle = limbColor;
                    c.beginPath(); c.roundRect(-7, -3, 14, 25, 5); c.fill();
                    dp(0, 17, kneeAng, c2 => {
                        c2.fillStyle = skinColor;
                        c2.beginPath(); c2.roundRect(-5, 2, 10, 16, 4); c2.fill();
                        c2.fillStyle = limbColor;
                        c2.beginPath(); c2.roundRect(-6.5, -4, 13, 9, 4); c2.fill();
                        c2.fillStyle = sockColor;
                        c2.beginPath(); c2.roundRect(-5.5, 13, 11, 7, 3); c2.fill();
                        c2.fillStyle = shoeColor;
                        c2.beginPath(); c2.ellipse(2, 20, 10, 5.5, 0, 0, Math.PI * 2); c2.fill();
                        c2.beginPath(); c2.roundRect(-5, 16, 12, 5, [3,3,0,0]); c2.fill();
                        c2.fillStyle = soleColor;
                        c2.beginPath(); c2.moveTo(-6, 21); c2.lineTo(12, 21); c2.lineTo(11, 24); c2.lineTo(-5, 24); c2.closePath(); c2.fill();
                    });
                });
            };
            const drawArm = (x, y, swingAng) => {
                dp(x, y, swingAng, c => {
                    c.fillStyle = bodyColor;
                    c.beginPath(); c.roundRect(-5.5, -2, 11, 10, 4); c.fill();
                    c.fillStyle = skinColor;
                    c.beginPath(); c.roundRect(-4.5, 8, 9, 12, 4); c.fill();
                    dp(0, 20, 0.12, c2 => {
                        c2.fillStyle = skinColor;
                        c2.beginPath(); c2.roundRect(-3.5, 0, 7, 11, 3.5); c2.fill();
                        c2.beginPath(); c2.ellipse(0, 12, 4.5, 3.5, 0, 0, Math.PI * 2); c2.fill();
                    });
                });
            };

            drawLeg(-8, -7, legSwingL, kneeL);
            drawArm(-15, -54, armSwingL);
            // Backpack (only for walking NPCs)
            if (!standing) {
                ctx.fillStyle = backpackColor; ctx.globalAlpha = 0.75;
                ctx.beginPath(); ctx.roundRect(-22, -52, 16, 26, 5); ctx.fill();
                ctx.globalAlpha = 1.0;
            }
            // Body
            ctx.fillStyle = bodyColor;
            ctx.beginPath(); ctx.roundRect(-17, -58, 34, 32, 8); ctx.fill();
            ctx.fillStyle = skinColor;
            ctx.beginPath(); ctx.moveTo(-7, -58); ctx.quadraticCurveTo(0, -51, 7, -58); ctx.fill();
            // Shorts
            ctx.fillStyle = limbColor;
            ctx.beginPath(); ctx.roundRect(-16, -28, 32, 24, [0,0,6,6]); ctx.fill();
            ctx.beginPath(); ctx.ellipse(-8, -7, 10, 9, 0, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.ellipse(8, -7, 10, 9, 0, 0, Math.PI * 2); ctx.fill();
            drawLeg(8, -7, legSwingR, kneeR);
            drawArm(15, -54, armSwingR);
            // Head
            dp(0, -72, headBob, c => {
                c.scale(-1, 1);
                const HR = 21;
                c.fillStyle = hairColor;
                c.beginPath(); c.arc(0, -1, HR + 3, Math.PI, 0, false); c.closePath(); c.fill();
                c.fillStyle = skinColor;
                c.beginPath(); c.arc(0, 0, HR, 0, Math.PI * 2); c.fill();
                c.fillStyle = skinColor;
                c.beginPath(); c.arc(-18, 3, 5.5, 0, Math.PI * 2); c.fill();
                c.beginPath(); c.arc(18, 3, 5.5, 0, Math.PI * 2); c.fill();
                c.fillStyle = hairColor;
                c.beginPath();
                c.moveTo(-17, -21); c.lineTo(-17, -13);
                c.quadraticCurveTo(-8, -16, 0, -13);
                c.quadraticCurveTo(8, -16, 17, -13);
                c.lineTo(17, -21); c.closePath(); c.fill();
                drawBabyFace(c, npc.faceType, skinColor, npc.cheekColor, null, false);
            });

            ctx.restore();
        }

        // ======== LESSON PHASE (授業フェーズ) ========
        let lessonStartTime = 0;
        let lessonDustMotes = [];
        let lessonChalkProgress = 0;
        let lessonTeacherArm = 0;
        let lessonTransitioned = false;
        const LESSON_ANIM_MS = 5000;
        const LESSON_FADE_MS = 3000;

        function playSchoolChime() {
            // キンコンカンコン — classic Japanese school chime (Westminster chime variant)
            const chimeSynth = new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: "sine" },
                envelope: { attack: 0.01, decay: 1.2, sustain: 0.15, release: 1.5 },
                volume: -8
            }).toDestination();
            const reverb = new Tone.Reverb({ decay: 2.5, wet: 0.4 }).toDestination();
            chimeSynth.connect(reverb);
            // E5 → C5 → D5 → G4 (classic pattern)
            const notes = ["E5", "C5", "D5", "G4"];
            const spacing = 0.55; // seconds between each note
            notes.forEach((note, i) => {
                chimeSynth.triggerAttackRelease(note, "2n", Tone.now() + i * spacing);
            });
            // Dispose after chime finishes
            setTimeout(() => {
                chimeSynth.dispose();
                reverb.dispose();
            }, (notes.length * spacing + 3) * 1000);
        }

        function transitionMinigameToLesson() {
            // Stop groove
            if (baseGroove && baseGroove.timer) {
                clearTimeout(baseGroove.timer);
                baseGroove.timer = null;
            }
            // Play school chime
            playSchoolChime();
            // 3s white fade IN (minigame → white)
            fadeScreenTo(1, 3000);
            setTimeout(() => {
                // Start lesson scene
                currentScene = SCENE.LESSON;
                lessonTransitioned = false;
                startLessonPhase();
                // Fade scene-fade away to reveal lesson on canvas
                fadeScreenTo(0, 800);
            }, 3000);
        }

        function startLessonPhase() {
            currentScene = SCENE.LESSON;
            lessonStartTime = performance.now();
            lessonChalkProgress = 0;
            lessonTeacherArm = 0;
            lessonDustMotes = [];
            for (let i = 0; i < 35; i++) {
                lessonDustMotes.push({
                    x: Math.random() * width * 0.5,
                    y: Math.random() * height * 0.55,
                    size: 1 + Math.random() * 2.5,
                    speed: 0.08 + Math.random() * 0.15,
                    drift: (Math.random() - 0.5) * 0.15,
                    phase: Math.random() * Math.PI * 2,
                    alpha: 0.15 + Math.random() * 0.3
                });
            }
        }

        function drawLessonScene() {
            const elapsed = performance.now() - lessonStartTime;
            const t = Math.min(elapsed / LESSON_ANIM_MS, 1);
            function lerp(a, b, t2) { return a + (b - a) * t2; }

            // ============ PERSPECTIVE (Seated eye-level) ============
            const vpX = width * 0.5;
            const vpY = height * 0.38;

            const bwL = width * 0.08, bwR = width * 0.92;
            const bwTop = height * 0.06;
            const bwBot = height * 0.56;
            const bwW = bwR - bwL, bwH = bwBot - bwTop;
            const frontBotY = height * 0.72;

            // ============ 1. CEILING ============
            const ceilG = ctx.createLinearGradient(0, 0, 0, bwTop);
            ceilG.addColorStop(0, "#ede8df"); ceilG.addColorStop(1, "#e5ddd2");
            ctx.fillStyle = ceilG;
            ctx.beginPath();
            ctx.moveTo(0, 0); ctx.lineTo(width, 0);
            ctx.lineTo(bwR, bwTop); ctx.lineTo(bwL, bwTop);
            ctx.closePath(); ctx.fill();

            // Fluorescent lights on ceiling
            for (let i = 0; i < 2; i++) {
                const ln = 0.3 + i * 0.4;
                const lx = lerp(bwL + ln * bwW, ln * width, 0.35);
                const ly = bwTop * 0.45;
                const lw = width * 0.09;
                ctx.fillStyle = "#d4d0c6";
                ctx.fillRect(lx - lw / 2, ly - 2, lw, 8);
                ctx.fillStyle = "rgba(255,255,245,0.85)";
                ctx.fillRect(lx - lw / 2 + 2, ly, lw - 4, 4);
                ctx.fillStyle = "rgba(255,255,240,0.05)";
                ctx.beginPath(); ctx.ellipse(lx, ly + 2, lw * 0.7, 16, 0, 0, Math.PI * 2); ctx.fill();
            }

            // ============ 2. BACK WALL (Wooden Paneling) ============
            ctx.fillStyle = "#d2b48c";
            ctx.fillRect(bwL, bwTop, bwW, bwH);

            ctx.strokeStyle = "rgba(0,0,0,0.08)";
            ctx.lineWidth = 1;
            const plankH = bwH / 12;
            for (let i = 0; i <= 12; i++) {
                const py = bwTop + i * plankH;
                ctx.beginPath(); ctx.moveTo(bwL, py); ctx.lineTo(bwR, py); ctx.stroke();
                if (i < 12) {
                    ctx.fillStyle = i % 2 === 0 ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.03)";
                    ctx.fillRect(bwL, py, bwW, plankH);
                }
            }

            // Wainscoting
            const trimH = bwH * 0.12;
            const trimG = ctx.createLinearGradient(0, bwBot - trimH, 0, bwBot);
            trimG.addColorStop(0, "#a67c52"); trimG.addColorStop(1, "#8b5a2b");
            ctx.fillStyle = trimG;
            ctx.fillRect(bwL, bwBot - trimH, bwW, trimH);
            ctx.strokeStyle = "rgba(0,0,0,0.2)";
            ctx.beginPath(); ctx.moveTo(bwL, bwBot - trimH); ctx.lineTo(bwR, bwBot - trimH); ctx.stroke();

            // ============ 3. SCHOOL SONG POSTER ============
            const posterW = bwW * 0.32, posterH = bwH * 0.07;
            const posterX = bwL + (bwW - posterW) / 2;
            const posterY = bwTop + bwH * 0.02;
            ctx.fillStyle = "#faf5e8";
            ctx.beginPath(); ctx.roundRect(posterX, posterY, posterW, posterH, 2); ctx.fill();
            ctx.strokeStyle = "rgba(180,160,120,0.5)"; ctx.lineWidth = 0.8;
            ctx.strokeRect(posterX, posterY, posterW, posterH);
            ctx.fillStyle = "rgba(100,80,50,0.7)";
            ctx.font = `700 ${Math.round(posterH * 0.35)}px 'Zen Maru Gothic'`;
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText("\u266A \u6821 \u6B4C \u266A", posterX + posterW / 2, posterY + posterH * 0.35);
            ctx.font = `400 ${Math.round(posterH * 0.24)}px 'Zen Maru Gothic'`;
            ctx.fillStyle = "rgba(100,80,50,0.45)";
            ctx.fillText("\u9752\u3044\u7A7A\u306E\u4E0B\u3000\u307F\u3093\u306A\u306E\u58F0\u304C\u97FF\u304F", posterX + posterW / 2, posterY + posterH * 0.72);

            // ============ 4. BLACKBOARD ============
            const bbW = bwW * 0.50, bbH = bwH * 0.52;
            const bbX = bwL + (bwW - bbW) / 2;
            const bbY = posterY + posterH + bwH * 0.02;
            const fr = 6;

            // Frame
            ctx.fillStyle = "#9a8a68";
            ctx.beginPath(); ctx.roundRect(bbX - fr, bbY - fr, bbW + fr * 2, bbH + fr * 2 + 8, 4); ctx.fill();
            ctx.fillStyle = "#8a7a58"; ctx.fillRect(bbX - fr, bbY - fr, bbW + fr * 2, 3);

            // Surface
            const boardG = ctx.createLinearGradient(bbX, bbY, bbX, bbY + bbH);
            boardG.addColorStop(0, "#2a4f3f"); boardG.addColorStop(0.5, "#2c5040"); boardG.addColorStop(1, "#284a3a");
            ctx.fillStyle = boardG;
            ctx.beginPath(); ctx.roundRect(bbX, bbY, bbW, bbH, 2); ctx.fill();

            // Chalk smudges
            ctx.fillStyle = "rgba(255,255,255,0.025)";
            for (let i = 0; i < 5; i++) {
                ctx.beginPath(); ctx.ellipse(bbX + bbW * (0.1 + i * 0.2), bbY + bbH * 0.5, 20 + i * 5, 10, 0.1 * i, 0, Math.PI * 2); ctx.fill();
            }

            // Chalk tray
            ctx.fillStyle = "#bab098";
            ctx.beginPath(); ctx.roundRect(bbX - fr, bbY + bbH + fr, bbW + fr * 2, 7, [0, 0, 3, 3]); ctx.fill();
            ["#fff", "#ffe8aa", "#ffbbbb", "#aaddff"].forEach((c, ci) => {
                ctx.fillStyle = c; ctx.fillRect(bbX + 8 + ci * 18, bbY + bbH + fr + 1, 10, 3.5);
            });

            // 日直 (right side of board)
            const nkX = bbX + bbW * 0.72, nkY = bbY + bbH * 0.06;
            const nkW = bbW * 0.24, nkH = bbH * 0.38;
            ctx.strokeStyle = "rgba(255,255,255,0.25)"; ctx.lineWidth = 1;
            ctx.strokeRect(nkX, nkY, nkW, nkH);
            const nkA = Math.min(t * 4, 1);
            ctx.fillStyle = `rgba(255,255,255,${0.6 * nkA})`;
            ctx.font = `700 ${Math.round(nkH * 0.16)}px 'Zen Maru Gothic'`;
            ctx.textAlign = "center"; ctx.textBaseline = "top";
            ctx.fillText("\u4ECA\u65E5\u306E\u65E5\u76F4", nkX + nkW / 2, nkY + nkH * 0.08);
            const nmA = Math.max(0, Math.min((t - 0.1) * 5, 1));
            ctx.font = `400 ${Math.round(nkH * 0.18)}px 'Zen Maru Gothic'`;
            ctx.fillStyle = `rgba(255,255,200,${0.7 * nmA})`;
            ctx.fillText("\u7530\u4E2D \u30FB \u9234\u6728", nkX + nkW / 2, nkY + nkH * 0.42);
            ctx.font = `400 ${Math.round(nkH * 0.14)}px 'Zen Maru Gothic'`;
            ctx.fillStyle = `rgba(255,255,200,${0.5 * nmA})`;
            ctx.fillText("2\u670825\u65E5\uFF08\u706B\uFF09", nkX + nkW / 2, nkY + nkH * 0.72);

            // Chalk writing (left side)
            ctx.save();
            ctx.beginPath(); ctx.rect(bbX, bbY, bbW * 0.70, bbH); ctx.clip();
            const cA = 0.75 * Math.min(t * 3.5, 1);
            const tp = Math.min(t / 0.2, 1);
            if (tp > 0) {
                ctx.fillStyle = `rgba(255,255,255,${cA})`;
                ctx.font = `700 ${Math.round(bbH * 0.13)}px 'Zen Maru Gothic'`;
                ctx.textAlign = "left"; ctx.textBaseline = "top";
                const tt = "\u672C\u65E5\u306E\u6388\u696D", tx = bbX + bbW * 0.05, ty = bbY + bbH * 0.08;
                ctx.fillText(tt.substring(0, Math.ceil(tt.length * tp)), tx, ty);
                if (tp >= 1) {
                    ctx.strokeStyle = `rgba(255,255,255,${cA * 0.35})`; ctx.lineWidth = 1.5;
                    ctx.beginPath(); ctx.moveTo(tx, ty + bbH * 0.16); ctx.lineTo(tx + ctx.measureText(tt).width, ty + bbH * 0.16); ctx.stroke();
                }
            }
            const lines = ["1. \u3044\u306E\u3061\u306E\u97F3\u3068\u30EA\u30BA\u30E0", "2. \u9078\u629E\u306E\u9023\u9396", "3. \u81EA\u5206\u3060\u3051\u306E\u30E1\u30ED\u30C7\u30A3\u30FC"];
            ctx.font = `400 ${Math.round(bbH * 0.085)}px 'Zen Maru Gothic'`;
            for (let li = 0; li < lines.length; li++) {
                const ls = 0.2 + (li / 3) * 0.5, le = ls + 0.5 / 3;
                const lt = Math.max(0, Math.min((t - ls) / (le - ls), 1));
                if (lt > 0) {
                    ctx.fillStyle = `rgba(255,255,255,${cA * 0.85})`;
                    ctx.fillText(lines[li].substring(0, Math.ceil(lines[li].length * lt)), bbX + bbW * 0.07, bbY + bbH * (0.32 + li * 0.17));
                }
            }
            const nt = Math.max(0, Math.min((t - 0.7) / 0.2, 1));
            if (nt > 0) {
                ctx.globalAlpha = nt * cA * 0.6;
                ctx.font = `400 ${Math.round(bbH * 0.13)}px sans-serif`;
                ctx.fillStyle = "#fff"; ctx.fillText("\u266B", bbX + bbW * 0.55, bbY + bbH * 0.78);
                ctx.globalAlpha = 1;
            }
            ctx.restore();

            // ============ 5. CLOCK ============
            const cR = Math.min(bwW, bwH) * 0.042;
            const cCX = bbX + bbW + bwW * 0.05, cCY = bbY + cR * 0.3;
            ctx.fillStyle = "#f5f2ec"; ctx.strokeStyle = "#8a7a60"; ctx.lineWidth = 2.5;
            ctx.beginPath(); ctx.arc(cCX, cCY, cR, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
            for (let hi = 0; hi < 12; hi++) {
                const a = (hi / 12) * Math.PI * 2 - Math.PI / 2;
                ctx.strokeStyle = "#555"; ctx.lineWidth = hi % 3 === 0 ? 2 : 0.8;
                ctx.beginPath();
                ctx.moveTo(cCX + Math.cos(a) * cR * (hi % 3 === 0 ? 0.72 : 0.8), cCY + Math.sin(a) * cR * (hi % 3 === 0 ? 0.72 : 0.8));
                ctx.lineTo(cCX + Math.cos(a) * cR * 0.88, cCY + Math.sin(a) * cR * 0.88);
                ctx.stroke();
            }
            const hA = ((10 + 25 / 60) / 12) * Math.PI * 2 - Math.PI / 2;
            const mA2 = (25 / 60) * Math.PI * 2 - Math.PI / 2;
            ctx.strokeStyle = "#333"; ctx.lineCap = "round";
            ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(cCX, cCY); ctx.lineTo(cCX + Math.cos(hA) * cR * 0.45, cCY + Math.sin(hA) * cR * 0.45); ctx.stroke();
            ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(cCX, cCY); ctx.lineTo(cCX + Math.cos(mA2) * cR * 0.68, cCY + Math.sin(mA2) * cR * 0.68); ctx.stroke();
            ctx.fillStyle = "#c00"; ctx.beginPath(); ctx.arc(cCX, cCY, 2, 0, Math.PI * 2); ctx.fill();

            // ============ 6. 給食メニュー ============
            const mnW = bwW * 0.085, mnH = bwH * 0.38;
            const mnX = bbX - mnW - bwW * 0.03, mnY = bbY + bbH * 0.02;
            ctx.fillStyle = "#fefcf4";
            ctx.beginPath(); ctx.roundRect(mnX, mnY, mnW, mnH, 3); ctx.fill();
            ctx.strokeStyle = "rgba(180,160,120,0.6)"; ctx.lineWidth = 1; ctx.strokeRect(mnX, mnY, mnW, mnH);
            ctx.fillStyle = "#e8a060"; ctx.fillRect(mnX, mnY, mnW, mnH * 0.14);
            ctx.fillStyle = "#fff"; ctx.font = `700 ${Math.round(mnH * 0.07)}px 'Zen Maru Gothic'`;
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText("\u4ECA\u65E5\u306E\u7D66\u98DF", mnX + mnW / 2, mnY + mnH * 0.07);
            ctx.fillStyle = "rgba(80,60,40,0.65)"; ctx.font = `400 ${Math.round(mnH * 0.058)}px 'Zen Maru Gothic'`;
            ["\u3054\u306F\u3093", "\u307F\u305D\u3057\u308B", "\u3084\u304D\u3056\u304B\u306A", "\u307B\u3046\u308C\u3093\u305D\u3046", "\u725B\u4E73"].forEach((item, mi) => {
                ctx.fillText(item, mnX + mnW / 2, mnY + mnH * (0.24 + mi * 0.14));
            });

            // ============ 7. LEFT SIDE WALL + WINDOWS ============
            const lwG = ctx.createLinearGradient(0, height * 0.3, bwL, height * 0.3);
            lwG.addColorStop(0, "#ddd4c4"); lwG.addColorStop(1, "#e8e0d2");
            ctx.fillStyle = lwG;
            ctx.beginPath();
            ctx.moveTo(0, 0); ctx.lineTo(bwL, bwTop); ctx.lineTo(bwL, bwBot); ctx.lineTo(0, frontBotY);
            ctx.closePath(); ctx.fill();

            // Wainscoting on left wall
            ctx.fillStyle = "rgba(195,180,155,0.22)";
            ctx.beginPath();
            ctx.moveTo(bwL, bwBot - trimH); ctx.lineTo(bwL, bwBot);
            ctx.lineTo(0, frontBotY); ctx.lineTo(0, lerp(frontBotY, bwBot - trimH, 0.25));
            ctx.closePath(); ctx.fill();

            // Windows (2)
            const winDepths = [0.30, 0.72];
            for (const wd of winDepths) {
                const wTB = bwTop, wTF = 0, wBB = bwBot, wBF = frontBotY;
                const tD = lerp(wTB, wTF, wd), bD = lerp(wBB, wBF, wd);
                const hD = bD - tD;
                const wT = tD + hD * 0.08, wB = tD + hD * 0.62;
                const xD = lerp(bwL, 0, wd);

                const wd2 = Math.max(0, wd - 0.14);
                const xD2 = lerp(bwL, 0, wd2);
                const tD2 = lerp(wTB, wTF, wd2), bD2 = lerp(wBB, wBF, wd2);
                const hD2 = bD2 - tD2;
                const wT2 = tD2 + hD2 * 0.08, wB2 = tD2 + hD2 * 0.62;

                // Frame
                ctx.fillStyle = "#c0b49e";
                ctx.beginPath();
                ctx.moveTo(xD - 3, wT - 3); ctx.lineTo(xD2 + 3, wT2 - 3);
                ctx.lineTo(xD2 + 3, wB2 + 3); ctx.lineTo(xD - 3, wB + 3);
                ctx.closePath(); ctx.fill();

                // Glass
                const skyG = ctx.createLinearGradient(0, wT, 0, wB);
                skyG.addColorStop(0, "#a8d0ee"); skyG.addColorStop(0.4, "#bbe0f8"); skyG.addColorStop(1, "#d8eeff");
                ctx.fillStyle = skyG;
                ctx.beginPath();
                ctx.moveTo(xD, wT); ctx.lineTo(xD2, wT2); ctx.lineTo(xD2, wB2); ctx.lineTo(xD, wB);
                ctx.closePath(); ctx.fill();

                // Tree through far window
                if (wd < 0.5) {
                    ctx.fillStyle = "rgba(100,160,80,0.25)";
                    ctx.beginPath();
                    ctx.moveTo(xD, wB); ctx.lineTo(xD2, wB2);
                    ctx.lineTo(xD2, lerp(wB2, wT2, 0.3)); ctx.lineTo(xD, lerp(wB, wT, 0.3));
                    ctx.closePath(); ctx.fill();
                }

                // Cross muntins
                ctx.strokeStyle = "#c0b49e"; ctx.lineWidth = 2.5;
                ctx.beginPath(); ctx.moveTo(xD, (wT + wB) / 2); ctx.lineTo(xD2, (wT2 + wB2) / 2); ctx.stroke();
                const mx = (xD + xD2) / 2;
                ctx.beginPath(); ctx.moveTo(mx, (wT + wT2) / 2); ctx.lineTo(mx, (wB + wB2) / 2); ctx.stroke();

                // Curtain
                ctx.fillStyle = "rgba(210,195,170,0.3)";
                ctx.beginPath();
                ctx.moveTo(xD, wT); ctx.lineTo(xD + (xD2 - xD) * 0.18, wT + (wT2 - wT) * 0.18);
                ctx.lineTo(xD + (xD2 - xD) * 0.18, wB + (wB2 - wB) * 0.18); ctx.lineTo(xD, wB);
                ctx.closePath(); ctx.fill();
            }

            // ============ 7b. SUNLIGHT + SHADOWS ============
            ctx.save(); ctx.globalAlpha = 0.07; ctx.fillStyle = "#fff8d0";
            ctx.beginPath(); ctx.moveTo(0, height * 0.10); ctx.lineTo(0, height * 0.48); ctx.lineTo(width * 0.38, height * 0.88); ctx.lineTo(width * 0.18, height * 0.88); ctx.closePath(); ctx.fill();
            ctx.globalAlpha = 0.04; ctx.beginPath();
            ctx.moveTo(bwL * 0.65, bwTop * 1.5); ctx.lineTo(bwL * 0.4, bwBot * 0.6); ctx.lineTo(width * 0.28, height * 0.75); ctx.lineTo(width * 0.18, height * 0.75);
            ctx.closePath(); ctx.fill();
            ctx.globalAlpha = 1; ctx.restore();

            // Floor sunlight patch
            ctx.save(); ctx.globalAlpha = 0.06; ctx.fillStyle = "#fff8d0";
            ctx.beginPath(); ctx.moveTo(width * 0.03, height * 0.62); ctx.lineTo(width * 0.20, height * 0.62); ctx.lineTo(width * 0.32, height * 0.84); ctx.lineTo(width * 0.08, height * 0.84); ctx.closePath(); ctx.fill();
            ctx.globalAlpha = 1; ctx.restore();

            // Window-frame shadow on floor
            ctx.save(); ctx.globalAlpha = 0.035; ctx.fillStyle = "#000";
            ctx.fillRect(width * 0.04, height * 0.63, width * 0.16, 1.5);
            ctx.fillRect(width * 0.10, height * 0.57, 1.5, height * 0.12);
            ctx.globalAlpha = 1; ctx.restore();

            // ============ 8. RIGHT SIDE WALL ============
            const rwG = ctx.createLinearGradient(width, height * 0.3, bwR, height * 0.3);
            rwG.addColorStop(0, "#d8d0c0"); rwG.addColorStop(1, "#e4ddd0");
            ctx.fillStyle = rwG;
            ctx.beginPath();
            ctx.moveTo(width, 0); ctx.lineTo(bwR, bwTop); ctx.lineTo(bwR, bwBot); ctx.lineTo(width, frontBotY);
            ctx.closePath(); ctx.fill();

            // Right wall wainscoting
            ctx.fillStyle = "rgba(195,180,155,0.22)";
            ctx.beginPath();
            ctx.moveTo(bwR, bwBot - trimH); ctx.lineTo(bwR, bwBot); ctx.lineTo(width, frontBotY); ctx.lineTo(width, lerp(frontBotY, bwBot - trimH, 0.25));
            ctx.closePath(); ctx.fill();

            // 掃除ロッカー on right wall
            const lkD = 0.40;
            const lkWallBot = lerp(bwBot, frontBotY, lkD);
            const lkWallTop = lerp(bwTop, 0, lkD);
            const lkWallH = lkWallBot - lkWallTop;
            const lkX = lerp(bwR, width, lkD);
            const lkH = lkWallH * 0.52, lkW2 = (width - bwR) * 0.13;
            const lkY = lkWallBot - lkH;
            ctx.fillStyle = "#8a9a88";
            ctx.beginPath(); ctx.roundRect(lkX - lkW2 / 2, lkY, lkW2, lkH, [2, 2, 0, 0]); ctx.fill();
            ctx.strokeStyle = "rgba(0,0,0,0.15)"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(lkX, lkY + 2); ctx.lineTo(lkX, lkY + lkH); ctx.stroke();
            ctx.fillStyle = "#c0c0c0";
            ctx.fillRect(lkX - 3, lkY + lkH * 0.38, 2, lkH * 0.10);
            ctx.fillRect(lkX + 1, lkY + lkH * 0.38, 2, lkH * 0.10);
            ctx.strokeStyle = "rgba(0,0,0,0.06)";
            for (let si = 0; si < 3; si++) {
                const sy = lkY + lkH * (0.68 + si * 0.07);
                ctx.beginPath(); ctx.moveTo(lkX - lkW2 * 0.33, sy); ctx.lineTo(lkX - lkW2 * 0.05, sy); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(lkX + lkW2 * 0.05, sy); ctx.lineTo(lkX + lkW2 * 0.33, sy); ctx.stroke();
            }
            ctx.strokeStyle = "#b5a070"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
            ctx.beginPath(); ctx.moveTo(lkX + lkW2 * 0.28, lkY); ctx.lineTo(lkX + lkW2 * 0.32, lkY - lkH * 0.22); ctx.stroke();

            // ============ 9. FLOOR ============
            const floorG = ctx.createLinearGradient(0, bwBot, 0, height);
            floorG.addColorStop(0, "#d2c2a0"); floorG.addColorStop(0.3, "#c8b898"); floorG.addColorStop(1, "#bead88");
            ctx.fillStyle = floorG;
            ctx.beginPath();
            ctx.moveTo(bwL, bwBot); ctx.lineTo(bwR, bwBot);
            ctx.lineTo(width, frontBotY); ctx.lineTo(width, height); ctx.lineTo(0, height); ctx.lineTo(0, frontBotY);
            ctx.closePath(); ctx.fill();

            // Floor board lines
            ctx.strokeStyle = "rgba(155,140,110,0.12)"; ctx.lineWidth = 0.8;
            for (let i = 0; i < 14; i++) {
                const bx = (i / 13) * width;
                ctx.beginPath(); ctx.moveTo(bx, height); ctx.lineTo(lerp(bx, vpX, 0.82), bwBot); ctx.stroke();
            }

            // ============ 10. TEACHER ============
            const tX = bbX - bwW * 0.04;
            const tBaseY = bwBot;
            const tH = bwH * 0.86;
            lessonTeacherArm = Math.sin(elapsed * 0.0018) * 0.3 + 0.2;

            ctx.save(); ctx.translate(tX, tBaseY);
            // Legs
            ctx.fillStyle = "#4a4040";
            ctx.fillRect(-8, -tH * 0.28, 7, tH * 0.28); ctx.fillRect(2, -tH * 0.28, 7, tH * 0.28);
            ctx.fillStyle = "#3a3030";
            ctx.beginPath(); ctx.roundRect(-10, -2, 11, 4, 2); ctx.fill();
            ctx.beginPath(); ctx.roundRect(1, -2, 11, 4, 2); ctx.fill();
            // Body
            const tBW = tH * 0.30, tBH = tH * 0.36;
            ctx.fillStyle = "#5a4848";
            ctx.beginPath(); ctx.roundRect(-tBW / 2, -tH * 0.66, tBW, tBH, [6, 6, 2, 2]); ctx.fill();
            // Collar
            ctx.strokeStyle = "#eee"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(-4, -tH * 0.66); ctx.lineTo(0, -tH * 0.61); ctx.lineTo(4, -tH * 0.66); ctx.stroke();
            // Head
            const thR = tH * 0.12, thY = -tH * 0.66 - thR * 0.7;
            ctx.fillStyle = "#ffe0bd"; ctx.beginPath(); ctx.arc(0, thY, thR, 0, Math.PI * 2); ctx.fill();
            // Hair
            ctx.fillStyle = "#3a2a20";
            ctx.beginPath(); ctx.arc(0, thY - thR * 0.1, thR * 1.08, Math.PI, Math.PI * 2); ctx.fill();
            ctx.fillRect(-thR * 1.08, thY - thR * 0.1, thR * 0.25, thR * 1.1);
            ctx.fillRect(thR * 0.83, thY - thR * 0.1, thR * 0.25, thR * 1.1);
            // Glasses
            ctx.strokeStyle = "#666"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(-thR * 0.28, thY, thR * 0.20, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.arc(thR * 0.28, thY, thR * 0.20, 0, Math.PI * 2); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(-thR * 0.08, thY); ctx.lineTo(thR * 0.08, thY); ctx.stroke();
            // Eyes
            ctx.fillStyle = "#333";
            ctx.beginPath(); ctx.arc(-thR * 0.28, thY, 1.3, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(thR * 0.28, thY, 1.3, 0, Math.PI * 2); ctx.fill();
            // Smile
            ctx.strokeStyle = "#c08080"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(0, thY + thR * 0.2, thR * 0.16, 0.15, Math.PI - 0.15); ctx.stroke();
            // Arms
            ctx.strokeStyle = "#ffe0bd"; ctx.lineWidth = tH * 0.05; ctx.lineCap = "round";
            ctx.beginPath(); ctx.moveTo(-tBW / 2, -tH * 0.61); ctx.lineTo(-tBW / 2 - 6, -tH * 0.40); ctx.stroke();
            const aA = -1.0 + lessonTeacherArm * 0.4, aL = tH * 0.30;
            ctx.beginPath(); ctx.moveTo(tBW / 2, -tH * 0.61);
            ctx.lineTo(tBW / 2 + Math.cos(aA) * aL, -tH * 0.61 + Math.sin(aA) * aL); ctx.stroke();
            if (t < 0.8) {
                const hx2 = tBW / 2 + Math.cos(aA) * aL, hy2 = -tH * 0.61 + Math.sin(aA) * aL;
                ctx.fillStyle = "#fff"; ctx.save(); ctx.translate(hx2, hy2); ctx.rotate(aA + 0.3);
                ctx.fillRect(-1, -4, 3, 8); ctx.restore();
            }
            ctx.restore();

            // ============ 11. STUDENTS (back-of-head view) ============
            function drawStudentBack(sx, headCenterY, headR, hairColor, shirtColor, isGirl) {
                const shoulderW = headR * 1.35;
                const neckH = headR * 0.35;
                const bodyVisH = headR * 2.8;
                const shoulderTopY = headCenterY + headR * 0.65 + neckH;
                const deskW = headR * 3.2, deskH2 = headR * 0.22;
                const deskY2 = shoulderTopY + bodyVisH * 0.20;
                const deskLegH = headR * 1.6, deskLegW = headR * 0.12;
                const chairBackW = headR * 3.2, chairBackH2 = headR * 0.22;
                const chairBackY = shoulderTopY + bodyVisH * 0.45;
                const chairLegH = headR * 2.2, chairLegW = headR * 0.10;
                const chairSeatY = chairBackY - headR * 0.35, chairSeatH = headR * 0.12;
                const metalColor = "#888", metalDark = "#777";

                // Desk legs
                ctx.fillStyle = metalColor;
                ctx.fillRect(sx - deskW * 0.45, deskY2 + deskH2, deskLegW, deskLegH);
                ctx.fillRect(sx + deskW * 0.45 - deskLegW, deskY2 + deskH2, deskLegW, deskLegH);
                ctx.fillStyle = metalDark;
                ctx.fillRect(sx - deskW * 0.42, deskY2 + deskH2, deskLegW * 0.8, deskLegH * 0.7);
                ctx.fillRect(sx + deskW * 0.42 - deskLegW * 0.8, deskY2 + deskH2, deskLegW * 0.8, deskLegH * 0.7);
                ctx.fillStyle = metalColor;
                ctx.fillRect(sx - deskW * 0.44, deskY2 + deskH2 + deskLegH * 0.65, deskW * 0.88, deskLegW * 0.7);

                // Desk surface
                const deskTopG = ctx.createLinearGradient(0, deskY2, 0, deskY2 + deskH2);
                deskTopG.addColorStop(0, "#c8b898"); deskTopG.addColorStop(1, "#b8a888");
                ctx.fillStyle = deskTopG;
                ctx.beginPath(); ctx.roundRect(sx - deskW * 0.5, deskY2, deskW, deskH2, 1); ctx.fill();
                ctx.strokeStyle = "rgba(255,255,255,0.2)"; ctx.lineWidth = 0.8;
                ctx.beginPath(); ctx.moveTo(sx - deskW * 0.5, deskY2); ctx.lineTo(sx + deskW * 0.5, deskY2); ctx.stroke();
                if (!isGirl) {
                    ctx.fillStyle = "rgba(180,200,170,0.5)";
                    ctx.fillRect(sx - deskW * 0.15, deskY2 - headR * 0.08, deskW * 0.28, headR * 0.06);
                } else {
                    ctx.fillStyle = "rgba(220,160,180,0.5)";
                    ctx.beginPath(); ctx.roundRect(sx + deskW * 0.05, deskY2 - headR * 0.07, deskW * 0.22, headR * 0.05, 2); ctx.fill();
                }

                // Chair
                ctx.save();
                ctx.fillStyle = metalColor;
                const chairLeftX = sx - chairBackW * 0.48, chairRightX = sx + chairBackW * 0.48;
                ctx.fillRect(chairLeftX, chairBackY, chairLegW, chairLegH);
                ctx.fillRect(chairRightX - chairLegW, chairBackY, chairLegW, chairLegH);
                ctx.fillRect(chairLeftX + headR * 0.3, chairSeatY, chairLegW, chairLegH * 0.7);
                ctx.fillRect(chairRightX - chairLegW - headR * 0.3, chairSeatY, chairLegW, chairLegH * 0.7);
                ctx.fillRect(chairLeftX, chairBackY + chairLegH * 0.55, chairBackW * 0.96, chairLegW * 0.7);

                const woodBoard = "#704214", woodEdge = "#4a2a10", woodHigh = "#966F33";
                const drawSchoolPlank = (px, py, pw, ph) => {
                    const totalH2 = ph * 2.8;
                    ctx.fillStyle = woodEdge;
                    ctx.beginPath(); ctx.roundRect(px, py, pw, totalH2, 3); ctx.fill();
                    const pg = ctx.createLinearGradient(px, py, px, py + totalH2);
                    pg.addColorStop(0, woodHigh); pg.addColorStop(0.5, woodBoard); pg.addColorStop(1, woodBoard);
                    ctx.fillStyle = pg;
                    ctx.beginPath(); ctx.roundRect(px, py, pw, totalH2 - 1.5, 3); ctx.fill();
                    ctx.fillStyle = "rgba(0,0,0,0.4)";
                    const rx = 10, ry = 8;
                    ctx.beginPath(); ctx.arc(px + rx, py + ry, 1.8, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.arc(px + pw - rx, py + ry, 1.8, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.arc(px + rx, py + totalH2 - ry, 1.8, 0, Math.PI * 2); ctx.fill();
                    ctx.beginPath(); ctx.arc(px + pw - rx, py + totalH2 - ry, 1.8, 0, Math.PI * 2); ctx.fill();
                };
                const widerBackW = headR * 4.2;
                drawSchoolPlank(sx - widerBackW * 0.5, chairBackY, widerBackW, chairBackH2);
                // Chair seat
                ctx.fillStyle = woodEdge;
                ctx.beginPath(); ctx.roundRect(sx - chairBackW * 0.52, chairSeatY + 2, chairBackW * 1.04, chairSeatH, 2); ctx.fill();
                const seatGradient = ctx.createLinearGradient(sx, chairSeatY, sx, chairSeatY + chairSeatH);
                seatGradient.addColorStop(0, woodHigh); seatGradient.addColorStop(1, woodBoard);
                ctx.fillStyle = seatGradient;
                ctx.beginPath(); ctx.roundRect(sx - chairBackW * 0.52, chairSeatY, chairBackW * 1.04, chairSeatH - 2, 2); ctx.fill();
                ctx.restore();

                // Student body
                ctx.fillStyle = shirtColor;
                ctx.beginPath();
                ctx.roundRect(sx - shoulderW, shoulderTopY, shoulderW * 2, bodyVisH, [headR * 0.3, headR * 0.3, 2, 2]);
                ctx.fill();
                ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(sx - shoulderW * 0.25, shoulderTopY);
                ctx.lineTo(sx, shoulderTopY + headR * 0.25);
                ctx.lineTo(sx + shoulderW * 0.25, shoulderTopY);
                ctx.stroke();
                ctx.fillStyle = shirtColor;
                const armW = headR * 0.30;
                ctx.save(); ctx.translate(sx - shoulderW, shoulderTopY + headR * 0.15); ctx.rotate(0.15);
                ctx.fillRect(-armW, 0, armW, bodyVisH * 0.45); ctx.restore();
                ctx.save(); ctx.translate(sx + shoulderW, shoulderTopY + headR * 0.15); ctx.rotate(-0.15);
                ctx.fillRect(0, 0, armW, bodyVisH * 0.45); ctx.restore();
                ctx.fillStyle = "#ffe0bd";
                ctx.fillRect(sx - shoulderW - armW * 0.3, deskY2 - headR * 0.12, shoulderW * 0.5, headR * 0.18);
                ctx.fillRect(sx + shoulderW * 0.6, deskY2 - headR * 0.12, shoulderW * 0.5, headR * 0.18);
                drawSchoolPlank(sx - widerBackW * 0.5, chairBackY + chairBackH2 + headR * 0.25, widerBackW, chairBackH2);
                // Second chair seat
                ctx.fillStyle = woodEdge;
                ctx.beginPath(); ctx.roundRect(sx - chairBackW * 0.52, chairSeatY + 2, chairBackW * 1.04, chairSeatH, 2); ctx.fill();
                const seatG = ctx.createLinearGradient(sx, chairSeatY, sx, chairSeatY + chairSeatH);
                seatG.addColorStop(0, woodHigh); seatG.addColorStop(1, woodBoard);
                ctx.fillStyle = seatG;
                ctx.beginPath(); ctx.roundRect(sx - chairBackW * 0.52, chairSeatY, chairBackW * 1.04, chairSeatH - 2, 2); ctx.fill();

                // Neck + Head
                ctx.fillStyle = "#ffe0bd";
                const neckW = headR * 0.38;
                ctx.fillRect(sx - neckW, headCenterY + headR * 0.55, neckW * 2, neckH + 2);
                ctx.beginPath(); ctx.arc(sx, headCenterY, headR, 0, Math.PI * 2); ctx.fill();
                // Ears
                ctx.beginPath(); ctx.ellipse(sx - headR * 0.93, headCenterY + headR * 0.08, headR * 0.17, headR * 0.26, -0.1, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(sx + headR * 0.93, headCenterY + headR * 0.08, headR * 0.17, headR * 0.26, 0.1, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = "#f5ccaa";
                ctx.beginPath(); ctx.ellipse(sx - headR * 0.93, headCenterY + headR * 0.08, headR * 0.09, headR * 0.14, 0, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.ellipse(sx + headR * 0.93, headCenterY + headR * 0.08, headR * 0.09, headR * 0.14, 0, 0, Math.PI * 2); ctx.fill();
                // Hair
                ctx.fillStyle = hairColor;
                ctx.beginPath(); ctx.arc(sx, headCenterY - headR * 0.05, headR * 1.07, Math.PI * 0.72, Math.PI * 2.28); ctx.fill();
                ctx.beginPath(); ctx.ellipse(sx, headCenterY + headR * 0.2, headR * 1.02, headR * 0.58, 0, -0.15, Math.PI + 0.15); ctx.fill();
                // Hair texture
                ctx.strokeStyle = "rgba(0,0,0,0.06)"; ctx.lineWidth = 0.6;
                for (let hi = 0; hi < 4; hi++) {
                    const ha = -0.6 + hi * 0.4;
                    ctx.beginPath(); ctx.arc(sx, headCenterY - headR * 0.4, headR * (0.5 + hi * 0.15), ha, ha + 0.5); ctx.stroke();
                }
                ctx.strokeStyle = "rgba(0,0,0,0.07)"; ctx.lineWidth = 0.7;
                ctx.beginPath(); ctx.arc(sx + headR * 0.08, headCenterY - headR * 0.25, headR * 0.25, 0.3, 2.8); ctx.stroke();
                // Long hair for girls
                if (isGirl) {
                    ctx.fillStyle = hairColor;
                    const lockW = headR * 0.26;
                    ctx.beginPath();
                    ctx.moveTo(sx - headR * 0.95, headCenterY - headR * 0.1);
                    ctx.quadraticCurveTo(sx - headR * 1.05, headCenterY + headR * 1.5, sx - headR * 0.75, shoulderTopY + bodyVisH * 0.65);
                    ctx.lineTo(sx - headR * 0.75 + lockW, shoulderTopY + bodyVisH * 0.60);
                    ctx.quadraticCurveTo(sx - headR * 0.80, headCenterY + headR * 1.2, sx - headR * 0.70, headCenterY - headR * 0.1);
                    ctx.closePath(); ctx.fill();
                    ctx.beginPath();
                    ctx.moveTo(sx + headR * 0.95, headCenterY - headR * 0.1);
                    ctx.quadraticCurveTo(sx + headR * 1.05, headCenterY + headR * 1.5, sx + headR * 0.75, shoulderTopY + bodyVisH * 0.65);
                    ctx.lineTo(sx + headR * 0.75 - lockW, shoulderTopY + bodyVisH * 0.60);
                    ctx.quadraticCurveTo(sx + headR * 0.80, headCenterY + headR * 1.2, sx + headR * 0.70, headCenterY - headR * 0.1);
                    ctx.closePath(); ctx.fill();
                }
            }

            // Row 1 (far row)
            const r1HeadY = height * 0.35, r1HeadR = height * 0.032, r1Spread = 0.55;
            for (let si = 0; si < 5; si++) {
                const sn = (si + 0.5) / 5;
                const sx = width * 0.5 + (sn - 0.5) * width * r1Spread;
                const seed = si;
                const hc = ["#2a1f15", "#3a2a20", "#4a3525", "#1e1e1e", "#352515"][seed % 5];
                const sc2 = ["#6a8aaa", "#8a6a6a", "#6a8a6a", "#8a7a5a", "#7a6a8a"][(seed + 2) % 5];
                drawStudentBack(sx, r1HeadY, r1HeadR, hc, sc2, seed % 3 === 0);
            }

            // Row 2 (directly in front)
            const r2HeadY = height * 0.46, r2HeadR = height * 0.052, r2Spread = 0.72;
            for (let si = 0; si < 5; si++) {
                const sn = (si + 0.5) / 5;
                const sx = width * 0.5 + (sn - 0.5) * width * r2Spread;
                const seed = si + 10;
                const hc = ["#352515", "#2a1f15", "#1e1e1e", "#3a2a20", "#4a3525"][seed % 5];
                const sc2 = ["#7a6a8a", "#6a8aaa", "#8a7a5a", "#6a8a6a", "#8a6a6a"][(seed + 1) % 5];
                drawStudentBack(sx, r2HeadY, r2HeadR, hc, sc2, seed % 3 === 1);
            }

            // ============ 12. PLAYER'S DESK ============
            const myY = height * 0.78;
            const myW = width * 0.56;
            // Desk surface
            ctx.fillStyle = "#c8b48c";
            ctx.beginPath();
            ctx.moveTo(vpX - myW * 0.5, myY); ctx.lineTo(vpX + myW * 0.5, myY);
            ctx.lineTo(vpX + myW * 0.54, myY + 10); ctx.lineTo(vpX - myW * 0.54, myY + 10);
            ctx.closePath(); ctx.fill();
            ctx.strokeStyle = "rgba(255,255,255,0.3)"; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(vpX - myW * 0.5, myY); ctx.lineTo(vpX + myW * 0.5, myY); ctx.stroke();
            // Front face
            ctx.fillStyle = "#b5a078";
            ctx.beginPath();
            ctx.moveTo(vpX - myW * 0.54, myY + 10); ctx.lineTo(vpX + myW * 0.54, myY + 10);
            ctx.lineTo(vpX + myW * 0.58, height); ctx.lineTo(vpX - myW * 0.58, height);
            ctx.closePath(); ctx.fill();
            // Pencil groove
            ctx.strokeStyle = "rgba(0,0,0,0.05)"; ctx.lineWidth = 0.8;
            ctx.beginPath(); ctx.moveTo(vpX - myW * 0.42, myY + 5); ctx.lineTo(vpX + myW * 0.42, myY + 5); ctx.stroke();
            // Notebook
            ctx.save(); ctx.translate(vpX - width * 0.05, myY - 26); ctx.rotate(-0.04);
            ctx.fillStyle = "#f5f0e0";
            const nbW2 = width * 0.14, nbH2 = height * 0.085;
            ctx.fillRect(-nbW2 / 2, -nbH2 / 2, nbW2, nbH2);
            ctx.strokeStyle = "rgba(170,155,125,0.4)"; ctx.lineWidth = 0.8; ctx.strokeRect(-nbW2 / 2, -nbH2 / 2, nbW2, nbH2);
            ctx.strokeStyle = "rgba(220,80,80,0.25)"; ctx.lineWidth = 0.6;
            ctx.beginPath(); ctx.moveTo(-nbW2 / 2 + nbW2 * 0.12, -nbH2 / 2); ctx.lineTo(-nbW2 / 2 + nbW2 * 0.12, nbH2 / 2); ctx.stroke();
            ctx.strokeStyle = "rgba(160,200,220,0.22)";
            for (let li = 1; li < 6; li++) { const ly = -nbH2 / 2 + li * (nbH2 / 6); ctx.beginPath(); ctx.moveTo(-nbW2 / 2 + 6, ly); ctx.lineTo(nbW2 / 2 - 6, ly); ctx.stroke(); }
            ctx.restore();
            // Pencil
            ctx.save(); ctx.translate(vpX + width * 0.08, myY - 20); ctx.rotate(0.06);
            const pL = width * 0.09;
            ctx.fillStyle = "#e8c84a"; ctx.fillRect(0, 0, pL, 4);
            ctx.fillStyle = "#f4d88a"; ctx.fillRect(0, 0, pL, 2);
            ctx.fillStyle = "#333"; ctx.beginPath(); ctx.moveTo(pL, 0); ctx.lineTo(pL + 6, 2); ctx.lineTo(pL, 4); ctx.closePath(); ctx.fill();
            ctx.fillStyle = "#e89090"; ctx.fillRect(-8, 0, 8, 4);
            ctx.fillStyle = "#ccc"; ctx.fillRect(-9, 0, 1.5, 4);
            ctx.restore();
            // Textbook
            ctx.save(); ctx.translate(vpX + width * 0.17, myY - 18); ctx.rotate(0.02);
            ctx.fillStyle = "#88b8d8"; ctx.fillRect(0, 0, width * 0.065, height * 0.055);
            ctx.strokeStyle = "rgba(0,0,0,0.1)"; ctx.lineWidth = 0.5; ctx.strokeRect(0, 0, width * 0.065, height * 0.055);
            ctx.fillStyle = "#fff"; ctx.font = `700 ${Math.round(height * 0.011)}px 'Zen Maru Gothic'`;
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText("\u304A\u3093\u304C\u304F", width * 0.0325, height * 0.0275);
            ctx.restore();

            // ============ 13. ROW 3 NEIGHBORS ============
            drawStudentBack(width * 0.13, height * 0.50, height * 0.072, "#3a2a20", "#7a8a6a", true);
            drawStudentBack(width * 0.87, height * 0.51, height * 0.072, "#1e1e1e", "#8a7070", false);

            // ============ 14. DUST MOTES ============
            for (const m of lessonDustMotes) {
                m.x += m.drift; m.y -= m.speed;
                m.phase += 0.015;
                if (m.y < -10) { m.y = height * 0.55; m.x = Math.random() * width * 0.45; }
                if (m.x < 0 || m.x > width * 0.5) m.x = Math.random() * width * 0.45;
                const mx2 = m.x + Math.sin(m.phase) * 6;
                const my2 = m.y + Math.cos(m.phase * 0.7) * 3;
                ctx.fillStyle = `rgba(255,248,215,${m.alpha * (0.5 + 0.5 * Math.sin(m.phase * 1.5))})`;
                ctx.beginPath(); ctx.arc(mx2, my2, m.size, 0, Math.PI * 2); ctx.fill();
            }

            // === 12. White fade-out overlay (after 5 seconds, over 3 seconds) ===
            if (elapsed > LESSON_ANIM_MS) {
                const fadeT = Math.min((elapsed - LESSON_ANIM_MS) / LESSON_FADE_MS, 1);
                // Ease-in-out for smooth fade
                const easedFade = fadeT < 0.5
                    ? 2 * fadeT * fadeT
                    : 1 - Math.pow(-2 * fadeT + 2, 2) / 2;
                ctx.fillStyle = `rgba(255, 255, 255, ${easedFade})`;
                ctx.fillRect(0, 0, width, height);
            }

            // === 13. Transition to Adult phase after lesson completes ===
            if (elapsed >= LESSON_ANIM_MS + LESSON_FADE_MS && !lessonTransitioned) {
                lessonTransitioned = true;
                const sceneFade = document.getElementById('scene-fade');
                sceneFade.style.transition = 'none';
                sceneFade.style.opacity = '1';
                requestAnimationFrame(() => {
                    startAdultPhase();
                    sceneFade.style.transition = 'opacity 1500ms ease';
                    sceneFade.style.opacity = '0';
                });
            }
        }

        // ======== ADULT PHASE (大人フェーズ) ========
        const ADULT_ACTIVITIES = [
            { id: "university", name: "大学", bassStyle: "contemplative", guitarStyle: "fingerpicking",
              color: "hsl(220, 55%, 60%)", worldFraction: [0.04, 0.16],
              labels: { study: 3, curious: 2, focused: 1 } },
            { id: "parttime", name: "アルバイト", bassStyle: "groovy", guitarStyle: "cutting",
              color: "hsl(35, 60%, 58%)", worldFraction: [0.20, 0.34],
              labels: { resilient: 3, social: 2, patient: 1 } },
            { id: "jobhunt", name: "就活", bassStyle: "soft", guitarStyle: "clean-electric",
              color: "hsl(0, 0%, 55%)", worldFraction: [0.40, 0.54],
              labels: { focused: 3, cautious: 2, resilient: 1 } },
            { id: "travel", name: "旅", bassStyle: "melodic", guitarStyle: "acoustic-arpeggio",
              color: "hsl(170, 50%, 55%)", worldFraction: [0.60, 0.74],
              labels: { adventurous: 3, curious: 2, optimistic: 1 } },
            { id: "startup", name: "起業", bassStyle: "energetic", guitarStyle: "rock",
              color: "hsl(45, 70%, 55%)", worldFraction: [0.80, 0.94],
              labels: { creative: 3, adventurous: 2, expressive: 1 } }
        ];

        let adultBuildingSeeds = [];

        function startAdultPhase() {
            currentScene = SCENE.ADULT;
            worldWidth = Math.max(width * 3.2, 2800);
            baby = new Child(babyColorScheme);
            baby.x = worldWidth * 0.5;

            // Generate building seeds for consistent cityscape (avoid activity zones)
            adultBuildingSeeds = [];
            const actZones = ADULT_ACTIVITIES.map(a => [(a.worldFraction[0] + a.worldFraction[1]) / 2 - (a.worldFraction[1] - a.worldFraction[0]) * 0.42,
                                                         (a.worldFraction[0] + a.worldFraction[1]) / 2 + (a.worldFraction[1] - a.worldFraction[0]) * 0.42]);
            for (let i = 0; i < 40; i++) {
                const xf = i / 40 + (Math.random() - 0.5) * 0.01;
                const inActivityZone = actZones.some(z => xf >= z[0] && xf <= z[1]);
                adultBuildingSeeds.push({
                    xFrac: xf,
                    w: 0.015 + Math.random() * 0.025,
                    h: inActivityZone ? 0.08 + Math.random() * 0.15 : 0.15 + Math.random() * 0.35,
                    color: `hsl(${210 + Math.random() * 30}, ${10 + Math.random() * 15}%, ${55 + Math.random() * 20}%)`,
                    windowRows: 3 + Math.floor(Math.random() * 8),
                    windowCols: 2 + Math.floor(Math.random() * 3),
                    windowLit: Array.from({ length: 30 }, () => Math.random() > 0.35)
                });
            }

            initAdultDrops();
            initCarryHatLayer();
            initCarrySnareLayer();
            initCarryCymbalLayer();
            disposeCarryChordLayer();
            initCarryBassLayer();
            startBaseGroove();
            buildScoreHud();
            updateScoreToggleUi();
            orbWorldX = baby.x;
            orbWorldY = height * ROOM_WALL_RATIO + TONE_FLOOR_OFFSET;
            orbParticles = [];
        }

        function initAdultDrops() {
            disposeToneDrops();
            toneDrops = [];
            if (!baseRhythmInfo || !inheritedChordProgression) return;

            const floorY = height * ROOM_WALL_RATIO + TONE_FLOOR_OFFSET;
            const BASS_TIMBRES = {
                energetic:     { osc: "sawtooth", attack: 0.01, decay: 0.15, sustain: 0.35, release: 0.25, filterBase: 150, filterOct: 3 },
                soft:          { osc: "sine",     attack: 0.06, decay: 0.5,  sustain: 0.5,  release: 0.8,  filterBase: 80,  filterOct: 1.5 },
                contemplative: { osc: "sine",     attack: 0.08, decay: 0.6,  sustain: 0.6,  release: 1.2,  filterBase: 60,  filterOct: 1.2 },
                groovy:        { osc: "triangle", attack: 0.01, decay: 0.2,  sustain: 0.3,  release: 0.3,  filterBase: 130, filterOct: 2.5 },
                melodic:       { osc: "sine",     attack: 0.03, decay: 0.35, sustain: 0.45, release: 0.6,  filterBase: 100, filterOct: 2 }
            };

            for (let i = 0; i < ADULT_ACTIVITIES.length; i++) {
                const act = ADULT_ACTIVITIES[i];
                const bassVariant = randInt(0, 1);
                const bassBundle = buildBassLine(baseRhythmInfo, act.bassStyle, inheritedChordProgression, bassVariant);

                const timbre = BASS_TIMBRES[act.bassStyle] || BASS_TIMBRES.soft;
                const bassSynth = new Tone.MonoSynth({
                    oscillator: { type: timbre.osc },
                    envelope: { attack: timbre.attack, decay: timbre.decay, sustain: timbre.sustain, release: timbre.release },
                    filterEnvelope: {
                        attack: timbre.attack * 0.5, decay: timbre.decay, sustain: timbre.sustain, release: timbre.release,
                        baseFrequency: timbre.filterBase, octaves: timbre.filterOct
                    },
                    volume: -100
                }).toDestination();

                // Guitar layer
                const guitarVariant = randInt(0, 1);
                const guitarBundle = act.guitarStyle
                    ? buildGuitarLine(baseRhythmInfo, act.guitarStyle, inheritedChordProgression, guitarVariant)
                    : null;
                const guitar = act.guitarStyle ? createGuitarSynth(act.guitarStyle) : { synth: null, effects: [] };

                const minX = worldWidth * act.worldFraction[0];
                const maxX = worldWidth * act.worldFraction[1];
                const cx = minX + (maxX - minX) * 0.5;

                // Merge bass + guitar patterns so tick loop processes guitar-only steps too
                const mergedPattern = bassBundle.pattern.slice();
                if (guitarBundle) {
                    for (let s = 0; s < mergedPattern.length; s++) {
                        if (guitarBundle.pattern[s]) mergedPattern[s] = true;
                    }
                }

                toneDrops.push({
                    x: cx,
                    y: floorY + (i % 2 === 0 ? -8 : 8),
                    pattern: mergedPattern,
                    bassNotes: bassBundle.notes,
                    bassAttacks: bassBundle.attacks,
                    bassDurations: bassBundle.durations,
                    bassSustainType: bassBundle.sustainType,
                    velocityPattern: null,
                    proximityVol: -100,
                    isHovered: false,
                    overlapAlpha: 0,
                    instrument: "bass",
                    bassSynth,
                    bassStyle: act.bassStyle,
                    bassVariant,
                    guitarSynth: guitar.synth,
                    guitarEffects: guitar.effects,
                    guitarNotes: guitarBundle ? guitarBundle.notes : null,
                    guitarAttacks: guitarBundle ? guitarBundle.attacks : null,
                    guitarDurations: guitarBundle ? guitarBundle.durations : null,
                    activityId: act.id,
                    activityName: act.name,
                    dropColor: act.color,
                    activityLabels: act.labels,
                    ripples: []
                });
            }
            primeToneDrops();
        }

        function drawActivityBuildings(wallH) {
            for (let i = 0; i < ADULT_ACTIVITIES.length; i++) {
                const act = ADULT_ACTIVITIES[i];
                const cx = worldWidth * (act.worldFraction[0] + act.worldFraction[1]) / 2;
                const zoneW = worldWidth * (act.worldFraction[1] - act.worldFraction[0]);
                const bw = zoneW * 0.80;
                const bx = cx - bw / 2;

                if (act.id === "university") {
                    // Large campus building: wide 2-story with columns, triangular pediment, clock
                    const bh = wallH * 0.55;
                    const by = wallH - bh;
                    // Main body
                    ctx.fillStyle = "#d4c9a8";
                    ctx.fillRect(bx, by, bw, bh);
                    // Darker base
                    ctx.fillStyle = "#b8ad8e";
                    ctx.fillRect(bx, by + bh * 0.6, bw, bh * 0.4);
                    // Triangular pediment
                    ctx.fillStyle = "#c4b998";
                    ctx.beginPath();
                    ctx.moveTo(bx + bw * 0.15, by);
                    ctx.lineTo(cx, by - bh * 0.18);
                    ctx.lineTo(bx + bw * 0.85, by);
                    ctx.closePath();
                    ctx.fill();
                    ctx.strokeStyle = "#a09070";
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                    // Columns
                    const colCount = 6;
                    for (let c = 0; c < colCount; c++) {
                        const colX = bx + bw * 0.18 + (c / (colCount - 1)) * bw * 0.64;
                        ctx.fillStyle = "#e8e0cc";
                        ctx.fillRect(colX - 3, by, 6, bh * 0.6);
                        ctx.fillStyle = "#c0b090";
                        ctx.fillRect(colX - 5, by, 10, 4);
                        ctx.fillRect(colX - 5, by + bh * 0.6 - 4, 10, 4);
                    }
                    // Clock
                    ctx.fillStyle = "#fff";
                    ctx.beginPath(); ctx.arc(cx, by + bh * 0.12, 12, 0, Math.PI * 2); ctx.fill();
                    ctx.strokeStyle = "#555";
                    ctx.lineWidth = 1.5;
                    ctx.beginPath(); ctx.arc(cx, by + bh * 0.12, 12, 0, Math.PI * 2); ctx.stroke();
                    ctx.strokeStyle = "#333";
                    ctx.lineWidth = 1.2;
                    ctx.beginPath(); ctx.moveTo(cx, by + bh * 0.12); ctx.lineTo(cx, by + bh * 0.12 - 8); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(cx, by + bh * 0.12); ctx.lineTo(cx + 5, by + bh * 0.12); ctx.stroke();
                    // Windows (rows)
                    for (let r = 0; r < 2; r++) {
                        for (let c = 0; c < 8; c++) {
                            const wx = bx + bw * 0.1 + c * (bw * 0.8 / 8) + 4;
                            const wy = by + bh * 0.25 + r * bh * 0.28;
                            ctx.fillStyle = "rgba(140,180,210,0.5)";
                            ctx.fillRect(wx, wy, bw * 0.07, bh * 0.15);
                            ctx.strokeStyle = "#a09070";
                            ctx.lineWidth = 0.8;
                            ctx.strokeRect(wx, wy, bw * 0.07, bh * 0.15);
                        }
                    }
                    // 「大学」 sign
                    ctx.fillStyle = "rgba(80,60,40,0.8)";
                    ctx.beginPath(); ctx.roundRect(cx - 30, by + bh * 0.02, 60, 18, 3); ctx.fill();
                    ctx.fillStyle = "#fff";
                    ctx.font = "bold 11px 'Zen Maru Gothic'";
                    ctx.textAlign = "center"; ctx.textBaseline = "middle";
                    ctx.fillText("大学", cx, by + bh * 0.02 + 9);
                    // Trees
                    for (const tx of [bx + 12, bx + bw - 12]) {
                        ctx.fillStyle = "#5a3a20";
                        ctx.fillRect(tx - 2, wallH - 20, 4, 20);
                        ctx.fillStyle = "#4a9a4a";
                        ctx.beginPath(); ctx.arc(tx, wallH - 28, 12, 0, Math.PI * 2); ctx.fill();
                        ctx.fillStyle = "#3a8a3a";
                        ctx.beginPath(); ctx.arc(tx - 3, wallH - 25, 8, 0, Math.PI * 2); ctx.fill();
                    }

                } else if (act.id === "parttime") {
                    // Convenience store / cafe: glass storefront, awning
                    const bh = wallH * 0.38;
                    const by = wallH - bh;
                    // Main body
                    ctx.fillStyle = "#e8e0d0";
                    ctx.fillRect(bx, by, bw, bh);
                    // Awning
                    ctx.fillStyle = "#d45050";
                    ctx.beginPath();
                    ctx.moveTo(bx, by + bh * 0.3);
                    ctx.lineTo(bx - 8, by + bh * 0.38);
                    ctx.lineTo(bx + bw + 8, by + bh * 0.38);
                    ctx.lineTo(bx + bw, by + bh * 0.3);
                    ctx.closePath();
                    ctx.fill();
                    // Awning stripes
                    ctx.fillStyle = "#fff";
                    for (let s = 0; s < 8; s += 2) {
                        const sx1 = bx + (s / 8) * bw;
                        const sx2 = bx + ((s + 1) / 8) * bw;
                        ctx.beginPath();
                        ctx.moveTo(sx1, by + bh * 0.3);
                        ctx.lineTo(sx1 - 1, by + bh * 0.38);
                        ctx.lineTo(sx2 + 1, by + bh * 0.38);
                        ctx.lineTo(sx2, by + bh * 0.3);
                        ctx.closePath();
                        ctx.fill();
                    }
                    // Large glass storefront
                    ctx.fillStyle = "rgba(160,210,230,0.6)";
                    ctx.fillRect(bx + bw * 0.08, by + bh * 0.42, bw * 0.55, bh * 0.5);
                    ctx.strokeStyle = "#888";
                    ctx.lineWidth = 1;
                    ctx.strokeRect(bx + bw * 0.08, by + bh * 0.42, bw * 0.55, bh * 0.5);
                    // Door
                    ctx.fillStyle = "rgba(140,190,210,0.7)";
                    ctx.fillRect(bx + bw * 0.68, by + bh * 0.42, bw * 0.18, bh * 0.5);
                    ctx.strokeStyle = "#888";
                    ctx.strokeRect(bx + bw * 0.68, by + bh * 0.42, bw * 0.18, bh * 0.5);
                    // 「OPEN」 sign
                    ctx.fillStyle = "#2a8a2a";
                    ctx.beginPath(); ctx.roundRect(cx - 18, by + bh * 0.12, 36, 14, 3); ctx.fill();
                    ctx.fillStyle = "#fff";
                    ctx.font = "bold 9px sans-serif";
                    ctx.textAlign = "center"; ctx.textBaseline = "middle";
                    ctx.fillText("OPEN", cx, by + bh * 0.12 + 7);
                    // Vending machine
                    const vmx = bx + bw * 0.9;
                    ctx.fillStyle = "#3060c0";
                    ctx.fillRect(vmx, wallH - bh * 0.45, bw * 0.08, bh * 0.45);
                    ctx.fillStyle = "rgba(200,230,255,0.5)";
                    ctx.fillRect(vmx + 2, wallH - bh * 0.4, bw * 0.08 - 4, bh * 0.25);
                    // Bike rack
                    ctx.strokeStyle = "#888";
                    ctx.lineWidth = 1.5;
                    for (let b2 = 0; b2 < 3; b2++) {
                        const bkx = bx - 15 + b2 * 10;
                        ctx.beginPath(); ctx.arc(bkx, wallH - 8, 6, 0, Math.PI * 2); ctx.stroke();
                    }

                } else if (act.id === "jobhunt") {
                    // Corporate office tower: tall glass skyscraper
                    const bh = wallH * 0.78;
                    const by = wallH - bh;
                    const towerW = bw * 0.5;
                    const towerX = cx - towerW / 2;
                    // Main tower
                    ctx.fillStyle = "#8aa8c0";
                    ctx.fillRect(towerX, by, towerW, bh);
                    // Glass panels
                    for (let r = 0; r < 12; r++) {
                        for (let c = 0; c < 4; c++) {
                            const px = towerX + 4 + c * (towerW - 8) / 4;
                            const py = by + 6 + r * (bh - 12) / 12;
                            const pw = (towerW - 16) / 4;
                            const ph = (bh - 24) / 12 - 2;
                            ctx.fillStyle = `rgba(170,210,240,${0.4 + (r % 3) * 0.1})`;
                            ctx.fillRect(px, py, pw, ph);
                            ctx.strokeStyle = "rgba(100,140,170,0.4)";
                            ctx.lineWidth = 0.5;
                            ctx.strokeRect(px, py, pw, ph);
                        }
                    }
                    // Left reflection highlight
                    ctx.fillStyle = "rgba(255,255,255,0.08)";
                    ctx.fillRect(towerX, by, towerW * 0.2, bh);
                    // Entrance
                    ctx.fillStyle = "#556";
                    ctx.fillRect(cx - 12, wallH - 20, 24, 20);
                    ctx.fillStyle = "rgba(180,210,230,0.6)";
                    ctx.fillRect(cx - 10, wallH - 18, 9, 18);
                    ctx.fillRect(cx + 1, wallH - 18, 9, 18);
                    // 「株式会社」 sign
                    ctx.fillStyle = "rgba(40,50,70,0.85)";
                    ctx.beginPath(); ctx.roundRect(cx - 32, by + 12, 64, 16, 2); ctx.fill();
                    ctx.fillStyle = "#dde";
                    ctx.font = "bold 9px 'Zen Maru Gothic'";
                    ctx.textAlign = "center"; ctx.textBaseline = "middle";
                    ctx.fillText("株式会社", cx, by + 20);
                    // Side wings
                    ctx.fillStyle = "#97b0c4";
                    ctx.fillRect(towerX - bw * 0.18, wallH - bh * 0.35, bw * 0.18, bh * 0.35);
                    ctx.fillRect(towerX + towerW, wallH - bh * 0.35, bw * 0.18, bh * 0.35);

                } else if (act.id === "travel") {
                    // Train station / terminal: arched roof, large windows
                    const bh = wallH * 0.52;
                    const by = wallH - bh;
                    // Main body
                    ctx.fillStyle = "#c8bfb0";
                    ctx.fillRect(bx, by + bh * 0.15, bw, bh * 0.85);
                    // Arched roof
                    ctx.fillStyle = "#7a8a7a";
                    ctx.beginPath();
                    ctx.moveTo(bx, by + bh * 0.15);
                    ctx.quadraticCurveTo(cx, by - bh * 0.1, bx + bw, by + bh * 0.15);
                    ctx.lineTo(bx + bw, by + bh * 0.2);
                    ctx.quadraticCurveTo(cx, by - bh * 0.03, bx, by + bh * 0.2);
                    ctx.closePath();
                    ctx.fill();
                    // Large windows
                    for (let w = 0; w < 5; w++) {
                        const wx = bx + bw * 0.08 + w * (bw * 0.84 / 5);
                        const ww2 = bw * 0.13;
                        const wh2 = bh * 0.4;
                        const wy = by + bh * 0.25;
                        ctx.fillStyle = "rgba(170,210,230,0.55)";
                        ctx.beginPath();
                        ctx.moveTo(wx, wy + wh2);
                        ctx.lineTo(wx, wy + wh2 * 0.3);
                        ctx.quadraticCurveTo(wx + ww2 / 2, wy, wx + ww2, wy + wh2 * 0.3);
                        ctx.lineTo(wx + ww2, wy + wh2);
                        ctx.closePath();
                        ctx.fill();
                        ctx.strokeStyle = "#8a8a7a";
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                    // Entrance
                    ctx.fillStyle = "#8a7a6a";
                    ctx.fillRect(cx - 18, wallH - 22, 36, 22);
                    ctx.fillStyle = "rgba(160,190,210,0.6)";
                    ctx.fillRect(cx - 15, wallH - 20, 14, 20);
                    ctx.fillRect(cx + 1, wallH - 20, 14, 20);
                    // Departure board
                    ctx.fillStyle = "#222";
                    ctx.fillRect(cx - 22, by + bh * 0.28, 44, 14);
                    ctx.fillStyle = "#ff8";
                    ctx.font = "7px monospace";
                    ctx.textAlign = "center"; ctx.textBaseline = "middle";
                    ctx.fillText("14:05 東京", cx, by + bh * 0.28 + 7);
                    // 「駅」 sign
                    ctx.fillStyle = "rgba(50,60,50,0.85)";
                    ctx.beginPath(); ctx.roundRect(cx - 16, by + bh * 0.08, 32, 16, 2); ctx.fill();
                    ctx.fillStyle = "#fff";
                    ctx.font = "bold 10px 'Zen Maru Gothic'";
                    ctx.textAlign = "center"; ctx.textBaseline = "middle";
                    ctx.fillText("駅", cx, by + bh * 0.08 + 8);
                    // Clock on facade
                    ctx.fillStyle = "#fff";
                    ctx.beginPath(); ctx.arc(cx, by + bh * 0.5, 8, 0, Math.PI * 2); ctx.fill();
                    ctx.strokeStyle = "#555";
                    ctx.lineWidth = 1;
                    ctx.beginPath(); ctx.arc(cx, by + bh * 0.5, 8, 0, Math.PI * 2); ctx.stroke();

                } else if (act.id === "startup") {
                    // Modern co-working space: contemporary design, large windows, rooftop garden
                    const bh = wallH * 0.50;
                    const by = wallH - bh;
                    // Main body (exposed brick look)
                    ctx.fillStyle = "#b85a3a";
                    ctx.fillRect(bx, by, bw, bh);
                    // Brick pattern
                    ctx.strokeStyle = "rgba(80,30,15,0.25)";
                    ctx.lineWidth = 0.5;
                    for (let r = 0; r < Math.floor(bh / 6); r++) {
                        const ry = by + r * 6;
                        ctx.beginPath(); ctx.moveTo(bx, ry); ctx.lineTo(bx + bw, ry); ctx.stroke();
                        const off = (r % 2) * 8;
                        for (let c = off; c < bw; c += 16) {
                            ctx.beginPath(); ctx.moveTo(bx + c, ry); ctx.lineTo(bx + c, ry + 6); ctx.stroke();
                        }
                    }
                    // Large modern windows
                    for (let r = 0; r < 3; r++) {
                        for (let c = 0; c < 4; c++) {
                            const wx = bx + bw * 0.06 + c * (bw * 0.88 / 4);
                            const wy = by + bh * 0.12 + r * bh * 0.28;
                            const ww2 = bw * 0.18;
                            const wh2 = bh * 0.2;
                            ctx.fillStyle = "rgba(160,210,230,0.55)";
                            ctx.fillRect(wx, wy, ww2, wh2);
                            ctx.strokeStyle = "#333";
                            ctx.lineWidth = 1;
                            ctx.strokeRect(wx, wy, ww2, wh2);
                        }
                    }
                    // Rooftop garden
                    ctx.fillStyle = "#5a9a5a";
                    ctx.fillRect(bx + 4, by - 4, bw - 8, 6);
                    for (let p = 0; p < 6; p++) {
                        const px = bx + 10 + p * (bw - 20) / 5;
                        ctx.fillStyle = "#4a8a3a";
                        ctx.beginPath(); ctx.arc(px, by - 6, 5 + Math.random() * 3, 0, Math.PI * 2); ctx.fill();
                    }
                    // Neon 「STARTUP」 sign
                    ctx.fillStyle = "rgba(0,0,0,0.5)";
                    ctx.beginPath(); ctx.roundRect(cx - 36, by + bh * 0.04, 72, 16, 3); ctx.fill();
                    ctx.fillStyle = "#ff6af0";
                    ctx.font = "bold 10px sans-serif";
                    ctx.textAlign = "center"; ctx.textBaseline = "middle";
                    ctx.fillText("STARTUP", cx, by + bh * 0.04 + 8);
                    // Glow effect on sign
                    ctx.save();
                    ctx.shadowColor = "#ff6af0";
                    ctx.shadowBlur = 8;
                    ctx.fillStyle = "#ff6af0";
                    ctx.fillText("STARTUP", cx, by + bh * 0.04 + 8);
                    ctx.restore();
                    // Entrance
                    ctx.fillStyle = "#444";
                    ctx.fillRect(cx - 14, wallH - 18, 28, 18);
                    ctx.fillStyle = "rgba(170,200,220,0.6)";
                    ctx.fillRect(cx - 12, wallH - 16, 11, 16);
                    ctx.fillRect(cx + 1, wallH - 16, 11, 16);
                }
            }
        }

        function drawAdultBackground() {
            const wallH = height * ROOM_WALL_RATIO;

            // === Sky gradient (bright daytime) ===
            const skyG = ctx.createLinearGradient(0, 0, 0, wallH);
            skyG.addColorStop(0, "#4a90d9");
            skyG.addColorStop(0.4, "#7ec8e3");
            skyG.addColorStop(0.7, "#b5e0f0");
            skyG.addColorStop(1, "#e8f4f8");
            ctx.fillStyle = skyG;
            ctx.fillRect(0, 0, worldWidth, wallH);

            // === Clouds ===
            ctx.fillStyle = "rgba(255,255,255,0.7)";
            const clouds = [
                { x: worldWidth * 0.08, y: wallH * 0.12, r: 22 },
                { x: worldWidth * 0.25, y: wallH * 0.08, r: 28 },
                { x: worldWidth * 0.45, y: wallH * 0.15, r: 20 },
                { x: worldWidth * 0.62, y: wallH * 0.06, r: 25 },
                { x: worldWidth * 0.78, y: wallH * 0.13, r: 22 },
                { x: worldWidth * 0.92, y: wallH * 0.09, r: 18 },
            ];
            for (const cl of clouds) {
                ctx.beginPath();
                ctx.arc(cl.x, cl.y, cl.r, 0, Math.PI * 2); ctx.fill();
                ctx.arc(cl.x - cl.r * 0.7, cl.y + 3, cl.r * 0.7, 0, Math.PI * 2); ctx.fill();
                ctx.arc(cl.x + cl.r * 0.8, cl.y + 2, cl.r * 0.65, 0, Math.PI * 2); ctx.fill();
                ctx.arc(cl.x + cl.r * 0.2, cl.y - cl.r * 0.3, cl.r * 0.55, 0, Math.PI * 2); ctx.fill();
            }

            // === Activity-specific buildings (behind generic cityscape) ===
            drawActivityBuildings(wallH);

            // === City buildings (generic skyline) ===
            for (const b of adultBuildingSeeds) {
                const bx = b.xFrac * worldWidth;
                const bw = b.w * worldWidth;
                const bh = b.h * wallH;
                const by = wallH - bh;

                // Building body (daytime palette)
                ctx.fillStyle = b.color;
                ctx.fillRect(bx, by, bw, bh);

                // Building edge highlights
                ctx.fillStyle = "rgba(255,255,255,0.08)";
                ctx.fillRect(bx, by, bw * 0.15, bh);
                ctx.fillStyle = "rgba(0,0,0,0.06)";
                ctx.fillRect(bx + bw * 0.85, by, bw * 0.15, bh);

                // Roof edge
                ctx.fillStyle = "rgba(0,0,0,0.12)";
                ctx.fillRect(bx, by, bw, 3);

                // Windows (reflective glass)
                const winMarginX = bw * 0.12;
                const winMarginY = bh * 0.06;
                const winAreaW = bw - winMarginX * 2;
                const winAreaH = bh - winMarginY * 2;
                const rows = b.windowRows;
                const cols = b.windowCols;
                const ww = winAreaW / cols * 0.55;
                const wh = winAreaH / rows * 0.45;

                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        const wx = bx + winMarginX + (c / cols) * winAreaW + (winAreaW / cols - ww) / 2;
                        const wy = by + winMarginY + (r / rows) * winAreaH + (winAreaH / rows - wh) / 2;
                        const litIdx = r * cols + c;
                        if (b.windowLit[litIdx % b.windowLit.length]) {
                            ctx.fillStyle = `rgba(140,190,220,${0.35 + Math.random() * 0.2})`;
                        } else {
                            ctx.fillStyle = "rgba(120,160,190,0.25)";
                        }
                        ctx.fillRect(wx, wy, ww, wh);
                    }
                }
            }

            // === Ground / Street ===
            const groundY = wallH;
            const groundH = height - wallH;

            // Sidewalk (lighter daytime)
            const sidewalkG = ctx.createLinearGradient(0, groundY, 0, groundY + groundH);
            sidewalkG.addColorStop(0, "#a0a0a0");
            sidewalkG.addColorStop(0.15, "#b0b0b0");
            sidewalkG.addColorStop(0.3, "#a8a8a8");
            sidewalkG.addColorStop(1, "#959595");
            ctx.fillStyle = sidewalkG;
            ctx.fillRect(0, groundY, worldWidth, groundH);

            // Road lane line
            ctx.strokeStyle = "rgba(255,255,255,0.25)";
            ctx.lineWidth = 2;
            ctx.setLineDash([20, 15]);
            ctx.beginPath();
            ctx.moveTo(0, groundY + groundH * 0.5);
            ctx.lineTo(worldWidth, groundY + groundH * 0.5);
            ctx.stroke();
            ctx.setLineDash([]);

            // Sidewalk edge / curb
            ctx.fillStyle = "rgba(180,180,180,0.35)";
            ctx.fillRect(0, groundY, worldWidth, 4);

            // === Street lamps (no glow in daytime) ===
            const lampSpacing = worldWidth / 10;
            for (let i = 0; i < 10; i++) {
                const lx = lampSpacing * (i + 0.5);
                const poleH = wallH * 0.25;

                // Pole
                ctx.fillStyle = "#666";
                ctx.fillRect(lx - 2, groundY - poleH, 4, poleH);

                // Arm
                ctx.fillStyle = "#666";
                ctx.fillRect(lx - 1, groundY - poleH, 14, 3);

                // Lamp head (no glow)
                ctx.fillStyle = "#bbb";
                ctx.beginPath(); ctx.arc(lx + 12, groundY - poleH + 2, 4, 0, Math.PI * 2); ctx.fill();
            }

            // === Activity signs ===
            for (let i = 0; i < ADULT_ACTIVITIES.length; i++) {
                const act = ADULT_ACTIVITIES[i];
                const signX = worldWidth * (act.worldFraction[0] + act.worldFraction[1]) / 2;
                const signY = groundY - 30;
                const signW = 70;
                const signH = 24;

                // Sign background
                ctx.fillStyle = "rgba(40,40,60,0.7)";
                ctx.beginPath(); ctx.roundRect(signX - signW / 2, signY - signH / 2, signW, signH, 4); ctx.fill();
                ctx.strokeStyle = act.color;
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.roundRect(signX - signW / 2, signY - signH / 2, signW, signH, 4); ctx.stroke();

                // Sign text
                ctx.fillStyle = "#fff";
                ctx.font = "700 11px 'Zen Maru Gothic'";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(act.name, signX, signY);

                // Sign pole
                ctx.fillStyle = "#666";
                ctx.fillRect(signX - 1.5, signY + signH / 2, 3, 30 - signH / 2);
            }
        }

        function drawSchoolBackground() {
            ensureSchoolBgObjects();
            updateSchoolNpcs();
            const wallH = height * ROOM_WALL_RATIO;
            const hallEnd = worldWidth * 0.60;
            const classStart = hallEnd;
            const charH = 120;
            const doorH = charH;
            const doorW = 58;
            const deskH = 8;
            const deskTopFromFloor = 48;
            const deskW = 55;
            const lockerH = charH * 0.85;
            const lockerW = 40;
            const hov = hoveredSchoolActivity;
            const t = performance.now() * 0.001;

            // Helper: activity glow overlay
            const glowFor = (actId, cx, cy, radius) => {
                if (hov !== actId) return;
                const pulse = 0.5 + Math.sin(t * 4) * 0.2;
                const act = SCHOOL_ACTIVITIES.find(a => a.id === actId);
                const col = act ? act.color : "hsl(50,80%,70%)";
                const g = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius);
                g.addColorStop(0, col.replace(')', `, ${0.35 * pulse})`).replace('hsl(', 'hsla('));
                g.addColorStop(0.6, col.replace(')', `, ${0.15 * pulse})`).replace('hsl(', 'hsla('));
                g.addColorStop(1, "rgba(255,255,255,0)");
                ctx.fillStyle = g;
                ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.fill();
            };
            // Helper: hover border glow on rect
            const glowRectFor = (actId, rx, ry, rw, rh, rad) => {
                if (hov !== actId) return;
                const pulse = 0.6 + Math.sin(t * 4) * 0.25;
                const act = SCHOOL_ACTIVITIES.find(a => a.id === actId);
                const col = act ? act.color : "hsl(50,80%,70%)";
                ctx.save();
                ctx.shadowColor = col;
                ctx.shadowBlur = 18 + pulse * 14;
                ctx.strokeStyle = col.replace(')', `, ${0.7 * pulse})`).replace('hsl(', 'hsla(');
                ctx.lineWidth = 3;
                ctx.beginPath(); ctx.roundRect(rx - 2, ry - 2, rw + 4, rh + 4, rad || 6); ctx.stroke();
                ctx.restore();
            };

            // ========== HALLWAY (left 48%) ==========
            // Wall gradient
            const hallWallG = ctx.createLinearGradient(0, 0, 0, wallH);
            hallWallG.addColorStop(0, "#f5f3ef");
            hallWallG.addColorStop(0.4, "#f0ebe3");
            hallWallG.addColorStop(1, "#e8e0d5");
            ctx.fillStyle = hallWallG;
            ctx.fillRect(0, 0, hallEnd, wallH);

            // Wainscoting (more detailed)
            const wainH = wallH * 0.38;
            const wainY = wallH - wainH;
            const wainG = ctx.createLinearGradient(0, wainY, 0, wallH);
            wainG.addColorStop(0, "rgba(210, 200, 185, 0.55)");
            wainG.addColorStop(0.5, "rgba(218, 210, 195, 0.5)");
            wainG.addColorStop(1, "rgba(200, 190, 175, 0.6)");
            ctx.fillStyle = wainG;
            ctx.fillRect(0, wainY, hallEnd, wainH);
            // Wainscot top molding
            ctx.fillStyle = "rgba(185, 175, 158, 0.55)";
            ctx.fillRect(0, wainY, hallEnd, 5);
            ctx.fillStyle = "rgba(225, 218, 205, 0.4)";
            ctx.fillRect(0, wainY + 5, hallEnd, 2);
            // Wainscot panel lines
            ctx.strokeStyle = "rgba(180, 170, 155, 0.15)";
            ctx.lineWidth = 1;
            for (let px = 80; px < hallEnd; px += 120) {
                ctx.beginPath(); ctx.moveTo(px, wainY + 12); ctx.lineTo(px, wallH - 14); ctx.stroke();
            }
            // Baseboard
            ctx.fillStyle = "rgba(160, 150, 135, 0.65)";
            ctx.fillRect(0, wallH - 12, hallEnd, 12);
            ctx.fillStyle = "rgba(175, 165, 148, 0.5)";
            ctx.fillRect(0, wallH - 14, hallEnd, 3);

            // Crown molding (top)
            ctx.fillStyle = "rgba(230, 225, 215, 0.5)";
            ctx.fillRect(0, 0, hallEnd, 6);
            ctx.fillStyle = "rgba(200, 192, 180, 0.3)";
            ctx.fillRect(0, 6, hallEnd, 3);

            // Ceiling fluorescent lights
            for (let lx = 120; lx < hallEnd; lx += 280) {
                // Light fixture body
                ctx.fillStyle = "rgba(220, 225, 230, 0.6)";
                ctx.beginPath(); ctx.roundRect(lx - 55, 2, 110, 8, 2); ctx.fill();
                // Light tube
                ctx.fillStyle = "rgba(245, 248, 255, 0.75)";
                ctx.beginPath(); ctx.roundRect(lx - 48, 6, 96, 12, 3); ctx.fill();
                ctx.strokeStyle = "rgba(200, 205, 215, 0.4)";
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.roundRect(lx - 48, 6, 96, 12, 3); ctx.stroke();
                // Glow cone
                const glow = ctx.createRadialGradient(lx, 16, 8, lx, 50, 150);
                glow.addColorStop(0, "rgba(255, 255, 248, 0.16)");
                glow.addColorStop(0.5, "rgba(255, 255, 248, 0.05)");
                glow.addColorStop(1, "rgba(255, 255, 248, 0)");
                ctx.fillStyle = glow;
                ctx.fillRect(lx - 150, 10, 300, 150);
            }

            // === 3 Hallway Doors (improved with through-window scenes) ===
            const drawDoor = (cx, label, doorColor, windowColor, actId, windowScene) => {
                const dY = wallH - doorH;
                const isGlowing = hov === actId;

                // Glow behind door when hovered
                if (isGlowing) glowFor(actId, cx, wallH - doorH / 2, 90);

                // Door shadow
                ctx.fillStyle = "rgba(0,0,0,0.06)";
                ctx.beginPath(); ctx.roundRect(cx - doorW / 2 + 3, dY + 4, doorW, doorH, [6,6,0,0]); ctx.fill();

                // Door body
                const dG = ctx.createLinearGradient(cx - doorW / 2, 0, cx + doorW / 2, 0);
                dG.addColorStop(0, doorColor);
                dG.addColorStop(0.5, doorColor.replace(/\)/, ', 0.9)').replace('rgb(', 'rgba('));
                dG.addColorStop(1, doorColor);
                ctx.fillStyle = doorColor;
                ctx.beginPath(); ctx.roundRect(cx - doorW / 2, dY, doorW, doorH, [6,6,0,0]); ctx.fill();

                // Door panels (raised panel effect)
                ctx.strokeStyle = "rgba(255,255,255,0.12)";
                ctx.lineWidth = 1;
                ctx.beginPath(); ctx.roundRect(cx - doorW / 2 + 5, dY + 58, doorW - 10, doorH - 66, 3); ctx.stroke();

                // Door frame
                ctx.strokeStyle = "rgba(80, 70, 55, 0.5)";
                ctx.lineWidth = 4;
                ctx.beginPath(); ctx.roundRect(cx - doorW / 2 - 2, dY - 2, doorW + 4, doorH + 2, [7,7,0,0]); ctx.stroke();
                ctx.strokeStyle = "rgba(140, 125, 105, 0.35)";
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.roundRect(cx - doorW / 2 + 1, dY + 1, doorW - 2, doorH - 1, [5,5,0,0]); ctx.stroke();

                // Window on door (larger, with scene inside)
                const winX = cx - 16, winY = dY + 12, winW = 32, winH = 40;
                ctx.fillStyle = windowColor;
                ctx.beginPath(); ctx.roundRect(winX, winY, winW, winH, 4); ctx.fill();
                // Window scene
                if (windowScene === "sports") {
                    // Green field & blue sky
                    ctx.fillStyle = "rgba(130, 200, 240, 0.6)";
                    ctx.beginPath(); ctx.roundRect(winX + 2, winY + 2, winW - 4, winH * 0.4, [3,3,0,0]); ctx.fill();
                    ctx.fillStyle = "rgba(80, 170, 80, 0.5)";
                    ctx.beginPath(); ctx.roundRect(winX + 2, winY + winH * 0.4, winW - 4, winH * 0.6 - 2, [0,0,3,3]); ctx.fill();
                    // Goal post
                    ctx.strokeStyle = "rgba(255,255,255,0.5)";
                    ctx.lineWidth = 1.5;
                    ctx.beginPath(); ctx.moveTo(winX + 10, winY + winH * 0.35);
                    ctx.lineTo(winX + 10, winY + winH * 0.6);
                    ctx.lineTo(winX + 22, winY + winH * 0.6);
                    ctx.lineTo(winX + 22, winY + winH * 0.35);
                    ctx.lineTo(winX + 10, winY + winH * 0.35); ctx.stroke();
                } else if (windowScene === "library") {
                    // Warm light & bookshelves
                    ctx.fillStyle = "rgba(245, 235, 210, 0.5)";
                    ctx.beginPath(); ctx.roundRect(winX + 2, winY + 2, winW - 4, winH - 4, 3); ctx.fill();
                    for (let sh = 0; sh < 3; sh++) {
                        const sy = winY + 8 + sh * 12;
                        ctx.fillStyle = "rgba(140, 100, 60, 0.4)";
                        ctx.fillRect(winX + 5, sy, winW - 10, 2);
                        // Mini books
                        const bkCols = ["rgba(180,60,60,0.5)", "rgba(60,100,180,0.5)", "rgba(60,150,60,0.5)", "rgba(180,150,60,0.5)"];
                        for (let b = 0; b < 4; b++) {
                            ctx.fillStyle = bkCols[b];
                            ctx.fillRect(winX + 7 + b * 6, sy - 7, 4, 7);
                        }
                    }
                } else if (windowScene === "science") {
                    // Beakers & flasks
                    ctx.fillStyle = "rgba(220, 235, 245, 0.5)";
                    ctx.beginPath(); ctx.roundRect(winX + 2, winY + 2, winW - 4, winH - 4, 3); ctx.fill();
                    // Flask
                    ctx.strokeStyle = "rgba(100, 150, 200, 0.6)";
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(winX + 12, winY + 14); ctx.lineTo(winX + 12, winY + 24);
                    ctx.lineTo(winX + 7, winY + 34); ctx.lineTo(winX + 17, winY + 34);
                    ctx.lineTo(winX + 12, winY + 24); ctx.stroke();
                    ctx.fillStyle = "rgba(100, 200, 150, 0.35)";
                    ctx.beginPath(); ctx.moveTo(winX + 8, winY + 30);
                    ctx.lineTo(winX + 16, winY + 30); ctx.lineTo(winX + 17, winY + 34);
                    ctx.lineTo(winX + 7, winY + 34); ctx.closePath(); ctx.fill();
                    // Test tube
                    ctx.strokeStyle = "rgba(100, 150, 200, 0.5)";
                    ctx.beginPath(); ctx.roundRect(winX + 20, winY + 16, 5, 18, [0,0,2,2]); ctx.stroke();
                    ctx.fillStyle = "rgba(200, 100, 150, 0.3)";
                    ctx.beginPath(); ctx.roundRect(winX + 20, winY + 24, 5, 10, [0,0,2,2]); ctx.fill();
                }
                // Window frame
                ctx.strokeStyle = "rgba(80, 70, 55, 0.35)";
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.roundRect(winX, winY, winW, winH, 4); ctx.stroke();
                // Window cross bar
                ctx.strokeStyle = "rgba(80, 70, 55, 0.2)";
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.moveTo(winX, winY + winH / 2); ctx.lineTo(winX + winW, winY + winH / 2); ctx.stroke();

                // Handle (brass)
                ctx.fillStyle = "#c8b878";
                ctx.beginPath(); ctx.roundRect(cx + doorW / 2 - 14, wallH - doorH * 0.44, 6, 14, 3); ctx.fill();
                ctx.fillStyle = "#b0a060";
                ctx.beginPath(); ctx.arc(cx + doorW / 2 - 11, wallH - doorH * 0.44, 3.5, 0, Math.PI * 2); ctx.fill();

                // Label plate above door
                ctx.fillStyle = "rgba(255,255,255,0.95)";
                const labelW = Math.max(68, label.length * 14 + 16);
                ctx.beginPath(); ctx.roundRect(cx - labelW / 2, dY - 26, labelW, 22, 4); ctx.fill();
                ctx.strokeStyle = "rgba(130, 120, 105, 0.35)";
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.roundRect(cx - labelW / 2, dY - 26, labelW, 22, 4); ctx.stroke();
                ctx.fillStyle = "#3a2e22";
                ctx.font = "700 13px 'Zen Maru Gothic', sans-serif";
                ctx.textAlign = "center"; ctx.textBaseline = "middle";
                ctx.fillText(label, cx, dY - 15);

                // Glow rect when hovered
                glowRectFor(actId, cx - doorW / 2 - 4, dY - 28, doorW + 8, doorH + 30, 8);
            };

            // 3 Doors
            drawDoor(worldWidth * 0.06, "運動場", "#8a7060", "#a0d0e8", "sports_field", "sports");
            drawDoor(worldWidth * 0.22, "図書館", "#907858", "#d8c8a0", "library", "library");
            drawDoor(worldWidth * 0.42, "理科室", "#687870", "#b8d0d8", "science_room", "science");

            // === Shoe box (下駄箱) near sports door ===
            const sbX = worldWidth * 0.11;
            const sbW = 50, sbH = 45;
            const sbY = wallH - sbH;
            ctx.fillStyle = "#b0a890";
            ctx.beginPath(); ctx.roundRect(sbX, sbY, sbW, sbH, 3); ctx.fill();
            ctx.strokeStyle = "rgba(0,0,0,0.1)"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.roundRect(sbX, sbY, sbW, sbH, 3); ctx.stroke();
            for (let r = 0; r < 3; r++) {
                ctx.strokeStyle = "rgba(0,0,0,0.06)"; ctx.lineWidth = 0.8;
                ctx.beginPath(); ctx.moveTo(sbX, sbY + 15 * (r + 1)); ctx.lineTo(sbX + sbW, sbY + 15 * (r + 1)); ctx.stroke();
            }

            // === Lockers (improved) ===
            schoolBgObjects.lockers.forEach(locker => {
                const ly = wallH - lockerH;
                // Locker body gradient
                const lg = ctx.createLinearGradient(locker.x, 0, locker.x + lockerW, 0);
                lg.addColorStop(0, `hsl(${locker.hue}, 24%, 72%)`);
                lg.addColorStop(0.4, `hsl(${locker.hue}, 26%, 76%)`);
                lg.addColorStop(1, `hsl(${locker.hue}, 22%, 68%)`);
                ctx.fillStyle = lg;
                ctx.beginPath(); ctx.roundRect(locker.x, ly, lockerW, lockerH, 3); ctx.fill();
                ctx.strokeStyle = "rgba(0,0,0,0.12)"; ctx.lineWidth = 1.2;
                ctx.beginPath(); ctx.roundRect(locker.x, ly, lockerW, lockerH, 3); ctx.stroke();
                // Divider
                ctx.strokeStyle = "rgba(0,0,0,0.08)"; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.moveTo(locker.x, ly + lockerH * 0.5);
                ctx.lineTo(locker.x + lockerW, ly + lockerH * 0.5); ctx.stroke();
                // Handles
                ctx.fillStyle = "rgba(100,95,88,0.6)";
                ctx.beginPath(); ctx.roundRect(locker.x + lockerW - 11, ly + lockerH * 0.22, 6, 13, 2.5); ctx.fill();
                ctx.beginPath(); ctx.roundRect(locker.x + lockerW - 11, ly + lockerH * 0.72, 6, 13, 2.5); ctx.fill();
                // Vents
                ctx.strokeStyle = "rgba(0,0,0,0.06)"; ctx.lineWidth = 0.7;
                for (let s = 0; s < 4; s++) {
                    ctx.beginPath();
                    ctx.moveTo(locker.x + 6, ly + 8 + s * 5);
                    ctx.lineTo(locker.x + lockerW - 14, ly + 8 + s * 5);
                    ctx.stroke();
                }
                // Number label
                ctx.fillStyle = "rgba(0,0,0,0.12)";
                ctx.font = "600 9px sans-serif";
                ctx.textAlign = "center"; ctx.textBaseline = "middle";
            });

            // Fire extinguisher near lockers
            const feX = worldWidth * 0.39, feY = wallH - 42;
            ctx.fillStyle = "#cc3030";
            ctx.beginPath(); ctx.roundRect(feX, feY, 12, 36, [3,3,1,1]); ctx.fill();
            ctx.fillStyle = "#222";
            ctx.beginPath(); ctx.roundRect(feX + 2, feY - 4, 8, 6, 2); ctx.fill();
            ctx.fillStyle = "#888";
            ctx.beginPath(); ctx.roundRect(feX + 8, feY - 2, 7, 3, 1); ctx.fill();

            // Hallway windows (improved with curtains)
            for (let wx = worldWidth * 0.48; wx < hallEnd - 40; wx += 200) {
                const ww = 110, wh = wallH * 0.38;
                const wy = wallH * 0.05;
                // Sky through window
                const skyG = ctx.createLinearGradient(0, wy, 0, wy + wh);
                skyG.addColorStop(0, "#b8d8f0");
                skyG.addColorStop(0.6, "#d0e8f8");
                skyG.addColorStop(1, "#c8e0c8");
                ctx.fillStyle = skyG;
                ctx.beginPath(); ctx.roundRect(wx + 3, wy + 3, ww - 6, wh - 6, 2); ctx.fill();
                // Clouds
                ctx.fillStyle = "rgba(255,255,255,0.4)";
                ctx.beginPath(); ctx.arc(wx + 30, wy + 18, 10, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(wx + 42, wy + 16, 12, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(wx + 70, wy + 22, 8, 0, Math.PI * 2); ctx.fill();
                // Window frame
                ctx.strokeStyle = "rgba(130, 120, 105, 0.6)";
                ctx.lineWidth = 6;
                ctx.beginPath(); ctx.roundRect(wx, wy, ww, wh, 3); ctx.stroke();
                // Cross bars
                ctx.lineWidth = 3;
                ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(wx, wy + wh / 2); ctx.lineTo(wx + ww, wy + wh / 2); ctx.stroke();
                // Inner frame
                ctx.strokeStyle = "rgba(160, 150, 135, 0.35)";
                ctx.lineWidth = 1.5;
                ctx.beginPath(); ctx.roundRect(wx + 3, wy + 3, ww - 6, wh - 6, 2); ctx.stroke();
                // Window sill
                ctx.fillStyle = "rgba(190, 180, 165, 0.6)";
                ctx.beginPath(); ctx.roundRect(wx - 5, wy + wh - 1, ww + 10, 7, 2); ctx.fill();
            }

            // Hall floor (linoleum tiles - improved)
            const floorG = ctx.createLinearGradient(0, wallH, 0, height);
            floorG.addColorStop(0, "#ddd5c8");
            floorG.addColorStop(0.3, "#d8d0c4");
            floorG.addColorStop(1, "#cfc6b8");
            ctx.fillStyle = floorG;
            ctx.fillRect(0, wallH, hallEnd, height - wallH);
            // Tile grid
            ctx.strokeStyle = "rgba(175, 165, 150, 0.14)";
            ctx.lineWidth = 0.8;
            for (let gx = 0; gx < hallEnd; gx += 65) {
                ctx.beginPath(); ctx.moveTo(gx, wallH); ctx.lineTo(gx, height); ctx.stroke();
            }
            for (let gy = wallH; gy < height; gy += 65) {
                ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(hallEnd, gy); ctx.stroke();
            }
            // Floor reflection
            const fglow = ctx.createLinearGradient(0, wallH, 0, wallH + 40);
            fglow.addColorStop(0, "rgba(255, 255, 255, 0.12)");
            fglow.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.fillStyle = fglow;
            ctx.fillRect(0, wallH, hallEnd, 40);

            // ========== DIVIDING WALL (hallway ↔ classroom) ==========
            const divW = 18;
            const divX = hallEnd - divW / 2;
            // Wall body
            const divG = ctx.createLinearGradient(divX, 0, divX + divW, 0);
            divG.addColorStop(0, "rgba(185, 178, 168, 0.85)");
            divG.addColorStop(0.3, "rgba(195, 188, 178, 0.9)");
            divG.addColorStop(0.7, "rgba(190, 183, 173, 0.88)");
            divG.addColorStop(1, "rgba(180, 173, 163, 0.82)");
            ctx.fillStyle = divG;
            ctx.fillRect(divX, 0, divW, height);
            // Wall edge highlights
            ctx.fillStyle = "rgba(210, 205, 195, 0.4)";
            ctx.fillRect(divX, 0, 2, height);
            ctx.fillStyle = "rgba(160, 155, 145, 0.3)";
            ctx.fillRect(divX + divW - 2, 0, 2, height);

            // Classroom sliding door (open)
            const sdoorW = 60, sdoorH = doorH;
            const sdoorY = wallH - sdoorH;
            // Door opening (dark gap)
            ctx.fillStyle = "rgba(60, 55, 48, 0.15)";
            ctx.fillRect(divX + 1, sdoorY, divW - 2, sdoorH);
            // Slid-open door (partially visible, tucked to right side of wall)
            const slidX = divX + divW - 4;
            ctx.fillStyle = "rgba(180, 170, 155, 0.7)";
            ctx.beginPath(); ctx.roundRect(slidX, sdoorY, sdoorW * 0.55, sdoorH, [0,3,3,0]); ctx.fill();
            // Door handle groove
            ctx.fillStyle = "rgba(120, 115, 105, 0.5)";
            ctx.beginPath(); ctx.roundRect(slidX + 3, sdoorY + sdoorH * 0.4, 4, 22, 2); ctx.fill();
            // Glass panel on sliding door
            ctx.fillStyle = "rgba(210, 225, 235, 0.5)";
            ctx.beginPath(); ctx.roundRect(slidX + 10, sdoorY + 14, sdoorW * 0.55 - 16, sdoorH * 0.35, 3); ctx.fill();
            // Door rail (top)
            ctx.fillStyle = "rgba(140, 130, 118, 0.6)";
            ctx.fillRect(divX - 4, sdoorY - 5, divW + sdoorW * 0.6 + 4, 5);
            // Door rail (bottom)
            ctx.fillStyle = "rgba(140, 130, 118, 0.45)";
            ctx.fillRect(divX - 2, wallH - 3, divW + sdoorW * 0.6, 3);
            // Class sign plate (wider, mounted on wall above door)
            const signW = 72, signH = 28;
            const signX = divX + divW / 2 - signW / 2;
            const signY = sdoorY - 40;
            ctx.fillStyle = "#f8f5ee";
            ctx.beginPath(); ctx.roundRect(signX, signY, signW, signH, 5); ctx.fill();
            ctx.strokeStyle = "rgba(100, 90, 75, 0.4)"; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.roundRect(signX, signY, signW, signH, 5); ctx.stroke();
            // Blue banner stripe
            ctx.fillStyle = "rgba(70, 120, 180, 0.7)";
            ctx.beginPath(); ctx.roundRect(signX + 3, signY + 3, signW - 6, 7, 2); ctx.fill();
            ctx.fillStyle = "#2a2018";
            ctx.font = "700 14px 'Zen Maru Gothic', sans-serif";
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText("2年1組", signX + signW / 2, signY + signH / 2 + 3);

            // ========== CLASSROOM (right 52%) ==========
            // Classroom wall gradient
            const classWallG = ctx.createLinearGradient(0, 0, 0, wallH);
            classWallG.addColorStop(0, "#faf8f3");
            classWallG.addColorStop(0.3, "#f5f0e8");
            classWallG.addColorStop(1, "#ede5da");
            ctx.fillStyle = classWallG;
            ctx.fillRect(classStart, 0, worldWidth - classStart, wallH);
            // Crown molding
            ctx.fillStyle = "rgba(228, 222, 212, 0.5)";
            ctx.fillRect(classStart, 0, worldWidth - classStart, 6);
            ctx.fillStyle = "rgba(200, 192, 180, 0.3)";
            ctx.fillRect(classStart, 6, worldWidth - classStart, 3);
            // Baseboard
            ctx.fillStyle = "rgba(160, 150, 135, 0.65)";
            ctx.fillRect(classStart, wallH - 12, worldWidth - classStart, 12);
            ctx.fillStyle = "rgba(175, 165, 148, 0.45)";
            ctx.fillRect(classStart, wallH - 14, worldWidth - classStart, 3);

            // Classroom ceiling lights (improved)
            for (let lx = classStart + 140; lx < worldWidth - 50; lx += 260) {
                ctx.fillStyle = "rgba(220, 225, 230, 0.55)";
                ctx.beginPath(); ctx.roundRect(lx - 50, 2, 100, 7, 2); ctx.fill();
                ctx.fillStyle = "rgba(245, 248, 255, 0.72)";
                ctx.beginPath(); ctx.roundRect(lx - 44, 5, 88, 11, 3); ctx.fill();
                const glow = ctx.createRadialGradient(lx, 14, 6, lx, 45, 130);
                glow.addColorStop(0, "rgba(255, 255, 248, 0.14)");
                glow.addColorStop(0.5, "rgba(255, 255, 248, 0.04)");
                glow.addColorStop(1, "rgba(255, 255, 248, 0)");
                ctx.fillStyle = glow;
                ctx.fillRect(lx - 130, 8, 260, 140);
            }

            // Classroom floor (wood - drawn early so furniture appears on top)
            const woodG = ctx.createLinearGradient(0, wallH, 0, height);
            woodG.addColorStop(0, "#dccca8");
            woodG.addColorStop(0.3, "#d8c8a8");
            woodG.addColorStop(1, "#cebea0");
            ctx.fillStyle = woodG;
            ctx.fillRect(classStart, wallH, worldWidth - classStart, height - wallH);
            // Wood plank pattern
            ctx.strokeStyle = "rgba(80, 60, 40, 0.05)";
            ctx.lineWidth = 0.8;
            for (let wx = classStart; wx < worldWidth; wx += 65) {
                ctx.beginPath(); ctx.moveTo(wx, wallH); ctx.lineTo(wx, height); ctx.stroke();
            }
            for (let wy = wallH; wy < height; wy += 22) {
                const offset = (Math.floor((wy - wallH) / 22) % 2) * 32;
                ctx.beginPath(); ctx.moveTo(classStart + offset, wy); ctx.lineTo(worldWidth, wy); ctx.stroke();
            }
            // Floor reflection near wall
            const woodGlow = ctx.createLinearGradient(0, wallH, 0, wallH + 35);
            woodGlow.addColorStop(0, "rgba(255, 255, 255, 0.08)");
            woodGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
            ctx.fillStyle = woodGlow;
            ctx.fillRect(classStart, wallH, worldWidth - classStart, 35);

            // === Classroom windows (back wall, with curtains) ===
            for (let wx = classStart + 20; wx < classStart + 200; wx += 130) {
                const ww = 90, wh = wallH * 0.45;
                const wy = wallH * 0.04;
                // Sky
                const skyG = ctx.createLinearGradient(0, wy, 0, wy + wh);
                skyG.addColorStop(0, "#b0d4f0");
                skyG.addColorStop(0.7, "#d0e4f8");
                skyG.addColorStop(1, "#c0dcc0");
                ctx.fillStyle = skyG;
                ctx.beginPath(); ctx.roundRect(wx + 3, wy + 3, ww - 6, wh - 6, 2); ctx.fill();
                // Tree outside
                ctx.fillStyle = "rgba(80, 140, 60, 0.35)";
                ctx.beginPath(); ctx.arc(wx + ww * 0.3, wy + wh * 0.65, 18, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = "rgba(90, 65, 40, 0.3)";
                ctx.fillRect(wx + ww * 0.3 - 2, wy + wh * 0.75, 4, 14);
                // Frame
                ctx.strokeStyle = "rgba(130, 120, 105, 0.55)";
                ctx.lineWidth = 5;
                ctx.beginPath(); ctx.roundRect(wx, wy, ww, wh, 3); ctx.stroke();
                ctx.lineWidth = 2.5;
                ctx.beginPath(); ctx.moveTo(wx + ww / 2, wy); ctx.lineTo(wx + ww / 2, wy + wh); ctx.stroke();
                ctx.beginPath(); ctx.moveTo(wx, wy + wh * 0.45); ctx.lineTo(wx + ww, wy + wh * 0.45); ctx.stroke();
                // Window sill
                ctx.fillStyle = "rgba(185, 175, 160, 0.6)";
                ctx.beginPath(); ctx.roundRect(wx - 4, wy + wh, ww + 8, 6, 2); ctx.fill();
                // Curtains
                ctx.fillStyle = "rgba(180, 140, 100, 0.2)";
                ctx.beginPath(); ctx.roundRect(wx + 1, wy + 1, 12, wh - 2, 1); ctx.fill();
                ctx.beginPath(); ctx.roundRect(wx + ww - 13, wy + 1, 12, wh - 2, 1); ctx.fill();
                // Curtain folds
                ctx.strokeStyle = "rgba(160, 120, 80, 0.12)";
                ctx.lineWidth = 0.8;
                for (let f = 0; f < 3; f++) {
                    ctx.beginPath(); ctx.moveTo(wx + 3 + f * 4, wy + 4); ctx.lineTo(wx + 3 + f * 4, wy + wh - 4); ctx.stroke();
                    ctx.beginPath(); ctx.moveTo(wx + ww - 12 + f * 4, wy + 4); ctx.lineTo(wx + ww - 12 + f * 4, wy + wh - 4); ctx.stroke();
                }
            }

            // === Posters/notices on wall ===
            const posterX = classStart + 180;
            // Poster 1: class schedule
            ctx.fillStyle = "#f8f0d8";
            ctx.beginPath(); ctx.roundRect(posterX, wallH * 0.08, 72, 95, 4); ctx.fill();
            ctx.strokeStyle = "rgba(160, 140, 100, 0.35)"; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.roundRect(posterX, wallH * 0.08, 72, 95, 4); ctx.stroke();
            // Pin
            ctx.fillStyle = "#cc3030";
            ctx.beginPath(); ctx.arc(posterX + 36, wallH * 0.08 - 1, 3, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "#c04040";
            ctx.font = "700 10px 'Zen Maru Gothic', sans-serif";
            ctx.textAlign = "center"; ctx.textBaseline = "top";
            ctx.fillText("時間割", posterX + 36, wallH * 0.08 + 6);
            ctx.strokeStyle = "rgba(0,0,0,0.08)"; ctx.lineWidth = 0.5;
            for (let r = 0; r < 5; r++) {
                const ry = wallH * 0.08 + 24 + r * 14;
                ctx.beginPath(); ctx.moveTo(posterX + 4, ry); ctx.lineTo(posterX + 68, ry); ctx.stroke();
            }

            // Poster 2: student art
            ctx.fillStyle = "#e8f0d8";
            ctx.beginPath(); ctx.roundRect(posterX + 86, wallH * 0.06, 62, 72, 4); ctx.fill();
            ctx.strokeStyle = "rgba(100, 140, 80, 0.3)"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.roundRect(posterX + 86, wallH * 0.06, 62, 72, 4); ctx.stroke();
            ctx.fillStyle = "#cc3030";
            ctx.beginPath(); ctx.arc(posterX + 117, wallH * 0.06 - 1, 3, 0, Math.PI * 2); ctx.fill();
            // Rainbow
            const rcx = posterX + 117, rcy = wallH * 0.06 + 48;
            ["#e04040","#e08040","#e0d040","#40b040","#4080d0","#8040c0"].forEach((col, i) => {
                ctx.strokeStyle = col; ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(rcx, rcy, 22 - i * 3, Math.PI, 0); ctx.stroke();
            });

            // Poster 3: class motto
            ctx.fillStyle = "#f0e8f0";
            ctx.beginPath(); ctx.roundRect(posterX + 162, wallH * 0.10, 58, 55, 4); ctx.fill();
            ctx.fillStyle = "#cc3030";
            ctx.beginPath(); ctx.arc(posterX + 191, wallH * 0.10 - 1, 3, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = "#604080";
            ctx.font = "700 9px 'Zen Maru Gothic', sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("学級目標", posterX + 191, wallH * 0.10 + 10);
            ctx.font = "600 8px 'Zen Maru Gothic', sans-serif";
            ctx.fillText("なかよく", posterX + 191, wallH * 0.10 + 28);
            ctx.fillText("たのしく", posterX + 191, wallH * 0.10 + 40);

            // === BLACKBOARD (large, highly detailed) ===
            const bbX = worldWidth * 0.82;
            const bbW = worldWidth * 0.14;
            const bbY = wallH * 0.06;
            const bbH = wallH * 0.58;
            // Shadow
            ctx.fillStyle = "rgba(0,0,0,0.06)";
            ctx.beginPath(); ctx.roundRect(bbX + 4, bbY + 4, bbW, bbH, 4); ctx.fill();
            // Board surface gradient
            const bbG = ctx.createLinearGradient(bbX, bbY, bbX, bbY + bbH);
            bbG.addColorStop(0, "#2c5040");
            bbG.addColorStop(0.3, "#284a38");
            bbG.addColorStop(0.7, "#264535");
            bbG.addColorStop(1, "#2a4a3a");
            ctx.fillStyle = bbG;
            ctx.beginPath(); ctx.roundRect(bbX, bbY, bbW, bbH, 4); ctx.fill();
            // Chalk dust texture
            ctx.fillStyle = "rgba(255,255,255,0.03)";
            for (let dx = 0; dx < bbW; dx += 12) {
                for (let dy = 0; dy < bbH; dy += 12) {
                    if (Math.random() > 0.6) {
                        ctx.beginPath();
                        ctx.arc(bbX + dx + Math.random() * 10, bbY + dy + Math.random() * 10, Math.random() * 3, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
            // Frame (wooden, detailed)
            ctx.strokeStyle = "#9a8a68";
            ctx.lineWidth = 6;
            ctx.beginPath(); ctx.roundRect(bbX - 4, bbY - 4, bbW + 8, bbH + 8, 5); ctx.stroke();
            ctx.strokeStyle = "#a89870";
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.roundRect(bbX - 1, bbY - 1, bbW + 2, bbH + 2, 3); ctx.stroke();
            // Chalk tray (3D effect)
            ctx.fillStyle = "#b8ad98";
            ctx.beginPath(); ctx.roundRect(bbX - 8, bbY + bbH + 3, bbW + 16, 12, [0,0,3,3]); ctx.fill();
            ctx.fillStyle = "#a89880";
            ctx.fillRect(bbX - 8, bbY + bbH + 3, bbW + 16, 3);
            ctx.fillStyle = "rgba(0,0,0,0.06)";
            ctx.fillRect(bbX - 6, bbY + bbH + 5, bbW + 12, 2);
            // Chalk pieces
            ctx.fillStyle = "#f8f8f5";
            ctx.beginPath(); ctx.roundRect(bbX + 14, bbY + bbH + 6, 22, 5, 1.5); ctx.fill();
            ctx.fillStyle = "#e8d060";
            ctx.beginPath(); ctx.roundRect(bbX + 42, bbY + bbH + 6, 18, 5, 1.5); ctx.fill();
            ctx.fillStyle = "#e87070";
            ctx.beginPath(); ctx.roundRect(bbX + 66, bbY + bbH + 7, 15, 4, 1.5); ctx.fill();
            ctx.fillStyle = "#70a0e0";
            ctx.beginPath(); ctx.roundRect(bbX + 86, bbY + bbH + 6, 12, 5, 1.5); ctx.fill();

            // Chalk writing on blackboard
            ctx.font = "500 13px 'Zen Maru Gothic', sans-serif";
            ctx.fillStyle = "rgba(255,255,255,0.35)";
            ctx.textAlign = "left"; ctx.textBaseline = "top";
            ctx.fillText("今日のめあて", bbX + 18, bbY + 16);
            ctx.strokeStyle = "rgba(255,255,255,0.22)";
            ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(bbX + 18, bbY + 35); ctx.lineTo(bbX + bbW - 30, bbY + 35); ctx.stroke();
            ctx.font = "400 11px 'Zen Maru Gothic', sans-serif";
            ctx.fillStyle = "rgba(255,255,255,0.25)";
            ctx.fillText("みんなで たすけあおう", bbX + 24, bbY + 44);

            // Doodle art on blackboard (linked to 落書き activity)
            const doodleGlow = hov === "doodle";
            if (doodleGlow) glowFor("doodle", bbX + bbW * 0.6, bbY + bbH * 0.65, bbH * 0.5);
            const dAlpha = doodleGlow ? 0.65 + Math.sin(t * 3) * 0.15 : 0.3;
            ctx.save();
            ctx.globalAlpha = dAlpha;
            // Star
            const drawStar = (sx, sy, r, col) => {
                ctx.fillStyle = col;
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const a1 = (i * 72 - 90) * Math.PI / 180;
                    const a2 = ((i * 72) + 36 - 90) * Math.PI / 180;
                    ctx.lineTo(sx + Math.cos(a1) * r, sy + Math.sin(a1) * r);
                    ctx.lineTo(sx + Math.cos(a2) * r * 0.45, sy + Math.sin(a2) * r * 0.45);
                }
                ctx.closePath(); ctx.fill();
            };
            drawStar(bbX + bbW * 0.7, bbY + bbH * 0.55, 14, "rgba(230, 210, 80, 0.9)");
            drawStar(bbX + bbW * 0.85, bbY + bbH * 0.45, 9, "rgba(230, 130, 180, 0.85)");
            // Smiley face
            const smX = bbX + bbW * 0.55, smY = bbY + bbH * 0.72;
            ctx.strokeStyle = "rgba(255, 255, 100, 0.85)";
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(smX, smY, 13, 0, Math.PI * 2); ctx.stroke();
            ctx.fillStyle = "rgba(255, 255, 100, 0.8)";
            ctx.beginPath(); ctx.arc(smX - 5, smY - 3, 2, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(smX + 5, smY - 3, 2, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(smX, smY + 2, 7, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
            // Flower
            const flX = bbX + bbW * 0.78, flY = bbY + bbH * 0.78;
            ctx.fillStyle = "rgba(255, 150, 150, 0.85)";
            for (let p = 0; p < 5; p++) {
                const pa = (p / 5) * Math.PI * 2;
                ctx.beginPath(); ctx.arc(flX + Math.cos(pa) * 7, flY + Math.sin(pa) * 7, 5, 0, Math.PI * 2); ctx.fill();
            }
            ctx.fillStyle = "rgba(255, 220, 80, 0.9)";
            ctx.beginPath(); ctx.arc(flX, flY, 4, 0, Math.PI * 2); ctx.fill();
            // Cat face
            const catX = bbX + bbW * 0.4, catY = bbY + bbH * 0.8;
            ctx.strokeStyle = "rgba(255, 200, 150, 0.8)"; ctx.lineWidth = 1.8;
            ctx.beginPath(); ctx.arc(catX, catY, 10, 0, Math.PI * 2); ctx.stroke();
            // Ears
            ctx.beginPath(); ctx.moveTo(catX - 8, catY - 8); ctx.lineTo(catX - 12, catY - 18); ctx.lineTo(catX - 3, catY - 10); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(catX + 8, catY - 8); ctx.lineTo(catX + 12, catY - 18); ctx.lineTo(catX + 3, catY - 10); ctx.stroke();
            // Eyes & whiskers
            ctx.fillStyle = "rgba(255, 200, 150, 0.8)";
            ctx.beginPath(); ctx.arc(catX - 4, catY - 2, 1.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(catX + 4, catY - 2, 1.5, 0, Math.PI * 2); ctx.fill();
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(catX - 8, catY + 1); ctx.lineTo(catX - 16, catY - 1); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(catX - 8, catY + 3); ctx.lineTo(catX - 16, catY + 4); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(catX + 8, catY + 1); ctx.lineTo(catX + 16, catY - 1); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(catX + 8, catY + 3); ctx.lineTo(catX + 16, catY + 4); ctx.stroke();
            ctx.restore();

            // Doodle glow rect
            if (doodleGlow) {
                glowRectFor("doodle", bbX + bbW * 0.3, bbY + bbH * 0.4, bbW * 0.6, bbH * 0.55, 6);
            }

            // Date in corner
            ctx.fillStyle = "rgba(255,255,255,0.3)";
            ctx.font = "500 12px 'Zen Maru Gothic', sans-serif";
            ctx.textAlign = "right"; ctx.textBaseline = "top";
            ctx.fillText("2/20", bbX + bbW - 14, bbY + 12);

            // === Clock (improved) ===
            const clockX = bbX + bbW + 35;
            const clockY = wallH * 0.14;
            const clockR = 24;
            // Clock shadow
            ctx.fillStyle = "rgba(0,0,0,0.05)";
            ctx.beginPath(); ctx.arc(clockX + 2, clockY + 2, clockR + 2, 0, Math.PI * 2); ctx.fill();
            // Clock body
            ctx.fillStyle = "#fafafa";
            ctx.beginPath(); ctx.arc(clockX, clockY, clockR, 0, Math.PI * 2); ctx.fill();
            ctx.strokeStyle = "#4a4a4a";
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.arc(clockX, clockY, clockR, 0, Math.PI * 2); ctx.stroke();
            // Inner ring
            ctx.strokeStyle = "rgba(0,0,0,0.06)"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(clockX, clockY, clockR - 3, 0, Math.PI * 2); ctx.stroke();
            // Hour marks
            for (let h = 0; h < 12; h++) {
                const a = (h / 12) * Math.PI * 2 - Math.PI / 2;
                const isMain = h % 3 === 0;
                ctx.strokeStyle = isMain ? "#333" : "#888";
                ctx.lineWidth = isMain ? 2 : 1;
                ctx.beginPath();
                ctx.moveTo(clockX + Math.cos(a) * (clockR - (isMain ? 8 : 6)), clockY + Math.sin(a) * (clockR - (isMain ? 8 : 6)));
                ctx.lineTo(clockX + Math.cos(a) * (clockR - 3), clockY + Math.sin(a) * (clockR - 3));
                ctx.stroke();
            }
            // Hands (10:10 position)
            ctx.strokeStyle = "#222"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
            ctx.beginPath(); ctx.moveTo(clockX, clockY);
            ctx.lineTo(clockX + Math.cos(-Math.PI * 0.42) * 13, clockY + Math.sin(-Math.PI * 0.42) * 13); ctx.stroke();
            ctx.lineWidth = 1.8;
            ctx.beginPath(); ctx.moveTo(clockX, clockY);
            ctx.lineTo(clockX + Math.cos(Math.PI * 0.17) * 17, clockY + Math.sin(Math.PI * 0.17) * 17); ctx.stroke();
            ctx.lineCap = "butt";
            // Second hand
            const secAngle = (t * 0.5) % (Math.PI * 2) - Math.PI / 2;
            ctx.strokeStyle = "#cc0000"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(clockX, clockY);
            ctx.lineTo(clockX + Math.cos(secAngle) * 18, clockY + Math.sin(secAngle) * 18); ctx.stroke();
            // Center dot
            ctx.fillStyle = "#222";
            ctx.beginPath(); ctx.arc(clockX, clockY, 2.5, 0, Math.PI * 2); ctx.fill();

            // === ORGAN (highly detailed, linked to organ activity) ===
            const organX = worldWidth * 0.95 - 44;
            const organW = 88;
            const organH = 68;
            const organY = wallH - organH;
            const organGlow = hov === "organ";
            if (organGlow) glowFor("organ", organX + organW / 2, organY + organH / 2, 80);
            // Main body (wood grain)
            const oG = ctx.createLinearGradient(organX, organY, organX, organY + organH);
            oG.addColorStop(0, "#7a5838");
            oG.addColorStop(0.4, "#6a4830");
            oG.addColorStop(1, "#5a3820");
            ctx.fillStyle = oG;
            ctx.beginPath(); ctx.roundRect(organX, organY, organW, organH, [5,5,2,2]); ctx.fill();
            // Wood grain lines
            ctx.strokeStyle = "rgba(0,0,0,0.06)"; ctx.lineWidth = 0.5;
            for (let gy = organY + 8; gy < organY + organH; gy += 7) {
                ctx.beginPath(); ctx.moveTo(organX + 3, gy); ctx.lineTo(organX + organW - 3, gy); ctx.stroke();
            }
            // Keyboard area (recessed)
            ctx.fillStyle = "rgba(0,0,0,0.15)";
            ctx.beginPath(); ctx.roundRect(organX + 4, organY + 10, organW - 8, 22, 2); ctx.fill();
            // White keys
            const keyStartX = organX + 6, keyW = (organW - 12) / 14;
            for (let k = 0; k < 14; k++) {
                ctx.fillStyle = k % 2 === 0 ? "#f5f2e8" : "#f0ede4";
                ctx.beginPath(); ctx.roundRect(keyStartX + k * keyW, organY + 11, keyW - 0.8, 19, [0,0,1.5,1.5]); ctx.fill();
                ctx.strokeStyle = "rgba(0,0,0,0.08)"; ctx.lineWidth = 0.5;
                ctx.beginPath(); ctx.roundRect(keyStartX + k * keyW, organY + 11, keyW - 0.8, 19, [0,0,1.5,1.5]); ctx.stroke();
            }
            // Black keys
            ctx.fillStyle = "#1a1a1a";
            [1,2,4,5,6,8,9,11,12].forEach(k => {
                if (k < 14) {
                    ctx.beginPath(); ctx.roundRect(keyStartX + k * keyW - 1.5, organY + 11, keyW * 0.65, 12, [0,0,1,1]); ctx.fill();
                }
            });
            // Control knobs
            for (let kn = 0; kn < 4; kn++) {
                ctx.fillStyle = "#4a3a28";
                ctx.beginPath(); ctx.arc(organX + 14 + kn * 18, organY + 40, 4, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = "#f0e8d0";
                ctx.beginPath(); ctx.arc(organX + 14 + kn * 18, organY + 40, 2, 0, Math.PI * 2); ctx.fill();
            }
            // Music stand
            const msY = organY - 20;
            ctx.fillStyle = "#7a5838";
            ctx.beginPath(); ctx.roundRect(organX + 8, msY, organW - 16, 22, [5,5,0,0]); ctx.fill();
            ctx.strokeStyle = "rgba(0,0,0,0.08)"; ctx.lineWidth = 0.8;
            ctx.beginPath(); ctx.roundRect(organX + 8, msY, organW - 16, 22, [5,5,0,0]); ctx.stroke();
            // Sheet music on stand
            ctx.fillStyle = "#f8f4e8";
            ctx.beginPath(); ctx.roundRect(organX + 14, msY + 3, organW - 28, 16, 2); ctx.fill();
            ctx.strokeStyle = "rgba(0,0,0,0.08)"; ctx.lineWidth = 0.5;
            // Staff lines on sheet music
            for (let sl = 0; sl < 5; sl++) {
                ctx.beginPath();
                ctx.moveTo(organX + 18, msY + 6 + sl * 2.5);
                ctx.lineTo(organX + organW - 18, msY + 6 + sl * 2.5);
                ctx.stroke();
            }
            // Notes on sheet
            ctx.fillStyle = "rgba(0,0,0,0.2)";
            [22, 30, 38, 46, 54].forEach((nx, i) => {
                ctx.beginPath(); ctx.ellipse(organX + nx, msY + 7 + (i % 3) * 2.5, 2, 1.5, 0.3, 0, Math.PI * 2); ctx.fill();
            });
            // Pedals
            ctx.fillStyle = "#4a3a28";
            ctx.beginPath(); ctx.roundRect(organX + 15, wallH + 2, 20, 8, 2); ctx.fill();
            ctx.beginPath(); ctx.roundRect(organX + organW - 35, wallH + 2, 20, 8, 2); ctx.fill();
            // Legs
            ctx.fillStyle = "#5a3828";
            ctx.fillRect(organX + 6, wallH - 2, 6, 18);
            ctx.fillRect(organX + organW - 12, wallH - 2, 6, 18);
            // Stool
            const stoolX = organX + organW / 2 - 22;
            ctx.fillStyle = "#5a3820";
            ctx.beginPath(); ctx.roundRect(stoolX, wallH - 2, 44, 6, 3); ctx.fill();
            ctx.fillStyle = "rgba(0,0,0,0.08)";
            ctx.beginPath(); ctx.roundRect(stoolX + 2, wallH - 1, 40, 4, 2); ctx.fill();
            ctx.fillStyle = "#4a2818";
            ctx.fillRect(stoolX + 6, wallH + 4, 5, 14);
            ctx.fillRect(stoolX + 33, wallH + 4, 5, 14);
            // Organ glow
            if (organGlow) glowRectFor("organ", organX - 4, msY - 4, organW + 8, organH + 24 + 4, 6);

            // === BOOKS for 読書 activity (worldFraction 0.52-0.60) ===
            const booksX = worldWidth * 0.67;
            const booksFloorY = wallH + 22;
            const readGlow = hov === "reading";
            if (readGlow) glowFor("reading", booksX, booksFloorY + 12, 70);
            // Find the desk closest to the reading area and put books on it
            const readDesk = schoolBgObjects.desks.find(d => Math.abs(d.x - booksX) < 40);
            const bookBaseY = readDesk ? readDesk.y - 1 : booksFloorY;
            // Stack of closed books
            const bookAlpha = readGlow ? 1.0 : 0.85;
            ctx.save();
            ctx.globalAlpha = bookAlpha;
            schoolBgObjects.books.forEach((book, bi) => {
                const bx = booksX - 18 + bi * 7;
                const by = bookBaseY - book.h;
                ctx.save();
                ctx.translate(bx, by + book.h / 2);
                ctx.rotate(book.tilt);
                // Book cover
                ctx.fillStyle = book.color;
                ctx.beginPath(); ctx.roundRect(-book.w / 2, -book.h / 2, book.w, book.h, 1.5); ctx.fill();
                // Spine highlight
                ctx.fillStyle = "rgba(255,255,255,0.2)";
                ctx.fillRect(-book.w / 2, -book.h / 2, 1.5, book.h);
                // Page edges
                ctx.fillStyle = "rgba(255,250,235,0.8)";
                ctx.fillRect(-book.w / 2 + 1.5, -book.h / 2 + 1, book.w - 3, 1);
                ctx.restore();
            });
            // Open book (lying flat)
            const obX = booksX + 28, obY = bookBaseY - 6;
            ctx.fillStyle = "#f5f0e0";
            ctx.beginPath();
            ctx.moveTo(obX - 20, obY); ctx.lineTo(obX, obY + 4); ctx.lineTo(obX + 20, obY);
            ctx.lineTo(obX + 20, obY - 14); ctx.lineTo(obX, obY - 10); ctx.lineTo(obX - 20, obY - 14);
            ctx.closePath(); ctx.fill();
            // Book spine
            ctx.strokeStyle = "rgba(0,0,0,0.12)"; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(obX, obY + 4); ctx.lineTo(obX, obY - 10); ctx.stroke();
            // Text lines
            ctx.strokeStyle = "rgba(0,0,0,0.1)"; ctx.lineWidth = 0.5;
            for (let tl = 0; tl < 3; tl++) {
                ctx.beginPath();
                ctx.moveTo(obX - 17, obY - 12 + tl * 4);
                ctx.lineTo(obX - 4, obY - 10 + tl * 4);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(obX + 4, obY - 10 + tl * 4);
                ctx.lineTo(obX + 17, obY - 12 + tl * 4);
                ctx.stroke();
            }
            // Book cover (closed book beside open one)
            ctx.fillStyle = "hsl(25, 55%, 48%)";
            ctx.beginPath(); ctx.roundRect(obX + 24, obY - 14, 14, 18, 2); ctx.fill();
            ctx.fillStyle = "rgba(255,255,255,0.15)";
            ctx.fillRect(obX + 24, obY - 14, 2, 18);
            ctx.restore();
            if (readGlow) glowRectFor("reading", booksX - 24, bookBaseY - 32, 74, 36, 5);

            // === CHATTING STUDENTS for おしゃべり activity (worldFraction 0.62-0.72) ===
            const chatX = worldWidth * 0.76;
            const chatGlow = hov === "chatting";
            if (chatGlow) glowFor("chatting", chatX, wallH - 10, 80);
            if (schoolBgObjects.chattingPair) {
                const pair = schoolBgObjects.chattingPair;
                // Draw both students using full Child rig in standing pose
                drawSchoolNpc(pair.student1, { standing: true, gesturePhase: t, facing: 1 });
                drawSchoolNpc(pair.student2, { standing: true, gesturePhase: t + Math.PI, facing: -1 });
                // Speech bubbles (drawn separately on top)
                const drawBubble = (sx, facing, bobOffset) => {
                    ctx.save();
                    ctx.translate(sx, wallH);
                    ctx.fillStyle = `rgba(255,255,255,${0.55 + Math.sin(t * 4 + bobOffset) * 0.2})`;
                    const bubX = facing > 0 ? 22 : -44;
                    ctx.beginPath(); ctx.roundRect(bubX, -85, 22, 14, 5); ctx.fill();
                    // Bubble tail
                    ctx.beginPath();
                    ctx.moveTo(bubX + (facing > 0 ? 0 : 22), -73);
                    ctx.lineTo(bubX + (facing > 0 ? -4 : 26), -69);
                    ctx.lineTo(bubX + (facing > 0 ? 6 : 16), -73);
                    ctx.closePath(); ctx.fill();
                    // Speech dots
                    ctx.fillStyle = "rgba(0,0,0,0.25)";
                    for (let d = 0; d < 3; d++) {
                        const da = 0.35 + Math.sin(t * 5 + d * 0.8 + bobOffset) * 0.15;
                        ctx.globalAlpha = da;
                        ctx.beginPath(); ctx.arc(bubX + 5 + d * 5, -78, 1.5, 0, Math.PI * 2); ctx.fill();
                    }
                    ctx.globalAlpha = 1;
                    ctx.restore();
                };
                drawBubble(pair.student1.x, 1, 0);
                drawBubble(pair.student2.x, -1, Math.PI);
            }
            if (chatGlow) glowRectFor("chatting", chatX - 55, wallH - 100, 110, 120, 8);

            // === Desks and chairs (drawn on top of floor) ===
            schoolBgObjects.desks.forEach(desk => {
                const dtop = desk.y;
                // Desk shadow
                ctx.fillStyle = "rgba(0,0,0,0.03)";
                ctx.beginPath(); ctx.roundRect(desk.x - deskW / 2 + 3, dtop + 3, deskW, deskH + 20, 2); ctx.fill();
                // Desk surface
                const dG = ctx.createLinearGradient(desk.x - deskW / 2, dtop, desk.x + deskW / 2, dtop);
                dG.addColorStop(0, "rgba(200, 180, 148, 0.85)");
                dG.addColorStop(0.5, "rgba(210, 190, 158, 0.9)");
                dG.addColorStop(1, "rgba(195, 175, 145, 0.85)");
                ctx.fillStyle = dG;
                ctx.beginPath(); ctx.roundRect(desk.x - deskW / 2, dtop, deskW, deskH, 2); ctx.fill();
                ctx.strokeStyle = "rgba(0,0,0,0.07)"; ctx.lineWidth = 1;
                ctx.beginPath(); ctx.roundRect(desk.x - deskW / 2, dtop, deskW, deskH, 2); ctx.stroke();
                // Desk edge highlight
                ctx.fillStyle = "rgba(255,255,255,0.12)";
                ctx.fillRect(desk.x - deskW / 2, dtop, deskW, 1.5);
                // Desk front panel
                ctx.fillStyle = "rgba(180, 160, 130, 0.55)";
                ctx.beginPath(); ctx.roundRect(desk.x - deskW / 2, dtop + deskH, deskW, 18, [0,0,2,2]); ctx.fill();
                // Legs
                ctx.fillStyle = "rgba(110, 108, 100, 0.5)";
                const legLen = deskTopFromFloor - deskH;
                ctx.fillRect(desk.x - deskW / 2 + 2, dtop + deskH, 3, legLen);
                ctx.fillRect(desk.x + deskW / 2 - 5, dtop + deskH, 3, legLen);
                // Chair
                const chairY = dtop + deskH + legLen;
                ctx.fillStyle = "rgba(170, 155, 125, 0.55)";
                ctx.beginPath(); ctx.roundRect(desk.x - 14, chairY - 6, 28, 5, 2); ctx.fill();
                ctx.fillStyle = "rgba(125, 120, 110, 0.4)";
                ctx.fillRect(desk.x - 12, chairY - 1, 2, 10);
                ctx.fillRect(desk.x + 10, chairY - 1, 2, 10);
                // Backrest
                ctx.fillStyle = "rgba(155, 140, 115, 0.5)";
                ctx.beginPath(); ctx.roundRect(desk.x - 12, chairY - 28, 24, 10, [3,3,0,0]); ctx.fill();
                ctx.fillRect(desk.x - 11, chairY - 18, 2, 14);
                ctx.fillRect(desk.x + 9, chairY - 18, 2, 14);
            });

            // NPC students in hallway
            if (schoolBgNpcs) {
                schoolBgNpcs.forEach(npc => drawSchoolNpc(npc));
            }

            ctx.textAlign = "left";
        }

        function drawToneDrops() {
            const dropColor = (drop) => {
                if (drop.dropColor) return drop.dropColor;
                if (drop.instrument === "snare") return "hsl(24, 82%, 58%)";
                if (drop.instrument === "cymbal") return "hsl(202, 58%, 64%)";
                if (drop.instrument === "hat") return palette.btnColor;
                return palette.btnColor;
            };
            toneDrops.forEach(drop => {
                const active = drop.proximityVol > -62;
                const glow = Math.max(0, (drop.proximityVol + 100) / 100);
                const fillLevel = clamp01(drop.fillLevel || 0);
                const toneColor = dropColor(drop);
                if (drop.toy && toySystem.drawToy) {
                    const toyScale = (currentScene === SCENE.TODDLE1 || currentScene === SCENE.CHILD1 || currentScene === SCENE.CHILD2) ? 1.5 : 1.84;
                    toySystem.drawToy(ctx, drop.toy, drop.x, drop.y - 92, toyScale, drop.toySeed);
                }
                if (drop.toy && drop.overlapAlpha > 0.01) {
                    const a = Math.min(1, drop.overlapAlpha);
                    ctx.save();
                    ctx.globalAlpha = a;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.shadowColor = "rgba(255,255,255,0.85)";
                    ctx.shadowBlur = 12;
                    ctx.fillStyle = "rgba(46, 51, 66, 0.95)";
                    ctx.font = "700 18px 'Zen Maru Gothic', sans-serif";
                    ctx.fillText(drop.toy.name, drop.x, drop.y - 176);
                    ctx.shadowBlur = 8;
                    ctx.fillStyle = "rgba(75, 84, 106, 0.9)";
                    ctx.font = "600 12px 'Zen Maru Gothic', sans-serif";
                    ctx.fillText(drop.toy.nameJa || "", drop.x, drop.y - 154);
                    ctx.restore();
                }
                ctx.save();
                ctx.translate(drop.x, drop.y);

                // Beat-synced ripples (kept subtle to match choice-button style)
                if (drop.ripples) {
                    drop.ripples = drop.ripples.filter(r => r.t < 1);
                    drop.ripples.forEach(r => {
                        r.t += 0.02;
                        const radius = 52 + r.t * 56;
                        const alpha = (1 - r.t) * 0.18 * (r.accent || 0.7);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
                        ctx.lineWidth = 2.2 * (1 - r.t * 0.55);
                        ctx.beginPath();
                        ctx.arc(0, 0, radius, 0, Math.PI * 2);
                        ctx.stroke();
                    });
                }

                // Base style: close to initial choice buttons (solid fill + white border + modest shadow)
                const baseR = 50;
                ctx.shadowColor = "rgba(0,0,0,0.14)";
                ctx.shadowBlur = 14;
                ctx.shadowOffsetY = 8;
                ctx.fillStyle = toneColor;
                ctx.beginPath();
                ctx.arc(0, 0, baseR, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.shadowOffsetY = 0;

                // Subtle top highlight instead of strong glow
                const hi = ctx.createRadialGradient(-14, -18, 2, -8, -10, 42);
                hi.addColorStop(0, "rgba(255,255,255,0.30)");
                hi.addColorStop(1, "rgba(255,255,255,0)");
                ctx.fillStyle = hi;
                ctx.beginPath();
                ctx.arc(0, 0, baseR - 2, 0, Math.PI * 2);
                ctx.fill();

                // White border like choice buttons
                ctx.strokeStyle = "rgba(255,255,255,0.96)";
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.arc(0, 0, baseR, 0, Math.PI * 2);
                ctx.stroke();

                // Hovered tone gets a restrained accent ring
                if (active) {
                    ctx.strokeStyle = `rgba(255,255,255,${0.14 + glow * 0.14})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(0, 0, baseR + 8 + glow * 2, 0, Math.PI * 2);
                    ctx.stroke();
                }

                ctx.fillStyle = fillLevel >= 0.985 ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.72)";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                if (drop.instrument === "bass") {
                    ctx.font = "700 14px 'Zen Maru Gothic', sans-serif";
                    ctx.fillText(drop.activityName || "", 0, -2);
                    ctx.font = "500 9px 'Zen Maru Gothic', sans-serif";
                    ctx.globalAlpha = 0.7;
                    ctx.fillText(drop.bassStyle || "", 0, 14);
                    ctx.globalAlpha = 1;
                } else if (drop.chordProgression) {
                    ctx.font = "700 18px 'Zen Maru Gothic', sans-serif";
                    ctx.fillText(drop.chordProgression.chords[0], 0, -5);
                    ctx.font = "500 9px 'Zen Maru Gothic', sans-serif";
                    ctx.globalAlpha = 0.7;
                    ctx.fillText(drop.chordProgression.chords.join(" - "), 0, 10);
                    ctx.globalAlpha = 1;
                    if (drop.facilityName || drop.chordSide) {
                        ctx.fillStyle = "rgba(255,255,255,0.82)";
                        ctx.font = "600 11px 'Zen Maru Gothic', sans-serif";
                        ctx.textBaseline = "bottom";
                        ctx.fillText(drop.facilityName || drop.chordSide, 0, -54);
                        ctx.textBaseline = "middle";
                    }
                } else {
                    ctx.font = "700 27px 'Zen Maru Gothic', sans-serif";
                    ctx.fillText("tone.", 0, 1.5);
                }
                ctx.restore();
            });
        }

        // Hovered toy stats HUD (top-left, screen space)
        let hoveredToyHudAlpha = 0;
        let lastHoveredToy = null;
        function drawToyStatsHud() {
            if (currentScene !== SCENE.CRAWL && currentScene !== SCENE.CRAWL2 && currentScene !== SCENE.TODDLE1 && currentScene !== SCENE.CHILD1 && currentScene !== SCENE.CHILD2) {
                hoveredToyHudAlpha = 0;
                return;
            }
            // Find the hovered toy
            let hovToy = null;
            toneDrops.forEach(drop => {
                if (drop.isHovered && drop.toy) hovToy = drop.toy;
            });
            if (hovToy) {
                lastHoveredToy = hovToy;
                hoveredToyHudAlpha = Math.min(1, hoveredToyHudAlpha + 0.08);
            } else {
                hoveredToyHudAlpha = Math.max(0, hoveredToyHudAlpha - 0.06);
            }
            if (hoveredToyHudAlpha < 0.01 || !lastHoveredToy) return;
            const toy = lastHoveredToy;

            ctx.save();
            ctx.globalAlpha = hoveredToyHudAlpha;

            const px = 18, py = 18;
            // Collect non-zero labels
            const entries = [];
            if (toy.labels) {
                Object.entries(toy.labels).forEach(([k, v]) => {
                    if (v > 0) entries.push({ label: k, value: v });
                });
            }
            entries.sort((a, b) => b.value - a.value);

            // Audio profile
            const audio = toy.audio;
            const audioEntries = [];
            if (audio) {
                audioEntries.push({ label: "density", value: audio.density.join("-") });
                audioEntries.push({ label: "pitch", value: audio.pitchMotion.join("-") });
                audioEntries.push({ label: "rhythm", value: audio.rhythmMotion.join("-") });
                audioEntries.push({ label: "openness", value: audio.openness.join("-") });
            }

            const totalScore = entries.reduce((s, e) => s + e.value, 0);
            const lineH = 22;
            const panelH = 48 + entries.length * lineH + (audioEntries.length ? 14 + audioEntries.length * 18 : 0) + 28;
            const panelW = 200;

            // Panel background
            ctx.fillStyle = "rgba(30, 32, 42, 0.72)";
            ctx.beginPath();
            ctx.roundRect(px, py, panelW, panelH, 10);
            ctx.fill();
            // Panel border
            ctx.strokeStyle = "rgba(255,255,255,0.15)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(px, py, panelW, panelH, 10);
            ctx.stroke();

            let cy = py + 16;

            // Toy name (English)
            ctx.fillStyle = "rgba(255,255,255,0.95)";
            ctx.font = "700 14px 'Zen Maru Gothic', sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(toy.name, px + 14, cy);
            // Japanese name (separate line below)
            if (toy.nameJa) {
                cy += 14;
                ctx.fillStyle = "rgba(255,255,255,0.55)";
                ctx.font = "500 10px 'Zen Maru Gothic', sans-serif";
                ctx.fillText(toy.nameJa, px + 14, cy);
            }
            cy += 22;

            // Life labels header
            ctx.fillStyle = "rgba(229, 142, 170, 0.9)";
            ctx.font = "600 11px 'Zen Maru Gothic', sans-serif";
            ctx.fillText(`Life Labels (total: ${totalScore})`, px + 14, cy);
            cy += 16;

            // Label bars
            entries.forEach(e => {
                // Bar background
                ctx.fillStyle = "rgba(255,255,255,0.1)";
                ctx.beginPath(); ctx.roundRect(px + 14, cy - 6, 140, 14, 3); ctx.fill();
                // Bar fill
                const barW = (e.value / 3) * 140;
                const barG = ctx.createLinearGradient(px + 14, 0, px + 14 + barW, 0);
                barG.addColorStop(0, "rgba(229, 142, 170, 0.7)");
                barG.addColorStop(1, "rgba(198, 128, 219, 0.7)");
                ctx.fillStyle = barG;
                ctx.beginPath(); ctx.roundRect(px + 14, cy - 6, barW, 14, 3); ctx.fill();
                // Label text
                ctx.fillStyle = "rgba(255,255,255,0.9)";
                ctx.font = "500 10px 'Zen Maru Gothic', sans-serif";
                ctx.fillText(e.label, px + 18, cy + 1);
                // Value
                ctx.textAlign = "right";
                ctx.fillText(`+${e.value}`, px + 14 + 136, cy + 1);
                ctx.textAlign = "left";
                cy += lineH;
            });

            // Audio profile section
            if (audioEntries.length) {
                cy += 4;
                ctx.fillStyle = "rgba(160, 200, 230, 0.8)";
                ctx.font = "600 11px 'Zen Maru Gothic', sans-serif";
                ctx.fillText("Sound Profile", px + 14, cy);
                cy += 14;
                audioEntries.forEach(e => {
                    ctx.fillStyle = "rgba(255,255,255,0.6)";
                    ctx.font = "400 10px 'Zen Maru Gothic', sans-serif";
                    ctx.fillText(e.label, px + 18, cy);
                    ctx.textAlign = "right";
                    ctx.fillStyle = "rgba(255,255,255,0.8)";
                    ctx.fillText(e.value, px + 14 + 136, cy);
                    ctx.textAlign = "left";
                    cy += 18;
                });
            }

            ctx.restore();
        }

        // Cumulative life labels HUD (top-right, screen space)
        let cumulHudAlpha = 0;
        let lastCumulToy = null;
        function drawCumulativeStatsHud() {
            if (currentScene !== SCENE.CRAWL && currentScene !== SCENE.CRAWL2 && currentScene !== SCENE.TODDLE1 && currentScene !== SCENE.CHILD1 && currentScene !== SCENE.CHILD2) {
                cumulHudAlpha = 0;
                return;
            }
            let hovToy = null;
            toneDrops.forEach(drop => {
                if (drop.isHovered && drop.toy) hovToy = drop.toy;
            });
            if (hovToy) {
                lastCumulToy = hovToy;
                cumulHudAlpha = Math.min(1, cumulHudAlpha + 0.08);
            } else {
                cumulHudAlpha = Math.max(0, cumulHudAlpha - 0.06);
            }
            if (cumulHudAlpha < 0.01 || !lastCumulToy) return;

            // Accumulate: all previously selected toys + hovered toy
            const totals = {};
            const allToys = [...selectedToys, lastCumulToy];
            allToys.forEach(t => {
                if (!t.labels) return;
                Object.entries(t.labels).forEach(([k, v]) => {
                    totals[k] = (totals[k] || 0) + v;
                });
            });

            // Sort by value descending, filter out zero
            const entries = Object.entries(totals)
                .filter(([, v]) => v > 0)
                .map(([label, value]) => ({ label, value }))
                .sort((a, b) => b.value - a.value);

            if (!entries.length) return;

            const grandTotal = entries.reduce((s, e) => s + e.value, 0);
            const maxVal = entries[0].value;

            ctx.save();
            ctx.globalAlpha = cumulHudAlpha;

            const panelW = 220;
            const lineH = 22;
            const panelH = 48 + entries.length * lineH + 10;
            const px = width - panelW - 18;
            const py = 18;

            // Panel background
            ctx.fillStyle = "rgba(30, 32, 42, 0.72)";
            ctx.beginPath(); ctx.roundRect(px, py, panelW, panelH, 10); ctx.fill();
            ctx.strokeStyle = "rgba(255,255,255,0.15)";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.roundRect(px, py, panelW, panelH, 10); ctx.stroke();

            let cy = py + 16;

            // Header
            ctx.fillStyle = "rgba(255,255,255,0.95)";
            ctx.font = "700 13px 'Zen Maru Gothic', sans-serif";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText("Life Labels Total", px + 14, cy);
            // Grand total badge
            ctx.fillStyle = "rgba(229, 142, 170, 0.85)";
            ctx.font = "700 12px 'Zen Maru Gothic', sans-serif";
            ctx.textAlign = "right";
            ctx.fillText(`${grandTotal} pts`, px + panelW - 14, cy);
            ctx.textAlign = "left";
            cy += 10;

            // Selected toys count
            ctx.fillStyle = "rgba(255,255,255,0.45)";
            ctx.font = "400 10px 'Zen Maru Gothic', sans-serif";
            ctx.fillText(`${selectedToys.length} selected + 1 preview`, px + 14, cy);
            cy += 18;

            // Label bars (sorted by value)
            const barMaxW = panelW - 62;
            entries.forEach(e => {
                // Bar background
                ctx.fillStyle = "rgba(255,255,255,0.08)";
                ctx.beginPath(); ctx.roundRect(px + 14, cy - 6, barMaxW, 14, 3); ctx.fill();
                // Bar fill
                const barW = (e.value / maxVal) * barMaxW;
                const barG = ctx.createLinearGradient(px + 14, 0, px + 14 + barW, 0);
                barG.addColorStop(0, "rgba(229, 142, 170, 0.65)");
                barG.addColorStop(1, "rgba(198, 128, 219, 0.65)");
                ctx.fillStyle = barG;
                ctx.beginPath(); ctx.roundRect(px + 14, cy - 6, barW, 14, 3); ctx.fill();
                // Label text
                ctx.fillStyle = "rgba(255,255,255,0.9)";
                ctx.font = "500 10px 'Zen Maru Gothic', sans-serif";
                ctx.textAlign = "left";
                ctx.fillText(e.label, px + 18, cy + 1);
                // Value
                ctx.textAlign = "right";
                ctx.font = "700 11px 'Zen Maru Gothic', sans-serif";
                ctx.fillText(String(e.value), px + panelW - 14, cy + 1);
                ctx.textAlign = "left";
                cy += lineH;
            });

            ctx.restore();
        }

        // Chord hover preview system — independent of groove loop
        let chordPreviewSynth = null;
        let chordPreviewDrop = null;
        let chordPreviewBarIndex = 0;

        function startChordPreview(drop) {
            stopChordPreview();
            if (!drop.chordProgression || !baseGroove || !baseRhythmInfo) return;
            // Create a dedicated preview synth
            try {
                chordPreviewSynth = new Tone.PolySynth(Tone.Synth, {
                    oscillator: { type: "triangle4" },
                    envelope: { attack: 0.04, decay: 0.5, sustain: 0.25, release: 0.6 },
                    volume: -14
                }).toDestination();
            } catch (e) { return; }
            chordPreviewDrop = drop;
            const barSteps = STEPS_PER_BEAT * baseRhythmInfo.beatsPerBar;
            const totalSteps = barSteps * baseRhythmInfo.bars;
            const currentStep = ((baseGroove.step % totalSteps) + totalSteps) % totalSteps;
            const currentBar = Math.floor(currentStep / barSteps) % drop.chordProgression.notes.length;
            const isBarHead = (currentStep % barSteps) === 0;

            // If hovered mid-bar, wait for the next bar head.
            chordPreviewBarIndex = isBarHead
                ? currentBar
                : ((currentBar + 1) % drop.chordProgression.notes.length);
            if (isBarHead) playChordPreviewNote();
        }

        function playChordPreviewNote() {
            if (!chordPreviewSynth || !chordPreviewDrop || !chordPreviewDrop.chordProgression) return;
            const notes = chordPreviewDrop.chordProgression.notes;
            const chord = notes[chordPreviewBarIndex % notes.length];
            try {
                chordPreviewSynth.triggerAttackRelease(chord, "2n");
                chordPreviewDrop.ripples.push({ t: 0, accent: 0.85 });
            } catch (e) { /* ignore */ }
            chordPreviewBarIndex++;
        }

        function stopChordPreview() {
            if (chordPreviewSynth) {
                try { chordPreviewSynth.dispose(); } catch (e) {}
                chordPreviewSynth = null;
            }
            chordPreviewDrop = null;
            chordPreviewBarIndex = 0;
        }

        function updateToneDropProximity() {
            if ((currentScene !== SCENE.CRAWL && currentScene !== SCENE.CRAWL2 && currentScene !== SCENE.TODDLE1 && currentScene !== SCENE.CHILD1 && currentScene !== SCENE.CHILD2 && currentScene !== SCENE.ADULT) || !toneDrops.length) {
                return;
            }

            if (isMinigameActive && minigameTriggerDrop) {
                toneDrops.forEach(drop => {
                    const isTrigger = (drop === minigameTriggerDrop);
                    drop.isHovered = isTrigger;
                    const targetAlpha = isTrigger ? 1 : 0;
                    drop.overlapAlpha += (targetAlpha - drop.overlapAlpha) * 0.18;

                    if (drop.instrument === "chord") {
                        if (isTrigger && !chordPreviewDrop) {
                            startChordPreview(drop);
                        } else if (!isTrigger && chordPreviewDrop === drop) {
                            stopChordPreview();
                        }
                    }
                });
                if (currentScene === SCENE.CHILD2) {
                    hoveredSchoolActivity = minigameTriggerDrop.activityId;
                }
                return;
            }

            toneDrops.forEach(drop => {
                const dist = Math.hypot(orbWorldX - drop.x, orbWorldY - drop.y);
                const hoverR = (drop.instrument === "chord" || drop.instrument === "bass") ? 60 : 50;
                const wasHovered = drop.isHovered;
                drop.isHovered = dist <= hoverR;
                drop.proximityVol = drop.isHovered ? -12 : -100;
                const target = drop.isHovered ? 1 : 0;
                drop.overlapAlpha += (target - drop.overlapAlpha) * 0.18;

                // Chord preview: start when hover begins, stop when hover ends
                if (drop.instrument === "chord") {
                    if (drop.isHovered && !wasHovered) {
                        startChordPreview(drop);
                    } else if (!drop.isHovered && wasHovered && chordPreviewDrop === drop) {
                        stopChordPreview();
                    }
                }
            });
            // Track hovered bass activity for school background glow
            if (currentScene === SCENE.CHILD2) {
                const hov = toneDrops.find(d => d.instrument === "bass" && d.isHovered);
                hoveredSchoolActivity = hov ? hov.activityId : null;
            }
        }

        function buildHiHatPattern(baseInfo, variant) {
            const totalBeats = baseInfo.beatsPerBar * baseInfo.bars;
            const pattern = new Array(totalBeats * STEPS_PER_BEAT).fill(false);
            const put = (beatIndex, mode = 'on') => {
                if (beatIndex < 0 || beatIndex >= totalBeats) return;
                const base = beatIndex * STEPS_PER_BEAT;
                const set = (offset) => {
                    const idx = base + offset;
                    if (idx >= 0 && idx < pattern.length) pattern[idx] = true;
                };
                if (mode === 'on') set(0);           // 表
                else if (mode === 'off') set(2);     // 裏
                else if (mode === 'push') set(1);    // 前ノリ
                else if (mode === 'late') set(3);    // 後ノリ
                else if (mode === 'double') { set(0); set(2); }
                else if (mode === 'split') { set(1); set(3); }
                else set(0);
            };

            for (let bar = 0; bar < baseInfo.bars; bar++) {
                const b = bar * baseInfo.beatsPerBar;

                // 4 clearly separated archetypes with multiple A-style placements.
                if (variant === 0) {
                    // Anchor: clear pulse, occasional offbeat decoration.
                    put(b, 'on');
                    if (baseInfo.beatsPerBar >= 3) put(b + 2, bar % 2 === 0 ? 'on' : 'off');
                    if (baseInfo.beatsPerBar >= 4 && bar % 2 === 1) put(b + 3, 'off');
                    continue;
                }

                if (variant === 1) {
                    // Backbeat: beat 2/4 core with push/late alternatives.
                    if (baseInfo.beatsPerBar >= 2) put(b + 1, bar % 2 === 0 ? 'on' : 'push');
                    if (baseInfo.beatsPerBar >= 4) put(b + 3, bar % 2 === 0 ? 'on' : 'late');
                    else if (baseInfo.beatsPerBar === 3) put(b + 2, 'off');
                    continue;
                }

                if (variant === 2) {
                    // Dense: line-up with mixed A variants.
                    for (let i = 0; i < baseInfo.beatsPerBar; i++) {
                        const mode = (i + bar) % 3 === 0 ? 'double' : ((i + bar) % 2 === 0 ? 'off' : 'on');
                        put(b + i, mode);
                    }
                    if (baseInfo.beatsPerBar >= 4) put(b + 1, 'push');
                    continue;
                }

                // v3: syncopated-phrase with late accents.
                for (let i = 0; i < baseInfo.beatsPerBar; i++) {
                    if ((i + bar) % 2 === 0) put(b + i, 'split');
                }
                put(b + baseInfo.beatsPerBar - 1, 'late');
                if (baseInfo.beatsPerBar >= 4) put(b + 1, bar % 2 === 0 ? 'off' : 'push');
            }

            return pattern;
        }

        function createSpacedDropXs(count, minGap, minX, maxX) {
            for (let attempt = 0; attempt < 120; attempt++) {
                const xs = [];
                for (let i = 0; i < count; i++) xs.push(randInt(minX, maxX));
                xs.sort((a, b) => a - b);
                let ok = true;
                for (let i = 1; i < xs.length; i++) {
                    if (xs[i] - xs[i - 1] < minGap) {
                        ok = false;
                        break;
                    }
                }
                if (ok) return xs;
            }
            const span = maxX - minX;
            const step = Math.max(minGap, Math.floor(span / Math.max(1, count - 1)));
            const xs = [];
            for (let i = 0; i < count; i++) xs.push(minX + i * step);
            return xs;
        }

        function primeToneDrops() {
            toneDrops.forEach(drop => {
                drop.isFilled = true;
                drop.fillLevel = 1;
                drop.jellyPulse = 0;
                drop.jellyDrain = false;
                drop.fillOriginX = 0;
                drop.fillOriginY = 0;
            });
        }

        function disposeToneDrops() {
            stopChordPreview();
            toneDrops.forEach(d => {
                if (d.hatClosedSynth) d.hatClosedSynth.dispose();
                if (d.hatOpenSynth) d.hatOpenSynth.dispose();
                if (d.hatFilter) d.hatFilter.dispose();
                if (d.snareSynth) d.snareSynth.dispose();
                if (d.snareFilter) d.snareFilter.dispose();
                if (d.snareBody) d.snareBody.dispose();
                if (d.cymbalSynth) d.cymbalSynth.dispose();
                if (d.chordSynth) d.chordSynth.dispose();
                if (d.bassSynth) d.bassSynth.dispose();
                if (d.guitarSynth) d.guitarSynth.dispose();
                if (d.guitarEffects) d.guitarEffects.forEach(e => e.dispose());
            });
        }

        function disposeCarryHatLayer() {
            if (carryHatSynth) {
                carryHatSynth.dispose();
                carryHatSynth = null;
            }
            if (carryHatFilter) {
                carryHatFilter.dispose();
                carryHatFilter = null;
            }
        }

        function initCarryHatLayer() {
            disposeCarryHatLayer();
            const pattern = inheritedHatPattern || (baseRhythmInfo ? baseRhythmInfo.baseHatPattern : null);
            if (!pattern) return;
            const cfg = inheritedHatSoundConfig || { noise: "white", hp: 7600, q: 0.55, decay: 0.05, release: 0.016 };
            carryHatFilter = new Tone.Filter({
                type: "highpass",
                frequency: cfg.hp,
                Q: cfg.q
            }).toDestination();
            carryHatSynth = new Tone.NoiseSynth({
                noise: { type: cfg.noise },
                envelope: { attack: 0.001, decay: cfg.decay, sustain: 0, release: cfg.release },
                volume: inheritedHatVolumeDb
            }).connect(carryHatFilter);
        }

        function disposeCarrySnareLayer() {
            if (carrySnareSynth) {
                carrySnareSynth.dispose();
                carrySnareSynth = null;
            }
            if (carrySnareFilter) {
                carrySnareFilter.dispose();
                carrySnareFilter = null;
            }
            if (carrySnareBody) {
                carrySnareBody.dispose();
                carrySnareBody = null;
            }
        }

        function initCarrySnareLayer() {
            disposeCarrySnareLayer();
            if (!inheritedSnarePattern) return;
            const cfg = inheritedSnareSoundConfig || { noise: "white", bp: 1800, q: 0.7, decay: 0.12, release: 0.08, body: true };
            carrySnareFilter = new Tone.Filter({
                type: "bandpass",
                frequency: cfg.bp,
                Q: cfg.q
            }).toDestination();
            carrySnareSynth = new Tone.NoiseSynth({
                noise: { type: cfg.noise },
                envelope: { attack: 0.001, decay: cfg.decay, sustain: 0, release: cfg.release },
                volume: inheritedSnareVolumeDb
            }).connect(carrySnareFilter);
            carrySnareBody = cfg.body ? new Tone.MembraneSynth({
                pitchDecay: 0.025,
                octaves: 2.5,
                oscillator: { type: "triangle" },
                envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.06 },
                volume: inheritedSnareBodyVolumeDb
            }).toDestination() : null;
        }

        function disposeCarryCymbalLayer() {
            if (carryCymbalSynth) {
                carryCymbalSynth.dispose();
                carryCymbalSynth = null;
            }
        }

        function initCarryCymbalLayer() {
            disposeCarryCymbalLayer();
            if (!inheritedCymbalPattern) return;
            const cfg = inheritedCymbalSoundConfig || { freq: 280, harmonicity: 5.1, modulationIndex: 30, resonance: 4000, decay: 0.8 };
            carryCymbalSynth = new Tone.MetalSynth({
                frequency: cfg.freq,
                harmonicity: cfg.harmonicity,
                modulationIndex: cfg.modulationIndex,
                resonance: cfg.resonance,
                envelope: { attack: 0.001, decay: cfg.decay, release: 0.05 },
                volume: inheritedCymbalVolumeDb
            }).toDestination();
        }

        function disposeCarryChordLayer() {
            if (carryChordSynth) {
                carryChordSynth.dispose();
                carryChordSynth = null;
            }
            carryChordPattern = null;
        }

        function initCarryChordLayer() {
            disposeCarryChordLayer();
            if (!inheritedChordProgression || !baseRhythmInfo) return;
            const chosenFac = CHILD_FACILITIES.find(f => f.id === childLifeChoice);
            const oscType = chosenFac ? chosenFac.oscType : "triangle4";
            carryChordSynth = new Tone.PolySynth(Tone.Synth, {
                oscillator: { type: oscType },
                envelope: { attack: 0.05, decay: 0.6, sustain: 0.3, release: 0.8 },
                volume: -14
            }).toDestination();
            // Store chord notes for playback in tick
            carryChordPattern = inheritedChordProgression.notes;
        }

        let carryBassSynth = null;
        let carryBassFilter = null;
        const inheritedBassVolumeDb = -16;

        function disposeCarryBassLayer() {
            if (carryBassSynth) { carryBassSynth.dispose(); carryBassSynth = null; }
            if (carryBassFilter) { carryBassFilter.dispose(); carryBassFilter = null; }
        }

        function initCarryBassLayer() {
            disposeCarryBassLayer();
            if (!inheritedBassPattern || !inheritedBassNotes) return;
            const BASS_TIMBRES = {
                energetic:     { osc: "sawtooth", attack: 0.01, decay: 0.15, sustain: 0.35, release: 0.25, filterBase: 150, filterOct: 3 },
                soft:          { osc: "sine",     attack: 0.06, decay: 0.5,  sustain: 0.5,  release: 0.8,  filterBase: 80,  filterOct: 1.5 },
                quirky:        { osc: "square",   attack: 0.01, decay: 0.2,  sustain: 0.25, release: 0.3,  filterBase: 120, filterOct: 2.8 },
                contemplative: { osc: "sine",     attack: 0.08, decay: 0.6,  sustain: 0.6,  release: 1.2,  filterBase: 60,  filterOct: 1.2 },
                groovy:        { osc: "triangle", attack: 0.01, decay: 0.2,  sustain: 0.3,  release: 0.3,  filterBase: 130, filterOct: 2.5 },
                playful:       { osc: "triangle", attack: 0.01, decay: 0.12, sustain: 0.2,  release: 0.2,  filterBase: 160, filterOct: 3.2 },
                melodic:       { osc: "sine",     attack: 0.03, decay: 0.35, sustain: 0.45, release: 0.6,  filterBase: 100, filterOct: 2 }
            };
            const timbre = BASS_TIMBRES[inheritedBassSoundConfig] || BASS_TIMBRES.soft;
            carryBassSynth = new Tone.MonoSynth({
                oscillator: { type: timbre.osc },
                envelope: { attack: timbre.attack, decay: timbre.decay, sustain: timbre.sustain, release: timbre.release },
                filterEnvelope: {
                    attack: timbre.attack * 0.5, decay: timbre.decay, sustain: timbre.sustain, release: timbre.release,
                    baseFrequency: timbre.filterBase, octaves: timbre.filterOct
                },
                volume: inheritedBassVolumeDb
            }).toDestination();
        }

        function initChordDrops() {
            disposeToneDrops();
            toneDrops = [];
            childFacilityLayouts = [];
            if (!baseRhythmInfo) return;

            // Select 4 facilities based on player's life labels
            childFacilities = selectChildFacilities();

            const floorY = height * ROOM_WALL_RATIO + TONE_FLOOR_OFFSET;
            const groundY = height * ROOM_WALL_RATIO;
            const count = 4;
            const startX = worldWidth * 0.06;
            const endX = worldWidth * 0.94;
            const totalSpan = endX - startX;

            // Calculate weighted widths for each facility
            const baseSlotW = totalSpan / count;
            const rawWidths = childFacilities.slice(0, count).map(f => baseSlotW * (f.sizeW || 1));
            const totalRawW = rawWidths.reduce((a, b) => a + b, 0);
            // Normalize so total fits in totalSpan
            const slotWidths = rawWidths.map(w => w * totalSpan / totalRawW);

            // Compute center positions with jitter
            const positions = [];
            let cursor = startX;
            for (let i = 0; i < count; i++) {
                const slotW = slotWidths[i];
                const jitter = (Math.random() - 0.5) * slotW * 0.12;
                const cx = cursor + slotW * 0.5 + jitter;
                positions.push(cx);
                // Building size from facility properties
                const bW = Math.min(slotW * 0.72, 220) * (childFacilities[i].sizeW || 1);
                const bH = groundY * (childFacilities[i].sizeH || 0.50);
                childFacilityLayouts.push({ cx, bW, bH });
                cursor += slotW;
            }

            for (let i = 0; i < count; i++) {
                const fac = childFacilities[i];
                const mode = fac.chordMode === "minor" ? "home" : "kindergarten";
                const prog = generateChordProgression(mode);
                const bundle = buildChordPattern(baseRhythmInfo);
                const chordSynth = new Tone.PolySynth(Tone.Synth, {
                    oscillator: { type: fac.oscType },
                    envelope: { attack: 0.05, decay: 0.6, sustain: 0.3, release: 0.8 },
                    volume: -100
                }).toDestination();
                toneDrops.push({
                    x: positions[i],
                    y: floorY + (i % 2 === 0 ? -8 : 8),
                    pattern: bundle.pattern,
                    velocityPattern: bundle.velocity,
                    proximityVol: -100,
                    isHovered: false,
                    overlapAlpha: 0,
                    instrument: "chord",
                    chordSynth,
                    chordProgression: prog,
                    chordSide: fac.id,
                    facilityName: fac.name,
                    dropColor: fac.color,
                    ripples: []
                });
            }
            primeToneDrops();
        }

        // Build bass note sequence from chord progression root notes
        // Most notes are 1 step; some styles sprinkle in 2-step or 4-step sustained notes.
        // Returns { pattern, notes, attacks, durations, sustainType }
        //   sustainType[i]: 'single' | 'start' | 'mid' | 'end' | null (for HUD visuals)
        function buildBassLine(baseInfo, style, chordProg, variant = 0) {
            const totalSteps = baseInfo.beatsPerBar * baseInfo.bars * STEPS_PER_BEAT;
            const barSteps = baseInfo.beatsPerBar * STEPS_PER_BEAT;

            const rootNotes = chordProg.notes.map(triad => triad[0].replace(/\d+$/, '') + '2');
            const fifthNotes = chordProg.notes.map(triad => triad[2].replace(/\d+$/, '') + '2');
            const thirdNotes = chordProg.notes.map(triad => triad[1].replace(/\d+$/, '') + '2');

            const events = []; // { step, note, len }
            const add = (si, note, len) => {
                if (si >= 0 && si < totalSteps && note) {
                    events.push({ step: si, note, len: Math.min(len, totalSteps - si) });
                }
            };
            const S = STEPS_PER_BEAT; // 4

            for (let bar = 0; bar < baseInfo.bars; bar++) {
                const b = bar * barSteps;
                const root = rootNotes[bar % rootNotes.length];
                const fifth = fifthNotes[bar % fifthNotes.length];
                const third = thirdNotes[bar % thirdNotes.length];
                const nextRoot = rootNotes[(bar + 1) % rootNotes.length];

                if (style === "energetic") {
                    if (variant === 0) {
                        // Driving syncopation with end-of-bar push (sports_field cool groove)
                        add(b, root, 1);
                        add(b + 2, fifth, 1);
                        if (baseInfo.beatsPerBar >= 2) add(b + S + 1, root, 1);
                        if (baseInfo.beatsPerBar >= 3) add(b + 2 * S, fifth, 1);
                        if (baseInfo.beatsPerBar >= 4) {
                            add(b + 3 * S + 1, third, 1);
                            add(b + 3 * S + 3, nextRoot, 1);
                        }
                    } else {
                        // Four-on-the-floor backbone plus offbeat stab
                        for (let beat = 0; beat < baseInfo.beatsPerBar; beat++) {
                            const isLong = (beat === 0 && bar % 2 === 0);
                            add(b + beat * S, beat % 2 === 0 ? root : fifth, isLong ? 2 : 1);
                            add(b + beat * S + 2, beat % 2 === 0 ? fifth : root, 1);
                        }
                    }
                } else if (style === "soft") {
                    if (variant === 0) {
                        // Long, settled tones with minimal motion
                        add(b, root, 3);
                        if (baseInfo.beatsPerBar >= 3) add(b + 2 * S, fifth, 1);
                    } else {
                        // Calm pulse with a gentle pickup
                        add(b, root, 2);
                        if (baseInfo.beatsPerBar >= 2) add(b + S + 2, third, 1);
                        if (baseInfo.beatsPerBar >= 4) add(b + 3 * S, root, 2);
                    }
                } else if (style === "quirky") {
                    if (variant === 0) {
                        // Offbeat-heavy with one 2-step wobble
                        add(b + 2, root, 1);
                        if (baseInfo.beatsPerBar >= 2) add(b + S + 1, fifth, 2);
                        if (baseInfo.beatsPerBar >= 3) add(b + 2 * S + 3, root, 1);
                        if (baseInfo.beatsPerBar >= 4 && bar % 2 === 1) add(b + 3 * S, third, 1);
                    } else {
                        // Crooked accents and displaced downbeat
                        add(b + 1, third, 1);
                        if (baseInfo.beatsPerBar >= 2) add(b + S + 3, root, 1);
                        if (baseInfo.beatsPerBar >= 3) add(b + 2 * S + 1, fifth, 2);
                        if (baseInfo.beatsPerBar >= 4) add(b + 3 * S + (bar % 2 === 0 ? 0 : 2), root, 1);
                    }
                } else if (style === "contemplative") {
                    if (variant === 0) {
                        // Spacious sustained notes
                        add(b, root, 4);
                        if (bar % 2 === 1 && baseInfo.beatsPerBar >= 3) add(b + 2 * S, fifth, 1);
                    } else {
                        // Even more minimal, late-bar breath
                        add(b, root, 5);
                        if (baseInfo.beatsPerBar >= 4) add(b + 3 * S + 1, third, 1);
                    }
                } else if (style === "groovy") {
                    if (variant === 0) {
                        // Pocket groove: downbeat anchor + offbeat pops
                        add(b, root, 2);
                        if (baseInfo.beatsPerBar >= 2) add(b + S + 2, root, 1);
                        if (baseInfo.beatsPerBar >= 3) add(b + 2 * S, fifth, 1);
                        if (baseInfo.beatsPerBar >= 4) add(b + 3 * S + 2, third, 1);
                    } else {
                        // Talkative syncopation, still danceable
                        add(b, root, 1);
                        if (baseInfo.beatsPerBar >= 2) add(b + S + 1, fifth, 1);
                        if (baseInfo.beatsPerBar >= 3) add(b + 2 * S + 2, root, 1);
                        if (baseInfo.beatsPerBar >= 4) add(b + 3 * S + 3, nextRoot, 1);
                    }
                } else if (style === "playful") {
                    if (variant === 0) {
                        // Bouncy alternating pulse with a 16th fill
                        for (let beat = 0; beat < baseInfo.beatsPerBar; beat++) {
                            add(b + beat * S, beat % 2 === 0 ? root : fifth, 1);
                        }
                        if (baseInfo.beatsPerBar >= 2) {
                            const lb = b + (baseInfo.beatsPerBar - 1) * S;
                            for (let s = 0; s < S; s++) add(lb + s, s % 2 === 0 ? root : fifth, 1);
                        }
                    } else {
                        // Playful call-and-response stabs
                        add(b, root, 1);
                        if (baseInfo.beatsPerBar >= 2) add(b + S + 2, third, 1);
                        if (baseInfo.beatsPerBar >= 3) add(b + 2 * S + 1, fifth, 1);
                        if (baseInfo.beatsPerBar >= 4) {
                            add(b + 3 * S, root, 1);
                            add(b + 3 * S + 2, fifth, 1);
                        }
                    }
                } else if (style === "melodic") {
                    if (variant === 0) {
                        // Walking contour
                        const walk = [root, third, fifth, nextRoot];
                        for (let beat = 0; beat < Math.min(baseInfo.beatsPerBar, 4); beat++) {
                            const isLong = (beat === 0);
                            add(b + beat * S, walk[beat % walk.length], isLong ? 2 : 1);
                        }
                    } else {
                        // Arpeggio-like rise with soft resolution
                        add(b, root, 2);
                        if (baseInfo.beatsPerBar >= 2) add(b + S, third, 1);
                        if (baseInfo.beatsPerBar >= 3) add(b + 2 * S, fifth, 1);
                        if (baseInfo.beatsPerBar >= 4) add(b + 3 * S + 1, nextRoot, 2);
                    }
                }
            }

            // Convert events into arrays
            const pattern = new Array(totalSteps).fill(false);
            const notes = new Array(totalSteps).fill(null);
            const attacks = new Array(totalSteps).fill(false);
            const durations = new Array(totalSteps).fill(null);
            const sustainType = new Array(totalSteps).fill(null); // for HUD visuals

            const stepToDur = (len) => {
                if (len <= 1) return "16n";
                if (len <= 2) return "8n";
                if (len <= 3) return "8n.";
                if (len <= 4) return "4n";
                if (len <= 6) return "4n.";
                if (len <= 8) return "2n";
                return "1n";
            };

            events.forEach(ev => {
                attacks[ev.step] = true;
                notes[ev.step] = ev.note;
                durations[ev.step] = stepToDur(ev.len);
                for (let s = ev.step; s < ev.step + ev.len && s < totalSteps; s++) {
                    pattern[s] = true;
                    if (!notes[s]) notes[s] = ev.note;
                }
                // Mark sustain type for visual display
                if (ev.len === 1) {
                    sustainType[ev.step] = 'single';
                } else {
                    for (let s = ev.step; s < ev.step + ev.len && s < totalSteps; s++) {
                        if (s === ev.step) sustainType[s] = 'start';
                        else if (s === ev.step + ev.len - 1) sustainType[s] = 'end';
                        else sustainType[s] = 'mid';
                    }
                }
            });

            return { pattern, notes, attacks, durations, sustainType };
        }

        // Guitar timbres — all PolySynth (chords) only (no PluckSynth/Reverb/Chorus — AudioWorklet breaks on file://)
        const GUITAR_TIMBRES = {
            "fingerpicking": { type: "poly",  wave: "triangle", attack: 0.003, decay: 0.5,  sustain: 0.08, release: 0.4 },
            "cutting":       { type: "poly",  wave: "square",   attack: 0.001, decay: 0.08, sustain: 0.0,  release: 0.05, filterFreq: 2000, filterType: "bandpass" },
            "clean-electric":{ type: "poly",  wave: "triangle", attack: 0.01,  decay: 0.6,  sustain: 0.4,  release: 0.8, vibratoFreq: 1.5, vibratoDepth: 0.08 },
            "acoustic-arpeggio": { type: "poly", wave: "triangle", attack: 0.002, decay: 0.4, sustain: 0.1, release: 0.35 },
            "rock":          { type: "polyDist", wave: "sawtooth", attack: 0.003, decay: 0.2, sustain: 0.35, release: 0.3, distortion: 0.5 }
        };

        function buildGuitarLine(baseInfo, style, chordProg, variant) {
            const totalSteps = baseInfo.beatsPerBar * baseInfo.bars * STEPS_PER_BEAT;
            const barSteps = baseInfo.beatsPerBar * STEPS_PER_BEAT;
            const S = STEPS_PER_BEAT; // 4

            // Extract chord tones — all chords in octave 4 (clearly audible guitar range)
            const chordRoots = chordProg.notes.map(triad => triad[0].replace(/\d+$/, ''));
            const chordThirds = chordProg.notes.map(triad => triad[1].replace(/\d+$/, ''));
            const chordFifths = chordProg.notes.map(triad => triad[2].replace(/\d+$/, ''));

            const events = []; // { step, note, len }  note is always an array (chord)
            const add = (si, note, len) => {
                if (si >= 0 && si < totalSteps && note) {
                    events.push({ step: si, note, len: Math.min(len, totalSteps - si) });
                }
            };

            for (let bar = 0; bar < baseInfo.bars; bar++) {
                const b = bar * barSteps;
                const R = chordRoots[bar % chordRoots.length];
                const T = chordThirds[bar % chordThirds.length];
                const F = chordFifths[bar % chordFifths.length];
                // Full triad chord in octave 4
                const chord4 = [R + "4", T + "4", F + "4"];
                // Wider voicing: root3 + third4 + fifth4
                const chordWide = [R + "3", T + "4", F + "4"];

                if (style === "fingerpicking") {
                    // Gentle arpeggiated chords — strum-like with slight spread
                    // Beat 1: full chord, Beat 3: root+fifth, occasional fills
                    if (variant === 0) {
                        add(b, chord4, 3);
                        if (baseInfo.beatsPerBar >= 3) add(b + 2 * S, [R + "4", F + "4"], 3);
                        if (baseInfo.beatsPerBar >= 4 && Math.random() > 0.3) {
                            add(b + 3 * S, [T + "4", F + "4"], 2);
                        }
                    } else {
                        // Every other beat gets a chord
                        for (let beat = 0; beat < baseInfo.beatsPerBar; beat += 2) {
                            add(b + beat * S, beat === 0 ? chord4 : [R + "4", F + "4"], 3);
                        }
                        if (baseInfo.beatsPerBar >= 4 && Math.random() > 0.4) {
                            add(b + 3 * S + 2, [T + "4", F + "4", R + "5"], 1);
                        }
                    }

                } else if (style === "cutting") {
                    // カッティング — staccato chord stabs on offbeats, funky rhythm
                    const offbeats = variant === 0 ? [2, 6, 10, 14] : [2, 6, 10];
                    for (const step of offbeats) {
                        if (step < barSteps) {
                            add(b + step, chord4, 1); // very short stab
                        }
                    }
                    // Accent hit on beat 1 every other bar
                    if (bar % 2 === 0) {
                        add(b, chord4, 1);
                    }
                    // Variant: extra syncopated ghost stab
                    if (variant === 1 && baseInfo.beatsPerBar >= 3 && Math.random() > 0.3) {
                        add(b + 2 * S + 3, [R + "4", F + "4"], 1);
                    }

                } else if (style === "clean-electric") {
                    // しっとり — sustained smooth chord, held across the bar
                    if (variant === 0) {
                        add(b, chordWide, barSteps);  // hold full bar
                    } else {
                        add(b, chordWide, Math.floor(barSteps * 0.6));
                        if (baseInfo.beatsPerBar >= 3) {
                            // Re-strum on beat 3
                            add(b + 2 * S, chord4, Math.floor(barSteps * 0.4));
                        }
                    }

                } else if (style === "acoustic-arpeggio") {
                    // Flowing chord arpeggios — chord hit then broken chord fills
                    if (variant === 0) {
                        add(b, chord4, 2);
                        if (baseInfo.beatsPerBar >= 2) add(b + S, [T + "4", F + "4"], 2);
                        if (baseInfo.beatsPerBar >= 3) add(b + 2 * S, [R + "4", F + "4", R + "5"], 2);
                        if (baseInfo.beatsPerBar >= 4) add(b + 3 * S, chordWide, 2);
                    } else {
                        // 8th-note chord rhythm
                        for (let beat = 0; beat < baseInfo.beatsPerBar; beat++) {
                            const ch = beat % 2 === 0 ? chord4 : [R + "4", F + "4"];
                            add(b + beat * S, ch, 2);
                            if (Math.random() > 0.4) {
                                add(b + beat * S + 2, [T + "4", F + "4"], 2);
                            }
                        }
                    }

                } else if (style === "rock") {
                    // パワーコード — driving power chords (root+5th+octave)
                    const power = [R + "4", F + "4", R + "5"];
                    if (variant === 0) {
                        add(b, power, 3);
                        if (baseInfo.beatsPerBar >= 3) add(b + 2 * S, power, 3);
                        if (baseInfo.beatsPerBar >= 4 && Math.random() > 0.4) {
                            add(b + 3 * S + 2, [R + "4", F + "4"], 1);
                            add(b + 3 * S + 3, power, 1);
                        }
                    } else {
                        // Heavy 8th note chug
                        for (let beat = 0; beat < baseInfo.beatsPerBar; beat++) {
                            add(b + beat * S, power, 2);
                            if (Math.random() > 0.25) {
                                add(b + beat * S + 2, [R + "4", F + "4"], 2);
                            }
                        }
                    }
                }
            }

            // Convert events into arrays
            const pattern = new Array(totalSteps).fill(false);
            const notes = new Array(totalSteps).fill(null);
            const attacks = new Array(totalSteps).fill(false);
            const durations = new Array(totalSteps).fill(null);

            const stepToDur = (len) => {
                if (len <= 1) return "16n";
                if (len <= 2) return "8n";
                if (len <= 3) return "8n.";
                if (len <= 4) return "4n";
                if (len <= 6) return "4n.";
                if (len <= 8) return "2n";
                return "1n";
            };

            events.forEach(ev => {
                attacks[ev.step] = true;
                notes[ev.step] = ev.note;
                durations[ev.step] = stepToDur(ev.len);
                for (let s = ev.step; s < ev.step + ev.len && s < totalSteps; s++) {
                    pattern[s] = true;
                    if (!notes[s]) notes[s] = ev.note;
                }
            });

            return { pattern, notes, attacks, durations };
        }

        function createGuitarSynth(style) {
            const cfg = GUITAR_TIMBRES[style];
            if (!cfg) return { synth: null, effects: [] };

            const effects = [];
            let synth;

            if (cfg.type === "mono") {
                // Pluck-like guitar via MonoSynth (no AudioWorklet)
                synth = new Tone.MonoSynth({
                    oscillator: { type: cfg.wave },
                    envelope: { attack: cfg.attack, decay: cfg.decay, sustain: cfg.sustain, release: cfg.release },
                    filterEnvelope: {
                        attack: cfg.attack, decay: cfg.decay * 0.8,
                        sustain: 0.1, release: cfg.release,
                        baseFrequency: cfg.filterBase, octaves: cfg.filterOct
                    },
                    volume: -100
                }).toDestination();

            } else if (cfg.type === "poly") {
                synth = new Tone.PolySynth(Tone.Synth, {
                    oscillator: { type: cfg.wave },
                    envelope: { attack: 0.005, decay: 0.25, sustain: 0.15, release: 0.4 },
                    volume: -100
                });
                if (cfg.filterType) {
                    const filter = new Tone.Filter({ type: cfg.filterType, frequency: cfg.filterFreq, Q: 1.5 });
                    effects.push(filter);
                    synth.chain(filter, Tone.Destination);
                } else if (cfg.vibratoFreq) {
                    const vibrato = new Tone.Vibrato({ frequency: cfg.vibratoFreq, depth: cfg.vibratoDepth });
                    effects.push(vibrato);
                    synth.chain(vibrato, Tone.Destination);
                } else {
                    synth.toDestination();
                }

            } else if (cfg.type === "polyDist") {
                synth = new Tone.PolySynth(Tone.Synth, {
                    oscillator: { type: cfg.wave },
                    envelope: { attack: 0.005, decay: 0.2, sustain: 0.3, release: 0.3 },
                    volume: -100
                });
                const dist = new Tone.Distortion(cfg.distortion);
                effects.push(dist);
                synth.chain(dist, Tone.Destination);
            }

            return { synth, effects };
        }

        function initBassDrops() {
            disposeToneDrops();
            toneDrops = [];
            if (!baseRhythmInfo || !inheritedChordProgression) return;

            const floorY = height * ROOM_WALL_RATIO + TONE_FLOOR_OFFSET;

            // Per-style synth timbres
            const BASS_TIMBRES = {
                energetic:     { osc: "sawtooth", attack: 0.01, decay: 0.15, sustain: 0.35, release: 0.25, filterBase: 150, filterOct: 3 },
                soft:          { osc: "sine",     attack: 0.06, decay: 0.5,  sustain: 0.5,  release: 0.8,  filterBase: 80,  filterOct: 1.5 },
                quirky:        { osc: "square",   attack: 0.01, decay: 0.2,  sustain: 0.25, release: 0.3,  filterBase: 120, filterOct: 2.8 },
                contemplative: { osc: "sine",     attack: 0.08, decay: 0.6,  sustain: 0.6,  release: 1.2,  filterBase: 60,  filterOct: 1.2 },
                groovy:        { osc: "triangle", attack: 0.01, decay: 0.2,  sustain: 0.3,  release: 0.3,  filterBase: 130, filterOct: 2.5 },
                playful:       { osc: "triangle", attack: 0.01, decay: 0.12, sustain: 0.2,  release: 0.2,  filterBase: 160, filterOct: 3.2 },
                melodic:       { osc: "sine",     attack: 0.03, decay: 0.35, sustain: 0.45, release: 0.6,  filterBase: 100, filterOct: 2 }
            };

            for (let i = 0; i < SCHOOL_ACTIVITIES.length; i++) {
                const act = SCHOOL_ACTIVITIES[i];
                const bassVariant = randInt(0, 1);
                const bassBundle = buildBassLine(baseRhythmInfo, act.bassStyle, inheritedChordProgression, bassVariant);

                const timbre = BASS_TIMBRES[act.bassStyle] || BASS_TIMBRES.soft;
                const bassSynth = new Tone.MonoSynth({
                    oscillator: { type: timbre.osc },
                    envelope: { attack: timbre.attack, decay: timbre.decay, sustain: timbre.sustain, release: timbre.release },
                    filterEnvelope: {
                        attack: timbre.attack * 0.5, decay: timbre.decay, sustain: timbre.sustain, release: timbre.release,
                        baseFrequency: timbre.filterBase, octaves: timbre.filterOct
                    },
                    volume: -100
                }).toDestination();

                // Place drop within the activity's worldFraction range
                const minX = worldWidth * act.worldFraction[0];
                const maxX = worldWidth * act.worldFraction[1];
                const cx = minX + (maxX - minX) * 0.5;

                toneDrops.push({
                    x: cx,
                    y: floorY + (i % 2 === 0 ? -8 : 8),
                    pattern: bassBundle.pattern,
                    bassNotes: bassBundle.notes,
                    bassAttacks: bassBundle.attacks,
                    bassDurations: bassBundle.durations,
                    bassSustainType: bassBundle.sustainType,
                    velocityPattern: null,
                    proximityVol: -100,
                    isHovered: false,
                    overlapAlpha: 0,
                    instrument: "bass",
                    bassSynth,
                    bassStyle: act.bassStyle,
                    bassVariant,
                    activityId: act.id,
                    activityName: act.name,
                    dropColor: act.color,
                    activityLabels: act.labels,
                    ripples: []
                });
            }
            primeToneDrops();
        }

        function initToneDrops() {
            disposeToneDrops();
            toneDrops = [];
            if (!baseRhythmInfo) return;

            const count = 4;
            const floorY = height * ROOM_WALL_RATIO + TONE_FLOOR_OFFSET;
            const xs = createSpacedDropXs(count, 200, 180, worldWidth - 180);
            const toyPool = toySystem.TOY_LIBRARY.slice();
            for (let i = toyPool.length - 1; i > 0; i--) {
                const j = randInt(0, i);
                [toyPool[i], toyPool[j]] = [toyPool[j], toyPool[i]];
            }
            const hatTimbres = [
                { noise: "white", hp: 7600, q: 0.5, decay: 0.04, mode: "closed" },
                { noise: "pink", hp: 6800, q: 0.7, decay: 0.055, mode: "closed" },
                { noise: "white", hp: 9200, q: 0.4, decay: 0.03, mode: "closed" },
                { noise: "brown", hp: 6200, q: 0.8, decay: 0.05, mode: "mixed-open" }
            ];

            for (let i = 0; i < count; i++) {
                const timbre = hatTimbres[i % hatTimbres.length];
                const hatSoundConfig = { noise: timbre.noise, hp: timbre.hp, q: timbre.q, decay: timbre.decay, release: 0.015 };
                const hatFilter = new Tone.Filter({
                    type: "highpass",
                    frequency: timbre.hp,
                    Q: timbre.q
                }).toDestination();
                const hatClosedSynth = new Tone.NoiseSynth({
                    noise: { type: timbre.noise },
                    envelope: { attack: 0.001, decay: timbre.decay, sustain: 0, release: 0.015 },
                    volume: -100
                }).connect(hatFilter);
                const hatOpenSynth = new Tone.NoiseSynth({
                    noise: { type: timbre.noise },
                    envelope: { attack: 0.001, decay: timbre.decay * 3.4, sustain: 0, release: 0.12 },
                    volume: -100
                }).connect(hatFilter);
                const pattern = buildHiHatPattern(baseRhythmInfo, i);
                const toy = toyPool.length ? toyPool[i % toyPool.length] : null;
                const audioProfile = toy ? toy.audio : { density:[1,2], pitchMotion:[1,2], rhythmMotion:[1,1], openness:[0,1] };
                toneDrops.push({
                    x: xs[i],
                    y: floorY + (i % 2 === 0 ? -8 : 8),
                    pattern: applyToyPatternProfile(pattern, audioProfile),
                    velocityPattern: null,
                    proximityVol: -100,
                    isHovered: false,
                    overlapAlpha: 0,
                    hatClosedSynth,
                    hatOpenSynth,
                    hatFilter,
                    hatMode: timbre.mode,
                    hatSoundConfig,
                    instrument: "hat",
                    toy,
                    toySeed: Math.random() * 10000,
                    audioProfile,
                    ripples: []
                });
            }
            phaseOneToyIds = toneDrops.map(d => d.toy?.id).filter(Boolean);
            primeToneDrops();
        }

        function buildSnarePattern(baseInfo, variant) {
            const totalSteps = baseInfo.beatsPerBar * baseInfo.bars * STEPS_PER_BEAT;
            const totalBeats = baseInfo.beatsPerBar * baseInfo.bars;
            const pattern = new Array(totalSteps).fill(false);
            const velocity = new Array(totalSteps).fill(0);
            const put = (beatIndex, mode = "on", vel = 0.88) => {
                if (beatIndex < 0 || beatIndex >= totalBeats) return;
                const base = beatIndex * STEPS_PER_BEAT;
                const slot = mode === "off" ? 2 : (mode === "push" ? 1 : (mode === "late" ? 3 : 0));
                const idx = base + slot;
                if (idx < 0 || idx >= totalSteps) return;
                pattern[idx] = true;
                velocity[idx] = Math.max(velocity[idx], vel);
            };

            for (let bar = 0; bar < baseInfo.bars; bar++) {
                const b = bar * baseInfo.beatsPerBar;
                if (variant === 0) {
                    // Classic backbeat
                    if (baseInfo.beatsPerBar >= 2) put(b + 1, "on", 0.98);
                    put(b + baseInfo.beatsPerBar - 1, "on", 0.86);
                    if (bar % 2 === 1) put(b, "off", 0.55);
                    continue;
                }
                if (variant === 1) {
                    // Push groove
                    if (baseInfo.beatsPerBar >= 2) put(b + 1, "push", 0.84);
                    put(b + baseInfo.beatsPerBar - 1, "late", 0.92);
                    if (bar % 2 === 0) put(b, "on", 0.62);
                    continue;
                }
                if (variant === 2) {
                    // Sparse heavy accents
                    put(b, "on", 0.95);
                    if (baseInfo.beatsPerBar >= 3) put(b + 2, "off", 0.72);
                    if (bar % 2 === 1) put(b + baseInfo.beatsPerBar - 1, "on", 0.78);
                    continue;
                }
                if (variant === 3) {
                    // Ghost-note forward motion
                    if (baseInfo.beatsPerBar >= 2) put(b + 1, "on", 0.86);
                    if (baseInfo.beatsPerBar >= 3) put(b + 2, "push", 0.58);
                    put(b + baseInfo.beatsPerBar - 1, "late", 0.74);
                    continue;
                }
                // Variant 4: denser but controlled
                for (let i = 0; i < baseInfo.beatsPerBar; i++) {
                    if (i % 2 === 1) put(b + i, "on", 0.8 + (i === baseInfo.beatsPerBar - 1 ? 0.1 : 0));
                }
                put(b, bar % 2 === 0 ? "off" : "push", 0.52);
                put(b + baseInfo.beatsPerBar - 1, "on", 0.96);
            }
            return { pattern, velocity };
        }

        function buildCymbalPattern(baseInfo, variant) {
            const totalSteps = baseInfo.beatsPerBar * baseInfo.bars * STEPS_PER_BEAT;
            const totalBeats = baseInfo.beatsPerBar * baseInfo.bars;
            const pattern = new Array(totalSteps).fill(false);
            const velocity = new Array(totalSteps).fill(0);
            const put = (beatIndex, mode = "on", vel = 0.88) => {
                if (beatIndex < 0 || beatIndex >= totalBeats) return;
                const base = beatIndex * STEPS_PER_BEAT;
                const slot = mode === "off" ? 2 : (mode === "push" ? 1 : (mode === "late" ? 3 : 0));
                const idx = base + slot;
                if (idx < 0 || idx >= totalSteps) return;
                pattern[idx] = true;
                velocity[idx] = Math.max(velocity[idx], vel);
            };

            for (let bar = 0; bar < baseInfo.bars; bar++) {
                const b = bar * baseInfo.beatsPerBar;
                if (variant === 0) {
                    // v0 "ride": beat 1 each bar, occasional beat 3
                    put(b, "on", 0.92);
                    if (baseInfo.beatsPerBar >= 3 && bar % 2 === 0) put(b + 2, "on", 0.68);
                    continue;
                }
                if (variant === 1) {
                    // v1 "crash": only bar 1 & bar 3, accent build-up
                    if (bar === 0) put(b, "on", 0.98);
                    if (bar === 2) put(b, "on", 0.90);
                    if (bar === baseInfo.bars - 1) put(b + baseInfo.beatsPerBar - 1, "on", 0.78);
                    continue;
                }
                if (variant === 2) {
                    // v2 "splash": offbeat accents, very sparse
                    if (bar % 2 === 1 && baseInfo.beatsPerBar >= 2) put(b + 1, "off", 0.82);
                    if (bar === baseInfo.bars - 1) put(b, "push", 0.72);
                    continue;
                }
                // v3 "china": syncopated, irregular push/late placements
                if (bar % 2 === 0) put(b, "push", 0.86);
                else if (baseInfo.beatsPerBar >= 2) put(b + 1, "late", 0.80);
                if (bar === baseInfo.bars - 1 && baseInfo.beatsPerBar >= 3) put(b + 2, "on", 0.74);
            }
            return { pattern, velocity };
        }

        // Procedural Chord Progression Generator (CHILD1)
        // Uses music theory: diatonic chords + weighted Markov transitions
        function generateChordProgression(mode) {
            const TONE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

            // Key definitions with proper enharmonic note names
            const MAJOR_KEYS = [
                { root: 0,  notes: ['C','D','E','F','G','A','B'] },
                { root: 7,  notes: ['G','A','B','C','D','E','F#'] },
                { root: 2,  notes: ['D','E','F#','G','A','B','C#'] },
                { root: 5,  notes: ['F','G','A','Bb','C','D','E'] },
                { root: 10, notes: ['Bb','C','D','Eb','F','G','A'] },
                { root: 3,  notes: ['Eb','F','G','Ab','Bb','C','D'] },
                { root: 9,  notes: ['A','B','C#','D','E','F#','G#'] },
            ];
            const MINOR_KEYS = [
                { root: 9,  notes: ['A','B','C','D','E','F','G'] },
                { root: 4,  notes: ['E','F#','G','A','B','C','D'] },
                { root: 2,  notes: ['D','E','F','G','A','Bb','C'] },
                { root: 11, notes: ['B','C#','D','E','F#','G','A'] },
                { root: 0,  notes: ['C','D','Eb','F','G','Ab','Bb'] },
                { root: 7,  notes: ['G','A','Bb','C','D','Eb','F'] },
            ];

            const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
            const MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10];
            const MAJOR_QUALITIES = ['major','minor','minor','major','major','minor','dim'];
            const MINOR_QUALITIES = ['minor','dim','major','minor','minor','major','major'];
            const MAJOR_SUFFIXES = ['','m','m','','','m','\u00B0'];
            const MINOR_SUFFIXES = ['m','\u00B0','','m','m','',''];

            const isMajor = mode === 'kindergarten';
            const keys = isMajor ? MAJOR_KEYS : MINOR_KEYS;
            const key = keys[randInt(0, keys.length - 1)];
            const intervals = isMajor ? MAJOR_INTERVALS : MINOR_INTERVALS;
            const qualities = isMajor ? MAJOR_QUALITIES : MINOR_QUALITIES;
            const suffixes = isMajor ? MAJOR_SUFFIXES : MINOR_SUFFIXES;

            function triadMidi(degree) {
                const rootMidi = 48 + ((key.root + intervals[degree]) % 12);
                const q = qualities[degree];
                if (q === 'major') return [rootMidi, rootMidi + 4, rootMidi + 7];
                if (q === 'minor') return [rootMidi, rootMidi + 3, rootMidi + 7];
                return [rootMidi, rootMidi + 3, rootMidi + 6];
            }
            function midiToTone(midi) {
                return TONE_NAMES[midi % 12] + (Math.floor(midi / 12) - 1);
            }
            function chordName(degree) {
                return key.notes[degree] + suffixes[degree];
            }

            // Weighted Markov transitions: [targetDegree, weight]
            // Common = high weight, rare-but-valid = low weight
            const MAJOR_TRANS = {
                0: [[1,3],[2,1],[3,5],[4,5],[5,4]],
                1: [[4,5],[2,2],[6,1]],
                2: [[5,4],[3,3],[1,2]],
                3: [[4,5],[0,4],[1,2],[5,2],[6,1]],
                4: [[0,6],[5,3],[3,1]],
                5: [[3,5],[1,4],[4,3],[2,1]],
                6: [[0,5],[2,2]]
            };
            const MINOR_TRANS = {
                0: [[1,1],[2,2],[3,4],[4,3],[5,3],[6,3]],
                1: [[4,5],[6,3]],
                2: [[5,4],[3,3],[6,3]],
                3: [[4,5],[0,4],[6,2]],
                4: [[0,6],[5,3]],
                5: [[2,4],[3,3],[1,2],[6,2]],
                6: [[2,4],[0,3],[5,2],[4,2],[3,1]]
            };

            const trans = isMajor ? MAJOR_TRANS : MINOR_TRANS;
            const startW = isMajor
                ? [[0,5],[5,3],[3,2],[2,1]]
                : [[0,5],[5,3],[2,2],[3,1]];

            function weightedPick(options) {
                const total = options.reduce((s, o) => s + o[1], 0);
                let r = Math.random() * total;
                for (const [deg, w] of options) {
                    r -= w;
                    if (r <= 0) return deg;
                }
                return options[options.length - 1][0];
            }

            const degrees = [];
            let cur = weightedPick(startW);
            degrees.push(cur);
            for (let i = 1; i < 4; i++) {
                const opts = trans[cur];
                cur = (opts && opts.length) ? weightedPick(opts) : 0;
                degrees.push(cur);
            }

            return {
                name: degrees.map(d => chordName(d)).join('-'),
                chords: degrees.map(d => chordName(d)),
                notes: degrees.map(d => triadMidi(d).map(midiToTone))
            };
        }

        function buildChordPattern(baseInfo) {
            const totalSteps = baseInfo.beatsPerBar * baseInfo.bars * STEPS_PER_BEAT;
            const barSteps = baseInfo.beatsPerBar * STEPS_PER_BEAT;
            const pattern = new Array(totalSteps).fill(false);
            const velocity = new Array(totalSteps).fill(0);
            for (let bar = 0; bar < baseInfo.bars; bar++) {
                const idx = bar * barSteps;
                // Trigger on every beat in the bar for responsive hover preview
                for (let beat = 0; beat < baseInfo.beatsPerBar; beat++) {
                    const si = idx + beat * STEPS_PER_BEAT;
                    pattern[si] = true;
                    velocity[si] = beat === 0 ? 0.95 : 0.7;
                }
            }
            return { pattern, velocity };
        }

        function initSnareDrops() {
            disposeToneDrops();
            toneDrops = [];
            if (!baseRhythmInfo) return;

            const count = 5;
            const floorY = height * ROOM_WALL_RATIO + TONE_FLOOR_OFFSET;
            const xs = createSpacedDropXs(count, 165, 180, worldWidth - 180);
            const excluded = new Set(phaseOneToyIds);
            const uniquePool = toySystem.TOY_LIBRARY.filter(t => !excluded.has(t.id));
            const poolBase = uniquePool.length >= count ? uniquePool : toySystem.TOY_LIBRARY.slice();
            const toyPool = poolBase.slice();
            for (let i = toyPool.length - 1; i > 0; i--) {
                const j = randInt(0, i);
                [toyPool[i], toyPool[j]] = [toyPool[j], toyPool[i]];
            }

            const timbres = [
                { noise: "white", bp: 2050, q: 0.7, decay: 0.11, release: 0.08, body: true },
                { noise: "pink", bp: 1650, q: 1.0, decay: 0.16, release: 0.1, body: false },
                { noise: "brown", bp: 1280, q: 0.8, decay: 0.2, release: 0.12, body: true },
                { noise: "white", bp: 2520, q: 1.2, decay: 0.08, release: 0.06, body: false },
                { noise: "pink", bp: 1880, q: 0.9, decay: 0.13, release: 0.09, body: true }
            ];

            for (let i = 0; i < count; i++) {
                const timbre = timbres[i];
                const bundle = buildSnarePattern(baseRhythmInfo, i);
                const snareGainBoostDb = (i === 1 || i === 4) ? 6 : 0;
                const snareBodyBoostDb = (i === 1 || i === 4) ? 5 : 0;
                const snareSoundConfig = {
                    noise: timbre.noise,
                    bp: timbre.bp,
                    q: timbre.q,
                    decay: timbre.decay,
                    release: timbre.release,
                    body: timbre.body
                };
                const snareFilter = new Tone.Filter({
                    type: "bandpass",
                    frequency: timbre.bp,
                    Q: timbre.q
                }).toDestination();
                const snareSynth = new Tone.NoiseSynth({
                    noise: { type: timbre.noise },
                    envelope: { attack: 0.001, decay: timbre.decay, sustain: 0, release: timbre.release },
                    volume: -100
                }).connect(snareFilter);
                const snareBody = timbre.body ? new Tone.MembraneSynth({
                    pitchDecay: 0.025,
                    octaves: 2.5,
                    oscillator: { type: "triangle" },
                    envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.06 },
                    volume: -22
                }).toDestination() : null;
                const toy = toyPool.length ? toyPool[i % toyPool.length] : null;
                toneDrops.push({
                    x: xs[i],
                    y: floorY + (i % 2 === 0 ? -10 : 10),
                    pattern: bundle.pattern,
                    velocityPattern: bundle.velocity,
                    proximityVol: -100,
                    isHovered: false,
                    overlapAlpha: 0,
                    instrument: "snare",
                    snareSynth,
                    snareFilter,
                    snareBody,
                    snareSoundConfig,
                    snareGainBoostDb,
                    snareBodyBoostDb,
                    toy,
                    toySeed: Math.random() * 10000,
                    hudStyleClass: i % 2 === 0 ? "snare" : "snare-alt",
                    ripples: []
                });
            }
            phaseTwoToyIds = toneDrops.map(d => d.toy?.id).filter(Boolean);
            primeToneDrops();
        }

        function initCymbalDrops() {
            disposeToneDrops();
            toneDrops = [];
            if (!baseRhythmInfo) return;

            const count = 4;
            const floorY = height * ROOM_WALL_RATIO + TONE_FLOOR_OFFSET;
            const xs = createSpacedDropXs(count, 200, 180, worldWidth - 180);
            const excluded = new Set([...phaseOneToyIds, ...phaseTwoToyIds]);
            const uniquePool = toySystem.TOY_LIBRARY.filter(t => !excluded.has(t.id));
            const poolBase = uniquePool.length >= count ? uniquePool : toySystem.TOY_LIBRARY.slice();
            const toyPool = poolBase.slice();
            for (let i = toyPool.length - 1; i > 0; i--) {
                const j = randInt(0, i);
                [toyPool[i], toyPool[j]] = [toyPool[j], toyPool[i]];
            }

            const timbres = [
                { freq: 300, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, decay: 1.2, label: "ride" },
                { freq: 250, harmonicity: 5.4, modulationIndex: 40, resonance: 5000, decay: 0.8, label: "crash" },
                { freq: 400, harmonicity: 4.6, modulationIndex: 24, resonance: 5500, decay: 0.3, label: "splash" },
                { freq: 180, harmonicity: 3.8, modulationIndex: 48, resonance: 2800, decay: 0.6, label: "china" }
            ];

            for (let i = 0; i < count; i++) {
                const timbre = timbres[i];
                const bundle = buildCymbalPattern(baseRhythmInfo, i);
                const cymbalSoundConfig = {
                    freq: timbre.freq,
                    harmonicity: timbre.harmonicity,
                    modulationIndex: timbre.modulationIndex,
                    resonance: timbre.resonance,
                    decay: timbre.decay
                };
                const cymbalSynth = new Tone.MetalSynth({
                    frequency: timbre.freq,
                    harmonicity: timbre.harmonicity,
                    modulationIndex: timbre.modulationIndex,
                    resonance: timbre.resonance,
                    envelope: { attack: 0.001, decay: timbre.decay, release: 0.05 },
                    volume: -100
                }).toDestination();
                const toy = toyPool.length ? toyPool[i % toyPool.length] : null;
                toneDrops.push({
                    x: xs[i],
                    y: floorY + (i % 2 === 0 ? -10 : 10),
                    pattern: bundle.pattern,
                    velocityPattern: bundle.velocity,
                    proximityVol: -100,
                    isHovered: false,
                    overlapAlpha: 0,
                    instrument: "cymbal",
                    cymbalSynth,
                    cymbalSoundConfig,
                    toy,
                    toySeed: Math.random() * 10000,
                    hudStyleClass: i % 2 === 0 ? "cymbal" : "cymbal-alt",
                    ripples: []
                });
            }
            primeToneDrops();
        }

        function applyToyPatternProfile(pattern, profile) {
            const out = pattern.slice();
            const densityLevel = randInt(profile.density[0], profile.density[1]);
            if (densityLevel <= 1) return out;
            for (let i = 0; i < out.length; i += STEPS_PER_BEAT) {
                if (out[i]) {
                    if (densityLevel >= 2 && Math.random() < 0.35) out[i + 2] = true;
                    if (densityLevel >= 3 && Math.random() < 0.22) out[i + 1] = true;
                }
            }
            return out;
        }

        function startBaseGroove() {
            if (!baseRhythmInfo) return;
            if (baseGroove && baseGroove.timer) clearTimeout(baseGroove.timer);
            if (baseGroove && baseGroove.kickSynth) baseGroove.kickSynth.dispose();

            const kickSynth = new Tone.MembraneSynth({
                pitchDecay: 0.06,
                octaves: 5,
                oscillator: { type: "sine" },
                envelope: { attack: 0.001, decay: 0.45, sustain: 0, release: 0.2 },
                volume: -8
            }).toDestination();

            const stepMs = 60000 / baseRhythmInfo.bpm / STEPS_PER_BEAT;
            baseGroove = {
                step: 0,
                stepMs,
                nextTick: performance.now() + stepMs,
                timer: null,
                kickSynth
            };

            const tick = () => {
                if (!baseGroove || minigameMuteGroove) return;
                const now = performance.now();
                while (baseGroove.nextTick <= now + 4) {
                    const step = baseGroove.step;
                    if (baseRhythmInfo.kickPattern[step]) {
                        baseGroove.kickSynth.triggerAttackRelease("C1", "8n");
                    }
                    if (
                        (currentScene === SCENE.CRAWL2 || currentScene === SCENE.TODDLE1 || currentScene === SCENE.CHILD1 || currentScene === SCENE.CHILD2 || currentScene === SCENE.ADULT) &&
                        carryHatSynth &&
                        carryHatFilter &&
                        inheritedHatPattern &&
                        inheritedHatPattern[step]
                    ) {
                        carryHatFilter.frequency.value = 7000 + Math.random() * 1800;
                        carryHatSynth.triggerAttackRelease("32n");
                    }
                    if (
                        (currentScene === SCENE.TODDLE1 || currentScene === SCENE.CHILD1 || currentScene === SCENE.CHILD2 || currentScene === SCENE.ADULT) &&
                        carrySnareSynth &&
                        carrySnareFilter &&
                        inheritedSnarePattern &&
                        inheritedSnarePattern[step]
                    ) {
                        const snareVel = inheritedSnareVelocity ? (inheritedSnareVelocity[step] || 0.72) : 0.72;
                        carrySnareFilter.frequency.value = 1400 + snareVel * 800 + Math.random() * 200;
                        carrySnareSynth.triggerAttackRelease("16n");
                        if (carrySnareBody && snareVel >= 0.85) {
                            carrySnareBody.triggerAttackRelease("G2", "32n");
                        }
                    }
                    if (
                        (currentScene === SCENE.CHILD1 || currentScene === SCENE.CHILD2 || currentScene === SCENE.ADULT) &&
                        carryCymbalSynth &&
                        inheritedCymbalPattern &&
                        inheritedCymbalPattern[step]
                    ) {
                        carryCymbalSynth.triggerAttackRelease("16n");
                    }
                    // Carry chord playback removed from ADULT (bass + guitar only)
                    // Carry bass playback (ADULT: play inherited bass line)
                    if (
                        currentScene === SCENE.ADULT &&
                        carryBassSynth &&
                        inheritedBassAttacks &&
                        inheritedBassAttacks[step]
                    ) {
                        const note = inheritedBassNotes ? inheritedBassNotes[step] : null;
                        const dur = inheritedBassDurations ? inheritedBassDurations[step] : "8n";
                        if (note) {
                            try { carryBassSynth.triggerAttackRelease(note, dur); } catch (e) { /* ignore */ }
                        }
                    }
                    updateScoreHudPlayhead(step);

                    // Chord hover preview: play next chord in progression on each beat 1
                    if (chordPreviewSynth && chordPreviewDrop) {
                        const barSteps = STEPS_PER_BEAT * baseRhythmInfo.beatsPerBar;
                        if (step % barSteps === 0) {
                            playChordPreviewNote();
                        }
                    }

                    toneDrops.forEach(drop => {
                        if (!drop.pattern[step]) return;
                        if (drop.proximityVol <= -68) return;
                        const accent = drop.velocityPattern ? (drop.velocityPattern[step] || 0.72) : 0.9;
                        const baseVol = Math.min(-12, drop.proximityVol - 18) + (accent - 0.8) * 9;
                        if (drop.instrument === "chord") {
                            // While hovered, chord preview synth is authoritative (bar-head aligned).
                            if (drop.isHovered && chordPreviewDrop === drop) return;
                            // Chord sound via proximity (non-hover) — original behavior
                            const barSteps2 = STEPS_PER_BEAT * baseRhythmInfo.beatsPerBar;
                            const barIndex = Math.floor(step / barSteps2) % drop.chordProgression.notes.length;
                            drop.chordSynth.volume.value = baseVol - 8;
                            drop.chordSynth.triggerAttackRelease(drop.chordProgression.notes[barIndex], "2n");
                            if (drop.isHovered) drop.ripples.push({ t: 0, accent });
                            return;
                        }
                        if (drop.instrument === "bass") {
                            // Bass: supporting role (quieter)
                            if (drop.bassAttacks && drop.bassAttacks[step]) {
                                const note = drop.bassNotes ? drop.bassNotes[step] : null;
                                const dur = drop.bassDurations ? drop.bassDurations[step] : "8n";
                                if (note && drop.bassSynth) {
                                    drop.bassSynth.volume.value = drop.guitarSynth ? baseVol - 2 : baseVol + 8;
                                    try {
                                        drop.bassSynth.triggerAttackRelease(note, dur);
                                    } catch (e) { /* ignore */ }
                                }
                            }
                            // Guitar trigger (primary instrument in ADULT)
                            if (drop.guitarAttacks && drop.guitarAttacks[step] && drop.guitarSynth) {
                                const gNote = drop.guitarNotes[step];
                                const gDur = drop.guitarDurations[step];
                                if (gNote) {
                                    drop.guitarSynth.volume.value = baseVol + 10;
                                    try {
                                        if (Array.isArray(gNote)) {
                                            drop.guitarSynth.triggerAttackRelease(gNote, gDur);
                                        } else {
                                            drop.guitarSynth.triggerAttackRelease(gNote, gDur);
                                        }
                                    } catch (e) { /* ignore */ }
                                }
                            }
                            if (drop.isHovered && ((drop.bassAttacks && drop.bassAttacks[step]) || (drop.guitarAttacks && drop.guitarAttacks[step]))) {
                                drop.ripples.push({ t: 0, accent });
                            }
                            return;
                        }
                        if (drop.instrument === "cymbal") {
                            drop.cymbalSynth.volume.value = baseVol - 4;
                            drop.cymbalSynth.triggerAttackRelease("16n");
                            if (drop.isHovered) drop.ripples.push({ t: 0, accent });
                            return;
                        }
                        if (drop.instrument === "snare") {
                            if (drop.snareFilter) {
                                drop.snareFilter.frequency.value = 1200 + accent * 1800 + Math.random() * 260;
                            }
                            // Beat-position boost: louder on beat 1 & 3
                            const beatInBar = Math.floor((step % (baseRhythmInfo.beatsPerBar * STEPS_PER_BEAT)) / STEPS_PER_BEAT);
                            const beatBoostDb = (beatInBar === 0 || beatInBar === 2) ? 7 : 0;
                            drop.snareSynth.volume.value = baseVol + 6 + (drop.snareGainBoostDb || 0) + beatBoostDb;
                            const jitter = (Math.random() * 0.008).toFixed(3);
                            drop.snareSynth.triggerAttackRelease("16n", `+${jitter}`);
                            if (drop.snareBody && (accent >= 0.85 || beatBoostDb > 0)) {
                                drop.snareBody.volume.value = baseVol - 2 + (drop.snareBodyBoostDb || 0) + beatBoostDb;
                                drop.snareBody.triggerAttackRelease("G2", "32n");
                            }
                            if (drop.isHovered) drop.ripples.push({ t: 0, accent });
                            return;
                        }

                        const profile = drop.audioProfile || { pitchMotion:[1,1], rhythmMotion:[1,1], openness:[0,0] };
                        const pitchL = randInt(profile.pitchMotion[0], profile.pitchMotion[1]);
                        const rhythmL = randInt(profile.rhythmMotion[0], profile.rhythmMotion[1]);
                        const opennessL = randInt(profile.openness[0], profile.openness[1]);
                        const freq = 6200 + pitchL * 1200 + Math.random() * 700;
                        drop.hatFilter.frequency.value = freq;
                        const barSteps = STEPS_PER_BEAT * baseRhythmInfo.beatsPerBar;
                        const stepInBar = step % barSteps;
                        const isOpenAccent = (
                            (drop.hatMode === "mixed-open" || opennessL >= 2) &&
                            (stepInBar === barSteps - 2 || stepInBar === barSteps - 1 || (rhythmL >= 2 && stepInBar === 1))
                        );
                        const jitter = rhythmL >= 2 ? (Math.random() * 0.01) : 0;
                        if (isOpenAccent) {
                            drop.hatOpenSynth.volume.value = baseVol - 3;
                            drop.hatOpenSynth.triggerAttackRelease("8n", `+${jitter.toFixed(3)}`);
                        } else {
                            drop.hatClosedSynth.volume.value = baseVol;
                            const dur = rhythmL >= 3 ? "16n" : "32n";
                            drop.hatClosedSynth.triggerAttackRelease(dur, `+${jitter.toFixed(3)}`);
                        }
                        if (drop.isHovered) drop.ripples.push({ t: 0, accent: isOpenAccent ? 1 : 0.7 });
                    });

                    baseGroove.step = (step + 1) % baseRhythmInfo.kickPattern.length;
                    baseGroove.nextTick += baseGroove.stepMs;
                }
                baseGroove.timer = setTimeout(tick, 20);
            };
            tick();
        }

        // Render Loop
        function animate() {
            ctx.clearRect(0, 0, width, height);
            // Keep pointer-linked world coordinates in sync even while camera scrolls.
            if (currentScene >= SCENE.CRAWL) {
                orbWorldX = mouseX + cameraX;
                orbWorldY = mouseY;
            } else {
                orbWorldX = mouseX;
                orbWorldY = mouseY;
            }
            updateScoreToggleUi();

            // 1. Draw Background (Different per scene)
            if (currentScene === SCENE.LESSON) {
                // 授業フェーズ: toneなし、選択肢なし、HUDなし
                drawLessonScene();
            } else if (currentScene === SCENE.CRAWL || currentScene === SCENE.CRAWL2 || currentScene === SCENE.TODDLE1 || currentScene === SCENE.CHILD1 || currentScene === SCENE.CHILD2 || currentScene === SCENE.ADULT) {
                updateToneDropProximity();
                updateScoreHudPreviewRow();

                if (baby) {
                    if (!isMinigameActive) {
                        baby.update(orbWorldX);
                    }
                    updateCamera();
                }

                ctx.save();
                ctx.translate(-cameraX, 0);
                if (currentScene === SCENE.ADULT) {
                    drawAdultBackground();
                } else if (currentScene === SCENE.CHILD2) {
                    drawSchoolBackground();
                } else if (currentScene === SCENE.CHILD1) {
                    drawChildBackground();
                } else {
                    drawCrawlBackground();
                }
                drawToneDrops();
                if (baby) baby.draw(ctx);
                ctx.restore();

                drawToyStatsHud();
                drawCumulativeStatsHud();
            } else {
                // Title/Choice Background
                ctx.fillStyle = palette.bg;
                ctx.fillRect(0, 0, width, height);
                blobs.forEach(b => { b.update(); b.draw(ctx); });
            }

            // 2b-2d: Skip orb/particles/hover during lesson phase
            if (currentScene === SCENE.LESSON) {
                orbEl.style.opacity = '0';
            } else {
                updateAndDrawOrbParticles();
                updateOrbScreenPosition();
                if (hoverInfoEl) hoverInfoEl.classList.remove('visible');
            }

            // 3. Update Audio (Proximity)
            if (currentScene === SCENE.CHOICE) {
                updateProximityAudio();
            }
            if (activeMinigame) {
                const rect = minigameCanvas.getBoundingClientRect();
                // 表示サイズと内部解像度の比率を計算（ズレを完全に解消）
                const scaleX = minigameCanvas.width / rect.width;
                const scaleY = minigameCanvas.height / rect.height;
                const minigameMouseX = (mouseX - rect.left) * scaleX;
                const minigameMouseY = (mouseY - rect.top) * scaleY;
                
                activeMinigame.update(minigameMouseX, minigameMouseY);
                if (activeMinigame) {
                    activeMinigame.draw();
                }
            }
            requestAnimationFrame(animate);
        }

        // ==========================================
        // Interactions & Audio Logic
        // ==========================================
        
        const uiTitle = document.getElementById('title-group');
        const uiChoice = document.getElementById('choice-group');
        const startBtn = document.getElementById('start-btn');
        const btnLeft = document.getElementById('btn-left');
        const btnMiddle = document.getElementById('btn-middle');
        const btnRight = document.getElementById('btn-right');
        const btnFast = document.getElementById('btn-fast');
        const sceneFade = document.getElementById('scene-fade');
        const scoreHud = document.getElementById('score-hud');
        const scoreTracks = document.getElementById('score-tracks');
        const scoreMeta = document.getElementById('score-meta');
        const scoreToggleBtn = document.getElementById('score-toggle-btn');
        const minigameWrapper = document.getElementById('minigame-wrapper');
        const minigameCanvas = document.getElementById('minigame-canvas');
        const minigameCtx = minigameCanvas ? minigameCanvas.getContext('2d') : null;

        function fadeScreenTo(opacity, durationMs) {
            sceneFade.style.transition = `opacity ${durationMs}ms ease`;
            sceneFade.style.opacity = String(opacity);
        }

        async function ensureAudioReady() {
            try {
                await Tone.start();
                if (Tone.context.state !== 'running') {
                    await Tone.context.resume();
                }
            } catch (err) {
                // Keep gameplay progression even if browser autoplay policy warns.
                console.warn('Audio resume skipped:', err);
            }
        }

        function setScoreHudVisible(visible) {
            scoreHud.classList.toggle('visible', visible);
        }

        function updateScoreToggleUi() {
            const available = (currentScene === SCENE.CRAWL || currentScene === SCENE.CRAWL2 || currentScene === SCENE.TODDLE1 || currentScene === SCENE.CHILD1 || currentScene === SCENE.CHILD2 || currentScene === SCENE.ADULT) && !!baseRhythmInfo;
            scoreToggleBtn.classList.remove('visible');
            setScoreHudVisible(available);
        }

        function withAlpha(hslColor, alpha) {
            const m = hslColor.match(/hsl\(([^)]+)\)/i);
            if (!m) return `rgba(255,255,255,${alpha})`;
            return `hsla(${m[1]}, ${alpha})`;
        }

        function applyScoreHudTheme() {
            const accentA = floorColor || palette.colors[2];
            const accentB = babyColorScheme.body || palette.colors[0];
            const accentC = babyColorScheme.limb || palette.colors[1];
            scoreHud.style.setProperty('--score-bg-a', withAlpha(accentA, 0.32));
            scoreHud.style.setProperty('--score-bg-b', withAlpha(accentB, 0.24));
            scoreHud.style.setProperty('--score-step-off', withAlpha(accentB, 0.24));
            scoreHud.style.setProperty('--score-step-kick', withAlpha(accentC, 1));
            scoreHud.style.setProperty('--score-step-hat', withAlpha(accentA, 0.98));
            scoreHud.style.setProperty('--score-step-hat-dense', withAlpha(palette.btnColor, 0.98));
            scoreHud.style.setProperty('--score-playhead', withAlpha(babyColorScheme.skin, 0.98));
        }

        function renderScoreRows(previewDropIndex = null) {
            if (!baseRhythmInfo) return;
            const isChild = currentScene === SCENE.CHILD1;
            const isChild2 = currentScene === SCENE.CHILD2;
            const isAdult = currentScene === SCENE.ADULT;
            const rows = [];
            let chordRow = null;

            // Chord row for CHILD1 (when hovering a chord drop) or CHILD2 (always visible)
            if (isChild && previewDropIndex !== null && toneDrops[previewDropIndex] && toneDrops[previewDropIndex].instrument === "chord") {
                const preview = toneDrops[previewDropIndex];
                chordRow = {
                    chords: preview.chordProgression.chords,
                    side: preview.chordSide
                };
            }
            // CHILD2: chord names shown as bar labels, not as a scored row

            // Bass preview row (CHILD2/ADULT hover)
            if ((isChild2 || isAdult) && previewDropIndex !== null && toneDrops[previewDropIndex] && toneDrops[previewDropIndex].instrument === "bass") {
                const preview = toneDrops[previewDropIndex];
                rows.push({
                    label: 'Bass',
                    pattern: preview.pattern,
                    styleClass: 'bass',
                    sustainType: preview.bassSustainType || null
                });
            }

            if (previewDropIndex !== null && toneDrops[previewDropIndex]) {
                const preview = toneDrops[previewDropIndex];
                const isCymbal = preview.instrument === "cymbal";
                const isSnare = preview.instrument === "snare";
                const isChord = preview.instrument === "chord";
                const isBass = preview.instrument === "bass";
                if (!isChord && !isBass) {
                    const instrLabel = isCymbal ? 'Cymbal' : (isSnare ? 'Snare' : 'Hat');
                    const instrStyle = isCymbal ? (preview.hudStyleClass || 'cymbal') :
                        (isSnare ? (preview.hudStyleClass || 'snare') : (previewDropIndex >= 2 ? 'hat-dense' : 'hat'));
                    rows.push({
                        label: `${instrLabel} ${previewDropIndex + 1}`,
                        pattern: preview.pattern,
                        styleClass: instrStyle
                    });
                }
            }
            // ADULT: always show inherited bass row
            if (isAdult && inheritedBassPattern) {
                rows.push({
                    label: 'Bass',
                    pattern: inheritedBassPattern,
                    styleClass: inheritedBassStyleClass || 'bass',
                    sustainType: inheritedBassSustainType || null
                });
            }
            if ((isChild || isChild2 || isAdult) && inheritedCymbalPattern) {
                rows.push({
                    label: 'Cymbal',
                    pattern: inheritedCymbalPattern,
                    styleClass: inheritedCymbalStyleClass || 'cymbal'
                });
            }
            if ((currentScene === SCENE.TODDLE1 || isChild || isChild2 || isAdult) && inheritedSnarePattern) {
                rows.push({
                    label: 'Snare',
                    pattern: inheritedSnarePattern,
                    styleClass: inheritedSnareStyleClass || 'snare'
                });
            }
            if (currentScene === SCENE.CRAWL2 || currentScene === SCENE.TODDLE1 || isChild || isChild2 || isAdult) {
                const carryPattern = inheritedHatPattern || baseRhythmInfo.baseHatPattern;
                if (carryPattern) {
                    rows.push({
                        label: 'Hat',
                        pattern: carryPattern,
                        styleClass: inheritedHatStyleClass || 'hat'
                    });
                }
            }
            // Keep kick as the bottom-most permanent row.
            rows.push({
                label: 'Kick',
                pattern: baseRhythmInfo.kickPattern,
                styleClass: 'kick'
            });

            scoreTracks.innerHTML = '';
            scoreHudState.rows = [];
            scoreHudState.chordCells = null;
            scoreHudState.barLabelCells = null;
            scoreHudState.totalSteps = baseRhythmInfo.kickPattern.length;
            scoreHudState.currentStep = -1;
            const beatSpan = (100 * STEPS_PER_BEAT) / scoreHudState.totalSteps;
            const barSpan = (100 * STEPS_PER_BEAT * baseRhythmInfo.beatsPerBar) / scoreHudState.totalSteps;
            scoreTracks.style.setProperty('--steps', String(scoreHudState.totalSteps));
            scoreTracks.style.setProperty('--beat-span', `${beatSpan}%`);
            scoreTracks.style.setProperty('--bar-span', `${barSpan}%`);

            // Chord row (CHILD1 hover only — interactive preview)
            if (chordRow) {
                const chordRowEl = document.createElement('div');
                chordRowEl.className = 'score-row';
                const chordLabel = document.createElement('div');
                chordLabel.className = 'score-label';
                chordLabel.textContent = 'Chord';
                const chordGrid = document.createElement('div');
                chordGrid.className = 'score-grid-chord';
                chordGrid.style.gridTemplateColumns = `repeat(${baseRhythmInfo.bars}, 1fr)`;
                const chordCells = [];
                for (let i = 0; i < baseRhythmInfo.bars; i++) {
                    const cell = document.createElement('div');
                    cell.className = 'score-chord-cell';
                    const chordFac = CHILD_FACILITIES.find(f => f.id === chordRow.side);
                    cell.classList.add(chordFac && chordFac.chordMode === 'major' ? 'chord-kg' : 'chord-home');
                    cell.textContent = chordRow.chords[i % chordRow.chords.length];
                    chordCells.push(cell);
                    chordGrid.appendChild(cell);
                }
                chordRowEl.appendChild(chordLabel);
                chordRowEl.appendChild(chordGrid);
                scoreTracks.appendChild(chordRowEl);
                scoreHudState.chordCells = chordCells;
            }

            // Chord name bar labels (CHILD2+/ADULT: show chord names above each bar)
            if ((isChild2 || isAdult) && inheritedChordProgression) {
                const barLabelRow = document.createElement('div');
                barLabelRow.className = 'score-bar-labels';
                const barLabelLeft = document.createElement('div');
                barLabelLeft.className = 'score-label';
                barLabelLeft.textContent = '';
                barLabelRow.appendChild(barLabelLeft);
                const barLabelGrid = document.createElement('div');
                barLabelGrid.className = 'score-bar-label-grid';
                barLabelGrid.style.gridTemplateColumns = `repeat(${baseRhythmInfo.bars}, 1fr)`;
                const chordNames = inheritedChordProgression.chords;
                const barLabelCells = [];
                for (let i = 0; i < baseRhythmInfo.bars; i++) {
                    const lbl = document.createElement('div');
                    lbl.className = 'score-bar-label';
                    lbl.textContent = chordNames[i % chordNames.length];
                    barLabelCells.push(lbl);
                    barLabelGrid.appendChild(lbl);
                }
                barLabelRow.appendChild(barLabelGrid);
                scoreTracks.appendChild(barLabelRow);
                scoreHudState.barLabelCells = barLabelCells;
            }

            // Drum rows (wrapped in drum-block for CHILD1/CHILD2/ADULT)
            const drumBlock = (isChild || isChild2 || isAdult) ? document.createElement('div') : null;
            if (drumBlock) drumBlock.className = 'drum-block';

            rows.forEach(row => {
                const rowEl = document.createElement('div');
                rowEl.className = 'score-row';
                if (row.label.startsWith('Hat') || row.label.startsWith('Snare') || row.label.startsWith('Cymbal') || row.label.startsWith('Bass')) rowEl.classList.add('preview');

                const labelEl = document.createElement('div');
                labelEl.className = 'score-label';
                labelEl.textContent = row.label;

                const gridEl = document.createElement('div');
                gridEl.className = 'score-grid';
                gridEl.style.setProperty('--steps', String(scoreHudState.totalSteps));

                const stepEls = [];
                for (let i = 0; i < scoreHudState.totalSteps; i++) {
                    const stepEl = document.createElement('div');
                    stepEl.className = 'score-step';
                    if (row.pattern[i]) {
                        stepEl.classList.add('on');
                        stepEl.classList.add(row.styleClass);
                    }
                    // Sustain type classes for visually connected notes
                    if (row.sustainType && row.sustainType[i]) {
                        stepEl.classList.add('sus-' + row.sustainType[i]);
                    }
                    stepEls.push(stepEl);
                    gridEl.appendChild(stepEl);
                }

                rowEl.appendChild(labelEl);
                rowEl.appendChild(gridEl);
                if (drumBlock) {
                    drumBlock.appendChild(rowEl);
                } else {
                    scoreTracks.appendChild(rowEl);
                }
                scoreHudState.rows.push(stepEls);
            });

            if (drumBlock) scoreTracks.appendChild(drumBlock);

            if (baseGroove) {
                updateScoreHudPlayhead(baseGroove.step % scoreHudState.totalSteps);
            }
        }

        function updateScoreHudPreviewRow() {
            if (!baseRhythmInfo) return;
            let nextPreview = null;
            let best = -Infinity;
            toneDrops.forEach((drop, i) => {
                if (!drop.isHovered) return;
                if (drop.proximityVol > best) {
                    best = drop.proximityVol;
                    nextPreview = i;
                }
            });
            if (scoreHudState.previewDropIndex === nextPreview) return;
            scoreHudState.previewDropIndex = nextPreview;
            renderScoreRows(nextPreview);
        }

        function buildScoreHud() {
            if (!baseRhythmInfo) return;
            scoreMeta.textContent = `${baseRhythmInfo.beatsPerBar}/4 x ${baseRhythmInfo.bars}  |  ${Math.round(baseRhythmInfo.bpm)} BPM`;
            scoreHudState.previewDropIndex = null;
            applyScoreHudTheme();
            renderScoreRows(null);
        }

        function updateScoreHudPlayhead(step) {
            if (!scoreHudState.totalSteps || scoreHudState.currentStep === step) return;
            if (scoreHudState.currentStep >= 0) {
                scoreHudState.rows.forEach(row => {
                    row[scoreHudState.currentStep]?.classList.remove('playhead');
                });
            }
            scoreHudState.rows.forEach(row => {
                row[step]?.classList.add('playhead');
            });
            // Update chord cell highlighting
            if (baseRhythmInfo) {
                const barSteps = STEPS_PER_BEAT * baseRhythmInfo.beatsPerBar;
                const currentBar = Math.floor(step / barSteps) % baseRhythmInfo.bars;
                if (scoreHudState.chordCells) {
                    scoreHudState.chordCells.forEach((cell, i) => {
                        cell.classList.toggle('active', i === currentBar);
                    });
                }
                if (scoreHudState.barLabelCells) {
                    scoreHudState.barLabelCells.forEach((cell, i) => {
                        cell.classList.toggle('active', i === currentBar);
                    });
                }
            }
            scoreHudState.currentStep = step;
        }

        const blobs = [];
        palette.colors.forEach(c => blobs.push(new OrganicBlob(c)));

        animate();
        initOrbPosition();

        // Start Button (Title -> Choice)
        startBtn.addEventListener('click', async () => {
            await ensureAudioReady();
            
            // Animation
            document.getElementById('ripple-effect').classList.add('ripple-anim');
            startBtn.style.transform = "scale(0.9)";
            
            // Audio: Title Chime
            const synth = new Tone.PolySynth(Tone.Synth, { volume: -5 }).toDestination();
            synth.triggerAttackRelease(["C4", "E4", "G4", "B4"], "2n");

            // UI Switch
            uiTitle.style.opacity = 0;
            setTimeout(() => {
                uiTitle.style.display = 'none';
                uiChoice.style.display = 'flex';
                // Trigger reflow
                void uiChoice.offsetWidth;
                uiChoice.style.opacity = 1;
                
                currentScene = SCENE.CHOICE;
                initProximityAudio();
                // Reposition orb above middle choice button
                setTimeout(() => {
                    const midRect = btnMiddle.getBoundingClientRect();
                    orbWorldX = midRect.left + midRect.width / 2;
                    orbWorldY = midRect.top - 60;
                    updateOrbScreenPosition();
                }, 50);
            }, 1000);
        });

        btnLeft.addEventListener('click', () => {
            void makeChoice('left', palette.colors[1]);
        });
        btnMiddle.addEventListener('click', () => {
            void makeChoice('middle', palette.colors[2]);
        });
        btnRight.addEventListener('click', () => {
            void makeChoice('right', palette.colors[3]);
        });
        btnFast.addEventListener('click', () => {
            void makeChoice('fast', palette.colors[4]);
        });

        function randInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        const ABC_RULES = {
            4: {
                rule1: ["A","A","A","B","A","A","A","B","A","A","A","B","A","A","A","C"],
                rule2: ["A","A","B","A","A","A","B","A","A","A","B","A","A","B","A","C"],
                rule3: ["A","B","A","A","A","B","A","A","A","B","A","A","A","A","B","C"]
            },
            3: {
                rule1: ["A","A","B","A","A","B","A","A","B","A","A","C"],
                rule2: ["A","B","A","A","B","A","A","B","A","B","A","C"],
                rule3: ["B","A","A","B","A","A","B","A","A","A","B","C"]
            }
        };

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

        function rotateArray(arr, offset) {
            const out = [];
            for (let i = 0; i < arr.length; i++) out.push(arr[(i + offset) % arr.length]);
            return out;
        }

        function expandAbcLettersToSteps(letters, motifMap) {
            const steps = [];
            for (const letter of letters) steps.push(...motifMap[letter]);
            return steps;
        }

        function pickKickStepInBeat(kickPattern, beatIndex) {
            const base = beatIndex * STEPS_PER_BEAT;
            for (let i = 0; i < STEPS_PER_BEAT; i++) {
                if (kickPattern[base + i]) return base + i;
            }
            return base;
        }

        function snapHatPatternToKickGrid(hatPattern, kickPattern, variant = 0) {
            const totalBeats = Math.floor(hatPattern.length / STEPS_PER_BEAT);
            const snapped = new Array(hatPattern.length).fill(false);
            const kickHits = [];
            for (let i = 0; i < kickPattern.length; i++) {
                if (kickPattern[i]) kickHits.push(i);
            }
            if (!kickHits.length) return snapped;

            for (let beat = 0; beat < totalBeats; beat++) {
                const base = beat * STEPS_PER_BEAT;
                const hitSlots = [];
                for (let i = 0; i < STEPS_PER_BEAT; i++) {
                    if (hatPattern[base + i]) {
                        hitSlots.push(i);
                    }
                }
                if (!hitSlots.length) continue;

                const slot = hitSlots[Math.min(hitSlots.length - 1, variant % hitSlots.length)];
                const target = base + slot;
                const ranked = kickHits
                    .map(k => ({ k, d: Math.abs(k - target) }))
                    .sort((a, b) => a.d - b.d);
                const pickIdx = Math.min(ranked.length - 1, variant % Math.min(3, ranked.length));
                snapped[ranked[pickIdx].k] = true;
            }
            return snapped;
        }

        function makeAbcSample(beatsPerBar, bars, index) {
            const rules = ABC_RULES[beatsPerBar];
            const ruleNames = Object.keys(rules);
            const ruleName = ruleNames[index % ruleNames.length];
            const baseLetters = rules[ruleName];
            const letters = rotateArray(baseLetters, index % beatsPerBar);

            const kickMotifs = KICK_MOTIF_SETS[index % KICK_MOTIF_SETS.length];
            const hatMotifs = HAT_MOTIF_SETS[(index + 1) % HAT_MOTIF_SETS.length];

            const kickPattern = expandAbcLettersToSteps(letters, kickMotifs);
            const rawHatPattern = expandAbcLettersToSteps(letters, hatMotifs);
            const hatPattern = snapHatPatternToKickGrid(rawHatPattern, kickPattern);

            return {
                id: index + 1,
                ruleName,
                letters,
                beatsPerBar,
                bars,
                kickPattern,
                hatPattern
            };
        }

        function makeAbcPatternBank(beatsPerBar, bars, count = 10) {
            const out = [];
            for (let i = 0; i < count; i++) out.push(makeAbcSample(beatsPerBar, bars, i));
            return out;
        }

        function pickRandom(arr) {
            return arr[randInt(0, arr.length - 1)];
        }

        function makeLeftSparseSample() {
            const letters = [];
            for (let bar = 0; bar < RHYTHM_BARS; bar++) {
                if (bar % 2 === 0) letters.push("A", "N", "N", "B");
                else letters.push("A", "N", "N", "N");
            }
            const kickMotifs = { A:[1,0,0,0], B:[1,0,0,1], C:[0,0,1,0], N:[0,0,0,0] };
            const hatMotifs = { A:[0,1,0,0], B:[0,0,1,0], C:[0,0,0,1], N:[0,0,0,0] };
            const kickPattern = expandAbcLettersToSteps(letters, kickMotifs);
            const rawHat = expandAbcLettersToSteps(letters, hatMotifs);
            return {
                id: 0,
                ruleName: "left_sparse_A--B_A---",
                letters,
                beatsPerBar: 4,
                bars: RHYTHM_BARS,
                kickPattern,
                hatPattern: snapHatPatternToKickGrid(rawHat, kickPattern)
            };
        }

        function spawnBeatRipple(button, volumeDb) {
            const rect = button.getBoundingClientRect();
            const ripple = document.createElement('div');
            ripple.className = 'beat-ripple';
            ripple.style.left = (rect.left + rect.width / 2) + 'px';
            ripple.style.top = (rect.top + rect.height / 2) + 'px';
            const alpha = Math.max(0.12, Math.min(0.36, (volumeDb + 100) / 180));
            ripple.style.background = `rgba(255, 255, 255, ${alpha})`;
            document.body.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
        }

        function createKickTrack(button, bpm, sample) {
            const stepMs = 60000 / bpm / STEPS_PER_BEAT; // 16th-note grid
            return {
                button,
                bpm,
                stepMs,
                beatsPerBar: sample.beatsPerBar,
                bars: sample.bars,
                ruleName: sample.ruleName,
                letters: sample.letters.slice(),
                pattern: sample.kickPattern.slice(),
                hatPattern: sample.hatPattern.slice(),
                step: 0,
                nextTick: 0,
                timer: null,
                volumeDb: -100,
                hoverActive: false,
                running: false,
                synth: new Tone.MembraneSynth({
                    pitchDecay: 0.06,
                    octaves: 5,
                    oscillator: { type: "sine" },
                    envelope: { attack: 0.001, decay: 0.45, sustain: 0, release: 0.25 },
                    volume: -100
                }).toDestination()
            };
        }

        function startKickTrack(track) {
            track.running = true;
            track.nextTick = performance.now() + track.stepMs;
            const tick = () => {
                if (!track.running) return;
                const now = performance.now();
                while (track.nextTick <= now + 4) {
                    if (track.hoverActive && track.pattern[track.step]) {
                        track.synth.volume.value = track.volumeDb;
                        track.synth.triggerAttackRelease("C1", "8n");
                        spawnBeatRipple(track.button, track.volumeDb);
                    }
                    if (track.hoverActive) {
                        track.step = (track.step + 1) % track.pattern.length;
                    }
                    track.nextTick += track.stepMs;
                }
                track.timer = setTimeout(tick, 20);
            };
            tick();
        }

        // Proximity Audio Setup
        function initProximityAudio() {
            // Left: sparse custom, Middle: regular, Right: eager(3/4), Fast: very fast(4/4)
            const leftBpm = randInt(52, 66);
            const middleBpm = randInt(62, 78);
            const rightBpm = Math.max(middleBpm + 12, randInt(84, 108));
            const fastBpm = Math.max(rightBpm + 12, randInt(112, 138));
            const leftBank = makeAbcPatternBank(4, RHYTHM_BARS, 10);
            const middleBank = makeAbcPatternBank(4, RHYTHM_BARS, 10);
            const rightBank = makeAbcPatternBank(3, RHYTHM_BARS, 10);
            const fastBank = makeAbcPatternBank(4, RHYTHM_BARS, 10);
            const leftSample = makeLeftSparseSample() || pickRandom(leftBank);
            const middleSample = pickRandom(middleBank);
            const rightSample = pickRandom(rightBank);
            const fastSample = pickRandom(fastBank);
            choiceRhythm = {
                left: { bpm: leftBpm, sample: leftSample },
                middle: { bpm: middleBpm, sample: middleSample },
                right: { bpm: rightBpm, sample: rightSample },
                fast: { bpm: fastBpm, sample: fastSample }
            };

            // Left: custom sparse, Middle: 4/4 x4, Right: fast 3/4 x4, Fast: very fast 4/4 x4
            leftTrack = createKickTrack(btnLeft, leftBpm, leftSample);
            middleTrack = createKickTrack(btnMiddle, middleBpm, middleSample);
            rightTrack = createKickTrack(btnRight, rightBpm, rightSample);
            fastTrack = createKickTrack(btnFast, fastBpm, fastSample);
            startKickTrack(leftTrack);
            startKickTrack(middleTrack);
            startKickTrack(rightTrack);
            startKickTrack(fastTrack);
        }

        function updateProximityAudio() {
            const getInfo = (btn) => {
                const rect = btn.getBoundingClientRect();
                const cx = rect.left + rect.width/2;
                const cy = rect.top + rect.height/2;
                const dist = Math.sqrt((mouseX-cx)**2 + (mouseY-cy)**2);
                const maxD = 500;
                const vol = dist > maxD ? -100 : (-100 + (1 - dist/maxD) * 105); // -100 to +5
                const isOver = (
                    mouseX >= rect.left &&
                    mouseX <= rect.right &&
                    mouseY >= rect.top &&
                    mouseY <= rect.bottom
                );
                return { btn, dist, vol, isOver };
            };

            const leftInfo = getInfo(btnLeft);
            const middleInfo = getInfo(btnMiddle);
            const rightInfo = getInfo(btnRight);
            const fastInfo = getInfo(btnFast);

            if(leftTrack) leftTrack.volumeDb = leftInfo.vol;
            if(middleTrack) middleTrack.volumeDb = middleInfo.vol;
            if(rightTrack) rightTrack.volumeDb = rightInfo.vol;
            if(fastTrack) fastTrack.volumeDb = fastInfo.vol;

            const setTrackHoverState = (track, active) => {
                if (!track) return;
                if (active && !track.hoverActive) {
                    // Start from bar-1 beat-1 whenever hovered.
                    track.step = 0;
                    track.nextTick = performance.now() + 10;
                }
                track.hoverActive = active;
            };
            // Sound/ripple only when the cursor is directly over the button.
            setTrackHoverState(leftTrack, leftInfo.isOver);
            setTrackHoverState(middleTrack, middleInfo.isOver);
            setTrackHoverState(rightTrack, rightInfo.isOver);
            setTrackHoverState(fastTrack, fastInfo.isOver);

            // Visual Hover: always keep exactly one button hovered (nearest one).
            const candidates = [leftInfo, middleInfo, rightInfo, fastInfo].sort((a, b) => a.dist - b.dist);
            btnLeft.classList.remove('hovered');
            btnMiddle.classList.remove('hovered');
            btnRight.classList.remove('hovered');
            btnFast.classList.remove('hovered');
            candidates[0].btn.classList.add('hovered');
        }

        function stopProximityAudio() {
            const stopTrack = (track) => {
                if (!track) return;
                track.running = false;
                if (track.timer) clearTimeout(track.timer);
                if (track.synth) track.synth.dispose();
            };
            stopTrack(leftTrack);
            stopTrack(middleTrack);
            stopTrack(rightTrack);
            stopTrack(fastTrack);
            leftTrack = null;
            middleTrack = null;
            rightTrack = null;
            fastTrack = null;
        }

        // getToneDropAtScreenPoint removed — selection now via tune bubble

        function transitionToLevel2(clickedDrop) {
            if (level2TransitionLock || currentScene !== SCENE.CRAWL) return;
            level2TransitionLock = true;
            if (clickedDrop.toy) selectedToys.push(clickedDrop.toy);
            inheritedHatPattern = clickedDrop.pattern ? clickedDrop.pattern.slice() : null;
            inheritedHatStyleClass = clickedDrop.hudStyleClass || 'hat';
            inheritedHatSoundConfig = clickedDrop.hatSoundConfig ? { ...clickedDrop.hatSoundConfig } : null;
            const hatVolNow = clickedDrop.hatClosedSynth?.volume?.value;
            inheritedHatVolumeDb = (Number.isFinite(hatVolNow) && hatVolNow > -90) ? hatVolNow : -25;
            const sx = clickedDrop.x - cameraX;
            const sy = clickedDrop.y;
            const ripple = document.createElement('div');
            ripple.className = 'ripple ripple-anim';
            ripple.style.position = 'fixed';
            ripple.style.left = (sx - 40) + 'px';
            ripple.style.top = (sy - 40) + 'px';
            document.body.appendChild(ripple);
            fadeScreenTo(1, 1200);
            setTimeout(() => {
                finishLevel2Transition();
                fadeScreenTo(0, 1300);
                ripple.remove();
            }, 1200);
        }

        // Choice Click (Choice -> Crawl)
        async function makeChoice(side, color) {
            if(currentScene !== SCENE.CHOICE) return;
            await ensureAudioReady();
            
            chosenColor = color;
            currentScene = SCENE.TRANSITION;
            const chosenSide = side;
            const sideState = choiceRhythm[chosenSide];
            baseRhythmBpm = sideState ? sideState.bpm : 72;
            Tone.Transport.bpm.value = baseRhythmBpm;
            const chosenTrack = chosenSide === 'left'
                ? leftTrack
                : (chosenSide === 'middle'
                    ? middleTrack
                    : (chosenSide === 'right' ? rightTrack : fastTrack));
            if (chosenTrack) {
                baseRhythmInfo = {
                    bpm: chosenTrack.bpm,
                    beatsPerBar: chosenTrack.beatsPerBar,
                    bars: chosenTrack.bars,
                    ruleName: chosenTrack.ruleName,
                    letters: chosenTrack.letters.slice(),
                    kickPattern: chosenTrack.pattern.slice(),
                    baseHatPattern: chosenTrack.hatPattern.slice()
                };
            }

            // Capture button center before hiding the choice UI.
            const targetBtn = chosenSide === 'left'
                ? btnLeft
                : (chosenSide === 'middle'
                    ? btnMiddle
                    : (chosenSide === 'right' ? btnRight : btnFast));
            const rect = targetBtn.getBoundingClientRect();
            
            stopProximityAudio();
            startBaseGroove();
            uiChoice.style.pointerEvents = 'none';

            // Same ripple behavior as start button.
            const ripple = document.createElement('div');
            ripple.className = 'ripple ripple-anim';
            ripple.style.position = 'fixed';
            ripple.style.left = (rect.left + rect.width / 2 - 40) + 'px';
            ripple.style.top = (rect.top + rect.height / 2 - 40) + 'px';
            document.body.appendChild(ripple);

            targetBtn.style.transform = "scale(0.9)";

            setTimeout(() => {
                uiChoice.style.display = 'none';
                ripple.remove();
                fadeScreenTo(1, 1400);
                setTimeout(() => {
                    finishTransition();
                    fadeScreenTo(0, 1500);
                }, 1400);
            }, 1000);

            // Decision Sound
            const synth = new Tone.PolySynth(Tone.Synth, {
                volume: -5, envelope: { attack: 0.05, decay: 1, sustain: 0.1, release: 2 }
            }).toDestination();
            synth.triggerAttackRelease(["D4", "F#4", "A4", "D5"], "1n");
        }

        function finishTransition() {
            currentScene = SCENE.CRAWL;
            floorColor = pickFloorColor();
            baby = new Baby(babyColorScheme);
            selectedToys = [];
            inheritedHatPattern = null;
            inheritedHatStyleClass = 'hat';
            inheritedHatSoundConfig = null;
            inheritedHatVolumeDb = -25;
            disposeCarryHatLayer();
            initToneDrops();
            buildScoreHud();
            updateScoreToggleUi();
            orbWorldX = baby.x;
            orbWorldY = height * ROOM_WALL_RATIO + TONE_FLOOR_OFFSET;
            orbParticles = [];
        }

        function finishLevel2Transition() {
            currentScene = SCENE.CRAWL2;
            if (baby) {
                baby.scale = 0.95;
            } else {
                baby = new Baby(babyColorScheme);
                baby.scale = 0.95;
            }
            initSnareDrops();
            initCarryHatLayer();
            buildScoreHud();
            updateScoreToggleUi();
            level2TransitionLock = false;
            orbWorldX = baby.x;
            orbWorldY = height * ROOM_WALL_RATIO + TONE_FLOOR_OFFSET;
            orbParticles = [];
        }

        function transitionToToddler1(clickedDrop) {
            if (toddlerTransitionLock || currentScene !== SCENE.CRAWL2) return;
            toddlerTransitionLock = true;
            if (clickedDrop.toy) selectedToys.push(clickedDrop.toy);
            inheritedSnarePattern = clickedDrop.pattern ? clickedDrop.pattern.slice() : null;
            inheritedSnareVelocity = clickedDrop.velocityPattern ? clickedDrop.velocityPattern.slice() : null;
            inheritedSnareStyleClass = clickedDrop.hudStyleClass || 'snare';
            inheritedSnareSoundConfig = clickedDrop.snareSoundConfig ? { ...clickedDrop.snareSoundConfig } : null;
            const snareVolNow = clickedDrop.snareSynth?.volume?.value;
            const snareBodyVolNow = clickedDrop.snareBody?.volume?.value;
            inheritedSnareVolumeDb = (Number.isFinite(snareVolNow) && snareVolNow > -90) ? snareVolNow : -20;
            inheritedSnareBodyVolumeDb = (Number.isFinite(snareBodyVolNow) && snareBodyVolNow > -90) ? snareBodyVolNow : -18;
            const sx = clickedDrop.x - cameraX;
            const sy = clickedDrop.y;
            const ripple = document.createElement('div');
            ripple.className = 'ripple ripple-anim';
            ripple.style.position = 'fixed';
            ripple.style.left = (sx - 40) + 'px';
            ripple.style.top = (sy - 40) + 'px';
            document.body.appendChild(ripple);
            fadeScreenTo(1, 1200);
            setTimeout(() => {
                finishToddlerTransition();
                fadeScreenTo(0, 1300);
                ripple.remove();
            }, 1200);
        }

        function finishToddlerTransition() {
            currentScene = SCENE.TODDLE1;
            baby = new Toddler(babyColorScheme);
            initCymbalDrops();
            initCarryHatLayer();
            initCarrySnareLayer();
            buildScoreHud();
            updateScoreToggleUi();
            toddlerTransitionLock = false;
            orbWorldX = baby.x;
            orbWorldY = height * ROOM_WALL_RATIO + TONE_FLOOR_OFFSET;
            orbParticles = [];
        }

        function transitionToChild1(clickedDrop) {
            if (childTransitionLock || currentScene !== SCENE.TODDLE1) return;
            childTransitionLock = true;
            // Save cymbal pattern from clicked drop
            inheritedCymbalPattern = clickedDrop.pattern ? clickedDrop.pattern.slice() : null;
            inheritedCymbalVelocity = clickedDrop.velocityPattern ? clickedDrop.velocityPattern.slice() : null;
            inheritedCymbalStyleClass = clickedDrop.hudStyleClass || 'cymbal';
            inheritedCymbalSoundConfig = clickedDrop.cymbalSoundConfig ? { ...clickedDrop.cymbalSoundConfig } : null;
            const cymbalVolNow = clickedDrop.cymbalSynth?.volume?.value;
            inheritedCymbalVolumeDb = (Number.isFinite(cymbalVolNow) && cymbalVolNow > -90) ? cymbalVolNow : -30;
            if (clickedDrop.toy) selectedToys.push(clickedDrop.toy);
            const sx = clickedDrop.x - cameraX;
            const sy = clickedDrop.y;
            const ripple = document.createElement('div');
            ripple.className = 'ripple ripple-anim';
            ripple.style.position = 'fixed';
            ripple.style.left = (sx - 40) + 'px';
            ripple.style.top = (sy - 40) + 'px';
            document.body.appendChild(ripple);
            fadeScreenTo(1, 1200);
            setTimeout(() => {
                finishChildTransition();
                fadeScreenTo(0, 1300);
                ripple.remove();
            }, 1200);
        }

        function finishChildTransition() {
            currentScene = SCENE.CHILD1;
            childHouseVariant = randInt(0, 3);
            childBgClouds = null;
            childBgTrees = null;
            baby = new Child(babyColorScheme);
            initChordDrops();
            initCarryHatLayer();
            initCarrySnareLayer();
            initCarryCymbalLayer();
            buildScoreHud();
            updateScoreToggleUi();
            childTransitionLock = false;
            orbWorldX = baby.x;
            orbWorldY = height * ROOM_WALL_RATIO + TONE_FLOOR_OFFSET;
            orbParticles = [];
        }

        function handleChildChoice(clickedDrop) {
            if (!clickedDrop.chordProgression) return;
            if (child2TransitionLock) return;
            child2TransitionLock = true;
            childLifeChoice = clickedDrop.chordSide;
            inheritedChordProgression = clickedDrop.chordProgression;
            // Ripple effect
            const sx = clickedDrop.x - cameraX;
            const sy = clickedDrop.y;
            const ripple = document.createElement('div');
            ripple.className = 'ripple ripple-anim';
            ripple.style.position = 'fixed';
            ripple.style.left = (sx - 40) + 'px';
            ripple.style.top = (sy - 40) + 'px';
            document.body.appendChild(ripple);
            // Transition to CHILD2 after brief delay
            fadeScreenTo(1, 1400);
            setTimeout(() => {
                finishChild2Transition();
                fadeScreenTo(0, 1300);
                ripple.remove();
            }, 1400);
        }

        function finishChild2Transition() {
            currentScene = SCENE.CHILD2;
            // Wider world for school — longer hallway
            worldWidth = Math.max(width * 2.8, 2400);
            schoolBgNpcs = null;
            schoolBgObjects = null;
            baby = new Child(babyColorScheme);
            baby.x = worldWidth * 0.3;
            initBassDrops();
            initCarryHatLayer();
            initCarrySnareLayer();
            initCarryCymbalLayer();
            buildScoreHud();
            updateScoreToggleUi();
            child2TransitionLock = false;
            orbWorldX = baby.x;
            orbWorldY = height * ROOM_WALL_RATIO + TONE_FLOOR_OFFSET;
            orbParticles = [];
        }

        function handleChild2Choice(clickedDrop) {
            if (!clickedDrop.bassNotes) return;
            child2ActivityChoice = clickedDrop.activityId;
            inheritedBassPattern = clickedDrop.pattern ? clickedDrop.pattern.slice() : null;
            inheritedBassNotes = clickedDrop.bassNotes ? clickedDrop.bassNotes.slice() : null;
            inheritedBassAttacks = clickedDrop.bassAttacks ? clickedDrop.bassAttacks.slice() : null;
            inheritedBassDurations = clickedDrop.bassDurations ? clickedDrop.bassDurations.slice() : null;
            inheritedBassSustainType = clickedDrop.bassSustainType ? clickedDrop.bassSustainType.slice() : null;
            inheritedBassSoundConfig = clickedDrop.bassStyle || null;
            inheritedBassStyleClass = 'bass';

            if (clickedDrop.activityLabels) {
                selectedToys.push({
                    id: clickedDrop.activityId,
                    name: clickedDrop.activityName,
                    labels: clickedDrop.activityLabels
                });
            }

            // Dispose all CHILD2 tone drops before launching minigame
            disposeToneDrops();
            toneDrops = [];

            const sx = clickedDrop.x - cameraX;
            const sy = clickedDrop.y;
            const ripple = document.createElement('div');
            ripple.className = 'ripple ripple-anim';
            ripple.style.position = 'fixed';
            ripple.style.left = (sx - 40) + 'px';
            ripple.style.top = (sy - 40) + 'px';
            document.body.appendChild(ripple);
            setTimeout(() => ripple.remove(), 1200);

            if (child2ActivityChoice === 'sports_field') {
                isMinigameActive = true;
                minigameTriggerDrop = clickedDrop;
                document.body.classList.add('minigame-active');
                minigameWrapper.classList.add('visible');
                minigameCanvas.style.backgroundColor = '#68b848'; // Soccer Green
                
                let minigamePlayer = new Child(babyColorScheme);
                minigamePlayer.faceType = baby.faceType;
                minigamePlayer.isBoy = baby.isBoy;
                minigamePlayer.hairStyle = baby.hairStyle;
                
                activeMinigame = new SoccerMinigame(minigamePlayer, minigameCtx);
            } else if (child2ActivityChoice === 'library') {
                isMinigameActive = true;
                minigameTriggerDrop = clickedDrop;
                document.body.classList.add('minigame-active');
                minigameWrapper.classList.add('visible');
                minigameCanvas.style.backgroundColor = '#f0ece4'; // Library Floor Color
                
                let minigamePlayer = new Child(babyColorScheme);
                minigamePlayer.faceType = baby.faceType;
                minigamePlayer.isBoy = baby.isBoy;
                minigamePlayer.hairStyle = baby.hairStyle;
                
                activeMinigame = new LibraryMinigame(minigamePlayer, minigameCtx);
            } else if (child2ActivityChoice === 'science_room') {
                isMinigameActive = true;
                minigameTriggerDrop = clickedDrop;
                document.body.classList.add('minigame-active');
                minigameWrapper.classList.add('visible');
                minigameCanvas.style.backgroundColor = '#e0e4e8'; // Science Lab Gray
                
                let minigamePlayer = new Child(babyColorScheme);
                minigamePlayer.faceType = baby.faceType;
                minigamePlayer.isBoy = baby.isBoy;
                minigamePlayer.hairStyle = baby.hairStyle;
                
                activeMinigame = new ScienceMinigame(minigamePlayer, minigameCtx);
            } else if (child2ActivityChoice === 'reading') {
                isMinigameActive = true;
                minigameTriggerDrop = clickedDrop;
                document.body.classList.add('minigame-active');
                minigameWrapper.classList.add('visible');
                minigameCanvas.style.backgroundColor = '#fdfaf0'; // Warm Parchment
                
                let minigamePlayer = new Child(babyColorScheme);
                minigamePlayer.faceType = baby.faceType;
                minigamePlayer.isBoy = baby.isBoy;
                minigamePlayer.hairStyle = baby.hairStyle;
                
                activeMinigame = new ReadingMinigame(minigamePlayer, minigameCtx);
            } else if (child2ActivityChoice === 'chatting') {
                isMinigameActive = true;
                minigameTriggerDrop = clickedDrop;
                document.body.classList.add('minigame-active');
                minigameWrapper.classList.add('visible');
                minigameCanvas.style.backgroundColor = '#fce4ec'; // Soft Pink Chat Room
                
                let minigamePlayer = new Child(babyColorScheme);
                minigamePlayer.faceType = baby.faceType;
                minigamePlayer.isBoy = baby.isBoy;
                minigamePlayer.hairStyle = baby.hairStyle;
                
                activeMinigame = new ChattingMinigame(minigamePlayer, minigameCtx);
            } else if (child2ActivityChoice === 'doodle') {
                isMinigameActive = true;
                minigameTriggerDrop = clickedDrop;
                document.body.classList.add('minigame-active');
                minigameWrapper.classList.add('visible');
                minigameCanvas.style.backgroundColor = '#2c5040'; // Blackboard Green
                
                let minigamePlayer = new Child(babyColorScheme);
                minigamePlayer.faceType = baby.faceType;
                minigamePlayer.isBoy = baby.isBoy;
                minigamePlayer.hairStyle = baby.hairStyle;
                
                activeMinigame = new DoodleMinigame(minigamePlayer, minigameCtx);
            } else if (child2ActivityChoice === 'organ') {
                isMinigameActive = true;
                minigameTriggerDrop = clickedDrop;
                document.body.classList.add('minigame-active');
                minigameWrapper.classList.add('visible');
                minigameCanvas.style.backgroundColor = '#4e342e'; // Deep Organ Wood
                
                let minigamePlayer = new Child(babyColorScheme);
                minigamePlayer.faceType = baby.faceType;
                minigamePlayer.isBoy = baby.isBoy;
                minigamePlayer.hairStyle = baby.hairStyle;
                
                activeMinigame = new OrganMinigame(minigamePlayer, minigameCtx);
            }
        }

// ==========================================
// Minigame: Library (Sorting & Focus)
// ==========================================
class LibraryMinigame {
    constructor(playerChar, ctx) {
        this.ctx = ctx;
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        this.alpha = 0;
        this.state = 'intro';
        this.timer = 0;
        this.bookCounter = 0;

        const getStat = (key) => selectedToys.reduce((sum, t) => sum + (t.labels && t.labels[key] ? t.labels[key] : 0), 0);
        const studyPts = getStat('study');
        const focusedPts = getStat('focused');
        const patientPts = getStat('patient');
        const organizedPts = getStat('organized');

        this.player = {
            char: playerChar,
            x: this.width / 2,
            y: this.height - 80,
            noiseResistance: 1 + (focusedPts * 0.25),
            scoreBonus: organizedPts * 0.1,
            hasGuide: studyPts >= 4
        };

        this.timeRemaining = 45 + (patientPts * 3); // Slightly more time
        this.noise = 0;
        this.maxNoise = 100;
        this.isStunned = false;
        this.stunTimer = 0;
        
        this.books = [];
        this.shelves = [
            { id: 0, color: "hsl(210, 65%, 70%)", label: "A", x: 150, y: 120, w: 100, h: 140 },
            { id: 1, color: "hsl(30, 70%, 75%)", label: "B", x: 350, y: 120, w: 100, h: 140 },
            { id: 2, color: "hsl(330, 65%, 75%)", label: "C", x: 550, y: 120, w: 100, h: 140 }
        ];
        
        this.heldBook = null;
        this.score = 0;
        this.targetScore = 8;
        this.isPaused = false;
        this.frameCount = 0;
        this.spawnBook();
    }

    spawnBook() {
        this.bookCounter++;
        const shelfIdx = Math.floor(Math.random() * 3);
        const targetShelf = this.shelves[shelfIdx];
        this.books = [{
            id: this.bookCounter,
            x: this.width / 2 + (Math.random() - 0.5) * 200,
            y: this.height - 120,
            targetIdx: shelfIdx,
            color: targetShelf.color,
            w: 30,
            h: 45,
            isDragging: false
        }];
    }

    closeMinigame(resultLabel) {
        if (!baby.minigameResults) baby.minigameResults = [];
        baby.minigameResults.push({ toy: "library", result: resultLabel, timestamp: Date.now() });

        if (resultLabel === "勝利") {
            selectedToys.push({
                id: "library_victory",
                name: "Perfect Sorting",
                labels: { study: 3, organized: 3 }
            });
        } else if (resultLabel === "引き分け") {
            selectedToys.push({
                id: "library_draw",
                name: "Quiet Effort",
                labels: { focused: 1, patient: 1 }
            });
        }

        activeMinigame = null;
        isMinigameActive = false;
        minigameTriggerDrop = null;
        document.body.classList.remove('minigame-active');
        minigameWrapper.classList.remove('visible');
        const btn = document.getElementById('minigame-quit-btn');
        if (btn) btn.remove();
        transitionMinigameToLesson();
    }

    showQuitConfirmation() {
        if (this.isPaused) return;
        this.isPaused = true;
        const isFinished = this.state === 'finished';
        const modal = document.createElement('div');
        modal.id = 'minigame-modal';
        const enText = isFinished ? "Return to the classroom?" : "Do you want to stop organizing?";
        const jpText = isFinished ? "教室に戻りますか？" : "片付けをやめて戻りますか？";
        modal.innerHTML = `<div class="modal-content"><p class="en">${enText}</p><p class="jp">${jpText}</p><div class="modal-buttons"><button id="modal-yes">YES</button><button id="modal-no">NO</button></div></div>`;
        document.body.appendChild(modal);
        document.getElementById('modal-yes').onclick = () => {
            modal.remove();
            let label = this.score >= this.targetScore ? "勝利" : (this.score > 0 ? "引き分け" : "友達を置いて放棄");
            this.closeMinigame(label);
        };
        document.getElementById('modal-no').onclick = () => { modal.remove(); this.isPaused = false; };
    }

    update(mouseX, mouseY) {
        if (this.isPaused) return;
        this.frameCount++;
        if (this.alpha < 1) this.alpha += 0.05;

        if (this.state === 'intro') {
            this.timer++;
            if (this.timer > 480) { this.state = 'playing'; this.timer = 0; }
            return;
        }

        if (this.state === 'finished') {
            this.timer++;
            if (this.timer > 180) { this.alpha -= 0.05; if (this.alpha <= 0) this.closeMinigame(this.score >= this.targetScore ? "勝利" : "引き分け"); }
            return;
        }

        if (this.state === 'playing') {
            if (this.frameCount % 60 === 0 && this.timeRemaining > 0) {
                this.timeRemaining--;
                if (this.timeRemaining <= 0) {
                    this.timeRemaining = 0;
                    this.state = 'finished';
                }
            }

            if (this.isStunned) {
                this.stunTimer--;
                if (this.stunTimer <= 0) this.isStunned = false;
                this.noise *= 0.92;
                return;
            }

            let dx = mouseX - this.player.x;
            if (Math.abs(dx) > 10) {
                this.player.x += dx * 0.1;
                this.player.char.direction = dx < 0 ? -1 : 1;
                this.player.char.walkCycle += 0.15;
            }

            if (orbDragging && !this.heldBook) {
                const book = this.books.find(b => Math.hypot(mouseX - b.x, mouseY - b.y) < 40);
                if (book) { this.heldBook = book; book.isDragging = true; }
            } else if (!orbDragging && this.heldBook) {
                const shelf = this.shelves.find(s => mouseX > s.x - s.w/2 && mouseX < s.x + s.w/2 && mouseY > s.y - s.h/2 && mouseY < s.y + s.h/2);
                if (shelf && shelf.id === this.heldBook.targetIdx) {
                    this.score++;
                    this.books = [];
                    if (this.score < this.targetScore) this.spawnBook();
                    else this.state = 'finished';
                }
                if (this.heldBook) {
                    this.heldBook.isDragging = false;
                    this.heldBook = null;
                }
            }

            if (this.heldBook) {
                let dmx = mouseX - this.heldBook.x;
                let dmy = mouseY - this.heldBook.y;
                let speed = Math.hypot(dmx, dmy);
                this.heldBook.x = mouseX;
                this.heldBook.y = mouseY;
                
                // --- BALANCED NOISE LOGIC ---
                if (speed > 1.8) {
                    this.noise += (speed - 1.8) * (2.2 / this.player.noiseResistance);
                } else {
                    this.noise = Math.max(0, this.noise - 0.15);
                }

                if (this.noise >= this.maxNoise) {
                    this.isStunned = true;
                    this.stunTimer = 240; 
                    this.heldBook.isDragging = false;
                    this.heldBook = null;
                }
            } else {
                this.noise = Math.max(0, this.noise - 0.5);
            }
        }
    }

    draw() {
        const c = this.ctx;
        c.clearRect(0, 0, this.width, this.height);
        c.save();
        c.globalAlpha = Math.max(0, this.alpha);

        c.fillStyle = "#f0ece4";
        c.beginPath(); c.roundRect(0, 0, this.width, this.height, 80); c.fill();

        this.shelves.forEach(s => {
            c.fillStyle = "#9a8a68";
            c.beginPath(); c.roundRect(s.x - s.w/2 - 5, s.y - s.h/2 - 5, s.w + 10, s.h + 10, 8); c.fill();
            c.fillStyle = "#ede5da";
            c.beginPath(); c.roundRect(s.x - s.w/2, s.y - s.h/2, s.w, s.h, 4); c.fill();
            c.fillStyle = s.color;
            c.beginPath(); c.arc(s.x, s.y - s.h/2 + 30, 20, 0, Math.PI*2); c.fill();
            c.fillStyle = "#fff";
            c.font = "800 18px 'Zen Maru Gothic'";
            c.textAlign = "center";
            c.textBaseline = "middle";
            c.fillText(s.label, s.x, s.y - s.h/2 + 31);

            if (this.player.hasGuide && this.heldBook && this.heldBook.targetIdx === s.id) {
                c.strokeStyle = s.color;
                c.lineWidth = 4;
                c.setLineDash([5, 5]);
                c.strokeRect(s.x - s.w/2 - 10, s.y - s.h/2 - 10, s.w + 20, s.h + 20);
                c.setLineDash([]);
            }
        });

        this.books.forEach(b => {
            c.fillStyle = b.color;
            c.beginPath(); c.roundRect(b.x - b.w/2, b.y - b.h/2, b.w, b.h, 3); c.fill();
            c.strokeStyle = "rgba(255,255,255,0.5)";
            c.lineWidth = 2;
            c.stroke();
            c.fillStyle = "rgba(0,0,0,0.1)";
            c.fillRect(b.x - b.w/2, b.y - b.h/2, 6, b.h);
        });

        c.save();
        c.translate(this.player.x, this.player.y);
        c.scale(0.6, 0.6);
        this.player.char.draw(c);
        c.restore();

        const meterW = 200, meterH = 12;
        const mx = this.width/2 - meterW/2, my = this.height - 40;
        c.fillStyle = "rgba(0,0,0,0.1)";
        c.beginPath(); c.roundRect(mx, my, meterW, meterH, 6); c.fill();
        const noiseFill = (this.noise / this.maxNoise) * meterW;
        c.fillStyle = this.noise > 80 ? "#e85050" : "#907858";
        c.beginPath(); c.roundRect(mx, my, noiseFill, meterH, 6); c.fill();
        c.fillStyle = "#5a4a3e";
        c.font = "700 10px 'Zen Maru Gothic'";
        c.textAlign = "center";
        c.fillText("SILENCE", this.width/2, my - 5);

        c.fillStyle = "#5a4a3e";
        c.font = "800 20px 'Zen Maru Gothic'";
        c.textAlign = "left";
        c.fillText(`BOOKS: ${this.score}/${this.targetScore}`, 40, 40);
        c.textAlign = "right";
        c.fillText(`TIME: ${this.timeRemaining}`, this.width - 40, 40);

        if (this.isStunned) {
            c.fillStyle = "rgba(255,255,255,0.75)";
            c.fillRect(0, 0, this.width, this.height);
            c.fillStyle = "#e85050";
            c.font = "900 72px 'Zen Maru Gothic'";
            c.textAlign = "center";
            c.fillText("SHH!", this.width/2, this.height/2 - 10);
            c.font = "800 24px 'Zen Maru Gothic'";
            c.fillText("（シーッ！）", this.width/2, this.height/2 + 40);
        }

        if (this.state === 'intro') {
            c.fillStyle = "rgba(0,0,0,0.65)";
            c.beginPath(); c.roundRect(0, 0, this.width, this.height, 80); c.fill();
            const totalIntroFrames = 480, countdownStartFrame = 300;
            if (this.timer < countdownStartFrame) {
                c.fillStyle = "#fff";
                c.font = "800 42px 'Zen Maru Gothic'";
                c.textAlign = "center";
                c.fillText("QUIET TIME", this.width/2, this.height/2 - 40);
                c.font = "600 18px 'Zen Maru Gothic'";
                c.fillText("マウスで本を掴んで（長押し）、同じ色の棚まで静かに運ぼう", this.width/2, this.height/2 + 10);
                c.fillStyle = "#ffdf00";
                c.font = "700 16px 'Zen Maru Gothic'";
                c.fillText("※素早く動かすと図書委員に怒られて中断されます！", this.width/2, this.height/2 + 45);
            } else {
                const countdownTime = Math.ceil((totalIntroFrames - this.timer) / 60);
                const progressInSecond = (this.timer % 60) / 60;
                c.fillStyle = "#fff";
                c.textAlign = "center";
                c.textBaseline = "middle";
                const size = 80 + (progressInSecond * 40);
                c.font = `900 ${size}px 'Zen Maru Gothic'`;
                c.globalAlpha = Math.max(0, 1 - progressInSecond);
                if (countdownTime >= 1) c.fillText(countdownTime.toString(), this.width/2, this.height/2);
                c.globalAlpha = 1.0;
            }
            if (!document.getElementById('minigame-quit-btn')) {
                const btn = document.createElement('button'); btn.id = 'minigame-quit-btn'; btn.innerText = "教室に戻る"; btn.onclick = () => this.showQuitConfirmation(); document.body.appendChild(btn);
            }
        }

        if (this.state === 'finished') {
            c.fillStyle = "rgba(0,0,0,0.8)";
            c.beginPath(); c.roundRect(0, 0, this.width, this.height, 80); c.fill();
            c.fillStyle = "#ffdf00";
            c.font = "900 64px 'Zen Maru Gothic'";
            c.textAlign = "center";
            c.fillText(this.score >= this.targetScore ? "PERFECT!" : "TIME UP", this.width/2, this.height/2);
        }
        c.restore();
    }
}


window.addEventListener('keyup', e => {
    if (!activeMinigame) return;
    // Input for minigame removed as player movement is mouse-based.
    // Keeping this listener for potential future use or debugging.
});

canvas.addEventListener('mousedown', e => {
    if (activeMinigame) { /* Removed click-to-shoot logic */ }
});
canvas.addEventListener('mouseup', e => {
    if (activeMinigame) { /* Removed click-to-shoot logic */ }
});

// ==========================================
// Minigame: Soccer (Table Hockey Style)
// ==========================================
class SoccerMinigame {
    constructor(playerChar, ctx) {
        this.ctx = ctx;
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        this.alpha = 0;
        this.state = 'intro';
        this.timer = 0;

        const activePts = selectedToys.reduce((sum, t) => sum + (t.labels && t.labels.active ? t.labels.active : 0), 0);
        const hasSoccerFacility = childFacilities.some(f => f.id === 'soccer');

        this.player = {
            x: 100, y: this.height / 2, vx: 0, vy: 0,
            speed: 3.5 + (activePts >= 5 ? 1.5 : 0) + (hasSoccerFacility ? 1.0 : 0),
            shootPower: 12 + (activePts >= 5 ? 3 : 0) + (hasSoccerFacility ? 3 : 0),
            radius: 25,
            score: 0,
            char: playerChar
        };

        this.enemy = {
            x: this.width - 100, y: this.height / 2, vx: 0, vy: 0,
            speed: 3.4,
            shootPower: 11,
            radius: 25,
            score: 0,
            char: this.createEnemyChar(),
            targetX: this.width - 100,
            targetY: this.height / 2,
            state: 'chase'
        };

        this.ball = { x: this.width / 2, y: this.height / 2, vx: 0, vy: 0, radius: 10 };
        this.goalWidth = 160; // 広くなったゴール
        this.timeRemaining = 120; // 2 minutes in seconds
        this.isPaused = false;
        this.resultTimer = 0;
        this.frameCount = 0;
    }

    closeMinigame(resultLabel) {
        // 1. Store results before clearing the instance
        if (!baby.minigameResults) baby.minigameResults = [];
        baby.minigameResults.push({ toy: "soccer", result: resultLabel, timestamp: Date.now() });

        // 2. Apply penalties or bonuses based on performance
        if (resultLabel === "友達を置いて放棄") {
            const statsToPenalty = ['social', 'empathetic', 'expressive', 'cooperative'];
            statsToPenalty.forEach(stat => {
                if (baby.affinity && baby.affinity[stat] !== undefined) {
                    baby.affinity[stat] = Math.max(0, baby.affinity[stat] - 3);
                }
            });
        } else if (resultLabel === "勝利") {
            selectedToys.push({
                id: "soccer_victory",
                name: "Soccer Victory",
                labels: { resilient: 3, optimistic: 3 }
            });
        } else if (resultLabel === "引き分け") {
            selectedToys.push({
                id: "soccer_draw",
                name: "Soccer Effort",
                labels: { resilient: 1, optimistic: 1 }
            });
        }

        // 3. Clear minigame state
        activeMinigame = null;
        isMinigameActive = false;
        minigameTriggerDrop = null;
        document.body.classList.remove('minigame-active');
        minigameWrapper.classList.remove('visible');

        // Remove the return button if it exists
        const btn = document.getElementById('minigame-quit-btn');
        if (btn) btn.remove();

        // 4. Transition to lesson phase
        transitionMinigameToLesson();
    }

    showQuitConfirmation() {
        if (this.isPaused) return;
        this.isPaused = true;
        
        const isFinished = this.state === 'finished';
        const modal = document.createElement('div');
        modal.id = 'minigame-modal';
        
        const enText = isFinished ? "Return to the classroom?" : "Do you want to leave your friends behind?";
        const jpText = isFinished ? "教室に戻りますか？" : "友達を置いて戻りますか？";

        modal.innerHTML = `
            <div class="modal-content">
                <p class="en">${enText}</p>
                <p class="jp">${jpText}</p>
                <div class="modal-buttons">
                    <button id="modal-yes">YES</button>
                    <button id="modal-no">NO</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('modal-yes').onclick = () => {
            modal.remove();
            let label = "友達を置いて放棄";
            if (isFinished) {
                label = "引き分け";
                if (this.player.score > this.enemy.score) label = "勝利";
                else if (this.player.score < this.enemy.score) label = "敗北";
            }
            this.closeMinigame(label);
        };
        document.getElementById('modal-no').onclick = () => {
            modal.remove();
            this.isPaused = false;
        };
    }

    createEnemyChar() {
        const enemyColors = {
            body: "hsl(210, 65%, 60%)", limb: "hsl(210, 50%, 40%)",
            head: "hsl(30, 60%, 80%)", skin: "hsl(30, 60%, 80%)",
            cheek: "hsl(350, 60%, 80%)", hair: "hsl(30, 20%, 30%)"
        };
        let enemy = new Child(enemyColors);
        enemy.isBoy = true;
        enemy.hairStyle = 2;
        return enemy;
    }

    resetPositions() {
        this.player.x = 100; this.player.y = this.height / 2;
        this.enemy.x = this.width - 100; this.enemy.y = this.height / 2;
        this.ball.x = this.width / 2; this.ball.y = this.height / 2;
        this.ball.vx = 0; this.ball.vy = 0;
    }

    update(mouseX, mouseY) {
        if (this.isPaused) return;
        this.frameCount++;

        if (this.alpha < 1) this.alpha += 0.05;

        if (this.state === 'playing') {
            if (this.frameCount % 60 === 0) {
                this.timeRemaining--;
                if (this.timeRemaining <= 0) {
                    this.timeRemaining = 0;
                    this.state = 'finished';
                    this.timer = 0;
                }
            }
        }

        if (this.state === 'goal') {
            this.timer++;
            if (this.timer > 90) {
                if (this.player.score >= 3 || this.enemy.score >= 3) {
                    this.state = 'finished';
                    this.timer = 0;
                } else {
                    this.resetPositions();
                    this.state = 'playing';
                }
            }
            return;
        }

        if (this.state === 'finished') {
            this.timer++;
            if (this.timer > 300) {
                this.alpha -= 0.05;
                if (this.alpha <= 0.01) {
                    let label = "引き分け";
                    if (this.player.score > this.enemy.score) label = "勝利";
                    else if (this.player.score < this.enemy.score) label = "敗北";
                    this.closeMinigame(label);
                }
            }
            return;
        }
        
        if (this.state === 'intro') {
            this.timer++;
            if (this.timer > 360) {
                this.state = 'playing';
                this.timer = 0;
            }
            return;
        }

        if (mouseX !== undefined && mouseY !== undefined) {
            let dx = mouseX - this.player.x;
            let dy = mouseY - this.player.y;
            let len = Math.hypot(dx, dy);
            
            if (len > this.player.radius * 0.5) {
                this.player.x += (dx / len) * this.player.speed;
                this.player.y += (dy / len) * (this.player.speed * 0.9);
                this.player.char.walkCycle += 0.25;
                this.player.char.direction = dx < 0 ? -1 : 1;
            }
        }

        const lagFactor = 0.1;
        const ball = this.ball;
        const enemy = this.enemy;
        let targetX = ball.x;
        let targetY = ball.y;
        enemy.targetX += (targetX - enemy.targetX) * lagFactor;
        enemy.targetY += (targetY - enemy.targetY) * lagFactor;
        let edx = enemy.targetX - enemy.x;
        let edy = enemy.targetY - enemy.y;
        let elen = Math.hypot(edx, edy);
        if (elen > 0.5) {
            enemy.x += (edx / elen) * enemy.speed;
            enemy.y += (edy / elen) * enemy.speed;
            enemy.char.walkCycle += 0.25;
            enemy.char.direction = edx < 0 ? -1 : 1;
        }

        const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
        this.player.x = clamp(this.player.x, this.player.radius, this.width - this.player.radius);
        this.player.y = clamp(this.player.y, this.player.radius, this.height - this.player.radius);
        enemy.x = clamp(enemy.x, enemy.radius, this.width - enemy.radius);
        enemy.y = clamp(enemy.y, enemy.radius, this.height - enemy.radius);

        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.vx *= 0.95;
        ball.vy *= 0.95;

        const goalTop = this.height / 2 - this.goalWidth / 2;
        const goalBottom = this.height / 2 + this.goalWidth / 2;
        const cornerRadius = 80;
        const bounceStrength = 0.8;

        let collided = false;
        if (ball.x - ball.radius < 0 && ball.y > goalTop && ball.y < goalBottom) {
            enemy.score++; this.state = 'goal'; this.timer = 0;
        } else if (ball.x + ball.radius > this.width && ball.y > goalTop && ball.y < goalBottom) {
            this.player.score++; this.state = 'goal'; this.timer = 0;
        }

        if (this.state !== 'goal') {
            const innerL = cornerRadius;
            const innerR = this.width - cornerRadius;
            const innerT = cornerRadius;
            const innerB = this.height - cornerRadius;
            let nx = 0, ny = 0;

            if (ball.x < innerL && ball.y < innerT) {
                const dx = ball.x - innerL, dy = ball.y - innerT;
                const dist = Math.hypot(dx, dy);
                if (dist > cornerRadius - ball.radius) {
                    nx = dx / dist; ny = dy / dist;
                    ball.x = innerL + nx * (cornerRadius - ball.radius);
                    ball.y = innerT + ny * (cornerRadius - ball.radius);
                    collided = true;
                }
            } else if (ball.x > innerR && ball.y < innerT) {
                const dx = ball.x - innerR, dy = ball.y - innerT;
                const dist = Math.hypot(dx, dy);
                if (dist > cornerRadius - ball.radius) {
                    nx = dx / dist; ny = dy / dist;
                    ball.x = innerR + nx * (cornerRadius - ball.radius);
                    ball.y = innerT + ny * (cornerRadius - ball.radius);
                    collided = true;
                }
            } else if (ball.x < innerL && ball.y > innerB) {
                const dx = ball.x - innerL, dy = ball.y - innerB;
                const dist = Math.hypot(dx, dy);
                if (dist > cornerRadius - ball.radius) {
                    nx = dx / dist; ny = dy / dist;
                    ball.x = innerL + nx * (cornerRadius - ball.radius);
                    ball.y = innerB + ny * (cornerRadius - ball.radius);
                    collided = true;
                }
            } else if (ball.x > innerR && ball.y > innerB) {
                const dx = ball.x - innerR, dy = ball.y - innerB;
                const dist = Math.hypot(dx, dy);
                if (dist > cornerRadius - ball.radius) {
                    nx = dx / dist; ny = dy / dist;
                    ball.x = innerR + nx * (cornerRadius - ball.radius);
                    ball.y = innerB + ny * (cornerRadius - ball.radius);
                    collided = true;
                }
            } else {
                if (ball.y - ball.radius < 0) { ball.y = ball.radius; ball.vy *= -bounceStrength; }
                else if (ball.y + ball.radius > this.height) { ball.y = this.height - ball.radius; ball.vy *= -bounceStrength; }
                if (ball.x - ball.radius < 0) { ball.x = ball.radius; ball.vx *= -bounceStrength; }
                else if (ball.x + ball.radius > this.width) { ball.x = this.width - ball.radius; ball.vx *= -bounceStrength; }
            }

            if (collided) {
                const dot = ball.vx * nx + ball.vy * ny;
                if (dot > 0) {
                    ball.vx -= (1 + bounceStrength) * dot * nx;
                    ball.vy -= (1 + bounceStrength) * dot * ny;
                }
            }
        }

        const checkCollision = (charInfo, isPlayer) => {
            let dist = Math.hypot(ball.x - charInfo.x, ball.y - charInfo.y);
            if (dist < charInfo.radius + ball.radius) {
                let nx = (ball.x - charInfo.x) / dist;
                let ny = (ball.y - charInfo.y) / dist;
                ball.x = charInfo.x + nx * (charInfo.radius + ball.radius);
                ball.y = charInfo.y + ny * (charInfo.radius + ball.radius);
                const forwardX = isPlayer ? 1 : -1;
                const biasStrength = 0.3;
                let finalNx = (nx * (1 - biasStrength)) + (forwardX * biasStrength);
                let finalNy = ny;
                const isAttacking = isPlayer ? (ball.x > this.width * 0.6) : (ball.x < this.width * 0.4);
                if (isAttacking) {
                    const attractionStrength = 0.4;
                    const gx = isPlayer ? this.width : 0;
                    const gy = this.height / 2;
                    const gdx = gx - ball.x, gdy = gy - ball.y;
                    const glen = Math.hypot(gdx, gdy);
                    if (glen > 0) {
                        finalNx = (finalNx * (1 - attractionStrength)) + ((gdx / glen) * attractionStrength);
                        finalNy = (finalNy * (1 - attractionStrength)) + ((gdy / glen) * attractionStrength);
                    }
                }
                const len = Math.hypot(finalNx, finalNy);
                ball.vx = (finalNx / len) * charInfo.speed * 1.6;
                ball.vy = (finalNy / len) * charInfo.speed * 1.6;
            }
        };
        checkCollision(this.player, true);
        checkCollision(enemy, false);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, this.alpha);
        this.ctx.fillStyle = "#68b848";
        this.ctx.beginPath(); this.ctx.roundRect(0, 0, this.width, this.height, 80); this.ctx.fill();
        const gTop = this.height / 2 - this.goalWidth / 2;
        const gBottom = this.height / 2 + this.goalWidth / 2;
        const goalDepth = 15;
        this.ctx.strokeStyle = "rgba(255,255,255,0.9)";
        this.ctx.lineWidth = 4;
        this.ctx.beginPath(); this.ctx.moveTo(goalDepth, gTop); this.ctx.lineTo(0, gTop); this.ctx.lineTo(0, gBottom); this.ctx.lineTo(goalDepth, gBottom); this.ctx.stroke();
        this.ctx.beginPath(); this.ctx.moveTo(this.width - goalDepth, gTop); this.ctx.lineTo(this.width, gTop); this.ctx.lineTo(this.width, gBottom); this.ctx.lineTo(this.width - goalDepth, gBottom); this.ctx.stroke();
        this.ctx.strokeStyle = "rgba(255,255,255,0.8)"; this.ctx.lineWidth = 3;
        this.ctx.beginPath(); this.ctx.moveTo(this.width / 2, 0); this.ctx.lineTo(this.width / 2, this.height); this.ctx.stroke();
        this.ctx.beginPath(); this.ctx.arc(this.width / 2, this.height / 2, 60, 0, Math.PI * 2); this.ctx.stroke();
        this.ctx.fillStyle = "#fff"; this.ctx.beginPath(); this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI*2); this.ctx.fill();
        this.ctx.strokeStyle = "#333"; this.ctx.lineWidth = 1.5; this.ctx.beginPath(); this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI*2); this.ctx.stroke();
                this.ctx.fillStyle = "#333";
                this.ctx.beginPath(); this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius * 0.4, 0, Math.PI*2); this.ctx.fill();
        
                // 内部座標のリセット（二重翻訳防止）
                this.player.char.x = 0; this.player.char.y = 0;
                this.enemy.char.x = 0; this.enemy.char.y = 0;
        
                this.ctx.save();
                this.ctx.translate(this.player.x, this.player.y);
                this.ctx.scale(0.55, 0.55);
                this.player.char.draw(this.ctx);
                this.ctx.restore();
        
                this.ctx.save();
                this.ctx.translate(this.enemy.x, this.enemy.y);
                this.ctx.scale(0.55, 0.55);
                this.enemy.char.draw(this.ctx);
                this.ctx.restore();
        this.ctx.globalAlpha = 0.15; this.ctx.fillStyle = "#fff";
        this.ctx.beginPath(); this.ctx.arc(this.player.x, this.player.y, this.player.radius, 0, Math.PI * 2); this.ctx.fill();
        this.ctx.beginPath(); this.ctx.arc(this.enemy.x, this.enemy.y, this.enemy.radius, 0, Math.PI * 2); this.ctx.fill();
        this.ctx.globalAlpha = Math.max(0, this.alpha);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.globalAlpha = Math.max(0, this.alpha);
        const mins = Math.floor(this.timeRemaining / 60), secs = this.timeRemaining % 60;
        this.ctx.fillStyle = "#fff"; this.ctx.font = "800 24px 'Zen Maru Gothic', sans-serif"; this.ctx.textAlign = "right"; this.ctx.textBaseline = "top"; this.ctx.shadowColor = "rgba(0,0,0,0.5)"; this.ctx.shadowBlur = 4;
        this.ctx.fillText(`TIME: ${mins}:${secs.toString().padStart(2, '0')}`, this.width - 20, 15);
        this.ctx.textAlign = "center"; this.ctx.font = "800 36px 'Zen Maru Gothic', sans-serif"; this.ctx.fillText(`${this.player.score} - ${this.enemy.score}`, this.width / 2, 15);
        if (this.player.score === 2 || this.enemy.score === 2) {
            this.ctx.fillStyle = "#ffdf00"; this.ctx.font = "800 18px 'Zen Maru Gothic', sans-serif";
            const labelX = this.player.score === 2 ? this.width / 2 - 110 : this.width / 2 + 110;
            this.ctx.fillText("Match Point", labelX, 15);
        }
        this.ctx.shadowBlur = 0; this.ctx.textBaseline = "middle";
        if (this.state === 'intro' || this.state === 'goal' || this.state === 'finished') {
            this.ctx.fillStyle = `rgba(0,0,0,${this.state === 'finished' ? 0.85 : 0.6})`;
            this.ctx.beginPath(); this.ctx.roundRect(0, 0, this.width, this.height, 80); this.ctx.fill();
            if (this.state === 'intro') {
                if (!document.getElementById('minigame-quit-btn')) {
                    const btn = document.createElement('button'); btn.id = 'minigame-quit-btn'; btn.innerText = "教室に戻る"; btn.onclick = () => this.showQuitConfirmation(); document.body.appendChild(btn);
                }
                const totalIntroFrames = 360, countdownStartFrame = 180;
                if (this.timer < countdownStartFrame) {
                    this.ctx.fillStyle = "#fff"; this.ctx.font = "800 52px 'Zen Maru Gothic', sans-serif"; this.ctx.fillText("READY?", this.width / 2, this.height / 2 - 65);
                    this.ctx.fillStyle = "#ffdf00"; this.ctx.font = "800 22px 'Zen Maru Gothic', sans-serif"; this.ctx.fillText("First to 3 points wins!", this.width / 2, this.height / 2);
                    this.ctx.font = "800 32px 'Zen Maru Gothic', sans-serif"; this.ctx.fillText("3点先取で勝ち！", this.width / 2, this.height / 2 + 40);
                    this.ctx.fillStyle = "#fff"; this.ctx.font = "600 18px 'Zen Maru Gothic', sans-serif"; this.ctx.fillText("マウスで移動してボールをゴールに入れよう", this.width / 2, this.height / 2 + 85);
                } else {
                    const countdownTime = Math.ceil((totalIntroFrames - this.timer) / 60), progressInSecond = (this.timer % 60) / 60;
                    this.ctx.fillStyle = "#fff";
                    this.ctx.textAlign = "center";
                    this.ctx.textBaseline = "middle";
                    const size = 80 + (progressInSecond * 40); this.ctx.font = `900 ${size}px 'Zen Maru Gothic', sans-serif`; this.ctx.globalAlpha = Math.max(0, 1 - progressInSecond);
                    if (countdownTime >= 1) this.ctx.fillText(countdownTime.toString(), this.width / 2, this.height / 2);
                    this.ctx.globalAlpha = 1.0;
                }
            } else if (this.state === 'goal') {
                this.ctx.fillStyle = "#ffdf00"; this.ctx.font = "800 72px 'Zen Maru Gothic', sans-serif"; this.ctx.fillText("GOAL!", this.width / 2, this.height / 2);
            } else {
                const isWin = this.player.score > this.enemy.score, isDraw = this.player.score === this.enemy.score;
                this.ctx.shadowColor = "rgba(0,0,0,0.5)"; this.ctx.shadowBlur = 10;
                if (isDraw) {
                    this.ctx.fillStyle = "#fff"; this.ctx.font = "800 72px 'Zen Maru Gothic', sans-serif"; this.ctx.fillText("DRAW", this.width / 2, this.height / 2);
                } else if (isWin) {
                    this.ctx.fillStyle = "#ffdf00"; this.ctx.font = "900 84px 'Zen Maru Gothic', sans-serif"; this.ctx.fillText("YOU WIN!", this.width / 2, this.height / 2);
                    this.ctx.font = "800 24px 'Zen Maru Gothic', sans-serif"; this.ctx.fillStyle = "#fff"; this.ctx.fillText("最高の結果だね！", this.width / 2, this.height / 2 + 70);
                } else {
                    this.ctx.fillStyle = "#50a8e0"; this.ctx.font = "900 84px 'Zen Maru Gothic', sans-serif"; this.ctx.fillText("YOU LOSE...", this.width / 2, this.height / 2);
                    this.ctx.font = "800 24px 'Zen Maru Gothic', sans-serif"; this.ctx.fillStyle = "#fff"; this.ctx.fillText("次は勝てるよ！", this.width / 2, this.height / 2 + 70);
                }
                this.ctx.shadowBlur = 0;
            }
        }
        this.ctx.restore();
    }
}


        // Choice/tone selection is now handled by "filled tone only" click gating.

// ==========================================
// Minigame: Science (Color Alchemy)
// ==========================================
class ScienceMinigame {
    constructor(playerChar, ctx) {
        this.ctx = ctx;
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        this.alpha = 0;
        this.state = 'intro';
        this.timer = 0;

        const getStat = (key) => selectedToys.reduce((sum, t) => sum + (t.labels && t.labels[key] ? t.labels[key] : 0), 0);
        const curiousPts = getStat('curious');
        const focusedPts = getStat('focused');
        const cautiousPts = getStat('cautious');

        this.targetRGB = {
            r: 50 + Math.random() * 180,
            g: 50 + Math.random() * 180,
            b: 50 + Math.random() * 180
        };
        this.currentRGB = { r: 245, g: 245, b: 245 };
        this.player = {
            char: playerChar,
            x: 120,
            y: this.height - 80,
            dropPrecision: 1 + (focusedPts * 0.25),
            showAnalysis: curiousPts >= 4,
            successThreshold: 0.96 - (cautiousPts * 0.005)
        };
        this.beakers = [
            { id: 'r', color: "#ff5050", x: 480, y: this.height - 100, w: 55, h: 90, rgb: {r:28, g:-12, b:-12} },
            { id: 'g', color: "#50ff50", x: 570, y: this.height - 100, w: 55, h: 90, rgb: {r:-12, g:28, b:-12} },
            { id: 'b', color: "#5050ff", x: 660, y: this.height - 100, w: 55, h: 90, rgb: {r:-12, g:-12, b:28} }
        ];
        this.timeRemaining = 45;
        this.score = 0;
        this.isPaused = false;
        this.bubbles = [];
        this.frameCount = 0;
    }

    closeMinigame(resultLabel) {
        if (!baby.minigameResults) baby.minigameResults = [];
        baby.minigameResults.push({ toy: "science", result: resultLabel, timestamp: Date.now() });
        if (resultLabel === "勝利") {
            selectedToys.push({ id: "science_victory", name: "Master Alchemist", labels: { curious: 3, creative: 3 } });
        } else if (resultLabel === "引き分け") {
            selectedToys.push({ id: "science_draw", name: "Junior Chemist", labels: { focused: 1, cautious: 1 } });
        } else if (resultLabel === "友達を置いて放棄") {
            const stats = ['curious', 'cautious'];
            stats.forEach(s => { if (baby.affinity && baby.affinity[s] !== undefined) baby.affinity[s] = Math.max(0, baby.affinity[s] - 2); });
        }
        activeMinigame = null;
        isMinigameActive = false;
        minigameTriggerDrop = null;
        document.body.classList.remove('minigame-active');
        minigameWrapper.classList.remove('visible');
        const btn = document.getElementById('minigame-quit-btn');
        if (btn) btn.remove();
        transitionMinigameToLesson();
    }

    showQuitConfirmation() {
        if (this.isPaused) return;
        this.isPaused = true;
        const isFinished = this.state === 'finished';
        const modal = document.createElement('div');
        modal.id = 'minigame-modal';
        const enText = isFinished ? "Return to the classroom?" : "Do you want to stop the experiment?";
        const jpText = isFinished ? "教室に戻りますか？" : "実験をやめて戻りますか？";
        modal.innerHTML = `<div class="modal-content"><p class="en">${enText}</p><p class="jp">${jpText}</p><div class="modal-buttons"><button id="modal-yes">YES</button><button id="modal-no">NO</button></div></div>`;
        document.body.appendChild(modal);
        document.getElementById('modal-yes').onclick = () => {
            modal.remove();
            let label = this.score >= this.player.successThreshold ? "勝利" : (this.score > 0.8 ? "引き分け" : "友達を置いて放棄");
            this.closeMinigame(label);
        };
        document.getElementById('modal-no').onclick = () => { modal.remove(); this.isPaused = false; };
    }

    addDrop(beaker) {
        const amount = 1.0 / this.player.dropPrecision;
        this.currentRGB.r = Math.max(0, Math.min(255, this.currentRGB.r + beaker.rgb.r * amount));
        this.currentRGB.g = Math.max(0, Math.min(255, this.currentRGB.g + beaker.rgb.g * amount));
        this.currentRGB.b = Math.max(0, Math.min(255, this.currentRGB.b + beaker.rgb.b * amount));
        for(let i=0; i<5; i++) {
            this.bubbles.push({
                x: 300 + (Math.random()-0.5) * 60, y: 220 + Math.random() * 40,
                vx: (Math.random()-0.5) * 2, vy: -Math.random() * 3 - 1,
                size: 3 + Math.random() * 6, life: 1.0
            });
        }
    }

    update(mouseX, mouseY) {
        if (this.isPaused) return;
        this.frameCount++;
        if (this.alpha < 1) this.alpha += 0.05;
        if (this.state === 'intro') {
            this.timer++;
            if (this.timer > 480) { this.state = 'playing'; this.timer = 0; }
            return;
        }
        if (this.state === 'finished') {
            this.timer++;
            if (this.timer > 180) { this.alpha -= 0.05; if (this.alpha <= 0) this.closeMinigame(this.score >= this.player.successThreshold ? "勝利" : "引き分け"); }
            return;
        }
        if (this.state === 'playing') {
            if (this.frameCount % 60 === 0 && this.timeRemaining > 0) {
                this.timeRemaining--;
                if (this.timeRemaining <= 0) this.state = 'finished';
            }
            const dr = this.targetRGB.r - this.currentRGB.r, dg = this.targetRGB.g - this.currentRGB.g, db = this.targetRGB.b - this.currentRGB.b;
            const maxDist = Math.sqrt(255*255 * 3), dist = Math.sqrt(dr*dr + dg*dg + db*db);
            this.score = 1.0 - (dist / maxDist);
            if (orbDragging && this.frameCount % 8 === 0) {
                const b = this.beakers.find(bk => Math.hypot(mouseX - bk.x, mouseY - bk.y) < 40);
                if (b) this.addDrop(b);
            }
            this.bubbles.forEach(b => { b.x += b.vx; b.y += b.vy; b.life -= 0.02; });
            this.bubbles = this.bubbles.filter(b => b.life > 0);
            let dx = mouseX - this.player.x;
            if (Math.abs(dx) > 10) { this.player.x += dx * 0.1; this.player.char.direction = dx < 0 ? -1 : 1; this.player.char.walkCycle += 0.15; }
        }
    }

    draw() {
        const c = this.ctx;
        c.clearRect(0, 0, this.width, this.height);
        c.save();
        c.globalAlpha = Math.max(0, this.alpha);
        c.fillStyle = "#ced4d8";
        c.beginPath(); c.roundRect(0, 0, this.width, this.height, 80); c.fill();
        c.fillStyle = "#9ba4a8";
        c.fillRect(0, this.height - 120, this.width, 120);
        c.fillStyle = "#fff";
        c.beginPath(); c.roundRect(40, 40, 120, 120, 10); c.fill();
        c.fillStyle = `rgb(${this.targetRGB.r}, ${this.targetRGB.g}, ${this.targetRGB.b})`;
        c.beginPath(); c.roundRect(50, 50, 100, 100, 5); c.fill();
        c.fillStyle = "#5a4a3e";
        c.font = "bold 12px 'Zen Maru Gothic'"; c.textAlign = "center"; c.fillText("TARGET", 100, 165);
        const fx = 300, fy = 200;
        c.fillStyle = "rgba(255,255,255,0.4)";
        c.beginPath(); c.moveTo(fx-20, fy-80); c.lineTo(fx+20, fy-80); c.lineTo(fx+20, fy-40); c.quadraticCurveTo(fx+80, fy+80, fx, fy+80); c.quadraticCurveTo(fx-80, fy+80, fx-20, fy-40); c.closePath(); c.fill();
        c.save(); c.clip();
        c.fillStyle = `rgb(${this.currentRGB.r}, ${this.currentRGB.g}, ${this.currentRGB.b})`;
        c.fillRect(fx-80, fy-20, 160, 120);
        this.bubbles.forEach(b => { c.fillStyle = `rgba(255,255,255,${b.life * 0.5})`; c.beginPath(); c.arc(b.x, b.y, b.size, 0, Math.PI*2); c.fill(); });
        c.restore();
        c.strokeStyle = "rgba(255,255,255,0.8)"; c.lineWidth = 3; c.stroke();
        this.beakers.forEach(b => {
            c.fillStyle = "rgba(255,255,255,0.3)"; c.beginPath(); c.roundRect(b.x-b.w/2, b.y-b.h/2, b.w, b.h, 5); c.fill();
            c.fillStyle = b.color; c.beginPath(); c.roundRect(b.x-b.w/2+5, b.y+10, b.w-10, b.h/2-5, 2); c.fill();
            c.strokeStyle = "#fff"; c.lineWidth = 2; c.stroke();
            if (this.player.showAnalysis && this.state === 'playing') {
                const diff = (b.id==='r'? (this.targetRGB.r-this.currentRGB.r) : (b.id==='g'? (this.targetRGB.g-this.currentRGB.g) : (this.targetRGB.b-this.currentRGB.b)));
                if (Math.abs(diff) > 15) { c.fillStyle = diff > 0 ? "#ffdf00" : "#888"; c.font = "bold 20px sans-serif"; c.fillText(diff > 0 ? "↑" : "↓", b.x, b.y - 50); }
            }
        });
        const smW = 300, smH = 20, smx = this.width/2 - smW/2, smy = 40;
        c.fillStyle = "rgba(0,0,0,0.1)"; c.beginPath(); c.roundRect(smx, smy, smW, smH, 10); c.fill();
        const scoreFill = Math.max(0, this.score) * smW;
        const color = this.score > this.player.successThreshold ? "#50ff50" : (this.score > 0.8 ? "#ffdf00" : "#ff5050");
        c.fillStyle = color;
        c.beginPath(); c.roundRect(smx, smy, scoreFill, smH, 10); c.fill();
        c.fillStyle = "#5a4a3e"; c.font = "bold 14px 'Zen Maru Gothic'"; c.textAlign = "center"; c.fillText(`HARMONY: ${Math.floor(this.score * 100)}%`, this.width/2, smy + 40);
        c.textAlign = "right"; c.fillText(`TIME: ${this.timeRemaining}`, this.width - 40, 40);
        c.save(); c.translate(this.player.x, this.player.y); c.scale(0.6, 0.6); this.player.char.draw(c); c.restore();
        if (this.state === 'intro') {
            c.fillStyle = "rgba(0,0,0,0.65)"; c.beginPath(); c.roundRect(0, 0, this.width, this.height, 80); c.fill();
            const totalIntroFrames = 480, countdownStartFrame = 300;
            if (this.timer < countdownStartFrame) {
                c.fillStyle = "#fff"; 
                c.textAlign = "center";
                c.textBaseline = "middle";
                c.font = "800 42px 'Zen Maru Gothic'"; c.fillText("SOUND ALCHEMY", this.width/2, this.height/2-40);
                c.font = "600 18px 'Zen Maru Gothic'"; c.fillText("原液を混ぜて、左上のターゲットと同じ色を作ろう", this.width/2, this.height/2+10);
                c.fillStyle = "#ffdf00"; c.font = "700 16px 'Zen Maru Gothic'"; c.fillText("※精度96%以上で完璧な調合です。慎重に、かつ大胆に！", this.width/2, this.height/2+45);
            } else {
                const ct = Math.ceil((totalIntroFrames - this.timer) / 60), pr = (this.timer % 60) / 60;
                c.fillStyle = "#fff";
                c.textAlign = "center";
                c.textBaseline = "middle";
                c.font = `900 ${80+(pr*40)}px 'Zen Maru Gothic'`; c.globalAlpha = Math.max(0, 1-pr); if (ct >= 1) c.fillText(ct.toString(), this.width/2, this.height/2);
            }
            if (!document.getElementById('minigame-quit-btn')) { const btn = document.createElement('button'); btn.id = 'minigame-quit-btn'; btn.innerText = "教室に戻る"; btn.onclick = () => this.showQuitConfirmation(); document.body.appendChild(btn); }
        }
        if (this.state === 'finished') {
            c.fillStyle = "rgba(0,0,0,0.85)"; c.beginPath(); c.roundRect(0, 0, this.width, this.height, 80); c.fill();
            const isWin = this.score >= this.player.successThreshold;
            c.fillStyle = isWin ? "#ffdf00" : "#fff"; c.font = "900 64px 'Zen Maru Gothic'"; c.textAlign = "center"; c.fillText(isWin ? "SUCCESS!" : "TIME UP", this.width/2, this.height/2);
            c.font = "bold 24px 'Zen Maru Gothic'"; c.fillText(`Accuracy: ${Math.floor(this.score * 100)}%`, this.width/2, this.height/2 + 60);
        }
        c.restore();
    }
}

// ==========================================
// Minigame: Reading (Knowledge Gathering)
// ==========================================
class ReadingMinigame {
    constructor(playerChar, ctx) {
        this.ctx = ctx;
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        this.alpha = 0;
        this.state = 'intro';
        this.timer = 0;

        const getStat = (key) => selectedToys.reduce((sum, t) => sum + (t.labels && t.labels[key] ? t.labels[key] : 0), 0);
        const studyPts = getStat('study');

        this.player = { char: playerChar, x: 120, y: this.height - 80 };
        this.quizPool = this.getQuizPool();
        this.questions = this.pickQuestions(studyPts);
        this.currentQIdx = 0;
        this.score = 0;
        this.totalRequired = 3;
        this.isPaused = false;
        this.frameCount = 0;
        this.selectedOption = -1;
        this.feedbackTimer = 0;
        this.isCorrect = false;
    }

    getQuizPool() {
        return [
            // Level 1: Very Easy
            { lv: 1, text: "青い空に白い雲が浮かんでいます。小さな猫が赤い屋根の上で昼寝をしています。", q: "猫はどこで昼寝をしていますか？", opts: ["青い空", "赤い屋根", "白い雲"], ans: 1 },
            { lv: 1, text: "朝ごはんに、ジャムを塗ったトーストとオレンジジュースを食べました。", q: "トーストに何を塗りましたか？", opts: ["バター", "ハチミツ", "ジャム"], ans: 2 },
            { lv: 1, text: "雨の日、太郎くんは黄色い長靴を履いて、お気に入りの傘を持って出かけました。", q: "長靴の色は何色ですか？", opts: ["黄色", "青色", "赤色"], ans: 0 },
            { lv: 1, text: "公園のベンチにおじいさんが座っています。隣には大きな犬がいます。", q: "おじいさんの隣にいるのは？", opts: ["猫", "犬", "鳥"], ans: 1 },
            { lv: 1, text: "机の上にリンゴが3つあります。お母さんがさらに2つ置きました。", q: "リンゴは全部でいくつ？", opts: ["3つ", "4つ", "5つ"], ans: 2 },
            { lv: 1, text: "夜空に大きなお月様が出ています。星もキラキラと輝いています。", q: "夜空に出ているのは？", opts: ["太陽", "お月様", "虹"], ans: 1 },
            // Level 2: Easy
            { lv: 2, text: "図書室はとても静かです。窓際の席で花子さんは冒険の物語を読んでいます。", q: "花子さんは何を読んでいますか？", opts: ["教科書", "冒険の物語", "新聞"], ans: 1 },
            { lv: 2, text: "理科の実験で、青い液体に魔法の粉を入れると、一瞬で紫色に変わりました。", q: "液体は何色に変わりましたか？", opts: ["緑色", "紫色", "黄色"], ans: 1 },
            { lv: 2, text: "算数の授業中、先生が黒板に円を描きました。半径は5センチメートルです。", q: "先生が描いた図形は？", opts: ["四角", "三角", "円"], ans: 2 },
            { lv: 2, text: "お弁当の時間、おにぎりの中身は鮭でした。デザートは甘いイチゴです。", q: "おにぎりの中身は何？", opts: ["梅", "鮭", "昆布"], ans: 1 },
            { lv: 2, text: "森の中に古い時計台があります。12時になると鐘が鳴ります。", q: "鐘が鳴るのは何時？", opts: ["10時", "11時", "12時"], ans: 2 },
            { lv: 2, text: "音楽室からピアノの音が聞こえます。誰かが静かな曲を練習しています。", q: "聞こえてくる楽器の音は？", opts: ["ギター", "ピアノ", "太鼓"], ans: 1 },
            // Level 3: Medium
            { lv: 3, text: "古い日記帳を開くと、10年前の夏の記憶が蘇りました。そこにはひまわり畑の写真がありました。", q: "日記帳には何の写真がありましたか？", opts: ["海", "ひまわり畑", "雪山"], ans: 1 },
            { lv: 3, text: "遠くから聞こえる汽笛の音。旅人は鞄を握り直し、西へと向かう列車を待ちました。", q: "旅人はどの方角へ向かおうとしていますか？", opts: ["東", "西", "南"], ans: 1 },
            { lv: 3, text: "夕暮れ時、影が長く伸びています。子供たちは影踏みをして遊んでいます。", q: "子供たちは何をして遊んでいますか？", opts: ["影踏み", "かけっこ", "隠れん坊"], ans: 0 },
            { lv: 3, text: "手紙には「来月、青い鳥を探しに山へ行きます」と書かれていました。", q: "手紙の送り主はどこへ行きますか？", opts: ["海", "山", "街"], ans: 1 },
            { lv: 3, text: "冬の夜、窓の外では雪が静かに降り積もり、街を真っ白に染め上げました。", q: "外で降っているものは何？", opts: ["雨", "雪", "雹"], ans: 1 },
            { lv: 3, text: "ケーキ屋さんで一番人気のショートケーキは、生クリームがたっぷり乗っています。", q: "一番人気のケーキは？", opts: ["チョコケーキ", "ショートケーキ", "チーズケーキ"], ans: 1 },
            // Level 4: Complex
            { lv: 4, text: "図書館の奥深く、誰も読まない古い本の中に、銀色のしおりが挟まれていました。そこには謎の地図が描かれています。", q: "しおりには何が描かれていましたか？", opts: ["花の絵", "古い詩", "謎の地図"], ans: 2 },
            { lv: 4, text: "波打ち際で拾った貝殻を耳に当てると、遠い海の記憶が囁くような音が聞こえました。それは不思議なリズムでした。", q: "貝殻から何が聞こえましたか？", opts: ["風の音", "海の記憶", "鳥の鳴き声"], ans: 1 },
            { lv: 4, text: "時計の針が刻む音だけが響く部屋で、少年は宇宙の果てについて想像を巡らせていました。彼のノートは星の図でいっぱいです。", q: "少年は何について考えていましたか？", opts: ["過去の歴史", "深海の世界", "宇宙の果て"], ans: 2 },
            { lv: 4, text: "祭りの夜、提灯の明かりが川面に反射し、まるで光の魚が泳いでいるようでした。人々は浴衣を着て歩いています。", q: "光の魚の正体は何ですか？", opts: ["本物の魚", "提灯の反射", "流し灯籠"], ans: 1 },
            { lv: 4, text: "庭に咲く名もなき花は、太陽が昇ると開き、沈むと閉じます。その色は淡い月のような黄色でした。", q: "花の色はどんな黄色ですか？", opts: ["鮮やかな金", "淡い月のような", "オレンジに近い"], ans: 1 },
            { lv: 4, text: "洞窟の奥から響く水滴の音。そのリズムは、古の時代から変わらぬ一定の間隔を保っていました。", q: "水滴の音のリズムはどうでしたか？", opts: ["不規則", "速くなっている", "一定の間隔"], ans: 2 },
            // Level 5: Poetic/Hard
            { lv: 5, text: "風が運んできたのは、見知らぬ異国のスパイスの香りと、かすかな楽器の音。それは北から吹き抜ける季節の変わり目の風でした。", q: "風はどの方角から吹いてきましたか？", opts: ["北", "東", "西"], ans: 0 },
            { lv: 5, text: "鏡の中に映る自分は、自分であって自分ではないような気がした。それは、昨日読んだ哲学書の言葉が頭を離れないからだろう。", q: "何の影響で「自分ではない」と感じましたか？", opts: ["暗い部屋", "昨日読んだ本", "体調不良"], ans: 1 },
            { lv: 5, text: "影絵のように揺れる木々。月明かりが作り出すその複雑な幾何学模様は、まるで誰かへの秘密のメッセージのようだった。", q: "木々の影は何に見えると表現されていますか？", opts: ["恐ろしい怪物", "誰かへの伝言", "秘密のメッセージ"], ans: 2 },
            { lv: 5, text: "沈黙は雄弁に語る。何も言わない時間こそが、二人の間にあったわだかまりを溶かしていく。それは雪解けのような静かな変化だった。", q: "わだかまりを溶かしたものは何？", opts: ["謝罪の言葉", "沈黙", "贈り物"], ans: 1 },
            { lv: 5, text: "深海に沈む難破船。そこにはかつての大航海時代の夢が、珊瑚に覆われながらも静かに眠り続けている。時間はそこだけ止まっていた。", q: "難破船は何に覆われていますか？", opts: ["海藻", "金銀財宝", "珊瑚"], ans: 1 },
            { lv: 5, text: "記憶の糸を辿ると、幼い頃に見た虹の端っこに辿り着いた。そこには宝物ではなく、ただ温かい手の感触が残っていた。", q: "虹の端っこに辿り着いた時、何がありましたか？", opts: ["黄金の壺", "温かい手の感触", "秘密の鍵"], ans: 1 }
        ];
    }

    pickQuestions(studyPts) {
        let minLv = 3, maxLv = 5;
        if (studyPts >= 6) { minLv = 1; maxLv = 3; }
        else if (studyPts >= 3) { minLv = 2; maxLv = 4; }
        const pool = this.quizPool.filter(q => q.lv >= minLv && q.lv <= maxLv);
        const shuffled = pool.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 3);
    }

    closeMinigame(resultLabel) {
        if (!baby.minigameResults) baby.minigameResults = [];
        baby.minigameResults.push({ toy: "reading", result: resultLabel, timestamp: Date.now() });
        if (resultLabel === "勝利") {
            selectedToys.push({ id: "reading_victory", name: "Perfect Clarity", labels: { study: 3, focused: 3, patient: 2 } });
        } else if (resultLabel === "友達を置いて放棄") {
            if (baby.affinity && baby.affinity.study !== undefined) baby.affinity.study = Math.max(0, baby.affinity.study - 2);
        }
        activeMinigame = null; isMinigameActive = false; minigameTriggerDrop = null;
        document.body.classList.remove('minigame-active'); minigameWrapper.classList.remove('visible');
        const btn = document.getElementById('minigame-quit-btn'); if (btn) btn.remove();
        transitionMinigameToLesson();
    }

    showQuitConfirmation() {
        if (this.isPaused) return;
        this.isPaused = true;
        const isFinished = this.state === 'finished' || this.state === 'failed';
        const modal = document.createElement('div'); modal.id = 'minigame-modal';
        const enText = isFinished ? "Return to the classroom?" : "Do you want to stop reading?";
        const jpText = isFinished ? "教室に戻りますか？" : "読書をやめて戻りますか？";
        modal.innerHTML = `<div class="modal-content"><p class="en">${enText}</p><p class="jp">${jpText}</p><div class="modal-buttons"><button id="modal-yes">YES</button><button id="modal-no">NO</button></div></div>`;
        document.body.appendChild(modal);
        document.getElementById('modal-yes').onclick = () => {
            modal.remove();
            let label = this.state === 'finished' ? "勝利" : "友達を置いて放棄";
            this.closeMinigame(label);
        };
        document.getElementById('modal-no').onclick = () => { modal.remove(); this.isPaused = false; };
    }

    update(mouseX, mouseY) {
        if (this.isPaused) return;
        this.frameCount++;
        if (this.alpha < 1) this.alpha += 0.05;

        if (this.state === 'intro') {
            this.timer++; if (this.timer > 480) { this.state = 'reading'; this.timer = 0; }
            return;
        }

        if (this.state === 'reading') {
            if (minigameClick) { this.state = 'question'; minigameClick = false; }
        } else if (this.state === 'question') {
            if (minigameClick) {
                for (let i = 0; i < 3; i++) {
                    const bx = this.width / 2 - 150, by = 220 + i * 50, bw = 300, bh = 40;
                    if (mouseX > bx && mouseX < bx + bw && mouseY > by && mouseY < by + bh) {
                        this.selectedOption = i;
                        this.isCorrect = (i === this.questions[this.currentQIdx].ans);
                        this.state = 'feedback';
                        this.feedbackTimer = 90;
                        break;
                    }
                }
                minigameClick = false;
            }
        } else if (this.state === 'feedback') {
            this.feedbackTimer--;
            if (this.feedbackTimer <= 0) {
                if (this.isCorrect) {
                    this.currentQIdx++;
                    this.selectedOption = -1;
                    if (this.currentQIdx >= this.totalRequired) {
                        this.state = 'finished';
                        this.timer = 0; // Reset timer for result screen
                    } else {
                        this.state = 'reading';
                    }
                } else {
                    this.state = 'failed';
                    this.timer = 0; // Reset timer for result screen
                }
            }
        } else if (this.state === 'finished' || this.state === 'failed') {
            this.timer++;
            if (this.timer > 180) {
                this.alpha -= 0.05;
                if (this.alpha <= 0) this.closeMinigame(this.state === 'finished' ? "勝利" : "敗北");
            }
        }

        let dx = mouseX - this.player.x;
        if (Math.abs(dx) > 10) { this.player.x += dx * 0.1; this.player.char.direction = dx < 0 ? -1 : 1; this.player.char.walkCycle += 0.15; }
    }

    draw() {
        const c = this.ctx; c.clearRect(0, 0, this.width, this.height);
        c.save(); c.globalAlpha = Math.max(0, this.alpha);
        c.fillStyle = "#fdfaf0"; c.beginPath(); c.roundRect(0, 0, this.width, this.height, 80); c.fill();
        const grad = c.createLinearGradient(this.width/2-40, 0, this.width/2+40, 0);
        grad.addColorStop(0, "rgba(0,0,0,0)"); grad.addColorStop(0.5, "rgba(0,0,0,0.06)"); grad.addColorStop(1, "rgba(0,0,0,0)");
        c.fillStyle = grad; c.fillRect(this.width/2-40, 0, 80, this.height);

        c.save(); c.translate(this.player.x, this.player.y); c.scale(0.6, 0.6); this.player.char.draw(c); c.restore();

        const q = this.questions[this.currentQIdx];
        
        if (q && (this.state === 'reading' || this.state === 'question' || this.state === 'feedback')) {
            c.fillStyle = "#3a2e22"; c.textAlign = "center"; c.textBaseline = "middle";
            if (this.state === 'reading') {
                c.font = "bold 18px 'Zen Maru Gothic'";
                this.wrapText(q.text, this.width / 2, this.height / 2 - 20, 400, 28);
                c.fillStyle = "rgba(0,0,0,0.3)"; c.font = "12px sans-serif";
                c.fillText("クリックしてページをめくる", this.width / 2, this.height - 40);
            } else if (this.state === 'question' || this.state === 'feedback') {
                c.font = "bold 20px 'Zen Maru Gothic'";
                c.fillText(q.q, this.width / 2, 140);
                for (let i = 0; i < 3; i++) {
                    const bx = this.width / 2 - 150, by = 220 + i * 50, bw = 300, bh = 40;
                    c.fillStyle = (this.state === 'feedback' && i === q.ans) ? "#50ff50" : 
                                 (this.state === 'feedback' && i === this.selectedOption ? "#ff5050" : "#fff");
                    c.beginPath(); c.roundRect(bx, by, bw, bh, 5); c.fill();
                    c.strokeStyle = "#9a8a68"; c.lineWidth = 2; c.stroke();
                    c.fillStyle = "#3a2e22"; c.font = "16px 'Zen Maru Gothic'";
                    c.fillText(q.opts[i], this.width / 2, by + bh / 2);
                }
            }
        }

        if (this.state === 'intro') {
            c.fillStyle = "rgba(0,0,0,0.65)"; c.beginPath(); c.roundRect(0, 0, this.width, this.height, 80); c.fill();
            const totalIntroFrames = 480, countdownStartFrame = 300;
            if (this.timer < countdownStartFrame) {
                c.fillStyle = "#fff"; 
                c.textAlign = "center";
                c.textBaseline = "middle";
                c.font = "800 42px 'Zen Maru Gothic'";
                c.fillText("READING COMPREHENSION", this.width/2, this.height/2-40);
                c.font = "600 18px 'Zen Maru Gothic'"; c.fillText("文章を読んで、その後のクイズに答えよう", this.width/2, this.height/2+10);
                c.fillStyle = "#ffdf00"; c.font = "700 16px 'Zen Maru Gothic'"; c.fillText("※全3問。一回でも間違えると失敗です。集中して読もう！", this.width/2, this.height/2+45);
            } else {
                const ct = Math.ceil((totalIntroFrames - this.timer) / 60), pr = (this.timer % 60) / 60;
                c.fillStyle = "#fff";
                c.textAlign = "center";
                c.textBaseline = "middle";
                c.font = `900 ${80+(pr*40)}px 'Zen Maru Gothic'`; c.globalAlpha = Math.max(0, 1-pr); if (ct >= 1) c.fillText(ct.toString(), this.width/2, this.height/2);
            }
            if (!document.getElementById('minigame-quit-btn')) {
                const btn = document.createElement('button'); btn.id = 'minigame-quit-btn'; btn.innerText = "教室に戻る"; btn.onclick = () => this.showQuitConfirmation(); document.body.appendChild(btn);
            }
        } else if (this.state === 'finished' || this.state === 'failed') {
            c.fillStyle = `rgba(0,0,0,${this.state === 'finished' ? 0.8 : 0.9})`; c.beginPath(); c.roundRect(0, 0, this.width, this.height, 80); c.fill();
            c.fillStyle = this.state === 'finished' ? "#ffdf00" : "#ff5050";
            c.font = "900 64px 'Zen Maru Gothic'";
            c.textAlign = "center";
            c.textBaseline = "middle";
            c.fillText(this.state === 'finished' ? "PERFECT!" : "FAILED", this.width/2, this.height/2);
            c.fillStyle = "#fff"; c.font = "bold 20px 'Zen Maru Gothic'";
            c.fillText(this.state === 'finished' ? "素晴らしい理解力です！" : "読み直しが必要かもしれません...", this.width/2, this.height/2 + 60);
        }
        c.restore();
    }

    wrapText(text, x, y, maxWidth, lineHeight) {
        const words = text.split(''); let line = '';
        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n];
            let metrics = this.ctx.measureText(testLine);
            if (metrics.width > maxWidth && n > 0) {
                this.ctx.fillText(line, x, y); line = words[n]; y += lineHeight;
            } else { line = testLine; }
        }
        this.ctx.fillText(line, x, y);
    }
}

// ==========================================
// Minigame: Chatting (Echo Chat)
// ==========================================
class ChattingMinigame {
    constructor(playerChar, ctx) {
        this.ctx = ctx;
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        this.alpha = 0;
        this.state = 'intro';
        this.timer = 0;

        const getStat = (key) => selectedToys.reduce((sum, t) => sum + (t.labels && t.labels[key] ? t.labels[key] : 0), 0);
        const socialPts = getStat('social');
        const expressivePts = getStat('expressive');

        this.player = {
            char: playerChar,
            x: this.width / 2,
            y: this.height - 20,
            judgeTolerance: 1.0 + (expressivePts * 0.1) 
        };

        this.friends = [
            { char: this.createFriend(0), x: 40, y: 340, side: 'left' },
            { char: this.createFriend(1), x: this.width - 40, y: 340, side: 'right' }
        ];

        this.timeRemaining = 20;
        this.lives = 3;
        this.symbols = [];
        this.currentPath = [];
        this.isPaused = false;
        this.frameCount = 0;
        this.spawnInterval = 85 - (socialPts * 3);
        this.symbolsToSpawn = 18;
        this.spawnCount = 0;
        this.shapes = [
            { id: 'circle', label: '◯' },
            { id: 'v',      label: 'V' },
            { id: 'line',   label: 'ー' },
            { id: 'triangle', label: '△' }
        ];
        this.inkDrops = [];
        this.shakeTimer = 0;
        this.damageFlash = 0;
    }

    createFriend(idx) {
        const colors = idx === 0 ? 
            { body: "hsl(200, 60%, 70%)", limb: "hsl(200, 50%, 50%)", head: "hsl(25, 70%, 85%)", skin: "hsl(25, 70%, 85%)", cheek: "hsl(350, 70%, 85%)", hair: "hsl(40, 30%, 40%)" } :
            { body: "hsl(140, 50%, 70%)", limb: "hsl(140, 40%, 50%)", head: "hsl(30, 60%, 85%)", skin: "hsl(30, 60%, 85%)", cheek: "hsl(350, 60%, 85%)", hair: "hsl(20, 40%, 30%)" };
        let f = new Child(colors);
        f.faceType = (idx + 2) % 5; f.isBoy = idx % 2 === 0;
        return f;
    }

    spawnSymbol() {
        if (this.spawnCount >= this.symbolsToSpawn) return;
        const sideIdx = Math.random() < 0.5 ? 0 : 1;
        const friend = this.friends[sideIdx];
        const shape = this.shapes[Math.floor(Math.random() * this.shapes.length)];
        const spawnX = sideIdx === 0 ? friend.x + 100 : friend.x - 100;
        const spawnY = friend.y - 120;
        this.symbols.push({
            id: Date.now(), x: spawnX, y: spawnY, startX: spawnX, startY: spawnY,
            targetX: this.width / 2, targetY: this.height - 100,
            shape: shape.id, label: shape.label, progress: 0,
            speed: 0.004 + (this.spawnCount * 0.0002), alive: true
        });
        this.spawnCount++;
    }

    closeMinigame(resultLabel) {
        if (!baby.minigameResults) baby.minigameResults = [];
        baby.minigameResults.push({ toy: "chatting", result: resultLabel, timestamp: Date.now() });
        if (resultLabel === "勝利") {
            selectedToys.push({ id: "chatting_victory", name: "Deep Connection", labels: { social: 3, expressive: 3, optimistic: 2 } });
        }
        activeMinigame = null; isMinigameActive = false; minigameTriggerDrop = null;
        document.body.classList.remove('minigame-active'); minigameWrapper.classList.remove('visible');
        const btn = document.getElementById('minigame-quit-btn'); if (btn) btn.remove();
        transitionMinigameToLesson();
    }

    showQuitConfirmation() {
        if (this.isPaused) return;
        this.isPaused = true;
        const isFinished = this.state === 'finished' || this.state === 'failed';
        const modal = document.createElement('div'); modal.id = 'minigame-modal';
        const enText = isFinished ? "Return to the classroom?" : "Do you want to stop talking?";
        const jpText = isFinished ? "教室に戻りますか？" : "おしゃべりをやめて戻りますか？";
        modal.innerHTML = `<div class="modal-content"><p class="en">${enText}</p><p class="jp">${jpText}</p><div class="modal-buttons"><button id="modal-yes">YES</button><button id="modal-no">NO</button></div></div>`;
        document.body.appendChild(modal);
        document.getElementById('modal-yes').onclick = () => {
            modal.remove();
            let label = this.state === 'finished' ? "勝利" : "友達を置いて放棄";
            this.closeMinigame(label);
        };
        document.getElementById('modal-no').onclick = () => { modal.remove(); this.isPaused = false; };
    }

    recognizeShape(path) {
        if (path.length < 6) return null;
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        path.forEach(p => { if (p.x < minX) minX = p.x; if (p.x > maxX) maxX = p.x; if (p.y < minY) minY = p.y; if (p.y > maxY) maxY = p.y; });
        const w = maxX - minX, h = maxY - minY, centerX = (minX + maxX) / 2, centerY = (minY + maxY) / 2;
        const size = Math.max(w, h); if (size < 15) return null;
        const start = path[0], end = path[path.length - 1];
        const distStartEnd = Math.hypot(start.x - end.x, start.y - end.y);
        const isClosed = distStartEnd < size * 0.6;
        if (h < w * 0.4) return 'line';
        if (isClosed) {
            let distSum = 0; path.forEach(p => { distSum += Math.hypot(p.x - centerX, p.y - centerY); });
            const avgDist = distSum / path.length;
            let variance = 0; path.forEach(p => { variance += Math.abs(Math.hypot(p.x - centerX, p.y - centerY) - avgDist); });
            const roundness = variance / (avgDist * path.length);
            if (roundness < 0.12) return 'circle'; 
            return 'triangle';
        } else {
            const mid = path[Math.floor(path.length / 2)];
            if (mid.y > start.y + 10 && mid.y > end.y + 10) return 'v';
            return 'line';
        }
    }

    update(mouseX, mouseY) {
        if (this.isPaused) return;
        this.frameCount++;
        if (this.alpha < 1) this.alpha += 0.05;
        if (this.shakeTimer > 0) this.shakeTimer--;
        if (this.damageFlash > 0) this.damageFlash -= 0.05;
        if (this.state === 'intro') {
            this.timer++; if (this.timer > 480) { this.state = 'playing'; this.timer = 0; }
            return;
        }
        if (this.state === 'finished' || this.state === 'failed') {
            this.timer++; if (this.timer > 180) { this.alpha -= 0.05; if (this.alpha <= 0) this.closeMinigame(this.state === 'finished' ? "勝利" : "敗北"); }
            return;
        }
        if (this.state === 'playing') {
            if (this.frameCount % 60 === 0 && this.timeRemaining > 0) { this.timeRemaining--; if (this.timeRemaining <= 0) this.state = 'finished'; }
            if (this.frameCount % this.spawnInterval === 0) this.spawnSymbol();
            this.symbols.forEach(s => {
                if (!s.alive) return;
                s.progress += s.speed; s.x = s.startX + (s.targetX - s.startX) * s.progress; s.y = s.startY + (s.targetY - s.startY) * s.progress;
                const distToCenter = Math.hypot(s.x - this.width/2, s.y - (this.height - 100));
                if (s.progress >= 1.0 || distToCenter < 40) {
                    s.alive = false; this.lives--; this.shakeTimer = 15; this.damageFlash = 0.4;
                    if (this.lives <= 0) { this.state = 'failed'; this.timer = 0; }
                }
            });
            if (orbDragging) { this.currentPath.push({ x: mouseX, y: mouseY }); }
            else if (this.currentPath.length > 0) {
                const recognized = this.recognizeShape(this.currentPath);
                if (recognized) {
                    const hit = this.symbols.find(s => s.alive && s.shape === recognized);
                    if (hit) { hit.alive = false; for(let i=0; i<8; i++) { this.inkDrops.push({ x: hit.x, y: hit.y, vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10, life: 1.0, color: '#f06292' }); } }
                }
                this.currentPath = [];
            }
            this.inkDrops.forEach(p => { p.x += p.vx; p.y += p.vy; p.life -= 0.03; });
            this.inkDrops = this.inkDrops.filter(p => p.life > 0);
        }
    }

    draw() {
        const c = this.ctx; c.clearRect(0, 0, this.width, this.height);
        c.save(); if (this.shakeTimer > 0) c.translate((Math.random()-0.5)*10, (Math.random()-0.5)*10);
        c.globalAlpha = Math.max(0, this.alpha);
        c.fillStyle = "#ede5da"; c.beginPath(); c.roundRect(0, 0, this.width, this.height, 80); c.fill();
        c.fillStyle = "#dccca8"; c.fillRect(0, this.height * 0.6, this.width, this.height * 0.4); 
        c.strokeStyle = "rgba(0,0,0,0.05)"; c.lineWidth = 2; c.beginPath(); c.moveTo(0, this.height * 0.6); c.lineTo(this.width, this.height * 0.6); c.stroke();
        c.strokeStyle = "rgba(255, 80, 80, 0.3)"; c.lineWidth = 4; c.setLineDash([10, 10]); c.beginPath(); c.arc(this.width/2, this.height - 100, 120, Math.PI, 0); c.stroke(); c.setLineDash([]);
        this.friends.forEach(f => {
            c.save(); c.translate(f.x, f.y); c.scale(f.side === 'left' ? 2.2 : -2.2, 2.2); f.char.x = 0; f.char.y = 0; f.char.draw(c); c.restore();
        });
        c.save(); c.translate(this.width / 2, this.height + 60); c.scale(2.8, 2.8);
        const myColors = babyColorScheme; c.fillStyle = myColors.skin; c.beginPath(); c.arc(0, -40, 30, 0, Math.PI*2); c.fill(); c.fillStyle = myColors.hair; c.beginPath(); c.arc(0, -42, 32, Math.PI, 0); c.fill();
        c.restore();
        this.symbols.forEach(s => {
            if (!s.alive) return;
            c.save(); c.translate(s.x, s.y); c.fillStyle = "#fff"; c.beginPath(); c.arc(0, 0, 30, 0, Math.PI*2); c.fill(); c.strokeStyle = "#f06292"; c.lineWidth = 3; c.stroke(); c.fillStyle = "#f06292"; c.font = "bold 24px sans-serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(s.label, 0, 0); c.restore();
        });
        if (this.currentPath.length > 1) {
            c.strokeStyle = "rgba(240, 98, 146, 0.6)"; c.lineWidth = 8; c.lineCap = "round"; c.lineJoin = "round"; c.beginPath(); c.moveTo(this.currentPath[0].x, this.currentPath[0].y); this.currentPath.forEach(p => c.lineTo(p.x, p.y)); c.stroke();
        }
        if (this.damageFlash > 0) { c.fillStyle = `rgba(255, 0, 0, ${this.damageFlash})`; c.beginPath(); c.roundRect(0, 0, this.width, this.height, 80); c.fill(); }
        this.inkDrops.forEach(p => { c.fillStyle = p.color; c.globalAlpha = p.life; c.beginPath(); c.arc(p.x, p.y, 4, 0, Math.PI*2); c.fill(); });
        c.fillStyle = "#5a4a3e"; c.font = "bold 20px 'Zen Maru Gothic'"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(`TIME: ${this.timeRemaining}`, this.width/2, 40);
        for(let i=0; i<3; i++) { c.fillStyle = i < this.lives ? "#f06292" : "#ccc"; c.font = "24px sans-serif"; c.fillText("❤", this.width/2 - 40 + i*40, 80); }
        if (this.state === 'intro') {
            c.fillStyle = "rgba(0,0,0,0.65)"; c.beginPath(); c.roundRect(0, 0, this.width, this.height, 80); c.fill();
            const totalIntroFrames = 480, countdownStartFrame = 300;
            if (this.timer < countdownStartFrame) {
                c.fillStyle = "#fff"; c.textAlign = "center"; c.textBaseline = "middle"; c.font = "800 42px 'Zen Maru Gothic'"; c.fillText("ECHO CHAT", this.width/2, this.height/2-40);
                c.font = "600 18px 'Zen Maru Gothic'"; c.fillText("友達との会話をリズムよく繋げよう", this.width/2, this.height/2+10);
                c.fillStyle = "#ffdf00"; c.font = "700 16px 'Zen Maru Gothic'"; c.fillText("※赤いラインに届く前に記号を描いて！(ライフ:3)", this.width/2, this.height/2+45);
            } else {
                const ct = Math.ceil((totalIntroFrames - this.timer) / 60), pr = (this.timer % 60) / 60;
                c.fillStyle = "#fff"; c.textAlign = "center"; c.textBaseline = "middle"; c.font = `900 ${80+(pr*40)}px 'Zen Maru Gothic'`; c.globalAlpha = Math.max(0, 1-pr); if (ct >= 1) c.fillText(ct.toString(), this.width/2, this.height/2);
            }
            if (!document.getElementById('minigame-quit-btn')) { const btn = document.createElement('button'); btn.id = 'minigame-quit-btn'; btn.innerText = "教室に戻る"; btn.onclick = () => this.showQuitConfirmation(); document.body.appendChild(btn); }
        } else if (this.state === 'finished' || this.state === 'failed') {
            c.fillStyle = "rgba(0,0,0,0.85)"; c.beginPath(); c.roundRect(0, 0, this.width, this.height, 80); c.fill();
            const isWin = this.state === 'finished';
            c.fillStyle = isWin ? "#ffdf00" : "#ff5050"; c.textAlign = "center"; c.textBaseline = "middle";
            c.font = "900 64px 'Zen Maru Gothic'"; c.fillText(isWin ? "GREAT CHAT!" : "LOST TRACK...", this.width/2, this.height/2 - 20);
            c.fillStyle = "#fff"; c.font = "bold 24px 'Zen Maru Gothic'";
            c.fillText(isWin ? "軽妙なトークでした！" : "今日はあんまり話せなかった・・・", this.width/2, this.height/2 + 50);
        }
        c.restore();
    }
}

// ==========================================
// Minigame: Doodle (Afterschool Masterpiece)
// ==========================================
class DoodleMinigame {
    constructor(playerChar, ctx) {
        this.ctx = ctx;
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        this.alpha = 0;
        this.state = 'intro';
        this.timer = 0;
        this.bookCounter = 0;

        const getStat = (key) => selectedToys.reduce((sum, t) => sum + (t.labels && t.labels[key] ? t.labels[key] : 0), 0);
        const creativePts = getStat('creative');
        const organizedPts = getStat('organized');

        this.player = {
            char: playerChar,
            x: 100, y: this.height - 80,
            threshold: 0.5 - (creativePts * 0.04), 
            showGrid: organizedPts >= 4
        };

        this.timeRemaining = 35;
        this.chalks = [
            { id: 'white',  color: '#ffffff', label: '白 / WHITE' },
            { id: 'yellow', color: '#ffeb3b', label: '黄 / YELLOW' },
            { id: 'red',    color: '#ff5252', label: '赤 / RED' },
            { id: 'blue',   color: '#40c4ff', label: '青 / BLUE' },
            { id: 'green',  color: '#69f0ae', label: '緑 / GREEN' },
            { id: 'eraser', color: 'eraser',  label: '消しゴム / ERASER' }
        ];
        this.selectedChalk = 0;
        this.strokes = []; 
        this.isDrawing = false;

        this.samples = [
            { name: "Mountain & Sun", shapes: [
                { type: 'mountain', color: '#69f0ae', x: 100, y: 120, size: 60 },
                { type: 'snow',     color: '#ffffff', x: 100, y: 120, size: 20 },
                { type: 'sun',      color: '#ff5252', x: 150, y: 50,  size: 25 },
                { type: 'sunray',   color: '#ffeb3b', x: 150, y: 50,  size: 35 }
            ]},
            { name: "Ship on Sea", shapes: [
                { type: 'sea',      color: '#40c4ff', x: 100, y: 140, size: 80 },
                { type: 'waves',    color: '#ffffff', x: 100, y: 145, size: 70 },
                { type: 'ship_body',color: '#ffffff', x: 100, y: 110, size: 40 },
                { type: 'chimney',  color: '#ff5252', x: 110, y: 90,  size: 10 }
            ]}
        ];
        this.targetSample = this.samples[Math.floor(Math.random() * this.samples.length)];
        this.score = 0; this.isPaused = false; this.frameCount = 0;
    }

    closeMinigame(resultLabel) {
        if (!baby.minigameResults) baby.minigameResults = [];
        baby.minigameResults.push({ toy: "doodle", result: resultLabel, timestamp: Date.now() });
        if (resultLabel === "勝利") {
            selectedToys.push({ id: "doodle_victory", name: "Artistic Soul", labels: { creative: 3, expressive: 3, adventurous: 2 } });
        } else if (resultLabel === "友達を置いて放棄") {
            if (baby.affinity && baby.affinity.creative !== undefined) baby.affinity.creative = Math.max(0, baby.affinity.creative - 2);
        }
        activeMinigame = null; isMinigameActive = false; minigameTriggerDrop = null;
        document.body.classList.remove('minigame-active'); minigameWrapper.classList.remove('visible');
        const btn = document.getElementById('minigame-quit-btn'); if (btn) btn.remove();
        transitionMinigameToLesson();
    }

    showQuitConfirmation() {
        if (this.isPaused) return;
        this.isPaused = true;
        const isFinished = this.state === 'finished' || this.state === 'failed';
        const modal = document.createElement('div'); modal.id = 'minigame-modal';
        const enText = isFinished ? "Return to the classroom?" : "Do you want to stop drawing?";
        const jpText = isFinished ? "教室に戻りますか？" : "お絵描きをやめて戻りますか？";
        modal.innerHTML = `<div class="modal-content"><p class="en">${enText}</p><p class="jp">${jpText}</p><div class="modal-buttons"><button id="modal-yes">YES</button><button id="modal-no">NO</button></div></div>`;
        document.body.appendChild(modal);
        document.getElementById('modal-yes').onclick = () => {
            modal.remove();
            let label = this.state === 'finished' ? "勝利" : "友達を置いて放棄";
            this.closeMinigame(label);
        };
        document.getElementById('modal-no').onclick = () => { modal.remove(); this.isPaused = false; };
    }

    evaluate() {
        let score = 0;
        if (this.strokes.length > 3) score += 50;
        const colorsUsed = new Set(this.strokes.filter(s => s.color !== 'eraser').map(s => s.color)).size;
        score += Math.min(3, colorsUsed) * 15;
        const totalPoints = this.strokes.reduce((acc, s) => acc + s.points.length, 0);
        if (totalPoints > 30) score += 20;
        this.score = Math.min(1.0, score / 100);
        return this.score >= this.player.threshold;
    }

    update(mouseX, mouseY) {
        if (this.isPaused) return;
        this.frameCount++;
        if (this.alpha < 1) this.alpha += 0.05;
        if (this.state === 'intro') {
            this.timer++; if (this.timer > 480) { this.state = 'playing'; this.timer = 0; }
            return;
        }
        if (this.state === 'finished' || this.state === 'failed') {
            this.timer++; if (this.timer > 180) { this.alpha -= 0.05; if (this.alpha <= 0) this.closeMinigame(this.state === 'finished' ? "勝利" : "不合格"); }
            return;
        }
        if (this.state === 'playing') {
            if (this.frameCount % 60 === 0 && this.timeRemaining > 0) {
                this.timeRemaining--; if (this.timeRemaining <= 0) {
                    const passed = this.evaluate(); this.state = passed ? 'finished' : 'failed'; this.timer = 0;
                }
            }
            const drawArea = { x: 280, y: 60, w: 380, h: 280 };
            if (orbDragging && mouseX > drawArea.x && mouseX < drawArea.x + drawArea.w && mouseY > drawArea.y && mouseY < drawArea.y + drawArea.h) {
                if (!this.isDrawing) {
                    this.strokes.push({ points: [], color: this.chalks[this.selectedChalk].color });
                    this.isDrawing = true;
                }
                this.strokes[this.strokes.length - 1].points.push({ x: mouseX, y: mouseY });
            } else { this.isDrawing = false; }
            if (minigameClick) {
                this.chalks.forEach((c, i) => {
                    const bx = 160 + i * 70, by = this.height - 60, bw = 60, bh = 40;
                    if (mouseX > bx && mouseX < bx + bw && mouseY > by && mouseY < by + bh) this.selectedChalk = i;
                });
                const fbx = this.width - 140, fby = this.height - 60, fbw = 100, fbh = 40;
                if (mouseX > fbx && mouseX < fbx + fbw && mouseY > fby && mouseY < fby + fbh) {
                    const passed = this.evaluate(); this.state = passed ? 'finished' : 'failed'; this.timer = 0;
                }
                minigameClick = false;
            }
            let dx = mouseX - this.player.x;
            if (Math.abs(dx) > 10) { this.player.x += dx * 0.1; this.player.char.direction = dx < 0 ? -1 : 1; this.player.char.walkCycle += 0.15; }
        }
    }

    draw() {
        const c = this.ctx; c.clearRect(0, 0, this.width, this.height);
        c.save(); c.globalAlpha = Math.max(0, this.alpha);

        // Blackboard with chalk dust texture
        c.fillStyle = "#2c5040"; c.beginPath(); c.roundRect(0, 0, this.width, this.height, 80); c.fill();
        for(let i=0; i<200; i++) {
            c.fillStyle = "rgba(255,255,255,0.02)";
            c.beginPath(); c.arc(Math.random()*this.width, Math.random()*this.height, Math.random()*2, 0, Math.PI*2); c.fill();
        }
        c.strokeStyle = "#9a8a68"; c.lineWidth = 15; c.stroke();

        // Grey Sample Paper
        const paperX = 40, paperY = 60, paperW = 200, paperH = 280;
        c.fillStyle = "#cfd8dc"; c.beginPath(); c.roundRect(paperX, paperY, paperW, paperH, 2); c.fill();
        // Magnets
        c.fillStyle = "#f44336"; c.beginPath(); c.arc(paperX+20, paperY+15, 8, 0, Math.PI*2); c.fill();
        c.fillStyle = "#2196f3"; c.beginPath(); c.arc(paperX+paperW-20, paperY+paperH-15, 8, 0, Math.PI*2); c.fill();

        c.save(); c.translate(paperX, paperY); c.fillStyle = "#37474f"; c.font = "800 14px 'Zen Maru Gothic'"; c.textAlign = "center";
        c.fillText("お手本 / SAMPLE", paperW/2, 35); this.drawSampleIllustration(c, this.targetSample, paperW, paperH); c.restore();

        // Canvas Area
        const drawX = 280, drawY = 60, drawW = 380, drawH = 280;
        c.strokeStyle = "rgba(255,255,255,0.08)"; c.lineWidth = 1; c.strokeRect(drawX, drawY, drawW, drawH);
        if (this.player.showGrid && this.state === 'playing') {
            c.strokeStyle = "rgba(255,255,255,0.03)";
            for(let i=1; i<4; i++) {
                c.beginPath(); c.moveTo(drawX+i*drawW/4, drawY); c.lineTo(drawX+i*drawW/4, drawY+drawH); c.stroke();
                c.beginPath(); c.moveTo(drawX, drawY+i*drawH/4); c.lineTo(drawX+drawW, drawY+i*drawH/4); c.stroke();
            }
        }

        // Draw Strokes with grainy texture
        c.save(); c.lineCap = "round"; c.lineJoin = "round";
        this.strokes.forEach(s => {
            if (s.points.length < 2) return;
            if (s.color === 'eraser') { c.globalCompositeOperation = 'destination-out'; c.lineWidth = 30; }
            else { c.globalCompositeOperation = 'source-over'; c.strokeStyle = s.color; c.lineWidth = 5; }
            c.beginPath(); c.moveTo(s.points[0].x, s.points[0].y);
            s.points.forEach(p => c.lineTo(p.x, p.y)); c.stroke();
        });
        c.restore();
        c.globalCompositeOperation = 'source-over';

        // Sakura Finish Button
        const fbx = this.width - 140, fby = this.height - 65, fbw = 100, fbh = 50;
        c.fillStyle = "#ff80ab"; c.beginPath(); c.roundRect(fbx, fby, fbw, fbh, 12); c.fill();
        c.strokeStyle = "#fff"; c.lineWidth = 3; c.stroke();
        c.fillStyle = "#fff"; c.font = "800 14px 'Zen Maru Gothic'"; c.textAlign = "center";
        c.fillText("完成！", fbx + fbw/2, fby + 20);
        c.font = "800 10px sans-serif"; c.fillText("FINISH", fbx + fbw/2, fby + 38);

        // Tools
        this.chalks.forEach((chalk, i) => {
            const bx = 160 + i * 70, by = this.height - 60, bw = 60, bh = 40;
            c.fillStyle = chalk.id === 'eraser' ? "#eceff1" : chalk.color;
            c.beginPath(); c.roundRect(bx, by, bw, bh, 8); c.fill();
            if (this.selectedChalk === i) { c.strokeStyle = "#ffdf00"; c.lineWidth = 4; c.strokeRect(bx-3, by-3, bw+6, bh+6); }
            c.fillStyle = "#455a64"; c.font = "800 9px 'Zen Maru Gothic'"; c.textAlign = "center";
            c.fillText(chalk.label.split(' / ')[0], bx + bw/2, by + bh/2 + 4);
        });

        c.fillStyle = "#fff"; c.font = "bold 20px 'Zen Maru Gothic'"; c.textAlign = "right"; c.fillText(`TIME: ${this.timeRemaining}`, this.width - 45, 45);

        if (this.state === 'intro') {
            c.fillStyle = "rgba(0,0,0,0.7)"; c.beginPath(); c.roundRect(0, 0, this.width, this.height, 80); c.fill();
            const totalIntroFrames = 480, countdownStartFrame = 300;
            if (this.timer < countdownStartFrame) {
                c.fillStyle = "#fff"; c.textAlign = "center"; c.textBaseline = "middle";
                c.font = "800 42px 'Zen Maru Gothic'"; c.fillText("AFTERSCHOOL MASTERPIECE", this.width/2, this.height/2-40);
                c.font = "600 18px 'Zen Maru Gothic'"; c.fillText("左側の見本を黒板に描き写そう", this.width/2, this.height/2+15);
                c.fillStyle = "#ffdf00"; c.font = "700 16px 'Zen Maru Gothic'"; c.fillText("※完成したら右下の「完成！」ボタンを押してね", this.width/2, this.height/2+55);
            } else {
                const ct = Math.ceil((totalIntroFrames - this.timer) / 60), pr = (this.timer % 60) / 60;
                c.fillStyle = "#fff"; c.textAlign = "center"; c.textBaseline = "middle";
                c.font = `900 ${80+(pr*40)}px 'Zen Maru Gothic'`; c.globalAlpha = Math.max(0, 1-pr); if (ct >= 1) c.fillText(ct.toString(), this.width/2, this.height/2);
            }
            if (!document.getElementById('minigame-quit-btn')) { const btn = document.createElement('button'); btn.id = 'minigame-quit-btn'; btn.innerText = "教室に戻る"; btn.onclick = () => this.showQuitConfirmation(); document.body.appendChild(btn); }
        } else if (this.state === 'finished' || this.state === 'failed') {
            c.fillStyle = "rgba(0,0,0,0.85)"; c.beginPath(); c.roundRect(0, 0, this.width, this.height, 80); c.fill();
            const isWin = this.state === 'finished';
            c.save(); c.translate(this.width/2, this.height/2 + 100); this.drawTeacher(c, isWin); c.restore();
            c.fillStyle = isWin ? "#ffdf00" : "#ff5050"; c.textAlign = "center"; c.textBaseline = "middle";
            c.font = "900 72px 'Zen Maru Gothic'"; c.fillText(isWin ? "PASSED!" : "REDO!", this.width/2, this.height/2 - 110);
            c.fillStyle = "#fff"; c.font = "bold 26px 'Zen Maru Gothic'";
            c.fillText(isWin ? "素晴らしい芸術センスです！" : "もう一度練習が必要ですね...", this.width/2, this.height/2 - 45);
        }
        c.restore();
    }

    drawSampleIllustration(c, sample, w, h) {
        sample.shapes.forEach(s => {
            c.fillStyle = s.color;
            if (s.type === 'mountain') { 
                c.beginPath(); c.moveTo(s.x-s.size*0.8, s.y+s.size); c.lineTo(s.x, s.y); c.lineTo(s.x+s.size*0.8, s.y+s.size); c.fill(); 
            } else if (s.type === 'snow') {
                c.beginPath(); c.moveTo(s.x-s.size, s.y+s.size); c.lineTo(s.x, s.y); c.lineTo(s.x+s.size, s.y+s.size); c.fill();
            } else if (s.type === 'sun') { 
                c.beginPath(); c.arc(s.x, s.y, s.size, 0, Math.PI*2); c.fill(); 
            } else if (s.type === 'sunray') {
                c.strokeStyle = s.color; c.lineWidth = 3;
                for(let i=0; i<8; i++) {
                    const a = i * Math.PI/4;
                    c.beginPath(); c.moveTo(s.x+Math.cos(a)*s.size*0.8, s.y+Math.sin(a)*s.size*0.8);
                    c.lineTo(s.x+Math.cos(a)*s.size*1.2, s.y+Math.sin(a)*s.size*1.2); c.stroke();
                }
            } else if (s.type === 'sea') { 
                c.fillRect(s.x-w*0.4, s.y, w*0.8, s.size*0.5); 
            } else if (s.type === 'waves') {
                c.strokeStyle = s.color; c.lineWidth = 2;
                for(let i=0; i<3; i++) {
                    c.beginPath(); c.moveTo(s.x-w*0.35, s.y+i*10); 
                    for(let j=0; j<5; j++) c.quadraticCurveTo(s.x-w*0.35+(j*30)+15, s.y+i*10-10, s.x-w*0.35+(j*30)+30, s.y+i*10);
                    c.stroke();
                }
            } else if (s.type === 'ship_body') { 
                c.beginPath(); c.moveTo(s.x-s.size*0.8, s.y); c.lineTo(s.x+s.size*0.8, s.y); c.lineTo(s.x+s.size*0.5, s.y+s.size*0.4); c.lineTo(s.x-s.size*0.5, s.y+s.size*0.4); c.fill();
                c.fillStyle = "#333"; c.fillRect(s.x-s.size*0.2, s.y-s.size*0.4, s.size*0.4, s.size*0.4); 
            } else if (s.type === 'chimney') {
                c.fillRect(s.x, s.y, s.size, s.size*2);
                c.fillStyle = "rgba(0,0,0,0.2)"; c.beginPath(); c.arc(s.x+s.size/2, s.y-5, 5, 0, Math.PI*2); c.fill();
            }
        });
    }

    drawTeacher(c, isHappy) {
        const colors = { body: "#444", limb: "#333", skin: "#ffe0bd", hair: "#554", cheek: "#ffb0b0" };
        let teacher = new Child(colors); teacher.faceType = isHappy ? 0 : 4; 
        teacher.draw(c);
    }
}
// ==========================================
// Minigame: Organ (Sync Melody)
// ==========================================
class OrganMinigame {
    constructor(playerChar, ctx) {
        this.ctx = ctx;
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        this.alpha = 0;
        this.state = 'intro';
        this.timer = 0;

        const getStat = (key) => selectedToys.reduce((sum, t) => sum + (t.labels && t.labels[key] ? t.labels[key] : 0), 0);
        const focusedPts = getStat('focused');
        const expressivePts = getStat('expressive');

        this.player = {
            char: playerChar,
            x: 120, y: this.height - 100,
            timingWindow: 25 + (focusedPts * 4), 
            flickTolerance: 0.6 + (expressivePts * 0.05)
        };

        this.scoreData = [
            {n:'C4', d:1}, {n:'C4', d:1}, {n:'G4', d:1}, {n:'G4', d:1}, {n:'A4', d:1}, {n:'A4', d:1}, {n:'G4', d:2},
            {n:'F4', d:1}, {n:'F4', d:1}, {n:'E4', d:1}, {n:'E4', d:1}, {n:'D4', d:1}, {n:'D4', d:1}, {n:'C4', d:2},
            {n:'G4', d:1}, {n:'G4', d:1}, {n:'F4', d:1}, {n:'F4', d:1}, {n:'E4', d:1}, {n:'E4', d:1}, {n:'D4', d:2},
            {n:'G4', d:1}, {n:'G4', d:1}, {n:'F4', d:1}, {n:'F4', d:1}, {n:'E4', d:1}, {n:'E4', d:1}, {n:'D4', d:2},
            {n:'C4', d:1}, {n:'C4', d:1}, {n:'G4', d:1}, {n:'G4', d:1}, {n:'A4', d:1}, {n:'A4', d:1}, {n:'G4', d:2},
            {n:'F4', d:1}, {n:'F4', d:1}, {n:'E4', d:1}, {n:'E4', d:1}, {n:'D4', d:1}, {n:'D4', d:1}, {n:'C4', d:2}
        ];
        this.noteIndex = 0;
        this.hitLineY = this.height - 240; 
        this.arrows = [];
        this.inputPath = [];
        this.isPaused = false;
        this.frameCount = 0;
        this.shake = 0;
        this.flash = 0;
        this.activeKey = null;
        this.hitEffect = 0;

        // Ensure total silence of background tracks
        minigameMuteGroove = true;
        this.muteBackground(true);

        this.organSynth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "triangle16" },
            envelope: { attack: 0.01, decay: 0.1, sustain: 0.4, release: 0.8 },
            volume: -4
        }).toDestination();

        this.errorSynth = new Tone.NoiseSynth({
            noise: { type: "brown" },
            envelope: { attack: 0.005, decay: 0.15, sustain: 0, release: 0.1 },
            volume: -18
        }).toDestination();

        this.lastSpawnTime = 0;
        this.bpm = 100;
        this.quarterNoteMs = 60000 / this.bpm;
    }

    muteBackground(mute) {
        if (baseGroove && baseGroove.kickSynth) baseGroove.kickSynth.volume.value = mute ? -100 : -8;
        if (carryHatSynth) carryHatSynth.volume.value = mute ? -100 : inheritedHatVolumeDb;
        if (carrySnareSynth) carrySnareSynth.volume.value = mute ? -100 : inheritedSnareVolumeDb;
        if (carrySnareBody) carrySnareBody.volume.value = mute ? -100 : inheritedSnareBodyVolumeDb;
        if (carryCymbalSynth) carryCymbalSynth.volume.value = mute ? -100 : inheritedCymbalVolumeDb;
        toneDrops.forEach(d => { if (d.bassSynth) d.bassSynth.volume.value = -100; });
    }

    closeMinigame(resultLabel) {
        activeMinigame = null;
        isMinigameActive = false;
        minigameMuteGroove = false;
        minigameTriggerDrop = null;

        this.muteBackground(false);

        if (this.organSynth) this.organSynth.dispose();
        if (this.errorSynth) this.errorSynth.dispose();
        if (!baby.minigameResults) baby.minigameResults = [];
        baby.minigameResults.push({ toy: "organ", result: resultLabel, timestamp: Date.now() });
        if (resultLabel === "勝利") {
            selectedToys.push({ id: "organ_victory", name: "Perfect Recital", labels: { creative: 3, expressive: 3, focused: 2 } });
        }

        document.body.classList.remove('minigame-active'); minigameWrapper.classList.remove('visible');
        const btn = document.getElementById('minigame-quit-btn'); if (btn) btn.remove();
        transitionMinigameToLesson();
    }

    showQuitConfirmation() {
        if (this.isPaused) return;
        this.isPaused = true;
        const isFinished = this.state === 'finished' || this.state === 'failed';
        const modal = document.createElement('div'); modal.id = 'minigame-modal';
        const enText = isFinished ? "Return to the classroom?" : "Stop the recital?";
        const jpText = isFinished ? "教室に戻りますか？" : "演奏を途中でやめますか？";
        modal.innerHTML = `<div class="modal-content"><p class="en">${enText}</p><p class="jp">${jpText}</p><div class="modal-buttons"><button id="modal-yes">YES</button><button id="modal-no">NO</button></div></div>`;
        document.body.appendChild(modal);
        document.getElementById('modal-yes').onclick = () => {
            modal.remove();
            let label = this.state === 'finished' ? "勝利" : "友達を置いて放棄";
            this.closeMinigame(label);
        };
        document.getElementById('modal-no').onclick = () => { modal.remove(); this.isPaused = false; };
    }

    spawnArrow() {
        if (this.noteIndex >= this.scoreData.length) return;
        const data = this.scoreData[this.noteIndex];
        const dirs = ['up', 'down', 'left', 'right'];
        const labels = ['↑', '↓', '←', '→'];
        const idx = Math.floor(Math.random() * 4);
        this.arrows.push({
            id: Date.now(), dir: dirs[idx], label: labels[idx],
            y: -60, note: data.n, duration: data.d,
            alive: true, missed: false
        });
        this.noteIndex++;
    }

    getFlickDirection(path) {
        if (path.length < 5) return null;
        const start = path[0], end = path[path.length - 1];
        const dx = end.x - start.x, dy = end.y - start.y;
        if (Math.hypot(dx, dy) < 30) return null;
        return Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
    }

    update(mouseX, mouseY) {
        if (this.isPaused) return;
        this.frameCount++;
        if (this.alpha < 1) this.alpha += 0.05;
        if (this.shake > 0) this.shake--;
        if (this.flash > 0) this.flash -= 0.05;
        if (this.hitEffect > 0) this.hitEffect -= 0.1;

        if (this.state === 'intro') {
            this.timer++; if (this.timer > 480) { this.state = 'playing'; this.timer = 0; this.lastSpawnTime = performance.now(); }
            return;
        }
        if (this.state === 'finished' || this.state === 'failed') {
            this.timer++; if (this.timer > 180) { this.alpha -= 0.05; if (this.alpha <= 0) this.closeMinigame(this.state === 'finished' ? "勝利" : "敗北"); }
            return;
        }

        if (this.state === 'playing') {
            const now = performance.now();
            if (this.noteIndex < this.scoreData.length) {
                const prevNote = this.noteIndex > 0 ? this.scoreData[this.noteIndex - 1] : {d: 1};
                const interval = prevNote.d * this.quarterNoteMs;
                if (now - this.lastSpawnTime >= interval) {
                    this.spawnArrow();
                    this.lastSpawnTime = now;
                }
            }

            const speed = 4.0;
            this.arrows.forEach(a => {
                if (a.alive) {
                    a.y += speed;
                    if (a.y > this.hitLineY + 50 && !a.missed) {
                        a.missed = true; this.shake = 10; this.flash = 0.3; this.errorSynth.triggerAttackRelease("16n");
                    }
                    if (a.y > this.height) { a.alive = false; if(this.noteIndex >= this.scoreData.length && this.arrows.every(ar => !ar.alive)) this.state = 'finished'; }
                }
            });

            if (orbDragging) { this.inputPath.push({ x: mouseX, y: mouseY }); }
            else if (this.inputPath.length > 0) {
                const flickDir = this.getFlickDirection(this.inputPath);
                if (flickDir) {
                    let closest = null, minDist = Infinity;
                    this.arrows.forEach(a => {
                        if (a.alive && !a.missed) {
                            const d = Math.abs(a.y - this.hitLineY);
                            if (d < minDist) { minDist = d; closest = a; }
                        }
                    });
                    if (closest && minDist < this.player.timingWindow) {
                        if (closest.dir === flickDir) {
                            closest.alive = false; this.organSynth.triggerAttackRelease(closest.note, "4n");
                            this.activeKey = closest.note; setTimeout(() => this.activeKey = null, 200);
                            this.hitEffect = 1.0;
                            if (this.noteIndex >= this.scoreData.length && this.arrows.every(arr => !arr.alive)) this.state = 'finished';
                        } else { this.shake = 15; this.flash = 0.4; this.errorSynth.triggerAttackRelease("8n"); }
                    }
                }
                this.inputPath = [];
            }
            let pdx = mouseX - this.player.x;
            if (Math.abs(pdx) > 10) { this.player.x += pdx * 0.1; this.player.char.direction = pdx < 0 ? -1 : 1; this.player.char.walkCycle += 0.15; }
        }
    }

    draw() {
        const c = this.ctx; c.clearRect(0, 0, this.width, this.height);
        c.save(); if (this.shake > 0) c.translate((Math.random()-0.5)*15, (Math.random()-0.5)*15);
        c.globalAlpha = Math.max(0, this.alpha);

        // Mahogany Organ with Polish
        const woodG = c.createLinearGradient(0, 0, 0, this.height);
        woodG.addColorStop(0, "#4e342e"); woodG.addColorStop(1, "#2d1d1a");
        c.fillStyle = woodG; c.beginPath(); c.roundRect(0, 0, this.width, this.height, 80); c.fill();
        c.fillStyle = "#3e2723"; c.fillRect(0, this.height - 140, this.width, 140);

        // Lane
        c.fillStyle = "rgba(0,0,0,0.25)"; c.fillRect(this.width/2 - 65, 0, 130, this.height - 140);

        // --- MAGIC CIRCLE JUDGE RING ---
        const hx = this.width/2, hy = this.hitLineY;
        c.save();
        c.strokeStyle = "rgba(255, 223, 0, 0.6)"; c.lineWidth = 2;
        c.beginPath(); c.arc(hx, hy, 55, 0, Math.PI*2); c.stroke();
        c.setLineDash([4, 4]); c.beginPath(); c.arc(hx, hy, 48, this.frameCount*0.02, this.frameCount*0.02 + Math.PI*2); c.stroke();
        c.restore();

        // Ivory Keys
        const whiteNotes = ['C4','D4','E4','F4','G4','A4','B4','C5'];
        const whiteKeys = 8; const keyW = this.width / whiteKeys;
        for(let i=0; i<whiteKeys; i++) {
            const isHit = this.activeKey === whiteNotes[i];
            c.fillStyle = isHit ? "#ffeb3b" : "#fffef0";
            c.strokeStyle = "#a1887f"; c.lineWidth = 1;
            c.beginPath(); c.roundRect(i*keyW, this.height-125, keyW-3, 125, [0,0,6,6]); c.fill(); c.stroke();
            if (isHit) { // Key glow
                const kg = c.createRadialGradient(i*keyW + keyW/2, this.height-60, 0, i*keyW+keyW/2, this.height-60, 40);
                kg.addColorStop(0, "rgba(255,235,59,0.4)"); kg.addColorStop(1, "rgba(255,255,255,0)");
                c.fillStyle = kg; c.fillRect(i*keyW, this.height-125, keyW-3, 125);
            }
        }
        const hasBlack = [true, true, false, true, true, true, false];
        for(let i=0; i<whiteKeys-1; i++) {
            if (hasBlack[i]) {
                c.fillStyle = "#263238";
                c.beginPath(); c.roundRect(i*keyW + keyW*0.68, this.height-125, keyW*0.6, 75, [0,0,4,4]); c.fill();
            }
        }

        // Crystal Notes
        this.arrows.forEach(a => {
            if (!a.alive) return;
            c.save(); c.translate(this.width/2, a.y);
            const isNear = Math.abs(a.y - hy) < this.player.timingWindow;
            c.fillStyle = a.missed ? "#546e7a" : (isNear ? "#fff" : "#ffeb3b");
            c.shadowColor = isNear ? "#fff" : "#ffeb3b"; c.shadowBlur = isNear ? 30 : 10;
            c.beginPath(); c.arc(0, 0, 42, 0, Math.PI*2); c.fill();
            c.fillStyle = "#3e2723"; c.font = "800 46px sans-serif"; c.textAlign = "center"; c.textBaseline = "middle";
            c.fillText(a.label, 0, 0); c.restore();
        });

        // Flick Path (Sparkle)
        if (this.inputPath.length > 1) {
            c.save(); c.shadowColor = "#ffeb3b"; c.shadowBlur = 15;
            c.strokeStyle = "#fff176"; c.lineWidth = 12; c.lineCap = "round";
            c.beginPath(); c.moveTo(this.inputPath[0].x, this.inputPath[0].y);
            this.inputPath.forEach(p => c.lineTo(p.x, p.y)); c.stroke(); c.restore();
        }
        if (this.flash > 0) { c.fillStyle = `rgba(255, 0, 0, ${this.flash * 0.6})`; c.beginPath(); c.roundRect(0, 0, this.width, this.height, 80); c.fill(); }
        
        c.save(); c.translate(this.player.x, this.player.y); c.scale(0.65, 0.65); this.player.char.draw(c); c.restore();

        if (this.state === 'intro') {
            c.fillStyle = "rgba(0,0,0,0.75)"; c.beginPath(); c.roundRect(0, 0, this.width, this.height, 80); c.fill();
            const totalIntroFrames = 480, countdownStartFrame = 300;
            if (this.timer < countdownStartFrame) {
                c.fillStyle = "#fff"; c.textAlign = "center"; c.textBaseline = "middle";
                c.font = "800 42px 'Zen Maru Gothic'"; c.fillText("SYNC MELODY", this.width/2, this.height/2-45);
                c.font = "600 18px 'Zen Maru Gothic'"; c.fillText("魔法の円に重なる瞬間に、矢印の方向へフリック！", this.width/2, this.height/2+15);
                c.fillStyle = "#ffdf00"; c.font = "700 16px 'Zen Maru Gothic'"; c.fillText("※すべての雑音を消し、あなたの旋律を完成させよう", this.width/2, this.height/2+55);
            } else {
                const ct = Math.ceil((totalIntroFrames - this.timer) / 60), pr = (this.timer % 60) / 60;
                c.fillStyle = "#fff"; c.textAlign = "center"; c.textBaseline = "middle";
                c.font = `900 ${80+(pr*40)}px 'Zen Maru Gothic'`; c.globalAlpha = Math.max(0, 1-pr); if (ct >= 1) c.fillText(ct.toString(), this.width/2, this.height/2);
            }
            if (!document.getElementById('minigame-quit-btn')) { const btn = document.createElement('button'); btn.id = 'minigame-quit-btn'; btn.innerText = "教室に戻る"; btn.onclick = () => this.showQuitConfirmation(); document.body.appendChild(btn); }
        } else if (this.state === 'finished' || this.state === 'failed') {
            c.fillStyle = "rgba(0,0,0,0.85)"; c.beginPath(); c.roundRect(0, 0, this.width, this.height, 80); c.fill();
            const isWin = this.state === 'finished';
            c.fillStyle = isWin ? "#ffdf00" : "#ff5050"; c.textAlign = "center"; c.textBaseline = "middle";
            c.font = "900 76px 'Zen Maru Gothic'"; c.fillText(isWin ? "MARVELOUS!" : "OUT OF SYNC...", this.width/2, this.height/2 - 30);
            c.fillStyle = "#fff"; c.font = "bold 28px 'Zen Maru Gothic'";
            c.fillText(isWin ? "心に響く音色でした！" : "リズムが少し乱れてしまったようです", this.width/2, this.height/2 + 55);
        }
        c.restore();
    }
}