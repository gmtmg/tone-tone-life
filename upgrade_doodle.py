import sys

file_path = 'js/main.js'
with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
for i, line in enumerate(lines):
    if 'class DoodleMinigame' in line:
        start_idx = i
        break

if start_idx != -1:
    new_lines = lines[:start_idx]
    
    chat_class = """class DoodleMinigame {
    constructor(playerChar, ctx) {
        this.ctx = ctx;
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        this.alpha = 0;
        this.state = 'intro';
        this.timer = 0;

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
        window.currentScene = SCENE.LESSON;
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
        c.fillStyle = "#2c5040"; c.beginPath(); c.roundRect(0, 0, this.width, this.height, 80); c.fill();
        c.strokeStyle = "#9a8a68"; c.lineWidth = 15; c.stroke();
        const paperX = 40, paperY = 60, paperW = 200, paperH = 280;
        c.fillStyle = "#fff"; c.shadowColor = "rgba(0,0,0,0.2)"; c.shadowBlur = 10;
        c.beginPath(); c.roundRect(paperX, paperY, paperW, paperH, 2); c.fill();
        c.shadowBlur = 0;
        c.save(); c.translate(paperX, paperY); c.fillStyle = "#333"; c.font = "bold 14px 'Zen Maru Gothic'"; c.textAlign = "center";
        c.fillText("お手本 / SAMPLE", paperW/2, 25); this.drawSampleIllustration(c, this.targetSample, paperW, paperH); c.restore();
        const drawX = 280, drawY = 60, drawW = 380, drawH = 280;
        c.strokeStyle = "rgba(255,255,255,0.1)"; c.lineWidth = 1; c.strokeRect(drawX, drawY, drawW, drawH);
        if (this.player.showGrid && this.state === 'playing') {
            c.strokeStyle = "rgba(255,255,255,0.05)";
            for(let i=1; i<4; i++) {
                c.beginPath(); c.moveTo(drawX + i*(drawW/4), drawY); c.lineTo(drawX + i*(drawW/4), drawY + drawH); c.stroke();
                c.beginPath(); c.moveTo(drawX, drawY + i*(drawH/4)); c.lineTo(drawX + drawW, drawY + i*(drawH/4)); c.stroke();
            }
        }
        c.save(); c.lineCap = "round"; c.lineJoin = "round";
        this.strokes.forEach(s => {
            if (s.points.length < 2) return;
            if (s.color === 'eraser') { c.globalCompositeOperation = 'destination-out'; c.lineWidth = 25; }
            else { c.globalCompositeOperation = 'source-over'; c.strokeStyle = s.color; c.lineWidth = 5; }
            c.beginPath(); c.moveTo(s.points[0].x, s.points[0].y); s.points.forEach(p => c.lineTo(p.x, p.y)); c.stroke();
        });
        c.restore();
        c.globalCompositeOperation = 'source-over';
        this.chalks.forEach((chalk, i) => {
            const bx = 160 + i * 70, by = this.height - 60, bw = 60, bh = 40;
            c.fillStyle = chalk.id === 'eraser' ? "#eee" : chalk.color;
            c.beginPath(); c.roundRect(bx, by, bw, bh, 8); c.fill();
            if (this.selectedChalk === i) { c.strokeStyle = "#ffdf00"; c.lineWidth = 4; c.strokeRect(bx-3, by-3, bw+6, bh+6); }
            c.fillStyle = "#333"; c.font = "bold 9px sans-serif"; c.textAlign = "center";
            c.fillText(chalk.label.split(' / ')[0], bx + bw/2, by + bh/2 + 4);
        });
        const fbx = this.width - 140, fby = this.height - 60, fbw = 100, fbh = 40;
        c.fillStyle = "#ffdf00"; c.beginPath(); c.roundRect(fbx, fby, fbw, fbh, 8); c.fill();
        c.fillStyle = "#333"; c.font = "bold 12px 'Zen Maru Gothic'"; c.textAlign = "center";
        c.fillText("完成！", fbx + fbw/2, fby + 15);
        c.font = "bold 10px sans-serif"; c.fillText("FINISH", fbx + fbw/2, fby + 30);
        c.fillStyle = "#fff"; c.font = "bold 20px 'Zen Maru Gothic'"; c.textAlign = "right"; c.fillText(`TIME: ${this.timeRemaining}`, this.width - 40, 40);
        if (this.state === 'intro') {
            c.fillStyle = "rgba(0,0,0,0.65)"; c.beginPath(); c.roundRect(0, 0, this.width, this.height, 80); c.fill();
            const totalIntroFrames = 480, countdownStartFrame = 300;
            if (this.timer < countdownStartFrame) {
                c.fillStyle = "#fff"; c.textAlign = "center"; c.textBaseline = "middle";
                c.font = "800 42px 'Zen Maru Gothic'"; c.fillText("AFTERSCHOOL MASTERPIECE", this.width/2, this.height/2-40);
                c.font = "600 18px 'Zen Maru Gothic'"; c.fillText("左側の見本を黒板に描き写そう", this.width/2, this.height/2+10);
                c.fillStyle = "#ffdf00"; c.font = "700 16px 'Zen Maru Gothic'"; c.fillText("※色を使い分けて描いてね！完成したら右下のボタンをクリック！", this.width/2, this.height/2+45);
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
            c.font = "900 64px 'Zen Maru Gothic'"; c.fillText(isWin ? "PASSED!" : "REDO!", this.width/2, this.height/2 - 100);
            c.fillStyle = "#fff"; c.font = "bold 24px 'Zen Maru Gothic'";
            c.fillText(isWin ? "素晴らしい芸術センスです！" : "もう一度練習が必要ですね...", this.width/2, this.height/2 - 40);
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
        let teacher = new Child(colors); teacher.faceType = isHappy ? 0 : 4; teacher.draw(c);
        if (!isHappy) { c.fillStyle = "#ff5050"; c.font = "40px sans-serif"; c.fillText("💢", 40, -100); }
        else { c.fillStyle = "#ffdf00"; c.font = "600 80px sans-serif"; c.fillText("💮", 60, -120); }
    }
}
"""

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
    f.write(chat_class)
    print("Successfully corrected and upgraded DoodleMinigame")
else:
    print("Could not find DoodleMinigame class")
