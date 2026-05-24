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

    // Stop if elements don't exist
    if (
        !searchBtn ||
        !clearBtn ||
        !searchInput ||
        !resultsContainer
    ) {
        return;
    }

    // ==========================
    // FETCH JSON
    // ==========================

    async function fetchData() {

        try {

            resultsContainer.innerHTML = `
                <p>Loading destinations...</p>
            `;

            // Cache buster added
            const response =
                await fetch(
                    "./travelBloom.json?v=2"
                );

            if (!response.ok) {

                throw new Error(
                    "Failed to load travel data"
                );
            }

            placesData =
                await response.json();

            console.log(
                "Travel data loaded:",
                placesData
            );

            resultsContainer.innerHTML =
                "";

        } catch (error) {

            console.error(error);

            resultsContainer.innerHTML = `
                <p class="error-message">
                    Failed to load travel data.
                </p>
            `;
        }
    }

    // ==========================
    // SEARCH
    // ==========================

    function searchPlaces() {

        const keyword =
            searchInput.value
                .trim()
                .toLowerCase();

        resultsContainer.innerHTML =
            "";

        if (!keyword) {

            resultsContainer.innerHTML = `
                <p>Please enter a destination.</p>
            `;

            return;
        }

        let filteredResults = [];

        // ==========================
        // CATEGORY SEARCH
        // ==========================

        if (
            keyword === "temple" ||
            keyword === "temples"
        ) {

            filteredResults =
                placesData.temples || [];
        }

        else if (
            keyword === "beach" ||
            keyword === "beaches"
        ) {

            filteredResults =
                placesData.beaches || [];
        }

        else if (
            keyword === "country" ||
            keyword === "countries"
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

            // Country search
            const matchedCountry =
                placesData.countries?.find(
                    country =>

                        country.country
                            ?.toLowerCase()
                            .trim() === keyword

                        ||

                        country.country
                            ?.toLowerCase()
                            .includes(keyword)
                );

            if (matchedCountry) {

                filteredResults =
                    matchedCountry.cities;
            }

            else {

                filteredResults =
                    allPlaces.filter(place =>

                        place.name
                            ?.toLowerCase()
                            .includes(keyword)

                        ||

                        place.description
                            ?.toLowerCase()
                            .includes(keyword)

                        ||

                        place.country
                            ?.toLowerCase()
                            .includes(keyword)

                        ||

                        place.category
                            ?.toLowerCase()
                            .includes(keyword)

                        ||

                        place.continent
                            ?.toLowerCase()
                            .includes(keyword)

                        ||

                        place.travelType
                            ?.toLowerCase()
                            .includes(keyword)

                        ||

                        place.tags?.some(
                            tag =>
                                tag
                                    .toLowerCase()
                                    .includes(keyword)
                        )
                );
            }
        }

        // ==========================
        // DISPLAY
        // ==========================

        displayResults(filteredResults);
    }

    // ==========================
    // DISPLAY RESULTS
    // ==========================

    function displayResults(results) {

        resultsContainer.innerHTML =
            "";

        if (!results.length) {

            resultsContainer.innerHTML = `
                <p>No destinations found.</p>
            `;

            return;
        }

        results.forEach(place => {

            const card =
                document.createElement(
                    "div"
                );

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

            resultsContainer
                .appendChild(card);
        });

        resultsContainer.scrollIntoView({
            behavior: "smooth"
        });
    }

    // ==========================
    // CLEAR SEARCH
    // ==========================

    function clearSearch() {

        searchInput.value = "";

        resultsContainer.innerHTML =
            "";
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
