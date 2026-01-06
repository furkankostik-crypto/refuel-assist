// tailCapacityLoader.js
// Bu dosya, tailCapacity.json içindeki tankLimitsKg tablosunu yükler.

function normalizeKey(s) {
    return String(s || '')
        .trim()
        .replace(/^AIRBUS\s+/i, '')
        .replace(/^BOEING\s+/i, '')
        .replace(/[^A-Z0-9]/gi, '')
        .toLowerCase();
}

async function fetchTankLimitsKg(modelOrFleet) {
    try {
        const res = await fetch('assets/tailCapacity.json', { cache: 'no-cache' });
        if (!res.ok) return null;
        const data = await res.json();
        const map = data?.tankLimitsKg || {};

        const raw = String(modelOrFleet || '').trim();
        if (!raw) return null;

        if (map[raw]) return map[raw];

        const noPrefix = raw.replace(/^AIRBUS\s+/i, '').replace(/^BOEING\s+/i, '');
        if (map[noPrefix]) return map[noPrefix];

        const target = normalizeKey(raw);
        const hit = Object.keys(map).find(k => normalizeKey(k) === target);
        if (hit) return map[hit];

        const target2 = normalizeKey(noPrefix);
        const hit2 = Object.keys(map).find(k => normalizeKey(k) === target2);
        if (hit2) return map[hit2];

        const partial = Object.keys(map).find(k => {
            const nk = normalizeKey(k);
            return (nk && (target.includes(nk) || target2.includes(nk) || nk.includes(target2) || nk.includes(target)));
        });
        if (partial) return map[partial];

        return null;
    } catch (e) {
        return null;
    }
}

window.fetchTankLimitsKg = fetchTankLimitsKg;
