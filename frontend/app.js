const API_URL = window.CONFIG.API_URL;

if (!window.CONFIG?.API_URL) {
    throw new Error("API URL not configured");
}

const form = document.getElementById("questForm");
const submitBtn = document.getElementById("submitBtn");

const successModal = document.getElementById("successModal");
const errorModal = document.getElementById("errorModal");

const closeBtn = document.getElementById("closeBtn");
const closeErrorBtn = document.getElementById("closeErrorBtn");

// Success Modal Fields
const questIdField = document.getElementById("questId");
const guildRankField = document.getElementById("guildRank");
const rewardField = document.getElementById("reward");
const statusField = document.getElementById("status");
const acceptedAtField = document.getElementById("acceptedAt");

// RPG Game Data Mappings
const CLASS_DATA = {
    "Warrior": {
        icon: "fa-solid fa-shield-halved",
        strength: 85,
        magic: 12,
        agility: 40,
        specialty: "Specialty: Melee Combat & Frontline Defense"
    },
    "Mage": {
        icon: "fa-solid fa-wand-magic-sparkles",
        strength: 15,
        magic: 95,
        agility: 30,
        specialty: "Specialty: Arcane Spellcasting & Elemental Control"
    },
    "Archer": {
        icon: "fa-solid fa-crosshairs",
        strength: 45,
        magic: 35,
        agility: 90,
        specialty: "Specialty: Ranged Precision & Stealth Scouting"
    },
    "Paladin": {
        icon: "fa-solid fa-shield-halved",
        strength: 75,
        magic: 50,
        agility: 35,
        specialty: "Specialty: Divine Protection & Righteous Vigor"
    },
    "Rogue": {
        icon: "fa-solid fa-user-ninja",
        strength: 50,
        magic: 20,
        agility: 95,
        specialty: "Specialty: Stealth Assassination & Poison Mastery"
    }
};

const DANGER_DATA = {
    "Low": { rank: "Novice", reward: "50 Gold", class: "danger-low" },
    "Medium": { rank: "Adventurer", reward: "150 Gold", class: "danger-medium" },
    "High": { rank: "Elite", reward: "300 Gold", class: "danger-high" },
    "Extreme": { rank: "Legendary", reward: "500 Gold", class: "danger-extreme" }
};

// Web Audio API RPG Synthesizer class
let audioCtx = null;
const getAudioContext = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    return audioCtx;
};

const playNote = (ctx, freq, delay, duration, vol, type = "sine") => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    
    gain.gain.setValueAtTime(0, ctx.currentTime + delay);
    gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + duration);
};

const hoverSound = () => {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.07);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.07);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.07);
    } catch (e) {}
};

const clickSound = () => {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(260, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
};

const submitSound = () => {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const bufferSize = ctx.sampleRate * 0.2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(1200, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.2);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start();
    } catch (e) {}
};

const successSound = () => {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        // Golden Coin Sound
        playNote(987.77, 0, 0.25, 0.06, "sine");
        playNote(1318.51, 0.06, 0.35, 0.06, "sine");
        
        // Triumphant Fanfare
        playNote(523.25, 0.2, 0.18, 0.04, "triangle");
        playNote(659.25, 0.3, 0.18, 0.04, "triangle");
        playNote(783.99, 0.4, 0.18, 0.04, "triangle");
        playNote(1046.50, 0.5, 0.45, 0.05, "sine");
    } catch (e) {}
};

const failureSound = () => {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        playNote(220, 0, 0.4, 0.08, "sawtooth");
        playNote(261.63, 0, 0.4, 0.08, "sawtooth");
        playNote(311.13, 0, 0.4, 0.08, "sawtooth");
    } catch (e) {}
};

// Gold Coin Canvas Particle System
class CoinShower {
    constructor() {
        this.canvas = document.getElementById("coinCanvas");
        this.ctx = this.canvas.getContext("2d");
        this.particles = [];
        this.animationFrameId = null;
        
        window.addEventListener("resize", () => this.resize());
        this.resize();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    spawn() {
        this.particles = [];
        const count = 90;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: -Math.random() * 200 - 20,
                radius: Math.random() * 5 + 4,
                speedY: Math.random() * 4 + 3,
                speedX: Math.random() * 3 - 1.5,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: Math.random() * 0.15 - 0.075,
                opacity: Math.random() * 0.4 + 0.6
            });
        }
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.animate();
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let active = false;
        
        for (let p of this.particles) {
            p.y += p.speedY;
            p.x += p.speedX;
            p.rotation += p.rotationSpeed;
            
            if (p.y < this.canvas.height + 20) {
                active = true;
                
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.rotation);
                
                // Draw gold coin circle
                this.ctx.beginPath();
                this.ctx.ellipse(0, 0, p.radius, p.radius * 0.65, 0, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity})`;
                this.ctx.fill();
                this.ctx.strokeStyle = `rgba(138, 111, 39, ${p.opacity})`;
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
                
                // Gold coin inner shine
                this.ctx.beginPath();
                this.ctx.ellipse(0, 0, p.radius * 0.6, p.radius * 0.38, 0, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(245, 215, 110, ${p.opacity})`;
                this.ctx.fill();
                
                this.ctx.restore();
            }
        }
        
        if (active) {
            this.animationFrameId = requestAnimationFrame(() => this.animate());
        } else {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

const coinShower = new CoinShower();

// Live Preview DOM Elements
const heroNameInput = document.getElementById("heroName");
const heroClassSelect = document.getElementById("heroClass");
const questTypeSelect = document.getElementById("questType");
const dangerLevelSelect = document.getElementById("dangerLevel");
const questDescTextarea = document.getElementById("questDesc");

const heroNameDisplay = document.getElementById("heroNameDisplay");
const heroClassDisplay = document.getElementById("heroClassDisplay");
const heroAvatar = document.getElementById("heroAvatar");
const barStrength = document.getElementById("barStrength");
const barMagic = document.getElementById("barMagic");
const barAgility = document.getElementById("barAgility");
const valStrength = document.getElementById("valStrength");
const valMagic = document.getElementById("valMagic");
const valAgility = document.getElementById("valAgility");
const heroSpecialty = document.getElementById("heroSpecialty");

const scrollHero = document.getElementById("scrollHero");
const scrollClass = document.getElementById("scrollClass");
const scrollObjective = document.getElementById("scrollObjective");
const scrollDesc = document.getElementById("scrollDesc");
const scrollDanger = document.getElementById("scrollDanger");
const scrollRank = document.getElementById("scrollRank");
const scrollReward = document.getElementById("scrollReward");
const waxSeal = document.getElementById("waxSeal");

// Live Preview Synchronizer
const updateLivePreviews = () => {
    // Hero Name
    const nameVal = heroNameInput.value.trim();
    heroNameDisplay.textContent = nameVal || "Anon Adventurer";
    scrollHero.textContent = nameVal || "_________";
    
    // Combat Class
    const classVal = heroClassSelect.value;
    if (classVal && CLASS_DATA[classVal]) {
        const data = CLASS_DATA[classVal];
        heroClassDisplay.textContent = classVal;
        scrollClass.textContent = classVal;
        heroAvatar.innerHTML = `<i class="${data.icon}"></i>`;
        
        // Stats
        barStrength.style.width = `${data.strength}%`;
        valStrength.textContent = data.strength;
        
        barMagic.style.width = `${data.magic}%`;
        valMagic.textContent = data.magic;
        
        barAgility.style.width = `${data.agility}%`;
        valAgility.textContent = data.agility;
        
        heroSpecialty.textContent = data.specialty;
    } else {
        heroClassDisplay.textContent = "Class Unassigned";
        scrollClass.textContent = "_________";
        heroAvatar.innerHTML = `<i class="fa-solid fa-user-shield"></i>`;
        
        barStrength.style.width = "0%";
        valStrength.textContent = "0";
        barMagic.style.width = "0%";
        valMagic.textContent = "0";
        barAgility.style.width = "0%";
        valAgility.textContent = "0";
        
        heroSpecialty.textContent = "Specialty: Undefined";
    }
    
    // Quest Objective
    const typeVal = questTypeSelect.value;
    scrollObjective.textContent = typeVal || "_________";
    
    // Quest Description
    const descVal = questDescTextarea.value.trim();
    scrollDesc.textContent = descVal || "Details are still unwritten...";
    
    // Danger Level & Rewards
    const dangerVal = dangerLevelSelect.value;
    if (dangerVal && DANGER_DATA[dangerVal]) {
        const data = DANGER_DATA[dangerVal];
        scrollDanger.textContent = dangerVal;
        scrollDanger.className = data.class;
        scrollRank.textContent = data.rank;
        scrollReward.textContent = data.reward;
    } else {
        scrollDanger.textContent = "Low";
        scrollDanger.className = "danger-low";
        scrollRank.textContent = "Novice";
        scrollReward.textContent = "50 Gold";
    }
};

// Attach Listeners for Live Updates
heroNameInput.addEventListener("input", updateLivePreviews);
heroClassSelect.addEventListener("change", updateLivePreviews);
questTypeSelect.addEventListener("change", updateLivePreviews);
dangerLevelSelect.addEventListener("change", updateLivePreviews);
questDescTextarea.addEventListener("input", updateLivePreviews);

// Synthesized UI Sound Event Listeners
const setupSoundListeners = () => {
    const interactables = document.querySelectorAll("input, select, textarea, button, .result-item, .hero-card");
    interactables.forEach(el => {
        el.addEventListener("mouseenter", hoverSound);
    });
    
    const clickables = document.querySelectorAll("select, input[type='text'], textarea");
    clickables.forEach(el => {
        el.addEventListener("focus", clickSound);
        if (el.tagName === "SELECT") {
            el.addEventListener("change", clickSound);
        }
    });
};

setupSoundListeners();
updateLivePreviews();

// Form Submit Handling
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    submitSound();

    const originalButtonHTML = submitBtn.innerHTML;

    try {
        // Loading State
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="btn-text">
                Summoning Guild...
            </span>
        `;

        // Form Data
        const payload = {
            heroName: heroNameInput.value.trim(),
            heroClass: heroClassSelect.value,
            questType: questTypeSelect.value,
            dangerLevel: dangerLevelSelect.value,
            description: questDescTextarea.value.trim()
        };

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.error || "Guild rejected the contract."
            );
        }

        // Populate Success Modal
        questIdField.textContent = result.questId || "Unknown";
        guildRankField.textContent = result.guildRank || "Unknown";
        rewardField.textContent = `${result.reward || 0} Gold`;
        statusField.textContent = result.status || "PENDING";

        if (result.createdAt) {
            acceptedAtField.textContent = new Date(result.createdAt).toLocaleString();
        } else {
            acceptedAtField.textContent = new Date().toLocaleString();
        }

        // Trigger Triumphant Coin Rain and Sounds
        successSound();
        coinShower.spawn();

        // Show success modal and trigger stamp drop
        successModal.classList.remove("hidden");
        waxSeal.classList.remove("stamped");
        setTimeout(() => {
            waxSeal.classList.add("stamped");
        }, 300);

        form.reset();
        updateLivePreviews();

    } catch (error) {
        console.error("Quest Submission Error:", error);
        failureSound();
        errorModal.classList.remove("hidden");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalButtonHTML;
    }
});

// Close Success Modal
closeBtn.addEventListener("click", () => {
    clickSound();
    successModal.classList.add("hidden");
});

// Close Error Modal
closeErrorBtn.addEventListener("click", () => {
    clickSound();
    errorModal.classList.add("hidden");
});

// Close Modal when clicking outside
window.addEventListener("click", (event) => {
    if (event.target === successModal) {
        clickSound();
        successModal.classList.add("hidden");
    }
    if (event.target === errorModal) {
        clickSound();
        errorModal.classList.add("hidden");
    }
});

// Dynamic Select Placeholder Color Class Handler
const selectList = document.querySelectorAll("select");
selectList.forEach((select) => {
    const updateSelectColor = () => {
        if (select.value === "") {
            select.classList.add("placeholder-selected");
        } else {
            select.classList.remove("placeholder-selected");
        }
    };
    updateSelectColor();
    select.addEventListener("change", updateSelectColor);
});

form.addEventListener("reset", () => {
    setTimeout(() => {
        selectList.forEach((select) => {
            select.classList.add("placeholder-selected");
        });
        updateLivePreviews();
    }, 0);
});