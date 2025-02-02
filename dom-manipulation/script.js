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

    function showRandomQuote() {
        const selectedCategory = document.getElementById("categorySelect").value;
        quoteDisplay.textContent = getRandomQuote(selectedCategory);
    }

    function createAddQuoteForm() {
        const formContainer = document.createElement("div");
        formContainer.innerHTML = `
            <select id="categorySelect"></select>
            <button id="showQuote">Show Quote</button>
            <input type="text" id="newQuoteCategory" placeholder="Enter quote category" required>
            <input type="text" id="newQuoteText" placeholder="Enter a new quote" required>
            <button id="addQuote">Add Quote</button>
        `;
        document.body.appendChild(formContainer);

        const categorySelect = document.getElementById("categorySelect");
        Object.keys(quotes).forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });

        document.getElementById("showQuote").addEventListener("click", showRandomQuote);
        document.getElementById("addQuote").addEventListener("click", addQuote);
    }

    function addQuote() {
        const category = document.getElementById("newQuoteCategory").value.trim();
        const quoteText = document.getElementById("newQuoteText").value.trim();
        
        if (category && quoteText) {
            if (!quotes[category]) {
                quotes[category] = [];
                const option = document.createElement("option");
                option.value = category;
                option.textContent = category;
                document.getElementById("categorySelect").appendChild(option);
            }
            quotes[category].push(quoteText);
            alert("Quote added successfully!");
            showRandomQuote();
        }
        document.getElementById("newQuoteCategory").value = "";
        document.getElementById("newQuoteText").value = "";
    }

    newQuoteButton.addEventListener("click", showRandomQuote);
    createAddQuoteForm();
    showRandomQuote(); // Show an initial quote
});
