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

    let serverQuotes = [];

    // Async function to simulate fetching data from a mock server
    async function fetchQuotesFromServer() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts'); // Using JSONPlaceholder for simulation
            const data = await response.json();
            serverQuotes = data.slice(0, 5).map(post => ({
                category: 'Misc',
                quote: post.title
            }));
            syncQuotes();
        } catch (error) {
            console.error('Error fetching server data:', error);
        }
    }

    // Function to sync quotes from the server and handle conflicts
    function syncQuotes() {
        serverQuotes.forEach(serverQuote => {
            const existingQuoteIndex = Object.values(quotes).flat().findIndex(quote => quote === serverQuote.quote);
            if (existingQuoteIndex === -1) {
                // If quote doesn't exist locally, add it
                if (!quotes[serverQuote.category]) {
                    quotes[serverQuote.category] = [];
                }
                quotes[serverQuote.category].push(serverQuote.quote);
            } else {
                // If conflict, resolve by preferring server data
                quotes[serverQuote.category] = quotes[serverQuote.category].filter(quote => quote !== serverQuote.quote);
                quotes[serverQuote.category].push(serverQuote.quote);
            }
        });

        saveQuotes();
        alert("Quotes have been synchronized with the server.");
    }

    // Simulate posting data to the server (using async/await)
    async function postToServer(newQuote) {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                body: JSON.stringify({
                    title: newQuote.quote,
                    body: newQuote.category,
                    userId: 1
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();
            alert('Quote posted to server successfully');
        } catch (error) {
            console.error('Error posting to server:', error);
        }
    }

    function saveQuotes() {
        localStorage.setItem("quotes", JSON.stringify(quotes));
    }

    function populateCategories() {
        const categories = Object.keys(quotes);
        categories.map(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });

        const lastCategory = localStorage.getItem("lastCategory");
        if (lastCategory) {
            categoryFilter.value = lastCategory;
            filterQuotes();
        }
    }

    function filterQuotes() {
        const selectedCategory = categoryFilter.value;
        let filteredQuotes = [];

        if (selectedCategory === "all") {
            filteredQuotes = Object.values(quotes).flat();
        } else if (quotes[selectedCategory]) {
            filteredQuotes = quotes[selectedCategory];
        }

        displayQuotes(filteredQuotes);
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

    async function addQuote() {
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

            // Optionally post the new quote to the server
            await postToServer({ quote: quoteText, category: category });
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

    newQuoteButton.addEventListener("click", filterQuotes);
    document.getElementById("addQuote").addEventListener("click", addQuote);
    document.getElementById("exportQuotes").addEventListener("click", exportQuotes);

    // Set up periodic fetch for server data and sync with local data
    setInterval(fetchQuotesFromServer, 10000);  // Fetch from server every 10 seconds

    populateCategories();
    filterQuotes();  // Show filtered quotes initially
});
