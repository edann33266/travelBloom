// ==========================
// MAIN
// ==========================

import { fetchPlaces } from "./api.js";
import { filterPlaces, getFilterOptions } from "./search.js";
import { toggleFavorite } from "./favorites.js";

import {
    renderSkeletons,
    renderMessage,
    renderResults,
    renderResultCount,
    populateSelect
} from "./render.js";

document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("searchInput");
    const searchBtn = document.getElementById("searchBtn");
    const clearBtn = document.getElementById("clearBtn");
    const resultsContainer = document.getElementById("results");
    const resultCountEl = document.getElementById("resultCount");

    const continentSelect = document.getElementById("continentFilter");
    const travelTypeSelect = document.getElementById("travelTypeFilter");
    const budgetSelect = document.getElementById("budgetFilter");
    const sortSelect = document.getElementById("sortBy");
    const favoritesToggle = document.getElementById("favoritesOnly");

    const navToggle = document.getElementById("navToggle");
    const navLinks = document.getElementById("navLinks");

    // Not every page has the results grid (e.g. About / Contact) —
    // bail out early on those but still wire up the nav toggle below.
    const hasSearchUI = Boolean(resultsContainer);

    let allPlaces = [];
    let debounceTimer = null;

    // ==========================
    // MOBILE NAV
    // ==========================

    if (navToggle && navLinks) {

        navToggle.addEventListener("click", () => {

            const isOpen = navLinks.classList.toggle("is-open");

            navToggle.setAttribute("aria-expanded", String(isOpen));
        });
    }

    if (!hasSearchUI) {
        return;
    }

    // ==========================
    // CURRENT FILTER STATE
    // ==========================

    function getFilterState() {

        return {
            keyword: searchInput.value,
            continent: continentSelect?.value || "all",
            travelType: travelTypeSelect?.value || "all",
            budget: budgetSelect?.value || "all",
            sortBy: sortSelect?.value || "relevance",
            favoritesOnly: favoritesToggle?.checked || false
        };
    }

    function runSearch() {

        const results = filterPlaces(allPlaces, getFilterState());

        renderResults(resultsContainer, results, {
            onToggleFavorite: handleToggleFavorite
        });

        renderResultCount(resultCountEl, results.length, allPlaces.length);
    }

    function handleToggleFavorite(id, buttonEl) {

        const nowFavorited = toggleFavorite(id);

        buttonEl.classList.toggle("is-favorited", nowFavorited);
        buttonEl.innerHTML = nowFavorited ? "&#9733;" : "&#9734;";
        buttonEl.setAttribute("aria-pressed", String(nowFavorited));
        buttonEl.setAttribute(
            "aria-label",
            nowFavorited ? "Remove from favorites" : "Add to favorites"
        );

        // If we're only showing favorites, un-favoriting should
        // remove the card immediately instead of leaving a stale one.
        if (favoritesToggle?.checked && !nowFavorited) {
            runSearch();
        }
    }

    function debouncedSearch() {

        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(runSearch, 250);
    }

    // ==========================
    // INIT
    // ==========================

    async function init() {

        renderSkeletons(resultsContainer);

        try {

            allPlaces = await fetchPlaces();

            const { continents, travelTypes } = getFilterOptions(allPlaces);

            populateSelect(continentSelect, continents, { placeholder: "All continents" });
            populateSelect(travelTypeSelect, travelTypes, { placeholder: "All trip types" });

            // Show everything by default so the page never starts empty
            runSearch();

        } catch (error) {

            console.error(error);

            renderMessage(
                resultsContainer,
                "We couldn't load destinations right now. Please refresh the page."
            );
        }
    }

    // ==========================
    // EVENTS
    // ==========================

    searchInput.addEventListener("input", debouncedSearch);

    searchInput.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {

            event.preventDefault();
            clearTimeout(debounceTimer);
            runSearch();
        }
    });

    searchBtn?.addEventListener("click", () => {

        clearTimeout(debounceTimer);
        runSearch();
    });

    clearBtn?.addEventListener("click", () => {

        searchInput.value = "";

        if (continentSelect) continentSelect.value = "all";
        if (travelTypeSelect) travelTypeSelect.value = "all";
        if (budgetSelect) budgetSelect.value = "all";
        if (sortSelect) sortSelect.value = "relevance";
        if (favoritesToggle) favoritesToggle.checked = false;

        runSearch();
    });

    [continentSelect, travelTypeSelect, budgetSelect, sortSelect]
        .filter(Boolean)
        .forEach(el => el.addEventListener("change", runSearch));

    favoritesToggle?.addEventListener("change", runSearch);

    init();
});
