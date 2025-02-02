document.addEventListener("DOMContentLoaded", () => {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");

    const quotes = {
        "Motivation": [
            "The only way to do great work is to love what you do. - Steve Jobs",
            "Don’t watch the clock; do what it does. Keep going. - Sam Levenson"
        ],
        "Life": [
            "In the middle of every difficulty lies opportunity. - Albert Einstein",
            "Life is really simple, but we insist on making it complicated. - Confucius"
        ]
    };

    function getRandomQuote(category) {
        if (!quotes[category] || quotes[category].length === 0) return "No quotes available for this category.";
        const randomIndex = Math.floor(Math.random() * quotes[category].length);
        return quotes[category][randomIndex];
    }

    function updateQuote() {
        const categories = Object.keys(quotes);
        if (categories.length === 0) {
            quoteDisplay.textContent = "No quotes available. Add some!";
            return;
        }
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        quoteDisplay.textContent = getRandomQuote(randomCategory);
    }

    newQuoteButton.addEventListener("click", updateQuote);

    updateQuote(); // Show an initial quote

    // Additional feature: Allow user to add new quotes and categories
    const addQuoteForm = document.createElement("div");
    addQuoteForm.innerHTML = `
        <input type="text" id="newQuoteCategory" placeholder="Enter quote category" required>
        <input type="text" id="newQuoteText" placeholder="Enter a new quote" required>
        <button onclick="addQuote()">Add Quote</button>
    `;
    document.body.appendChild(addQuoteForm);

    window.addQuote = function () {
        const category = document.getElementById("newQuoteCategory").value.trim();
        const quoteText = document.getElementById("newQuoteText").value.trim();
        
        if (category && quoteText) {
            if (!quotes[category]) {
                quotes[category] = [];
            }
            quotes[category].push(quoteText);
            alert("Quote added successfully!");
        }
        document.getElementById("newQuoteCategory").value = "";
        document.getElementById("newQuoteText").value = "";
    };
});
