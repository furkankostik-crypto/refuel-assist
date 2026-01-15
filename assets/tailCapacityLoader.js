// tailCapacityLoader.js
// Bu dosya, tailCapacity.json içindeki tankLimitsKg tablosunu yükler.
// ACT'li modeller için (örn: A320neo-2ACT) ACT kapasitesini merkezi tanka ekler.

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
        let data = null;
        try {
            const res = await fetch('assets/tailCapacity.json', { cache: 'no-cache' });
            if (res && res.ok) data = await res.json();
        } catch (e) {
            // network fetch failed — try CacheStorage fallback
            try {
                if (typeof caches !== 'undefined') {
                    const match = await caches.match('assets/tailCapacity.json');
                    if (match) data = await match.json();
                }
            } catch (e2) { /* ignore */ }
        }
        if (!data) return null;
        const map = data?.tankLimitsKg || {};

        const raw = String(modelOrFleet || '').trim();
        if (!raw) return null;

        // ACT suffix desteği: base anahtarı üzerinden limit bul, sonra ACT'yi ekle.
        // Örn: "A320neo-2ACT" -> base: "A320neo" + actCount: 2
        const actMatch = raw.match(/-(\d+)ACT$/i);
        const baseRaw = actMatch ? raw.replace(/-(\d+)ACT$/i, '') : raw;

        let limits = null;

        if (map[baseRaw]) limits = { ...map[baseRaw] };
        else {
            const noPrefix = baseRaw.replace(/^AIRBUS\s+/i, '').replace(/^BOEING\s+/i, '');
            if (map[noPrefix]) limits = { ...map[noPrefix] };
            else {
                const target = normalizeKey(baseRaw);
                const hit = Object.keys(map).find(k => normalizeKey(k) === target);
                if (hit) limits = { ...map[hit] };
                else {
                    const target2 = normalizeKey(noPrefix);
                    const hit2 = Object.keys(map).find(k => normalizeKey(k) === target2);
                    if (hit2) limits = { ...map[hit2] };
                    else {
                        const partial = Object.keys(map).find(k => {
                            const nk = normalizeKey(k);
                            return (nk && (target.includes(nk) || target2.includes(nk) || nk.includes(target2) || nk.includes(target)));
                        });
                        if (partial) limits = { ...map[partial] };
                    }
                }
            }
        }

        if (!limits) return null;

        // ACT kapasitesini dahil et (sadece 2ACT desteklenir)
        if (actMatch) {
            const actCount = parseInt(actMatch[1], 10);
            const addKg = (actCount === 2) ? 4992 : 0;
            if (addKg > 0) {
                limits.actFuelKg = (typeof limits.actFuelKg === 'number' ? limits.actFuelKg : 0) + addKg;
                limits.centerFuelKg = (typeof limits.centerFuelKg === 'number' ? limits.centerFuelKg : 0) + addKg;
                if (typeof limits.totalFuelKg === 'number') limits.totalFuelKg = limits.totalFuelKg + addKg;
            }
        }

        return limits;
    } catch (e) {
        return null;
    }
}

window.fetchTankLimitsKg = fetchTankLimitsKg;
