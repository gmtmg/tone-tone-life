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
        let inheritedSnarePattern = null;
        let inheritedSnareVelocity = null;
        let inheritedSnareStyleClass = 'snare';
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
        let inheritedChordProgression = null;
        let childLifeChoice = null;
        let childTransitionLock = false;
        let childHouseVariant = 0;
        let childFacilities = []; // 4 selected facilities for this playthrough
        let childFacilityLayouts = []; // [{cx, bW, bH}] per-facility layout info

        // CHILD2 (中学校の休み時間) variables
        let inheritedBassPattern = null;
        let inheritedBassNotes = null;
        let inheritedBassStyleClass = 'bass';
        let child2TransitionLock = false;
        let child2ActivityChoice = null;
        let carryChordSynth = null;
        let carryChordPattern = null;
        let schoolBgNpcs = null;
        let schoolBgObjects = null;
        let hoveredSchoolActivity = null; // activityId of hovered bass drop

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
        const SCENE = { TITLE: 0, CHOICE: 1, TRANSITION: 2, CRAWL: 3, CRAWL2: 4, TODDLE1: 5, CHILD1: 6, CHILD2: 7 };
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
        orbEl.addEventListener('mousedown', (e) => {
            e.preventDefault();
            orbDragging = true;
            orbEl.classList.add('dragging');
        });
        document.addEventListener('mouseup', () => {
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

        canvas.addEventListener('click', (e) => {
            void pickToneDropAt(e.clientX, e.clientY);
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


        // ==========================================
        // Visuals: Classes
        // ==========================================

        // 1. Title/Choice Background Blobs
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
                    c.scale(-1, 1); // 顔を進行方向に向ける（体は逆向きのまま）
                    const HR = 21;
                    c.fillStyle = this.hairColor;

                    // ============================================================
                    // 1) Hair BACK layer (behind face — face circle will clip it)
                    // ============================================================
                    if (this.isBoy) {
                        if (this.hairStyle === 0) {
                            // Boy 0: ナチュラルショート
                            c.beginPath(); c.arc(0, -1, HR + 3, Math.PI, 0, false); c.closePath(); c.fill();
                        } else if (this.hairStyle === 1) {
                            // Boy 1: マッシュヘア
                            c.beginPath(); c.arc(0, -1, HR + 5, Math.PI * 0.95, Math.PI * 0.05, false); c.closePath(); c.fill();
                        } else {
                            // Boy 2: スポーツ刈り
                            c.beginPath(); c.arc(0, -1, HR + 2, Math.PI, 0, false); c.closePath(); c.fill();
                        }
                    } else {
                        if (this.hairStyle === 0) {
                            // Girl 0: おかっぱ — サイドヘアも背面に
                            c.beginPath(); c.arc(0, -1, HR + 4, Math.PI, 0, false); c.closePath(); c.fill();
                            c.beginPath(); c.roundRect(-HR - 5, -6, 9, 22, 4); c.fill();
                            c.beginPath(); c.roundRect(HR - 4, -6, 9, 22, 4); c.fill();
                        } else if (this.hairStyle === 1) {
                            // Girl 1: ツインテール — 左右の束
                            c.beginPath(); c.arc(0, -1, HR + 3, Math.PI, 0, false); c.closePath(); c.fill();
                            c.beginPath(); c.ellipse(-20, -8, 8, 14, -0.2, 0, Math.PI * 2); c.fill();
                            c.beginPath(); c.ellipse(20, -8, 8, 14, 0.2, 0, Math.PI * 2); c.fill();
                        } else {
                            // Girl 2: ポニーテール — 後ろ束ね
                            c.beginPath(); c.arc(0, -1, HR + 4, Math.PI, 0, false); c.closePath(); c.fill();
                            c.beginPath(); c.ellipse(-18, -4, 7, 16, 0.25, 0, Math.PI * 2); c.fill();
                        }
                    }

                    // ============================================================
                    // 2) Face circle (clips hair below hairline)
                    // ============================================================
                    c.fillStyle = this.skinColor;
                    c.beginPath(); c.arc(0, 0, HR, 0, Math.PI * 2); c.fill();

                    // ============================================================
                    // 3) Ears
                    // ============================================================
                    c.fillStyle = this.skinColor;
                    c.beginPath(); c.arc(-18, 3, 5.5, 0, Math.PI * 2); c.fill();
                    c.beginPath(); c.arc(18, 3, 5.5, 0, Math.PI * 2); c.fill();
                    c.fillStyle = this.cheekColor;
                    c.beginPath(); c.arc(-18, 3, 3, 0, Math.PI * 2); c.fill();
                    c.beginPath(); c.arc(18, 3, 3, 0, Math.PI * 2); c.fill();

                    // ============================================================
                    // 4) Hair FRONT layer — 前髪（頭頂の髪キャップと繋がるように描く）
                    //    顔円の上端 y=-21。キャップ端と前髪を隙間なく接続。
                    // ============================================================
                    c.fillStyle = this.hairColor;

                    if (this.isBoy) {
                        if (this.hairStyle === 0) {
                            // Boy 0: ナチュラルショート — 軽く下ろした前髪
                            // 上端を頭頂キャップの見える下端(≈-21)から開始
                            c.beginPath();
                            c.moveTo(-17, -21);
                            c.lineTo(-17, -13);
                            c.quadraticCurveTo(-8, -16, 0, -13);
                            c.quadraticCurveTo(8, -16, 17, -13);
                            c.lineTo(17, -21);
                            c.closePath(); c.fill();
                            c.fillStyle = "rgba(255,255,255,0.1)";
                            c.beginPath(); c.ellipse(-4, -20, 5, 3, -0.15, 0, Math.PI * 2); c.fill();
                        } else if (this.hairStyle === 1) {
                            // Boy 1: マッシュ — おでこを覆う重め前髪
                            c.beginPath();
                            c.moveTo(-19, -21);
                            c.lineTo(-19, -10);
                            c.quadraticCurveTo(-10, -13, 0, -10);
                            c.quadraticCurveTo(10, -13, 19, -10);
                            c.lineTo(19, -21);
                            c.closePath(); c.fill();
                            c.strokeStyle = "rgba(0,0,0,0.05)"; c.lineWidth = 0.6;
                            [-13, -5, 4, 12].forEach(sx => {
                                c.beginPath(); c.moveTo(sx, -21); c.lineTo(sx, -10); c.stroke();
                            });
                            c.fillStyle = "rgba(255,255,255,0.08)";
                            c.beginPath(); c.ellipse(2, -20, 6, 3, 0.1, 0, Math.PI * 2); c.fill();
                        } else {
                            // Boy 2: スポーツ刈り — 極短の前髪（うっすら）
                            c.globalAlpha = 0.45;
                            c.beginPath();
                            c.moveTo(-16, -21); c.lineTo(-16, -17);
                            c.lineTo(16, -17); c.lineTo(16, -21);
                            c.closePath(); c.fill();
                            c.globalAlpha = 1;
                            c.fillStyle = "rgba(255,255,255,0.06)";
                            c.beginPath(); c.ellipse(0, -20, 5, 3, 0, 0, Math.PI * 2); c.fill();
                        }
                    } else {
                        if (this.hairStyle === 0) {
                            // Girl 0: おかっぱ — ぱっつん前髪
                            c.beginPath();
                            c.moveTo(-18, -21); c.lineTo(-18, -11);
                            c.lineTo(18, -11); c.lineTo(18, -21);
                            c.closePath(); c.fill();
                            c.fillStyle = "rgba(0,0,0,0.04)";
                            c.beginPath(); c.rect(-17, -11, 34, 1); c.fill();
                            c.fillStyle = "rgba(255,255,255,0.08)";
                            c.beginPath(); c.ellipse(3, -20, 5, 3, 0.1, 0, Math.PI * 2); c.fill();
                        } else if (this.hairStyle === 1) {
                            // Girl 1: ツインテール — ぱっつん前髪 + リボン
                            c.beginPath();
                            c.moveTo(-17, -21); c.lineTo(-17, -11);
                            c.lineTo(17, -11); c.lineTo(17, -21);
                            c.closePath(); c.fill();
                            c.fillStyle = "hsl(345, 65%, 65%)";
                            [[-20, -14], [20, -14]].forEach(([rx, ry]) => {
                                c.beginPath(); c.ellipse(rx - 4, ry, 4, 2.5, -0.3, 0, Math.PI * 2); c.fill();
                                c.beginPath(); c.ellipse(rx + 4, ry, 4, 2.5, 0.3, 0, Math.PI * 2); c.fill();
                                c.beginPath(); c.arc(rx, ry, 1.5, 0, Math.PI * 2); c.fill();
                            });
                            c.fillStyle = "rgba(255,255,255,0.08)";
                            c.beginPath(); c.ellipse(-2, -20, 5, 3, -0.1, 0, Math.PI * 2); c.fill();
                        } else {
                            // Girl 2: ポニーテール — 斜め流し前髪
                            c.beginPath();
                            c.moveTo(-15, -21);
                            c.lineTo(-15, -12);
                            c.quadraticCurveTo(0, -10, 17, -13);
                            c.lineTo(17, -21);
                            c.closePath(); c.fill();
                            c.fillStyle = "hsl(210, 55%, 60%)";
                            c.beginPath(); c.arc(-17, -6, 3, 0, Math.PI * 2); c.fill();
                            c.fillStyle = "rgba(255,255,255,0.08)";
                            c.beginPath(); c.ellipse(4, -20, 5, 3, 0.15, 0, Math.PI * 2); c.fill();
                        }
                    }

                    // ============================================================
                    // 5) Face features — 児童用にやや小さめにスケール
                    // ============================================================
                    c.save();
                    c.translate(0, 1); // 少し下にずらして前髪との距離を確保
                    c.scale(0.82, 0.82);
                    drawBabyFace(c, this.faceType, this.skinColor, this.cheekColor, null, false);
                    c.restore();
                });

                ctx.restore();
            }
        }


        // ==========================================
        // Data & Logic
        // ==========================================
        
        // Background Objects
        const blobs = palette.colors.map(c => new OrganicBlob(c));
        
        // Game Objects
        function pickFloorColor() {
            const usedByBaby = new Set(Object.values(babyColorScheme));
            const candidates = [palette.colors[2], palette.colors[3], palette.btnColor, palette.bg];
            return candidates.find(color => !usedByBaby.has(color)) || "hsl(40, 45%, 72%)";
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
                    volume: -8
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
            if ((currentScene !== SCENE.CRAWL && currentScene !== SCENE.CRAWL2 && currentScene !== SCENE.TODDLE1 && currentScene !== SCENE.CHILD1 && currentScene !== SCENE.CHILD2) || !toneDrops.length) {
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
            carryHatFilter = new Tone.Filter({
                type: "highpass",
                frequency: 7600,
                Q: 0.55
            }).toDestination();
            carryHatSynth = new Tone.NoiseSynth({
                noise: { type: "white" },
                envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.016 },
                volume: -25
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
            carrySnareFilter = new Tone.Filter({
                type: "bandpass",
                frequency: 1800,
                Q: 0.7
            }).toDestination();
            carrySnareSynth = new Tone.NoiseSynth({
                noise: { type: "white" },
                envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.08 },
                volume: -28
            }).connect(carrySnareFilter);
            carrySnareBody = new Tone.MembraneSynth({
                pitchDecay: 0.025,
                octaves: 2.5,
                oscillator: { type: "triangle" },
                envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.06 },
                volume: -26
            }).toDestination();
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
            carryCymbalSynth = new Tone.MetalSynth({
                frequency: 280,
                harmonicity: 5.1,
                modulationIndex: 30,
                resonance: 4000,
                envelope: { attack: 0.001, decay: 0.8, release: 0.05 },
                volume: -30
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
                if (!baseGroove) return;
                const now = performance.now();
                while (baseGroove.nextTick <= now + 4) {
                    const step = baseGroove.step;
                    if (baseRhythmInfo.kickPattern[step]) {
                        baseGroove.kickSynth.triggerAttackRelease("C1", "8n");
                    }
                    if (
                        (currentScene === SCENE.CRAWL2 || currentScene === SCENE.TODDLE1 || currentScene === SCENE.CHILD1 || currentScene === SCENE.CHILD2) &&
                        carryHatSynth &&
                        carryHatFilter &&
                        inheritedHatPattern &&
                        inheritedHatPattern[step]
                    ) {
                        carryHatFilter.frequency.value = 7000 + Math.random() * 1800;
                        carryHatSynth.triggerAttackRelease("32n");
                    }
                    if (
                        (currentScene === SCENE.TODDLE1 || currentScene === SCENE.CHILD1 || currentScene === SCENE.CHILD2) &&
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
                        (currentScene === SCENE.CHILD1 || currentScene === SCENE.CHILD2) &&
                        carryCymbalSynth &&
                        inheritedCymbalPattern &&
                        inheritedCymbalPattern[step]
                    ) {
                        carryCymbalSynth.triggerAttackRelease("16n");
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
                            drop.chordSynth.volume.value = baseVol - 2;
                            drop.chordSynth.triggerAttackRelease(drop.chordProgression.notes[barIndex], "2n");
                            if (drop.isHovered) drop.ripples.push({ t: 0, accent });
                            return;
                        }
                        if (drop.instrument === "bass") {
                            // Only trigger on attack steps (sustained notes don't re-trigger)
                            if (drop.bassAttacks && drop.bassAttacks[step]) {
                                const note = drop.bassNotes ? drop.bassNotes[step] : null;
                                const dur = drop.bassDurations ? drop.bassDurations[step] : "8n";
                                if (note && drop.bassSynth) {
                                    drop.bassSynth.volume.value = baseVol + 8;
                                    try {
                                        drop.bassSynth.triggerAttackRelease(note, dur);
                                    } catch (e) { /* ignore */ }
                                }
                            }
                            if (drop.isHovered && drop.bassAttacks && drop.bassAttacks[step]) {
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
                            drop.snareSynth.volume.value = baseVol - 1 + (drop.snareGainBoostDb || 0) + beatBoostDb;
                            const jitter = (Math.random() * 0.008).toFixed(3);
                            drop.snareSynth.triggerAttackRelease("16n", `+${jitter}`);
                            if (drop.snareBody && (accent >= 0.85 || beatBoostDb > 0)) {
                                drop.snareBody.volume.value = baseVol - 10 + (drop.snareBodyBoostDb || 0) + beatBoostDb;
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
            if (currentScene === SCENE.CRAWL || currentScene === SCENE.CRAWL2 || currentScene === SCENE.TODDLE1 || currentScene === SCENE.CHILD1 || currentScene === SCENE.CHILD2) {
                updateToneDropProximity();
                updateScoreHudPreviewRow();
                if (baby) {
                    baby.update(orbWorldX);
                    updateCamera();
                }
                ctx.save();
                ctx.translate(-cameraX, 0);
                if (currentScene === SCENE.CHILD2) {
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

            // 2b. Orb particles (after tone drops, inside camera transform already restored)
            updateAndDrawOrbParticles();

            // 2c. Orb screen position
            updateOrbScreenPosition();

            // 2d. Hover info (temporarily hidden)
            if (hoverInfoEl) hoverInfoEl.classList.remove('visible');

            // 3. Update Audio (Proximity)
            if (currentScene === SCENE.CHOICE) {
                updateProximityAudio();
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
            const available = (currentScene === SCENE.CRAWL || currentScene === SCENE.CRAWL2 || currentScene === SCENE.TODDLE1 || currentScene === SCENE.CHILD1 || currentScene === SCENE.CHILD2) && !!baseRhythmInfo;
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

            // Bass preview row (CHILD2 hover)
            if (isChild2 && previewDropIndex !== null && toneDrops[previewDropIndex] && toneDrops[previewDropIndex].instrument === "bass") {
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
            if ((isChild || isChild2) && inheritedCymbalPattern) {
                rows.push({
                    label: 'Cymbal',
                    pattern: inheritedCymbalPattern,
                    styleClass: inheritedCymbalStyleClass || 'cymbal'
                });
            }
            if ((currentScene === SCENE.TODDLE1 || isChild || isChild2) && inheritedSnarePattern) {
                rows.push({
                    label: 'Snare',
                    pattern: inheritedSnarePattern,
                    styleClass: inheritedSnareStyleClass || 'snare'
                });
            }
            if (currentScene === SCENE.CRAWL2 || currentScene === SCENE.TODDLE1 || isChild || isChild2) {
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

            // Chord name bar labels (CHILD2+: show chord names above each bar, no sound)
            if (isChild2 && inheritedChordProgression) {
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

            // Drum rows (wrapped in drum-block for CHILD1/CHILD2)
            const drumBlock = (isChild || isChild2) ? document.createElement('div') : null;
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
            // Play confirmation chord
            const confirmSynth = new Tone.PolySynth(Tone.Synth, {
                volume: -4,
                envelope: { attack: 0.05, decay: 1.2, sustain: 0.1, release: 2 }
            }).toDestination();
            const allNotes = clickedDrop.chordProgression.notes.flat();
            const uniqueNotes = [...new Set(allNotes)];
            confirmSynth.triggerAttackRelease(uniqueNotes.slice(0, 6), "1n");
            setTimeout(() => confirmSynth.dispose(), 4000);
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
            inheritedBassStyleClass = 'bass';
            // Add activity labels to selectedToys
            if (clickedDrop.activityLabels) {
                selectedToys.push({
                    id: clickedDrop.activityId,
                    name: clickedDrop.activityName,
                    labels: clickedDrop.activityLabels
                });
            }
            // Confirmation sound
            const confirmSynth = new Tone.MonoSynth({
                oscillator: { type: "sine" },
                envelope: { attack: 0.02, decay: 0.8, sustain: 0.1, release: 1 },
                volume: -6
            }).toDestination();
            confirmSynth.triggerAttackRelease("C2", "2n");
            setTimeout(() => confirmSynth.dispose(), 3000);
            // Ripple effect
            const sx = clickedDrop.x - cameraX;
            const sy = clickedDrop.y;
            const ripple = document.createElement('div');
            ripple.className = 'ripple ripple-anim';
            ripple.style.position = 'fixed';
            ripple.style.left = (sx - 40) + 'px';
            ripple.style.top = (sy - 40) + 'px';
            document.body.appendChild(ripple);
            setTimeout(() => ripple.remove(), 2200);
        }

        // Choice/tone selection is now handled by "filled tone only" click gating.
