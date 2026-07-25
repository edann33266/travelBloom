// ==========================
// SEARCH / FILTER / SORT
// ==========================

import { getFavoriteIds } from "./favorites.js";

const CATEGORY_ALIASES = {
    temple: "temple",
    temples: "temple",
    beach: "beach",
    beaches: "beach",
    city: "city",
    cities: "city",
    country: "city",
    countries: "city"
};

function matchesKeyword(place, keyword) {

    if (!keyword) {
        return true;
    }

    const alias = CATEGORY_ALIASES[keyword];

    if (alias && place.category === alias) {
        return true;
    }

    const haystack = [
        place.name,
        place.description,
        place.country,
        place.category,
        place.continent,
        place.travelType,
        ...(place.tags || [])
    ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

    return haystack.includes(keyword);
}

/**
 * @param {Array} places - full place list
 * @param {Object} options
 * @param {string} options.keyword
 * @param {string} options.continent - "all" or a continent name
 * @param {string} options.travelType - "all" or a travel type
 * @param {string} options.budget - "all" or "$".."$$$$"
 * @param {string} options.sortBy - "relevance" | "rating" | "name"
 * @param {boolean} options.favoritesOnly
 */
export function filterPlaces(places, options = {}) {

    const {
        keyword = "",
        continent = "all",
        travelType = "all",
        budget = "all",
        sortBy = "relevance",
        favoritesOnly = false
    } = options;

    const normalizedKeyword = keyword.trim().toLowerCase();

    const favoriteIds = favoritesOnly ? getFavoriteIds() : null;

    let results = places.filter(place => {

        if (!matchesKeyword(place, normalizedKeyword)) {
            return false;
        }

        if (continent !== "all" && place.continent !== continent) {
            return false;
        }

        if (travelType !== "all" && place.travelType !== travelType) {
            return false;
        }

        if (budget !== "all" && place.budget !== budget) {
            return false;
        }

        if (favoritesOnly && !favoriteIds.has(place.id)) {
            return false;
        }

        return true;
    });

    if (sortBy === "rating") {

        results = [...results].sort(
            (a, b) => (b.rating || 0) - (a.rating || 0)
        );

    } else if (sortBy === "name") {

        results = [...results].sort(
            (a, b) => a.name.localeCompare(b.name)
        );
    }

    return results;
}

export function getFilterOptions(places) {

    const continents = new Set();
    const travelTypes = new Set();

    places.forEach(place => {

        if (place.continent) continents.add(place.continent);
        if (place.travelType) travelTypes.add(place.travelType);
    });

    return {
        continents: [...continents].sort(),
        travelTypes: [...travelTypes].sort()
    };
}
