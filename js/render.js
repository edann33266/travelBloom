// ==========================
// RENDER
// ==========================

import { isFavorite } from "./favorites.js";

const FALLBACK_IMAGE =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260'%3E%3Crect width='400' height='260' fill='%23342f6e'/%3E%3Ctext x='50%25' y='50%25' fill='%23c7d2fe' font-family='sans-serif' font-size='18' text-anchor='middle' dominant-baseline='middle'%3EImage unavailable%3C/text%3E%3C/svg%3E";

function escapeHtml(value) {

    const div = document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;
}

export function renderSkeletons(container, count = 6) {

    container.innerHTML = "";
    container.setAttribute("aria-busy", "true");

    for (let i = 0; i < count; i++) {

        const skeleton = document.createElement("div");

        skeleton.className = "place-card skeleton-card";

        skeleton.innerHTML = `
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton skeleton-line" style="width:70%"></div>
            <div class="skeleton skeleton-line" style="width:90%"></div>
            <div class="skeleton skeleton-line" style="width:50%"></div>
        `;

        container.appendChild(skeleton);
    }
}

export function renderMessage(container, message) {

    container.innerHTML = "";
    container.removeAttribute("aria-busy");

    const p = document.createElement("p");

    p.className = "results-empty";
    p.textContent = message;

    container.appendChild(p);
}

export function renderResultCount(el, count, total) {

    if (!el) return;

    el.textContent =
        count === total
            ? `Showing all ${total} destinations`
            : `Showing ${count} of ${total} destinations`;
}

export function renderResults(container, results, { onToggleFavorite } = {}) {

    container.innerHTML = "";
    container.removeAttribute("aria-busy");

    if (!results.length) {

        renderMessage(
            container,
            "No destinations match your search. Try a different keyword or clear your filters."
        );

        return;
    }

    const fragment = document.createDocumentFragment();

    results.forEach(place => {

        const card = document.createElement("article");

        card.className = "place-card";
        card.setAttribute("data-id", place.id);

        const favorited = isFavorite(place.id);

        card.innerHTML = `
            <div class="place-image-wrap">
                <img
                    src="${escapeHtml(place.imageUrl)}"
                    alt="${escapeHtml(place.name)}"
                    class="place-image"
                    loading="lazy"
                >
                <button
                    class="fav-btn ${favorited ? "is-favorited" : ""}"
                    type="button"
                    aria-pressed="${favorited}"
                    aria-label="${favorited ? "Remove from favorites" : "Add to favorites"}"
                >
                    ${favorited ? "&#9733;" : "&#9734;"}
                </button>
                ${place.rating ? `<span class="rating-badge">&#9733; ${place.rating.toFixed(1)}</span>` : ""}
            </div>

            <h3>${escapeHtml(place.name)}</h3>

            <p class="place-meta">
                ${escapeHtml(place.country || "")}
                ${place.budget ? ` &middot; ${escapeHtml(place.budget)}` : ""}
            </p>

            <p>${escapeHtml(place.description)}</p>

            <button class="visit-btn" type="button">
                Explore
            </button>
        `;

        const img = card.querySelector(".place-image");

        img.addEventListener("error", () => {
            img.src = FALLBACK_IMAGE;
        }, { once: true });

        const favBtn = card.querySelector(".fav-btn");

        favBtn.addEventListener("click", (event) => {

            event.stopPropagation();

            onToggleFavorite?.(place.id, favBtn);
        });

        fragment.appendChild(card);
    });

    container.appendChild(fragment);
}

export function populateSelect(selectEl, values, { placeholder = "All" } = {}) {

    if (!selectEl) return;

    const current = selectEl.value;

    selectEl.innerHTML = `<option value="all">${placeholder}</option>`;

    values.forEach(value => {

        const option = document.createElement("option");

        option.value = value;
        option.textContent = value.charAt(0).toUpperCase() + value.slice(1);

        selectEl.appendChild(option);
    });

    if (values.includes(current)) {
        selectEl.value = current;
    }
}
