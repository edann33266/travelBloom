document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // ELEMENTS
    // ==========================

    const searchBtn =
        document.getElementById("searchBtn");

    const clearBtn =
        document.getElementById("clearBtn");

    const searchInput =
        document.getElementById("searchInput");

    const resultsContainer =
        document.getElementById("results");

    let placesData = {};

    // Prevent errors on pages
    // without search UI

    if (
        !searchBtn ||
        !clearBtn ||
        !searchInput
    ) {
        return;
    }

    // ==========================
    // FETCH JSON DATA
    // ==========================

    async function fetchData() {

        try {

            if (resultsContainer) {

                resultsContainer.innerHTML = `
                    <p>Loading destinations...</p>
                `;
            }

            const response =
                await fetch("travelBloom.json");

            if (!response.ok) {

                throw new Error(
                    "Failed to fetch data"
                );
            }

            placesData =
                await response.json();

            if (resultsContainer) {

                resultsContainer.innerHTML =
                    "";
            }

            console.log(
                "Travel data loaded:",
                placesData
            );

        } catch (error) {

            console.error(error);

            if (resultsContainer) {

                resultsContainer.innerHTML = `
                    <p class="error-message">
                        Failed to load travel data.
                    </p>
                `;
            }
        }
    }

    // ==========================
    // SEARCH FUNCTION
    // ==========================

    function searchPlaces() {

        const keyword =
            searchInput.value
                .trim()
                .toLowerCase();

        if (!resultsContainer) {
            return;
        }

        resultsContainer.innerHTML = "";

        if (!keyword) {

            resultsContainer.innerHTML = `
                <p>
                    Please enter a destination.
                </p>
            `;

            return;
        }

        let filteredResults = [];

        // ==========================
        // CATEGORY SEARCH
        // ==========================

        // Beaches
        if (
            keyword.includes("beach") ||
            keyword.includes("beaches")
        ) {

            filteredResults =
                placesData.beaches || [];
        }

        // Temples
        else if (
            keyword.includes("temple") ||
            keyword.includes("temples")
        ) {

            filteredResults =
                placesData.temples || [];
        }

        // Countries
        else if (
            keyword.includes("country") ||
            keyword.includes("countries")
        ) {

            filteredResults =
                placesData.countries
                    ?.flatMap(
                        country =>
                            country.cities
                    ) || [];
        }

        // ==========================
        // GENERAL SEARCH
        // ==========================

        else {

            const allPlaces = [

                ...(placesData.beaches || []),

                ...(placesData.temples || []),

                ...(placesData.countries
                    ?.flatMap(
                        country =>
                            country.cities
                    ) || [])
            ];

            // Match top-level country
            const matchedCountry =
                placesData.countries?.find(
                    country =>
                        country.country
                            .toLowerCase()
                            .includes(keyword)
                );

            if (matchedCountry) {

                filteredResults =
                    matchedCountry.cities;
            }

            else {

                filteredResults =
                    allPlaces.filter(place => {

                        return (

                            // Name
                            place.name
                                ?.toLowerCase()
                                .includes(keyword)

                            ||

                            // Description
                            place.description
                                ?.toLowerCase()
                                .includes(keyword)

                            ||

                            // Country
                            place.country
                                ?.toLowerCase()
                                .includes(keyword)

                            ||

                            // Category
                            place.category
                                ?.toLowerCase()
                                .includes(keyword)

                            ||

                            // Continent
                            place.continent
                                ?.toLowerCase()
                                .includes(keyword)

                            ||

                            // Travel Type
                            place.travelType
                                ?.toLowerCase()
                                .includes(keyword)

                            ||

                            // Tags
                            place.tags?.some(
                                tag =>
                                    tag
                                        .toLowerCase()
                                        .includes(keyword)
                            )
                        );
                    });
            }
        }

        // ==========================
        // DISPLAY RESULTS
        // ==========================

        displayResults(filteredResults);

        resultsContainer.scrollIntoView({
            behavior: "smooth"
        });
    }

    // ==========================
    // DISPLAY RESULTS
    // ==========================

    function displayResults(results) {

        resultsContainer.innerHTML = "";

        if (results.length === 0) {

            resultsContainer.innerHTML = `
                <p>
                    No destinations found.
                </p>
            `;

            return;
        }

        results.forEach(place => {

            const card =
                createCard(place);

            resultsContainer
                .appendChild(card);
        });
    }

    // ==========================
    // CREATE CARD
    // ==========================

    function createCard(place) {

        const card =
            document.createElement("div");

        card.classList.add(
            "place-card"
        );

        card.innerHTML = `
            <img
                src="${place.imageUrl}"
                alt="${place.name}"
                class="place-image"
            >

            <h3>
                ${place.name}
            </h3>

            <p>
                ${place.description}
            </p>

            <button
                class="visit-btn">

                Explore

            </button>
        `;

        return card;
    }

    // ==========================
    // CLEAR SEARCH
    // ==========================

    function clearSearch() {

        searchInput.value = "";

        if (resultsContainer) {

            resultsContainer.innerHTML =
                "";
        }
    }

    // ==========================
    // EVENTS
    // ==========================

    searchBtn.addEventListener(
        "click",
        searchPlaces
    );

    clearBtn.addEventListener(
        "click",
        clearSearch
    );

    searchInput.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter"
            ) {

                searchPlaces();
            }
        }
    );

    // ==========================
    // INIT
    // ==========================

    fetchData();

});
