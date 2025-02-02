document.addEventListener("DOMContentLoaded", () => {
    const quoteDisplay = document.getElementById("quoteDisplay");
    const newQuoteButton = document.getElementById("newQuote");
    const categoryFilter = document.getElementById("categoryFilter");

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

    function populateCategories() {
        // Dynamically populate categories in the filter dropdown using map
        const categories = Object.keys(quotes);
        categories.map(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        // Restore last selected category from local storage
        const lastCategory = localStorage.getItem("lastCategory");
        if (lastCategory) {
            categoryFilter.value = lastCategory;
            filterQuotes();  // Apply the filter based on the saved category
        }
    }

    function filterQuotes() {
        const selectedCategory = categoryFilter.value;
        let filteredQuotes = [];

        if (selectedCategory === "all") {
            filteredQuotes = Object.values(quotes).flat(); // Flatten the array
        } else if (quotes[selectedCategory]) {
            filteredQuotes = quotes[selectedCategory];
        }

        displayQuotes(filteredQuotes);

        // Save the last selected category
        localStorage.setItem("lastCategory", selectedCategory);
    }

    function displayQuotes(filteredQuotes) {
        quoteDisplay.innerHTML = '';
        if (filteredQuotes.length === 0) {
            quoteDisplay.textContent = "No quotes available for this category.";
            return;
        }

        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        quoteDisplay.textContent = filteredQuotes[randomIndex];
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
                categoryFilter.appendChild(option);
            }
            quotes[category].push(quoteText);
            saveQuotes();
            alert("Quote added successfully!");
            filterQuotes();
        }

        document.getElementById("newQuoteCategory").value = "";
        document.getElementById("newQuoteText").value = "";
    }

    function exportQuotes() {
        const dataStr = JSON.stringify(quotes);
        const blob = new Blob([dataStr], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "quotes.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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

    // Initial Setup
    newQuoteButton.addEventListener("click", filterQuotes);
    document.getElementById("addQuote").addEventListener("click", addQuote);
    document.getElementById("exportQuotes").addEventListener("click", exportQuotes);

    populateCategories(); // Populate categories on load
    filterQuotes(); // Show the filtered quotes initially
});
