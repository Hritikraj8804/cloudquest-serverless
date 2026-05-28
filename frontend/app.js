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

form.addEventListener("submit", async (event) => {
    event.preventDefault();

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
            heroName: document.getElementById("heroName").value.trim(),
            heroClass: document.getElementById("heroClass").value,
            questType: document.getElementById("questType").value,
            dangerLevel: document.getElementById("dangerLevel").value,
            description: document.getElementById("questDesc").value.trim()
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
        questIdField.textContent =
            result.questId || "Unknown";

        guildRankField.textContent =
            result.guildRank || "Unknown";

        rewardField.textContent =
            `${result.reward || 0} Gold`;

        statusField.textContent =
            result.status || "PENDING";

        if (result.createdAt) {
            acceptedAtField.textContent =
                new Date(result.createdAt).toLocaleString();
        } else {
            acceptedAtField.textContent =
                new Date().toLocaleString();
        }

        successModal.classList.remove("hidden");

        form.reset();

    } catch (error) {

        console.error("Quest Submission Error:", error);

        errorModal.classList.remove("hidden");

    } finally {

        submitBtn.disabled = false;
        submitBtn.innerHTML = originalButtonHTML;

    }
});

// Close Success Modal
closeBtn.addEventListener("click", () => {
    successModal.classList.add("hidden");
});

// Close Error Modal
closeErrorBtn.addEventListener("click", () => {
    errorModal.classList.add("hidden");
});

// Close Modal when clicking outside
window.addEventListener("click", (event) => {

    if (event.target === successModal) {
        successModal.classList.add("hidden");
    }

    if (event.target === errorModal) {
        errorModal.classList.add("hidden");
    }

});

// Dynamic Select Placeholder Text Color Handler
const selectElements = document.querySelectorAll("select");
selectElements.forEach((select) => {
    const updateSelectColor = () => {
        if (select.value === "") {
            select.classList.add("placeholder-selected");
        } else {
            select.classList.remove("placeholder-selected");
        }
    };

    // Initial check
    updateSelectColor();

    // Event listener for user change
    select.addEventListener("change", updateSelectColor);
});

// Reset color to placeholder style when the form is reset
form.addEventListener("reset", () => {
    setTimeout(() => {
        selectElements.forEach((select) => {
            select.classList.add("placeholder-selected");
        });
    }, 0);
});