document.addEventListener("DOMContentLoaded", () => {
    const searchBtn = document.getElementById("searchBtn");
    const clearBtn = document.getElementById("clearBtn");
    const searchInput = document.getElementById("searchInput");
    const resultsContainer = document.getElementById("results");

    let placesData = {};

    // Fetch the JSON file
    fetch("travelBloom.json")
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch JSON data");
            return response.json();
        })
        .then(data => {
            placesData = data;
            console.log("Data fetched successfully:", placesData);
        })
        .catch(error => console.error("Error:", error));

    // Search function
    searchBtn.addEventListener("click", () => {
        const keyword = searchInput.value.trim().toLowerCase();
        resultsContainer.innerHTML = "";

        if (!keyword) {
            resultsContainer.innerHTML = "<p>Please enter a keyword.</p>";
            return;
        }

        let filteredResults = [];

        if (keyword.includes("beach")) {
            filteredResults = placesData.beaches || [];
        } else if (keyword.includes("temple")) {
            filteredResults = placesData.temples || [];
        } else if (keyword.includes("country")) {
            filteredResults = placesData.countries?.flatMap(c => c.cities) || [];
        } else {
            // General keyword search across all categories
            const allPlaces = [
                ...(placesData.beaches || []),
                ...(placesData.temples || []),
                ...(placesData.countries?.flatMap(c => c.cities) || [])
            ];
            filteredResults = allPlaces.filter(place =>
                place.name.toLowerCase().includes(keyword) ||
                place.description.toLowerCase().includes(keyword)
            );
        }

        if (filteredResults.length > 0) {
            filteredResults.forEach(place => {
                const card = document.createElement("div");
                card.classList.add("place-card");
                card.style.border = "1px solid #ccc";
                card.style.padding = "10px";
                card.style.borderRadius = "10px";
                card.style.width = "300px";
                card.style.background = "#fff";

                card.innerHTML = `
                    <img src="${place.imageUrl}" alt="${place.name}" style="width: 100%; border-radius: 10px;">
                    <h3>${place.name}</h3>
                    <p>${place.description}</p>
                    <button style="padding: 5px 10px; border-radius: 5px; background: teal; color: white;">Visit</button>
                `;
                resultsContainer.appendChild(card);
            });
        } else {
            resultsContainer.innerHTML = "<p>No results found.</p>";
        }
    });

    // Clear search
    clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        resultsContainer.innerHTML = "";
    });
});
