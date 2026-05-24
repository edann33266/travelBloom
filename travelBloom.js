document.addEventListener("DOMContentLoaded", () => {

    // Elements
    const searchBtn = document.getElementById("btnSearch");
    const clearBtn = document.getElementById("clear");
    const searchInput = document.getElementById("conditionInput");
    const resultsContainer = document.getElementById("results");

    let placesData = {};

    // =====================
    // FETCH JSON DATA
    // =====================
    async function fetchData() {
        try {
            resultsContainer.innerHTML =
                "<p>Loading destinations...</p>";

            const response =
                await fetch("travelBloom.json");

            if (!response.ok) {
                throw new Error(
                    "Failed to fetch data"
                );
            }

            placesData = await response.json();

            resultsContainer.innerHTML = "";

            console.log(
                "Travel data loaded:",
                placesData
            );

        } catch (error) {
            resultsContainer.innerHTML = `
                <p class="error-message">
                    Failed to load travel data.
                </p>
            `;

            console.error(error);
        }
    }

    // =====================
    // SEARCH FUNCTION
    // =====================
    function searchPlaces() {

        const keyword =
            searchInput.value
                .trim()
                .toLowerCase();

        resultsContainer.innerHTML = "";

        if (!keyword) {
            resultsContainer.innerHTML =
                "<p>Please enter a destination.</p>";
            return;
        }

        let filteredResults = [];

        if (keyword.includes("beach")) {

            filteredResults =
                placesData.beaches || [];

        } else if (keyword.includes("temple")) {

            filteredResults =
                placesData.temples || [];

        } else if (keyword.includes("country")) {

            filteredResults =
                placesData.countries
                    ?.flatMap(
                        country => country.cities
                    ) || [];

        } else {

            const allPlaces = [
                ...(placesData.beaches || []),
                ...(placesData.temples || []),
                ...(placesData.countries
                    ?.flatMap(c => c.cities) || [])
            ];

            filteredResults =
                allPlaces.filter(place =>
                    place.name
                        .toLowerCase()
                        .includes(keyword) ||

                    place.description
                        .toLowerCase()
                        .includes(keyword)
                );
        }

        displayResults(filteredResults);
    }

    // =====================
    // DISPLAY RESULTS
    // =====================
    function displayResults(results) {

        if (results.length === 0) {

            resultsContainer.innerHTML = `
                <p>No destinations found.</p>
            `;

            return;
        }

        results.forEach(place => {

            const card = createCard(place);

            resultsContainer.appendChild(card);
        });
    }

    // =====================
    // CARD CREATOR
    // =====================
    function createCard(place) {

        const card =
            document.createElement("div");

        card.classList.add("place-card");

        card.innerHTML = `
            <img
                src="${place.imageUrl}"
                alt="${place.name}"
                class="place-image"
            >

            <h3>${place.name}</h3>

            <p>
                ${place.description}
            </p>

            <button class="visit-btn">
                Explore
            </button>
        `;

        return card;
    }

    // =====================
    // CLEAR SEARCH
    // =====================
    function clearSearch() {

        searchInput.value = "";

        resultsContainer.innerHTML = "";
    }

    // =====================
    // EVENTS
    // =====================
    searchBtn.addEventListener(
        "click",
        searchPlaces
    );

    clearBtn.addEventListener(
        "click",
        clearSearch
    );

    searchInput.addEventListener(
        "keypress",
        (e) => {
            if (e.key === "Enter") {
                searchPlaces();
            }
        }
    );

    // Initialize
    fetchData();
});
