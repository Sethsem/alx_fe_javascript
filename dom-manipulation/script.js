document.addEventListener("DOMContentLoaded", () => {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");

    let quotes = JSON.parse(localStorage.getItem("quotes")) || {
        "Motivation": [
            "The only way to do great work is to love what you do. - Steve Jobs",
            "Don’t watch the clock; do what it does. Keep going. - Sam Levenson"
        ],
        "Life": [
            "In the middle of every difficulty lies opportunity. - Albert Einstein",
            "Life is really simple, but we insist on making it complicated. - Confucius"
        ]
    };

    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    function getRandomQuote(category) {
        if (!quotes[category] || quotes[category].length === 0) return "No quotes available for this category.";
        const randomIndex = Math.floor(Math.random() * quotes[category].length);
        sessionStorage.setItem("lastQuote", quotes[category][randomIndex]);
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
            <button id="exportQuotes">Export Quotes</button>
            <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
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
        document.getElementById("exportQuotes").addEventListener("click", exportQuotes);
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
            saveQuotes();
            alert("Quote added successfully!");
            showRandomQuote();
        }
        document.getElementById("newQuoteCategory").value = "";
        document.getElementById("newQuoteText").value = "";
    }

    function exportQuotes() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quotes));
        const downloadAnchor = document.createElement("a");
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "quotes.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        document.body.removeChild(downloadAnchor);
    }

    window.importFromJsonFile = function(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            try {
                const importedQuotes = JSON.parse(event.target.result);
                quotes = { ...quotes, ...importedQuotes };
                saveQuotes();
                alert("Quotes imported successfully!");
                location.reload();
            } catch (error) {
                alert("Invalid JSON file.");
            }
        };
        fileReader.readAsText(event.target.files[0]);
    };

    newQuoteButton.addEventListener("click", showRandomQuote);
    createAddQuoteForm();
    showRandomQuote(); // Show an initial quote
});
