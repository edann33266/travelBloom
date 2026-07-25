// ==========================
// API / DATA LAYER
// ==========================
// Fetches travelBloom.json and normalizes it into one flat
// array of place objects so the rest of the app never has to
// care whether something came from "countries", "temples" or
// "beaches".

let cache = null;

export async function fetchPlaces() {

    if (cache) {
        return cache;
    }

    const response = await fetch("./travelBloom.json?v=3");

    if (!response.ok) {
        throw new Error("Failed to load travel data");
    }

    const raw = await response.json();

    const cities =
        (raw.countries || []).flatMap(
            country => country.cities || []
        );

    const all = [
        ...cities,
        ...(raw.temples || []),
        ...(raw.beaches || [])
    ];

    // De-dupe defensively in case of bad data, keep first occurrence
    const seen = new Set();

    cache = all.filter(place => {

        if (seen.has(place.id)) {
            return false;
        }

        seen.add(place.id);

        return true;
    });

    return cache;
}
