// ==========================
// FAVORITES (localStorage)
// ==========================

const STORAGE_KEY = "travelbloom:favorites";

function readIds() {

    try {

        const raw = localStorage.getItem(STORAGE_KEY);

        return raw ? new Set(JSON.parse(raw)) : new Set();

    } catch {

        return new Set();
    }
}

function writeIds(idSet) {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify([...idSet])
        );

    } catch {
        // localStorage unavailable (private mode, quota, etc.)
        // fail silently - favorites just won't persist
    }
}

export function getFavoriteIds() {
    return readIds();
}

export function isFavorite(id) {
    return readIds().has(id);
}

export function toggleFavorite(id) {

    const ids = readIds();

    if (ids.has(id)) {
        ids.delete(id);
    } else {
        ids.add(id);
    }

    writeIds(ids);

    return ids.has(id);
}
