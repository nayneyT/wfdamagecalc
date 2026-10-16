/* Void Arsenal — browser-only, no modules, no runtime dependencies. */
(function (global) {
  'use strict';
  const CATEGORIES = [
    'weapons',
    'mods',
    'arcanes',
    'archon-shards',
    'enemies',
    'factions',
    'rivens',
    'riven-tables',
    'riven-splices',
    'modular-parts',
    'incarnon-evolutions',
    'stances',
    'rules',
    'arsenal',
    'tenet-offerings',
    'coda-offerings',
    'progenitor-library',
  ];
  const ARCANE_STACK_CAPS = {
    'Arcane Blessing': 50,
    'Arcane Double Back': 3,
    'Arcane Escapist': 9,
    'Arcane Ice Storm': 20,
    'Arcane Power Ramp': 4,
    'Cascadia Flare': 40,
    'Exodia Brave': 3,
    'Magus Melt': 7,
    'Melee Exposure': 4,
    'Molt Augmented': 250,
    'Primary Blight': 40,
    'Primary Crux': 10,
    'Primary Exhilarate': 3,
    'Primary Frostbite': 40,
    'Theorem Demulcent': 15,
    'Theorem Infection': 15,
  };
  const arcaneStackCap = (arcane) =>
    Math.max(1, arcane?.maxStacks || 1, ARCANE_STACK_CAPS[arcane?.name] || 1);
  const modStackCap = (mod) =>
    mod?.name === 'Galvanized Aptitude' ? 2 : Math.max(1, mod?.maxStacks || 1);
  const TYPES = [
    'impact',
    'puncture',
    'slash',
    'heat',
    'cold',
    'electricity',
    'toxin',
    'blast',
    'radiation',
    'gas',
    'magnetic',
    'viral',
    'corrosive',
    'void',
    'tau',
    'true',
    'cinematic',
    'finisher',
  ];
  const STATUS_EFFECT_TYPES = TYPES.filter(
    (type) => !['tau', 'true', 'cinematic', 'finisher'].includes(type),
  );
  const PRIMARY = ['heat', 'cold', 'electricity', 'toxin'];
  const ELEMENT_RECIPES = {
    blast: ['cold', 'heat'],
    radiation: ['electricity', 'heat'],
    gas: ['heat', 'toxin'],
    magnetic: ['cold', 'electricity'],
    viral: ['cold', 'toxin'],
    corrosive: ['electricity', 'toxin'],
  };
  const POLARITIES = [
    '',
    'madurai',
    'vazarin',
    'naramon',
    'zenurik',
    'umbra',
    'unairu',
    'universal',
  ];
  const POLARITY_SVG = {
    madurai:
      '<svg viewBox="0 0 50 50" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="m 10.59322,45.127118 0.635593,-29.449152 c 0,0 -2.3305077,-2.542373 -5.5084737,-4.025424 C 13.559322,8.2627119 19.915254,4.8728813 19.915254,4.8728813 l 0.211865,18.6440677 c 8.68644,-6.991526 16.313559,-13.9830507 16.313559,-13.9830507 5.932204,-1.2711865 9.322034,5.2966097 9.322034,5.2966097 0,0 -26.483051,7.415255 -35.169492,30.29661 z" fill="currentColor"/></svg>',
    vazarin:
      '<svg viewBox="0 0 50 50" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="m 36.652538,6.3559322 c 0,0 -13.559317,0 -31.355928,0.8474576 C 33.262712,25.211865 35.381356,44.279661 35.381356,44.279661 50.211868,27.330509 37.711868,4.0254237 37.711868,4.0254237 Z" fill="currentColor"/><path d="m 38.135598,16.949153 -12.500004,0.847458 9.745763,11.440678 c 0,0 4.237291,-5.29661 2.754241,-12.288136 z" fill="currentColor"/><path d="M 37.640856,5.1003873 C 36.765017,5.2841879 37.028695,6.7637876 35.901504,6.308675 26.719831,6.602264 17.523026,6.6025768 8.3526715,7.15241 7.5312902,7.0176536 6.7787941,7.9655835 7.6243876,8.5229078 11.40461,11.59298 15.425424,14.356797 18.925202,17.760941 c 7.318042,6.861254 13.4384,15.241864 16.215076,24.977241 0.705891,1.031852 1.741461,-0.291445 2.158368,-0.93601 C 41.62747,35.649636 43.195017,27.881506 42.40768,20.465226 41.853131,15.267761 40.540519,10.085642 38.225966,5.3904595 38.100324,5.1997821 37.878597,5.0560634 37.640856,5.1003873 Z m 0.525938,11.8751657 c 0.841342,4.226753 -0.293565,8.723053 -2.760444,12.237653 -3.277079,-3.736753 -6.494106,-7.526665 -9.656797,-11.35585 4.074873,-0.432813 8.315945,-0.644555 12.417241,-0.881803 z" fill="currentColor"/><path d="M 7.0101176,7.2193778 C 6.5475877,7.255502 6.3929253,7.8639901 6.7369076,8.1492846 7.0042471,8.5658337 7.745735,8.3471082 7.6887024,7.8401981 7.6791581,7.5065169 7.3290564,7.2277311 7.0101176,7.2193778 Z" fill="currentColor"/></svg>',
    naramon:
      '<svg viewBox="0 0 50 50" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="m 10.242086,35.426443 c 0,0 -2.7932962,-7.44879 -6.8901312,-15.642458 l 20.6703922,-0.558659 15.828677,-0.18622 0.744879,-5.027933 3.165736,7.63501 3.351955,6.89013 -22.346368,0.186219 -12.849162,-0.186219 z" fill="currentColor"/></svg>',
    zenurik:
      '<svg viewBox="0 0 50 50" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><g transform="translate(2.9033123,12.232624)"></g><g transform="translate(2.9033123,12.232624)"><path d="M -0.29103557,0.1444304 C 1.5711614,5.451692 6.9715343,9.8278559 6.9715343,9.8278559 12.092577,3.8688249 30.621441,6.7552299 30.621441,6.7552299 c 0,0 -6.517691,-8.7523273 -30.91247657,-6.6107995 z" fill="currentColor"/><path d="m 11.440807,14.297129 c 1.955307,4.841713 7.91434,9.869646 7.91434,9.869646 8.752327,-6.517691 24.487895,-2.048417 24.487895,-2.048417 0,0 -9.217877,-10.800743 -32.402235,-7.821229 z" fill="currentColor"/></g></svg>',
    umbra:
      '<svg viewBox="0 0 52 52" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="M47.9,1.2c-5.2,1.9-9.3,6.9-9.3,6.9l0,0c2.1,2.2,3.4,5,3.4,8c0,5.9-4.9,10.9-11.5,12.5c0,0,0,0,0,0l0,0  C27.6,26.1,27.9,18,27.9,18c0-1.5-0.7-3.1-1.9-3.1s-1.9,1.6-1.9,3.1c0,0,0.3,8.2-2.6,10.7C14.9,27,10,22.1,10,16.1  c0-3,1.3-5.8,3.4-8c0,0-4.5-5.2-9.4-7C8.6,5.5,7.4,10,6.9,12s-1.7,5-1.3,8.2c0,0,0,0,0-0.1c0,0,0,0,0,0.1c0,7.2,5.7,13.4,13.7,15.6  c0,0.7,0,1.5,0,2.4c0,2.1,0.9,3.7,2.2,4.7v3.3c0,2.5,2,4.6,4.4,4.6s4.4-2.1,4.4-4.6v-3.3c1.4-1,2.2-2.6,2.2-4.7c0-0.9,0-1.7,0-2.4  c8-2.2,13.7-8.4,13.7-15.6c0.4-3.2-0.8-6.3-1.3-8.2S43.4,5.5,47.9,1.2z M28.4,45.2c0,1.6-1.1,3-2.4,3s-2.4-1.3-2.4-3v-5.9  c0-1.6,1.1-3,2.4-3s2.4,1.3,2.4,3V45.2z" fill="currentColor"/></svg>',
    unairu:
      '<svg viewBox="0 0 50 50" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path d="m 45.24285,24.981603 c -23.070858,-2.696593 -31.010828,0.299621 -31.010828,0.299621 -3.895079,1.947541 -1.94754,13.632779 -1.94754,13.632779 0.125247,4.420632 -3.3480364,1.041886 -3.5954584,0.299622 C 0.14981062,22.43482 12.883725,12.54731 12.883725,12.54731 18.276914,7.3039335 31.759881,7.0043121 31.759881,7.0043121 c 1.198486,2.3969718 -1.498107,4.9437549 -1.498107,4.9437549 -9.438078,4.044891 -5.393187,6.741484 -5.393187,6.741484 16.179561,3.295838 20.374263,6.292052 20.374263,6.292052 z" fill="currentColor"/></svg>',
  };
  const normalizePolarity = (value) => {
    const polarity = String(value || '').toLowerCase();
    return polarity === 'aura' || polarity === 'omni'
      ? 'universal'
      : polarity === 'none'
        ? ''
        : polarity;
  };
  const weaponSlotPolarities = (w) =>
    Array.from({ length: 8 }, (_, i) => normalizePolarity(w?.polarities?.[i]));
  const PROCS = {
    bleed: 'slash',
    ignite: 'heat',
    poison: 'toxin',
    'tesla chain': 'electricity',
    detonate: 'blast',
    'gas cloud': 'gas',
    virus: 'viral',
    corrosion: 'corrosive',
    disrupt: 'magnetic',
    freeze: 'cold',
    weakened: 'puncture',
  };
  const STATUS_ICON_FILES = Object.fromEntries(
    [
      'impact',
      'puncture',
      'slash',
      'heat',
      'cold',
      'electricity',
      'toxin',
      'blast',
      'corrosive',
      'gas',
      'magnetic',
      'radiation',
      'viral',
      'void',
      'tau',
      'true',
    ].map((type) => [
      type,
      'images/status/Dmg' + type[0].toUpperCase() + type.slice(1) + 'Small64.png',
    ]),
  );
  STATUS_ICON_FILES['shield drain'] = 'images/status/IconShield.png';
  const STORAGE_KEY = 'void-arsenal-v1';
  const BUILD_DRAFT_STORAGE_KEY = 'void-arsenal-active-build-v1';
  const INDEXED_DB_NAME = 'void-arsenal-catalogue';
  const INDEXED_DB_VERSION = 1;
  const INDEXED_DB_STORE = 'categories';
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const clamp = (n, a, b) => Math.max(a, Math.min(b, Number.isFinite(+n) ? +n : a));
  const sum = (o) =>
    Object.values(o || {}).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);
  const slug = (s) =>
    String(s)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  const escape = (s) =>
    String(s ?? '').replace(
      /[&<>"']/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
    );
  const fmt = (n, d = 1) =>
    n == null || !Number.isFinite(n)
      ? '—'
      : n.toLocaleString('en-GB', { maximumFractionDigits: d });
  const pct = (n) => fmt(n * 100, 1) + '%';
  const safeURL = (s) => {
    try {
      const u = new URL(s);
      return ['http:', 'https:'].includes(u.protocol) ? u.href : '#';
    } catch {
      return '#';
    }
  };
  const arr = (v) => (Array.isArray(v) ? v : []);
  function recordFingerprint(value) {
    const stable = (v) =>
      Array.isArray(v)
        ? v.map(stable)
        : v && typeof v === 'object'
          ? Object.fromEntries(
              Object.keys(v)
                .sort()
                .map((k) => [k, stable(v[k])]),
            )
          : v;
    const text = JSON.stringify(stable(value));
    let hash = 2166136261;
    for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
    return (hash >>> 0).toString(16).padStart(8, '0');
  }
  const ruleOf = (db) => db.rules.records.find((r) => r.id === 'standard') || db.rules.records[0];
  const records = (db, c) => db[c]?.records || [];
  const get = (db, c, id) => records(db, c).find((r) => r.id === id);
  const isMelee = (w) => /melee|hound|beast/i.test(w.category);
  const rivenCategory = (w) =>
    /archgun/i.test(w.category)
      ? 'Archgun'
      : isMelee(w)
        ? 'Melee'
        : /shotgun/i.test(w.type)
          ? 'Shotgun'
          : /pistol|secondary/i.test(w.type + ' ' + w.category)
            ? 'Pistol'
            : 'Rifle';
  const hasExilus = (w) => ['Primary', 'Secondary', 'Robotic'].includes(w.category);
  const factionBonusKey = (f) =>
    /kuva grineer/.test(f.id)
      ? 'grineer'
      : /corpus-amalgam/.test(f.id)
        ? 'corpus'
        : /infested-deimos/.test(f.id)
          ? 'infested'
          : f.id;
  function defaultState(db) {
    const w = records(db, 'weapons').find((w) => w.id === 'braton') || records(db, 'weapons')[0];
    return {
      weaponId: w?.id,
      attackId: w?.attacks[0]?.id,
      incarnonEnabled: false,
      category: w?.category || 'Primary',
      slots: weaponSlotPolarities(w).map((polarity) => ({
        id: '',
        rank: 0,
        polarity,
        stacks: 0,
        uptime: 100,
      })),
      exilus: {
        id: '',
        rank: 0,
        polarity: normalizePolarity(w?.exilusPolarity),
        stacks: 0,
        uptime: 100,
      },
      aura: { id: '', rank: 0, polarity: '', stacks: 0, uptime: 100 },
      stance: { id: '', rank: 3, polarity: normalizePolarity(w?.stancePolarity) },
      comboId: 'neutral',
      arcanes: Array.from({ length: 4 }, () => ({ id: '', rank: 5, stacks: 0, uptime: 100 })),
      shards: Array.from({ length: 5 }, () => ({ id: '', tauforged: false, stacks: 0 })),
      rank: w?.maxRank || 30,
      mastery: 30,
      forma: 0,
      umbraForma: 0,
      catalyst: true,
      adapter: true,
      gilded: true,
      progenitor: '',
      progenitorValue: 0,
      parts: {},
      evolutions: {},
      evolutionConditions: {},
      abilityStrength: 100,
      abilityMultiplier: 1,
      maximumEnergy: 0,
      scenario: {
        level: 100,
        steelPath: false,
        eximus: false,
        strip: 0,
        corrosiveCap: 10,
        location: 'body',
        distance: 0,
        combo: 1,
        statusTypes: 0,
        comboDuration: 0,
        stacks: { viral: 0, corrosive: 0, heat: 0, magnetic: 0, cold: 0, puncture: 0 },
      },
      enemyId:
        records(db, 'enemies').find((e) => e.name === 'Lancer')?.id ||
        records(db, 'enemies')[0]?.id,
    };
  }
  function compatible(mod, w) {
    if (!mod || !w) return false;
    if (mod.baseDrain < 0) return false; // Capacity-granting stances/auras use their own slot.
    if (mod.incompatibilityTags?.some((t) => w.tags.includes(t))) return false;
    if (mod.compatibilityTags?.length && !mod.compatibilityTags.some((t) => w.tags.includes(t)))
      return false;
    const types = arr(mod.type).length ? mod.type : [mod.type],
      category = rivenCategory(w);
    return types.some((type) => {
      if (type === w.family || type === w.name || type === w.type) return true;
      if (type === 'Rifle')
        return category === 'Rifle' && !/arch|railjack|amp|emplacement/i.test(w.category);
      if (type === 'Primary') return w.category === 'Primary';
      if (type === 'Shotgun') return category === 'Shotgun';
      if (type === 'Pistol' || type === 'Secondary') return category === 'Pistol';
      if (type === 'Melee') return isMelee(w) && !/arch/i.test(w.category);
      if (type === 'Archgun' || type === 'Arch-Gun') return /archgun/i.test(w.category);
      if (type === 'Archmelee' || type === 'Arch-Melee') return /archmelee/i.test(w.category);
      if (type === 'Robotic' || type === 'Sentinel') return w.category === 'Robotic';
      if (type === 'Beast') return /beast/i.test(w.category);
      if (type === 'Hound') return /hound/i.test(w.category);
      return false;
    });
  }
  function arcaneCompatible(a, w, slot) {
    if (!a) return false;
    if (slot >= 2)
      return (
        a.type === 'Warframe' &&
        (!/Acceleration/.test(a.name) || rivenCategory(w) === 'Rifle') &&
        (!/Precision|Velocity|Awakening/.test(a.name) || rivenCategory(w) === 'Pistol') &&
        (!/Strike|Fury/.test(a.name) || isMelee(w)) &&
        (!/Rage/.test(a.name) || w.category === 'Primary')
      );
    const t = a.type;
    if (/archgun/i.test(w.category))
      return slot === 0 ? t === 'Primary' : slot === 1 ? t === 'Secondary' : false;
    if (t === 'Zaw') return w.traits.includes('Zaw');
    if (t === 'Kitgun') return w.tags.includes('MODULAR_GUN');
    if (t === 'Amp') return w.category === 'Amp';
    if (t === 'Melee') return isMelee(w) && !/arch/i.test(w.category);
    if (t === 'Primary') return w.category === 'Primary';
    if (t === 'Secondary') return w.category === 'Secondary';
    return t === w.type || t === rivenCategory(w);
  }
  const twoWeaponArcanes = (w) =>
    /archgun/i.test(w.category) ||
    w.traits.includes('Zaw') ||
    w.tags.includes('MODULAR_GUN') ||
    w.category === 'Amp';
  function evolutionEffectsFor(db, state, w, a) {
    if (!state.incarnonEnabled) return { effects: [], notes: [] };
    const effects = [],
      notes = [];
    for (const [tier, id] of Object.entries(state.evolutions || {})) {
      if (!id) continue;
      const e = get(db, 'incarnon-evolutions', id);
      if (!e || e.family !== w.family || String(e.tier) !== tier) {
        notes.push('Evolution is incompatible with this weapon or tier.');
        continue;
      }
      notes.push(...arr(e.limitations).map((n) => e.name + ': ' + n));
      if (
        Object.keys(e.variantEffects || {}).length &&
        !e.variantEffects[w.incarnonVariant || w.name]
      )
        notes.push(
          e.name +
            ': this custom weapon variant has no verified variant table; shared effects are previewed.',
        );
      for (const source of e.variantEffects?.[w.incarnonVariant || w.name] || e.effects || []) {
        const incarnon = /Incarnon/i.test(a.name);
        if (
          (source.scope === 'normal' && incarnon) ||
          (source.scope === 'incarnon' && !incarnon) ||
          (source.scope === 'direct' && a.shotType === 'AoE') ||
          (source.scope === 'radial' && a.shotType !== 'AoE')
        )
          continue;
        if (source.attacks && !source.attacks.includes(a.id)) continue;
        let factor = 1;
        if (source.condition) {
          const condition = arr(e.conditions).find((c) => c.id === source.condition);
          factor = clamp(
            state.evolutionConditions?.[e.id]?.[source.condition] ?? 0,
            0,
            condition?.maxStacks || 1,
          );
          if (e.conditionMode === 'normal' && incarnon) factor = 0;
        }
        if (source.stat === 'directStatusDamage') factor *= state.scenario.statusTypes;
        effects.push({ ...source, evolution: e.name, value: source.value * factor });
      }
    }
    return { effects, notes };
  }
  function procProbability(chance, weight) {
    chance = Math.max(0, chance);
    weight = clamp(weight, 0, 1);
    return 1 - (1 - weight) ** Math.floor(chance) * (1 - (chance % 1) * weight);
  }
  const STATUS_PROBABILITY_SHOTS = 500;
  function statusProbabilityRows(profile, shots = STATUS_PROBABILITY_SHOTS) {
    const parts = arr(profile?.damageParts),
      totalDamage = parts.reduce((n, part) => n + sum(part.damage || {}), 0),
      count = Math.max(0, Math.floor(Number(shots) || 0));
    if (!totalDamage || !count) return [];
    return STATUS_EFFECT_TYPES.map((type) => {
      let typeDamage = 0,
        expectedPerProjectile = 0,
        noneProbability = 1;
      for (const part of parts) {
        const partDamage = sum(part.damage || {}),
          damage = Number(part.damage?.[type]) || 0;
        if (partDamage <= 0 || damage <= 0) continue;
        const weight = damage / partDamage,
          chance = Math.max(0, Number(part.statusChance) || 0);
        typeDamage += damage;
        expectedPerProjectile += chance * weight;
        noneProbability *= 1 - procProbability(chance, weight);
      }
      if (!typeDamage) return null;
      const perProjectile = clamp(1 - noneProbability, 0, 1),
        atLeastOne = count
          ? perProjectile >= 1
            ? 1
            : perProjectile <= 0
              ? 0
              : -Math.expm1(count * Math.log1p(-perProjectile))
          : 0;
      return {
        profile: attackProfileGroup(profile.a) + ' · ' + (profile.a?.name || ''),
        type,
        damageWeight: typeDamage / totalDamage,
        perProjectile,
        expected: expectedPerProjectile * count,
        atLeastOne,
        shots: count,
      };
    }).filter(Boolean);
  }
  function rivenRollRange(db, riven, attribute, w, rank = riven.rank) {
    const base = get(db, 'riven-tables', attribute.stat)?.values?.[riven.category],
      layout = ruleOf(db).rivenLayouts[riven.layout];
    if (base == null || !layout) return null;
    const factor =
      base *
      (attribute.negative ? layout.negative : layout.positive) *
      ((rank + 1) / 9) *
      (w.rivenDisposition ?? 0);
    const ends = [factor * 0.9, factor * 1.1].sort((a, b) => a - b);
    return {
      min: ends[0],
      max: ends[1],
      current: factor * attribute.quality,
      rollPercent: ((attribute.quality - 0.9) / 0.2) * 100,
    };
  }
  function splicedRivenRollRange(db, riven, attribute, w, rank = riven.rank) {
    const recipe = get(db, 'riven-splices', attribute.stat),
      base = recipe?.baseValues?.[riven.category],
      layout = ruleOf(db).rivenLayouts[riven.layout];
    if (base == null || !layout || attribute.negative) return null;
    const factor = base * layout.positive * ((rank + 1) / 9) * (w.rivenDisposition ?? 0),
      current =
        (attribute.valueAtMaxRankDisposition1 || 0) * ((rank + 1) / 9) * (w.rivenDisposition ?? 0);
    return {
      min: factor * 0.9,
      max: factor * 1.1,
      current,
      quality: factor ? current / factor : null,
      provisional: true,
    };
  }
  function rivenShownNumber(stat, value) {
    if (stat.startsWith('faction:')) return 1 + value;
    if (
      stat === 'parryAngle' ||
      ['range', 'punchThrough', 'initialCombo', 'comboDuration'].includes(stat)
    )
      return value;
    return value * 100;
  }
  function rivenQualityFromDisplayed(db, riven, attribute, w, shown, rank = riven.rank) {
    const table = get(db, 'riven-tables', attribute.stat),
      base = table?.values[riven.category],
      layout = ruleOf(db).rivenLayouts[riven.layout];
    if (base == null || !layout || !Number.isFinite(Number(shown))) return null;
    const factor =
        base *
        (attribute.negative ? layout.negative : layout.positive) *
        ((rank + 1) / 9) *
        (w.rivenDisposition ?? 0),
      displayed = Number(shown),
      effect = attribute.stat.startsWith('faction:')
        ? displayed - 1
        : attribute.stat === 'parryAngle' ||
            ['range', 'punchThrough', 'initialCombo', 'comboDuration'].includes(attribute.stat)
          ? displayed
          : displayed / 100;
    return Math.abs(factor) < 1e-12 ? null : effect / factor;
  }
  function rivenQualityClass(quality) {
    const percent = quality * 100;
    if (percent < 90 - 1e-8 || percent > 110 + 1e-8) return 'invalid';
    return percent < 95 - 1e-8 ? 'red' : percent < 105 - 1e-8 ? 'amber' : 'green';
  }
  function rivenTraitAvailable(db, riven, table, negative = false) {
    if (
      !table ||
      table.values?.[riven.category] == null ||
      (negative ? table.positiveOnly : table.negativeOnly)
    )
      return false;
    const physical = /^element:(impact|puncture|slash)$/.exec(table.id);
    if (!physical) return true;
    return records(db, 'weapons').some(
      (w) =>
        w.family === riven.family &&
        rivenCategory(w) === riven.category &&
        (arr(w.rivenPhysicalExceptions).includes(physical[1]) ||
          w.attacks.some(
            (attack) =>
              (attack.damage[physical[1]] || 0) / Math.max(0.0001, sum(attack.damage)) > 0.25,
          )),
    );
  }
  function normalizeRivenAttributes(db, riven) {
    const positives = +riven.layout[0],
      negatives = +riven.layout[2],
      previous = arr(riven.attributes),
      used = new Set();
    return Array.from({ length: positives + negatives }, (_, index) => {
      const negative = index >= positives,
        existing = previous[index],
        recipe = existing?.spliced ? get(db, 'riven-splices', existing.stat) : null;
      const valid =
        existing &&
        existing.negative === negative &&
        (existing.spliced
          ? !negative && recipe?.categories.includes(riven.category)
          : rivenTraitAvailable(db, riven, get(db, 'riven-tables', existing.stat), negative));
      if (valid && !used.has(existing.stat)) {
        used.add(existing.stat);
        return existing;
      }
      const replacement = records(db, 'riven-tables').find(
        (table) => rivenTraitAvailable(db, riven, table, negative) && !used.has(table.id),
      );
      if (replacement) used.add(replacement.id);
      return { stat: replacement?.id || '', quality: 1, negative };
    });
  }
  function rivenSelectableTraits(db, riven, index) {
    const attribute = riven.attributes[index];
    return records(db, 'riven-tables').filter(
      (table) =>
        rivenTraitAvailable(db, riven, table, attribute.negative) &&
        !riven.attributes.some(
          (other, otherIndex) => otherIndex !== index && other.stat === table.id,
        ),
    );
  }
  function compatibleSplices(db, riven) {
    return records(db, 'riven-splices')
      .filter((recipe) => recipe.categories.includes(riven.category))
      .flatMap((recipe) =>
        recipe.pairs.flatMap((pair) => {
          const left = riven.attributes.findIndex((a) => !a.spliced && a.stat === pair[0]),
            right = riven.attributes.findIndex((a) => !a.spliced && a.stat === pair[1]);
          return left >= 0 && right >= 0 && left !== right ? [{ recipe, left, right, pair }] : [];
        }),
      );
  }
  function splicedInputUnit(stat) {
    return stat === 'parryAngle'
      ? 'degrees'
      : stat.startsWith('faction:')
        ? 'damage multiplier (e.g. 1.5)'
        : 'percent';
  }
  function splicedToEffect(stat, input) {
    const number = Number(input);
    return stat === 'parryAngle' ? number : stat.startsWith('faction:') ? number - 1 : number / 100;
  }
  function splicedFromEffect(stat, effect) {
    return stat === 'parryAngle' ? effect : stat.startsWith('faction:') ? 1 + effect : effect * 100;
  }
  function spliceRiven(db, riven, recipeId, left, right, shownValue, w) {
    const choice = compatibleSplices(db, riven).find(
      (x) => x.recipe.id === recipeId && x.left === left && x.right === right,
    );
    if (!choice) throw Error('Select a compatible trait pair to splice.');
    if (riven.attributes.some((a) => a.spliced)) throw Error('Remove the existing splice first.');
    const value = splicedToEffect(choice.recipe.stat, shownValue),
      scale = (w.rivenDisposition ?? 0) * ((riven.rank + 1) / 9);
    if (!Number.isFinite(value) || value <= 0 || scale <= 0)
      throw Error('Enter the positive spliced value displayed in game.');
    const first = riven.attributes[left],
      second = riven.attributes[right],
      splicedIndex = first.negative ? right : left,
      replacementIndex = splicedIndex === left ? right : left,
      replacementNegative = first.negative || second.negative;
    const used = new Set(
      riven.attributes.filter((_, i) => i !== left && i !== right).map((a) => a.stat),
    );
    used.add(choice.recipe.stat);
    const replacement = records(db, 'riven-tables').find(
      (t) => rivenTraitAvailable(db, riven, t, replacementNegative) && !used.has(t.id),
    );
    if (!replacement) throw Error('No ordinary replacement trait is available.');
    const attributes = clone(riven.attributes);
    attributes[splicedIndex] = {
      stat: choice.recipe.stat,
      spliced: true,
      negative: false,
      valueAtMaxRankDisposition1: value / scale,
      sourceTraits: choice.pair,
    };
    attributes[replacementIndex] = {
      stat: replacement.id,
      quality: 1,
      negative: replacementNegative,
    };
    return { ...riven, attributes };
  }
  function clearRivenSplice(db, riven) {
    const attributes = clone(riven.attributes),
      index = attributes.findIndex((a) => a.spliced);
    if (index < 0) return riven;
    const used = new Set(attributes.filter((_, i) => i !== index).map((a) => a.stat));
    const replacement = records(db, 'riven-tables').find(
      (t) => rivenTraitAvailable(db, riven, t, false) && !used.has(t.id),
    );
    if (!replacement) throw Error('No ordinary replacement trait is available.');
    attributes[index] = { stat: replacement.id, quality: 1, negative: false };
    return { ...riven, attributes };
  }
  function rivenEffects(db, riven, w, rank = riven.rank) {
    const group = riven.category,
      layout = ruleOf(db).rivenLayouts[riven.layout];
    if (!layout) return [];
    return riven.attributes.map((a) => {
      const table = get(db, 'riven-tables', a.stat),
        base = table?.values[group];
      return {
        stat: a.stat,
        spliced: !!a.spliced,
        heavyDouble: a.stat === 'critChance' && group === 'Melee',
        value: a.spliced
          ? (a.valueAtMaxRankDisposition1 || 0) * ((rank + 1) / 9) * (w.rivenDisposition ?? 0)
          : (base ?? 0) *
            (a.negative ? layout.negative : layout.positive) *
            clamp(a.quality, 0.9, 1.1) *
            ((rank + 1) / 9) *
            (w.rivenDisposition ?? 0),
      };
    });
  }
  function slotMod(db, slot, w) {
    if (slot.id.startsWith('riven:')) {
      const r = get(db, 'rivens', slot.id.slice(6));
      return r
        ? {
            ...r,
            type: r.category,
            maxRank: 8,
            baseDrain: 10,
            effects: rivenEffects(db, r, w, slot.rank),
            limitations: [],
            riven: true,
          }
        : null;
    }
    return get(db, 'mods', slot.id);
  }
  function modDrain(mod, rank, polarity) {
    const drain = mod.baseDrain + rank;
    if (!polarity) return drain;
    if (polarity === mod.polarity || polarity === 'universal') return Math.ceil(drain / 2);
    return Math.ceil(drain * 1.25);
  }
  function auraCapacityGain(mod, rank, polarity) {
    const gain = Math.max(0, -mod.baseDrain + rank);
    return !polarity
      ? gain
      : polarity === mod.polarity || polarity === 'universal'
        ? gain * 2
        : Math.floor(gain * 0.8);
  }
  function modSlotState(index) {
    return index === 9 ? state.aura : index === 8 ? state.exilus : state.slots[index];
  }
  function auraEffects(db, state) {
    const slot = state.aura,
      mod = slot?.id && get(db, 'mods', slot.id);
    if (mod?.type !== 'Aura' || mod.id === 'toxin-resistance') return [];
    return (
      mod.rankEffects?.[slot.rank] ||
      arr(mod.effects).map((effect) => ({
        ...effect,
        value: (effect.value * (slot.rank + 1)) / (mod.maxRank + 1),
      }))
    );
  }
  function auraApplies(mod, w, attack) {
    switch (mod.id) {
      case 'rifle-amp':
        return w.category === 'Primary' && rivenCategory(w) === 'Rifle' && !/sniper/i.test(w.type);
      case 'pistol-amp':
        return w.category === 'Secondary';
      case 'shotgun-amp':
        return w.category === 'Primary' && rivenCategory(w) === 'Shotgun';
      case 'dead-eye':
        return w.category === 'Primary' && /sniper/i.test(w.type);
      case 'steel-charge':
        return isMelee(w) && !/arch/i.test(w.category);
      case 'empowered-blades':
        return isMelee(w) && !!(attack?.heavy || /Heavy Attack/i.test(attack?.name || ''));
      default:
        return true;
    }
  }
  function auraEnemyScenario(db, state, scenario = state.scenario) {
    const result = { ...scenario };
    for (const effect of auraEffects(db, state))
      if (effect.stat === 'auraArmorReduction' || effect.stat === 'auraShieldReduction')
        result[effect.stat] = effect.value;
    return result;
  }
  function buildResources(state, w, used = 0, stanceBonus = 0) {
    const changes = state.slots.map((slot, i) => ({
      from: w.polarities[i] || '',
      to: slot.polarity || '',
    }));
    if (hasExilus(w))
      changes.push({ from: w.exilusPolarity || '', to: state.exilus.polarity || '' });
    if (isMelee(w) && state.stance.id)
      changes.push({ from: w.stancePolarity || '', to: state.stance.polarity || '' });
    const changed = changes.filter(({ from, to }) => from !== to),
      umbraForma = changed.filter(({ to }) => to === 'umbra').length;
    const rankForma = w.maxRank > 30 ? Math.ceil(Math.max(0, state.rank - 30) / 2) : 0;
    const forma = Math.max(changed.length, rankForma);
    const baseCapacity = Math.max(state.rank, Math.min(state.mastery, w.maxRank)) + stanceBonus;
    return {
      forma,
      normalForma: forma - umbraForma,
      umbraForma,
      catalystRequired: used > baseCapacity,
      baseCapacity,
    };
  }
  function configureWeapon(db, state) {
    const original = get(db, 'weapons', state.weaponId);
    if (!original) throw Error('Select a valid weapon.');
    const w = clone(original),
      notes = [];
    const modularGroup = w.tags.includes('MODULAR_GUN')
      ? w.category === 'Primary'
        ? 'KitgunPrimary'
        : 'KitgunSecondary'
      : w.traits.includes('Zaw')
        ? 'Zaw'
        : w.category === 'Amp' && /Prism|Scaffold/.test(w.name)
          ? 'Amp'
          : null;
    if (modularGroup && modularGroup !== 'Amp') {
      const parts = records(db, 'modular-parts').filter((p) => p.group === modularGroup);
      const pick = (kind) => parts.find((p) => p.id === state.parts[kind]);
      if (modularGroup.startsWith('Kitgun')) {
        const chamber = parts.find((p) => p.kind === 'Chamber' && p.name === w.family),
          grip = pick('Grip'),
          loader = pick('Loader');
        if (chamber && grip && loader) {
          const c = chamber.spec,
            g = grip.spec,
            l = loader.spec,
            a = w.attacks[0];
          a.damage = Object.fromEntries(
            Object.entries(c.Damage[grip.name] || c.Damage.Base).map(([k, v]) => [
              k.toLowerCase(),
              v,
            ]),
          );
          a.fireRate = c.FireRate[grip.name] || 12;
          a.critChance = c.CritChance + l.CritChance;
          a.critMultiplier = c.CritMultiplier + l.CritMultiplier;
          a.statusChance = c.StatusChance + l.StatusChance;
          a.ammoCost = c.AmmoCost || 1;
          w.magazine = c.Magazine[l.Magazine];
          w.reload = l.Reload;
          w.limitations = w.limitations.filter((n) => !n.startsWith('Select modular'));
          w.limitations.push(
            'Modular radial components and secondary interactions are not fully sourced.',
          );
          if (c.Falloff)
            a.falloff = {
              start: c.Falloff.StartRange,
              end: c.Falloff.EndRange,
              reduction: c.Falloff.Reduction,
            };
          w.configuration = grip.name + ' · ' + loader.name;
        } else notes.push('Select both a kitgun grip and loader.');
      } else {
        const strike = parts.find((p) => p.kind === 'Strike' && p.name === w.family),
          grip = pick('Grip'),
          link = pick('Link');
        if (strike && grip && link) {
          const s = strike.spec,
            g = grip.spec,
            l = link.spec,
            a = w.attacks[0],
            base = sum(s.Damage),
            damage = base + g.Damage + l.Damage;
          const multi = s.Multi[g.Type]?.Base || 1;
          a.damage = Object.fromEntries(
            Object.entries(s.Damage).map(([k, v]) => [
              k.toLowerCase(),
              (v / base) * damage * multi,
            ]),
          );
          a.fireRate = g.Speed + s.Speed + l.Speed;
          a.critChance = s.CritChance + l.CritChance;
          a.critMultiplier = s.CritMultiplier;
          a.statusChance = s.StatusChance + l.StatusChance;
          w.type = s.Type[g.Type];
          w.heavyAttack = null;
          w.configuration = grip.name + ' · ' + link.name;
          w.limitations.push(
            'Zaw heavy-attack and slam profiles require combination-specific data.',
          );
          if (!state.gilded) {
            a.critChance -= 0.1;
            a.statusChance -= 0.1;
          }
        } else notes.push('Select a Zaw grip and link.');
      }
    }
    if (modularGroup === 'Amp') {
      const prism = get(db, 'weapons', state.parts.Prism),
        scaffold = get(db, 'weapons', state.parts.Scaffold);
      if (prism && scaffold) {
        w.attacks = [
          ...prism.attacks.map((a) => ({
            ...clone(a),
            id: 'prism-' + a.id,
            name: prism.name + ' · ' + a.name,
          })),
          ...scaffold.attacks.map((a) => ({
            ...clone(a),
            id: 'scaffold-' + a.id,
            name: scaffold.name + ' · ' + a.name,
          })),
        ];
        w.magazine = prism.magazine;
        w.reload = prism.reload;
        w.reloadStyle = prism.reloadStyle;
        w.reloadDelay = prism.reloadDelay;
        w.reloadRate = prism.reloadRate;
      }
      const brace = get(db, 'modular-parts', state.parts.Brace);
      if (brace) {
        for (const a of w.attacks) {
          a.critChance += brace.spec.critChance;
          a.statusChance += brace.spec.statusChance;
        }
        w.magazine += brace.spec.energy;
        w.reloadDelay = Math.max(0, w.reloadDelay + brace.spec.reloadDelay);
        w.reloadRate += brace.spec.reloadRate;
        w.configuration = brace.name;
      }
      if (!state.gilded) notes.push('Ungilded Amp stat adjustments are not modeled.');
    }
    if (state.progenitor && state.progenitorValue > 0) {
      if (!/^(Kuva|Tenet|Coda|Dual Coda) /.test(w.name))
        notes.push('Progenitor bonuses are only valid on eligible Kuva, Tenet or Coda weapons.');
      else
        for (const a of w.attacks) {
          const amount = (sum(a.damage) * state.progenitorValue) / 100;
          a.damage[state.progenitor] = (a.damage[state.progenitor] || 0) + amount;
        }
    }
    if (w.type === 'Exalted Weapon' || w.tags.includes('POWER_WEAPON'))
      for (const a of w.attacks)
        for (const t in a.damage)
          a.damage[t] *= (state.abilityStrength / 100) * state.abilityMultiplier;
    if (/heavy/i.test(state.attackId) && w.heavyAttack) {
      const normal = w.attacks[0],
        total = sum(normal.damage);
      w.attacks.push({
        ...clone(normal),
        id: 'heavy',
        name: 'Heavy Attack',
        damage: Object.fromEntries(
          Object.entries(normal.damage).map(([t, d]) => [t, (d / total) * w.heavyAttack]),
        ),
        chargeTime: w.windUp,
        heavy: true,
      });
    }
    const unmodded = clone(w.attacks.find((a) => a.id === state.attackId) || w.attacks[0]),
      unmoddedComponents = [
        unmodded,
        ...clone(w.attacks.filter((part) => part.componentOf === unmodded.id)),
      ];
    const resolved = evolutionEffectsFor(db, state, w, unmodded);
    notes.push(...resolved.notes);
    const evolutionEffects = [],
      evolutionDisplay = resolved.effects.map((e) => ({ ...e })),
      a = w.attacks.find((a) => a.id === state.attackId) || w.attacks[0];
    for (const e of resolved.effects) {
      if (e.stat === 'baseDamage') {
        const componentAttacks = [
            a,
            ...w.attacks.filter((part) => part.componentOf === a.id && part !== a),
          ],
          targets = e.scope === 'both' ? componentAttacks : [a];
        for (const target of targets) {
          if (
            (target.shotType === 'AoE' && e.scope === 'direct') ||
            (target.shotType !== 'AoE' && e.scope === 'radial')
          )
            continue;
          const total = sum(target.damage);
          if (total > 0)
            for (const t in target.damage) target.damage[t] *= Math.max(0, total + e.value) / total;
          else notes.push('Cannot distribute flat base damage across an empty attack.');
        }
      } else if (e.stat === 'baseMagazine') {
        if (a.magazine != null) a.magazine += e.value;
        else if (w.magazine != null) w.magazine += e.value;
      } else if (e.stat === 'baseMultishot') a.multishot = Math.max(0, a.multishot + e.value);
      else if (e.stat === 'baseAmmoSet') w.ammoCapacity = e.value;
      else evolutionEffects.push(e);
    }
    return { w, notes, evolutionEffects, evolutionDisplay, unmodded, unmoddedComponents };
  }
  function validateBuild(db, state, w) {
    const errors = [],
      all = [...state.slots, ...(hasExilus(w) ? [state.exilus] : [])],
      mods = all.map((s) => slotMod(db, s, w)),
      ids = new Set();
    let used = 0,
      stanceBonus = 0;
    const maxRank = w.maxRank > 30 ? Math.min(w.maxRank, 30 + 2 * state.forma) : w.maxRank;
    if (state.rank < 0 || state.rank > maxRank)
      errors.push('Weapon rank exceeds the rank unlocked by Forma.');
    if (state.mastery < w.mastery) errors.push('Mastery rank is below this weapon’s requirement.');
    for (let i = 0; i < all.length; i++) {
      const s = all[i],
        m = mods[i];
      if (!s.id) continue;
      if (!m) {
        errors.push('Slot ' + (i + 1) + ': record not found.');
        continue;
      }
      if (ids.has(m.id)) errors.push('Duplicate mod: ' + m.name);
      ids.add(m.id);
      if (m.riven) {
        if (m.family !== w.family || m.category !== rivenCategory(w) || w.rivenDisposition == null)
          errors.push('Riven is incompatible with this weapon.');
        if (state.mastery < m.mastery) errors.push('Riven mastery requirement is not met.');
      } else if (!compatible(m, w)) errors.push(m.name + ' is incompatible with this weapon.');
      if (s.rank < 0 || s.rank > m.maxRank || !Number.isInteger(s.rank))
        errors.push(m.name + ': invalid rank.');
      if (i === 8 && (!m.isExilus || !state.adapter))
        errors.push('Exilus slot requires an eligible mod and an unlocked adapter.');
      for (const other of mods)
        if (other && other.id !== m.id && m.incompatible?.includes(other.id))
          errors.push(m.name + ' excludes ' + other.name + '.');
      used += modDrain(m, s.rank, s.polarity);
    }
    if (mods.filter((m) => m?.riven).length > 1) errors.push('Only one Riven can be equipped.');
    const aura = state.aura?.id && get(db, 'mods', state.aura.id);
    if (state.aura?.id && (!aura || aura.type !== 'Aura'))
      errors.push('Aura slot requires an Aura mod.');
    if (
      aura &&
      (!Number.isInteger(state.aura.rank) || state.aura.rank < 0 || state.aura.rank > aura.maxRank)
    )
      errors.push(aura.name + ': invalid Aura rank.');
    const st = get(db, 'stances', state.stance.id);
    if (st && isMelee(w)) {
      if (st.type !== w.type) errors.push('Stance does not match the weapon type.');
      const drain = st.baseDrain + state.stance.rank;
      stanceBonus =
        state.stance.polarity === st.polarity || state.stance.polarity === 'universal'
          ? drain * 2
          : state.stance.polarity
            ? Math.floor(drain * 0.8)
            : drain;
    }
    const resources = buildResources(state, w, used, stanceBonus);
    if (resources.forma > state.forma)
      errors.push(
        'This build requires ' +
          resources.forma +
          ' total Forma (' +
          resources.umbraForma +
          ' Umbra Forma).',
      );
    if (resources.umbraForma > (state.umbraForma || 0))
      errors.push('Umbra polarities require ' + resources.umbraForma + ' Umbra Forma.');
    if ((state.umbraForma || 0) > state.forma)
      errors.push('Umbra Forma applied cannot exceed total Forma applied.');
    const capacity =
      (resources.baseCapacity - stanceBonus) * (state.catalyst ? 2 : 1) + stanceBonus;
    if (resources.catalystRequired && !state.catalyst)
      errors.push('Current mod drain requires an Orokin Catalyst.');
    if (used > capacity) errors.push('Mod drain exceeds capacity by ' + (used - capacity) + '.');
    const arcaneIds = new Set();
    state.arcanes.forEach((s, i) => {
      if (!s.id) return;
      const a = get(db, 'arcanes', s.id);
      if (!a || !arcaneCompatible(a, w, i))
        errors.push('Arcane slot ' + (i + 1) + ' is incompatible.');
      if (a && s.rank > a.maxRank) errors.push(a.name + ': invalid rank.');
      if (arcaneIds.has(s.id)) errors.push('Duplicate arcane.');
      arcaneIds.add(s.id);
      if (i === 1 && !twoWeaponArcanes(w)) errors.push('This weapon has one weapon arcane slot.');
      if (i < 2 && !state.adapter) errors.push('Weapon arcane adapter is locked.');
    });
    return { errors: [...new Set(errors)], used, capacity, resources };
  }
  function shardMaximumEnergy(db, state) {
    return (
      Math.max(0, Number(state.maximumEnergy) || 0) +
      arr(state.shards).reduce((total, slot) => {
        const shard = get(db, 'archon-shards', slot.id),
          value = slot.tauforged ? shard?.tauMaximumEnergyBonus : shard?.maximumEnergyBonus;
        return total + (Number(value) || 0);
      }, 0)
    );
  }
  function collectEffects(db, state, w, extra) {
    const bonus = {},
      elements = [],
      notes = [];
    const add = (e, slot) => {
      let value = e.value;
      if (e.conditional)
        value *= clamp(slot.stacks, 0, slot.maxStacks || 100) * clamp(slot.uptime / 100, 0, 1);
      if (!value) return;
      if (e.heavyDouble) bonus.heavyCrit = (bonus.heavyCrit || 0) + value;
      if (e.bowDouble) bonus.bowFireRate = (bonus.bowFireRate || 0) + value;
      if (e.stat.startsWith('element:')) elements.push({ type: e.stat.slice(8), value });
      else bonus[e.stat] = (bonus[e.stat] || 0) + value;
    };
    for (const s of [...state.slots, ...(hasExilus(w) ? [state.exilus] : [])]) {
      if (!s.id) continue;
      const m = slotMod(db, s, w);
      if (!m) continue;
      notes.push(
        ...arr(m.limitations)
          .filter(
            (n) =>
              !(m.name === 'Galvanized Aptitude' && /special effects.*not fully modeled/i.test(n)),
          )
          .map((n) => m.name + ': ' + n),
      );
      const effects = m.riven
        ? m.effects
        : [
            ...(m.rankEffects?.[s.rank] ||
              m.effects.map((e) => ({ ...e, value: (e.value * (s.rank + 1)) / (m.maxRank + 1) }))),
            ...(m.name === 'Galvanized Aptitude'
              ? [
                  {
                    stat: 'galvanizedAptitude',
                    value: (0.4 * (s.rank + 1)) / (m.maxRank + 1),
                    conditional: true,
                  },
                ]
              : []),
          ];
      effects.forEach((e) =>
        add({ ...e, bowDouble: e.stat === 'fireRate' }, { ...s, maxStacks: modStackCap(m) }),
      );
    }
    const aura = get(db, 'mods', state.aura?.id),
      attack = w.attacks.find((a) => a.id === state.attackId);
    if (aura?.type === 'Aura') {
      notes.push(...arr(aura.limitations).map((n) => aura.name + ': ' + n));
      if (auraApplies(aura, w, attack))
        for (const effect of auraEffects(db, state)) add(effect, { stacks: 0, uptime: 100 });
      if (!auraEffects(db, state).length)
        notes.push(aura.name + ': its effect is not modeled in this calculator.');
    }
    state.arcanes.forEach((s) => {
      if (!s.id) return;
      const a = get(db, 'arcanes', s.id);
      if (!a) return;
      notes.push(...a.limitations.map((n) => a.name + ': ' + n));
      (a.rankEffects?.[s.rank] || []).forEach((e) =>
        add(e, { ...s, maxStacks: arcaneStackCap(a) }),
      );
    });
    for (const [slotIndex, s] of arr(state.shards).entries()) {
      if (!s.id) continue;
      const shard = get(db, 'archon-shards', s.id);
      if (!shard) continue;
      notes.push(...arr(shard.limitations).map((n) => shard.name + ': ' + n));
      const eligible =
        !shard.weaponCategories?.length || shard.weaponCategories.includes(w.category);
      if (!eligible) continue;
      for (const source of arr(shard.effects)) {
        let value = s.tauforged ? (source.tauValue ?? source.value) : source.value || 0;
        if (source.perOtherShard) {
          const matching = arr(state.shards).filter((other) => {
            const record = get(db, 'archon-shards', other.id);
            return record && arr(source.countColors).includes(record.color);
          }).length;
          value +=
            matching *
            (s.tauforged
              ? (source.tauPerOtherShard ?? source.perOtherShard)
              : source.perOtherShard);
        }
        if (source.doubleAboveEnergy && shardMaximumEnergy(db, state) > source.doubleAboveEnergy)
          value *= 2;
        add(
          {
            ...source,
            value,
            tauValue: undefined,
            perOtherShard: undefined,
            countColors: undefined,
            tauPerOtherShard: undefined,
          },
          {
            stacks: s.stacks || 0,
            uptime: 100,
            maxStacks: s.tauforged
              ? (shard.tauMaxStacks ?? shard.maxStacks ?? 1)
              : shard.maxStacks || 1,
          },
        );
      }
    }
    extra.forEach((e) => add(e, { stacks: 1, uptime: 100 }));
    return { bonus, elements, notes };
  }
  function combineElements(base, mods) {
    const damage = {},
      ordered = [],
      amounts = {};
    for (const [t, v] of Object.entries(base)) if (!PRIMARY.includes(t)) damage[t] = v;
    for (const { type, value } of mods) {
      if (PRIMARY.includes(type)) {
        if (!(type in amounts)) ordered.push(type);
        amounts[type] = (amounts[type] || 0) + value;
      } else damage[type] = (damage[type] || 0) + value;
    }
    for (const t of PRIMARY)
      if (base[t]) {
        if (!(t in amounts)) ordered.push(t);
        amounts[t] = (amounts[t] || 0) + base[t];
      }
    const combinations = Object.fromEntries(
      Object.entries(ELEMENT_RECIPES).map(([result, types]) => [types.join('+'), result]),
    );
    for (let i = 0; i < ordered.length; i += 2) {
      const a = ordered[i],
        b = ordered[i + 1],
        type = b ? combinations[[a, b].sort().join('+')] : a;
      damage[type] = (damage[type] || 0) + amounts[a] + (b ? amounts[b] : 0);
    }
    return Object.fromEntries(Object.entries(damage).filter(([, n]) => n > 0));
  }
  function criticalTiers(chance, cd, headcrit = 1, promotion = 0) {
    chance = Math.max(0, chance);
    const low = Math.floor(chance),
      fraction = chance - low;
    return [
      { tier: low + promotion, probability: 1 - fraction },
      { tier: low + 1 + promotion, probability: fraction },
    ]
      .filter((x) => x.probability > 1e-12)
      .map((x) => ({
        ...x,
        multiplier: x.tier === 0 ? 1 : Math.max(0, 1 + x.tier * (cd * headcrit - 1)),
      }));
  }
  function quantizedCriticalMultiplier(value) {
    // Warframe stores the base critical multiplier as a 12-bit value over [0, 32].
    const code = Math.floor((clamp(value, 0, 32) * 4095) / 32 + 0.5);
    return (code * 32) / 4095;
  }
  function quantizeDamageVector(damage) {
    const reference = sum(damage);
    if (!(reference > 0)) return { ...damage };
    return Object.fromEntries(
      Object.entries(damage).map(([type, value]) => [
        type,
        ((Math.sign(value) * Math.floor((Math.abs(value) / reference) * 32 + 0.5)) / 32) *
          reference,
      ]),
    );
  }
  function popupDamage(value, incarnon = false) {
    value = Math.max(0, value);
    return incarnon ? Math.ceil(value - 1e-9) : Math.floor(value + 0.5);
  }
  function scale(q, curves, L = 70, U = 80) {
    const f = Math.fround;
    q = Math.max(0, q);
    const t = clamp(f(f(q - L) / f(U - L)), 0, 1),
      s = f(f(t * t) * f(3 - f(2 * t)));
    const low = f(1 + f(f(curves[0]) * f(q ** f(curves[1])))),
      high = f(1 + f(f(curves[2]) * f(q ** f(curves[3]))));
    return Math.max(1, f(low + f(f(high - low) * s)));
  }
  function enemyStats(db, e, s) {
    const rule = ruleOf(db),
      faction = get(db, 'factions', e.factionId),
      profile = rule.scaling[faction?.scaling || 'standard'];
    if (e.baseLevel == null || [e.health, e.shield, e.armor].some((v) => v == null))
      return {
        health: e.health,
        shield: e.shield,
        armor: e.armor,
        overguard: null,
        level: s.level,
        scalingUnknown: true,
      };
    const q = Math.max(0, s.level - e.baseLevel),
      f = Math.fround;
    const factor =
      s.level <= 15
        ? 1
        : s.level <= 25
          ? 1 + 0.025 * (s.level - 15)
          : s.level <= 35
            ? 1.25 + 0.125 * (s.level - 25)
            : s.level <= 50
              ? 2.5 + (2 / 15) * (s.level - 35)
              : s.level <= 100
                ? 4.5 + 0.03 * (s.level - 50)
                : 6;
    let health = s.eximus
      ? Math.max(
          e.eximusHealth * 1.1,
          (e.armor || e.shield ? 0.25 : 0.375) * (e.eximusHealth + 900) * factor,
        )
      : e.health;
    let shield = s.eximus ? Math.max(e.eximusShield * 1.1, e.eximusShield * factor) : e.shield;
    health = f(f(health) * scale(q, profile.health)) * (s.steelPath ? rule.steelPathHealth : 1);
    shield =
      f(f(shield) * scale(q, profile.shield)) *
      (s.steelPath ? rule.steelPathShield : 1) *
      Math.max(0, 1 - (s.auraShieldReduction || 0));
    let armor =
      e.armor > 0
        ? clamp(f(f(e.armor) * scale(q, rule.armorScaling)), rule.armorMin, rule.armorCap)
        : 0;
    const baseArmor = armor,
      corrosive = e.statusImmune
        ? 0
        : Math.floor(
            clamp(
              s.stacks.corrosive,
              0,
              Math.min(s.corrosiveCap ?? 10, e.statusCaps.corrosive ?? 14),
            ),
          );
    armor *= Math.max(0, 1 - (s.auraArmorReduction || 0));
    armor *= 1 - clamp(s.strip, 0, 100) / 100;
    armor *= corrosive ? Math.max(0, 1 - (0.2 + 0.06 * corrosive)) : 1;
    if (!e.statusImmune && s.stacks.heat > 0)
      armor *= 1 - clamp(s.heatStripOverride ?? 0.5, 0, 0.5);
    const overguard = s.eximus
      ? f(rule.overguardBase * scale(s.level - 1, rule.overguardScaling, 45, 50)) *
        (s.steelPath ? rule.steelPathOverguard : 1)
      : 0;
    return { health, shield, armor, baseArmor, overguard, level: s.level, scalingUnknown: false };
  }
  function armorProcDistribution(weapon, cap = 14) {
    const make = () => Array.from({ length: cap + 1 }, () => [0, 0]),
      draw = (p, c, h) => {
        const q = make();
        for (let n = 0; n <= cap; n++)
          for (let hot = 0; hot < 2; hot++) {
            const v = p[n][hot];
            q[n][hot] += v * Math.max(0, 1 - c - h);
            q[Math.min(cap, n + 1)][hot] += v * c;
            q[n][1] += v * h;
          }
        return q;
      };
    const c = weapon.total ? (weapon.damage.corrosive || 0) / weapon.total : 0,
      h = weapon.total ? (weapon.damage.heat || 0) / weapon.total : 0;
    let single = make();
    single[0][0] = 1;
    const chance = clamp(weapon.sc, 0, 256);
    for (let i = 0; i < Math.floor(chance); i++) single = draw(single, c, h);
    single = draw(single, c * (chance % 1), h * (chance % 1));
    const forced = (type) =>
      (weapon.forced[type] || 0) +
      (weapon.forcedProcs || arr(weapon.a.forcedProcs)).filter((p) => (PROCS[p] || p) === type)
        .length;
    const fc = clamp(forced('corrosive'), 0, cap),
      fh = clamp(forced('heat'), 0, 1);
    for (let i = 0; i < Math.floor(fc); i++) single = draw(single, 1, 0);
    single = draw(single, fc % 1, 0);
    single = draw(single, 0, fh);
    const combine = (p, q) => {
      const out = make();
      for (let n = 0; n <= cap; n++)
        for (let hot = 0; hot < 2; hot++)
          if (p[n][hot])
            for (let m = 0; m <= cap; m++)
              for (let heat = 0; heat < 2; heat++)
                if (q[m][heat]) out[Math.min(cap, n + m)][hot || heat] += p[n][hot] * q[m][heat];
      return out;
    };
    let all = make();
    all[0][0] = 1;
    const ms = clamp(weapon.ms, 0, 256);
    for (let i = 0; i < Math.floor(ms); i++) all = combine(all, single);
    const extra = combine(all, single),
      fraction = ms % 1;
    for (let n = 0; n <= cap; n++)
      for (let hot = 0; hot < 2; hot++)
        all[n][hot] = all[n][hot] * (1 - fraction) + extra[n][hot] * fraction;
    return {
      outcomes: all
        .flatMap((row, corrosive) =>
          row.map((probability, heat) => ({ corrosive, heat, probability })),
        )
        .filter((x) => x.probability > 1e-12),
      truncated: weapon.sc > 256 || weapon.ms > 256,
    };
  }
  function corrosiveStackCap(state, weapon, e) {
    const bonus = Math.max(0, Math.floor(weapon?.bonus?.corrosiveCapBonus || 0)),
      enemyCap = e?.statusCaps?.corrosive ?? 14;
    return Math.floor(Math.min((state.scenario.corrosiveCap ?? 10) + bonus, enemyCap + bonus));
  }
  function enemyComparison(db, state, weapon, e, distribution = null) {
    const duration = Math.max(0, 1 + (weapon.bonus.statusDuration || 0)),
      elapsed = weapon.rate > 0 ? 1 / weapon.rate : null,
      cap = corrosiveStackCap(state, weapon, e),
      initial = calculateEnemy(
        db,
        { ...state, scenario: { ...state.scenario, location: 'body' } },
        weapon,
        e,
      );
    distribution ||= armorProcDistribution(weapon, cap);
    const heatStep =
        elapsed == null || !duration
          ? 0
          : Math.min(4, Math.floor((elapsed + 1e-10) / (0.5 * duration))),
      heatReduction =
        elapsed == null || !duration
          ? 0
          : elapsed < 6 * duration
            ? [0, 0.15, 0.3, 0.4, 0.5][heatStep]
            : [0.5, 0.4, 0.3, 0.15, 0][
                Math.min(4, Math.floor((elapsed - 6 * duration + 1e-10) / (1.5 * duration)))
              ],
      rule = ruleOf(db);
    const outcomes =
      e.statusImmune || elapsed == null
        ? [{ corrosive: 0, heat: 0, probability: 1 }]
        : distribution.outcomes;
    let armor = 0,
      fullStripChance = 0,
      expectedCorrosive = 0,
      heatChance = 0,
      meanReduction = 0;
    for (const p of outcomes) {
      const cor = Math.min(
          cap,
          Math.floor(state.scenario.stacks.corrosive) +
            (elapsed != null && elapsed < 8 * duration ? p.corrosive : 0),
        ),
        hot =
          state.scenario.stacks.heat > 0 ||
          (p.heat && elapsed != null && (elapsed < 6 * duration || heatReduction > 0));
      const scenario = auraEnemyScenario(db, state, {
          ...state.scenario,
          corrosiveCap: cap,
          stacks: { ...state.scenario.stacks, corrosive: cor, heat: hot ? 1 : 0 },
          heatStripOverride: state.scenario.stacks.heat > 0 ? 0.5 : hot ? heatReduction : 0,
        }),
        stats = enemyStats(db, e, scenario);
      if (stats.armor == null) {
        armor = null;
        meanReduction = null;
      } else {
        if (armor != null) armor += stats.armor * p.probability;
        const reduction =
          stats.armor <= rule.armorCap
            ? rule.armorMaxReduction * Math.sqrt(stats.armor / rule.armorCap)
            : stats.armor / (stats.armor + 300);
        if (meanReduction != null) meanReduction += reduction * p.probability;
      }
      if (stats.baseArmor > 0 && stats.armor < 1e-8) fullStripChance += p.probability;
      expectedCorrosive += cor * p.probability;
      heatChance +=
        (!e.statusImmune &&
        (state.scenario.stacks.heat > 0 || (p.heat && elapsed != null && elapsed < 6 * duration))
          ? 1
          : 0) * p.probability;
    }
    const locations = {};
    for (const location of ['body', 'weak', 'head']) {
      const first =
          location === 'body'
            ? initial
            : calculateEnemy(
                db,
                { ...state, scenario: { ...state.scenario, location } },
                weapon,
                e,
              ),
        zero = calculateEnemy(
          db,
          { ...state, scenario: { ...state.scenario, location, strip: 100 } },
          weapon,
          e,
        );
      // Damage is affine in armor reduction, so average damage over proc outcomes,
      // not damage evaluated at average armor. This also preserves True/Slash bypass.
      const blend = (a, z) =>
        a == null || z == null || meanReduction == null
          ? null
          : first.reduction > 0
            ? z + ((a - z) * meanReduction) / first.reduction
            : a;
      const next = {
        ...first,
        layers: Object.fromEntries(
          Object.entries(first.layers).map(([layer, values]) => [
            layer,
            Object.fromEntries(
              Object.entries(values).map(([field, value]) => [
                field,
                blend(value, zero.layers[layer][field]),
              ]),
            ),
          ]),
        ),
        stats: { ...first.stats, armor },
        statusDps: blend(first.statusDps, zero.statusDps),
        toxinBypass: blend(first.toxinBypass, zero.toxinBypass),
        combined: blend(first.combined, zero.combined),
        reduction: meanReduction,
      };
      if (distribution.truncated) {
        next.complete = false;
        next.combined = null;
        next.notes = [
          ...first.notes,
          'Proc distribution is capped for this extreme custom build; follow-up damage is an approximation.',
        ];
      }
      locations[location] = { first, next };
    }
    return {
      initial,
      locations,
      armor,
      stripPercent:
        initial.stats.baseArmor > 0 && armor != null
          ? clamp(1 - armor / initial.stats.baseArmor, 0, 1)
          : 0,
      fullStripChance,
      expectedCorrosive,
      heatChance,
      heatReduction,
      elapsed,
      truncated: distribution.truncated,
    };
  }
  const comparisonCache = new Map();
  function cachedEnemyComparison(db, state, weapon, enemy, distribution) {
    const key = enemy.id + '|' + JSON.stringify(state),
      found = comparisonCache.get(key);
    if (found) return found;
    const result = enemyComparison(db, state, weapon, enemy, distribution);
    comparisonCache.set(key, result);
    if (comparisonCache.size > 250) comparisonCache.delete(comparisonCache.keys().next().value);
    return result;
  }

  function calculateWeapon(db, state) {
    const { w, notes, evolutionEffects, evolutionDisplay, unmodded, unmoddedComponents } =
        configureWeapon(db, state),
      build = validateBuild(db, state, w),
      effects = collectEffects(db, state, w, evolutionEffects),
      b = effects.bonus;
    const a = w.attacks.find((a) => a.id === state.attackId) || w.attacks[0],
      s = state.scenario;
    const components = [a, ...w.attacks.filter((part) => part.componentOf === a.id)],
      rawBase = clone(unmodded.damage),
      rawBaseTotal = sum(rawBase),
      base = components.reduce((sum, part) => {
        for (const [type, value] of Object.entries(part.damage || {}))
          sum[type] = (sum[type] || 0) + value;
        return sum;
      }, {}),
      baseTotal = sum(base),
      melee = isMelee(w),
      heavy = a.heavy || /Heavy Attack/.test(a.name);
    const ordinary = Math.max(
      0,
      1 + (b.damage || 0) + (melee ? (b.conditionDamage || 0) * s.statusTypes : 0),
    );
    const sumParts = (parts) =>
        parts.reduce((total, part) => {
          for (const [type, value] of Object.entries(part))
            total[type] = (total[type] || 0) + value;
          return total;
        }, {}),
      makePart = (part, elementEffects, damageBonus, directBonus) => {
        const partBase = part.damage || {},
          partTotal = sum(partBase),
          elemental = elementEffects.map((e) => ({
            type: e.type,
            value:
              PRIMARY.includes(e.type) || !['impact', 'puncture', 'slash'].includes(e.type)
                ? partTotal * e.value
                : (partBase[e.type] || 0) * e.value,
          })),
          raw = combineElements(partBase, elemental);
        for (const type in raw) raw[type] *= damageBonus;
        const distribution = clone(raw),
          mission = quantizeDamageVector(raw),
          final = clone(mission);
        for (const type in final) final[type] *= directBonus;
        return {
          source: part,
          distribution,
          mission,
          damage: final,
          baseTotal: partTotal,
          criticalChance: Math.max(
            0,
            (part.critChance + (b.baseCrit || 0)) *
              (1 +
                (b.critChance || 0) +
                (heavy ? b.heavyCrit || 0 : 0) +
                (b.comboCrit || 0) * Math.max(0, s.combo - 1)) +
              (b.flatCrit || 0),
          ),
          criticalMultiplier: Math.max(
            1,
            quantizedCriticalMultiplier(part.critMultiplier + (b.baseCritDamage || 0)) *
              (1 + (b.critDamage || 0)),
          ),
          statusChance: Math.max(
            0,
            (part.statusChance + (b.baseStatus || 0)) *
              (1 + (b.statusChance || 0) + (b.comboStatus || 0) * Math.max(0, s.combo - 1)) +
              (b.flatStatus || 0),
          ),
          forcedProcs: arr(part.forcedProcs),
        };
      };
    const moddedParts = components.map((part) =>
        makePart(part, effects.elements, ordinary, Math.max(0, 1 + (b.directStatusDamage || 0))),
      ),
      moddedDistribution = sumParts(moddedParts.map((part) => part.distribution)),
      missionDamage = sumParts(moddedParts.map((part) => part.mission));
    let damage = sumParts(moddedParts.map((part) => part.damage));
    let multiplier = heavy ? s.combo : 1;
    const stance = get(db, 'stances', state.stance.id),
      combo = stance?.combos.find((c) => c.id === state.comboId);
    let comboDuration = 0,
      forced = {};
    if (melee && !heavy && combo) {
      const hits = combo.hits.reduce((n, h) => n + h.multiplier * h.hits, 0);
      multiplier *= hits;
      comboDuration = state.scenario.comboDuration || combo.duration || 0;
      for (const h of combo.hits) {
        for (const proc of arr(h.forcedProcs).flat()) {
          const p = PROCS[proc.toLowerCase()] || proc.toLowerCase();
          forced[p] = (forced[p] || 0) + h.hits;
        }
      }
      if (combo.hits.some((h) => h.impactMultiplier || h.slashMultiplier || h.type))
        notes.push(
          'Stance-specific physical multipliers and mixed attack types are not fully modeled.',
        );
      if (!comboDuration) notes.push('A measured duration is required for this stance combo.');
    }
    for (const t in damage) damage[t] *= multiplier * Math.max(0, 1 + (b.directStatusDamage || 0));
    const eb = collectEffects(
        db,
        {
          ...state,
          slots: state.slots.map((s) => ({ ...s, id: '' })),
          exilus: { ...state.exilus, id: '' },
          arcanes: state.arcanes.map((s) => ({ ...s, id: '' })),
          shards: state.shards.map((s) => ({ ...s, id: '' })),
        },
        w,
        evolutionEffects,
      ),
      incarnonParts = components.map((part) =>
        makePart(
          part,
          eb.elements,
          Math.max(0, 1 + (eb.bonus.damage || 0)),
          Math.max(0, 1 + (eb.bonus.directStatusDamage || 0)),
        ),
      ),
      incarnonDamage = sumParts(incarnonParts.map((part) => part.damage));
    const stages = { unmodded: rawBase, incarnon: incarnonDamage, modded: moddedDistribution };
    const fireFactor = Math.max(
      0,
      1 + (b.fireRate || 0) + (/bow/i.test(w.type) ? b.bowFireRate || 0 : 0),
    );
    let fireRate = Math.max(0, a.fireRate * fireFactor);
    if (a.trigger === 'Semi-Auto') fireRate = Math.min(10, fireRate);
    const charge = a.chargeTime ? a.chargeTime / Math.max(0.1, fireFactor) : 0;
    const noChargeDelay = /bow/i.test(w.type) || w.family === 'Lanka' || w.family === 'Epitaph';
    const attackTime = comboDuration
      ? comboDuration / Math.max(0.01, fireRate)
      : melee && s.comboDuration
        ? s.comboDuration / Math.max(0.01, fireFactor)
        : heavy
          ? w.windUp / Math.max(0.01, 1 + (b.windUp || 0))
          : charge
            ? charge + (noChargeDelay ? 0 : fireRate > 0 ? 1 / fireRate : 0)
            : fireRate > 0
              ? 1 / fireRate
              : 0;
    const burst = a.burstCount || 1;
    const burstRate = attackTime
      ? a.burstDelay > 0
        ? burst / (attackTime + (Math.max(0, burst - 1) * a.burstDelay) / Math.max(1, fireFactor))
        : 1 / attackTime
      : 0;
    const rate = comboDuration ? 1 / attackTime : burstRate;
    const ms = b.lockMultishot ? a.multishot : Math.max(0, a.multishot * (1 + (b.multishot || 0)));
    const magBase = a.magazine ?? w.magazine,
      mag = magBase == null ? null : Math.max(0, Math.round(magBase * (1 + (b.magazine || 0)))),
      ammoEfficiency = clamp(b.ammoEfficiency || 0, 0, 1),
      ammo = Math.max(0, (a.ammoCost || 1) * (1 - ammoEfficiency)),
      shots = mag == null || ammo <= 1e-9 ? null : Math.floor(mag / ammo);
    let reload = w.reload == null ? null : w.reload / Math.max(0.01, 1 + (b.reload || 0));
    if (w.reloadStyle === 'Regenerate')
      reload = w.reloadRate > 0 ? w.reloadDelay + (mag || 0) / w.reloadRate : null;
    let sustain = rate;
    if (!melee && shots != null) {
      if (shots <= 0 || reload == null) sustain = null;
      else {
        const firing =
          shots / Math.max(0.0001, rate) -
          (/^(Vectis|Vectis Prime)$/.test(w.name) && !charge ? 1 / Math.max(0.0001, rate) : 0);
        sustain = shots / (firing + reload);
      }
    }
    if (/Incarnon/.test(a.name) && a.magazine != null) {
      sustain = null;
      notes.push(
        'Incarnon sustained DPS requires a charge/transformation cycle; burst DPS is available.',
      );
    }
    const cc = Math.max(
      0,
      (a.critChance + (b.baseCrit || 0)) *
        (1 +
          (b.critChance || 0) +
          (heavy ? b.heavyCrit || 0 : 0) +
          (b.comboCrit || 0) * Math.max(0, s.combo - 1)) +
        (b.flatCrit || 0),
    );
    const encodedBaseCd = quantizedCriticalMultiplier(a.critMultiplier + (b.baseCritDamage || 0));
    const cd = Math.max(1, encodedBaseCd * (1 + (b.critDamage || 0)));
    const sc = Math.max(
      0,
      (a.statusChance + (b.baseStatus || 0)) *
        (1 + (b.statusChance || 0) + (b.comboStatus || 0) * Math.max(0, s.combo - 1)) +
        (b.flatStatus || 0),
    );
    const crit = criticalTiers(cc, cd),
      meanCrit = sum(Object.fromEntries(crit.map((x, i) => [i, x.probability * x.multiplier]))),
      total = sum(damage),
      expected =
        moddedParts.reduce((n, part) => {
          const tiers = criticalTiers(part.criticalChance, part.criticalMultiplier);
          return n + sum(part.damage) * tiers.reduce((t, x) => t + x.probability * x.multiplier, 0);
        }, 0) * ms;
    const relevantLimits = w.limitations.filter(
      (n) => !n.startsWith('Incarnon charging') || /Incarnon/.test(a.name),
    );
    const allNotes = [...notes, ...effects.notes, ...relevantLimits, ...arr(a.limitations)];
    for (const trait of [
      'ammoEfficiency',
      'holsterReload',
      'parryAngle',
      'slamDamage',
      'heavyAttackDamage',
    ])
      if (b[trait])
        allNotes.push(
          'Spliced ' + trait + ' is displayed but its specialized behavior is not modeled.',
        );
    if (a.trigger === 'Held' && ms !== a.multishot)
      allNotes.push(
        'Beam multishot damage is modeled; beam-specific status distribution and ramp-up require verification.',
      );
    if (heavy)
      allNotes.push(
        'Heavy-attack repeating DPS assumes the selected combo is externally maintained.',
      );
    if (melee && !combo && !heavy && !s.comboDuration)
      allNotes.push(
        'Normal melee DPS uses attack speed as attacks/second; enter a measured base duration for animation timing.',
      );
    if (combo)
      allNotes.push(
        'Stance status DPS does not fully model per-strike multipliers and forced-proc timing.',
      );
    if (!rate) allNotes.push('Attack timing is unavailable.');
    const elementBonuses = {};
    for (const e of effects.elements)
      elementBonuses[e.type] = (elementBonuses[e.type] || 0) + e.value;
    return {
      w,
      a,
      unmodded,
      components,
      forcedProcs: components.flatMap((part) => arr(part.forcedProcs)),
      damageParts: moddedParts.map((part, index) => ({
        id: part.source.id,
        name: part.source.name,
        componentOf: part.source.componentOf,
        damage: part.damage,
        shotType: part.source.shotType,
        falloff: part.source.falloff,
        baseTotal: part.baseTotal,
        stages: {
          unmodded: clone(
            unmoddedComponents.find((source) => source.id === part.source.id)?.damage ||
              part.source.damage ||
              {},
          ),
          incarnon: clone(incarnonParts[index].damage),
          modded: clone(part.distribution),
        },
        criticalChance: part.criticalChance,
        criticalMultiplier: part.criticalMultiplier,
        statusChance: part.statusChance,
        forcedProcs: part.forcedProcs,
      })),
      build,
      bonus: b,
      elementBonuses,
      evolutionEffects: evolutionDisplay,
      rawBase,
      rawBaseTotal,
      stages,
      incarnonTotal: sum(incarnonDamage),
      base,
      baseTotal: sum(base),
      missionDamage,
      encodedBaseCd,
      baseShot: rawBaseTotal * unmodded.multishot,
      damage,
      total,
      expected,
      ms,
      cc,
      cd,
      sc,
      crit,
      meanCrit,
      rate,
      sustain,
      mag,
      reload,
      shots,
      ammoEfficiency,
      ammoPerShot: ammo,
      ordinary,
      multiplier,
      forced,
      notes: [...new Set(allNotes)],
      burstDps: expected * rate,
      sustainedDps: sustain == null ? null : expected * sustain,
    };
  }
  function calculateEnemy(db, state, weapon, e) {
    const s = state.scenario,
      w = weapon.w,
      a = weapon.a,
      b = weapon.bonus,
      stats = enemyStats(
        db,
        e,
        auraEnemyScenario(db, state, { ...s, corrosiveCap: corrosiveStackCap(state, weapon, e) }),
      ),
      f = get(db, 'factions', e.factionId) || {
        id: e.factionId,
        modifiers: {},
        limitations: ['Unknown faction.'],
      };
    const notes = [
      ...weapon.notes,
      ...e.limitations.filter((n) => s.location !== 'body' || !n.startsWith('Weakpoint')),
      ...f.limitations,
    ];
    if (stats.scalingUnknown && s.level !== e.baseLevel)
      notes.push('Level-scaled defenses are unavailable.');
    let point = null;
    if (s.location !== 'body' && a.shotType !== 'AoE') {
      point = s.location === 'head' ? e.weakpoints.find((p) => p.headshot) : e.weakpoints[0];
      if (!point) notes.push('Requested hit location is not sourced for this enemy.');
    }
    const body = point
      ? (point.multiplier + (b.weakDamage || 0) * (point.headshot ? 1.5 : 1)) *
        (point.headshot ? 1 + (b.headshot || 0) : 1)
      : 1;
    const headcrit = point?.headcrit || 1,
      promotion = point?.promotion || 0,
      cc =
        weapon.cc +
        (point ? (a.critChance + (b.baseCrit || 0)) * (b.weakCrit || 0) : 0) +
        (a.shotType !== 'AoE' ? 0.05 * clamp(s.stacks.puncture, 0, 5) : 0),
      cold = clamp(s.stacks.cold, 0, 10),
      cd =
        weapon.cd +
        (a.shotType === 'AoE'
          ? 0
          : cold === 10
            ? 1
            : cold
              ? 0.1 + 0.05 * (Math.min(cold, 9) - 1)
              : 0);
    const tiers = criticalTiers(cc, cd, headcrit, promotion),
      crit = tiers.reduce((n, t) => n + t.probability * t.multiplier, 0),
      criticalProbability = tiers.reduce((n, t) => n + (t.tier > 0 ? t.probability : 0), 0),
      criticalMean = criticalProbability
        ? tiers.reduce((n, t) => n + (t.tier > 0 ? t.probability * t.multiplier : 0), 0) /
          criticalProbability
        : 0;
    const factionMultiplier = Math.max(0, 1 + (b['faction:' + factionBonusKey(f)] || 0));
    const rule = ruleOf(db),
      reduction =
        stats.armor <= rule.armorCap
          ? rule.armorMaxReduction * Math.sqrt(stats.armor / rule.armorCap)
          : stats.armor / (stats.armor + 300),
      viral = clamp(s.stacks.viral, 0, 10),
      magnetic = clamp(s.stacks.magnetic, 0, 10),
      viralMulti = viral ? 2 + 0.25 * (viral - 1) : 1,
      magMulti = magnetic ? 2 + 0.25 * (magnetic - 1) : 1,
      activeStatusTypes = Object.entries(s.stacks || {}).filter(
        ([type, count]) => STATUS_EFFECT_TYPES.includes(type) && count > 0,
      ).length,
      aptitudeBonus = (b.galvanizedAptitude || 0) * activeStatusTypes,
      aptitudeRatio =
        weapon.ordinary > 0
          ? (weapon.ordinary + aptitudeBonus) / weapon.ordinary
          : 1 + aptitudeBonus;
    const suppliedParts = arr(weapon.damageParts),
      partSum = suppliedParts.reduce((total, part) => {
        for (const [type, value] of Object.entries(part.damage || {}))
          total[type] = (total[type] || 0) + value;
        return total;
      }, {}),
      partsMatch =
        suppliedParts.length &&
        Object.keys({ ...partSum, ...weapon.damage }).every(
          (type) => Math.abs((partSum[type] || 0) - (weapon.damage[type] || 0)) < 1e-7,
        ),
      damageParts = (
        partsMatch
          ? suppliedParts
          : [
              {
                id: a.id,
                name: a.name,
                damage: weapon.damage,
                shotType: a.shotType,
                falloff: a.falloff,
                baseTotal: weapon.baseTotal,
                criticalChance: weapon.cc,
                criticalMultiplier: weapon.cd,
                statusChance: weapon.sc,
                forcedProcs: arr(a.forcedProcs),
              },
            ]
      ).map((part) => ({
        ...part,
        criticalChance: part.criticalChance ?? weapon.cc,
        criticalMultiplier: part.criticalMultiplier ?? weapon.cd,
        statusChance: part.statusChance ?? weapon.sc,
        baseTotal: part.baseTotal ?? sum(part.damage || {}),
        forcedProcs: arr(part.forcedProcs),
      })),
      partFall = (part) =>
        part.falloff && part.falloff.end > part.falloff.start
          ? 1 -
            clamp(
              (s.distance - part.falloff.start) / (part.falloff.end - part.falloff.start),
              0,
              1,
            ) *
              part.falloff.reduction
          : 1,
      fall = partFall(damageParts[0]);
    const partProfile = (part) => {
      const aoe = part.shotType === 'AoE',
        partPoint = point && !aoe ? point : null,
        partBody = aoe
          ? 1
          : partPoint
            ? (partPoint.multiplier + (b.weakDamage || 0) * (partPoint.headshot ? 1.5 : 1)) *
              (partPoint.headshot ? 1 + (b.headshot || 0) : 1)
            : 1,
        partCc =
          part.criticalChance +
          (partPoint ? (a.critChance + (b.baseCrit || 0)) * (b.weakCrit || 0) : 0) +
          (!aoe ? 0.05 * clamp(s.stacks.puncture, 0, 5) : 0),
        partCd =
          part.criticalMultiplier +
          (aoe ? 0 : cold === 10 ? 1 : cold ? 0.1 + 0.05 * (Math.min(cold, 9) - 1) : 0),
        partTiers = criticalTiers(
          partCc,
          partCd,
          partPoint?.headcrit || 1,
          partPoint?.promotion || 0,
        ),
        mean = partTiers.reduce((n, t) => n + t.probability * t.multiplier, 0),
        chance = partTiers.reduce((n, t) => n + (t.tier > 0 ? t.probability : 0), 0),
        conditional = chance
          ? partTiers.reduce((n, t) => n + (t.tier > 0 ? t.probability * t.multiplier : 0), 0) /
            chance
          : 0;
      return { aoe, body: partBody, tiers: partTiers, mean, chance, conditional };
    };
    function defend(type, value, layer, proc = false, direct = false) {
      let v = value;
      if (direct) v *= aptitudeRatio;
      if (layer === 'overguard') v *= type === 'void' ? 1.5 : 1;
      else if (type !== 'true') v *= e.modifiers[type] ?? f.modifiers[type] ?? 1;
      if (layer === 'health') {
        if (type !== 'true') v *= 1 - reduction;
        v *= viralMulti;
      }
      if (layer === 'shield' || layer === 'overguard') v *= magMulti;
      return v * (e.damageMultiplier ?? 1);
    }
    const critCombos = damageParts.reduce(
        (combos, part) =>
          combos.flatMap((combo) =>
            partProfile(part).tiers.map((t) => ({
              tiers: [...combo.tiers, t.tier],
              multipliers: [...combo.multipliers, t.multiplier],
              probability: combo.probability * t.probability,
            })),
          ),
        [{ tiers: [], multipliers: [], probability: 1 }],
      ),
      projectileOutcomes = critCombos.map((combo) => {
        const components = damageParts.map((part, index) => {
          const profile = partProfile(part),
            partCrit = combo.multipliers[index] ?? profile.mean,
            incarnonPopup = /incarnon/i.test(a.name);
          return {
            id: part.id,
            name: part.name,
            shotType: part.shotType,
            damage: Object.fromEntries(
              ['health', 'shield', 'overguard'].map((layer) => {
                const baseDamage = Object.entries(part.damage).reduce(
                    (n, [type, d]) =>
                      n +
                      (layer === 'shield' && type === 'toxin'
                        ? 0
                        : defend(
                            type,
                            d * factionMultiplier * partFall(part),
                            layer,
                            false,
                            part.shotType !== 'AoE',
                          )),
                    0,
                  ),
                  popup = popupDamage(baseDamage * profile.body * partCrit, incarnonPopup);
                return [layer, popup];
              }),
            ),
          };
        });
        return {
          tier: Math.max(0, ...combo.tiers),
          tiers: combo.tiers,
          probability: combo.probability,
          critical: combo.tiers.some((t) => t > 0),
          components,
          damage: Object.fromEntries(
            ['health', 'shield', 'overguard'].map((layer) => [
              layer,
              components.reduce((total, part) => total + part.damage[layer], 0),
            ]),
          ),
        };
      });
    const layers = {};
    for (const layer of ['health', 'shield', 'overguard']) {
      const partHits = damageParts.map((part) => {
          const profile = partProfile(part),
            noncrit = Object.entries(part.damage).reduce(
              (n, [type, d]) =>
                n +
                (layer === 'shield' && type === 'toxin'
                  ? 0
                  : defend(
                      type,
                      d * factionMultiplier * profile.body * partFall(part),
                      layer,
                      false,
                      part.shotType !== 'AoE',
                    )),
              0,
            ),
            hit = Object.entries(part.damage).reduce(
              (n, [type, d]) =>
                n +
                (layer === 'shield' && type === 'toxin'
                  ? 0
                  : defend(
                      type,
                      d * factionMultiplier * profile.body * partFall(part) * profile.mean,
                      layer,
                    )),
              0,
            ),
            toxinBypass =
              layer === 'shield'
                ? Math.max(0, part.damage.toxin || 0) *
                  factionMultiplier *
                  profile.body *
                  profile.mean *
                  partFall(part) *
                  (1 - reduction) *
                  (e.modifiers.toxin ?? f.modifiers.toxin ?? 1) *
                  viralMulti *
                  (part.shotType === 'AoE' ? 1 : aptitudeRatio) *
                  (e.damageMultiplier ?? 1)
                : 0;
          return {
            id: part.id,
            name: part.name,
            shotType: part.shotType,
            noncrit: noncrit * weapon.ms,
            hit: hit * weapon.ms,
            toxinBypass: toxinBypass * weapon.ms,
          };
        }),
        noncrit = partHits.reduce((n, x) => n + x.noncrit, 0),
        expectedHit = partHits.reduce((n, x) => n + x.hit, 0);
      layers[layer] = stats.scalingUnknown
        ? { noncrit: null, hit: null, dps: null, sustained: null, components: [] }
        : {
            noncrit,
            hit: expectedHit,
            dps: expectedHit * weapon.rate,
            sustained: weapon.sustain == null ? null : expectedHit * weapon.sustain,
            components: partHits,
          };
    }
    const current = stats.overguard > 0 ? 'overguard' : stats.shield > 0 ? 'shield' : 'health',
      procs = [],
      duration = Math.max(0, 1 + (b.statusDuration || 0));
    const immune = e.statusImmune;
    const forcedProcs = weapon.forcedProcs || arr(a.forcedProcs),
      procTypes = new Set([
        ...Object.keys(weapon.damage),
        ...Object.keys(weapon.forced),
        ...forcedProcs.map((p) => PROCS[p] || p),
      ]);
    for (const type of procTypes) {
      const d = weapon.damage[type] || 0;
      const definition = rule.status[type],
        weight = weapon.total ? d / weapon.total : 0,
        componentData = damageParts.map((part) => {
          const partTotal = sum(part.damage || {}),
            partWeight = partTotal ? (part.damage?.[type] || 0) / partTotal : 0,
            random = part.statusChance * partWeight,
            forced = part.forcedProcs.filter((p) => (PROCS[p] || p) === type).length,
            profile = partProfile(part);
          return {
            part,
            profile,
            random,
            probability: procProbability(part.statusChance, partWeight),
            forced,
          };
        }),
        randomExpected = immune ? 0 : componentData.reduce((n, x) => n + x.random, 0),
        probability = immune ? 0 : 1 - componentData.reduce((n, x) => n * (1 - x.probability), 1),
        forcedPerProjectile = immune
          ? 0
          : (weapon.forced[type] || 0) + componentData.reduce((n, x) => n + x.forced, 0),
        perAttack = immune ? 0 : (randomExpected + forcedPerProjectile) * weapon.ms;
      const rate = weapon.sustain == null ? null : perAttack * weapon.sustain;
      if (!definition) {
        procs.push({
          type,
          weight,
          randomExpected,
          probability,
          forcedPerProjectile,
          rate,
          tick: 0,
          lifetime: 0,
          dps: 0,
          note: 'Debuff/control effect; set existing stacks explicitly.',
        });
        continue;
      }
      let elemental = 1;
      if (definition.element)
        elemental = Math.max(0, 1 + (weapon.elementBonuses?.[definition.element] || 0));
      const layer = current === 'shield' && type === 'toxin' ? 'health' : current;
      const typeStatusBonus =
          (b.statusDamage || 0) + (type === 'toxin' ? b.toxinStatusDamage || 0 : 0),
        tickWeight =
          componentData.reduce((n, x) => n + x.random + x.forced, 0) + (weapon.forced[type] || 0),
        tickTotal = componentData.reduce((total, x) => {
          const part = x.part,
            seed =
              (part.baseTotal || 0) * weapon.ordinary * factionMultiplier +
              (type === 'blast' ? 0 : 1),
            partTick = defend(
              definition.damageType,
              seed *
                definition.coefficient *
                factionMultiplier *
                elemental *
                Math.max(0, 1 + typeStatusBonus) *
                x.profile.body *
                x.profile.mean *
                partFall(part),
              layer,
              true,
            );
          return total + partTick * (x.random + x.forced);
        }, 0),
        weaponForcedTick = weapon.forced[type] || 0,
        tick = tickWeight
          ? (tickTotal +
              componentData.reduce((n, x) => {
                const part = x.part,
                  seed =
                    (part.baseTotal || 0) * weapon.ordinary * factionMultiplier +
                    (type === 'blast' ? 0 : 1);
                return (
                  n +
                  (defend(
                    definition.damageType,
                    seed *
                      definition.coefficient *
                      factionMultiplier *
                      elemental *
                      Math.max(0, 1 + typeStatusBonus) *
                      x.profile.body *
                      x.profile.mean *
                      partFall(part),
                    layer,
                    true,
                  ) *
                    weaponForcedTick) /
                    Math.max(1, componentData.length)
                );
              }, 0)) /
            tickWeight
          : componentData.reduce(
              (n, x) =>
                n +
                defend(
                  definition.damageType,
                  (x.part.baseTotal || 0) * weapon.ordinary * factionMultiplier +
                    (type === 'blast' ? 0 : 1),
                  layer,
                  true,
                ),
              0,
            ) / Math.max(1, componentData.length);
      let ticks =
        definition.ticks === 1
          ? 1
          : Math.max(
              0,
              Math.floor(definition.duration * duration) +
                (definition.ticks > definition.duration ? 1 : 0),
            );
      const lifetime = tick * ticks;
      let dps = rate == null ? null : rate * lifetime;
      const cap = e.statusCaps[type] || definition.cap;
      if (cap && rate != null) dps = Math.min(rate * definition.duration * duration, cap) * tick;
      procs.push({
        type,
        weight,
        randomExpected,
        probability,
        forcedPerProjectile,
        rate,
        tick,
        lifetime,
        dps,
        note:
          type === 'heat'
            ? 'Isolated-stack damage; external heat inheritance is excluded.'
            : type === 'blast'
              ? 'Single-target detonation; surrounding-enemy explosions are excluded.'
              : cap
                ? 'Stack cap applied.'
                : '',
      });
    }
    // Forced damaging procs can occur even if their damage type is absent.
    function addBleed(ratePerAttack, critMultiplier, label) {
      if (!ratePerAttack || immune) return;
      const def = rule.status.slash,
        rate = weapon.sustain == null ? null : ratePerAttack * weapon.sustain,
        tick = defend(
          'true',
          (weapon.baseTotal * weapon.ordinary * factionMultiplier + 1) *
            def.coefficient *
            factionMultiplier *
            Math.max(0, 1 + (b.statusDamage || 0)) *
            body *
            critMultiplier *
            fall,
          current,
          true,
        ),
        ticks = Math.floor(6 * duration);
      procs.push({
        type: label,
        weight: null,
        randomExpected: null,
        probability: null,
        forcedPerProjectile: ratePerAttack / Math.max(weapon.ms, 0.0001),
        rate,
        tick,
        lifetime: tick * ticks,
        dps: rate == null ? null : rate * tick * ticks,
        note: 'Triggered Slash proc; separate from weighted random statuses.',
      });
    }
    if (b.hunterMunitions)
      addBleed(
        weapon.ms * criticalProbability * b.hunterMunitions,
        criticalMean,
        'hunter munitions',
      );
    const impactCount =
      weapon.ms *
      ((weapon.sc * (weapon.damage.impact || 0)) / Math.max(weapon.total, 0.0001) +
        forcedProcs.filter((p) => p === 'impact').length);
    if (b.impactBleed)
      addBleed(
        impactCount * Math.min(1, b.impactBleed * (weapon.rate < 2.5 ? 2 : 1)),
        crit,
        'impact-triggered bleed',
      );
    if (immune) notes.push('Enemy is status immune.');
    if (s.stacks.magnetic > 0)
      notes.push(
        'Magnetic shield/Overguard-break damage is excluded from this fixed-defense comparison.',
      );
    if (stats.overguard > 0 && (viral || s.stacks.corrosive || s.stacks.heat || cold))
      notes.push(
        'Health-layer debuffs are previewed after Overguard; Overguard itself is unaffected by armor and Viral.',
      );
    const toxinBypass =
      current === 'shield'
        ? layers.shield.components.reduce((n, x) => n + x.toxinBypass, 0) * (weapon.sustain || 0)
        : 0;
    if (stats.scalingUnknown)
      for (const p of procs) {
        p.tick = null;
        p.lifetime = null;
        p.dps = null;
      }
    const statusDps = procs.some((p) => p.dps == null)
        ? null
        : procs.reduce((n, p) => n + p.dps, 0),
      unique = [...new Set(notes)];
    const complete = !unique.length && !weapon.build.errors.length && weapon.sustain != null;
    return {
      enemy: e,
      faction: f,
      stats,
      criticalChance: cc,
      criticalMultiplier: cd,
      weakpoint: point,
      locationAvailable: s.location === 'body' || !!point,
      layers,
      current,
      procs,
      statusDps,
      toxinBypass,
      crit: tiers,
      projectileOutcomes,
      factionMultiplier,
      body,
      fall,
      reduction,
      notes: unique,
      complete,
      combined: complete ? layers[current].sustained + toxinBypass + statusDps : null,
    };
  }
  const TTK_LOCATIONS = [
    { id: 'head', name: '100% head/weak', head: 1, headHits: 4, cycle: 4 },
    { id: 'mix25', name: '75% head/weak : 25% body', head: 0.75, headHits: 3, cycle: 4 },
    { id: 'mix50', name: '50% head/weak : 50% body', head: 0.5, headHits: 2, cycle: 4 },
    { id: 'mix75', name: '25% head/weak : 75% body', head: 0.25, headHits: 1, cycle: 4 },
    { id: 'mix110', name: '1 head/weak : 10 body', head: 1 / 11, headHits: 1, cycle: 11 },
    { id: 'body', name: '100% body', head: 0, headHits: 0, cycle: 4 },
  ];
  function ttkGraphSVG(locations) {
    const colors = ['#7cddcf', '#ffad68', '#b89aff', '#f7d37a', '#9fb8ff', '#ff858c'],
      width = 760,
      height = 300,
      pad = { l: 54, r: 18, t: 14, b: 112 },
      plotW = width - pad.l - pad.r,
      plotH = height - pad.t - pad.b;
    let maxTime = 0.1,
      maxValue = 1;
    for (const line of locations)
      for (const point of line.timeline || []) {
        if (Number.isFinite(point.time)) maxTime = Math.max(maxTime, point.time);
        if (Number.isFinite(point.remaining)) maxValue = Math.max(maxValue, point.remaining);
      }
    const pointsFor = (line) => {
      const pts = line.timeline || [];
      if (!pts.length) return '';
      const stride = Math.max(1, Math.ceil(pts.length / 180)),
        reduced = pts.filter((_, i) => i % stride === 0 || i === pts.length - 1);
      if (line.ttk != null && !reduced.some((p) => Math.abs(p.time - line.ttk) < 1e-8))
        reduced.push({ time: line.ttk, remaining: 0 });
      return reduced
        .map(
          (p) =>
            `${(pad.l + (p.time / maxTime) * plotW).toFixed(1)},${(pad.t + (1 - p.remaining / maxValue) * plotH).toFixed(1)}`,
        )
        .join(' ');
    };
    const grid = [0, 0.25, 0.5, 0.75, 1]
      .map((frac) => {
        const y = pad.t + frac * plotH,
          value = maxValue * (1 - frac);
        return `<line x1="${pad.l}" y1="${y}" x2="${width - pad.r}" y2="${y}" stroke="#2a3749"/><text x="${pad.l - 7}" y="${y + 4}" text-anchor="end" fill="#94a3b8" font-size="10">${fmt(value, 0)}</text>`;
      })
      .join('');
    const lines = locations
      .map((line, i) => {
        const strip = line.timeline?.find((p) => p.armorStripped);
        const marker = strip
          ? `<line x1="${(pad.l + (strip.time / maxTime) * plotW).toFixed(1)}" y1="${pad.t}" x2="${(pad.l + (strip.time / maxTime) * plotW).toFixed(1)}" y2="${pad.t + plotH}" stroke="#fbbf24" stroke-width="1.5" stroke-dasharray="4 3"><title>Armor stripped at ${fmt(strip.time, 3)} s; remains stripped for the rest of this simulation</title></line><circle cx="${(pad.l + (strip.time / maxTime) * plotW).toFixed(1)}" cy="${(pad.t + (1 - strip.remaining / maxValue) * plotH).toFixed(1)}" r="4" fill="#fbbf24"><title>Armor stripped at ${fmt(strip.time, 3)} s</title></circle>`
          : '';
        return `${marker}<polyline points="${pointsFor(line)}" fill="none" stroke="${colors[i]}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"><title>${escape(line.name)} · ${line.killed ? fmt(line.ttk, 3) + ' s' : 'not depleted'}${strip ? ' · armor stripped at ' + fmt(strip.time, 3) + ' s' : ''}</title></polyline>`;
      })
      .join('');
    const legend =
        locations
          .map(
            (line, i) => `<span><i style="background:${colors[i]}"></i>${escape(line.name)}</span>`,
          )
          .join('') + '<span><i style="background:#fbbf24"></i>Armor stripped (persistent)</span>',
      axisY = pad.t + plotH,
      endpoints = locations
        .map((line, i) => {
          const endTime = line.ttk ?? line.timeline?.at(-1)?.time ?? maxTime,
            x = pad.l + (Math.max(0, Math.min(maxTime, endTime)) / maxTime) * plotW,
            label = escape(
              line.name +
                ' · ' +
                (line.killed
                  ? fmt(line.ttk, 2) + ' s'
                  : 'not depleted · ' + fmt(endTime, 2) + ' s'),
            ),
            anchor = x > width * 0.78 ? 'end' : x < pad.l + 90 ? 'start' : 'middle',
            textX = anchor === 'end' ? x - 3 : anchor === 'start' ? x + 3 : x;
          return `<line x1="${x}" y1="${axisY - 3}" x2="${x}" y2="${axisY + 4}" stroke="${colors[i]}" stroke-width="2"/><text x="${textX}" y="${axisY + 17 + i * 13}" text-anchor="${anchor}" fill="${colors[i]}" font-size="9">${label}</text>`;
        })
        .join('');
    return `<div class="ttk-graph-wrap" role="button" tabindex="0" title="Click to enlarge graph" aria-label="Open larger time-to-kill graph"><svg class="ttk-graph" viewBox="0 0 ${width} ${height}" role="img" aria-label="Remaining enemy effective health over time for six hit-location scenarios with endpoint times">${grid}<line x1="${pad.l}" y1="${axisY}" x2="${width - pad.r}" y2="${axisY}" stroke="#94a3b8"/>${endpoints}<text x="${pad.l}" y="${height - 8}" fill="#94a3b8" font-size="10">0 s</text><text x="${width - pad.r}" y="${height - 8}" text-anchor="end" fill="#94a3b8" font-size="10">${fmt(maxTime, 2)} s</text><text x="12" y="${pad.t + plotH / 2}" transform="rotate(-90 12 ${pad.t + plotH / 2})" text-anchor="middle" fill="#94a3b8" font-size="10">Remaining effective health</text>${lines}</svg><div class="ttk-legend">${legend}</div></div>`;
  }
  function compactTtkResult(result) {
    return {
      limited: result.limited,
      rows: result.rows,
      locations: result.locations.map((x) => ({
        name: x.name,
        ttk: x.ttk,
        killed: x.killed,
        projectiles: x.projectiles,
        unavailable: x.unavailable,
        timeline: arr(x.timeline).map((p) => ({
          time: p.time,
          remaining: p.remaining,
          armorStripped: p.armorStripped,
          armorStripChance: p.armorStripChance,
        })),
      })),
    };
  }
  function directTargetProfile(weapon) {
    const damageParts = arr(weapon.damageParts).filter(
        (part) => !(part.shotType === 'AoE' && part.componentOf),
      ),
      damage = damageParts.reduce((total, part) => {
        for (const [type, value] of Object.entries(part.damage || {}))
          total[type] = (total[type] || 0) + value;
        return total;
      }, {});
    return {
      ...weapon,
      damage,
      total: sum(damage),
      damageParts,
      forcedProcs: damageParts.flatMap((part) => arr(part.forcedProcs)),
    };
  }
  function ttkProjectileSchedule(weapon, limit = 4000) {
    const rate = weapon.rate,
      ms = Math.max(0, weapon.ms);
    if (!(rate > 0) || !(ms > 0)) return [];
    const pellets = Math.ceil(ms),
      interval = 1 / rate,
      rows = [];
    let time = 0,
      shot = 0,
      mag = weapon.shots;
    while (rows.length < limit) {
      shot++;
      for (let pellet = 0; pellet < pellets && rows.length < limit; pellet++) {
        const weight = Math.min(1, Math.max(0, ms - pellet));
        if (weight > 0) rows.push({ time, shot, pellet: pellet + 1, pelletWeight: weight });
      }
      time += interval;
      if (mag != null && weapon.reload != null && shot % mag === 0) time += weapon.reload;
    }
    return rows;
  }
  function simulateTtk(db, state, weapon, enemy, limit = 4000) {
    const rows = ttkProjectileSchedule(weapon, limit);
    if (!rows.length) return { locations: [], rows: [], limited: false };
    const corCap = corrosiveStackCap(state, weapon, enemy),
      initialPools = enemyStats(
        db,
        enemy,
        auraEnemyScenario(db, state, { ...state.scenario, corrosiveCap: corCap }),
      );
    if (
      initialPools.scalingUnknown ||
      initialPools.health == null ||
      initialPools.shield == null ||
      initialPools.armor == null
    )
      return {
        locations: TTK_LOCATIONS.map((x) => ({
          ...x,
          rows: [],
          ttk: null,
          projectiles: 0,
          killed: false,
          unavailable: true,
        })),
        rows: [],
        limited: false,
        unavailable: true,
      };
    const one = { ...directTargetProfile(weapon), ms: 1, sustain: 1 },
      statusDurationFactor = Math.max(0, 1 + (weapon.bonus?.statusDuration || 0)),
      duration = 6 * statusDurationFactor,
      statusDefinitions = ruleOf(db).status;
    const reference = calculateEnemy(db, state, one, enemy),
      corProc = reference.procs.find((p) => p.type === 'corrosive'),
      heatProc = reference.procs.find((p) => p.type === 'heat');
    const corProb = clamp(corProc?.probability || 0, 0, 1),
      heatProb = clamp(heatProc?.probability || 0, 0, 1),
      forcedCor = corProc?.forcedPerProjectile || 0,
      forcedHeat = heatProc?.forcedPerProjectile || 0,
      hitCache = new Map();
    const startCor = Math.floor(state.scenario.stacks.corrosive || 0),
      startHeat = (state.scenario.stacks.heat || 0) > 0;
    const locResults = TTK_LOCATIONS.map((location) => {
      let corrosion = Array.from({ length: corCap + 1 }, (_, i) =>
          i === Math.min(corCap, startCor) ? 1 : 0,
        ),
        heatEvents = startHeat ? [{ time: 0, probability: 1 }] : [],
        pools = { ...initialPools },
        killedAt = null,
        permanentStripChance = initialPools.baseArmor > 0 && initialPools.armor <= 1e-8 ? 1 : 0;
      const out = [],
        timeline = [],
        dotQueue = [],
        statusActive = {},
        trackedStacks = ['viral', 'magnetic', 'cold', 'puncture'],
        stackEvents = Object.fromEntries(
          trackedStacks.map((type) => [
            type,
            (state.scenario.stacks[type] || 0) > 0
              ? [{ time: 0, count: state.scenario.stacks[type] }]
              : [],
          ]),
        );
      const stackCap = (type) =>
          Math.min(
            enemy.statusCaps?.[type] ?? statusDefinitions[type]?.cap ?? 100,
            type === 'puncture' ? 5 : 10,
          ),
        stackCountsAt = (time) =>
          Object.fromEntries(
            trackedStacks.map((type) => [
              type,
              Math.min(
                stackCap(type),
                (stackEvents[type] || []).reduce(
                  (n, event) =>
                    n +
                    (time - event.time <
                    Math.max(0, (statusDefinitions[type]?.duration || 6) * statusDurationFactor)
                      ? event.count
                      : 0),
                  0,
                ),
              ),
            ]),
          ),
        addStack = (type, count, time) => {
          const events = stackEvents[type];
          if (!events || count <= 0) return;
          const duration = Math.max(
            0,
            (statusDefinitions[type]?.duration || 6) * statusDurationFactor,
          );
          for (let i = events.length - 1; i >= 0; i--)
            if (time - events[i].time >= duration) events.splice(i, 1);
          events.push({ time, count });
          let excess = events.reduce((n, event) => n + event.count, 0) - stackCap(type);
          for (const event of events) {
            if (excess <= 0) break;
            const remove = Math.min(excess, event.count);
            event.count -= remove;
            excess -= remove;
          }
          for (let i = events.length - 1; i >= 0; i--)
            if (events[i].count <= 1e-9) events.splice(i, 1);
        };
      const headLocation = enemy.weakpoints.some((p) => p.headshot) ? 'head' : 'weak',
        dotTypes = new Set(['slash', 'heat', 'gas', 'electricity', 'toxin']),
        dotCache = new Map();
      const remaining = () =>
        Math.max(0, (pools.health || 0) + (pools.shield || 0) + (pools.overguard || 0));
      const snapshot = (time, kind, label, armorStripped = permanentStripChance >= 1 - 1e-9) =>
        timeline.push({
          time,
          remaining: remaining(),
          health: pools.health || 0,
          shield: pools.shield || 0,
          overguard: pools.overguard || 0,
          kind,
          label,
          armorStripped,
          armorStripChance: permanentStripChance,
        });
      const stripProbability = (time) => {
        if (initialPools.baseArmor <= 0) return 0;
        let probability = 0;
        const reduction = heatStripAt(time);
        for (let c = 0; c <= corCap; c++) {
          const mass = corrosion[c] || 0;
          if (!mass) continue;
          const stats = enemyStats(
            db,
            enemy,
            auraEnemyScenario(db, state, {
              ...state.scenario,
              corrosiveCap: corCap,
              stacks: { ...state.scenario.stacks, corrosive: c, heat: reduction > 0 ? 1 : 0 },
              heatStripOverride: reduction,
            }),
          );
          if (stats.armor <= 1e-8) probability += mass;
        }
        return probability;
      };
      snapshot(0, 'start', 'Initial defense pools');
      const dotDamageAt = (type, time) => {
        const isBypass = type === 'slash' || type === 'toxin',
          active = pools.overguard > 0 ? 'overguard' : pools.shield > 0 ? 'shield' : 'health';
        if (active === 'overguard') return { layer: 'health', damage: 0 };
        const layer = isBypass ? 'health' : active,
          heatChance = heatChanceAt(time),
          heatReduction = heatStripAt(time);
        const target = layer === 'health' ? { ...enemy, shield: 0, eximusShield: 0 } : enemy;
        const evalFor = (hitLocation, c, hot) => {
          const dynamic = stackCountsAt(time),
            key = [
              type,
              layer,
              hitLocation,
              c,
              hot ? 1 : 0,
              heatReduction,
              ...trackedStacks.map((t) => dynamic[t]),
            ].join('|');
          if (dotCache.has(key)) return dotCache.get(key);
          const s = {
              ...state,
              scenario: {
                ...state.scenario,
                location: hitLocation,
                eximus: false,
                stacks: {
                  ...state.scenario.stacks,
                  ...dynamic,
                  corrosive: c,
                  heat: hot || heatReduction > 0 ? 1 : 0,
                },
                heatStripOverride: heatReduction,
              },
            },
            r = calculateEnemy(db, s, one, target),
            value = r.procs.find((p) => p.type === type)?.tick || 0;
          dotCache.set(key, value);
          return value;
        };
        let tick = 0;
        for (let c = 0; c <= corCap; c++) {
          const cp = corrosion[c] || 0;
          if (!cp) continue;
          for (const [hot, hp] of [
            [false, 1 - heatChance],
            [true, heatChance],
          ])
            if (hp)
              tick +=
                cp *
                hp *
                (evalFor('body', c, hot) * (1 - location.head) +
                  evalFor(headLocation, c, hot) * location.head);
        }
        return { layer, damage: tick };
      };
      const processDotsUntil = (time) => {
        dotQueue.sort((a, b) => a.time - b.time);
        while (dotQueue.length && dotQueue[0].time <= time + 1e-9 && killedAt == null) {
          const event = dotQueue.shift(),
            activeCount = statusActive[event.type] || 0;
          if (activeCount <= 0) continue;
          const result = dotDamageAt(event.type, event.time),
            damage = result.damage * event.weight;
          pools[result.layer] = Math.max(0, (pools[result.layer] || 0) - damage);
          if (out.length) {
            const latest = out[out.length - 1];
            latest.dotDamage += damage;
            latest.health = pools.health || 0;
            latest.shield = pools.shield || 0;
            latest.overguard = pools.overguard || 0;
          }
          snapshot(event.time, 'dot', event.type + ' tick');
          if (remaining() <= 1e-9) killedAt = event.time;
          if (event.tick === event.totalTicks)
            statusActive[event.type] = Math.max(0, activeCount - event.weight);
        }
      };
      const heatChanceAt = (t) =>
        1 -
        heatEvents
          .filter((x) => t - x.time < duration)
          .reduce((p, x) => p * (1 - x.probability), 1);
      const heatStripAt = (t) => {
        const values = heatEvents
          .map((event) => {
            const age = t - event.time;
            if (age < 0) return { probability: event.probability, reduction: 0 };
            let reduction = 0;
            if (age < duration) {
              const step = Math.min(4, Math.floor((age + 1e-10) / (duration / 12)));
              reduction = [0, 0.15, 0.3, 0.4, 0.5][step];
            } else if (age < 2 * duration) {
              const step = Math.min(4, Math.floor((age - duration + 1e-10) / (duration / 4)));
              reduction = [0.5, 0.4, 0.3, 0.15, 0][step];
            }
            return { probability: event.probability, reduction };
          })
          .filter((x) => x.reduction > 0);
        const levels = [...new Set(values.map((x) => x.reduction))].sort((a, b) => a - b);
        let expected = 0,
          previous = 0;
        for (const level of levels) {
          const chance =
            1 -
            values.filter((x) => x.reduction >= level).reduce((p, x) => p * (1 - x.probability), 1);
          expected += (level - previous) * chance;
          previous = level;
        }
        return expected;
      };
      const damageAt = (hitLocation, layer, time) => {
        let value = 0,
          bypass = 0,
          arm = 0,
          stripped = 0;
        const components = new Map(),
          heatChance = heatChanceAt(time),
          heatReduction = heatStripAt(time),
          dynamic = stackCountsAt(time);
        for (let c = 0; c <= corCap; c++) {
          const cp = corrosion[c] || 0;
          if (!cp) continue;
          for (const [hot, hp] of [
            [false, 1 - heatChance],
            [true, heatChance],
          ]) {
            if (!hp) continue;
            const key =
              hitLocation +
              '|' +
              layer +
              '|' +
              c +
              '|' +
              (hot ? 1 : 0) +
              '|' +
              heatReduction +
              '|' +
              trackedStacks.map((t) => dynamic[t]).join('|');
            let hit = hitCache.get(key);
            if (!hit) {
              const scenario = {
                  ...state,
                  scenario: {
                    ...state.scenario,
                    location: hitLocation,
                    stacks: {
                      ...state.scenario.stacks,
                      ...dynamic,
                      corrosive: c,
                      heat: hot || heatReduction > 0 ? 1 : 0,
                    },
                    heatStripOverride: heatReduction,
                  },
                },
                r = calculateEnemy(db, scenario, one, enemy),
                partHits = arr(r.layers[layer]?.components);
              hit = {
                damage: r.layers[layer]?.hit || 0,
                bypass: layer === 'shield' ? r.toxinBypass : 0,
                armor: r.stats.armor || 0,
                baseArmor: r.stats.baseArmor || 0,
                components: partHits.map((part) => ({
                  ...part,
                  damage: part.hit + (layer === 'shield' ? part.toxinBypass || 0 : 0),
                })),
              };
              hitCache.set(key, hit);
            }
            value += hit.damage * cp * hp;
            bypass += hit.bypass * cp * hp;
            arm += hit.armor * cp * hp;
            if (hit.baseArmor > 0 && hit.armor <= 1e-8) stripped += cp * hp;
            for (const part of hit.components) {
              const id = part.id || part.name || part.shotType || 'component',
                entry = components.get(id) || {
                  id,
                  name: part.name || 'Attack component',
                  shotType: part.shotType,
                  damage: 0,
                };
              entry.damage += part.damage * cp * hp;
              components.set(id, entry);
            }
          }
        }
        return {
          damage: value,
          bypass,
          armor: arm,
          stripChance: stripped,
          components: [...components.values()],
        };
      };
      for (let index = 0; index < rows.length && killedAt == null; index++) {
        const projectile = rows[index];
        processDotsUntil(projectile.time);
        if (killedAt != null) break;
        const active = pools.overguard > 0 ? 'overguard' : pools.shield > 0 ? 'shield' : 'health',
          headshot = location.headHits > 0 && index % (location.cycle || 4) < location.headHits,
          hitLocation = headshot ? headLocation : 'body',
          hit = damageAt(hitLocation, active, projectile.time),
          damage = hit.damage * projectile.pelletWeight,
          bypass = active === 'shield' ? hit.bypass * projectile.pelletWeight : 0,
          componentDamage = hit.components.map((part) => ({
            ...part,
            damage: part.damage * projectile.pelletWeight,
          }));
        pools[active] = Math.max(0, (pools[active] || 0) - damage);
        if (bypass) pools.health = Math.max(0, pools.health - bypass);
        const armorNow = hit.armor;
        out.push({
          time: projectile.time,
          damage: damage + bypass,
          components: componentDamage,
          dotDamage: 0,
          hitLocation,
          armor: armorNow,
          armorStripChance: permanentStripChance,
          armorStripped: permanentStripChance >= 1 - 1e-9,
          health: pools.health,
          shield: pools.shield,
          overguard: pools.overguard,
          active,
          killed: pools.health <= 0 && pools.shield <= 0 && pools.overguard <= 0,
        });
        snapshot(projectile.time, 'projectile', 'Projectile ' + (index + 1));
        const procScale = active === 'overguard' ? 0 : projectile.pelletWeight,
          applyCorrosive = (p) => {
            if (p <= 0) return;
            const next = Array(corCap + 1).fill(0);
            for (let c = 0; c <= corCap; c++) {
              const probability = corrosion[c] || 0;
              next[c] += probability * (1 - p);
              next[Math.min(corCap, c + 1)] += probability * p;
            }
            corrosion = next;
          };
        if (procScale) {
          const forcedStacks = forcedCor * procScale;
          for (let i = 0; i < Math.floor(forcedStacks); i++) applyCorrosive(1);
          applyCorrosive(forcedStacks % 1);
          applyCorrosive(corProb * procScale);
        }
        if (active !== 'overguard') {
          if (startHeat) heatEvents.push({ time: projectile.time, probability: 1 });
          else {
            const heatChance =
              1 - (1 - Math.min(1, forcedHeat * procScale)) * (1 - heatProb * procScale);
            if (heatChance) heatEvents.push({ time: projectile.time, probability: heatChance });
          }
        }
        if (procScale && !enemy.statusImmune) {
          const dynamic = stackCountsAt(projectile.time),
            statusState = {
              ...state,
              scenario: {
                ...state.scenario,
                location: 'body',
                stacks: {
                  ...state.scenario.stacks,
                  ...dynamic,
                  corrosive: startCor,
                  heat: heatChanceAt(projectile.time) ? 1 : 0,
                },
              },
            },
            statusResult = calculateEnemy(db, statusState, one, enemy);
          for (const proc of statusResult.procs) {
            const definition = statusDefinitions[proc.type],
              applications =
                Math.max(0, (proc.randomExpected || 0) + (proc.forcedPerProjectile || 0)) *
                procScale;
            if (!applications) continue;
            if (stackEvents[proc.type]) addStack(proc.type, applications, projectile.time);
            if (!dotTypes.has(proc.type)) continue;
            if (!definition || !(definition.ticks > 0) || !(definition.duration > 0)) continue;
            const cap = enemy.statusCaps?.[proc.type] || definition.cap || 100,
              activeCount = statusActive[proc.type] || 0,
              weight = Math.min(applications, Math.max(0, cap - activeCount));
            if (!weight) continue;
            statusActive[proc.type] = activeCount + weight;
            const interval = (definition.duration * statusDurationFactor) / definition.ticks;
            for (let tick = 1; tick <= definition.ticks; tick++)
              dotQueue.push({
                time: projectile.time + interval * tick,
                type: proc.type,
                tick,
                totalTicks: definition.ticks,
                weight,
              });
          }
        }
        permanentStripChance = Math.max(permanentStripChance, stripProbability(projectile.time));
        const stripRow = out[out.length - 1];
        stripRow.armorStripChanceAfter = permanentStripChance;
        stripRow.armorStrippedAfter = permanentStripChance >= 1 - 1e-9;
        if (stripRow.armorStrippedAfter && !stripRow.armorStripped) {
          snapshot(projectile.time, 'armor-strip', 'Armor permanently stripped');
        }
        if (out[out.length - 1].killed) {
          killedAt = projectile.time;
          break;
        }
      }
      if (killedAt == null && dotQueue.length) processDotsUntil(Infinity);
      return {
        ...location,
        rows: out,
        timeline,
        ttk: killedAt,
        projectiles: out.length,
        killed: killedAt != null,
      };
    });
    const rowCount = Math.max(...locResults.map((x) => x.rows.length), 0),
      tableRows = Array.from({ length: rowCount }, (_, i) => ({
        projectile: i + 1,
        ...rows[i],
        scenarios: locResults.map((x) => x.rows[i] || null),
      }));
    return {
      locations: locResults,
      rows: tableRows,
      limited: locResults.some((x) => !x.killed) && rows.length >= limit,
    };
  }
  function validateDatabase(db) {
    const errors = [];
    for (const c of CATEGORIES) {
      const d = db[c];
      if (!d || d.category !== c || d.schemaVersion !== 1 || !Array.isArray(d.records)) {
        errors.push(c + ': expected category, schemaVersion 1 and records array.');
        continue;
      }
      const ids = new Set();
      for (const r of d.records) {
        if (
          !r ||
          typeof r !== 'object' ||
          typeof r.id !== 'string' ||
          !r.id ||
          typeof r.name !== 'string'
        )
          errors.push(c + ': every record requires a string id and name.');
        if (ids.has(r.id)) errors.push(c + ': duplicate ID ' + r.id);
        ids.add(r.id);
      }
    }
    for (const c of ['weapons', 'mods', 'arcanes', 'enemies'])
      for (const r of records(db, c)) {
        if (r.image && safeImagePath(r.image) !== r.image)
          errors.push(r.name + ': image must be a relative path within images/.');
        if (r.incarnonImage && safeImagePath(r.incarnonImage) !== r.incarnonImage)
          errors.push(r.name + ': Incarnon image must be a relative path within images/.');
      }
    for (const path of Object.values(ruleOf(db)?.statusIcons || {}))
      if (safeImagePath(path) !== path) errors.push('Invalid status icon path.');
    if (errors.length) return errors;
    for (const e of records(db, 'incarnon-evolutions')) {
      if (
        !Array.isArray(e.limitations) ||
        e.limitations.some((n) => typeof n !== 'string') ||
        !Number.isInteger(e.tier) ||
        e.tier < 1 ||
        e.tier > 5
      )
        errors.push(e.name + ': invalid tier or limitations.');
      if (
        e.nonDamageEffects &&
        (!Array.isArray(e.nonDamageEffects) ||
          e.nonDamageEffects.some((n) => typeof n !== 'string'))
      )
        errors.push(e.name + ': utility effects must be text strings.');
      if (e.variantValues)
        for (const [variant, values] of Object.entries(e.variantValues)) {
          if (
            !records(db, 'weapons').some(
              (w) => (w.incarnonVariant || w.name) === variant && w.family === e.family,
            )
          )
            errors.push(e.name + ': unknown table variant ' + variant);
          if (!values || typeof values !== 'object' || Array.isArray(values))
            errors.push(e.name + ': invalid variant value table.');
          else
            for (const value of Object.values(values))
              if (
                !value ||
                typeof value.value !== 'number' ||
                !Number.isFinite(value.value) ||
                typeof value.unit !== 'string'
              )
                errors.push(e.name + ': invalid source table value.');
        }
    }
    if (errors.length) return errors;
    if (!records(db, 'weapons').length || !records(db, 'enemies').length)
      errors.push('Keep at least one weapon and one enemy.');
    const numeric = (v, label, min = 0) => {
      if (typeof v !== 'number' || !Number.isFinite(v) || v < min)
        errors.push(label + ': invalid number.');
    };
    const effectNames = new Set([
      'damage',
      'critChance',
      'critDamage',
      'statusChance',
      'statusDamage',
      'statusDuration',
      'toxinStatusDamage',
      'corrosiveCapBonus',
      'auraArmorReduction',
      'auraShieldReduction',
      'ammoEfficiency',
      'fireRate',
      'reload',
      'magazine',
      'multishot',
      'weakCrit',
      'weakDamage',
      'headshot',
      'lockMultishot',
      'flatCrit',
      'comboCrit',
      'comboStatus',
      'conditionDamage',
      'hunterMunitions',
      'impactBleed',
      'baseDamage',
      'baseMagazine',
      'baseMultishot',
      'baseAmmoSet',
      'directStatusDamage',
      'flatStatus',
      'baseCrit',
      'baseCritDamage',
      'baseStatus',
      'windUp',
      'heavyEfficiency',
      'initialCombo',
      'comboDuration',
      'punchThrough',
      'range',
      'ammo',
      'projectileSpeed',
      'recoil',
      'zoom',
      'accuracy',
      'slideCrit',
      'extraCombo',
      'negativeCombo',
      'finisher',
    ]);
    const effects = (es, label) => {
      if (!Array.isArray(es)) {
        errors.push(label + ': effects must be an array.');
        return;
      }
      for (const e of es) {
        if (
          !e ||
          typeof e.stat !== 'string' ||
          typeof e.value !== 'number' ||
          !Number.isFinite(e.value) ||
          (!effectNames.has(e.stat) &&
            !/^element:(impact|puncture|slash|heat|cold|electricity|toxin|radiation|viral|corrosive|magnetic|gas|blast)$/.test(
              e.stat,
            ) &&
            !/^faction:[a-z0-9-]+$/.test(e.stat))
        )
          errors.push(label + ': invalid effect.');
      }
    };
    for (const w of records(db, 'weapons')) {
      if (!Array.isArray(w.attacks) || !w.attacks.length) {
        errors.push(w.name + ': requires attacks.');
        continue;
      }
      if (
        !Array.isArray(w.tags) ||
        !Array.isArray(w.traits) ||
        !Array.isArray(w.polarities) ||
        !Array.isArray(w.limitations)
      )
        errors.push(w.name + ': tags, traits, polarities and limitations must be arrays.');
      for (const p of [...arr(w.polarities), w.exilusPolarity || '', w.stancePolarity || ''])
        if (p && !POLARITIES.includes(p))
          errors.push(w.name + ': unsupported weapon polarity ' + p + '.');
      if (typeof w.family !== 'string' || typeof w.category !== 'string')
        errors.push(w.name + ': requires family and category.');
      for (const a of w.attacks) {
        if (!a.damage || typeof a.damage !== 'object') errors.push(w.name + ': invalid damage.');
        else
          for (const [t, n] of Object.entries(a.damage)) {
            if (!TYPES.includes(t)) errors.push(w.name + ': unsupported damage type ' + t);
            numeric(n, w.name + ' ' + t);
          }
        for (const field of [
          'critChance',
          'critMultiplier',
          'statusChance',
          'fireRate',
          'multishot',
        ])
          numeric(a[field], w.name + ' ' + field);
      }
    }
    for (const w of records(db, 'weapons'))
      for (const a of arr(w.attacks))
        if (
          a.componentOf &&
          (!w.attacks.some((parent) => parent.id === a.componentOf) || a.componentOf === a.id)
        )
          errors.push(w.name + ' ' + a.name + ': invalid component parent.');
    for (const a of records(db, 'arcanes')) {
      if (!Number.isInteger(a.maxStacks) || a.maxStacks < 1)
        errors.push(a.name + ': maxStacks must be a positive integer.');
      if (!['Common', 'Uncommon', 'Rare', 'Legendary'].includes(a.rarity))
        errors.push(a.name + ': arcane rarity must be Common, Uncommon, Rare or Legendary.');
    }
    for (const shard of records(db, 'archon-shards')) {
      if (!['Crimson', 'Amber', 'Azure', 'Topaz', 'Violet', 'Emerald'].includes(shard.color))
        errors.push(shard.name + ': invalid shard color.');
      effects(shard.effects, shard.name);
      if (
        !Number.isInteger(shard.maxStacks) ||
        shard.maxStacks < 1 ||
        !Number.isInteger(shard.tauMaxStacks) ||
        shard.tauMaxStacks < shard.maxStacks
      )
        errors.push(shard.name + ': invalid shard stack caps.');
      if (!Array.isArray(shard.weaponCategories) || !Array.isArray(shard.limitations))
        errors.push(shard.name + ': weaponCategories and limitations must be arrays.');
      for (const effect of arr(shard.effects)) {
        if (effect.tauValue != null && !Number.isFinite(effect.tauValue))
          errors.push(shard.name + ': invalid Tauforged effect value.');
        if (
          effect.perOtherShard != null &&
          (!Number.isFinite(effect.perOtherShard) || !Array.isArray(effect.countColors))
        )
          errors.push(shard.name + ': invalid per-shard effect scaling.');
      }
    }
    for (const shard of records(db, 'archon-shards')) {
      for (const key of ['maximumEnergyBonus', 'tauMaximumEnergyBonus'])
        if (shard[key] != null && (!Number.isFinite(shard[key]) || shard[key] < 0))
          errors.push(shard.name + ': invalid ' + key + '.');
      for (const effect of arr(shard.effects))
        if (
          effect.doubleAboveEnergy != null &&
          (!Number.isFinite(effect.doubleAboveEnergy) || effect.doubleAboveEnergy < 0)
        )
          errors.push(shard.name + ': invalid Energy threshold.');
    }
    const fids = new Set(records(db, 'factions').map((f) => f.id));
    for (const e of records(db, 'enemies')) {
      if (!fids.has(e.factionId)) errors.push(e.name + ': faction reference not found.');
      for (const k of ['health', 'shield', 'armor'])
        if (e[k] != null) numeric(e[k], e.name + ' ' + k);
      if (e.baseLevel != null) numeric(e.baseLevel, e.name + ' base level', 1);
      if (!Array.isArray(e.weakpoints) || !Array.isArray(e.limitations))
        errors.push(e.name + ': weakpoints and limitations must be arrays.');
    }
    for (const c of ['mods', 'arcanes'])
      for (const r of records(db, c)) {
        effects(r.effects, r.name);
        numeric(r.maxRank, r.name + ' rank');
        if (!Number.isInteger(r.maxRank)) errors.push(r.name + ': maxRank must be an integer.');
        if (c === 'mods') {
          numeric(r.baseDrain, r.name + ' base drain', -100);
          if (
            r.rankDescriptions &&
            (!Array.isArray(r.rankDescriptions) ||
              r.rankDescriptions.length !== r.maxRank + 1 ||
              r.rankDescriptions.some((text) => text !== null && typeof text !== 'string'))
          )
            errors.push(r.name + ': rankDescriptions must have one text or null per rank.');
        }
        if (!Array.isArray(r.limitations)) errors.push(r.name + ': limitations must be an array.');
        if (r.rankEffects) {
          if (!Array.isArray(r.rankEffects) || r.rankEffects.length !== r.maxRank + 1)
            errors.push(r.name + ': rankEffects must cover all ranks.');
          else r.rankEffects.forEach((e) => effects(e, r.name));
        }
      }
    for (const e of records(db, 'incarnon-evolutions')) {
      if (!records(db, 'weapons').some((w) => w.family === e.family))
        errors.push(e.name + ': evolution family not found.');
      effects(e.effects, e.name);
      for (const [variant, es] of Object.entries(e.variantEffects || {})) {
        if (
          !records(db, 'weapons').some(
            (w) => (w.incarnonVariant || w.name) === variant && w.family === e.family,
          )
        )
          errors.push(e.name + ': unknown variant ' + variant);
        effects(es, e.name + ' ' + variant);
      }
      for (const effect of [...e.effects, ...Object.values(e.variantEffects || {}).flat()]) {
        if (
          effect.scope &&
          !['both', 'normal', 'incarnon', 'direct', 'radial'].includes(effect.scope)
        )
          errors.push(e.name + ': invalid attack scope.');
        if (effect.condition && !arr(e.conditions).some((c) => c.id === effect.condition))
          errors.push(e.name + ': missing condition.');
      }
      for (const c of arr(e.conditions))
        if (
          !c.id ||
          typeof c.maxStacks !== 'number' ||
          !Number.isFinite(c.maxStacks) ||
          c.maxStacks < 1
        )
          errors.push(e.name + ': invalid condition.');
    }
    for (const s of records(db, 'stances'))
      if (s.modId && !get(db, 'mods', s.modId))
        errors.push(s.name + ': stance mod reference not found.');
    for (const recipe of records(db, 'riven-splices')) {
      if (
        recipe.stat !== recipe.id ||
        !Array.isArray(recipe.categories) ||
        !recipe.categories.length ||
        recipe.categories.some(
          (c) => !['Rifle', 'Shotgun', 'Pistol', 'Archgun', 'Melee'].includes(c),
        ) ||
        !Array.isArray(recipe.pairs) ||
        !recipe.pairs.length
      )
        errors.push(recipe.name + ': invalid splice recipe.');
      for (const pair of arr(recipe.pairs))
        if (
          !Array.isArray(pair) ||
          pair.length !== 2 ||
          pair[0] === pair[1] ||
          pair.some((id) => !get(db, 'riven-tables', id))
        )
          errors.push(recipe.name + ': invalid source trait pair.');
    }
    for (const r of records(db, 'rivens')) {
      const family = records(db, 'weapons').filter(
        (w) => w.family === r.family && rivenCategory(w) === r.category,
      );
      if (!family.length) errors.push(r.name + ': compatible weapon family not found.');
      if (!ruleOf(db)?.rivenLayouts[r.layout]) {
        errors.push(r.name + ': invalid Riven layout.');
        continue;
      }
      const positives = +r.layout[0],
        negatives = +r.layout[2];
      if (
        !Array.isArray(r.attributes) ||
        r.attributes.filter((a) => !a.negative).length !== positives ||
        r.attributes.filter((a) => a.negative).length !== negatives
      )
        errors.push(r.name + ': attributes do not match layout.');
      else {
        const seen = new Set();
        for (const a of r.attributes) {
          const t = get(db, 'riven-tables', a.stat),
            splice = get(db, 'riven-splices', a.stat);
          if (a.spliced) {
            if (
              !splice ||
              !splice.categories.includes(r.category) ||
              a.negative ||
              typeof a.valueAtMaxRankDisposition1 !== 'number' ||
              !Number.isFinite(a.valueAtMaxRankDisposition1) ||
              a.valueAtMaxRankDisposition1 <= 0
            )
              errors.push(r.name + ': invalid spliced trait ' + a.stat);
            if (
              a.sourceTraits &&
              (!Array.isArray(a.sourceTraits) ||
                !splice?.pairs.some(
                  (pair) =>
                    pair.slice().sort().join('|') === a.sourceTraits.slice().sort().join('|'),
                ))
            )
              errors.push(r.name + ': invalid splice sources.');
          } else if (!t || t.values[r.category] == null)
            errors.push(r.name + ': invalid attribute ' + a.stat);
          if (seen.has(a.stat)) errors.push(r.name + ': repeated attribute.');
          seen.add(a.stat);
          if (!a.spliced && (typeof a.quality !== 'number' || a.quality < 0.9 || a.quality > 1.1))
            errors.push(r.name + ': roll quality must be 0.9–1.1.');
          if (
            !a.spliced &&
            t &&
            ((a.negative && t.positiveOnly) || (!a.negative && t.negativeOnly))
          )
            errors.push(r.name + ': invalid attribute sign.');
          if (/^element:(impact|puncture|slash)$/.test(a.stat)) {
            const type = a.stat.slice(8);
            if (
              !family.some(
                (w) =>
                  arr(w.rivenPhysicalExceptions).includes(type) ||
                  w.attacks.some(
                    (at) => (at.damage[type] || 0) / Math.max(0.0001, sum(at.damage)) > 0.25,
                  ),
              )
            )
              errors.push(
                r.name +
                  ': family does not meet the physical-stat roll threshold; verified exceptions belong in weapons.rivenPhysicalExceptions.',
              );
          }
        }
      }
      if (r.attributes.filter((a) => a.spliced).length > 1)
        errors.push(r.name + ': only one spliced trait is allowed.');
      numeric(r.rank, r.name + ' rank');
      if (r.rank > 8 || !Number.isInteger(r.rank))
        errors.push(r.name + ': Riven rank must be an integer from 0 to 8.');
      if (!Number.isInteger(r.mastery) || r.mastery < 8 || r.mastery > 16)
        errors.push(r.name + ': mastery must be 8–16.');
    }
    for (const p of records(db, 'modular-parts'))
      if (
        !p.spec ||
        typeof p.spec !== 'object' ||
        !['KitgunPrimary', 'KitgunSecondary', 'Zaw', 'Amp'].includes(p.group) ||
        typeof p.kind !== 'string'
      )
        errors.push(p.name + ': invalid modular part.');
    for (const s of records(db, 'stances'))
      if (!Array.isArray(s.combos) || s.combos.some((c) => !Array.isArray(c.hits)))
        errors.push(s.name + ': invalid stance combo.');
    const rule = ruleOf(db);
    if (!rule?.scaling || !rule?.status || !rule?.rivenLayouts)
      errors.push('Standard calculation rules are missing.');
    else {
      for (const field of [
        'armorMin',
        'armorCap',
        'armorMaxReduction',
        'steelPathHealth',
        'steelPathShield',
        'steelPathOverguard',
        'overguardBase',
      ])
        numeric(rule[field], 'Rules ' + field);
      if (rule.armorMin > rule.armorCap || rule.armorMaxReduction > 1)
        errors.push('Rules: invalid armor bounds.');
      const curves = [
        rule.armorScaling,
        rule.overguardScaling,
        ...Object.values(rule.scaling).flatMap((p) => [p.health, p.shield]),
      ];
      if (
        curves.some(
          (c) =>
            !Array.isArray(c) ||
            c.length !== 4 ||
            c.some((v) => typeof v !== 'number' || !Number.isFinite(v) || v < 0),
        )
      )
        errors.push('Rules: scaling curves must contain four nonnegative numbers.');
      if (!rule.scaling.standard) errors.push('Rules: standard scaling profile is required.');
      for (const f of records(db, 'factions'))
        if (!rule.scaling[f.scaling]) errors.push(f.name + ': scaling profile not found.');
    }
    for (const b of records(db, 'arsenal'))
      try {
        normalizeBuild(db, b.state);
      } catch (e) {
        errors.push(b.name + ': ' + e.message);
      }
    return errors;
  }
  function buildReferences(s) {
    const refs = [
      ['weapons', s.weaponId],
      ['enemies', s.enemyId],
      ['stances', s.stance?.id],
      ['mods', s.aura?.id],
    ];
    for (const slot of [...arr(s.slots), s.exilus].filter(Boolean))
      if (slot.id)
        refs.push(slot.id.startsWith('riven:') ? ['rivens', slot.id.slice(6)] : ['mods', slot.id]);
    for (const slot of arr(s.arcanes)) if (slot.id) refs.push(['arcanes', slot.id]);
    for (const shard of arr(s.shards)) if (shard.id) refs.push(['archon-shards', shard.id]);
    for (const id of Object.values(s.evolutions || {}))
      if (id) refs.push(['incarnon-evolutions', id]);
    for (const [kind, id] of Object.entries(s.parts || {}))
      if (id) refs.push([['Prism', 'Scaffold'].includes(kind) ? 'weapons' : 'modular-parts', id]);
    return refs.filter(([, id]) => id);
  }
  function autoSelectEvolutions(db, s) {
    const w = get(db, 'weapons', s.weaponId);
    if (!w) return s;
    s.evolutions ||= {};
    const tiers = new Map();
    for (const e of records(db, 'incarnon-evolutions').filter((e) => e.family === w.family)) {
      if (!tiers.has(e.tier)) tiers.set(e.tier, []);
      tiers.get(e.tier).push(e);
    }
    for (const [tier, choices] of tiers)
      if (choices.length === 1) s.evolutions[tier] = choices[0].id;
    return s;
  }
  function safeImagePath(value) {
    return typeof value === 'string' &&
      /^images\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_.-]+\.(?:png|jpg|jpeg|webp|gif|svg)$/i.test(
        value,
      ) &&
      !value.includes('..')
      ? value
      : 'images/placeholder.svg';
  }
  function statusIconPath(rules, type) {
    const label = String(type || '').toLowerCase(),
      key = /hunter munitions|impact-triggered bleed/.test(label) ? 'slash' : PROCS[label] || label;
    const standard = STATUS_ICON_FILES[key],
      configured = rules?.statusIcons?.[key];
    if (
      standard &&
      (!configured ||
        configured === 'images/placeholder.svg' ||
        /^images\/status\/(?:Dmg[A-Za-z]+Small64|IconShield)\.png$/i.test(configured))
    )
      return standard;
    return configured || standard || '';
  }
  function normalizeBuild(db, input) {
    if (
      !input ||
      !get(db, 'weapons', input.weaponId) ||
      !Array.isArray(input.slots) ||
      input.slots.length !== 8 ||
      !Array.isArray(input.arcanes) ||
      input.arcanes.length !== 4
    )
      throw Error('Build has invalid weapon or slots.');
    const defaults = defaultState(db),
      s = {
        ...defaults,
        ...clone(input),
        aura: { ...defaults.aura, ...clone(input.aura || {}) },
        shards: Array.isArray(input.shards) ? clone(input.shards) : defaults.shards,
        evolutionConditions: clone(input.evolutionConditions || {}),
        scenario: {
          ...defaults.scenario,
          ...input.scenario,
          stacks: { ...defaults.scenario.stacks, ...input.scenario?.stacks },
        },
      };
    s.incarnonEnabled = !!s.incarnonEnabled;
    for (const slot of [...s.slots, s.exilus, s.aura, s.stance])
      slot.polarity = normalizePolarity(slot.polarity);
    if (input.umbraForma == null) {
      const weapon = get(db, 'weapons', s.weaponId);
      s.umbraForma = Math.min(s.forma || 0, buildResources(s, weapon).umbraForma);
    }
    autoSelectEvolutions(db, s);
    for (const [c, id] of buildReferences(s))
      if (!get(db, c, id)) throw Error('Build reference not found: ' + c + ' / ' + id);
    for (const slot of [...s.slots, s.exilus, s.aura, ...s.arcanes]) {
      if (
        !slot ||
        typeof slot.id !== 'string' ||
        !Number.isInteger(slot.rank) ||
        slot.rank < 0 ||
        !Number.isFinite(slot.stacks) ||
        slot.stacks < 0 ||
        !Number.isFinite(slot.uptime) ||
        slot.uptime < 0 ||
        slot.uptime > 100
      )
        throw Error('Invalid slot rank, stacks or uptime.');
    }
    for (const slot of s.arcanes)
      if (slot.id) {
        const arcane = get(db, 'arcanes', slot.id);
        slot.stacks = clamp(slot.stacks, 0, arcaneStackCap(arcane));
      }
    if (!Array.isArray(s.shards) || s.shards.length !== 5)
      throw Error('Build must contain five Archon Shard slots.');
    for (const slot of s.shards) {
      if (
        !slot ||
        typeof slot.id !== 'string' ||
        typeof slot.tauforged !== 'boolean' ||
        !Number.isFinite(slot.stacks) ||
        slot.stacks < 0
      )
        throw Error('Invalid Archon Shard slot.');
      const shard = slot.id ? get(db, 'archon-shards', slot.id) : null;
      if (slot.id && !shard) throw Error('Archon Shard not found.');
      slot.stacks = clamp(
        slot.stacks,
        0,
        slot.tauforged ? (shard?.tauMaxStacks ?? shard?.maxStacks ?? 1) : (shard?.maxStacks ?? 1),
      );
    }
    for (const key of [
      'rank',
      'mastery',
      'forma',
      'umbraForma',
      'abilityStrength',
      'abilityMultiplier',
      'maximumEnergy',
      'progenitorValue',
    ])
      if (!Number.isFinite(s[key]) || s[key] < 0) throw Error('Invalid build setting: ' + key);
    for (const [key, value] of Object.entries(s.scenario))
      if (typeof defaults.scenario[key] === 'number' && (!Number.isFinite(value) || value < 0))
        throw Error('Invalid scenario: ' + key);
    if (
      !Number.isInteger(s.scenario.corrosiveCap) ||
      s.scenario.corrosiveCap < 10 ||
      s.scenario.corrosiveCap > 14
    )
      throw Error('Corrosive stack cap must be an integer from 10 to 14.');
    for (const value of Object.values(s.scenario.stacks))
      if (!Number.isFinite(value) || value < 0) throw Error('Invalid status stack count.');
    for (const values of Object.values(s.evolutionConditions))
      for (const value of Object.values(values))
        if (!Number.isFinite(value) || value < 0) throw Error('Invalid evolution condition.');
    const configured = configureWeapon(db, s).w,
      selectedAttack = configured.attacks.find((a) => a.id === s.attackId);
    if (!selectedAttack) throw Error('Attack component no longer exists.');
    if (
      selectedAttack.componentOf &&
      configured.attacks.some((a) => a.id === selectedAttack.componentOf)
    )
      s.attackId = selectedAttack.componentOf;
    for (const slot of [...s.slots, s.exilus])
      if (slot.id) {
        const mod = slotMod(db, slot, configured);
        if (!mod || slot.rank > mod.maxRank) throw Error('Invalid mod rank.');
      }
    if (s.aura.id) {
      const aura = get(db, 'mods', s.aura.id);
      if (aura?.type !== 'Aura' || s.aura.rank > aura.maxRank)
        throw Error('Invalid Aura mod or rank.');
    }
    for (const slot of s.arcanes)
      if (slot.id && slot.rank > get(db, 'arcanes', slot.id).maxRank)
        throw Error('Invalid arcane rank.');
    s.scenario.level = Math.round(clamp(s.scenario.level, 1, 9999));
    return s;
  }
  function arsenalExport(db, bundled) {
    const result = clone(db.arsenal);
    delete result.customRecords;
    const refs = records(db, 'arsenal').flatMap((b) => buildReferences(b.state)),
      seen = new Set(),
      custom = {};
    refs.push(...records(db, 'rivens').map((r) => ['rivens', r.id]));
    refs.push(['rules', ruleOf(db).id]);
    for (let i = 0; i < refs.length; i++) {
      const [c, id] = refs[i],
        key = c + ':' + id;
      if (seen.has(key)) continue;
      seen.add(key);
      const r = get(db, c, id);
      if (!r) continue;
      if (JSON.stringify(r) !== JSON.stringify(get(bundled, c, id)))
        (custom[c] ||= []).push(clone(r));
      if (c === 'mods') for (const other of arr(r.incompatible)) refs.push(['mods', other]);
      if (c === 'enemies') refs.push(['factions', r.factionId]);
      if (c === 'stances' && r.modId) refs.push(['mods', r.modId]);
      if (c === 'rivens') {
        for (const a of r.attributes)
          refs.push([a.spliced ? 'riven-splices' : 'riven-tables', a.stat]);
        const w = records(db, 'weapons').find(
          (w) => w.family === r.family && rivenCategory(w) === r.category,
        );
        if (w) refs.push(['weapons', w.id]);
      }
    }
    const library = records(db, 'progenitor-library');
    if (library.length) custom['progenitor-library'] = library.map(clone);
    result.customRecords = custom;
    return result;
  }
/* Bundled luaparse 0.3.1, MIT license. Lua is parsed as data, never executed.
Copyright (c) Oskar Schöldström 2012-2014
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
const CatalogueLua=(()=>{const module={exports:{}},exports=module.exports;
/* global exports:true, module:true, require:true, define:true, global:true */

(function (root, name, factory) {
  'use strict';

  // Used to determine if values are of the language type `Object`
  var objectTypes = {
        'function': true
      , 'object': true
    }
    // Detect free variable `exports`
    , freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports
    // Detect free variable `module`
    , freeModule = objectTypes[typeof module] && module && !module.nodeType && module
    // Detect free variable `global`, from Node.js or Browserified code, and
    // use it as `window`
    , freeGlobal = freeExports && freeModule && typeof global === 'object' && global
    // Detect the popular CommonJS extension `module.exports`
    , moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

  /* istanbul ignore else */
  if (freeGlobal && (freeGlobal.global === freeGlobal ||
                     /* istanbul ignore next */ freeGlobal.window === freeGlobal ||
                     /* istanbul ignore next */ freeGlobal.self === freeGlobal)) {
    root = freeGlobal;
  }

  // Some AMD build optimizers, like r.js, check for specific condition
  // patterns like the following:
  /* istanbul ignore if */
  if (typeof define === 'function' &&
      /* istanbul ignore next */ typeof define.amd === 'object' &&
      /* istanbul ignore next */ define.amd) {
    // defined as an anonymous module.
    define(['exports'], factory);
    // In case the source has been processed and wrapped in a define module use
    // the supplied `exports` object.
    if (freeExports && moduleExports) factory(freeModule.exports);
  }
  // check for `exports` after `define` in case a build optimizer adds an
  // `exports` object
  else /* istanbul ignore else */ if (freeExports && freeModule) {
    // in Node.js or RingoJS v0.8.0+
    /* istanbul ignore else */
    if (moduleExports) factory(freeModule.exports);
    // in RingoJS v0.7.0-
    else factory(freeExports);
  }
  // in a browser or Rhino
  else {
    factory((root[name] = {}));
  }
}(this, 'luaparse', function (exports) {
  'use strict';

  exports.version = "0.3.1";

  var input, options, length, features, encodingMode;

  // Options can be set either globally on the parser object through
  // defaultOptions, or during the parse call.
  var defaultOptions = exports.defaultOptions = {
    // Explicitly tell the parser when the input ends.
      wait: false
    // Store comments as an array in the chunk object.
    , comments: true
    // Track identifier scopes by adding an isLocal attribute to each
    // identifier-node.
    , scope: false
    // Store location information on each syntax node as
    // `loc: { start: { line, column }, end: { line, column } }`.
    , locations: false
    // Store the start and end character locations on each syntax node as
    // `range: [start, end]`.
    , ranges: false
    // A callback which will be invoked when a syntax node has been completed.
    // The node which has been created will be passed as the only parameter.
    , onCreateNode: null
    // A callback which will be invoked when a new scope is created.
    , onCreateScope: null
    // A callback which will be invoked when the current scope is destroyed.
    , onDestroyScope: null
    // A callback which will be invoked when a local variable is declared in the current scope.
    // The variable's name will be passed as the only parameter
    , onLocalDeclaration: null
    // The version of Lua targeted by the parser (string; allowed values are
    // '5.1', '5.2', '5.3').
    , luaVersion: '5.1'
    // Encoding mode: how to interpret code units higher than U+007F in input
    , encodingMode: 'none'
  };

  function encodeUTF8(codepoint, highMask) {
    highMask = highMask || 0;

    if (codepoint < 0x80) {
      return String.fromCharCode(codepoint);
    } else if (codepoint < 0x800) {
      return String.fromCharCode(
        highMask | 0xc0 |  (codepoint >>  6)        ,
        highMask | 0x80 | ( codepoint        & 0x3f)
      );
    } else if (codepoint < 0x10000) {
      return String.fromCharCode(
        highMask | 0xe0 |  (codepoint >> 12)        ,
        highMask | 0x80 | ((codepoint >>  6) & 0x3f),
        highMask | 0x80 | ( codepoint        & 0x3f)
      );
    } else /* istanbul ignore else */ if (codepoint < 0x110000) {
      return String.fromCharCode(
        highMask | 0xf0 |  (codepoint >> 18)        ,
        highMask | 0x80 | ((codepoint >> 12) & 0x3f),
        highMask | 0x80 | ((codepoint >>  6) & 0x3f),
        highMask | 0x80 | ( codepoint        & 0x3f)
      );
    } else {
      // TODO: Lua 5.4 allows up to six-byte sequences, as in UTF-8:1993
      return null;
    }
  }

  function toHex(num, digits) {
    var result = num.toString(16);
    while (result.length < digits)
      result = '0' + result;
    return result;
  }

  function checkChars(rx) {
    return function (s) {
      var m = rx.exec(s);
      if (!m)
        return s;
      raise(null, errors.invalidCodeUnit, toHex(m[0].charCodeAt(0), 4).toUpperCase());
    };
  }

  var encodingModes = {
    // `pseudo-latin1` encoding mode: assume the input was decoded with the latin1 encoding
    // WARNING: latin1 does **NOT** mean cp1252 here like in the bone-headed WHATWG standard;
    // it means true ISO/IEC 8859-1 identity-mapped to Basic Latin and Latin-1 Supplement blocks
    'pseudo-latin1': {
      fixup: checkChars(/[^\x00-\xff]/),
      encodeByte: function (value) {
        if (value === null)
          return '';
        return String.fromCharCode(value);
      },
      encodeUTF8: function (codepoint) {
        return encodeUTF8(codepoint);
      },
    },

    // `x-user-defined` encoding mode: assume the input was decoded with the WHATWG `x-user-defined` encoding
    'x-user-defined': {
      fixup: checkChars(/[^\x00-\x7f\uf780-\uf7ff]/),
      encodeByte: function (value) {
        if (value === null)
          return '';
        if (value >= 0x80)
          return String.fromCharCode(value | 0xf700);
        return String.fromCharCode(value);
      },
      encodeUTF8: function (codepoint) {
        return encodeUTF8(codepoint, 0xf700);
      }
    },

    // `none` encoding mode: disregard intrepretation of string literals, leave identifiers as-is
    'none': {
      discardStrings: true,
      fixup: function (s) {
        return s;
      },
      encodeByte: function (value) {
        return '';
      },
      encodeUTF8: function (codepoint) {
        return '';
      }
    }
  };

  // The available tokens expressed as enum flags so they can be checked with
  // bitwise operations.

  var EOF = 1, StringLiteral = 2, Keyword = 4, Identifier = 8
    , NumericLiteral = 16, Punctuator = 32, BooleanLiteral = 64
    , NilLiteral = 128, VarargLiteral = 256;

  exports.tokenTypes = { EOF: EOF, StringLiteral: StringLiteral
    , Keyword: Keyword, Identifier: Identifier, NumericLiteral: NumericLiteral
    , Punctuator: Punctuator, BooleanLiteral: BooleanLiteral
    , NilLiteral: NilLiteral, VarargLiteral: VarargLiteral
  };

  // As this parser is a bit different from luas own, the error messages
  // will be different in some situations.

  var errors = exports.errors = {
      unexpected: 'unexpected %1 \'%2\' near \'%3\''
    , unexpectedEOF: 'unexpected symbol near \'<eof>\''
    , expected: '\'%1\' expected near \'%2\''
    , expectedToken: '%1 expected near \'%2\''
    , unfinishedString: 'unfinished string near \'%1\''
    , malformedNumber: 'malformed number near \'%1\''
    , decimalEscapeTooLarge: 'decimal escape too large near \'%1\''
    , invalidEscape: 'invalid escape sequence near \'%1\''
    , hexadecimalDigitExpected: 'hexadecimal digit expected near \'%1\''
    , braceExpected: 'missing \'%1\' near \'%2\''
    , tooLargeCodepoint: 'UTF-8 value too large near \'%1\''
    , unfinishedLongString: 'unfinished long string (starting at line %1) near \'%2\''
    , unfinishedLongComment: 'unfinished long comment (starting at line %1) near \'%2\''
    , ambiguousSyntax: 'ambiguous syntax (function call x new statement) near \'%1\''
    , noLoopToBreak: 'no loop to break near \'%1\''
    , labelAlreadyDefined: 'label \'%1\' already defined on line %2'
    , labelNotVisible: 'no visible label \'%1\' for <goto>'
    , gotoJumpInLocalScope: '<goto %1> jumps into the scope of local \'%2\''
    , cannotUseVararg: 'cannot use \'...\' outside a vararg function near \'%1\''
    , invalidCodeUnit: 'code unit U+%1 is not allowed in the current encoding mode'
  };

  // ### Abstract Syntax Tree
  //
  // The default AST structure is inspired by the Mozilla Parser API but can
  // easily be customized by overriding these functions.

  var ast = exports.ast = {
      labelStatement: function(label) {
      return {
          type: 'LabelStatement'
        , label: label
      };
    }

    , breakStatement: function() {
      return {
          type: 'BreakStatement'
      };
    }

    , gotoStatement: function(label) {
      return {
          type: 'GotoStatement'
        , label: label
      };
    }

    , returnStatement: function(args) {
      return {
          type: 'ReturnStatement'
        , 'arguments': args
      };
    }

    , ifStatement: function(clauses) {
      return {
          type: 'IfStatement'
        , clauses: clauses
      };
    }
    , ifClause: function(condition, body) {
      return {
          type: 'IfClause'
        , condition: condition
        , body: body
      };
    }
    , elseifClause: function(condition, body) {
      return {
          type: 'ElseifClause'
        , condition: condition
        , body: body
      };
    }
    , elseClause: function(body) {
      return {
          type: 'ElseClause'
        , body: body
      };
    }

    , whileStatement: function(condition, body) {
      return {
          type: 'WhileStatement'
        , condition: condition
        , body: body
      };
    }

    , doStatement: function(body) {
      return {
          type: 'DoStatement'
        , body: body
      };
    }

    , repeatStatement: function(condition, body) {
      return {
          type: 'RepeatStatement'
        , condition: condition
        , body: body
      };
    }

    , localStatement: function(variables, init) {
      return {
          type: 'LocalStatement'
        , variables: variables
        , init: init
      };
    }

    , assignmentStatement: function(variables, init) {
      return {
          type: 'AssignmentStatement'
        , variables: variables
        , init: init
      };
    }

    , callStatement: function(expression) {
      return {
          type: 'CallStatement'
        , expression: expression
      };
    }

    , functionStatement: function(identifier, parameters, isLocal, body) {
      return {
          type: 'FunctionDeclaration'
        , identifier: identifier
        , isLocal: isLocal
        , parameters: parameters
        , body: body
      };
    }

    , forNumericStatement: function(variable, start, end, step, body) {
      return {
          type: 'ForNumericStatement'
        , variable: variable
        , start: start
        , end: end
        , step: step
        , body: body
      };
    }

    , forGenericStatement: function(variables, iterators, body) {
      return {
          type: 'ForGenericStatement'
        , variables: variables
        , iterators: iterators
        , body: body
      };
    }

    , chunk: function(body) {
      return {
          type: 'Chunk'
        , body: body
      };
    }

    , identifier: function(name) {
      return {
          type: 'Identifier'
        , name: name
      };
    }

    , literal: function(type, value, raw) {
      type = (type === StringLiteral) ? 'StringLiteral'
        : (type === NumericLiteral) ? 'NumericLiteral'
        : (type === BooleanLiteral) ? 'BooleanLiteral'
        : (type === NilLiteral) ? 'NilLiteral'
        : 'VarargLiteral';

      return {
          type: type
        , value: value
        , raw: raw
      };
    }

    , tableKey: function(key, value) {
      return {
          type: 'TableKey'
        , key: key
        , value: value
      };
    }
    , tableKeyString: function(key, value) {
      return {
          type: 'TableKeyString'
        , key: key
        , value: value
      };
    }
    , tableValue: function(value) {
      return {
          type: 'TableValue'
        , value: value
      };
    }


    , tableConstructorExpression: function(fields) {
      return {
          type: 'TableConstructorExpression'
        , fields: fields
      };
    }
    , binaryExpression: function(operator, left, right) {
      var type = ('and' === operator || 'or' === operator) ?
        'LogicalExpression' :
        'BinaryExpression';

      return {
          type: type
        , operator: operator
        , left: left
        , right: right
      };
    }
    , unaryExpression: function(operator, argument) {
      return {
          type: 'UnaryExpression'
        , operator: operator
        , argument: argument
      };
    }
    , memberExpression: function(base, indexer, identifier) {
      return {
          type: 'MemberExpression'
        , indexer: indexer
        , identifier: identifier
        , base: base
      };
    }

    , indexExpression: function(base, index) {
      return {
          type: 'IndexExpression'
        , base: base
        , index: index
      };
    }

    , callExpression: function(base, args) {
      return {
          type: 'CallExpression'
        , base: base
        , 'arguments': args
      };
    }

    , tableCallExpression: function(base, args) {
      return {
          type: 'TableCallExpression'
        , base: base
        , 'arguments': args
      };
    }

    , stringCallExpression: function(base, argument) {
      return {
          type: 'StringCallExpression'
        , base: base
        , argument: argument
      };
    }

    , comment: function(value, raw) {
      return {
          type: 'Comment'
        , value: value
        , raw: raw
      };
    }
  };

  // Wrap up the node object.

  function finishNode(node) {
    // Pop a `Marker` off the location-array and attach its location data.
    if (trackLocations) {
      var location = locations.pop();
      location.complete();
      location.bless(node);
    }
    if (options.onCreateNode) options.onCreateNode(node);
    return node;
  }


  // Helpers
  // -------

  var slice = Array.prototype.slice
    , toString = Object.prototype.toString
    ;

  var indexOf = /* istanbul ignore next */ function (array, element) {
    for (var i = 0, length = array.length; i < length; ++i) {
      if (array[i] === element) return i;
    }
    return -1;
  };

  /* istanbul ignore else */
  if (Array.prototype.indexOf)
    indexOf = function (array, element) {
      return array.indexOf(element);
    };

  // Iterate through an array of objects and return the index of an object
  // with a matching property.

  function indexOfObject(array, property, element) {
    for (var i = 0, length = array.length; i < length; ++i) {
      if (array[i][property] === element) return i;
    }
    return -1;
  }

  // A sprintf implementation using %index (beginning at 1) to input
  // arguments in the format string.
  //
  // Example:
  //
  //     // Unexpected function in token
  //     sprintf('Unexpected %2 in %1.', 'token', 'function');

  function sprintf(format) {
    var args = slice.call(arguments, 1);
    format = format.replace(/%(\d)/g, function (match, index) {
      return '' + args[index - 1] || /* istanbul ignore next */ '';
    });
    return format;
  }

  // Polyfill for `Object.assign`.

  var assign = /* istanbul ignore next */ function (dest) {
    var args = slice.call(arguments, 1)
      , src, prop;

    for (var i = 0, length = args.length; i < length; ++i) {
      src = args[i];
      for (prop in src)
        /* istanbul ignore else */
        if (Object.prototype.hasOwnProperty.call(src, prop)) {
          dest[prop] = src[prop];
        }
    }

    return dest;
  };

  /* istanbul ignore else */
  if (Object.assign)
    assign = Object.assign;

  // ### Error functions

  exports.SyntaxError = SyntaxError;

  // XXX: Eliminate this function and change the error type to be different from SyntaxError.
  // This will unfortunately be a breaking change, because some downstream users depend
  // on the error thrown being an instance of SyntaxError. For example, the Ace editor:
  // <https://github.com/ajaxorg/ace/blob/4c7e5eb3f5d5ca9434847be51834a4e41661b852/lib/ace/mode/lua_worker.js#L55>

  function fixupError(e) {
    /* istanbul ignore if */
    if (!Object.create)
      return e;
    return Object.create(e, {
      'line': { 'writable': true, value: e.line },
      'index': { 'writable': true, value: e.index },
      'column': { 'writable': true, value: e.column }
    });
  }

  // #### Raise an exception.
  //
  // Raise an exception by passing a token, a string format and its paramters.
  //
  // The passed tokens location will automatically be added to the error
  // message if it exists, if not it will default to the lexers current
  // position.
  //
  // Example:
  //
  //     // [1:0] expected [ near (
  //     raise(token, "expected %1 near %2", '[', token.value);

  function raise(token) {
    var message = sprintf.apply(null, slice.call(arguments, 1))
      , error, col;

    if (token === null || typeof token.line === 'undefined') {
      col = index - lineStart + 1;
      error = fixupError(new SyntaxError(sprintf('[%1:%2] %3', line, col, message)));
      error.index = index;
      error.line = line;
      error.column = col;
    } else {
      col = token.range[0] - token.lineStart;
      error = fixupError(new SyntaxError(sprintf('[%1:%2] %3', token.line, col, message)));
      error.line = token.line;
      error.index = token.range[0];
      error.column = col;
    }
    throw error;
  }

  function tokenValue(token) {
    var raw = input.slice(token.range[0], token.range[1]);
    if (raw)
      return raw;
    return token.value;
  }

  // #### Raise an unexpected token error.
  //
  // Example:
  //
  //     // expected <name> near '0'
  //     raiseUnexpectedToken('<name>', token);

  function raiseUnexpectedToken(type, token) {
    raise(token, errors.expectedToken, type, tokenValue(token));
  }

  // #### Raise a general unexpected error
  //
  // Usage should pass either a token object or a symbol string which was
  // expected. We can also specify a nearby token such as <eof>, this will
  // default to the currently active token.
  //
  // Example:
  //
  //     // Unexpected symbol 'end' near '<eof>'
  //     unexpected(token);
  //
  // If there's no token in the buffer it means we have reached <eof>.

  function unexpected(found) {
    var near = tokenValue(lookahead);
    if ('undefined' !== typeof found.type) {
      var type;
      switch (found.type) {
        case StringLiteral:   type = 'string';      break;
        case Keyword:         type = 'keyword';     break;
        case Identifier:      type = 'identifier';  break;
        case NumericLiteral:  type = 'number';      break;
        case Punctuator:      type = 'symbol';      break;
        case BooleanLiteral:  type = 'boolean';     break;
        case NilLiteral:
          return raise(found, errors.unexpected, 'symbol', 'nil', near);
        case EOF:
          return raise(found, errors.unexpectedEOF);
      }
      return raise(found, errors.unexpected, type, tokenValue(found), near);
    }
    return raise(found, errors.unexpected, 'symbol', found, near);
  }

  // Lexer
  // -----
  //
  // The lexer, or the tokenizer reads the input string character by character
  // and derives a token left-right. To be as efficient as possible the lexer
  // prioritizes the common cases such as identifiers. It also works with
  // character codes instead of characters as string comparisons was the
  // biggest bottleneck of the parser.
  //
  // If `options.comments` is enabled, all comments encountered will be stored
  // in an array which later will be appended to the chunk object. If disabled,
  // they will simply be disregarded.
  //
  // When the lexer has derived a valid token, it will be returned as an object
  // containing its value and as well as its position in the input string (this
  // is always enabled to provide proper debug messages).
  //
  // `lex()` starts lexing and returns the following token in the stream.

  var index
    , token
    , previousToken
    , lookahead
    , comments
    , tokenStart
    , line
    , lineStart;

  exports.lex = lex;

  function lex() {
    skipWhiteSpace();

    // Skip comments beginning with --
    while (45 === input.charCodeAt(index) &&
           45 === input.charCodeAt(index + 1)) {
      scanComment();
      skipWhiteSpace();
    }
    if (index >= length) return {
        type : EOF
      , value: '<eof>'
      , line: line
      , lineStart: lineStart
      , range: [index, index]
    };

    var charCode = input.charCodeAt(index)
      , next = input.charCodeAt(index + 1);

    // Memorize the range index where the token begins.
    tokenStart = index;
    if (isIdentifierStart(charCode)) return scanIdentifierOrKeyword();

    switch (charCode) {
      case 39: case 34: // '"
        return scanStringLiteral();

      case 48: case 49: case 50: case 51: case 52: case 53:
      case 54: case 55: case 56: case 57: // 0-9
        return scanNumericLiteral();

      case 46: // .
        // If the dot is followed by a digit it's a float.
        if (isDecDigit(next)) return scanNumericLiteral();
        if (46 === next) {
          if (46 === input.charCodeAt(index + 2)) return scanVarargLiteral();
          return scanPunctuator('..');
        }
        return scanPunctuator('.');

      case 61: // =
        if (61 === next) return scanPunctuator('==');
        return scanPunctuator('=');

      case 62: // >
        if (features.bitwiseOperators)
          if (62 === next) return scanPunctuator('>>');
        if (61 === next) return scanPunctuator('>=');
        return scanPunctuator('>');

      case 60: // <
        if (features.bitwiseOperators)
          if (60 === next) return scanPunctuator('<<');
        if (61 === next) return scanPunctuator('<=');
        return scanPunctuator('<');

      case 126: // ~
        if (61 === next) return scanPunctuator('~=');
        if (!features.bitwiseOperators)
          break;
        return scanPunctuator('~');

      case 58: // :
        if (features.labels)
          if (58 === next) return scanPunctuator('::');
        return scanPunctuator(':');

      case 91: // [
        // Check for a multiline string, they begin with [= or [[
        if (91 === next || 61 === next) return scanLongStringLiteral();
        return scanPunctuator('[');

      case 47: // /
        // Check for integer division op (//)
        if (features.integerDivision)
          if (47 === next) return scanPunctuator('//');
        return scanPunctuator('/');

      case 38: case 124: // & |
        if (!features.bitwiseOperators)
          break;

        /* fall through */
      case 42: case 94: case 37: case 44: case 123: case 125:
      case 93: case 40: case 41: case 59: case 35: case 45:
      case 43: // * ^ % , { } ] ( ) ; # - +
        return scanPunctuator(input.charAt(index));
    }

    return unexpected(input.charAt(index));
  }

  // Whitespace has no semantic meaning in lua so simply skip ahead while
  // tracking the encounted newlines. Any kind of eol sequence is counted as a
  // single line.

  function consumeEOL() {
    var charCode = input.charCodeAt(index)
      , peekCharCode = input.charCodeAt(index + 1);

    if (isLineTerminator(charCode)) {
      // Count \n\r and \r\n as one newline.
      if (10 === charCode && 13 === peekCharCode) ++index;
      if (13 === charCode && 10 === peekCharCode) ++index;
      ++line;
      lineStart = ++index;

      return true;
    }
    return false;
  }

  function skipWhiteSpace() {
    while (index < length) {
      var charCode = input.charCodeAt(index);
      if (isWhiteSpace(charCode)) {
        ++index;
      } else if (!consumeEOL()) {
        break;
      }
    }
  }

  // Identifiers, keywords, booleans and nil all look the same syntax wise. We
  // simply go through them one by one and defaulting to an identifier if no
  // previous case matched.

  function scanIdentifierOrKeyword() {
    var value, type;

    // Slicing the input string is prefered before string concatenation in a
    // loop for performance reasons.
    while (isIdentifierPart(input.charCodeAt(++index)));
    value = encodingMode.fixup(input.slice(tokenStart, index));

    // Decide on the token type and possibly cast the value.
    if (isKeyword(value)) {
      type = Keyword;
    } else if ('true' === value || 'false' === value) {
      type = BooleanLiteral;
      value = ('true' === value);
    } else if ('nil' === value) {
      type = NilLiteral;
      value = null;
    } else {
      type = Identifier;
    }

    return {
        type: type
      , value: value
      , line: line
      , lineStart: lineStart
      , range: [tokenStart, index]
    };
  }

  // Once a punctuator reaches this function it should already have been
  // validated so we simply return it as a token.

  function scanPunctuator(value) {
    index += value.length;
    return {
        type: Punctuator
      , value: value
      , line: line
      , lineStart: lineStart
      , range: [tokenStart, index]
    };
  }

  // A vararg literal consists of three dots.

  function scanVarargLiteral() {
    index += 3;
    return {
        type: VarargLiteral
      , value: '...'
      , line: line
      , lineStart: lineStart
      , range: [tokenStart, index]
    };
  }

  // Find the string literal by matching the delimiter marks used.

  function scanStringLiteral() {
    var delimiter = input.charCodeAt(index++)
      , beginLine = line
      , beginLineStart = lineStart
      , stringStart = index
      , string = encodingMode.discardStrings ? null : ''
      , charCode;

    for (;;) {
      charCode = input.charCodeAt(index++);
      if (delimiter === charCode) break;
      // EOF or `\n` terminates a string literal. If we haven't found the
      // ending delimiter by now, raise an exception.
      if (index > length || isLineTerminator(charCode)) {
        string += input.slice(stringStart, index - 1);
        raise(null, errors.unfinishedString, input.slice(tokenStart, index - 1));
      }
      if (92 === charCode) { // backslash
        if (!encodingMode.discardStrings) {
          var beforeEscape = input.slice(stringStart, index - 1);
          string += encodingMode.fixup(beforeEscape);
        }
        var escapeValue = readEscapeSequence();
        if (!encodingMode.discardStrings)
          string += escapeValue;
        stringStart = index;
      }
    }
    if (!encodingMode.discardStrings) {
      string += encodingMode.encodeByte(null);
      string += encodingMode.fixup(input.slice(stringStart, index - 1));
    }

    return {
        type: StringLiteral
      , value: string
      , line: beginLine
      , lineStart: beginLineStart
      , lastLine: line
      , lastLineStart: lineStart
      , range: [tokenStart, index]
    };
  }

  // Expect a multiline string literal and return it as a regular string
  // literal, if it doesn't validate into a valid multiline string, throw an
  // exception.

  function scanLongStringLiteral() {
    var beginLine = line
      , beginLineStart = lineStart
      , string = readLongString(false);
    // Fail if it's not a multiline literal.
    if (false === string) raise(token, errors.expected, '[', tokenValue(token));

    return {
        type: StringLiteral
      , value: encodingMode.discardStrings ? null : encodingMode.fixup(string)
      , line: beginLine
      , lineStart: beginLineStart
      , lastLine: line
      , lastLineStart: lineStart
      , range: [tokenStart, index]
    };
  }

  // Numeric literals will be returned as floating-point numbers instead of
  // strings. The raw value should be retrieved from slicing the input string
  // later on in the process.
  //
  // If a hexadecimal number is encountered, it will be converted.

  function scanNumericLiteral() {
    var character = input.charAt(index)
      , next = input.charAt(index + 1);

    var literal = ('0' === character && 'xX'.indexOf(next || null) >= 0) ?
      readHexLiteral() : readDecLiteral();

    var foundImaginaryUnit = readImaginaryUnitSuffix()
      , foundInt64Suffix = readInt64Suffix();

    if (foundInt64Suffix && (foundImaginaryUnit || literal.hasFractionPart)) {
      raise(null, errors.malformedNumber, input.slice(tokenStart, index));
    }

    return {
        type: NumericLiteral
      , value: literal.value
      , line: line
      , lineStart: lineStart
      , range: [tokenStart, index]
    };
  }

  function readImaginaryUnitSuffix() {
    if (!features.imaginaryNumbers) return;

    // Imaginary unit number suffix is optional.
    // See http://luajit.org/ext_ffi_api.html#literals
    if ('iI'.indexOf(input.charAt(index) || null) >= 0) {
      ++index;
      return true;
    } else {
      return false;
    }
  }

  function readInt64Suffix() {
    if (!features.integerSuffixes) return;

    // Int64/uint64 number suffix is optional.
    // See http://luajit.org/ext_ffi_api.html#literals

    if ('uU'.indexOf(input.charAt(index) || null) >= 0) {
      ++index;
      if ('lL'.indexOf(input.charAt(index) || null) >= 0) {
        ++index;
        if ('lL'.indexOf(input.charAt(index) || null) >= 0) {
          ++index;
          return 'ULL';
        } else {
          // UL but no L
          raise(null, errors.malformedNumber, input.slice(tokenStart, index));
        }
      } else {
        // U but no L
        raise(null, errors.malformedNumber, input.slice(tokenStart, index));
      }
    } else if ('lL'.indexOf(input.charAt(index) || null) >= 0) {
        ++index;
        if ('lL'.indexOf(input.charAt(index) || null) >= 0) {
          ++index;
          return 'LL';
        } else {
          // First L but no second L
          raise(null, errors.malformedNumber, input.slice(tokenStart, index));
        }
    }
  }

  // Lua hexadecimals have an optional fraction part and an optional binary
  // exoponent part. These are not included in JavaScript so we will compute
  // all three parts separately and then sum them up at the end of the function
  // with the following algorithm.
  //
  //     Digit := toDec(digit)
  //     Fraction := toDec(fraction) / 16 ^ fractionCount
  //     BinaryExp := 2 ^ binaryExp
  //     Number := ( Digit + Fraction ) * BinaryExp

  function readHexLiteral() {
    var fraction = 0 // defaults to 0 as it gets summed
      , binaryExponent = 1 // defaults to 1 as it gets multiplied
      , binarySign = 1 // positive
      , digit, fractionStart, exponentStart, digitStart;

    digitStart = index += 2; // Skip 0x part

    // A minimum of one hex digit is required.
    if (!isHexDigit(input.charCodeAt(index)))
      raise(null, errors.malformedNumber, input.slice(tokenStart, index));

    while (isHexDigit(input.charCodeAt(index))) ++index;
    // Convert the hexadecimal digit to base 10.
    digit = parseInt(input.slice(digitStart, index), 16);

    // Fraction part is optional.
    var foundFraction = false;
    if ('.' === input.charAt(index)) {
      foundFraction = true;
      fractionStart = ++index;

      while (isHexDigit(input.charCodeAt(index))) ++index;
      fraction = input.slice(fractionStart, index);

      // Empty fraction parts should default to 0, others should be converted
      // 0.x form so we can use summation at the end.
      fraction = (fractionStart === index) ? 0
        : parseInt(fraction, 16) / Math.pow(16, index - fractionStart);
    }

    // Binary exponents are optional
    var foundBinaryExponent = false;
    if ('pP'.indexOf(input.charAt(index) || null) >= 0) {
      foundBinaryExponent = true;
      ++index;

      // Sign part is optional and defaults to 1 (positive).
      if ('+-'.indexOf(input.charAt(index) || null) >= 0)
        binarySign = ('+' === input.charAt(index++)) ? 1 : -1;

      exponentStart = index;

      // The binary exponent sign requires a decimal digit.
      if (!isDecDigit(input.charCodeAt(index)))
        raise(null, errors.malformedNumber, input.slice(tokenStart, index));

      while (isDecDigit(input.charCodeAt(index))) ++index;
      binaryExponent = input.slice(exponentStart, index);

      // Calculate the binary exponent of the number.
      binaryExponent = Math.pow(2, binaryExponent * binarySign);
    }

    return {
      value: (digit + fraction) * binaryExponent,
      hasFractionPart: foundFraction || foundBinaryExponent
    };
  }

  // Decimal numbers are exactly the same in Lua and in JavaScript, because of
  // this we check where the token ends and then parse it with native
  // functions.

  function readDecLiteral() {
    while (isDecDigit(input.charCodeAt(index))) ++index;
    // Fraction part is optional
    var foundFraction = false;
    if ('.' === input.charAt(index)) {
      foundFraction = true;
      ++index;
      // Fraction part defaults to 0
      while (isDecDigit(input.charCodeAt(index))) ++index;
    }

    // Exponent part is optional.
    var foundExponent = false;
    if ('eE'.indexOf(input.charAt(index) || null) >= 0) {
      foundExponent = true;
      ++index;
      // Sign part is optional.
      if ('+-'.indexOf(input.charAt(index) || null) >= 0) ++index;
      // An exponent is required to contain at least one decimal digit.
      if (!isDecDigit(input.charCodeAt(index)))
        raise(null, errors.malformedNumber, input.slice(tokenStart, index));

      while (isDecDigit(input.charCodeAt(index))) ++index;
    }

    return {
      value: parseFloat(input.slice(tokenStart, index)),
      hasFractionPart: foundFraction || foundExponent
    };
  }

  function readUnicodeEscapeSequence() {
    var sequenceStart = index++;

    if (input.charAt(index++) !== '{')
      raise(null, errors.braceExpected, '{', '\\' + input.slice(sequenceStart, index));
    if (!isHexDigit(input.charCodeAt(index)))
      raise(null, errors.hexadecimalDigitExpected, '\\' + input.slice(sequenceStart, index));

    while (input.charCodeAt(index) === 0x30) ++index;
    var escStart = index;

    while (isHexDigit(input.charCodeAt(index))) {
      ++index;
      if (index - escStart > 6)
        raise(null, errors.tooLargeCodepoint, '\\' + input.slice(sequenceStart, index));
    }

    var b = input.charAt(index++);
    if (b !== '}') {
      if ((b === '"') || (b === "'"))
        raise(null, errors.braceExpected, '}', '\\' + input.slice(sequenceStart, index--));
      else
        raise(null, errors.hexadecimalDigitExpected, '\\' + input.slice(sequenceStart, index));
    }

    var codepoint = parseInt(input.slice(escStart, index - 1) || '0', 16);
    var frag = '\\' + input.slice(sequenceStart, index);

    if (codepoint > 0x10ffff) {
      raise(null, errors.tooLargeCodepoint, frag);
    }

    return encodingMode.encodeUTF8(codepoint, frag);
  }

  // Translate escape sequences to the actual characters.
  function readEscapeSequence() {
    var sequenceStart = index;
    switch (input.charAt(index)) {
      // Lua allow the following escape sequences.
      case 'a': ++index; return '\x07';
      case 'n': ++index; return '\n';
      case 'r': ++index; return '\r';
      case 't': ++index; return '\t';
      case 'v': ++index; return '\x0b';
      case 'b': ++index; return '\b';
      case 'f': ++index; return '\f';

      // Backslash at the end of the line. We treat all line endings as equivalent,
      // and as representing the [LF] character (code 10). Lua 5.1 through 5.3
      // have been verified to behave the same way.
      case '\r':
      case '\n':
        consumeEOL();
        return '\n';

      case '0': case '1': case '2': case '3': case '4':
      case '5': case '6': case '7': case '8': case '9':
        // \ddd, where ddd is a sequence of up to three decimal digits.
        while (isDecDigit(input.charCodeAt(index)) && index - sequenceStart < 3) ++index;

        var frag = input.slice(sequenceStart, index);
        var ddd = parseInt(frag, 10);
        if (ddd > 255) {
          raise(null, errors.decimalEscapeTooLarge, '\\' + ddd);
        }
        return encodingMode.encodeByte(ddd, '\\' + frag);

      case 'z':
        if (features.skipWhitespaceEscape) {
          ++index;
          skipWhiteSpace();
          return '';
        }
        break;

      case 'x':
        if (features.hexEscapes) {
          // \xXX, where XX is a sequence of exactly two hexadecimal digits
          if (isHexDigit(input.charCodeAt(index + 1)) &&
              isHexDigit(input.charCodeAt(index + 2))) {
            index += 3;
            return encodingMode.encodeByte(parseInt(input.slice(sequenceStart + 1, index), 16), '\\' + input.slice(sequenceStart, index));
          }
          raise(null, errors.hexadecimalDigitExpected, '\\' + input.slice(sequenceStart, index + 2));
        }
        break;

      case 'u':
        if (features.unicodeEscapes)
          return readUnicodeEscapeSequence();
        break;

      case '\\': case '"': case "'":
        return input.charAt(index++);
    }

    if (features.strictEscapes)
      raise(null, errors.invalidEscape, '\\' + input.slice(sequenceStart, index + 1));
    return input.charAt(index++);
  }

  // Comments begin with -- after which it will be decided if they are
  // multiline comments or not.
  //
  // The multiline functionality works the exact same way as with string
  // literals so we reuse the functionality.

  function scanComment() {
    tokenStart = index;
    index += 2; // --

    var character = input.charAt(index)
      , content = ''
      , isLong = false
      , commentStart = index
      , lineStartComment = lineStart
      , lineComment = line;

    if ('[' === character) {
      content = readLongString(true);
      // This wasn't a multiline comment after all.
      if (false === content) content = character;
      else isLong = true;
    }
    // Scan until next line as long as it's not a multiline comment.
    if (!isLong) {
      while (index < length) {
        if (isLineTerminator(input.charCodeAt(index))) break;
        ++index;
      }
      if (options.comments) content = input.slice(commentStart, index);
    }

    if (options.comments) {
      var node = ast.comment(content, input.slice(tokenStart, index));

      // `Marker`s depend on tokens available in the parser and as comments are
      // intercepted in the lexer all location data is set manually.
      if (options.locations) {
        node.loc = {
            start: { line: lineComment, column: tokenStart - lineStartComment }
          , end: { line: line, column: index - lineStart }
        };
      }
      if (options.ranges) {
        node.range = [tokenStart, index];
      }
      if (options.onCreateNode) options.onCreateNode(node);
      comments.push(node);
    }
  }

  // Read a multiline string by calculating the depth of `=` characters and
  // then appending until an equal depth is found.

  function readLongString(isComment) {
    var level = 0
      , content = ''
      , terminator = false
      , character, stringStart, firstLine = line;

    ++index; // [

    // Calculate the depth of the comment.
    while ('=' === input.charAt(index + level)) ++level;
    // Exit, this is not a long string afterall.
    if ('[' !== input.charAt(index + level)) return false;

    index += level + 1;

    // If the first character is a newline, ignore it and begin on next line.
    if (isLineTerminator(input.charCodeAt(index))) consumeEOL();

    stringStart = index;
    while (index < length) {
      // To keep track of line numbers run the `consumeEOL()` which increments
      // its counter.
      while (isLineTerminator(input.charCodeAt(index))) consumeEOL();

      character = input.charAt(index++);

      // Once the delimiter is found, iterate through the depth count and see
      // if it matches.
      if (']' === character) {
        terminator = true;
        for (var i = 0; i < level; ++i) {
          if ('=' !== input.charAt(index + i)) terminator = false;
        }
        if (']' !== input.charAt(index + level)) terminator = false;
      }

      // We reached the end of the multiline string. Get out now.
      if (terminator) {
        content += input.slice(stringStart, index - 1);
        index += level + 1;
        return content;
      }
    }

    raise(null, isComment ?
                errors.unfinishedLongComment :
                errors.unfinishedLongString,
          firstLine, '<eof>');
  }

  // ## Lex functions and helpers.

  // Read the next token.
  //
  // This is actually done by setting the current token to the lookahead and
  // reading in the new lookahead token.

  function next() {
    previousToken = token;
    token = lookahead;
    lookahead = lex();
  }

  // Consume a token if its value matches. Once consumed or not, return the
  // success of the operation.

  function consume(value) {
    if (value === token.value) {
      next();
      return true;
    }
    return false;
  }

  // Expect the next token value to match. If not, throw an exception.

  function expect(value) {
    if (value === token.value) next();
    else raise(token, errors.expected, value, tokenValue(token));
  }

  // ### Validation functions

  function isWhiteSpace(charCode) {
    return 9 === charCode || 32 === charCode || 0xB === charCode || 0xC === charCode;
  }

  function isLineTerminator(charCode) {
    return 10 === charCode || 13 === charCode;
  }

  function isDecDigit(charCode) {
    return charCode >= 48 && charCode <= 57;
  }

  function isHexDigit(charCode) {
    return (charCode >= 48 && charCode <= 57) || (charCode >= 97 && charCode <= 102) || (charCode >= 65 && charCode <= 70);
  }

  // From [Lua 5.2](http://www.lua.org/manual/5.2/manual.html#8.1) onwards
  // identifiers cannot use 'locale-dependent' letters (i.e. dependent on the C locale).
  // On the other hand, LuaJIT allows arbitrary octets ≥ 128 in identifiers.

  function isIdentifierStart(charCode) {
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || 95 === charCode)
      return true;
    if (features.extendedIdentifiers && charCode >= 128)
      return true;
    return false;
  }

  function isIdentifierPart(charCode) {
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122) || 95 === charCode || (charCode >= 48 && charCode <= 57))
      return true;
    if (features.extendedIdentifiers && charCode >= 128)
      return true;
    return false;
  }

  // [3.1 Lexical Conventions](http://www.lua.org/manual/5.2/manual.html#3.1)
  //
  // `true`, `false` and `nil` will not be considered keywords, but literals.

  function isKeyword(id) {
    switch (id.length) {
      case 2:
        return 'do' === id || 'if' === id || 'in' === id || 'or' === id;
      case 3:
        return 'and' === id || 'end' === id || 'for' === id || 'not' === id;
      case 4:
        if ('else' === id || 'then' === id)
          return true;
        if (features.labels && !features.contextualGoto)
          return ('goto' === id);
        return false;
      case 5:
        return 'break' === id || 'local' === id || 'until' === id || 'while' === id;
      case 6:
        return 'elseif' === id || 'repeat' === id || 'return' === id;
      case 8:
        return 'function' === id;
    }
    return false;
  }

  function isUnary(token) {
    if (Punctuator === token.type) return '#-~'.indexOf(token.value) >= 0;
    if (Keyword === token.type) return 'not' === token.value;
    return false;
  }

  // Check if the token syntactically closes a block.

  function isBlockFollow(token) {
    if (EOF === token.type) return true;
    if (Keyword !== token.type) return false;
    switch (token.value) {
      case 'else': case 'elseif':
      case 'end': case 'until':
        return true;
      default:
        return false;
    }
  }

  // Scope
  // -----

  // Store each block scope as a an array of identifier names. Each scope is
  // stored in an FILO-array.
  var scopes
    // The current scope index
    , scopeDepth
    // A list of all global identifier nodes.
    , globals;

  // Create a new scope inheriting all declarations from the previous scope.
  function createScope() {
    var scope = scopes[scopeDepth++].slice();
    scopes.push(scope);
    if (options.onCreateScope) options.onCreateScope();
  }

  // Exit and remove the current scope.
  function destroyScope() {
    var scope = scopes.pop();
    --scopeDepth;
    if (options.onDestroyScope) options.onDestroyScope();
  }

  // Add identifier name to the current scope if it doesnt already exist.
  function scopeIdentifierName(name) {
    if (options.onLocalDeclaration) options.onLocalDeclaration(name);
    if (-1 !== indexOf(scopes[scopeDepth], name)) return;
    scopes[scopeDepth].push(name);
  }

  // Add identifier to the current scope
  function scopeIdentifier(node) {
    scopeIdentifierName(node.name);
    attachScope(node, true);
  }

  // Attach scope information to node. If the node is global, store it in the
  // globals array so we can return the information to the user.
  function attachScope(node, isLocal) {
    if (!isLocal && -1 === indexOfObject(globals, 'name', node.name))
      globals.push(node);

    node.isLocal = isLocal;
  }

  // Is the identifier name available in this scope.
  function scopeHasName(name) {
    return (-1 !== indexOf(scopes[scopeDepth], name));
  }

  // Location tracking
  // -----------------
  //
  // Locations are stored in FILO-array as a `Marker` object consisting of both
  // `loc` and `range` data. Once a `Marker` is popped off the list an end
  // location is added and the data is attached to a syntax node.

  var locations = []
    , trackLocations;

  function createLocationMarker() {
    return new Marker(token);
  }

  function Marker(token) {
    if (options.locations) {
      this.loc = {
          start: {
            line: token.line
          , column: token.range[0] - token.lineStart
        }
        , end: {
            line: 0
          , column: 0
        }
      };
    }
    if (options.ranges) this.range = [token.range[0], 0];
  }

  // Complete the location data stored in the `Marker` by adding the location
  // of the *previous token* as an end location.
  Marker.prototype.complete = function() {
    if (options.locations) {
      this.loc.end.line = previousToken.lastLine || previousToken.line;
      this.loc.end.column = previousToken.range[1] - (previousToken.lastLineStart || previousToken.lineStart);
    }
    if (options.ranges) {
      this.range[1] = previousToken.range[1];
    }
  };

  Marker.prototype.bless = function (node) {
    if (this.loc) {
      var loc = this.loc;
      node.loc = {
        start: {
          line: loc.start.line,
          column: loc.start.column
        },
        end: {
          line: loc.end.line,
          column: loc.end.column
        }
      };
    }
    if (this.range) {
      node.range = [
        this.range[0],
        this.range[1]
      ];
    }
  };

  // Create a new `Marker` and add it to the FILO-array.
  function markLocation() {
    if (trackLocations) locations.push(createLocationMarker());
  }

  // Push an arbitrary `Marker` object onto the FILO-array.
  function pushLocation(marker) {
    if (trackLocations) locations.push(marker);
  }

  // Control flow tracking
  // ---------------------
  // A context object that validates loop breaks and `goto`-based control flow.

  function FullFlowContext() {
    this.scopes = [];
    this.pendingGotos = [];
  }

  FullFlowContext.prototype.isInLoop = function () {
    var i = this.scopes.length;
    while (i --> 0) {
      if (this.scopes[i].isLoop)
        return true;
    }
    return false;
  };

  FullFlowContext.prototype.pushScope = function (isLoop) {
    var scope = {
      labels: {},
      locals: [],
      deferredGotos: [],
      isLoop: !!isLoop
    };
    this.scopes.push(scope);
  };

  FullFlowContext.prototype.popScope = function () {
    for (var i = 0; i < this.pendingGotos.length; ++i) {
      var theGoto = this.pendingGotos[i];
      if (theGoto.maxDepth >= this.scopes.length)
        if (--theGoto.maxDepth <= 0)
          raise(theGoto.token, errors.labelNotVisible, theGoto.target);
    }

    this.scopes.pop();
  };

  FullFlowContext.prototype.addGoto = function (target, token) {
    var localCounts = [];

    for (var i = 0; i < this.scopes.length; ++i) {
      var scope = this.scopes[i];
      localCounts.push(scope.locals.length);
      if (Object.prototype.hasOwnProperty.call(scope.labels, target))
        return;
    }

    this.pendingGotos.push({
      maxDepth: this.scopes.length,
      target: target,
      token: token,
      localCounts: localCounts
    });
  };

  FullFlowContext.prototype.addLabel = function (name, token) {
    var scope = this.currentScope();

    if (Object.prototype.hasOwnProperty.call(scope.labels, name)) {
      raise(token, errors.labelAlreadyDefined, name, scope.labels[name].line);
    } else {
      var newGotos = [];

      for (var i = 0; i < this.pendingGotos.length; ++i) {
        var theGoto = this.pendingGotos[i];

        if (theGoto.maxDepth >= this.scopes.length && theGoto.target === name) {
          if (theGoto.localCounts[this.scopes.length - 1] < scope.locals.length) {
            scope.deferredGotos.push(theGoto);
          }
          continue;
        }

        newGotos.push(theGoto);
      }

      this.pendingGotos = newGotos;
    }

    scope.labels[name] = {
      localCount: scope.locals.length,
      line: token.line
    };
  };

  FullFlowContext.prototype.addLocal = function (name, token) {
    this.currentScope().locals.push({
      name: name,
      token: token
    });
  };

  FullFlowContext.prototype.currentScope = function () {
    return this.scopes[this.scopes.length - 1];
  };

  FullFlowContext.prototype.raiseDeferredErrors = function () {
    var scope = this.currentScope();
    var bads = scope.deferredGotos;
    for (var i = 0; i < bads.length; ++i) {
      var theGoto = bads[i];
      raise(theGoto.token, errors.gotoJumpInLocalScope, theGoto.target, scope.locals[theGoto.localCounts[this.scopes.length - 1]].name);
    }
    // Would be dead code currently, but may be useful later
    // if (bads.length)
    //   scope.deferredGotos = [];
  };

  // Simplified context that only checks the validity of loop breaks.

  function LoopFlowContext() {
    this.level = 0;
    this.loopLevels = [];
  }

  LoopFlowContext.prototype.isInLoop = function () {
    return !!this.loopLevels.length;
  };

  LoopFlowContext.prototype.pushScope = function (isLoop) {
    ++this.level;
    if (isLoop)
      this.loopLevels.push(this.level);
  };

  LoopFlowContext.prototype.popScope = function () {
    var levels = this.loopLevels;
    var levlen = levels.length;
    if (levlen) {
      if (levels[levlen - 1] === this.level)
        levels.pop();
    }
    --this.level;
  };

  LoopFlowContext.prototype.addGoto =
  LoopFlowContext.prototype.addLabel =
  /* istanbul ignore next */
  function () { throw new Error('This should never happen'); };

  LoopFlowContext.prototype.addLocal =
  LoopFlowContext.prototype.raiseDeferredErrors =
  function () {};

  function makeFlowContext() {
    return features.labels ? new FullFlowContext() : new LoopFlowContext();
  }

  // Parse functions
  // ---------------

  // Chunk is the main program object. Syntactically it's the same as a block.
  //
  //     chunk ::= block

  function parseChunk() {
    next();
    markLocation();
    if (options.scope) createScope();
    var flowContext = makeFlowContext();
    flowContext.allowVararg = true;
    flowContext.pushScope();
    var body = parseBlock(flowContext);
    flowContext.popScope();
    if (options.scope) destroyScope();
    if (EOF !== token.type) unexpected(token);
    // If the body is empty no previousToken exists when finishNode runs.
    if (trackLocations && !body.length) previousToken = token;
    return finishNode(ast.chunk(body));
  }

  // A block contains a list of statements with an optional return statement
  // as its last statement.
  //
  //     block ::= {stat} [retstat]

  function parseBlock(flowContext) {
    var block = []
      , statement;

    while (!isBlockFollow(token)) {
      // Return has to be the last statement in a block.
      // Likewise 'break' in Lua older than 5.2
      if ('return' === token.value || (!features.relaxedBreak && 'break' === token.value)) {
        block.push(parseStatement(flowContext));
        break;
      }
      statement = parseStatement(flowContext);
      consume(';');
      // Statements are only added if they are returned, this allows us to
      // ignore some statements, such as EmptyStatement.
      if (statement) block.push(statement);
    }

    // Doesn't really need an ast node
    return block;
  }

  // There are two types of statements, simple and compound.
  //
  //     statement ::= break | goto | do | while | repeat | return
  //          | if | for | function | local | label | assignment
  //          | functioncall | ';'

  function parseStatement(flowContext) {
    markLocation();

    if (Punctuator === token.type) {
      if (consume('::')) return parseLabelStatement(flowContext);
    }

    // When a `;` is encounted, simply eat it without storing it.
    if (features.emptyStatement) {
      if (consume(';')) {
        if (trackLocations) locations.pop();
        return;
      }
    }

    flowContext.raiseDeferredErrors();

    if (Keyword === token.type) {
      switch (token.value) {
        case 'local':    next(); return parseLocalStatement(flowContext);
        case 'if':       next(); return parseIfStatement(flowContext);
        case 'return':   next(); return parseReturnStatement(flowContext);
        case 'function': next();
          var name = parseFunctionName();
          return parseFunctionDeclaration(name);
        case 'while':    next(); return parseWhileStatement(flowContext);
        case 'for':      next(); return parseForStatement(flowContext);
        case 'repeat':   next(); return parseRepeatStatement(flowContext);
        case 'break':    next();
          if (!flowContext.isInLoop())
            raise(token, errors.noLoopToBreak, token.value);
          return parseBreakStatement();
        case 'do':       next(); return parseDoStatement(flowContext);
        case 'goto':     next(); return parseGotoStatement(flowContext);
      }
    }

    if (features.contextualGoto &&
        token.type === Identifier && token.value === 'goto' &&
        lookahead.type === Identifier && lookahead.value !== 'goto') {
      next(); return parseGotoStatement(flowContext);
    }

    // Assignments memorizes the location and pushes it manually for wrapper nodes.
    if (trackLocations) locations.pop();

    return parseAssignmentOrCallStatement(flowContext);
  }

  // ## Statements

  //     label ::= '::' Name '::'

  function parseLabelStatement(flowContext) {
    var nameToken = token
      , label = parseIdentifier();

    if (options.scope) {
      scopeIdentifierName('::' + nameToken.value + '::');
      attachScope(label, true);
    }

    expect('::');

    flowContext.addLabel(nameToken.value, nameToken);
    return finishNode(ast.labelStatement(label));
  }

  //     break ::= 'break'

  function parseBreakStatement() {
    return finishNode(ast.breakStatement());
  }

  //     goto ::= 'goto' Name

  function parseGotoStatement(flowContext) {
    var name = token.value
      , gotoToken = previousToken
      , label = parseIdentifier();

    flowContext.addGoto(name, gotoToken);
    return finishNode(ast.gotoStatement(label));
  }

  //     do ::= 'do' block 'end'

  function parseDoStatement(flowContext) {
    if (options.scope) createScope();
    flowContext.pushScope();
    var body = parseBlock(flowContext);
    flowContext.popScope();
    if (options.scope) destroyScope();
    expect('end');
    return finishNode(ast.doStatement(body));
  }

  //     while ::= 'while' exp 'do' block 'end'

  function parseWhileStatement(flowContext) {
    var condition = parseExpectedExpression(flowContext);
    expect('do');
    if (options.scope) createScope();
    flowContext.pushScope(true);
    var body = parseBlock(flowContext);
    flowContext.popScope();
    if (options.scope) destroyScope();
    expect('end');
    return finishNode(ast.whileStatement(condition, body));
  }

  //     repeat ::= 'repeat' block 'until' exp

  function parseRepeatStatement(flowContext) {
    if (options.scope) createScope();
    flowContext.pushScope(true);
    var body = parseBlock(flowContext);
    expect('until');
    flowContext.raiseDeferredErrors();
    var condition = parseExpectedExpression(flowContext);
    flowContext.popScope();
    if (options.scope) destroyScope();
    return finishNode(ast.repeatStatement(condition, body));
  }

  //     retstat ::= 'return' [exp {',' exp}] [';']

  function parseReturnStatement(flowContext) {
    var expressions = [];

    if ('end' !== token.value) {
      var expression = parseExpression(flowContext);
      if (null != expression) expressions.push(expression);
      while (consume(',')) {
        expression = parseExpectedExpression(flowContext);
        expressions.push(expression);
      }
      consume(';'); // grammar tells us ; is optional here.
    }
    return finishNode(ast.returnStatement(expressions));
  }

  //     if ::= 'if' exp 'then' block {elif} ['else' block] 'end'
  //     elif ::= 'elseif' exp 'then' block

  function parseIfStatement(flowContext) {
    var clauses = []
      , condition
      , body
      , marker;

    // IfClauses begin at the same location as the parent IfStatement.
    // It ends at the start of `end`, `else`, or `elseif`.
    if (trackLocations) {
      marker = locations[locations.length - 1];
      locations.push(marker);
    }
    condition = parseExpectedExpression(flowContext);
    expect('then');
    if (options.scope) createScope();
    flowContext.pushScope();
    body = parseBlock(flowContext);
    flowContext.popScope();
    if (options.scope) destroyScope();
    clauses.push(finishNode(ast.ifClause(condition, body)));

    if (trackLocations) marker = createLocationMarker();
    while (consume('elseif')) {
      pushLocation(marker);
      condition = parseExpectedExpression(flowContext);
      expect('then');
      if (options.scope) createScope();
      flowContext.pushScope();
      body = parseBlock(flowContext);
      flowContext.popScope();
      if (options.scope) destroyScope();
      clauses.push(finishNode(ast.elseifClause(condition, body)));
      if (trackLocations) marker = createLocationMarker();
    }

    if (consume('else')) {
      // Include the `else` in the location of ElseClause.
      if (trackLocations) {
        marker = new Marker(previousToken);
        locations.push(marker);
      }
      if (options.scope) createScope();
      flowContext.pushScope();
      body = parseBlock(flowContext);
      flowContext.popScope();
      if (options.scope) destroyScope();
      clauses.push(finishNode(ast.elseClause(body)));
    }

    expect('end');
    return finishNode(ast.ifStatement(clauses));
  }

  // There are two types of for statements, generic and numeric.
  //
  //     for ::= Name '=' exp ',' exp [',' exp] 'do' block 'end'
  //     for ::= namelist 'in' explist 'do' block 'end'
  //     namelist ::= Name {',' Name}
  //     explist ::= exp {',' exp}

  function parseForStatement(flowContext) {
    var variable = parseIdentifier()
      , body;

    // The start-identifier is local.

    if (options.scope) {
      createScope();
      scopeIdentifier(variable);
    }

    // If the first expression is followed by a `=` punctuator, this is a
    // Numeric For Statement.
    if (consume('=')) {
      // Start expression
      var start = parseExpectedExpression(flowContext);
      expect(',');
      // End expression
      var end = parseExpectedExpression(flowContext);
      // Optional step expression
      var step = consume(',') ? parseExpectedExpression(flowContext) : null;

      expect('do');
      flowContext.pushScope(true);
      body = parseBlock(flowContext);
      flowContext.popScope();
      expect('end');
      if (options.scope) destroyScope();

      return finishNode(ast.forNumericStatement(variable, start, end, step, body));
    }
    // If not, it's a Generic For Statement
    else {
      // The namelist can contain one or more identifiers.
      var variables = [variable];
      while (consume(',')) {
        variable = parseIdentifier();
        // Each variable in the namelist is locally scoped.
        if (options.scope) scopeIdentifier(variable);
        variables.push(variable);
      }
      expect('in');
      var iterators = [];

      // One or more expressions in the explist.
      do {
        var expression = parseExpectedExpression(flowContext);
        iterators.push(expression);
      } while (consume(','));

      expect('do');
      flowContext.pushScope(true);
      body = parseBlock(flowContext);
      flowContext.popScope();
      expect('end');
      if (options.scope) destroyScope();

      return finishNode(ast.forGenericStatement(variables, iterators, body));
    }
  }

  // Local statements can either be variable assignments or function
  // definitions. If a function definition is found, it will be delegated to
  // `parseFunctionDeclaration()` with the isLocal flag.
  //
  // This AST structure might change into a local assignment with a function
  // child.
  //
  //     local ::= 'local' 'function' Name funcdecl
  //        | 'local' Name {',' Name} ['=' exp {',' exp}]

  function parseLocalStatement(flowContext) {
    var name
      , declToken = previousToken;

    if (Identifier === token.type) {
      var variables = []
        , init = [];

      do {
        name = parseIdentifier();

        variables.push(name);
        flowContext.addLocal(name.name, declToken);
      } while (consume(','));

      if (consume('=')) {
        do {
          var expression = parseExpectedExpression(flowContext);
          init.push(expression);
        } while (consume(','));
      }

      // Declarations doesn't exist before the statement has been evaluated.
      // Therefore assignments can't use their declarator. And the identifiers
      // shouldn't be added to the scope until the statement is complete.
      if (options.scope) {
        for (var i = 0, l = variables.length; i < l; ++i) {
          scopeIdentifier(variables[i]);
        }
      }

      return finishNode(ast.localStatement(variables, init));
    }
    if (consume('function')) {
      name = parseIdentifier();
      flowContext.addLocal(name.name, declToken);

      if (options.scope) {
        scopeIdentifier(name);
        createScope();
      }

      // MemberExpressions are not allowed in local function statements.
      return parseFunctionDeclaration(name, true);
    } else {
      raiseUnexpectedToken('<name>', token);
    }
  }

  //     assignment ::= varlist '=' explist
  //     var ::= Name | prefixexp '[' exp ']' | prefixexp '.' Name
  //     varlist ::= var {',' var}
  //     explist ::= exp {',' exp}
  //
  //     call ::= callexp
  //     callexp ::= prefixexp args | prefixexp ':' Name args

  function parseAssignmentOrCallStatement(flowContext) {
    // Keep a reference to the previous token for better error messages in case
    // of invalid statement
    var previous = token
      , marker, startMarker;
    var lvalue, base, name;

    var targets = [];

    if (trackLocations) startMarker = createLocationMarker();

    do {
      if (trackLocations) marker = createLocationMarker();

      if (Identifier === token.type) {
        name = token.value;
        base = parseIdentifier();
        // Set the parent scope.
        if (options.scope) attachScope(base, scopeHasName(name));
        lvalue = true;
      } else if ('(' === token.value) {
        next();
        base = parseExpectedExpression(flowContext);
        expect(')');
        lvalue = false;
      } else {
        return unexpected(token);
      }

      both: for (;;) {
        var newBase;

        switch (StringLiteral === token.type ? '"' : token.value) {
        case '.':
        case '[':
          lvalue = true;
          break;
        case ':':
        case '(':
        case '{':
        case '"':
          lvalue = null;
          break;
        default:
          break both;
        }

        base = parsePrefixExpressionPart(base, marker, flowContext);
      }

      targets.push(base);

      if (',' !== token.value)
        break;

      if (!lvalue) {
        return unexpected(token);
      }

      next();
    } while (true);

    if (targets.length === 1 && lvalue === null) {
      pushLocation(marker);
      return finishNode(ast.callStatement(targets[0]));
    } else if (!lvalue) {
      return unexpected(token);
    }

    expect('=');

    var values = [];

    do {
      values.push(parseExpectedExpression(flowContext));
    } while (consume(','));

    pushLocation(startMarker);
    return finishNode(ast.assignmentStatement(targets, values));
  }

  // ### Non-statements

  //     Identifier ::= Name

  function parseIdentifier() {
    markLocation();
    var identifier = token.value;
    if (Identifier !== token.type) raiseUnexpectedToken('<name>', token);
    next();
    return finishNode(ast.identifier(identifier));
  }

  // Parse the functions parameters and body block. The name should already
  // have been parsed and passed to this declaration function. By separating
  // this we allow for anonymous functions in expressions.
  //
  // For local functions there's a boolean parameter which needs to be set
  // when parsing the declaration.
  //
  //     funcdecl ::= '(' [parlist] ')' block 'end'
  //     parlist ::= Name {',' Name} | [',' '...'] | '...'

  function parseFunctionDeclaration(name, isLocal) {
    var flowContext = makeFlowContext();
    flowContext.pushScope();

    var parameters = [];
    expect('(');

    // The declaration has arguments
    if (!consume(')')) {
      // Arguments are a comma separated list of identifiers, optionally ending
      // with a vararg.
      while (true) {
        if (Identifier === token.type) {
          var parameter = parseIdentifier();
          // Function parameters are local.
          if (options.scope) scopeIdentifier(parameter);

          parameters.push(parameter);

          if (consume(',')) continue;
        }
        // No arguments are allowed after a vararg.
        else if (VarargLiteral === token.type) {
          flowContext.allowVararg = true;
          parameters.push(parsePrimaryExpression(flowContext));
        } else {
          raiseUnexpectedToken('<name> or \'...\'', token);
        }
        expect(')');
        break;
      }
    }

    var body = parseBlock(flowContext);
    flowContext.popScope();
    expect('end');
    if (options.scope) destroyScope();

    isLocal = isLocal || false;
    return finishNode(ast.functionStatement(name, parameters, isLocal, body));
  }

  // Parse the function name as identifiers and member expressions.
  //
  //     Name {'.' Name} [':' Name]

  function parseFunctionName() {
    var base, name, marker;

    if (trackLocations) marker = createLocationMarker();
    base = parseIdentifier();

    if (options.scope) {
      attachScope(base, scopeHasName(base.name));
      createScope();
    }

    while (consume('.')) {
      pushLocation(marker);
      name = parseIdentifier();
      base = finishNode(ast.memberExpression(base, '.', name));
    }

    if (consume(':')) {
      pushLocation(marker);
      name = parseIdentifier();
      base = finishNode(ast.memberExpression(base, ':', name));
      if (options.scope) scopeIdentifierName('self');
    }

    return base;
  }

  //     tableconstructor ::= '{' [fieldlist] '}'
  //     fieldlist ::= field {fieldsep field} fieldsep
  //     field ::= '[' exp ']' '=' exp | Name = 'exp' | exp
  //
  //     fieldsep ::= ',' | ';'

  function parseTableConstructor(flowContext) {
    var fields = []
      , key, value;

    while (true) {
      markLocation();
      if (Punctuator === token.type && consume('[')) {
        key = parseExpectedExpression(flowContext);
        expect(']');
        expect('=');
        value = parseExpectedExpression(flowContext);
        fields.push(finishNode(ast.tableKey(key, value)));
      } else if (Identifier === token.type) {
        if ('=' === lookahead.value) {
          key = parseIdentifier();
          next();
          value = parseExpectedExpression(flowContext);
          fields.push(finishNode(ast.tableKeyString(key, value)));
        } else {
          value = parseExpectedExpression(flowContext);
          fields.push(finishNode(ast.tableValue(value)));
        }
      } else {
        if (null == (value = parseExpression(flowContext))) {
          locations.pop();
          break;
        }
        fields.push(finishNode(ast.tableValue(value)));
      }
      if (',;'.indexOf(token.value) >= 0) {
        next();
        continue;
      }
      break;
    }
    expect('}');
    return finishNode(ast.tableConstructorExpression(fields));
  }

  // Expression parser
  // -----------------
  //
  // Expressions are evaluated and always return a value. If nothing is
  // matched null will be returned.
  //
  //     exp ::= (unop exp | primary | prefixexp ) { binop exp }
  //
  //     primary ::= nil | false | true | Number | String | '...'
  //          | functiondef | tableconstructor
  //
  //     prefixexp ::= (Name | '(' exp ')' ) { '[' exp ']'
  //          | '.' Name | ':' Name args | args }
  //

  function parseExpression(flowContext) {
    var expression = parseSubExpression(0, flowContext);
    return expression;
  }

  // Parse an expression expecting it to be valid.

  function parseExpectedExpression(flowContext) {
    var expression = parseExpression(flowContext);
    if (null == expression) raiseUnexpectedToken('<expression>', token);
    else return expression;
  }


  // Return the precedence priority of the operator.
  //
  // As unary `-` can't be distinguished from binary `-`, unary precedence
  // isn't described in this table but in `parseSubExpression()` itself.
  //
  // As this function gets hit on every expression it's been optimized due to
  // the expensive CompareICStub which took ~8% of the parse time.

  function binaryPrecedence(operator) {
    var charCode = operator.charCodeAt(0)
      , length = operator.length;

    if (1 === length) {
      switch (charCode) {
        case 94: return 12; // ^
        case 42: case 47: case 37: return 10; // * / %
        case 43: case 45: return 9; // + -
        case 38: return 6; // &
        case 126: return 5; // ~
        case 124: return 4; // |
        case 60: case 62: return 3; // < >
      }
    } else if (2 === length) {
      switch (charCode) {
        case 47: return 10; // //
        case 46: return 8; // ..
        case 60: case 62:
            if('<<' === operator || '>>' === operator) return 7; // << >>
            return 3; // <= >=
        case 61: case 126: return 3; // == ~=
        case 111: return 1; // or
      }
    } else if (97 === charCode && 'and' === operator) return 2;
    return 0;
  }

  // Implement an operator-precedence parser to handle binary operator
  // precedence.
  //
  // We use this algorithm because it's compact, it's fast and Lua core uses
  // the same so we can be sure our expressions are parsed in the same manner
  // without excessive amounts of tests.
  //
  //     exp ::= (unop exp | primary | prefixexp ) { binop exp }

  function parseSubExpression(minPrecedence, flowContext) {
    var operator = token.value
    // The left-hand side in binary operations.
      , expression, marker;

    if (trackLocations) marker = createLocationMarker();

    // UnaryExpression
    if (isUnary(token)) {
      markLocation();
      next();
      var argument = parseSubExpression(10, flowContext);
      if (argument == null) raiseUnexpectedToken('<expression>', token);
      expression = finishNode(ast.unaryExpression(operator, argument));
    }
    if (null == expression) {
      // PrimaryExpression
      expression = parsePrimaryExpression(flowContext);

      // PrefixExpression
      if (null == expression) {
        expression = parsePrefixExpression(flowContext);
      }
    }
    // This is not a valid left hand expression.
    if (null == expression) return null;

    var precedence;
    while (true) {
      operator = token.value;

      precedence = (Punctuator === token.type || Keyword === token.type) ?
        binaryPrecedence(operator) : 0;

      if (precedence === 0 || precedence <= minPrecedence) break;
      // Right-hand precedence operators
      if ('^' === operator || '..' === operator) --precedence;
      next();
      var right = parseSubExpression(precedence, flowContext);
      if (null == right) raiseUnexpectedToken('<expression>', token);
      // Push in the marker created before the loop to wrap its entirety.
      if (trackLocations) locations.push(marker);
      expression = finishNode(ast.binaryExpression(operator, expression, right));

    }
    return expression;
  }

  //     prefixexp ::= prefix {suffix}
  //     prefix ::= Name | '(' exp ')'
  //     suffix ::= '[' exp ']' | '.' Name | ':' Name args | args
  //
  //     args ::= '(' [explist] ')' | tableconstructor | String

  function parsePrefixExpressionPart(base, marker, flowContext) {
    var expression, identifier;

    if (Punctuator === token.type) {
      switch (token.value) {
        case '[':
          pushLocation(marker);
          next();
          expression = parseExpectedExpression(flowContext);
          expect(']');
          return finishNode(ast.indexExpression(base, expression));
        case '.':
          pushLocation(marker);
          next();
          identifier = parseIdentifier();
          return finishNode(ast.memberExpression(base, '.', identifier));
        case ':':
          pushLocation(marker);
          next();
          identifier = parseIdentifier();
          base = finishNode(ast.memberExpression(base, ':', identifier));
          // Once a : is found, this has to be a CallExpression, otherwise
          // throw an error.
          pushLocation(marker);
          return parseCallExpression(base, flowContext);
        case '(': case '{': // args
          pushLocation(marker);
          return parseCallExpression(base, flowContext);
      }
    } else if (StringLiteral === token.type) {
      pushLocation(marker);
      return parseCallExpression(base, flowContext);
    }

    return null;
  }

  function parsePrefixExpression(flowContext) {
    var base, name, marker;

    if (trackLocations) marker = createLocationMarker();

    // The prefix
    if (Identifier === token.type) {
      name = token.value;
      base = parseIdentifier();
      // Set the parent scope.
      if (options.scope) attachScope(base, scopeHasName(name));
    } else if (consume('(')) {
      base = parseExpectedExpression(flowContext);
      expect(')');
    } else {
      return null;
    }

    // The suffix
    for (;;) {
      var newBase = parsePrefixExpressionPart(base, marker, flowContext);
      if (newBase === null)
        break;
      base = newBase;
    }

    return base;
  }

  //     args ::= '(' [explist] ')' | tableconstructor | String

  function parseCallExpression(base, flowContext) {
    if (Punctuator === token.type) {
      switch (token.value) {
        case '(':
          if (!features.emptyStatement) {
            if (token.line !== previousToken.line)
              raise(null, errors.ambiguousSyntax, token.value);
          }
          next();

          // List of expressions
          var expressions = [];
          var expression = parseExpression(flowContext);
          if (null != expression) expressions.push(expression);
          while (consume(',')) {
            expression = parseExpectedExpression(flowContext);
            expressions.push(expression);
          }

          expect(')');
          return finishNode(ast.callExpression(base, expressions));

        case '{':
          markLocation();
          next();
          var table = parseTableConstructor(flowContext);
          return finishNode(ast.tableCallExpression(base, table));
      }
    } else if (StringLiteral === token.type) {
      return finishNode(ast.stringCallExpression(base, parsePrimaryExpression(flowContext)));
    }

    raiseUnexpectedToken('function arguments', token);
  }

  //     primary ::= String | Numeric | nil | true | false
  //          | functiondef | tableconstructor | '...'

  function parsePrimaryExpression(flowContext) {
    var literals = StringLiteral | NumericLiteral | BooleanLiteral | NilLiteral | VarargLiteral
      , value = token.value
      , type = token.type
      , marker;

    if (trackLocations) marker = createLocationMarker();

    if (type === VarargLiteral && !flowContext.allowVararg) {
      raise(token, errors.cannotUseVararg, token.value);
    }

    if (type & literals) {
      pushLocation(marker);
      var raw = input.slice(token.range[0], token.range[1]);
      next();
      return finishNode(ast.literal(type, value, raw));
    } else if (Keyword === type && 'function' === value) {
      pushLocation(marker);
      next();
      if (options.scope) createScope();
      return parseFunctionDeclaration(null);
    } else if (consume('{')) {
      pushLocation(marker);
      return parseTableConstructor(flowContext);
    }
  }

  // Parser
  // ------

  // Export the main parser.
  //
  //   - `wait` Hold parsing until end() is called. Defaults to false
  //   - `comments` Store comments. Defaults to true.
  //   - `scope` Track identifier scope. Defaults to false.
  //   - `locations` Store location information. Defaults to false.
  //   - `ranges` Store the start and end character locations. Defaults to
  //     false.
  //   - `onCreateNode` Callback which will be invoked when a syntax node is
  //     created.
  //   - `onCreateScope` Callback which will be invoked when a new scope is
  //     created.
  //   - `onDestroyScope` Callback which will be invoked when the current scope
  //     is destroyed.
  //
  // Example:
  //
  //     var parser = require('luaparser');
  //     parser.parse('i = 0');

  exports.parse = parse;

  var versionFeatures = {
    '5.1': {
    },
    '5.2': {
      labels: true,
      emptyStatement: true,
      hexEscapes: true,
      skipWhitespaceEscape: true,
      strictEscapes: true,
      relaxedBreak: true
    },
    '5.3': {
      labels: true,
      emptyStatement: true,
      hexEscapes: true,
      skipWhitespaceEscape: true,
      strictEscapes: true,
      unicodeEscapes: true,
      bitwiseOperators: true,
      integerDivision: true,
      relaxedBreak: true
    },
    'LuaJIT': {
      // XXX: LuaJIT language features may depend on compilation options; may need to
      // rethink how to handle this. Specifically, there is a LUAJIT_ENABLE_LUA52COMPAT
      // that removes contextual goto. Maybe add 'LuaJIT-5.2compat' as well?
      labels: true,
      contextualGoto: true,
      hexEscapes: true,
      skipWhitespaceEscape: true,
      strictEscapes: true,
      unicodeEscapes: true,
      imaginaryNumbers: true,
      integerSuffixes: true
    }
  };

  function parse(_input, _options) {
    if ('undefined' === typeof _options && 'object' === typeof _input) {
      _options = _input;
      _input = undefined;
    }
    if (!_options) _options = {};

    input = _input || '';
    options = assign({}, defaultOptions, _options);

    // Rewind the lexer
    index = 0;
    line = 1;
    lineStart = 0;
    length = input.length;
    // When tracking identifier scope, initialize with an empty scope.
    scopes = [[]];
    scopeDepth = 0;
    globals = [];
    locations = [];

    if (!Object.prototype.hasOwnProperty.call(versionFeatures, options.luaVersion)) {
      throw new Error(sprintf("Lua version '%1' not supported", options.luaVersion));
    }

    features = assign({}, versionFeatures[options.luaVersion]);
    if (options.extendedIdentifiers !== void 0)
      features.extendedIdentifiers = !!options.extendedIdentifiers;

    if (!Object.prototype.hasOwnProperty.call(encodingModes, options.encodingMode)) {
      throw new Error(sprintf("Encoding mode '%1' not supported", options.encodingMode));
    }

    encodingMode = encodingModes[options.encodingMode];

    if (options.comments) comments = [];
    if (!options.wait) return end();
    return exports;
  }

  // Write to the source code buffer without beginning the parse.
  exports.write = write;

  function write(_input) {
    input += String(_input);
    length = input.length;
    return exports;
  }

  // Send an EOF and begin parsing.
  exports.end = end;

  function end(_input) {
    if ('undefined' !== typeof _input) write(_input);

    // Ignore shebangs.
    if (input && input.substr(0, 2) === '#!') input = input.replace(/^.*/, function (line) {
      return line.replace(/./g, ' ');
    });

    length = input.length;
    trackLocations = options.locations || options.ranges;
    // Initialize with a lookahead token.
    lookahead = lex();

    var chunk = parseChunk();
    if (options.comments) chunk.comments = comments;
    if (options.scope) chunk.globals = globals;

    /* istanbul ignore if */
    if (locations.length > 0)
      throw new Error('Location tracking failed. This is most likely a bug in luaparse');

    return chunk;
  }

}));
/* vim: set sw=2 ts=2 et tw=79 : */

return module.exports;})();
  function lua(text) {
    const ast = CatalogueLua.parse(text, { encodingMode: 'none', luaVersion: '5.3' }),
      env = {};
    function v(n) {
      if (!n) return null;
      switch (n.type) {
        case 'StringLiteral':
          return n.raw.startsWith('[')
            ? n.raw.replace(/^\[=*\[\n?/, '').replace(/\]=*\]$/, '')
            : n.raw
                .slice(1, -1)
                .replace(/\\(\d{1,3}|.)/gs, (_, s) =>
                  /^\d+$/.test(s)
                    ? String.fromCharCode(+s)
                    : ({ n: '\n', r: '\r', t: '\t', b: '\b', f: '\f', v: '\v', a: '\x07' }[s] ?? s),
                );
        case 'NumericLiteral':
        case 'BooleanLiteral':
          return n.value;
        case 'NilLiteral':
          return null;
        case 'Identifier':
          return env[n.name] ?? null;
        case 'UnaryExpression':
          return n.operator === '-' ? -v(n.argument) : null;
        case 'BinaryExpression': {
          const a = v(n.left),
            b = v(n.right);
          return n.operator === '+'
            ? a + b
            : n.operator === '-'
              ? a - b
              : n.operator === '*'
                ? a * b
                : n.operator === '/'
                  ? a / b
                  : n.operator === '^'
                    ? a ** b
                    : n.operator === '..'
                      ? String(a) + String(b)
                      : null;
        }
        case 'TableConstructorExpression': {
          if (n.fields.every((f) => f.type === 'TableValue'))
            return n.fields.map((f) => v(f.value));
          const o = {};
          let i = 1;
          for (const f of n.fields) {
            const key =
              f.type === 'TableKeyString' ? f.key.name : f.type === 'TableKey' ? v(f.key) : i++;
            if (!['__proto__', 'constructor', 'prototype'].includes(String(key)))
              o[key] = v(f.value);
          }
          return o;
        }
        case 'CallExpression':
          return n.arguments?.length ? v(n.arguments[0]) : null;
        default:
          return null;
      }
    }
    let largest = {};
    for (const s of ast.body) {
      if (s.type === 'LocalStatement' || s.type === 'AssignmentStatement')
        s.variables.forEach((a, i) => {
          if (a.type === 'Identifier') {
            env[a.name] = v(s.init[i]);
            if (
              env[a.name] &&
              typeof env[a.name] === 'object' &&
              Object.keys(env[a.name]).length > Object.keys(largest).length
            )
              largest = env[a.name];
          }
        });
      if (s.type === 'ReturnStatement') {
        const a = v(s.arguments[0]);
        if (a && typeof a === 'object' && Object.keys(a).length) return a;
      }
    }
    return largest;
  }
  async function normalizeOnlineModules(rawPages, baseline, date) {
    const wiki = (p) => 'https://wiki.warframe.com/w/' + p.replaceAll(' ', '_'),
      id = (value) => slug(value) || 'unknown';
    const raw = async (page) => {
      if (!Object.hasOwn(rawPages, page)) throw Error('Missing online source: ' + page);
      return rawPages[page];
    };
    const clean = (s) =>
      String(s || '')
        .replace(/<[^>]*>/g, '')
        .replaceAll('\\r\\n', '\n')
        .replaceAll('\\n', '\n')
        .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
        .replace(/\[\[([^\]]+)\]\]/g, '$1')
        .replace(
          /\{\{(?:D|Faction|Weapon|M|A|Arcane)\|([^|}]+)(?:\|([^}]+))?\}\}/g,
          (_, a, b) => b || a,
        )
        .replace(/'{2,}/g, '')
        .replace(/\[\[File:[^\]]+\]\]/g, '')
        .trim();
    const lower = (o) =>
      Object.fromEntries(
        Object.entries(o || {})
          .filter(([, v]) => typeof v === 'number' && v > 0)
          .map(([k, v]) => [k.toLowerCase(), v]),
      );
    const list = (x) => (Array.isArray(x) ? x : []);
    const source = (p) => ({ url: wiki(p), snapshot: date, license: 'CC BY-NC-SA 3.0' });
    async function modData() {
      return lua(await raw('Module:Mods/data')).Mods;
    }
    function simpleEffects(text) {
      const effects = [];
      let unknown = false;
      for (let line of clean(text).split(/\r?\n/)) {
        line = line.trim();
        if (!line) continue;
        if (
          /^(On |While |When |With |After |Upon )|stacks|per Status|Combo Multiplier|chance for|chance to|set bonus|on hit/i.test(
            line,
          )
        ) {
          unknown = true;
          continue;
        }
        let m = line.match(/^x([\d.]+)\s+Damage to (.+)$/i);
        if (m) {
          effects.push({ stat: 'faction:' + id(m[2]), value: +m[1] - 1 });
          continue;
        }
        m = line.match(/^([+-]?[\d.]+)(%|x|s|m)?\s+(.+?)(?:\.|$)/i);
        if (!m) {
          unknown = true;
          continue;
        }
        const v = +m[1] / (m[2] === '%' ? 100 : 1),
          label = m[3].toLowerCase();
        const match = label.startsWith('weak point critical')
          ? 'weakCrit'
          : label.startsWith('weak point damage')
            ? 'weakDamage'
            : label.startsWith('status damage')
              ? 'statusDamage'
              : label.startsWith('critical chance')
                ? 'critChance'
                : label.startsWith('critical damage')
                  ? 'critDamage'
                  : label.startsWith('status chance')
                    ? 'statusChance'
                    : label.startsWith('status duration')
                      ? 'statusDuration'
                      : label.startsWith('multishot')
                        ? 'multishot'
                        : label.startsWith('reload speed')
                          ? 'reload'
                          : label.startsWith('fire rate') || label.startsWith('attack speed')
                            ? 'fireRate'
                            : label.startsWith('magazine')
                              ? 'magazine'
                              : label.startsWith('damage') || label.startsWith('melee damage')
                                ? 'damage'
                                : label.startsWith('heavy attack wind')
                                  ? 'windUp'
                                  : label.startsWith('heavy attack efficiency')
                                    ? 'heavyEfficiency'
                                    : label.startsWith('initial combo')
                                      ? 'initialCombo'
                                      : label.startsWith('combo duration')
                                        ? 'comboDuration'
                                        : label.startsWith('punch through')
                                          ? 'punchThrough'
                                          : label.startsWith('range')
                                            ? 'range'
                                            : label.startsWith('ammo')
                                              ? 'ammo'
                                              : label.startsWith('projectile')
                                                ? 'projectileSpeed'
                                                : label.startsWith('weapon recoil') ||
                                                    label.startsWith('recoil')
                                                  ? 'recoil'
                                                  : label.startsWith('zoom')
                                                    ? 'zoom'
                                                    : label.startsWith('accuracy')
                                                      ? 'accuracy'
                                                      : null;
        let stat = match;
        for (const t of [
          'impact',
          'puncture',
          'slash',
          'heat',
          'cold',
          'electricity',
          'toxin',
          'radiation',
          'viral',
          'corrosive',
          'magnetic',
          'gas',
          'blast',
        ])
          if (label.startsWith(t)) stat = 'element:' + t;
        if (stat) effects.push({ stat, value: v });
        else unknown = true;
        if (
          /\bif\b|\bwhile\b|\bfor\b|\bon\b|heavy attacks|slide attack/i.test(label) &&
          !label.includes('x2 for bows')
        )
          unknown = true;
      }
      return { effects, unknown };
    }
    const modules = {};
    for (const p of [
      'primary',
      'secondary',
      'melee',
      'archwing',
      'companion',
      'railjack',
      'modular',
      'misc',
    ])
      modules[p] = lua(await raw('Module:Weapons/data/' + p));
    const weapons = [];
    for (const [group, entries] of Object.entries(modules))
      for (const [name, w] of Object.entries(entries)) {
        if (!list(w.Attacks).length) continue;
        const slot = w.Slot || 'Other',
          melee = /melee|hound|beast/i.test(slot),
          family = w.Family || name;
        const tags = list(w.CompatibilityTags),
          limits = [];
        if (w.Class === 'Exalted Weapon' || tags.includes('POWER_WEAPON'))
          limits.push(
            'Ability-specific passives and external ability interactions require verification.',
          );
        if (group === 'railjack')
          limits.push('Railjack heat, cooldown and space-status rules are not fully modeled.');
        if (w.DefaultUpgrades?.length) limits.push('Innate upgrade interactions are not modeled.');
        if (w.IncarnonImage)
          limits.push(
            'Incarnon charging and mode-switch cycles are not included in sustained DPS.',
          );
        if (group === 'modular' && w.Class !== 'Amp' && !melee)
          limits.push('Select modular parts before calculating.');
        weapons.push({
          id: id(name),
          name,
          category: slot,
          type: w.Class || slot,
          family,
          source: source('Module:Weapons/data/' + group),
          wiki: wiki(w.Link || name),
          description: '',
          rivenDisposition: w.Disposition ?? null,
          mastery: w.Mastery || 0,
          maxRank: w.MaxRank || 30,
          polarities: list(w.Polarities).map(normalizePolarity),
          exilusPolarity: normalizePolarity(w.ExilusPolarity),
          stancePolarity: normalizePolarity(w.StancePolarity),
          tags,
          traits: list(w.Traits),
          magazine: w.Magazine ?? null,
          reload: w.Reload ?? null,
          reloadStyle: w.ReloadStyle || 'Magazine',
          reloadDelay: w.ReloadDelay || 0,
          reloadRate: w.ReloadRate || 0,
          windUp: w.WindUp || 0.6,
          heavyAttack: w.HeavyAttack || null,
          limitations: limits,
          incarnonImage: w.IncarnonImage ? 'images/weapons/incarnon-' + id(name) + '.png' : null,
          incarnonImageSource: w.IncarnonImage
            ? 'https://wiki.warframe.com/w/File:' + encodeURIComponent(w.IncarnonImage)
            : '',
          attacks: w.Attacks.map((a, i) => ({
            id: 'attack-' + i,
            name: a.AttackName || 'Attack ' + (i + 1),
            damage: lower(a.Damage),
            critChance: a.CritChance ?? 0,
            critMultiplier: a.CritMultiplier ?? 1,
            statusChance: a.StatusChance ?? 0,
            fireRate: a.FireRate ?? 0,
            ammoCost: a.AmmoCost ?? 1,
            multishot: a.Multishot ?? 1,
            trigger: a.Trigger || w.Trigger || 'Normal',
            shotType: a.ShotType || 'Melee',
            chargeTime: a.ChargeTime || 0,
            burstCount: a.BurstCount || 1,
            burstDelay: a.BurstDelay || 0,
            magazine: a.IncarnonCharges ?? a.Magazine ?? null,
            forcedProcs: list(a.ForcedProcs).map((x) => x.toLowerCase()),
            falloff: a.Falloff
              ? {
                  start: a.Falloff.StartRange || 0,
                  end: a.Falloff.EndRange || 0,
                  reduction: a.Falloff.Reduction || 0,
                }
              : null,
            headshotBonus: a.ExtraHeadshotDmg || 0,
            limitations:
              /Incarnon/.test(a.AttackName) && !a.IncarnonCharges
                ? ['Incarnon attack cycle/ammunition metadata may be incomplete.']
                : [],
          })),
        });
      }
    // Duplicate names cannot be used as stable references.
    const uniqueWeapons = [...new Map(weapons.map((w) => [w.id, w])).values()];
    const modWiki = await modData();
    const mods = [];
    for (const [name, m] of Object.entries(modWiki)) {
      if (m._IgnoreEntry) continue;
      const parsed = simpleEffects(m.Description),
        special = {};
      if (/^(Primary|Pistol) Acuity$/.test(name)) {
        parsed.effects = [
          { stat: 'weakDamage', value: 3.5 },
          { stat: 'weakCrit', value: 3.5 },
          { stat: 'lockMultishot', value: 1 },
        ];
        parsed.unknown = false;
        special.handler = 'acuity';
      }
      if (name === 'Blood Rush') {
        parsed.effects = [{ stat: 'comboCrit', value: 0.4 }];
        parsed.unknown = false;
      }
      if (name === 'True Steel') {
        parsed.effects = [{ stat: 'critChance', value: 1.2, heavyDouble: true }];
        parsed.unknown = false;
      }
      if (name === 'Weeping Wounds') {
        parsed.effects = [{ stat: 'comboStatus', value: 0.4 }];
        parsed.unknown = false;
      }
      if (name === 'Condition Overload') {
        parsed.effects = [{ stat: 'conditionDamage', value: 0.8 }];
        parsed.unknown = false;
      }
      if (name === 'Hunter Munitions') {
        parsed.effects = [{ stat: 'hunterMunitions', value: 0.3 }];
        parsed.unknown = false;
      }
      if (name === 'Internal Bleeding' || name === 'Hemorrhage') {
        parsed.effects = [{ stat: 'impactBleed', value: 0.35 }];
        parsed.unknown = false;
      }
      if (
        name === 'Galvanized Chamber' ||
        name === 'Galvanized Hell' ||
        name === 'Galvanized Diffusion'
      ) {
        const n = name === 'Galvanized Hell' ? [1.1, 0.3] : [0.8, 0.3];
        parsed.effects = [
          { stat: 'multishot', value: n[0] },
          { stat: 'multishot', value: n[1], conditional: true },
        ];
        parsed.unknown = false;
        special.maxStacks = name === 'Galvanized Diffusion' ? 4 : 5;
      }
      // GunCO is weapon-dependent; never guess its stacking group.
      if (/^Galvanized (Aptitude|Savvy|Shot)$/.test(name)) parsed.unknown = true;
      const maxRank = m.MaxRank ?? 0;
      const iconSource = m.Icon
        ? 'https://wiki.warframe.com/w/File:' + encodeURIComponent(m.Icon)
        : '';
      mods.push({
        id: id(name),
        name,
        type: m.Type || 'Unknown',
        description: clean(m.Description),
        maxRank,
        baseDrain: m.BaseDrain ?? 0,
        polarity: (m.Polarity || '').toLowerCase(),
        isExilus: !!m.IsExilus,
        incompatible: list(m.Incompatible).map(id),
        compatibilityTags: list(m.CompatibilityTags),
        incompatibilityTags: list(m.IncompatibilityTags),
        compatibility: m.Type || '',
        handler: special.handler || '',
        maxStacks: special.maxStacks || 1,
        effects: parsed.effects,
        rankEffects: Array.from({ length: maxRank + 1 }, (_, r) =>
          parsed.effects.map((e) => ({
            ...e,
            value: e.stat === 'lockMultishot' ? 1 : (e.value * (r + 1)) / (maxRank + 1),
          })),
        ),
        limitations: parsed.unknown
          ? ['Conditional or special effects in the description are not fully modeled.']
          : [],
        iconSource,
        source: source('Module:Mods/data'),
        wiki: wiki(m.Link || name),
      });
    }
    const arcanes = [];
    const arcaneRaw = lua(await raw('Module:Arcane/data')).Arcanes;
    const known = {
      'Primary Merciless': [[{ stat: 'damage', value: 0.3, conditional: true }], 12],
      'Secondary Merciless': [[{ stat: 'damage', value: 0.3, conditional: true }], 12],
      'Primary Deadhead': [
        [
          { stat: 'damage', value: 1.2, conditional: true },
          { stat: 'headshot', value: 0.3 },
        ],
        3,
      ],
      'Secondary Deadhead': [
        [
          { stat: 'damage', value: 1.2, conditional: true },
          { stat: 'headshot', value: 0.3 },
        ],
        3,
      ],
      'Primary Dexterity': [[{ stat: 'damage', value: 0.6, conditional: true }], 6],
      'Secondary Dexterity': [[{ stat: 'damage', value: 0.6, conditional: true }], 6],
      'Arcane Acceleration': [[{ stat: 'fireRate', value: 0.9, conditional: true }], 1],
      'Arcane Avenger': [[{ stat: 'flatCrit', value: 0.45, conditional: true }], 1],
      'Arcane Rage': [[{ stat: 'damage', value: 1.8, conditional: true }], 1],
      'Arcane Precision': [[{ stat: 'damage', value: 3, conditional: true }], 1],
      'Arcane Strike': [[{ stat: 'fireRate', value: 0.6, conditional: true }], 1],
      'Arcane Fury': [[{ stat: 'damage', value: 1.8, conditional: true }], 1],
      'Arcane Velocity': [[{ stat: 'fireRate', value: 1.2, conditional: true }], 1],
      'Arcane Awakening': [[{ stat: 'damage', value: 1.5, conditional: true }], 1],
      'Primary Crux': [
        [
          { stat: 'statusChance', value: 0.3, conditional: true },
          { stat: 'ammoEfficiency', value: 0.06, conditional: true },
        ],
        10,
      ],
      'Conjunction Voltage': [
        [
          { stat: 'reload', value: 0.015, conditional: true },
          { stat: 'multishot', value: 0.03, conditional: true },
        ],
        40,
      ],
    };
    for (const [name, a] of Object.entries(arcaneRaw)) {
      const k = known[name],
        maxRank = a.MaxRank ?? 5;
      let effects = k ? k[0] : [],
        maxStacks = ARCANE_STACK_CAPS[name] ?? (k ? k[1] : 1);
      // Merciless reload bonus only exists at rank 5.
      const rankEffects = Array.from({ length: maxRank + 1 }, (_, r) =>
        effects.map((e) => ({ ...e, value: (e.value * (r + 1)) / (maxRank + 1) })),
      );
      if (/Merciless/.test(name)) rankEffects[maxRank].push({ stat: 'reload', value: 0.3 });
      arcanes.push({
        id: id(name),
        name,
        type: a.Type || 'Unknown',
        rarity: a.Rarity || '',
        description: clean(a.Description),
        maxRank,
        maxStacks,
        effects,
        rankEffects,
        limitations: k
          ? []
          : ['Arcane effect has not been modeled; the description is retained for editing.'],
        source: source('Module:Arcane/data'),
        wiki: wiki(a.Link || name),
      });
    }
    const dt = lua(await raw('Module:DamageTypes/data')),
      factions = [];
    const factionNames = new Set([
      'Grineer',
      'Kuva Grineer',
      'Corpus',
      'Corpus Amalgam',
      'Infested',
      'Infested Deimos',
      'Orokin',
      'Sentient',
      'Narmer',
      'The Murmur',
      'Techrot',
      'Scaldra',
      'Anarchs',
      'Stalker',
      'Unaffiliated',
    ]);
    for (const p of [
      'grineer',
      'corpus',
      'infestation',
      'orokin',
      'sentient',
      'stalker',
      'narmer',
      'themurmur',
      'techrot',
      'scaldra',
      'anarchs',
      'unaffiliated',
    ]) {
      const data = lua(await raw('Module:Enemies/data/' + p));
      for (const e of Object.values(data))
        if (e.General?.Faction) factionNames.add(e.General.Faction);
    }
    for (const name of factionNames) {
      const modifiers = {};
      for (const [t, v] of Object.entries(dt.Types)) {
        if (v.Positives?.includes(name)) modifiers[t.toLowerCase()] = 1.5;
        if (v.Negatives?.includes(name)) modifiers[t.toLowerCase()] = 0.5;
      }
      const group = /grineer|scaldra/i.test(name)
        ? 'grineer'
        : /corpus/i.test(name)
          ? 'corpus'
          : /infest/i.test(name)
            ? 'infested'
            : /orokin|corrupt|anarch/i.test(name)
              ? 'orokin'
              : /techrot/i.test(name)
                ? 'techrot'
                : 'standard';
      factions.push({
        id: id(name),
        name,
        modifiers,
        scaling: group,
        source: source('Module:DamageTypes/data'),
        limitations:
          dt.Health[name] || ['Stalker', 'Unaffiliated'].includes(name)
            ? []
            : ['Faction damage modifiers require verification.'],
      });
    }
    const enemies = [],
      enemyModules = [];
    for (const p of [
      'grineer',
      'corpus',
      'infestation',
      'orokin',
      'sentient',
      'stalker',
      'narmer',
      'themurmur',
      'techrot',
      'scaldra',
      'anarchs',
      'unaffiliated',
    ]) {
      const module = lua(await raw('Module:Enemies/data/' + p));
      enemyModules.push(module);
      for (const [name, e] of Object.entries(module)) {
        if (!e.Stats || !e.General) continue;
        const g = e.General,
          s = e.Stats;
        const weakpoints = list(s.Multis)
          .map((v, i) => {
            const m = String(v).match(/^(.*?):\s*([\d.]+)x/);
            return m
              ? {
                  id: 'weak-' + i,
                  name: m[1],
                  multiplier: +m[2],
                  headshot: /head|face/i.test(m[1]),
                  headcrit:
                    /head|face/i.test(m[1]) && !/corpus|murmur|techrot/i.test(g.Faction || '')
                      ? 2
                      : 1,
                  promotion: 0,
                }
              : null;
          })
          .filter(Boolean);
        const limits = [];
        if (s.BaseLevel == null)
          limits.push('Base level absent from source: level scaling is unavailable.');
        if (
          /boss|demol|acolyte|eidolon|archon/i.test((g.Type || '') + ' ' + name) ||
          s.DamageReduction ||
          s.DR ||
          s.StatusImmunity ||
          g.Faction === 'Sentient'
        )
          limits.push(
            'Special reduction, attenuation, adaptation or immunity requires verification.',
          );
        if (!weakpoints.length)
          limits.push('Weakpoint metadata unavailable; body hits remain available.');
        const image = g.Image || g.Icon;
        enemies.push({
          id: id(name),
          name,
          factionId: id(g.Faction || 'Unaffiliated'),
          type: g.Type || '',
          health: s.Health ?? 0,
          shield: s.Shield ?? 0,
          armor: s.Armor ?? 0,
          baseLevel: s.BaseLevel ?? null,
          eximusHealth: s.EximusHealth ?? s.Health ?? 0,
          eximusShield: s.EximusShield ?? s.Shield ?? 0,
          weakpoints,
          damageMultiplier: 1,
          statusImmune: false,
          statusCaps: {},
          modifiers: {},
          limitations: limits,
          image: 'images/placeholder.svg',
          imageSource: image ? 'https://wiki.warframe.com/w/File:' + encodeURIComponent(image) : '',
          source: source('Module:Enemies/data/' + p),
          wiki: wiki(g.Link || name),
        });
      }
    }
    const verifiedBasic = new Set([
      'Braton',
      'Braton Prime',
      'Braton Vandal',
      'Mk1-Braton',
      'Boltor',
      'Boltor Prime',
      'Latron',
      'Latron Prime',
      'Latron Wraith',
      'Burston',
      'Burston Prime',
      'Lato',
      'Lato Prime',
      'Lato Vandal',
      'Lex',
      'Lex Prime',
      'Afuris',
      'Afuris Prime',
      'Strun',
      'Strun Prime',
      'Strun Wraith',
      'Hek',
      'Tigris',
      'Tigris Prime',
      'Boar',
      'Boar Prime',
      'Soma',
      'Soma Prime',
      'Vectis',
      'Vectis Prime',
      'Paris',
      'Paris Prime',
      'Dread',
      'Lanka',
    ]);
    for (const w of uniqueWeapons)
      if (!verifiedBasic.has(w.name))
        w.limitations.push(
          'Weapon-specific passives and secondary-hit interactions have not been independently verified.',
        );
    for (const e of enemies) {
      for (const k of ['health', 'shield', 'armor', 'eximusHealth', 'eximusShield'])
        if (typeof e[k] !== 'number' || e[k] < 0) {
          e[k] = null;
          if (!e.limitations.includes('Base defense statistics are unavailable in the source.'))
            e.limitations.push('Base defense statistics are unavailable in the source.');
        }
      if (e.factionId === 'narmer')
        e.limitations.push('Narmer-specific stat-scaling exceptions require verification.');
    }
    const modular = lua(await raw('Module:Modular/data')),
      parts = [];
    for (const [group, data] of Object.entries(modular))
      if (['KitgunPrimary', 'KitgunSecondary', 'Zaw'].includes(group))
        for (const [kind, entries] of Object.entries(data))
          for (const [name, spec] of Object.entries(entries))
            parts.push({
              id: id(group + ' ' + kind + ' ' + name),
              name,
              group,
              kind,
              spec,
              source: source('Module:Modular/data'),
            });
    // Amp braces: additive gilded base-stat bonuses; utility changes are explicit.
    for (const [name, crit, status, energy, delay, rate] of [
      ['Clapkra', 0, 0, 40, 0, 0],
      ['Juttni', 0, 0, 0, -1, 0],
      ['Lohrin', 0.12, 0.12, 0, 0, 0],
      ['Anspatha', 0, 0, 20, 0, 15],
      ['Suo', 0, 0, 100, 2, 0],
      ['Plaga', 0, 0, -20, -1.5, 0],
      ['Certus', 0.2, 0, 0, 0, 0],
    ])
      parts.push({
        id: id('amp brace ' + name),
        name,
        group: 'Amp',
        kind: 'Brace',
        spec: {
          critChance: crit,
          statusChance: status,
          energy,
          reloadDelay: delay,
          reloadRate: rate,
        },
        source: source('Amp'),
      });
    const rivenStats = [
      ['damage', 'Damage', [1.65, 1.647, 2.196, 0.999, 1.647]],
      ['critChance', 'Critical chance', [1.4999, 0.9, 1.4999, 0.999, 1.8]],
      ['critDamage', 'Critical damage', [1.19997, 0.9, 0.9, 0.801, 0.9]],
      ['multishot', 'Multishot', [0.9, 1.197, 1.197, 0.603, null]],
      ['fireRate', 'Fire rate / attack speed', [0.6003, 0.9, 0.747, 0.6003, 0.549]],
      ['statusChance', 'Status chance', [0.9, 0.9, 0.9, 0.603, 0.9]],
      ['statusDuration', 'Status duration', [0.9999, 0.9999, 0.9999, 0.9999, 0.9999]],
      ['reload', 'Reload speed', [0.49995, 0.49995, 0.49995, 0.999, null]],
      ['magazine', 'Magazine capacity', [0.49995, 0.49995, 0.49995, 0.603, null]],
      ['ammo', 'Ammo maximum', [0.4995, 0.9, 0.9, 0.999, null]],
      ['punchThrough', 'Punch through', [2.7, 2.7, 2.7, 2.7, null], true],
      ['range', 'Melee range', [null, null, null, null, 1.94]],
      ['initialCombo', 'Initial combo', [null, null, null, null, 24.5]],
      ['comboDuration', 'Combo duration', [null, null, null, null, 8.1]],
      ['heavyEfficiency', 'Heavy attack efficiency', [null, null, null, null, 0.7344]],
      ['finisher', 'Finisher damage', [null, null, null, null, 1.197]],
      ['slideCrit', 'Slide critical chance', [null, null, null, null, 1.2]],
      ['extraCombo', 'Additional combo count chance', [null, null, null, null, 0.5877], true],
      [
        'negativeCombo',
        'Chance to gain combo count',
        [null, null, null, null, 1.0485],
        false,
        true,
      ],
      ['projectileSpeed', 'Projectile speed', [0.9, 0.9, 0.9, null, null]],
      ['recoil', 'Weapon recoil', [0.9, 0.9, 0.9, 0.9, null]],
      ['zoom', 'Zoom', [0.5999, 0.41994, 0.801, 0.5999, null]],
      ...['heat', 'cold', 'electricity', 'toxin'].map((t) => [
        'element:' + t,
        t + ' damage',
        [0.9, 0.9, 0.9, 1.197, 0.9],
        true,
      ]),
      ...['impact', 'puncture', 'slash'].map((t) => [
        'element:' + t,
        t + ' damage',
        [
          t === 'puncture' ? 1.19997 : 1.1997,
          t === 'puncture' ? 1.19997 : 1.1997,
          t === 'puncture' ? 1.19997 : 1.1997,
          0.9,
          t === 'puncture' ? 1.19997 : 1.197,
        ],
      ]),
      ...['grineer', 'corpus', 'infested'].map((t) => [
        'faction:' + t,
        'Damage to ' + t,
        [0.45, 0.45, 0.45, 0.45, 0.45],
      ]),
    ].map(([stat, name, values, positiveOnly, negativeOnly]) => ({
      id: stat,
      name,
      values: Object.fromEntries(
        ['Rifle', 'Shotgun', 'Pistol', 'Archgun', 'Melee'].map((c, i) => [c, values[i]]),
      ),
      positiveOnly: !!positiveOnly,
      negativeOnly: !!negativeOnly,
      source: source('Riven_Mods'),
    }));
    const stanceSource = lua(await raw('Module:Stances/data')),
      stances = [];
    for (const [name, s] of Object.entries(stanceSource)) {
      if (s.ConclaveOnly || !s.StanceName) continue;
      const m = mods.find((x) => x.name === name);
      const combos = [];
      for (const [kind, c] of Object.entries(s))
        if (c?.Attacks) {
          const hits = [];
          for (const a of c.Attacks)
            list(a.Dmg).forEach((n, i) =>
              hits.push({
                multiplier: n / 100,
                hits: list(a.Hits)[i] || 1,
                forcedProcs: list(a.Procs)[i] || [],
                type: list(a.Types)[i] || '',
                slashMultiplier: list(a.SlashMultiplier)[i] || 0,
                impactMultiplier: list(a.ImpactMultiplier)[i] || 0,
              }),
            );
          combos.push({
            id: id(kind),
            name: c.Name || kind,
            kind,
            duration: c.Duration ?? null,
            hits,
            limitations: c.Duration
              ? []
              : ['Combo duration not supplied; enter a measured duration.'],
          });
        }
      stances.push({
        id: id(name),
        name,
        type: s.WeaponType,
        modId: m?.id || null,
        polarity: m?.polarity || '',
        maxRank: m?.maxRank ?? 3,
        baseDrain: Math.abs(m?.baseDrain ?? 2),
        combos,
        source: source('Module:Stances/data'),
      });
    }

    const output = {
      weapons: uniqueWeapons,
      mods,
      arcanes,
      enemies: [...new Map(enemies.map((e) => [e.id, e])).values()],
      factions: [...new Map(factions.map((f) => [f.id, f])).values()],
      'modular-parts': parts,
      stances,
    };
    for (const c of ['weapons', 'mods', 'arcanes'])
      for (const r of output[c]) {
        const old = get(baseline, c, r.id);
        if (old) {
          if (c === 'weapons') delete r.limitations;
          else if (r.description === old.description) delete r.limitations;
          else r.limitations = [...old.limitations, ...r.limitations];
          if (c === 'weapons') {
            r.incarnonVariant = old.incarnonVariant;
            delete r.description;
          } else if (r.description === old.description) {
            for (const field of [
              'effects',
              'rankEffects',
              'handler',
              'maxStacks',
              'compatibilityTags',
              'incompatibilityTags',
            ])
              if (Object.hasOwn(old, field)) r[field] = clone(old[field]);
          }
          if (
            c === 'mods' &&
            r.description === old.description &&
            r.maxRank === old.maxRank &&
            old.rankDescriptions
          )
            r.rankDescriptions = clone(old.rankDescriptions);
          if (c !== 'weapons' && (r.description !== old.description || r.maxRank !== old.maxRank)) {
            const parsed = c === 'mods' ? simpleEffects(r.description) : null;
            if (c === 'arcanes' || r.handler || parsed.unknown) {
              r.effects = [];
              r.rankEffects = Array.from({ length: r.maxRank + 1 }, () => []);
              r.limitations = [
                ...new Set([
                  ...(old.limitations || []),
                  'Online mod/arcane description or rank changed; verify its conditional mechanics before inclusion in totals.',
                ]),
              ];
            } else {
              r.effects = parsed.effects;
              r.rankEffects = Array.from({ length: r.maxRank + 1 }, (_, rank) =>
                r.effects.map((e) => ({ ...e, value: (e.value * (rank + 1)) / (r.maxRank + 1) })),
              );
            }
          }
          r.image = old.image;
          r.imageSource = old.imageSource;
          if (c === 'mods') {
            r.icon = old.icon;
            r.iconFallback = old.iconFallback;
            r.rarity = old.rarity;
            r.iconSource = r.iconSource || old.iconSource;
          }
        } else {
          r.image = 'images/placeholder.svg';
          const rawData =
            c === 'mods'
              ? modWiki[r.name]
              : c === 'arcanes'
                ? arcaneRaw[r.name]
                : Object.values(modules)
                    .map((m) => m[r.name])
                    .find(Boolean);
          const file = rawData?.Image || rawData?.Icon;
          if (file) r.imageSource = 'https://wiki.warframe.com/w/File:' + encodeURIComponent(file);
        }
      }
    for (const c of ['enemies', 'factions', 'stances', 'modular-parts'])
      for (const r of output[c]) if (get(baseline, c, r.id)) delete r.limitations;
    return output;
  }

  const ONLINE_CATEGORIES = [
    'weapons',
    'mods',
    'arcanes',
    'enemies',
    'factions',
    'modular-parts',
    'stances',
    'incarnon-evolutions',
  ];
  const ONLINE_MODULES = [
    ...[
      'primary',
      'secondary',
      'melee',
      'archwing',
      'companion',
      'railjack',
      'modular',
      'misc',
    ].map((x) => 'Module:Weapons/data/' + x),
    ...[
      'grineer',
      'corpus',
      'infestation',
      'orokin',
      'sentient',
      'stalker',
      'narmer',
      'themurmur',
      'techrot',
      'scaldra',
      'anarchs',
      'unaffiliated',
    ].map((x) => 'Module:Enemies/data/' + x),
    'Module:Mods/data',
    'Module:Arcane/data',
    'Module:DamageTypes/data',
    'Module:Modular/data',
    'Module:Stances/data',
  ];
  function mergeOnlineCatalogue(local, online, baseline) {
    const candidate = clone(local),
      summary = [];
    for (const c of ONLINE_CATEGORIES) {
      const incoming = online[c];
      if (!incoming) continue;
      const oldHashes = local[c].onlineHashes || {},
        hashes = clone(local[c].onlineHashes || {}),
        row = { category: c, added: 0, updated: 0, preserved: 0, retained: 0 };
      const ids = new Set(incoming.map((r) => r.id));
      for (const r of records(local, c)) if (!ids.has(r.id)) row.retained++;
      candidate[c].onlineReference = clone(local[c].onlineReference || {});
      for (const source of incoming) {
        const old = get(local, c, source.id),
          base = get(baseline, c, source.id),
          incomingRecord = clone(source);
        if (c === 'weapons' && old && Array.isArray(incomingRecord.attacks)) {
          const prior = new Map(
            arr(old.attacks)
              .filter((a) => a.componentOf)
              .map((a) => [
                a.id,
                { componentOf: a.componentOf, componentSource: a.componentSource },
              ]),
          );
          incomingRecord.attacks = incomingRecord.attacks.map((a) =>
            prior.has(a.id) ? { ...a, ...prior.get(a.id) } : a,
          );
        }
        hashes[source.id] ||= {};
        let changed = false;
        if (!old) {
          candidate[c].records.push(clone(incomingRecord));
          row.added++;
        } else
          for (const [field, value] of Object.entries(incomingRecord)) {
            if (
              value === undefined ||
              field === 'image' ||
              field === 'imageSource' ||
              field === 'id'
            )
              continue;
            if (field === 'source') {
              get(candidate, c, source.id).source = clone(value);
              continue;
            }
            const hash = recordFingerprint(value),
              currentHash = recordFingerprint(old[field] ?? null),
              baselineValue = local[c].onlineReference?.[source.id]?.[field] ?? base?.[field],
              baselineHash =
                oldHashes[source.id]?.[field] ?? recordFingerprint(baselineValue ?? null);
            if (hash !== recordFingerprint(base?.[field] ?? null)) hashes[source.id][field] = hash;
            else delete hashes[source.id][field];
            if (currentHash === hash) continue;
            if (currentHash === baselineHash || !Object.hasOwn(old, field)) {
              get(candidate, c, source.id)[field] = clone(value);
              changed = true;
            } else row.preserved++;
          }
        if (!old)
          for (const [field, value] of Object.entries(incomingRecord))
            if (value !== undefined) hashes[source.id][field] = recordFingerprint(value);
        candidate[c].onlineReference[source.id] = clone(incomingRecord);
        if (changed) row.updated++;
      }
      candidate[c].onlineHashes = hashes;
      candidate[c].snapshot = new Date().toISOString().slice(0, 10);
      summary.push(row);
    }
    const errors = validateDatabase(candidate);
    if (errors.length)
      throw Error('Online catalogue failed validation: ' + errors.slice(0, 8).join('\n'));
    return { candidate, summary };
  }
  async function fetchWikiPages(titles, progress = () => {}) {
    const pages = {},
      revisions = {};
    for (let start = 0; start < titles.length; start += 20) {
      const batch = titles.slice(start, start + 20),
        url = new URL('https://wiki.warframe.com/api.php');
      url.search = new URLSearchParams({
        action: 'query',
        format: 'json',
        formatversion: '2',
        origin: '*',
        prop: 'revisions',
        rvprop: 'content|timestamp|ids',
        rvslots: 'main',
        titles: batch.join('|'),
      });
      const response = await fetch(url, { signal: AbortSignal.timeout(30000), cache: 'no-store' });
      if (!response.ok) throw Error('Wiki returned HTTP ' + response.status);
      const data = await response.json();
      if (data.error) throw Error(data.error.info || data.error.code);
      for (const page of data.query?.pages || []) {
        if (page.missing) continue;
        const revision = page.revisions?.[0],
          text = revision?.slots?.main?.content;
        if (typeof text !== 'string')
          throw Error('Wiki response has no source text for ' + page.title);
        const requested =
          batch.find((t) => t.replaceAll('_', ' ') === page.title.replaceAll('_', ' ')) ||
          page.title;
        pages[requested] = text;
        revisions[requested] = { id: revision.revid, timestamp: revision.timestamp };
      }
      progress(Math.min(start + 20, titles.length), titles.length);
    }
    return { pages, revisions };
  }
  function evolutionSourceText(text) {
    const match = text.match(/={2,}\s*Evolutions\s*={2,}/i);
    if (!match) return text;
    const block = text.slice(match.index + match[0].length);
    return block
      .split(/\n==[^=\n][^\n]*==\s*(?:\n|$)/)[0]
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\r\n/g, '\n')
      .trim();
  }
  function onlineIncarnonRecords(rawPages, baseline, date) {
    const originalRecords = records(baseline, 'incarnon-evolutions'),
      output = originalRecords.map((e) => ({ id: e.id })),
      previous = baseline['incarnon-evolutions'].onlinePageHashes || {},
      pageHashes = {};
    for (const [page, text] of Object.entries(rawPages))
      if (!page.startsWith('Module:')) {
        const family = page.replace(/_Incarnon_Genesis$/, '').replaceAll('_', ' '),
          hash = recordFingerprint(evolutionSourceText(text));
        pageHashes[page] = hash;
        let tier = 1;
        for (const row of text.split(/\n\|-\s*\n/)) {
          const t = row.match(/EVO([1-5])/);
          if (t) tier = +t[1];
          const named = row.match(/text-align:center;?"?\s*\|\s*'''(.+?)'''/);
          if (!named) continue;
          const name = named[1].replace(/'{2,}/g, ''),
            id = slug(family + ' ' + tier + ' ' + name),
            old = originalRecords.find((e) => e.id === id);
          if (old && previous[page] === hash) continue;
          if (old && !previous[page]) continue;
          const clean = row
            .replace(/<[^>]*>/g, ' ')
            .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
            .replace(/\[\[([^\]]+)\]\]/g, '$1')
            .replace(/'{2,}/g, '')
            .replace(/\s+/g, ' ')
            .trim();
          const r = {
            id,
            name,
            family,
            tier,
            description: clean,
            effects: [],
            conditions: [],
            variantEffects: {},
            variantValues: {},
            nonDamageEffects: [],
            limitations: [
              'Online evolution source is new or changed; verify its numeric bonuses in the database editor before inclusion in totals.',
            ],
            source: {
              url: 'https://wiki.warframe.com/w/' + page,
              snapshot: date,
              license: 'CC BY-NC-SA 3.0',
            },
          };
          if (old) delete r.conditions;
          if (old)
            Object.assign(
              output.find((e) => e.id === id),
              r,
            );
          else output.push(r);
        }
      }
    return { records: output, pageHashes };
  }

  // Public diagnostic interface; this is a classic browser script, not a module.
  const API = {
    mergeOnlineCatalogue,
    fetchWikiPages,
    onlineIncarnonRecords,
    normalizeOnlineModules,
    lua,
    armorProcDistribution,
    enemyComparison,
    autoSelectEvolutions,
    defaultState,
    compatible,
    rivenCategory,
    rivenEffects,
    rivenRollRange,
    splicedRivenRollRange,
    rivenShownNumber,
    rivenQualityFromDisplayed,
    rivenQualityClass,
    weaponBaseAnalysis,
    rivenWeaponForDraft,
    rivenTraitGrade,
    compatibleSplices,
    spliceRiven,
    clearRivenSplice,
    modDrain,
    criticalTiers,
    combineElements,
    scale,
    enemyStats,
    calculateWeapon,
    calculateEnemy,
    simulateTtk,
    ttkProjectileSchedule,
    ttkGraphSVG,
    hasIncarnonProfile,
    availableWeaponAttacks,
    shouldShowIncarnonEvolutions,
    TTK_LOCATIONS,
    validateDatabase,
    validateBuild,
    configureWeapon,
    arcaneCompatible,
    procProbability,
    evolutionEffectsFor,
    buildReferences,
    normalizeBuild,
    arsenalExport,
    statusIconPath,
    STATUS_ICON_FILES,
    statusDamageEffectsHTML,
    runChecks,
    normalizePolarity,
    weaponSlotPolarities,
  };
  global.VoidArsenal = API;
  if (typeof document === 'undefined') return;

  const $ = (id) => document.getElementById(id);
  function reportOptionalFailure(action, error) {
    console.warn(`${action}: ${error.message}`);
  }
  const ASSET_SOURCES = JSON.parse($('image-sources').textContent);
  const ASSET_LOCAL_BY_REMOTE = new Map(
    Object.entries(ASSET_SOURCES).map(([local, url]) => [url, local]),
  );
  const ASSET_MODE_KEY = 'void-arsenal-image-mode';
  const ASSET_DOWNLOAD_SUMMARY_KEY = 'void-arsenal-image-download-summary';
  let assetMode = 'remote';
  try {
    if (localStorage.getItem(ASSET_MODE_KEY) === 'local') assetMode = 'local';
  } catch (error) {
    reportOptionalFailure('Image preference could not be read', error);
  }
  function assetURL(path) {
    const local = safeImagePath(path);
    return assetMode === 'local' ? local : ASSET_SOURCES[local] || local;
  }
  function refreshAssetCSS() {
    for (const [variable, path] of Object.entries(JSON.parse($('css-image-sources').textContent)))
      document.documentElement.style.setProperty(variable, 'url("' + assetURL(path) + '")');
  }
  refreshAssetCSS();
  let bundled = {},
    db = {},
    state,
    selectedRecord = '',
    rivenEditing = '',
    rivenDraft = null,
    rivenSelectedWeaponId = '',
    rivenGuideMode = 'base',
    renderFrame = 0,
    saveTimer = 0,
    toastTimer = 0,
    timelineLocation = 'body';
  let activeBuildId = '',
    draftOpen = false,
    savedFingerprint = '',
    pendingArsenal = null,
    recoveredDraft = null,
    modPickerSlot = -1,
    loadoutPicker = { kind: '', slot: -1 };
  let indices = {},
    restoredSession = false,
    databaseDirty = false,
    databaseWriteQueue = Promise.resolve(),
    legacyStorageUnmigrated = false;
  function recordImage(r, kind = 'item', fallback = '') {
    return (
      '<img class="asset-image ' +
      kind +
      '-image" src="' +
      escape(assetURL(r?.image)) +
      '"' +
      (fallback ? ' data-fallback="' + escape(assetURL(fallback)) + '"' : '') +
      ' alt="' +
      escape(r?.name || '') +
      '" loading="' +
      (kind === 'enemy' ? 'eager' : 'lazy') +
      '">'
    );
  }
  function statusImage(type) {
    const path = statusIconPath(ruleOf(db), type);
    return path
      ? '<img class="status-icon" src="' +
          escape(assetURL(path)) +
          '" alt="' +
          escape(type) +
          ' status icon" loading="lazy">'
      : '';
  }
  document.addEventListener(
    'error',
    (e) => {
      const img = e.target;
      if (
        !(img instanceof HTMLImageElement) ||
        (img.classList.contains('asset-image') || img.classList.contains('status-icon')) === false
      )
        return;
      const current = img.getAttribute('src') || '',
        local = ASSET_LOCAL_BY_REMOTE.get(current),
        remote = ASSET_SOURCES[current];
      if (assetMode === 'local' && remote && !img.dataset.remoteAttempted) {
        img.dataset.remoteAttempted = 'true';
        img.src = remote;
      } else if (local && !img.dataset.localAttempted && !img.dataset.remoteAttempted) {
        img.dataset.localAttempted = 'true';
        img.src = local;
      } else if (img.dataset.fallback && !img.dataset.fallbackUsed) {
        img.dataset.fallbackUsed = 'true';
        img.src = img.dataset.fallback;
      } else if (!img.src.endsWith('/images/placeholder.svg')) img.src = 'images/placeholder.svg';
      else img.hidden = true;
    },
    true,
  );
  function indexData() {
    indices = {};
    for (const c of CATEGORIES) indices[c] = new Map(records(db, c).map((r) => [r.id, r]));
  }
  let onlineDraft = null,
    onlineBusy = false,
    appDirectory = null,
    dataDirectory = null;
  function onlineProgress(message) {
    $('online-progress').textContent = message;
  }
  async function connectDataFolder() {
    if (!global.showDirectoryPicker) {
      notify(
        'This browser cannot write local folders. Apply online updates, then save the downloaded category JSON files into data/.',
      );
      return;
    }
    try {
      const handle = await global.showDirectoryPicker({
        id: 'void-arsenal-data',
        mode: 'readwrite',
      });
      let data;
      try {
        data = await handle.getDirectoryHandle('data');
        appDirectory = handle;
      } catch {
        data = handle;
        appDirectory = null;
      }
      await data.getFileHandle('weapons.json');
      dataDirectory = data;
      $('online-folder').value =
        'Connected: ' +
        handle.name +
        (appDirectory ? ' / data' : '') +
        '. Category JSON files will be updated here.';
      if ($('connect-data-folder'))
        $('connect-data-folder').textContent = 'Data folder: ' + handle.name;
      if (appDirectory) {
        assetFolder = appDirectory;
        countLocalAssets().catch((error) => notify('Asset count failed: ' + error.message, true));
      }
    } catch (e) {
      if (e.name !== 'AbortError') notify('Cannot connect folder: ' + e.message, true);
    }
  }
  async function readSyncBase() {
    const local = clone(db),
      originals = {};
    if (dataDirectory)
      for (const c of ONLINE_CATEGORIES) {
        try {
          const handle = await dataDirectory.getFileHandle(c + '.json'),
            file = await handle.getFile(),
            text = await file.text(),
            data = JSON.parse(text);
          if (data.category !== c || data.schemaVersion !== 1 || !Array.isArray(data.records))
            throw Error('Unexpected category');
          data.onlineReference = { ...data.onlineReference, ...local[c].onlineReference };
          for (const browserRecord of records(db, c)) {
            const diskRecord = data.records.find((record) => record.id === browserRecord.id);
            if (!diskRecord) continue;
            for (const field of tweakedFields(c, browserRecord))
              diskRecord[field] = clone(browserRecord[field]);
          }
          local[c] = data;
          originals[c] = { handle, text };
        } catch (e) {
          if (e.name !== 'NotFoundError') throw Error(c + '.json: ' + e.message);
        }
      }
    restoreArcaneRarities(local);
    const errors = validateDatabase(local);
    if (errors.length)
      throw Error('Local folder data failed validation: ' + errors.slice(0, 5).join('\n'));
    return { local, originals };
  }
  async function checkOnlineUpdates() {
    if (onlineBusy) return;
    onlineBusy = true;
    for (const b of document.querySelectorAll('[data-check-online]')) b.disabled = true;
    onlineProgress('Checking Warframe Wiki…');
    try {
      const date = new Date().toISOString().slice(0, 10),
        source = await fetchWikiPages(ONLINE_MODULES, (n, total) =>
          onlineProgress('Reading catalogue sources ' + n + ' / ' + total),
        );
      for (const title of ONLINE_MODULES)
        if (!source.pages[title]) throw Error('Required source unavailable: ' + title);
      const data = await normalizeOnlineModules(source.pages, bundled, date),
        incPages = new Set(
          records(db, 'incarnon-evolutions')
            .map((e) => decodeURIComponent(e.source?.url?.split('/w/')[1] || ''))
            .filter(Boolean),
        );
      for (const w of data.weapons)
        if (
          w.attacks.some((a) => /incarnon/i.test(a.name)) &&
          !records(db, 'incarnon-evolutions').some((e) => e.family === w.family)
        )
          incPages.add(w.family.replaceAll(' ', '_') + '_Incarnon_Genesis');
      const evolutions = await fetchWikiPages([...incPages], (n, total) =>
        onlineProgress('Reading Incarnon sources ' + n + ' / ' + total),
      );
      Object.assign(source.pages, evolutions.pages);
      Object.assign(source.revisions, evolutions.revisions);
      const { local, originals } = await readSyncBase(),
        inc = onlineIncarnonRecords(evolutions.pages, local, date);
      data['incarnon-evolutions'] = inc.records;
      const merged = mergeOnlineCatalogue(local, data, bundled);
      merged.candidate['incarnon-evolutions'].onlinePageHashVersion = 2;
      merged.candidate['incarnon-evolutions'].onlinePageHashes = {
        ...local['incarnon-evolutions'].onlinePageHashes,
        ...inc.pageHashes,
      };
      const importedFamilies = new Set(
        merged.candidate['incarnon-evolutions'].records.map((e) => e.family),
      );
      for (const w of merged.candidate.weapons.records)
        if (importedFamilies.has(w.family) && !w.incarnonVariant) w.incarnonVariant = w.name;
      onlineDraft = {
        ...merged,
        originals,
        dbFingerprint: recordFingerprint(db),
        revisions: source.revisions,
      };
      $('online-summary').innerHTML =
        (merged.summary.some((r) => r.added || r.updated)
          ? ''
          : '<p class="success">No new records or unedited stat changes found. Your catalogue is up to date.</p>') +
        '<div class="tablewrap"><table><thead><tr><th>Category</th><th>New</th><th>Updated</th><th>Custom fields kept</th><th>Offline records kept</th></tr></thead><tbody>' +
        merged.summary
          .map(
            (r) =>
              '<tr><td>' +
              escape(r.category) +
              '</td><td>' +
              r.added +
              '</td><td>' +
              r.updated +
              '</td><td>' +
              r.preserved +
              '</td><td>' +
              r.retained +
              '</td></tr>',
          )
          .join('') +
        '</tbody></table></div><p class="hint">Saved arsenal builds, custom Rivens and calculation rules are retained. Existing records missing online are kept to protect build references. New or changed mechanics that cannot be verified are marked incomplete. ' +
        (dataDirectory
          ? 'Apply writes category JSON files to the connected folder.'
          : 'Apply updates this browser and downloads changed category JSON files; save them into your data folder.') +
        '</p>';
      $('online-dialog').showModal();
      onlineProgress('Online check complete. Review the changes.');
    } catch (e) {
      onlineDraft = null;
      onlineProgress('Online check failed; nothing was changed.');
      notify(
        'Online check failed: ' + e.message + '. Check your internet connection and retry.',
        true,
      );
    } finally {
      onlineBusy = false;
      for (const b of document.querySelectorAll('[data-check-online]')) b.disabled = false;
    }
  }
  async function downloadSyncedArtwork(candidate) {
    if (!appDirectory) return;
    let count = 0,
      missing = 0;
    const images = await appDirectory.getDirectoryHandle('images', { create: true });
    let manifest = { source: 'Canonical local-to-source image registry.', assets: [], missing: [] },
      manifestReady = true;
    try {
      const handle = await images.getFileHandle('manifest.json'),
        file = await handle.getFile();
      manifest = JSON.parse(await file.text());
      if (!Array.isArray(manifest.assets)) throw Error('Image manifest has no assets list.');
    } catch (error) {
      if (error.name !== 'NotFoundError') {
        manifestReady = false;
        onlineProgress(
          'Image downloads skipped: images/manifest.json could not be read (' +
            error.message +
            ').',
        );
      }
    }
    if (!manifestReady) return;
    const sourceURL = (sourcePage) => {
      if (!sourcePage?.includes('/File:')) return '';
      let file = sourcePage.split('/File:').at(-1).split(/[?#]/)[0];
      try {
        file = decodeURIComponent(file);
      } catch (error) {
        reportOptionalFailure('Wiki image filename could not be decoded', error);
      }
      return 'https://wiki.warframe.com/images/' + encodeURIComponent(file);
    };
    const addManifestEntry = (entry) => {
      const previous = manifest.assets.find((item) => item.local === entry.local);
      if (previous) {
        Object.assign(previous, entry, {
          owners: [...new Set([...(previous.owners || []), ...(entry.owners || [])])],
        });
      } else manifest.assets.push(entry);
    };
    const preserveIconFallback = (record, local) => {
      if (
        record.icon &&
        record.icon !== local &&
        record.icon.startsWith('images/mods/icons/') &&
        !record.icon.includes('/wiki/')
      )
        record.iconFallback = record.icon;
    };
    const getImageDirectory = async (path) => {
      let dir = images;
      for (const part of path.split('/'))
        dir = await dir.getDirectoryHandle(part, { create: true });
      return dir;
    };
    const downloadOne = async ({
      category,
      record,
      sourcePage,
      local,
      folder,
      fileName,
      field,
    }) => {
      try {
        const url = sourceURL(sourcePage);
        if (!url) throw Error('Source URL is unavailable.');
        const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
        if (!response.ok || !/^image\//.test(response.headers.get('content-type') || ''))
          throw Error('Image unavailable');
        const bytes = await response.arrayBuffer();
        if (bytes.byteLength > 20000000) throw Error('Image too large');
        const dir = await getImageDirectory(folder),
          handle = await dir.getFileHandle(fileName, { create: true }),
          writer = await handle.createWritable();
        try {
          await writer.write(bytes);
          await writer.close();
        } catch (error) {
          await writer.abort();
          throw error;
        }
        if (field === 'icon') preserveIconFallback(record, local);
        record[field] = local;
        addManifestEntry({
          file: fileName,
          local,
          owners: [
            category +
              '/' +
              record.id +
              (field === 'incarnonImage' ? '#incarnon' : field === 'icon' ? '#icon' : ''),
          ],
          url,
          sourcePage,
          provider: 'Warframe Wiki',
          bytes: bytes.byteLength,
        });
        count++;
      } catch {
        missing++;
      }
    };
    for (const category of ['weapons', 'mods', 'arcanes', 'enemies'])
      for (const record of candidate[category].records) {
        if (
          get(db, category, record.id) ||
          record.image !== 'images/placeholder.svg' ||
          !record.imageSource?.startsWith('https://wiki.warframe.com/w/File:')
        )
          continue;
        const fileName = decodeURIComponent(record.imageSource.split('/File:')[1]).split(/[?#]/)[0],
          folder = category === 'weapons' ? 'weapons' : category === 'enemies' ? 'enemies' : 'mods',
          local =
            'images/' +
            folder +
            '/' +
            (category === 'weapons'
              ? 'weapon-'
              : category === 'enemies'
                ? 'enemy-'
                : category === 'mods'
                  ? 'mod-'
                  : 'arcane-') +
            record.id +
            (fileName.match(/\.(png|jpe?g|webp|gif|svg)$/i)?.[0] || '.png');
        await downloadOne({
          category,
          record,
          sourcePage: record.imageSource,
          local,
          folder,
          fileName: local.split('/').at(-1),
          field: 'image',
        });
      }
    for (const record of candidate.mods.records) {
      if (!record.iconSource?.startsWith('https://wiki.warframe.com/w/File:')) continue;
      const sourceName = decodeURIComponent(record.iconSource.split('/File:')[1]).split(/[?#]/)[0],
        fileName = sourceName.replace(/[^a-zA-Z0-9_.-]/g, '_'),
        local = 'images/mods/icons/wiki/' + fileName,
        dir = await getImageDirectory('mods/icons/wiki');
      try {
        const handle = await dir.getFileHandle(fileName),
          file = await handle.getFile();
        preserveIconFallback(record, local);
        record.icon = local;
        addManifestEntry({
          file: fileName,
          local,
          owners: ['mods/' + record.id + '#icon'],
          url: sourceURL(record.iconSource),
          sourcePage: record.iconSource,
          provider: 'Warframe Wiki',
          bytes: file.size,
        });
        continue;
      } catch (error) {
        if (error.name !== 'NotFoundError') {
          missing++;
          continue;
        }
      }
      await downloadOne({
        category: 'mods',
        record,
        sourcePage: record.iconSource,
        local,
        folder: 'mods/icons/wiki',
        fileName,
        field: 'icon',
      });
    }
    for (const record of candidate.weapons.records) {
      if (
        !record.incarnonImage ||
        !record.incarnonImageSource?.startsWith('https://wiki.warframe.com/w/File:')
      )
        continue;
      const fileName = decodeURIComponent(record.incarnonImageSource.split('/File:')[1]).split(
          /[?#]/,
        )[0],
        localName = record.incarnonImage.split('/').at(-1),
        dir = await images.getDirectoryHandle('weapons', { create: true });
      try {
        await dir.getFileHandle(localName);
        continue;
      } catch (error) {
        if (error.name !== 'NotFoundError') {
          missing++;
          continue;
        }
      }
      await downloadOne({
        category: 'weapons',
        record,
        sourcePage: record.incarnonImageSource,
        local: record.incarnonImage,
        folder: 'weapons',
        fileName: localName,
        field: 'incarnonImage',
      });
    }
    if (count && manifestReady) {
      try {
        manifest.assets.sort((a, b) => String(a.local).localeCompare(String(b.local)));
        const handle = await images.getFileHandle('manifest.json', { create: true }),
          writer = await handle.createWritable();
        try {
          await writer.write(JSON.stringify(manifest, null, 2) + '\n');
          await writer.close();
        } catch (error) {
          await writer.abort();
          throw error;
        }
      } catch (error) {
        onlineProgress(
          count +
            ' images saved, but the image manifest could not be updated: ' +
            error.message +
            '.',
        );
      }
    }
    if (count || missing)
      onlineProgress(
        count +
          ' new images saved' +
          (missing
            ? ' · ' + missing + ' unavailable; placeholders retained.'
            : manifestReady
              ? ' and added to images/manifest.json.'
              : '.'),
      );
  }
  async function applyOnlineUpdates() {
    if (!onlineDraft || onlineBusy) return;
    const draft = onlineDraft;
    if (recordFingerprint(db) !== draft.dbFingerprint) {
      notify(
        'Database changed after the online preview. Check online again before applying.',
        true,
      );
      return;
    }
    onlineBusy = true;
    $('apply-online').disabled = true;
    const written = [];
    try {
      const candidate = clone(draft.candidate),
        changed = draft.summary.filter((r) => r.added || r.updated).map((r) => r.category);
      const errors = validateDatabase(candidate);
      if (errors.length) throw Error(errors.slice(0, 5).join('\n'));
      if (dataDirectory) {
        for (const [c, original] of Object.entries(draft.originals))
          if ((await (await original.handle.getFile()).text()) !== original.text)
            throw Error(c + '.json changed on disk after the preview. Check online again.');
        await downloadSyncedArtwork(candidate);
        for (const c of ONLINE_CATEGORIES) {
          const handle =
              draft.originals[c]?.handle ||
              (await dataDirectory.getFileHandle(c + '.json', { create: true })),
            writer = await handle.createWritable();
          try {
            await writer.write(JSON.stringify(candidate[c], null, 2) + '\n');
            await writer.close();
            written.push({ c, handle });
          } catch (e) {
            await writer.abort();
            throw e;
          }
        }
      }
      applyDatabase(candidate);
      if (!dataDirectory)
        for (const [i, c] of changed.entries())
          setTimeout(
            () => download(c + '.json', JSON.stringify(candidate[c], null, 2) + '\n'),
            i * 180,
          );
      onlineDraft = null;
      $('online-dialog').close();
      onlineProgress(
        'Catalogue synced ' +
          new Date().toLocaleString() +
          (dataDirectory ? ' · local JSON files updated.' : ' · changed JSON files downloaded.'),
      );
      notify(
        'Online catalogue synced. Custom edits and saved builds were retained. Export Data to keep a portable backup.',
      );
    } catch (e) {
      let rollbackFailed = false;
      for (const { c, handle } of written.reverse())
        try {
          if (draft.originals[c]) {
            const writer = await handle.createWritable();
            await writer.write(draft.originals[c].text);
            await writer.close();
          } else await dataDirectory.removeEntry(c + '.json');
        } catch {
          rollbackFailed = true;
        }
      notify(
        'Sync failed: ' +
          e.message +
          (rollbackFailed
            ? ' Some category files could not be restored; reconnect the folder and inspect the files.'
            : ' No browser data was changed; completed file writes were restored.'),
        true,
      );
    } finally {
      onlineBusy = false;
      $('apply-online').disabled = false;
    }
  }
  function completeOnlineRecord(category, existing, incoming) {
    const baseline = get(bundled, category, existing.id),
      previous = db[category]?.onlineReference?.[existing.id] || {},
      reference = { ...clone(baseline || {}), ...clone(previous) },
      replacement = clone(existing);
    for (const [field, value] of Object.entries(reference))
      if (field !== 'id' && !Object.hasOwn(incoming, field)) replacement[field] = clone(value);
    for (const [field, value] of Object.entries(incoming))
      if (value !== undefined) replacement[field] = clone(value);
    for (const field of ['image', 'imageSource', 'icon', 'iconSource', 'iconFallback'])
      if (existing[field] && !incoming[field]) replacement[field] = clone(existing[field]);
    if (category === 'weapons' && Array.isArray(replacement.attacks)) {
      const previousAttacks = new Map(arr(existing.attacks).map((attack) => [attack.id, attack]));
      replacement.attacks = replacement.attacks.map((attack) => {
        const old = previousAttacks.get(attack.id);
        return old?.componentOf && !attack.componentOf
          ? { ...attack, componentOf: old.componentOf, componentSource: old.componentSource }
          : attack;
      });
    }
    return replacement;
  }
  async function forceRefreshSelectedRecord() {
    const category = $('database-category').value,
      id = selectedRecord,
      existing = get(db, category, id);
    if (!existing || !ONLINE_CATEGORIES.includes(category)) return;
    const button = $('force-refresh-record');
    button.disabled = true;
    $('editor-message').textContent = 'Reading the latest Warframe Wiki source…';
    try {
      const date = new Date().toISOString().slice(0, 10),
        response = await fetchWikiPages(ONLINE_MODULES),
        normalized = await normalizeOnlineModules(response.pages, bundled, date);
      if (category === 'incarnon-evolutions') {
        const page = decodeURIComponent(existing.source?.url?.split('/w/')[1] || '');
        if (!page) throw Error('This evolution has no source page.');
        const result = await fetchWikiPages([page]);
        normalized[category] = onlineIncarnonRecords(result.pages, db, date).records;
      }
      const incoming = normalized[category]?.find((record) => record.id === id);
      if (!incoming) throw Error('This record was not found in the current online source.');
      const replacement = completeOnlineRecord(category, existing, incoming),
        candidate = clone(db),
        index = candidate[category].records.findIndex((record) => record.id === id);
      candidate[category].records[index] = replacement;
      candidate[category].onlineReference ||= {};
      candidate[category].onlineReference[id] = clone(replacement);
      candidate[category].onlineHashes ||= {};
      candidate[category].onlineHashes[id] = Object.fromEntries(
        Object.entries(replacement).map(([key, value]) => [key, recordFingerprint(value)]),
      );
      normalizeWeaponDatabase(candidate.weapons);
      const errors = validateDatabase(candidate);
      if (errors.length)
        throw Error('Online record failed validation: ' + errors.slice(0, 5).join('; '));
      const keys = [...new Set([...Object.keys(existing), ...Object.keys(replacement)])].filter(
          (key) => key !== 'source' && key !== 'id',
        ),
        changes = keys.filter(
          (key) =>
            recordFingerprint(existing[key] ?? null) !==
            recordFingerprint(replacement[key] ?? null),
        );
      $('record-refresh-diff').innerHTML =
        '<p class="hint">' +
        escape(existing.name) +
        ' · ' +
        changes.length +
        ' changed fields. Confirming replaces the local record and clears its tweaks.</p>' +
        (changes.length
          ? '<div class="tablewrap"><table><thead><tr><th>Field</th><th>Local value</th><th>Online value</th></tr></thead><tbody>' +
            changes
              .map(
                (key) =>
                  '<tr><th>' +
                  escape(key) +
                  '</th><td>' +
                  escape(JSON.stringify(existing[key] ?? null)) +
                  '</td><td>' +
                  escape(JSON.stringify(replacement[key] ?? null)) +
                  '</td></tr>',
              )
              .join('') +
            '</tbody></table></div>'
          : '<p class="hint">No differences found.</p>');
      const dialog = $('record-refresh-dialog');
      $('record-refresh-cancel').onclick = () => dialog.close();
      $('record-refresh-confirm').onclick = () => {
        try {
          if (get(db, category, id) !== existing)
            throw Error('Record changed while preview was open. Refresh again.');
          applyDatabase(candidate);
          loadRecord(id);
          dialog.close();
          notify('Record refreshed from Warframe Wiki.');
        } catch (error) {
          notify('Force refresh failed: ' + error.message, true);
        }
      };
      dialog.showModal();
      $('editor-message').textContent = 'Review the online differences before overwriting.';
    } catch (error) {
      $('editor-message').textContent = 'Force refresh failed: ' + error.message;
      notify(error.message, true);
    } finally {
      button.disabled = false;
    }
  }

  function notify(message, error = false) {
    $('toast').textContent = message;
    $('toast').classList.toggle('error', error);
    $('toast').hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => ($('toast').hidden = true), 6500);
  }
  function showStorageFailure() {
    const notice = $('storage-notice');
    if (notice) {
      notice.hidden = false;
      notice.textContent =
        'Browser storage is unavailable or full. Your session still works; export JSON files or updated HTML to keep your changes.';
    }
  }
  function openCatalogueDatabase() {
    return new Promise((resolve, reject) => {
      if (!global.indexedDB) {
        reject(Error('IndexedDB is unavailable in this browser.'));
        return;
      }
      const request = global.indexedDB.open(INDEXED_DB_NAME, INDEXED_DB_VERSION);
      request.onupgradeneeded = () => {
        if (!request.result.objectStoreNames.contains(INDEXED_DB_STORE))
          request.result.createObjectStore(INDEXED_DB_STORE);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || Error('Could not open IndexedDB.'));
      request.onblocked = () => reject(Error('IndexedDB upgrade is blocked by another open tab.'));
    });
  }
  async function readCatalogueDatabase() {
    const database = await openCatalogueDatabase();
    return new Promise((resolve, reject) => {
      const tx = database.transaction(INDEXED_DB_STORE, 'readonly'),
        store = tx.objectStore(INDEXED_DB_STORE),
        keys = store.getAllKeys(),
        values = store.getAll();
      let categories = {};
      tx.oncomplete = () => {
        database.close();
        categories = Object.fromEntries(
          keys.result.map((key, index) => [key, values.result[index]]),
        );
        resolve(categories);
      };
      tx.onerror = () => {
        database.close();
        reject(tx.error || Error('Could not read IndexedDB catalogue.'));
      };
      tx.onabort = () => {
        database.close();
        reject(tx.error || Error('IndexedDB catalogue read was cancelled.'));
      };
    });
  }
  async function writeCatalogueDatabase(source = db) {
    const database = await openCatalogueDatabase();
    return new Promise((resolve, reject) => {
      const tx = database.transaction(INDEXED_DB_STORE, 'readwrite'),
        store = tx.objectStore(INDEXED_DB_STORE);
      try {
        for (const category of CATEGORIES)
          if (category !== 'arsenal' && source[category]) store.put(source[category], category);
      } catch (error) {
        tx.abort();
        database.close();
        reject(error);
        return;
      }
      tx.oncomplete = () => {
        database.close();
        resolve();
      };
      tx.onerror = () => {
        database.close();
        reject(tx.error || Error('Could not save catalogue in IndexedDB.'));
      };
      tx.onabort = () => {
        database.close();
        reject(tx.error || Error('IndexedDB catalogue write was cancelled.'));
      };
    });
  }
  function sessionSnapshot() {
    return {
      version: 2,
      state,
      activeBuildId,
      draftOpen,
      recoveredDraft,
      arsenal: clone(db.arsenal || { category: 'arsenal', schemaVersion: 1, records: [] }),
    };
  }
  function persistSession() {
    if (legacyStorageUnmigrated) return false;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionSnapshot()));
      return true;
    } catch {
      showStorageFailure();
      return false;
    }
  }
  function persistBuildDraft() {
    try {
      localStorage.setItem(
        BUILD_DRAFT_STORAGE_KEY,
        JSON.stringify({ state, activeBuildId, draftOpen, savedAt: Date.now() }),
      );
      return true;
    } catch {
      showStorageFailure();
      return false;
    }
  }
  function persistCatalogue() {
    if (!databaseDirty) return;
    databaseDirty = false;
    const snapshot = clone(db);
    databaseWriteQueue = databaseWriteQueue
      .catch(() => {})
      .then(() => writeCatalogueDatabase(snapshot))
      .catch((error) => {
        databaseDirty = true;
        const notice = $('storage-notice');
        if (notice) {
          notice.hidden = false;
          notice.textContent =
            'The catalogue could not be saved to IndexedDB: ' +
            error.message +
            '. Your current session remains available; export the category JSON files to keep database edits.';
        }
      });
  }
  function flushPersist() {
    clearTimeout(saveTimer);
    persistBuildDraft();
    persistSession();
    persistCatalogue();
  }
  function persist() {
    persistBuildDraft();
    clearTimeout(saveTimer);
    saveTimer = setTimeout(persistSession, 200);
    persistCatalogue();
  }
  function options(items, value, empty = '') {
    return (
      (empty ? '<option value="">' + escape(empty) + '</option>' : '') +
      items
        .map(
          (i) =>
            '<option value="' +
            escape(i.id ?? i) +
            '"' +
            ((i.id ?? i) === value ? ' selected' : '') +
            '>' +
            escape(i.name ?? i) +
            '</option>',
        )
        .join('')
    );
  }
  function download(name, text, type = 'application/json') {
    const blob = new Blob([text], { type }),
      url = URL.createObjectURL(blob),
      a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.hidden = true;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }
  function syncProgenitorLibraryFromWeapons(database) {
    const category = 'progenitor-library',
      current = database[category] || clone(bundled[category]),
      existing = new Map(
        records(database, category).map((item) => [String(item.name || '').toLowerCase(), item]),
      ),
      weapons = records(database, 'weapons').filter((weapon) => {
        const name = String(weapon.name || '');
        return (
          !/\s*\(Atmosphere\)$/i.test(name) &&
          (name.startsWith('Kuva ') ||
            name.startsWith('Tenet ') ||
            name.startsWith('Coda ') ||
            name.startsWith('Dual Coda '))
        );
      }),
      familyOrder = { kuva: 0, tenet: 1, coda: 2 },
      next = weapons
        .map((weapon) => {
          const name = weapon.name,
            variant = name.startsWith('Kuva ')
              ? 'kuva'
              : name.startsWith('Tenet ')
                ? 'tenet'
                : 'coda',
            old = existing.get(name.toLowerCase()) || {},
            bonus = old.bonusPercent;
          return {
            ...old,
            id: slug(name),
            name,
            variant,
            weaponId: weapon.id,
            weaponType: weapon.category || old.weaponType || '',
            acquired: old.acquired === true,
            element: old.element || '',
            bonusPercent: bonus != null && Number.isFinite(Number(bonus)) ? Number(bonus) : null,
          };
        })
        .sort(
          (a, b) => familyOrder[a.variant] - familyOrder[b.variant] || a.name.localeCompare(b.name),
        );
    const changed = JSON.stringify(records(database, category)) !== JSON.stringify(next);
    current.records = next;
    if (changed) {
      current.snapshot = new Date().toISOString().slice(0, 10);
      databaseDirty = true;
    }
    database[category] = current;
    return changed;
  }
  function progenitorRecord(category) {
    return records(db, category)[0] || null;
  }
  function formatRotationTime(ms) {
    if (ms <= 0) return 'Resetting…';
    const seconds = Math.floor(ms / 1000),
      days = Math.floor(seconds / 86400),
      hours = Math.floor((seconds % 86400) / 3600),
      minutes = Math.floor((seconds % 3600) / 60),
      secs = seconds % 60;
    return (
      (days ? days + 'd ' : '') +
      String(hours).padStart(2, '0') +
      ':' +
      String(minutes).padStart(2, '0') +
      ':' +
      String(secs).padStart(2, '0')
    );
  }
  function nextRotationAt(record, now = Date.now()) {
    const period = (record?.resetPeriodHours || 96) * 3600000,
      expiry = Date.parse(record?.nextRotationUTC || '');
    if (Number.isFinite(expiry)) return expiry;
    const epoch = Date.parse(record?.rotationEpochUTC || '');
    if (!Number.isFinite(epoch) || !period) return now + period;
    return epoch + (Math.floor((now - epoch) / period) + 1) * period;
  }
  function fallbackNextRotationAt(record, now = Date.now()) {
    const expiry = nextRotationAt(record, now);
    if (expiry > now) return expiry;
    const period = (record?.resetPeriodHours || 96) * 3600000;
    return expiry + (Math.floor((now - expiry) / period) + 1) * period;
  }
  function codaBatchAt(record, now = Date.now()) {
    const current = record?.currentBatch || 'A',
      expiry = Date.parse(record?.nextRotationUTC || '');
    if (Number.isFinite(expiry)) {
      if (now < expiry) return current;
      const transitions =
        Math.floor((now - expiry) / ((record?.resetPeriodHours || 96) * 3600000)) + 1;
      return transitions % 2 ? (current === 'A' ? 'B' : 'A') : current;
    }
    const period = (record?.resetPeriodHours || 96) * 3600000,
      epoch = Date.parse(record?.rotationEpochUTC || '');
    if (!Number.isFinite(epoch) || now < epoch) return current;
    return Math.floor((now - epoch) / period) % 2 === 0 ? 'A' : 'B';
  }
  function progenitorBonusTone(value) {
    if (value == null || !Number.isFinite(Number(value))) return '';
    const bonus = Number(value);
    return bonus >= 55 ? 'green' : bonus >= 45 ? 'orange' : bonus >= 30 ? 'yellow' : 'red';
  }
  function progenitorBonusMarkup(value) {
    if (value == null || !Number.isFinite(Number(value)))
      return '<span class="bonus-value bonus-unknown">Awaiting wiki data</span>';
    const tone = progenitorBonusTone(value);
    return (
      '<span class="bonus-value bonus-' +
      tone +
      '">' +
      escape(Number(value).toFixed(2).replace(/\.00$/, '') + '%') +
      '</span>'
    );
  }
  function progenitorLibraryEntry(name) {
    return records(db, 'progenitor-library').find(
      (item) => item.name.toLowerCase() === String(name).toLowerCase(),
    );
  }
  function applyOwnedProgenitor(build, database = db) {
    const weapon = get(database, 'weapons', build?.weaponId);
    if (!weapon) return false;
    const entry = records(database, 'progenitor-library').find(
      (item) =>
        item.acquired &&
        (item.weaponId === weapon.id ||
          String(item.name || '').toLowerCase() === weapon.name.toLowerCase()),
    );
    if (!entry) return false;
    const element = String(entry.element || '')
        .trim()
        .toLowerCase(),
      bonus = Number(entry.bonusPercent);
    build.progenitor = [
      'impact',
      'heat',
      'cold',
      'electricity',
      'toxin',
      'magnetic',
      'radiation',
    ].includes(element)
      ? element
      : '';
    build.progenitorValue = entry.bonusPercent != null && Number.isFinite(bonus) ? bonus : 0;
    return true;
  }
  function progenitorVendorStatus(row) {
    const entry = progenitorLibraryEntry(row.name);
    if (!entry?.acquired) return '<span class="library-not-acquired">Not acquired</span>';
    let comparison = '';
    const vendorBonus = Number(row.bonusPercent),
      ownedBonus = Number(entry.bonusPercent);
    if (
      row.bonusPercent != null &&
      entry.bonusPercent != null &&
      Number.isFinite(vendorBonus) &&
      Number.isFinite(ownedBonus)
    ) {
      const delta = vendorBonus - ownedBonus;
      if (delta > 0)
        comparison =
          '<span class="progenitor-comparison vendor-better">Current offer is ' +
          fmt(delta, 2) +
          ' points higher than your ' +
          fmt(ownedBonus, 2) +
          '% copy</span>';
      else if (delta < 0)
        comparison =
          '<span class="progenitor-comparison library-better">Your ' +
          fmt(ownedBonus, 2) +
          '% copy is ' +
          fmt(-delta, 2) +
          ' points higher</span>';
      else
        comparison =
          '<span class="progenitor-comparison">Same bonus as your recorded copy (' +
          fmt(ownedBonus, 2) +
          '%)</span>';
    } else
      comparison =
        '<span class="progenitor-comparison">Recorded bonus not available for comparison</span>';
    return '<span class="library-acquired-badge">✓ Acquired</span>' + comparison;
  }
  function progenitorWeaponCell(name, weapon) {
    const image = recordImage(
        { name, image: weapon?.image },
        'progenitor-thumb',
        'images/placeholder.svg',
      ),
      content = image + '<span>' + escape(name) + '</span>';
    return (
      '<div class="progenitor-library-weapon">' +
      (weapon?.wiki
        ? '<a class="progenitor-row-link" href="' +
          escape(safeURL(weapon.wiki)) +
          '" target="_blank" rel="noopener">' +
          content +
          '</a>'
        : content) +
      '</div>'
    );
  }
  function renderOfferingRows(category, record) {
    const host = $(category === 'tenet-offerings' ? 'tenet-offerings' : 'coda-offerings'),
      batch = category === 'coda-offerings' ? codaBatchAt(record) : null,
      rows = arr(record?.offerings)
        .filter((row) => !batch || row.batch === batch || !row.batch)
        .slice()
        .sort((a, b) => {
          const av = Number(a.bonusPercent),
            bv = Number(b.bonusPercent),
            ak = a.bonusPercent != null && Number.isFinite(av),
            bk = b.bonusPercent != null && Number.isFinite(bv);
          return ak && bk ? bv - av : ak ? -1 : bk ? 1 : 0;
        });
    host.innerHTML =
      '<table class="progenitor-table"><thead><tr><th>Weapon</th><th>Type</th><th>Element</th><th>Bonus %</th><th>Library status · comparison</th></tr></thead><tbody>' +
      rows
        .map((row) => {
          const entry = progenitorLibraryEntry(row.name),
            weapon = get(db, 'weapons', entry?.weaponId);
          return (
            '<tr><td>' +
            progenitorWeaponCell(row.name, weapon) +
            '</td><td>' +
            escape(row.type || '') +
            '</td><td>' +
            escape(
              row.element
                ? String(row.element).charAt(0).toUpperCase() + String(row.element).slice(1)
                : 'Awaiting wiki data',
            ) +
            '</td><td>' +
            progenitorBonusMarkup(row.bonusPercent) +
            '</td><td>' +
            progenitorVendorStatus(row) +
            '</td></tr>'
          );
        })
        .join('') +
      '</tbody></table>' +
      (rows.length ? '' : '<p class="empty">No offerings are configured for this rotation.</p>');
  }
  function progenitorElementOptions(selected) {
    const elements = ['Impact', 'Heat', 'Cold', 'Electricity', 'Toxin', 'Magnetic', 'Radiation'];
    return (
      '<option value="">Not recorded</option>' +
      elements
        .map(
          (element) =>
            '<option value="' +
            element.toLowerCase() +
            '"' +
            (String(selected || '').toLowerCase() === element.toLowerCase() ? ' selected' : '') +
            '>' +
            element +
            '</option>',
        )
        .join('')
    );
  }
  function renderProgenitorLibrary() {
    const host = $('progenitor-library'),
      query = $('progenitor-library-search').value.trim().toLowerCase(),
      family = $('progenitor-library-filter').value,
      all = records(db, 'progenitor-library'),
      families = [
        {
          id: 'kuva',
          title: 'Kuva weapons',
          wiki: 'https://wiki.warframe.com/w/Kuva_Weapons',
          summary:
            'Mercy a weapon-bearing Kuva Larvling to create a Kuva Lich, then vanquish the Lich to claim its weapon from the Foundry.',
          progenitor: true,
        },
        {
          id: 'tenet',
          title: 'Tenet weapons',
          wiki: 'https://wiki.warframe.com/w/Tenet_Weapons',
          summary:
            'Most Tenet weapons are claimed from the Foundry after vanquishing a Sister carrying one. Tenet melee weapons are purchased from Ergo Glast with Corrupted Holokeys.',
          progenitor: true,
        },
        {
          id: 'coda',
          title: 'Coda weapons',
          wiki: 'https://wiki.warframe.com/w/Coda_Weapons',
          summary:
            'Vanquish a Technocyte Coda to earn Live Heartcells, then purchase Coda weapons from Eleanor in Höllvania. Coda bonus elements are not determined by a progenitor Warframe.',
          progenitor: false,
        },
      ],
      rows = all
        .filter(
          (item) =>
            (family === 'all' || item.variant === family) &&
            (!query || item.name.toLowerCase().includes(query)),
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
      tracked = all.filter(
        (item) => item.acquired || item.element || item.bonusPercent != null,
      ).length;
    $('progenitor-library-count').textContent =
      rows.length +
      ' weapons · ' +
      all.filter((item) => item.acquired).length +
      ' acquired · ' +
      tracked +
      ' recorded';
    const tableRows = (items) =>
      '<table class="progenitor-table"><thead><tr><th>Weapon</th><th>Type</th><th>Acquired</th><th>Element</th><th>Bonus %</th></tr></thead><tbody>' +
      items
        .map((item) => {
          const weapon = get(db, 'weapons', item.weaponId);
          return (
            '<tr><td>' +
            progenitorWeaponCell(item.name, weapon) +
            '</td><td>' +
            escape(item.weaponType || '') +
            '</td><td><label class="library-acquired"><input type="checkbox" data-library-field="acquired" data-library-id="' +
            escape(item.id) +
            '"' +
            (item.acquired ? ' checked' : '') +
            '><span class="' +
            (item.acquired ? 'library-acquired-badge' : 'library-not-acquired') +
            '">' +
            (item.acquired ? 'Acquired' : 'Not acquired') +
            '</span></label></td><td><select data-library-field="element" data-library-id="' +
            escape(item.id) +
            '" aria-label="' +
            escape(item.name) +
            ' element"' +
            (item.acquired ? '' : ' disabled') +
            '>' +
            progenitorElementOptions(item.element) +
            '</select></td><td><input type="number" class="library-bonus-input' +
            (item.acquired && progenitorBonusTone(item.bonusPercent)
              ? ' bonus-' + progenitorBonusTone(item.bonusPercent)
              : '') +
            '" min="25" max="60" step="0.01" placeholder="—" value="' +
            (item.bonusPercent != null && Number.isFinite(Number(item.bonusPercent))
              ? escape(item.bonusPercent)
              : '') +
            '" data-library-field="bonusPercent" aria-label="' +
            escape(item.name) +
            ' bonus percentage" data-library-id="' +
            escape(item.id) +
            '"' +
            (item.acquired ? '' : ' disabled') +
            '></td></tr>'
          );
        })
        .join('') +
      '</tbody></table>';
    host.innerHTML = families
      .filter((item) => family === 'all' || item.id === family)
      .map((item) => {
        const items = rows.filter((row) => row.variant === item.id),
          progenitor = item.progenitor
            ? '<p class="hint">Element bonuses for Kuva and Tenet weapons are determined by the progenitor Warframe. <a href="https://wiki.warframe.com/w/Adversary_System/Progenitor" target="_blank" rel="noopener">View the progenitor Warframe element chart ↗</a></p>'
            : '';
        return (
          '<section class="progenitor-family-section"><div class="panelhead"><h3>' +
          escape(item.title) +
          '</h3><span class="badge">' +
          items.length +
          ' weapons</span><a href="' +
          escape(safeURL(item.wiki)) +
          '" target="_blank" rel="noopener">' +
          escape(item.title) +
          ' wiki ↗</a></div><p class="hint">' +
          escape(item.summary) +
          '</p>' +
          progenitor +
          (items.length ? tableRows(items) : '<p class="empty">No weapons match this search.</p>') +
          '</section>'
        );
      })
      .join('');
    for (const field of host.querySelectorAll('[data-library-field]'))
      field.onchange = () => {
        const item = get(db, 'progenitor-library', field.dataset.libraryId);
        if (!item) return;
        const key = field.dataset.libraryField;
        if (key === 'acquired') item.acquired = field.checked;
        else if (key === 'element') item.element = field.value;
        else {
          const value = field.value.trim();
          item.bonusPercent = value === '' ? null : Number(value);
          if (
            item.bonusPercent != null &&
            (!Number.isFinite(item.bonusPercent) ||
              item.bonusPercent < 25 ||
              item.bonusPercent > 60)
          ) {
            notify('Bonus percentage must be between 25 and 60.', true);
            item.bonusPercent = null;
          }
        }
        db['progenitor-library'].snapshot = new Date().toISOString().slice(0, 10);
        databaseDirty = true;
        persistCatalogue();
        renderProgenitorWeapons();
      };
  }
  function progenitorValuesMissing(category, record) {
    const rows = arr(record?.offerings).filter(
      (row) => category !== 'coda-offerings' || row.batch === codaBatchAt(record) || !row.batch,
    );
    return rows.some(
      (row) =>
        !String(row.element || '').trim() ||
        row.bonusPercent == null ||
        !Number.isFinite(Number(row.bonusPercent)),
    );
  }
  let progenitorBootstrapStarted = {};
  function renderProgenitorWeapons() {
    const tenet = progenitorRecord('tenet-offerings'),
      coda = progenitorRecord('coda-offerings');
    if (!tenet || !coda) return;
    renderOfferingRows('tenet-offerings', tenet);
    renderOfferingRows('coda-offerings', coda);
    renderProgenitorLibrary();
    $('coda-batch-label').textContent =
      'Current batch ' + codaBatchAt(coda) + ' - listed weapons follow the active wiki rotation.';
    updateProgenitorCountdowns();
    clearInterval(progenitorTimer);
    progenitorTimer = setInterval(updateProgenitorCountdowns, 1000);
  }
  function updateProgenitorCountdowns() {
    const now = Date.now(),
      tenet = progenitorRecord('tenet-offerings'),
      coda = progenitorRecord('coda-offerings');
    if (!tenet || !coda) return;
    for (const [key, record] of [
      ['tenet', tenet],
      ['coda', coda],
    ]) {
      const expiry = nextRotationAt(record, now),
        left = expiry - now;
      $(key + '-countdown').textContent =
        left <= 0
          ? 'Rotation expired · wiki recheck available'
          : 'Next rotation in ' + formatRotationTime(left);
      const last = Date.parse(record.lastWikiCheckUTC || ''),
        attempt = Date.parse(record.lastWikiAttemptUTC || ''),
        button = $('check-' + key + '-wiki'),
        canCheck = now >= expiry && (!Number.isFinite(last) || last < expiry);
      button.disabled = !canCheck || !!progenitorWikiBusy[key];
      button.title = canCheck
        ? 'The rotation has expired and this page has not been checked since it expired.'
        : 'Wiki recheck is only available after the rotation expires and before a successful post-expiry check.';
      if (progenitorWikiBusy[key]) continue;
      const status = $(key + '-wiki-status');
      status.textContent =
        (Number.isFinite(last)
          ? 'Last successful wiki check: ' + formatUtcStamp(last)
          : 'Last successful wiki check: never') +
        (Number.isFinite(attempt) && (!Number.isFinite(last) || attempt > last)
          ? ' · Last attempt: ' + formatUtcStamp(attempt)
          : '') +
        (record.lastWikiStatus ? ' · ' + record.lastWikiStatus : '') +
        (progenitorValuesMissing(key === 'coda' ? 'coda-offerings' : 'tenet-offerings', record)
          ? ' · Some active offering values are unavailable.'
          : '') +
        (!canCheck
          ? now < expiry
            ? ' · Recheck unlocks when this rotation expires.'
            : ' · Already checked after this rotation expired.'
          : ' · Recheck is available.');
    }
    const batch = codaBatchAt(coda),
      label = 'Current batch ' + batch + ' - listed weapons follow the active wiki rotation.';
    if ($('coda-batch-label').textContent !== label) {
      renderOfferingRows('coda-offerings', coda);
      $('coda-batch-label').textContent = label;
    }
  }
  let progenitorTimer = null,
    progenitorWikiBusy = {};
  function formatUtcStamp(value) {
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(+date)
      ? 'Unknown'
      : date
          .toISOString()
          .replace('T', ' ')
          .replace(/\.\d{3}Z$/, ' UTC');
  }
  function wikiHtmlString(parse) {
    return typeof parse?.text === 'string' ? parse.text : parse?.text?.['*'] || '';
  }
  async function fetchProgenitorWikiPage(category) {
    const page = category === 'coda-offerings' ? 'Coda_Weapons' : 'Tenet_Weapons',
      url = new URL('https://wiki.warframe.com/api.php');
    url.search = new URLSearchParams({
      action: 'parse',
      page,
      prop: 'text|wikitext',
      format: 'json',
      formatversion: '2',
      origin: '*',
    });
    const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw Error('Wiki returned HTTP ' + response.status);
    const result = await response.json();
    if (result.error || !result.parse)
      throw Error(result.error?.info || 'Wiki did not return a parsed page.');
    const html = wikiHtmlString(result.parse);
    if (!html) throw Error('The wiki page had no rendered HTML.');
    return { html, wikitext: result.parse.wikitext || '', page };
  }
  function extractWikiRotationExpiry(html, now = Date.now()) {
    const doc = new DOMParser().parseFromString(html, 'text/html'),
      future = [];
    for (const el of doc.querySelectorAll(
      '[data-timestamp],[data-time],.countdown,[class*="timer"],[id*="timer"],[class*="countdown"],[id*="countdown"]',
    ))
      for (const value of [
        el.getAttribute('data-timestamp'),
        el.getAttribute('data-time'),
        el.getAttribute('datetime'),
        el.getAttribute('title'),
      ])
        if (value) {
          let date = /^\d{10,13}$/.test(value)
            ? new Date(Number(value) * (value.length <= 10 ? 1000 : 1))
            : new Date(value);
          if (Number.isFinite(+date) && +date > now && +date < now + 5 * 86400000)
            future.push(+date);
        }
    if (future.length) return Math.min(...future);
    const body = (doc.body?.textContent || '').replace(/\s+/g, ' '),
      label = body.match(/time until[^.]{0,180}?(?:rotation|cycling|cycle)[^:]{0,80}:?/i);
    if (!label) throw Error('The wiki page did not expose a labeled rotation countdown.');
    const segment = body.slice(label.index + label[0].length, label.index + label[0].length + 180);
    let total = 0,
      found = false;
    for (const m of segment.matchAll(
      /(\d+)\s*(days?|d|hours?|hrs?|h|minutes?|mins?|m|seconds?|secs?|s)\b/gi,
    )) {
      const n = +m[1],
        u = m[2].toLowerCase();
      total +=
        n * (u.startsWith('d') ? 86400 : u.startsWith('h') ? 3600 : u.startsWith('m') ? 60 : 1);
      found = true;
    }
    if (found && total > 0 && total < 5 * 86400) return now + total * 1000;
    throw Error('Could not read a future rotation countdown from the rendered wiki page.');
  }
  function applyWikiOfferingValues(category, html, record, batch) {
    const doc = new DOMParser().parseFromString(html, 'text/html'),
      wanted = arr(record.offerings).filter(
        (row) => category !== 'coda-offerings' || row.batch === batch,
      ),
      normalize = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, ''),
      elements = ['impact', 'heat', 'cold', 'electricity', 'toxin', 'magnetic', 'radiation'];
    let found = 0;
    for (const table of doc.querySelectorAll('table')) {
      let headerCells = [...table.querySelectorAll('thead th')];
      if (!headerCells.length)
        headerCells = [...table.querySelectorAll('tr:first-child th,tr:first-child td')];
      const headers = headerCells.map((cell) =>
          (cell.textContent || '').replace(/\s+/g, ' ').trim(),
        ),
        bonusColumn = headers.findIndex((text) =>
          /bonus|valence|progenitor|elemental damage/i.test(text),
        ),
        elementColumn = headers.findIndex((text) => /element|damage type/i.test(text));
      for (const tr of table.querySelectorAll('tr')) {
        const cells = [...tr.querySelectorAll('th,td')].map((cell) =>
            (cell.textContent || '').replace(/\s+/g, ' ').trim(),
          ),
          joined = cells.join(' ');
        if (bonusColumn < 0 && !/bonus|valence|progenitor|elemental damage/i.test(joined)) continue;
        const row = wanted.find((item) => normalize(joined).includes(normalize(item.name)));
        if (!row) continue;
        const elementCell = elementColumn >= 0 ? cells[elementColumn] : '';
        let element = '';
        for (const cell of [elementCell, ...cells]) {
          const match = elements.find((type) =>
            (' ' + cell.toLowerCase() + ' ').includes(' ' + type + ' '),
          );
          if (match) {
            element = match;
            break;
          }
        }
        const valueCell = bonusColumn >= 0 ? cells[bonusColumn] : joined,
          percent =
            valueCell.match(
              /^(?:25(?:\.\d+)?|2[6-9](?:\.\d+)?|[3-5]\d(?:\.\d+)?|60(?:\.0+)?)\s*%?$/,
            ) ||
            valueCell.match(/(?:25(?:\.\d+)?|2[6-9](?:\.\d+)?|[3-5]\d(?:\.\d+)?|60(?:\.\d+)?)\s*%/);
        if (element && percent) {
          row.element = element;
          row.bonusPercent = Number(percent[0].replace('%', ''));
          found++;
        }
      }
    }
    return found;
  }
  async function checkProgenitorWiki(category, { bootstrap = false } = {}) {
    const record = progenitorRecord(category),
      now = Date.now(),
      expiry = nextRotationAt(record, now),
      last = Date.parse(record.lastWikiCheckUTC || ''),
      missing = progenitorValuesMissing(category, record);
    if (
      (!bootstrap && (now < expiry || (Number.isFinite(last) && last >= expiry))) ||
      (bootstrap && !missing)
    ) {
      updateProgenitorCountdowns();
      return;
    }
    const key = category === 'coda-offerings' ? 'coda' : 'tenet',
      button = $('check-' + key + '-wiki');
    if (progenitorWikiBusy[key]) return;
    progenitorWikiBusy[key] = true;
    if (button) button.disabled = true;
    record.lastWikiAttemptUTC = new Date(now).toISOString();
    databaseDirty = true;
    persistCatalogue();
    const status = $(key + '-wiki-status');
    status.textContent = bootstrap
      ? 'Offering details are missing. Checking the wiki automatically…'
      : 'Requesting the wiki page and reading its rotation timer…';
    try {
      const page = await fetchProgenitorWikiPage(category);
      let next,
        timerUnavailable = false;
      try {
        next = extractWikiRotationExpiry(page.html, Date.now());
      } catch {
        timerUnavailable = true;
        next = fallbackNextRotationAt(record, Date.now());
      }
      const candidate = clone(db),
        nextRecord = records(candidate, category)[0];
      let batch =
        category === 'coda-offerings'
          ? codaBatchAt(nextRecord, now)
          : nextRecord.currentBatch || 'A';
      if (category === 'coda-offerings') {
        const timerLabel = (
          new DOMParser().parseFromString(page.html, 'text/html').body.textContent || ''
        ).match(/time until[^.]{0,100}?rotation\s*([AB])/i);
        if (timerLabel) batch = timerLabel[1] === 'A' ? 'B' : 'A';
        nextRecord.currentBatch = batch;
      }
      const count = applyWikiOfferingValues(category, page.html, nextRecord, batch);
      nextRecord.nextRotationUTC = new Date(next).toISOString();
      nextRecord.lastWikiCheckUTC = new Date().toISOString();
      nextRecord.lastWikiAttemptUTC = nextRecord.lastWikiCheckUTC;
      nextRecord.sourceRevisionCheckedAt = nextRecord.lastWikiCheckUTC;
      nextRecord.snapshot = new Date().toISOString().slice(0, 10);
      const stillMissing = progenitorValuesMissing(category, nextRecord);
      nextRecord.lastWikiStatus =
        (count
          ? count + ' offering value row(s) extracted.'
          : stillMissing
            ? 'The wiki refresh completed, but active element/bonus values were not present in its response.'
            : 'Offering data is current.') +
        (timerUnavailable
          ? ' The page timer could not be read; the stored 96-hour rotation schedule was retained.'
          : '');
      applyDatabase(candidate);
      renderProgenitorWeapons();
      status.textContent =
        'Wiki checked ' +
        formatUtcStamp(nextRecord.lastWikiCheckUTC) +
        '; ' +
        (timerUnavailable ? 'stored rotation schedule retained.' : 'rotation timer updated. ') +
        nextRecord.lastWikiStatus;
      if (!bootstrap)
        notify(
          (key === 'coda' ? 'Coda' : 'Tenet') +
            ' wiki rechecked. ' +
            (count
              ? 'Updated ' + count + ' weapon rolls.'
              : 'Timer updated; offering values were not found.'),
        );
    } catch (error) {
      record.lastWikiStatus = 'Automatic wiki refresh failed: ' + error.message;
      databaseDirty = true;
      persistCatalogue();
      status.textContent =
        'Wiki check failed at ' +
        formatUtcStamp(record.lastWikiAttemptUTC) +
        ': ' +
        error.message +
        ' Offering data was not changed.';
      if (!bootstrap) notify('Wiki recheck failed: ' + error.message, true);
    } finally {
      progenitorWikiBusy[key] = false;
      updateProgenitorCountdowns();
    }
  }
  async function refreshMissingProgenitorData() {
    for (const category of ['tenet-offerings', 'coda-offerings']) {
      const record = progenitorRecord(category),
        key = category === 'coda-offerings' ? 'coda' : 'tenet';
      if (record && progenitorValuesMissing(category, record) && !progenitorBootstrapStarted[key]) {
        progenitorBootstrapStarted[key] = true;
        await checkProgenitorWiki(category, { bootstrap: true });
      }
    }
  }
  function showView(view) {
    if (!document.getElementById('view-' + view)) view = 'calculator';
    for (const v of document.querySelectorAll('.view')) v.hidden = v.id !== 'view-' + view;
    for (const b of document.querySelectorAll('[data-view]'))
      b.setAttribute('aria-selected', String(b.dataset.view === view));
    try {
      localStorage.setItem('void-arsenal-selected-view-v1', view);
    } catch (error) {
      reportOptionalFailure('Selected tab could not be saved', error);
    }
    if (view === 'database') renderEditorList();
    if (view === 'progenitors') renderProgenitorWeapons();
    if (view === 'rivens') renderRivenList();
  }
  let ttkWorker = null,
    ttkJobId = 0,
    ttkJobs = new Map(),
    ttkRenderToken = 0;
  function discardTtkWorker() {
    if (ttkWorker) ttkWorker.terminate();
    ttkWorker = null;
    ttkJobs.clear();
  }
  function fallbackTtk(job) {
    setTimeout(() => {
      if (job.token !== ttkRenderToken) return;
      try {
        const weapon = calculateWeapon(db, job.state),
          enemy = get(db, 'enemies', job.enemyId);
        job.done(compactTtkResult(simulateTtk(db, job.state, weapon, enemy)));
      } catch (error) {
        job.done(null, error.message);
      }
    }, 0);
  }
  function ensureTtkWorker() {
    if (ttkWorker) return ttkWorker;
    try {
      ttkWorker = new Worker(new URL('app.js', location.href));
      ttkWorker.onmessage = (e) => {
        const m = e.data || {};
        if (m.type === 'ready') return;
        const job = ttkJobs.get(m.id);
        if (!job) return;
        ttkJobs.delete(m.id);
        if (job.token !== ttkRenderToken) return;
        if (m.type === 'error') job.done(null, m.message);
        else job.done(m.result);
      };
      ttkWorker.onerror = () => {
        const jobs = [...ttkJobs.values()];
        discardTtkWorker();
        jobs.forEach(fallbackTtk);
      };
      ttkWorker.postMessage({ type: 'init', db });
      return ttkWorker;
    } catch {
      return null;
    }
  }
  function requestTtk(stateSnapshot, enemyId, done) {
    const job = { done, token: ttkRenderToken, state: stateSnapshot, enemyId };
    const worker = ensureTtkWorker();
    if (!worker) {
      fallbackTtk(job);
      return;
    }
    const id = ++ttkJobId;
    ttkJobs.set(id, job);
    worker.postMessage({ type: 'ttk', id, state: stateSnapshot, enemyId });
  }
  function schedule() {
    renderArsenalUI();
    persist();
    if (!renderFrame)
      renderFrame = requestAnimationFrame(() => {
        renderFrame = 0;
        renderCalculations();
      });
  }
  function chosenWeapon() {
    return get(db, 'weapons', state.weaponId);
  }
  function fillWeaponList() {
    const search = $('arsenal-search').value.toLowerCase();
    const builds = records(db, 'arsenal').filter((b) => {
      const w = get(db, 'weapons', b.state.weaponId);
      return (b.name + ' ' + w?.name).toLowerCase().includes(search);
    });
    $('weapon-select').innerHTML = options(
      builds.map((b) => {
        const weapon = get(db, 'weapons', b.state.weaponId),
          entry = records(db, 'progenitor-library').find(
            (item) =>
              item.acquired &&
              (item.weaponId === weapon?.id ||
                String(item.name || '').toLowerCase() === String(weapon?.name || '').toLowerCase()),
          ),
          element = b.state.progenitor || entry?.element,
          bonus = Number(b.state.progenitorValue ?? entry?.bonusPercent);
        return {
          id: b.id,
          name:
            b.name +
            ' · ' +
            (weapon?.name || 'Unknown weapon') +
            (element && bonus > 0
              ? ' · ' +
                String(element).charAt(0).toUpperCase() +
                String(element).slice(1) +
                ' ' +
                fmt(bonus, 2) +
                '%'
              : ''),
        };
      }),
      activeBuildId,
      'Choose a saved build',
    );
    $('weapon-count').textContent = records(db, 'arsenal').length + ' SAVED BUILDS';
  }
  function unsavedBuild() {
    return draftOpen && (!activeBuildId || JSON.stringify(state) !== savedFingerprint);
  }
  function allowDiscard() {
    return (
      !unsavedBuild() ||
      confirm('Discard the unsaved changes to this build? Use Save build first to keep them.')
    );
  }
  function renderArsenalUI() {
    $('back-to-arsenal').hidden = !draftOpen;
    $('back-to-arsenal').textContent = activeBuildId ? 'Back to arsenal' : 'Cancel creation';
    fillWeaponList();
    $('arsenal-empty').hidden = draftOpen || records(db, 'arsenal').length > 0;
    $('target-panel').hidden = !draftOpen;
    $('build-workspace').hidden = !draftOpen;
    for (const id of ['save-arsenal-build', 'save-as-build', 'export-build'])
      $(id).disabled = !draftOpen;
    for (const id of ['rename-build', 'delete-build']) $(id).disabled = !activeBuildId;
    const saved = get(db, 'arsenal', activeBuildId);
    $('draft-status').textContent = draftOpen
      ? saved
        ? saved.name + (unsavedBuild() ? ' · unsaved changes' : ' · saved')
        : 'New weapon · unsaved draft'
      : records(db, 'arsenal').length
        ? 'Choose a saved build or create another weapon.'
        : '';
    $('legacy-recovery').hidden = !recoveredDraft;
  }
  function refreshBuilder() {
    fillCatalogControls();
    renderWeaponControls();
    renderMods();
    renderArcanes();
    renderArchonShards();
    syncInputs();
    renderArsenalUI();
    schedule();
  }
  function loadArsenalBuild(id) {
    if (!id) {
      renderArsenalUI();
      return;
    }
    if (!allowDiscard()) {
      fillWeaponList();
      return;
    }
    const b = get(db, 'arsenal', id);
    if (!b) return;
    try {
      state = normalizeBuild(db, b.state);
      applyOwnedProgenitor(state);
      activeBuildId = id;
      draftOpen = true;
      savedFingerprint = JSON.stringify(normalizeBuild(db, b.state));
      refreshBuilder();
    } catch (e) {
      notify('Cannot open build: ' + e.message, true);
    }
  }
  function fillCreator() {
    const category = $('weapon-category').value,
      search = $('weapon-search').value.toLowerCase();
    const items = records(db, 'weapons').filter(
      (w) => (!category || w.category === category) && w.name.toLowerCase().includes(search),
    );
    $('catalog-list').innerHTML =
      items
        .map(
          (w) =>
            '<button data-create-weapon="' +
            escape(w.id) +
            '">' +
            escape(w.name) +
            '<small>' +
            escape(w.type) +
            ' · ' +
            escape(w.category) +
            '</small></button>',
        )
        .join('') || '<p class="empty">No matching weapons.</p>';
    for (const b of document.querySelectorAll('[data-create-weapon]'))
      b.onclick = () => {
        if (!allowDiscard()) return;
        activeBuildId = '';
        draftOpen = true;
        selectWeapon(b.dataset.createWeapon);
        state.evolutionConditions = {};
        savedFingerprint = '';
        $('weapon-creator').close();
        renderArsenalUI();
      };
  }
  function saveArsenalBuild(asNew = false) {
    if (!draftOpen) return;
    try {
      const candidate = normalizeBuild(db, state),
        existing = asNew ? null : get(db, 'arsenal', activeBuildId),
        name = existing?.name || prompt('Name this arsenal build:', chosenWeapon().name + ' build');
      if (name === null) return;
      if (!name.trim()) throw Error('Enter a build name.');
      const build = {
        id:
          existing?.id ||
          'build-' +
            (global.crypto?.randomUUID?.() ||
              Date.now() + '-' + Math.random().toString(36).slice(2)),
        name: name.trim(),
        state: clone(candidate),
      };
      const next = clone(db),
        i = next.arsenal.records.findIndex((b) => b.id === build.id);
      if (i < 0) next.arsenal.records.push(build);
      else next.arsenal.records[i] = build;
      const errors = validateDatabase(next);
      if (errors.length) throw Error(errors.slice(0, 6).join('\n'));
      db = next;
      state = candidate;
      activeBuildId = build.id;
      savedFingerprint = JSON.stringify(state);
      indexData();
      renderArsenalUI();
      persist();
      notify('Saved ' + build.name + '. Export arsenal.json for a portable backup.');
    } catch (e) {
      notify('Build save rejected: ' + e.message, true);
    }
  }
  function renameArsenalBuild() {
    const b = get(db, 'arsenal', activeBuildId);
    if (!b) return;
    const name = prompt('Rename arsenal build:', b.name);
    if (name === null) return;
    if (!name.trim()) {
      notify('Enter a build name.', true);
      return;
    }
    b.name = name.trim();
    renderArsenalUI();
    persist();
  }
  function deleteArsenalBuild() {
    const b = get(db, 'arsenal', activeBuildId);
    if (!b || !confirm('Delete ' + b.name + ' and its current unsaved changes from your arsenal?'))
      return;
    db.arsenal.records = db.arsenal.records.filter((x) => x.id !== b.id);
    activeBuildId = '';
    draftOpen = false;
    savedFingerprint = '';
    renderArsenalUI();
    persist();
    notify('Build deleted.');
  }
  function importArsenalCandidate(data, source = db) {
    if (data?.category !== 'arsenal' || data.schemaVersion !== 1 || !Array.isArray(data.records))
      throw Error('Expected an arsenal.json category file.');
    const next = clone(source),
      conflicts = [];
    next.arsenal = clone(data);
    delete next.arsenal.customRecords;
    if (
      data.customRecords &&
      (typeof data.customRecords !== 'object' || Array.isArray(data.customRecords))
    )
      throw Error('Invalid custom records.');
    for (const [c, items] of Object.entries(data.customRecords || {})) {
      if (!CATEGORIES.includes(c) || c === 'arsenal' || !Array.isArray(items))
        throw Error('Unknown custom record category: ' + c);
      const seen = new Set();
      for (const r of items) {
        if (!r?.id || seen.has(r.id)) throw Error('Invalid or duplicate custom record.');
        seen.add(r.id);
        const i = next[c].records.findIndex((x) => x.id === r.id);
        if (i >= 0) {
          if (JSON.stringify(r) !== JSON.stringify(next[c].records[i]))
            conflicts.push(c + ' / ' + r.name);
          next[c].records[i] = clone(r);
        } else next[c].records.push(clone(r));
      }
    }
    restoreArcaneRarities(next);
    syncProgenitorLibraryFromWeapons(next);
    const errors = validateDatabase(next);
    if (errors.length) throw Error(errors.slice(0, 10).join('\n'));
    next.arsenal.records.forEach((b) => {
      b.state = normalizeBuild(next, b.state);
    });
    return { db: next, conflicts };
  }
  async function previewArsenalFile(file) {
    try {
      if (!file) return;
      const data = JSON.parse(await file.text());
      pendingArsenal = importArsenalCandidate(data);
      const rivenCount = arr(data.customRecords?.rivens).length,
        libraryCount = arr(data.customRecords?.['progenitor-library']).length;
      $('arsenal-import-preview').innerHTML =
        '<p>' +
        pendingArsenal.db.arsenal.records.length +
        ' saved builds, ' +
        rivenCount +
        ' workshop Rivens, and ' +
        libraryCount +
        ' progenitor library entries will be imported.</p>' +
        (pendingArsenal.conflicts.length
          ? '<div class="warning">These edited records will replace existing records:<br>' +
            pendingArsenal.conflicts.map(escape).join('<br>') +
            '</div>'
          : '<p class="hint">No conflicting custom records.</p>') +
        '<p class="hint">Import applies all records together. Current unsaved build changes will be discarded.</p>';
      $('arsenal-import-dialog').showModal();
    } catch (e) {
      notify('Arsenal import rejected: ' + e.message, true);
    } finally {
      $('arsenal-file').value = '';
    }
  }
  function bindArsenal() {
    $('create-weapon').onclick = () => {
      fillCreator();
      $('weapon-creator').showModal();
    };
    $('close-creator').onclick = () => $('weapon-creator').close();
    $('weapon-category').onchange = fillCreator;
    $('weapon-search').oninput = fillCreator;
    $('arsenal-search').oninput = fillWeaponList;
    $('weapon-select').onchange = () => loadArsenalBuild($('weapon-select').value);
    $('back-to-arsenal').onclick = () => {
      if (!allowDiscard()) return;
      activeBuildId = '';
      draftOpen = false;
      savedFingerprint = '';
      state = defaultState(db);
      renderArsenalUI();
      persist();
    };
    $('save-arsenal-build').onclick = () => saveArsenalBuild();
    $('save-as-build').onclick = () => saveArsenalBuild(true);
    $('rename-build').onclick = renameArsenalBuild;
    $('delete-build').onclick = deleteArsenalBuild;
    $('export-arsenal').onclick = () => {
      download('arsenal.json', JSON.stringify(arsenalExport(db, bundled), null, 2) + '\n');
      notify(
        'Exported saved builds, Riven Workshop data, and recorded progenitor weapons' +
          (unsavedBuild() ? '; current unsaved build changes are excluded.' : '.'),
      );
    };
    $('import-arsenal').onclick = () => $('arsenal-file').click();
    $('arsenal-file').onchange = () => previewArsenalFile($('arsenal-file').files[0]);
    $('cancel-arsenal-import').onclick = () => {
      pendingArsenal = null;
      $('arsenal-import-dialog').close();
    };
    $('apply-arsenal-import').onclick = () => {
      if (!pendingArsenal) return;
      const errors = validateDatabase(pendingArsenal.db);
      if (errors.length) {
        notify(errors.slice(0, 6).join('\n'), true);
        return;
      }
      db = pendingArsenal.db;
      pendingArsenal = null;
      activeBuildId = '';
      draftOpen = false;
      savedFingerprint = '';
      indexData();
      $('arsenal-import-dialog').close();
      if (db.arsenal.records.length) {
        const b = db.arsenal.records[0];
        state = normalizeBuild(db, b.state);
        applyOwnedProgenitor(state);
        activeBuildId = b.id;
        draftOpen = true;
        savedFingerprint = JSON.stringify(normalizeBuild(db, b.state));
      }
      refreshBuilder();
      databaseDirty = true;
      persist();
      notify('Arsenal and its Riven/progenitor backup data imported.');
    };
    $('recover-build').onclick = () => {
      if (!recoveredDraft || !allowDiscard()) return;
      try {
        state = normalizeBuild(db, recoveredDraft);
        activeBuildId = '';
        draftOpen = true;
        recoveredDraft = null;
        refreshBuilder();
      } catch (e) {
        notify(e.message, true);
      }
    };
    global.addEventListener('pagehide', flushPersist);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flushPersist();
    });
    global.addEventListener('beforeunload', (e) => {
      flushPersist();
      if (unsavedBuild()) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
  }

  function selectWeapon(id) {
    const w = get(db, 'weapons', id);
    if (!w) return;
    const fresh = defaultState(db);
    if (rivenDraft && !rivenEditing && !rivenDraft.attributes.some((a) => a.spliced)) {
      rivenDraft.family = w.family;
      rivenDraft.category = rivenCategory(w);
      rivenDraft.weaponId = w.id;
    }
    state.weaponId = id;
    state.category = w.category;
    state.attackId = w.attacks[0].id;
    state.incarnonEnabled = false;
    state.rank = w.maxRank;
    state.slots = fresh.slots.map((s, i) => ({
      ...s,
      polarity: normalizePolarity(w.polarities[i]),
    }));
    state.exilus = { ...fresh.exilus, polarity: normalizePolarity(w.exilusPolarity) };
    state.aura = { ...fresh.aura };
    state.stance = { ...fresh.stance, polarity: normalizePolarity(w.stancePolarity) };
    state.arcanes = fresh.arcanes;
    state.shards = fresh.shards;
    state.forma = w.maxRank > 30 ? (w.maxRank - 30) / 2 : 0;
    state.parts = {};
    state.evolutions = {};
    state.evolutionConditions = {};
    state.progenitor = '';
    state.progenitorValue = 0;
    applyOwnedProgenitor(state);
    $('weapon-category').value = w.category;
    $('weapon-search').value = '';
    fillWeaponList();
    renderWeaponControls();
    renderMods();
    renderArcanes();
    renderArchonShards();
    syncInputs();
    if (rivenDraft && !rivenEditing && !document.getElementById('view-rivens').hidden)
      renderRivenForm();
    schedule();
  }
  function hasIncarnonProfile(w, source = db) {
    return (
      !!w &&
      (!!w.incarnonVariant ||
        !!w.incarnonImage ||
        arr(w.attacks).some((a) => /incarnon/i.test(a.name)) ||
        records(source, 'incarnon-evolutions').some((e) => e.family === w.family))
    );
  }
  function availableWeaponAttacks(attacks, incarnonEnabled) {
    return arr(attacks).filter(
      (a) => !a.componentOf && (incarnonEnabled || !/Incarnon/i.test(a.name)),
    );
  }
  function attackProfileGroup(attack) {
    return attack?.shotType === 'AoE' || /radial/i.test(attack?.name || '')
      ? 'Radial attack'
      : /Incarnon/i.test(attack?.name || '')
        ? 'Incarnon attack'
        : 'Normal attack';
  }
  function attackModeLabel(attack) {
    return /Incarnon/i.test(attack?.name || '')
      ? 'Incarnon mode'
      : /(?:alt[ -]?fire|alternate fire)/i.test(
            (attack?.name || '') + ' ' + (attack?.trigger || ''),
          )
        ? 'Alt-fire mode'
        : 'Base mode';
  }
  function weaponBaseAnalysis(w) {
    const direct = arr(w?.attacks).filter((a) => !a.componentOf && a.shotType !== 'AoE'),
      normal = direct.find((a) => !/incarnon/i.test(a.name || '')) || direct[0],
      incarnon = direct.filter((a) => /incarnon/i.test(a.name || '')),
      attacks = [...(normal ? [normal] : []), ...incarnon.filter((a) => a !== normal)];
    if (!attacks.length) return null;
    const profiles = attacks.map((attack) => {
        const critChance = Math.max(0, Number(attack.critChance) || 0),
          critMultiplier = Math.max(1, Number(attack.critMultiplier) || 1),
          statusChance = Math.max(0, Number(attack.statusChance) || 0);
        return {
          attack,
          critChance,
          critMultiplier,
          statusChance,
          critScore: critChance * (critMultiplier - 1),
        };
      }),
      classify = (items, label) => {
        if (!items.length) return null;
        const critScore = items.reduce((sum, p) => sum + p.critScore, 0) / items.length,
          statusChance = items.reduce((sum, p) => sum + p.statusChance, 0) / items.length,
          scoreGap =
            Math.max(critScore, statusChance) > 0
              ? Math.abs(critScore - statusChance) / Math.max(critScore, statusChance)
              : Infinity,
          dual = scoreGap <= 0.05,
          use = dual ? 'Crit or Status' : statusChance > critScore ? 'Status' : 'Crit',
          leanings = dual ? ['Crit', 'Status'] : [use],
          reason = dual
            ? 'Both Crit and Status are suitable: averaged scores are within 5% (' +
              pct(critScore) +
              ' expected critical contribution vs ' +
              pct(statusChance) +
              ' status chance).'
            : statusChance > critScore
              ? 'Status is suggested because average status chance (' +
                pct(statusChance) +
                ') exceeds expected critical contribution (' +
                pct(critScore) +
                ', crit chance × excess critical multiplier).'
              : 'Crit is suggested because expected critical contribution (' +
                pct(critScore) +
                ', crit chance × excess critical multiplier) exceeds average status chance (' +
                pct(statusChance) +
                ').';
        return {
          label,
          critScore,
          statusChance,
          scoreGap,
          dual,
          use,
          leanings,
          reason,
          profiles: items,
        };
      },
      baseProfiles = profiles.filter((p) => !/incarnon/i.test(p.attack.name || '')),
      incarnonProfiles = profiles.filter((p) => /incarnon/i.test(p.attack.name || '')),
      base = classify(baseProfiles, 'Base'),
      incarnonMode = classify(incarnonProfiles, 'Incarnon'),
      overall = classify(profiles, 'Overall'),
      fallback = overall || base || incarnonMode;
    return { ...fallback, base, incarnon: incarnonMode, profiles };
  }
  function statusAttackProfiles(weapon, incarnonEnabled) {
    return availableWeaponAttacks(weapon?.attacks, incarnonEnabled);
  }
  function shouldShowIncarnonEvolutions(w, incarnonEnabled) {
    return !!incarnonEnabled && hasIncarnonProfile(w);
  }
  function renderWeaponControls() {
    const w = chosenWeapon();
    const toggle = $('incarnon-toggle'),
      help = $('incarnon-toggle-help'),
      wrap = $('incarnon-toggle-wrap');
    const hasIncarnon = hasIncarnonProfile(w);
    wrap.hidden = !hasIncarnon;
    toggle.disabled = !hasIncarnon;
    toggle.checked = !!(hasIncarnon && state.incarnonEnabled);
    help.textContent = 'Shows Incarnon attacks, artwork and evolution choices.';
    wrap.setAttribute('aria-label', 'Incarnon mode available');
    if (!w) return;
    $('incarnon-toggle').onchange = (e) => {
      state.incarnonEnabled = e.target.checked;
      renderWeaponControls();
      renderMods();
      renderArcanes();
      renderArchonShards();
      schedule();
    };
    const allAttacks = [...w.attacks];
    if (isMelee(w) && w.heavyAttack) allAttacks.push({ id: 'heavy', name: 'Heavy Attack' });
    const attacks = availableWeaponAttacks(allAttacks, state.incarnonEnabled);
    if (!attacks.some((a) => a.id === state.attackId))
      state.attackId = attacks[0]?.id || allAttacks[0]?.id;
    $('attack-select').innerHTML = options(attacks, state.attackId);
    $('weapon-image').innerHTML = recordImage(
      state.incarnonEnabled && w.incarnonImage ? { ...w, image: w.incarnonImage } : w,
      'weapon',
      state.incarnonEnabled && w.incarnonImage ? w.image : '',
    );
    $('weapon-title').textContent = w.name;
    $('progenitor-controls').hidden = !/^(Kuva|Tenet|Coda|Dual Coda) /.test(w.name);
    $('weapon-tags').innerHTML = [
      w.type,
      w.category,
      w.rivenDisposition != null ? 'Riven ' + fmt(w.rivenDisposition, 2) + '×' : 'No Riven',
    ]
      .map((t) => '<span class="badge">' + escape(t) + '</span>')
      .join('');
    const analysis = weaponBaseAnalysis(w);
    $('weapon-suggested-use').innerHTML = analysis
      ? '<strong>Suggested Use:</strong> <span class="suggested-' +
        (analysis.dual ? 'both' : analysis.use.toLowerCase()) +
        '">' +
        analysis.use +
        '</span> <small>' +
        analysis.profiles
          .map(
            (p) =>
              escape(p.attack.name) +
              ': ' +
              pct(p.critChance) +
              ' crit · ' +
              fmt(p.critMultiplier, 2) +
              '× crit damage · ' +
              pct(p.statusChance) +
              ' status',
          )
          .join(' | ') +
        '</small>'
      : '<strong>Suggested Use:</strong> unavailable';
    $('weapon-source').innerHTML =
      '<a href="' +
      escape(safeURL(w.wiki)) +
      '" target="_blank" rel="noopener">Weapon reference ↗</a> · ' +
      escape(w.source?.snapshot || 'Custom');
    $('exalted-controls').hidden = !(
      w.type === 'Exalted Weapon' || w.tags.includes('POWER_WEAPON')
    );
    const group = w.tags.includes('MODULAR_GUN')
      ? w.category === 'Primary'
        ? 'KitgunPrimary'
        : 'KitgunSecondary'
      : w.traits.includes('Zaw')
        ? 'Zaw'
        : w.category === 'Amp' && /Prism|Scaffold/.test(w.name)
          ? 'Amp'
          : '';
    let html = '';
    if (group) {
      const kinds = group.startsWith('Kitgun')
        ? ['Grip', 'Loader']
        : group === 'Zaw'
          ? ['Grip', 'Link']
          : ['Prism', 'Scaffold', 'Brace'];
      html = '<h3>Modular parts</h3><div class="fieldgrid">';
      for (const kind of kinds) {
        const parts =
          kind === 'Prism' || kind === 'Scaffold'
            ? records(db, 'weapons').filter((p) => p.category === 'Amp' && p.name.includes(kind))
            : records(db, 'modular-parts').filter((p) => p.group === group && p.kind === kind);
        if (!state.parts[kind] && parts.length)
          state.parts[kind] = parts.find((p) => p.id === w.id)?.id || parts[0].id;
        html +=
          '<label>' +
          kind +
          '<select data-part="' +
          kind +
          '">' +
          options(parts, state.parts[kind]) +
          '</select></label>';
      }
      html += '</div>';
    }
    $('modular-controls').innerHTML = html;
    renderEvolutionControls();
    if (group === 'Amp') {
      const configured = configureWeapon(db, state).w;
      if (!configured.attacks.some((a) => a.id === state.attackId))
        state.attackId = configured.attacks[0].id;
      $('attack-select').innerHTML = options(configured.attacks, state.attackId);
    }
    for (const el of document.querySelectorAll('[data-part]'))
      el.onchange = () => {
        state.parts[el.dataset.part] = el.value;
        renderWeaponControls();
        renderMods();
        schedule();
      };
  }
  function evolutionDescription(e, w) {
    if (!e) return 'No evolution selected.';
    const effects = e.variantEffects?.[w.incarnonVariant || w.name] || e.effects,
      formatEffect = (effect) => {
        const flat = [
            'baseDamage',
            'baseMagazine',
            'baseMultishot',
            'baseAmmoSet',
            'baseCritDamage',
            'punchThrough',
            'range',
          ].includes(effect.stat),
          value =
            (effect.value >= 0 ? '+' : '') + (flat ? fmt(effect.value, 3) : pct(effect.value));
        const names = {
          baseDamage: 'base damage',
          baseMagazine: 'base magazine capacity',
          baseMultishot: 'base multishot',
          baseAmmoSet: 'reserve ammo capacity',
          baseCrit: 'base critical chance',
          baseStatus: 'base status chance',
          baseCritDamage: 'base critical multiplier',
          directStatusDamage: 'direct damage per target status type',
          damage: 'damage (additive with damage mods)',
          flatCrit: 'final critical chance',
          flatStatus: 'final status chance',
        };
        const condition = arr(e.conditions).find((c) => c.id === effect.condition);
        return (
          value +
          ' ' +
          (names[effect.stat] || effect.stat.replace(/([A-Z])/g, ' $1').toLowerCase()) +
          (effect.scope && effect.scope !== 'both'
            ? ' · ' + effect.scope + ' form/component'
            : '') +
          (condition ? ' · ' + condition.label : '')
        );
      };
    const table = Object.entries(e.variantValues?.[w.incarnonVariant || w.name] || {})
      .map(([key, v]) => key + ' = ' + fmt(v.value, 3) + v.unit)
      .join(' · ');
    return (
      e.name +
      ' — ' +
      w.name +
      '\n' +
      effects.map(formatEffect).join('\n') +
      (table ? '\nSource table: ' + table : '') +
      (e.description ? '\n\n' + e.description : '') +
      (e.limitations.length ? '\n\nNot modeled:\n' + e.limitations.join('\n') : '') +
      (e.nonDamageEffects?.length ? '\n\nUtility effects: ' + e.nonDamageEffects.join(' · ') : '')
    );
  }
  function renderEvolutionControls() {
    autoSelectEvolutions(db, state);
    const w = chosenWeapon(),
      ev = records(db, 'incarnon-evolutions').filter((e) => e.family === w.family);
    state.evolutionConditions ||= {};
    if (!shouldShowIncarnonEvolutions(w, state.incarnonEnabled)) {
      $('evolution-controls').innerHTML = '';
      return;
    }
    $('evolution-controls').innerHTML = ev.length
      ? '<h3>Incarnon evolutions</h3><p class="hint">Conditional bonuses start inactive. Hover or focus a choice for its effects; tap Effect details to read them.</p><div class="fieldgrid">' +
        [...new Set(ev.map((e) => e.tier))]
          .sort()
          .map((t) => {
            const choices = ev.filter((e) => e.tier === t),
              chosen = choices.find((e) => e.id === state.evolutions[t]),
              detail = evolutionDescription(chosen, w);
            return (
              '<div class="full"><div class="evolution-choice" tabindex="0"><label>Evolution ' +
              t +
              '<select data-evolution="' +
              t +
              '" aria-describedby="evolution-detail-' +
              t +
              '" ' +
              (choices.length === 1 ? 'disabled ' : '') +
              'title="' +
              escape(detail) +
              '">' +
              options(choices, state.evolutions[t], choices.length === 1 ? '' : 'None') +
              '</select></label><div id="evolution-detail-' +
              t +
              '" class="evolution-tip" role="tooltip">' +
              escape(detail) +
              '</div></div>' +
              (chosen
                ? '<details class="hint spacer"><summary>Effect details</summary><div class="evolution-details">' +
                  escape(detail) +
                  '</div></details>' +
                  arr(chosen.conditions)
                    .map(
                      (c) =>
                        '<label class="spacer">' +
                        escape(c.label) +
                        (c.maxStacks > 1 ? ' (0–' + c.maxStacks + ')' : ' active') +
                        '<input data-evolution-condition="' +
                        escape(c.id) +
                        '" data-evolution-id="' +
                        escape(chosen.id) +
                        '" type="' +
                        (c.maxStacks === 1 ? 'checkbox' : 'number') +
                        '" min="0" max="' +
                        c.maxStacks +
                        '" step="1" ' +
                        (c.maxStacks === 1
                          ? state.evolutionConditions[chosen.id]?.[c.id]
                            ? 'checked'
                            : ''
                          : 'value="' + (state.evolutionConditions[chosen.id]?.[c.id] || 0) + '"') +
                        '></label>',
                    )
                    .join('')
                : '') +
              '<details class="spacer"><summary>Preview evolution ' +
              t +
              ' choices</summary>' +
              choices
                .map(
                  (e) =>
                    '<div class="evolution-choice spacer"><button type="button" data-evolution-preview="' +
                    escape(e.id) +
                    '" data-evolution-tier="' +
                    t +
                    '">' +
                    escape(e.name) +
                    '</button><div class="evolution-tip" role="tooltip">' +
                    escape(evolutionDescription(e, w)) +
                    '</div><details class="hint"><summary>Effect details</summary><div class="evolution-details">' +
                    escape(evolutionDescription(e, w)) +
                    '</div></details></div>',
                )
                .join('') +
              '</details></div>'
            );
          })
          .join('') +
        '</div>'
      : '';
    const select = (tier, id) => {
      state.evolutions[tier] = id;
      renderEvolutionControls();
      schedule();
    };
    for (const el of document.querySelectorAll('[data-evolution]'))
      el.onchange = () => select(el.dataset.evolution, el.value);
    for (const el of document.querySelectorAll('[data-evolution-preview]'))
      el.onclick = () => select(el.dataset.evolutionTier, el.dataset.evolutionPreview);
    for (const el of document.querySelectorAll('[data-evolution-condition]'))
      el.oninput = () => {
        const e = get(db, 'incarnon-evolutions', el.dataset.evolutionId),
          c = e.conditions.find((c) => c.id === el.dataset.evolutionCondition);
        (state.evolutionConditions[e.id] ||= {})[c.id] =
          el.type === 'checkbox'
            ? el.checked
              ? 1
              : 0
            : Math.round(clamp(el.value, 0, c.maxStacks));
        schedule();
      };
  }

  function modMatchesSearch(m, query) {
    const search = String(query || '')
      .trim()
      .toLowerCase();
    if (!search) return true;
    if ((m.name + ' ' + (m.description || '')).toLowerCase().includes(search)) return true;
    const ingredients = ELEMENT_RECIPES[search];
    return (
      !!ingredients &&
      arr(m.effects).some(
        (e) => ingredients.includes(e.stat?.slice(8)) && e.stat?.startsWith('element:'),
      )
    );
  }
  function modChoices(w, kind = 'weapon', query = '') {
    const mods = records(db, 'mods').filter(
      (m) =>
        (kind === 'aura'
          ? m.type === 'Aura'
          : compatible(m, w) && (kind !== 'exilus' || m.isExilus)) && modMatchesSearch(m, query),
    );
    if (kind === 'weapon')
      for (const r of records(db, 'rivens'))
        if (r.family === w.family && r.category === rivenCategory(w) && modMatchesSearch(r, query))
          mods.push({ id: 'riven:' + r.id, name: r.name + ' · Riven' });
    return mods.sort((a, b) => a.name.localeCompare(b.name));
  }
  function openModPicker(slot) {
    const w = chosenWeapon();
    if (!w) return;
    modPickerSlot = slot;
    $('mod-picker-search').value = '';
    $('mod-picker-title').textContent =
      slot === 9
        ? 'Choose an Aura mod'
        : slot === 8
          ? 'Choose an Exilus mod'
          : 'Choose a mod for slot ' + (slot + 1);
    $('mod-picker-hint').textContent =
      slot === 9
        ? 'Warframe Aura mods; supported effects also update weapon and enemy calculations.'
        : 'Available mods for ' +
          w.name +
          (slot === 8 ? ' · Exilus compatible' : ' · weapon compatible');
    $('clear-mod-selection').disabled = !modSlotState(slot).id;
    renderModPicker();
    $('mod-picker').showModal();
    $('mod-picker-search').focus();
  }
  function hideModPickerPreview() {
    const preview = $('mod-picker-preview');
    if (preview) {
      preview.hidden = true;
      preview.innerHTML = '';
    }
  }
  function showModPickerPreview(button, face) {
    const preview = $('mod-picker-preview');
    if (!preview) return;
    preview.innerHTML = '<div class="mod-card">' + face + '</div>';
    const rect = button.getBoundingClientRect(),
      width = 220,
      height = 300,
      margin = 8;
    let left = rect.right + 12;
    if (left + width > innerWidth - margin) left = rect.left - width - 12;
    preview.style.left = clamp(left, margin, Math.max(margin, innerWidth - width - margin)) + 'px';
    preview.style.top =
      clamp(
        rect.top + rect.height / 2 - height / 2,
        margin,
        Math.max(margin, innerHeight - height - margin),
      ) + 'px';
    preview.hidden = false;
  }
  function renderModPicker() {
    hideModPickerPreview();
    if (modPickerSlot < 0) return;
    const w = chosenWeapon();
    if (!w) return;
    const kind = modPickerSlot === 9 ? 'aura' : modPickerSlot === 8 ? 'exilus' : 'weapon',
      query = $('mod-picker-search').value,
      choices = modChoices(w, kind, query);
    const current = modSlotState(modPickerSlot).id;
    $('mod-picker-list').innerHTML =
      choices
        .map((choice) => {
          const previewSlot = {
              id: choice.id,
              rank: 0,
              polarity: modSlotState(modPickerSlot).polarity || '',
              stacks: 0,
              uptime: 100,
            },
            mod = slotMod(db, previewSlot, w);
          if (!mod) return '';
          return (
            '<button type="button" class="mod-picker-mini' +
            (choice.id === current ? ' selected' : '') +
            '" data-pick-mod="' +
            escape(choice.id) +
            '" aria-label="' +
            escape((choice.id === current ? 'Equipped: ' : 'Equip ') + choice.name) +
            '">' +
            modFaceHTML(mod, previewSlot, modPickerSlot, kind) +
            (choice.id === current ? '<span class="mod-picker-selected">Equipped</span>' : '') +
            '</button>'
          );
        })
        .join('') || '<p class="empty">No compatible mods match this search.</p>';
    for (const button of document.querySelectorAll('[data-pick-mod]'))
      button.onclick = () => {
        const slot = modPickerSlot,
          s = modSlotState(slot);
        s.id = button.dataset.pickMod;
        s.rank = 0;
        s.stacks = 0;
        s.uptime = 100;
        hideModPickerPreview();
        modPickerSlot = -1;
        $('mod-picker').close();
        renderMods();
        schedule();
      };
    for (const button of $('mod-picker-list').querySelectorAll('[data-pick-mod]')) {
      const face = button.innerHTML.replace(
        /<span class="mod-picker-selected">Equipped<\/span>$/,
        '',
      );
      button.onmouseenter = button.onfocus = () => showModPickerPreview(button, face);
      button.onmouseleave = button.onblur = hideModPickerPreview;
    }
    $('clear-mod-selection').disabled = !current;
  }
  function rivenEffectText(effect) {
    return (
      (effect.value >= 0 ? '+' : '') +
      fmt(effect.value * 100, 1) +
      '% ' +
      (effect.stat.startsWith('element:') ? effect.stat.slice(8) : effect.stat)
    );
  }
  function modRankDescription(m, rank) {
    const exact = m.rankDescriptions?.[rank];
    if (exact) return { text: exact, exact: true };
    if (m.riven)
      return { text: arr(m.effects).map(rivenEffectText).join('\n') || m.name, exact: true };
    return { text: m.description || 'No description available.', exact: rank === m.maxRank };
  }
  function modCardArt(m) {
    const rivenTypes = {
      Rifle: 'Rifle',
      Shotgun: 'Shotgun',
      Pistol: 'Pistol',
      Melee: 'Melee',
      Archgun: 'Archgun',
      Kitgun: 'Kitgun',
      Zaw: 'Zaw',
      'Companion Weapon': 'CompanionWeapon',
    };
    const rivenType = rivenTypes[m.type] || 'Rifle',
      rivenIcon = m.riven ? 'images/mods/icons/wiki/' + rivenType + 'RivenMod.png' : '',
      rivenCard = m.riven ? 'images/mods/mod-' + rivenType + 'RivenMod.png' : '';
    const rivenWeapon = m.riven
      ? get(db, 'weapons', m.weaponId) ||
        records(db, 'weapons').find((w) => w.family === m.family && w.image)
      : null;
    const primary = m.icon || rivenWeapon?.image || rivenIcon || m.image || rivenCard,
      fallback = m.iconFallback || m.image || rivenCard;
    return (
      '<img class="asset-image mod-card-art" src="' +
      escape(assetURL(primary)) +
      '"' +
      (primary && fallback && primary !== fallback
        ? ' data-fallback="' + escape(assetURL(fallback)) + '"'
        : '') +
      ' alt="" loading="lazy">'
    );
  }
  function modRarity(m) {
    if (m.riven || /\bRiven\b/.test(m.name)) return 'riven';
    if (/^Galvanized\b/.test(m.name)) return 'galvanized';
    if (/^Amalgam\b/.test(m.name)) return 'amalgam';
    if (m.rarity === 'Legendary' || /^Primed\b/.test(m.name)) return 'legendary';
    if (m.rarity === 'Rare') return 'gold';
    if (m.rarity === 'Uncommon') return 'silver';
    return 'bronze';
  }
  function modRankStars(m, s) {
    if (!m.maxRank) return '<span class="mod-unranked">Unranked</span>';
    const ranks = Array.from(
      { length: m.maxRank },
      (_, index) =>
        '<span class="mod-rank-pip' +
        (index < s.rank ? ' filled' : '') +
        '" aria-hidden="true"></span>',
    ).join('');
    return (
      '<div class="mod-rank-stars' +
      (s.rank === m.maxRank ? ' maxed' : '') +
      '" aria-label="Rank ' +
      s.rank +
      ' of ' +
      m.maxRank +
      '" title="Rank ' +
      s.rank +
      ' / ' +
      m.maxRank +
      '">' +
      ranks +
      '</div>'
    );
  }
  function modFrameAssets(rarity) {
    const sets = {
      bronze: [
        'BronzeBackground.png',
        'BronzeFrameTop.png',
        'BronzeFrameBottom.png',
        'BronzeSideLight.png',
        'BronzeLowerTab.png',
      ],
      silver: [
        'SilverBackground.png',
        'SilverFrameTop.png',
        'SilverFrameBottom.png',
        'SilverSideLight.png',
        'SilverLowerTab.png',
      ],
      gold: [
        'GoldBackground.png',
        'GoldFrameTop.png',
        'GoldFrameBottom.png',
        'GoldSideLight.png',
        'GoldLowerTab.png',
      ],
      legendary: [
        'LegendaryBackground.png',
        'LegendaryFrameTop.png',
        'LegendaryFrameBottom.png',
        'LegendarySideLight.png',
        'LegendaryLowerTab.png',
      ],
      amalgam: [
        'AmalgamBackground.png',
        'AmalgamFrameTop.png',
        'AmalgamFrameBottom.png',
        'LegendarySideLight.png',
        'LegendaryLowerTab.png',
      ],
      galvanized: [
        'LegendaryBackground.png',
        'GalvanizedFrameTop.png',
        'GalvanizedFrameBottom.png',
        'LegendarySideLight.png',
        'LegendaryLowerTab.png',
      ],
      riven: [
        'SilverBackground.png',
        'OmegaFrameTop.png',
        'OmegaFrameBottom.png',
        'OmegaSideLight.png',
        'RivenLowerTab.png',
      ],
    };
    const [background, top, bottom, side, tab] = sets[rarity] || sets.bronze;
    const backer =
      {
        bronze: 'Bronze',
        silver: 'Silver',
        gold: 'Gold',
        legendary: 'Legendary',
        amalgam: 'Silver',
        galvanized: 'Silver',
        riven: 'Riven',
      }[rarity] || 'Bronze';
    const corner =
      {
        bronze: 'Bronze',
        silver: 'Silver',
        gold: 'Gold',
        legendary: 'Legendary',
        amalgam: 'Silver',
        galvanized: 'Silver',
        riven: 'Riven',
      }[rarity] || 'Bronze';
    return {
      background,
      top,
      bottom,
      side,
      tab,
      corner: corner + 'CornerLights.png',
      backer: backer + 'TopRightBacker.png',
    };
  }
  function arcaneRarity(arcane) {
    return (
      { Common: 'bronze', Uncommon: 'silver', Rare: 'gold', Legendary: 'legendary' }[
        arcane?.rarity
      ] || 'silver'
    );
  }
  function modFaceHTML(m, s, i, kind = 'weapon') {
    const rank = modRankDescription(m, s.rank),
      adjusted =
        kind === 'aura' ? auraCapacityGain(m, s.rank, s.polarity) : modDrain(m, s.rank, s.polarity);
    const match = s.polarity && (s.polarity === m.polarity || s.polarity === 'universal'),
      mismatch = s.polarity && !match;
    const polarity = POLARITIES.includes(m.polarity) ? m.polarity : '';
    const glyph = polarity
      ? '<span class="mod-polarity-icon' +
        (polarity === 'universal' ? ' universal' : '') +
        '" role="img" aria-label="' +
        escape(polarity) +
        ' polarity">' +
        (polarity === 'universal' ? '✦' : POLARITY_SVG[polarity] || '') +
        '</span>'
      : '';
    const tooltip =
      'Mod polarity ' +
      (polarity || 'none') +
      '; slot polarity ' +
      (s.polarity || 'none') +
      '; ' +
      (kind === 'aura' ? 'Warframe capacity gain ' : 'slot cost ') +
      adjusted;
    const rarity = modRarity(m),
      frame = modFrameAssets(rarity),
      typeLabel = /^warframe$/i.test(m.type || '')
        ? 'WARFRAME'
        : String(m.type || 'MOD').toUpperCase();
    const framePath = 'images/mods/frames/',
      frameStyle = Object.entries(frame)
        .map(([part, file]) => '--mod-' + part + ':url("' + assetURL(framePath + file) + '")')
        .join(';');
    const specialIcon =
      kind === 'exilus' || kind === 'aura'
        ? '<span class="mod-top-icon ' + kind + '" aria-hidden="true"></span>'
        : '';
    const effects =
      m.riven && arr(m.effects).length
        ? arr(m.effects)
            .map(
              (effect) =>
                '<span class="riven-effect-line">' +
                (effect.spliced
                  ? '<span class="riven-effect-lock" role="img" aria-label="Locked spliced trait" title="Locked spliced trait">🔒</span>'
                  : '') +
                '<span>' +
                escape(rivenEffectText(effect)) +
                '</span></span>',
            )
            .join('')
        : escape(rank.text);
    return (
      '<div class="mod-face rarity-' +
      rarity +
      '" style="' +
      escape(frameStyle) +
      '"><div class="mod-frame-content"><div class="mod-card-image">' +
      modCardArt(m) +
      '</div><div class="mod-face-description"><div class="mod-face-name">' +
      escape(m.name) +
      '</div><div class="mod-face-effect" title="' +
      escape(rank.text) +
      '">' +
      effects +
      '</div></div></div><div class="mod-frame-borders" aria-hidden="true"></div><div class="mod-corner-lights" aria-hidden="true"><span class="mod-corner-light left"></span><span class="mod-corner-light right"></span></div>' +
      specialIcon +
      '<span class="mod-face-drain ' +
      (match ? 'polarity-match' : mismatch ? 'polarity-mismatch' : 'polarity-neutral') +
      '" title="' +
      escape(tooltip) +
      '"><b>' +
      (kind === 'aura' ? '+' : '') +
      adjusted +
      '</b>' +
      glyph +
      '</span><div class="mod-face-type"><span>' +
      escape(typeLabel) +
      '</span></div>' +
      modRankStars(m, s) +
      '</div>'
    );
  }
  function slotHTML(s, i, w, choices, kind = 'weapon') {
    const exilus = kind === 'exilus',
      aura = kind === 'aura',
      m = aura ? get(db, 'mods', s.id) : slotMod(db, s, w),
      label = aura ? 'Aura mod' : exilus ? 'Exilus mod' : 'Mod slot ' + (i + 1);
    const card =
      '<div class="mod-card' +
      (m ? '' : ' mod-card-empty') +
      '" data-slot-kind="' +
      kind +
      '" data-open-mod-picker="' +
      i +
      '" data-mod-equipped="' +
      (m ? 'true' : 'false') +
      '" role="button" tabindex="0" aria-label="' +
      (m
        ? 'Change ' + escape(m.name) + ' in ' + escape(label)
        : 'Choose a mod for ' + escape(label)) +
      '">' +
      (m ? modFaceHTML(m, s, i, kind) : '<span>Choose a mod</span>') +
      '</div>';
    const aptitude = m?.name === 'Galvanized Aptitude',
      conditions =
        m && (m.effects?.some((e) => e.conditional) || aptitude)
          ? '<details class="mod-conditions"><summary>' +
            (aptitude ? 'Galvanized Aptitude kill stacks' : 'Conditional bonus') +
            ' · ' +
            s.stacks +
            ' / ' +
            modStackCap(m) +
            (aptitude ? ' kills' : ' stack' + (s.stacks === 1 ? '' : 's')) +
            ' at ' +
            s.uptime +
            '% uptime</summary><div class="slotopts"><label>Active stacks<input data-mod-stacks="' +
            i +
            '" type="number" min="0" max="' +
            modStackCap(m) +
            '" value="' +
            clamp(s.stacks, 0, modStackCap(m)) +
            '"></label><label>Uptime %<input data-mod-uptime="' +
            i +
            '" type="number" min="0" max="100" value="' +
            s.uptime +
            '"></label></div></details>'
          : '';
    const innate = aura ? '' : exilus ? w.exilusPolarity || '' : w.polarities[i] || '',
      forma =
        !aura && s.polarity !== innate
          ? '<span class="mod-slot-forma">' +
            (s.polarity === 'umbra' ? '1 Umbra Forma' : '1 Forma') +
            ' required for this polarity</span>'
          : '';
    const backer = m ? assetURL('images/mods/frames/' + modFrameAssets(modRarity(m)).backer) : '';
    const rankControls =
      m && m.maxRank
        ? '<div class="rank-control-row mod-rank-control-row" style="--rank-backer:url(' +
          backer +
          ')"><button type="button" class="backer-rank-step" data-mod-rank-step="-1" data-mod-slot="' +
          i +
          '" aria-label="Decrease ' +
          escape(m.name) +
          ' rank" title="Decrease rank"' +
          (s.rank <= 0 ? ' disabled' : '') +
          '><span aria-hidden="true">−</span></button><span class="rank-level"><small>RANK</small><b>' +
          s.rank +
          ' / ' +
          m.maxRank +
          '</b></span><button type="button" class="backer-rank-step rank-step-increase" data-mod-rank-step="1" data-mod-slot="' +
          i +
          '" aria-label="Increase ' +
          escape(m.name) +
          ' rank" title="Increase rank"' +
          (s.rank >= m.maxRank ? ' disabled' : '') +
          '><span aria-hidden="true">+</span></button></div>'
        : '';
    const polarityName = (p) => (p ? p[0].toUpperCase() + p.slice(1) : 'None'),
      polarityIcon = (p) =>
        '<span class="polarity-choice-icon" aria-hidden="true">' +
        (p === 'universal' ? '✦' : POLARITY_SVG[p] || '') +
        '</span>';
    const polarityControl =
      '<div class="mod-slot-polarity"><span class="polarity-field-label">Polarity</span><div class="polarity-picker" data-polarity-picker="' +
      i +
      '"><button type="button" class="polarity-trigger" data-polarity-trigger="' +
      i +
      '" aria-label="Polarity for ' +
      escape(label) +
      ': ' +
      polarityName(s.polarity) +
      '" aria-haspopup="listbox" aria-expanded="false" aria-controls="polarity-options-' +
      i +
      '">' +
      polarityIcon(s.polarity) +
      '<span>' +
      polarityName(s.polarity) +
      '</span><span class="polarity-chevron" aria-hidden="true">▾</span></button><div id="polarity-options-' +
      i +
      '" class="polarity-menu" role="listbox" aria-label="Polarity for ' +
      escape(label) +
      '" hidden>' +
      POLARITIES.map(
        (p) =>
          '<button type="button" role="option" aria-selected="' +
          (p === s.polarity) +
          '" class="polarity-option' +
          (p === s.polarity ? ' selected' : '') +
          '" data-polarity-value="' +
          p +
          '">' +
          polarityIcon(p) +
          '<span>' +
          polarityName(p) +
          '</span></button>',
      ).join('') +
      '</div></div></div>';
    const wikiURL = m
      ? m.riven
        ? 'https://wiki.warframe.com/w/Riven_Mods'
        : safeURL(m.wiki || 'https://wiki.warframe.com/w/Mod/List_of_Mods')
      : '';
    const wikiLink = wikiURL
      ? '<a class="mod-slot-wiki" href="' +
        escape(wikiURL) +
        '" target="_blank" rel="noopener">' +
        escape(m.riven ? 'Riven Mods' : m.wiki ? 'View ' + m.name + ' on Wiki' : 'Mod list') +
        ' ↗</a>'
      : '';
    return (
      '<div class="modslot' +
      (m ? ' equipped' : '') +
      '" data-slot-index="' +
      i +
      '"' +
      (exilus ? ' data-exilus-slot="true"' : '') +
      (aura ? ' data-aura-slot="true"' : '') +
      '><div class="slothead"><span>' +
      (aura ? 'AURA' : exilus ? 'EXILUS' : 'SLOT ' + (i + 1)) +
      '</span><span>' +
      (m ? (s.rank ? 'RANK ' + s.rank + '/' + m.maxRank : 'UNRANKED') : 'EMPTY') +
      '</span></div>' +
      polarityControl +
      card +
      rankControls +
      '<div class="mod-slot-cost">' +
      (m
        ? aura
          ? '+' + auraCapacityGain(m, s.rank, s.polarity) + ' Warframe capacity'
          : modDrain(m, s.rank, s.polarity) + ' capacity'
        : 'No cost') +
      '</div>' +
      forma +
      conditions +
      wikiLink +
      '</div>'
    );
  }
  function configureBuildPanels() {
    const modsPanel = $('mod-slots')?.closest('.panel'),
      warframePanel = $('warframe-arcane-slots')?.closest('.panel'),
      weaponArcanes = $('weapon-arcane-slots');
    const heading = (title, url) =>
      '<div class="section-heading"><h3>' +
      title +
      '</h3><a href="' +
      url +
      '" target="_blank" rel="noopener">Wiki ↗</a></div>';
    if (modsPanel) {
      const head = modsPanel.querySelector('.panelhead');
      if (head && !head.querySelector('.section-wiki'))
        head.insertAdjacentHTML(
          'beforeend',
          '<a class="section-wiki" href="https://wiki.warframe.com/w/Mod/List_of_Mods" target="_blank" rel="noopener">Mod list ↗</a>',
        );
    }
    if (modsPanel && weaponArcanes) {
      const group = document.createElement('div');
      group.className = 'weapon-arcane-group';
      group.innerHTML = heading('Weapon arcanes', 'https://wiki.warframe.com/w/Arcane');
      group.append(weaponArcanes);
      modsPanel.append(group);
    }
    if (warframePanel) {
      const panelTitle = warframePanel.querySelector('.panelhead h2');
      if (panelTitle) panelTitle.textContent = 'Warframe configuration';
      const warframeArcanes = $('warframe-arcane-slots'),
        shards = $('archon-shard-slots');
      if (!$('aura-slot')) {
        const aura = document.createElement('div');
        aura.className = 'warframe-aura-group';
        aura.innerHTML =
          heading('Aura mod', 'https://wiki.warframe.com/w/Aura') + '<div id="aura-slot"></div>';
        warframePanel.insertBefore(aura, warframeArcanes);
      }
      if (warframeArcanes && !warframeArcanes.closest('.warframe-arcane-group')) {
        const group = document.createElement('div');
        group.className = 'warframe-arcane-group';
        group.innerHTML = heading('Warframe Arcane', 'https://wiki.warframe.com/w/Arcane');
        warframeArcanes.before(group);
        group.append(warframeArcanes);
      }
      if (shards && !shards.closest('.archon-shard-group')) {
        const group = document.createElement('div');
        group.className = 'archon-shard-group';
        group.innerHTML =
          heading('Archon Shards', 'https://wiki.warframe.com/w/Archon_Shard') +
          '<label id="shard-energy-control" class="shard-energy-control" hidden>Maximum Warframe Energy before Archon Shards<input id="shard-max-energy" type="number" min="0" max="5000" step="1" value="0"><small>Violet Melee Critical Damage doubles above 500 Energy; Azure Energy shards are added automatically.</small></label>';
        shards.before(group);
        group.append(shards);
      }
    }
    if ($('arcane-slots')) $('arcane-slots').hidden = true;
  }
  function closePolarityMenus(except) {
    for (const picker of document.querySelectorAll('.polarity-picker.open'))
      if (picker !== except) {
        picker.classList.remove('open');
        picker.closest('.modslot')?.classList.remove('polarity-open');
        picker.querySelector('.polarity-menu').hidden = true;
        picker.querySelector('.polarity-trigger').setAttribute('aria-expanded', 'false');
      }
  }
  function renderMods() {
    let w = chosenWeapon();
    try {
      w = configureWeapon(db, state).w;
    } catch (error) {
      reportOptionalFailure('Weapon configuration could not be applied to mod slots', error);
    }
    if (!w) return;
    $('mod-slots').innerHTML = state.slots.map((s, i) => slotHTML(s, i, w, [])).join('');
    $('special-slots').innerHTML = hasExilus(w) ? slotHTML(state.exilus, 8, w, [], 'exilus') : '';
    if ($('aura-slot')) $('aura-slot').innerHTML = slotHTML(state.aura, 9, w, [], 'aura');
    let special = '';
    if (isMelee(w)) {
      const stances = records(db, 'stances').filter((s) => s.type === w.type);
      const st = get(db, 'stances', state.stance.id);
      special =
        '<h3>Stance</h3><div class="fieldgrid"><label>Stance<select id="stance-select">' +
        options(stances, state.stance.id, 'None') +
        '</select></label><label>Stance polarity<select id="stance-polarity">' +
        options(
          POLARITIES.map((p) => ({ id: p, name: p || 'None' })),
          state.stance.polarity,
        ) +
        '</select></label><label>Stance rank<select id="stance-rank">' +
        options(
          [0, 1, 2, 3].map((r) => ({ id: String(r), name: String(r) })),
          String(state.stance.rank),
        ) +
        '</select></label><label>Combo<select id="stance-combo">' +
        options(st?.combos || [], state.comboId) +
        '</select></label></div>';
    }
    $('special-controls').innerHTML = special;
    for (const el of document.querySelectorAll('[data-open-mod-picker]')) {
      const slotContainer = el.closest('.modslot');
      el.onclick = () => openModPicker(+el.dataset.openModPicker);
      el.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModPicker(+el.dataset.openModPicker);
        }
      };
      el.onmouseenter = () => slotContainer?.classList.add('modslot-card-hover');
      el.onmouseleave = () => slotContainer?.classList.remove('modslot-card-hover');
      el.onfocus = () => slotContainer?.classList.add('modslot-card-hover');
      el.onblur = () => slotContainer?.classList.remove('modslot-card-hover');
      el.oncontextmenu = (e) => {
        if (el.dataset.modEquipped !== 'true') return;
        e.preventDefault();
        const i = +el.dataset.openModPicker,
          s = modSlotState(i);
        s.id = '';
        s.rank = 0;
        s.stacks = 0;
        s.uptime = 100;
        renderMods();
        schedule();
      };
    }
    for (const picker of document.querySelectorAll('[data-polarity-picker]')) {
      const i = +picker.dataset.polarityPicker,
        trigger = picker.querySelector('.polarity-trigger'),
        menu = picker.querySelector('.polarity-menu'),
        choices = [...picker.querySelectorAll('[data-polarity-value]')];
      const setOpen = (open) => {
        closePolarityMenus(open ? picker : null);
        picker.classList.toggle('open', open);
        picker.closest('.modslot')?.classList.toggle('polarity-open', open);
        menu.hidden = !open;
        trigger.setAttribute('aria-expanded', String(open));
      };
      trigger.onclick = () => setOpen(!picker.classList.contains('open'));
      picker.onfocusout = (e) => {
        if (!picker.contains(e.relatedTarget)) setOpen(false);
      };
      trigger.onkeydown = (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          setOpen(true);
          const selected = choices.findIndex(
            (choice) => choice.getAttribute('aria-selected') === 'true',
          );
          choices[
            e.key === 'ArrowUp' ? Math.max(0, selected) : Math.min(choices.length - 1, selected + 1)
          ]?.focus();
        } else if (e.key === 'Escape') {
          setOpen(false);
        }
      };
      for (const [index, choice] of choices.entries()) {
        choice.onclick = () => {
          modSlotState(i).polarity = choice.dataset.polarityValue;
          closePolarityMenus();
          renderMods();
          document.querySelector('[data-polarity-trigger="' + i + '"]').focus();
          schedule();
        };
        choice.onkeydown = (e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            setOpen(false);
            trigger.focus();
          } else if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) {
            e.preventDefault();
            const next =
              e.key === 'Home'
                ? 0
                : e.key === 'End'
                  ? choices.length - 1
                  : e.key === 'ArrowDown'
                    ? (index + 1) % choices.length
                    : (index - 1 + choices.length) % choices.length;
            choices[next].focus();
          }
        };
      }
    }
    for (const field of ['stacks', 'uptime'])
      for (const el of document.querySelectorAll('[data-mod-' + field + ']'))
        el.onchange = () => {
          const i = +el.dataset['mod' + field[0].toUpperCase() + field.slice(1)],
            s = modSlotState(i),
            m = slotMod(db, s, w);
          s[field] = Math.round(clamp(el.value, 0, field === 'uptime' ? 100 : modStackCap(m)));
          el.value = s[field];
          const summary = el.closest('.mod-conditions')?.querySelector('summary');
          if (summary)
            summary.textContent =
              (m?.name === 'Galvanized Aptitude'
                ? 'Galvanized Aptitude kill stacks'
                : 'Conditional bonus') +
              ' · ' +
              s.stacks +
              (m?.name === 'Galvanized Aptitude'
                ? ' / ' + modStackCap(m) + ' kills'
                : ' stack' + (s.stacks === 1 ? '' : 's')) +
              ' at ' +
              s.uptime +
              '% uptime';
          schedule();
        };
    for (const el of document.querySelectorAll('[data-mod-rank-step]'))
      el.onclick = () => {
        const i = +el.dataset.modSlot,
          s = modSlotState(i),
          m = slotMod(db, s, w);
        if (!m) return;
        s.rank = clamp(s.rank + +el.dataset.modRankStep, 0, m.maxRank);
        renderMods();
        const targetStep =
          el.dataset.modRankStep === '1' && s.rank >= m.maxRank
            ? '-1'
            : el.dataset.modRankStep === '-1' && s.rank <= 0
              ? '1'
              : el.dataset.modRankStep;
        document
          .querySelector('[data-mod-slot="' + i + '"][data-mod-rank-step="' + targetStep + '"]')
          ?.focus();
        schedule();
      };
    if ($('stance-select')) {
      $('stance-select').onchange = () => {
        state.stance.id = $('stance-select').value;
        state.comboId = 'neutral';
        renderMods();
        schedule();
      };
      $('stance-polarity').onchange = () => {
        state.stance.polarity = $('stance-polarity').value;
        schedule();
      };
      $('stance-rank').onchange = () => {
        state.stance.rank = +$('stance-rank').value;
        schedule();
      };
      $('stance-combo').onchange = () => {
        state.comboId = $('stance-combo').value;
        schedule();
      };
    }
  }
  const SHARD_COLOR_ORDER = ['Crimson', 'Amber', 'Azure', 'Emerald', 'Topaz', 'Violet'];
  function shardImagePath(shard, tauforged = false) {
    return assetURL(
      shard
        ? 'images/archon-shards/' +
            slug(shard.color) +
            '-' +
            (tauforged ? 'tauforged' : 'normal') +
            '.png'
        : 'images/archon-shards/plain-shard.png',
    );
  }
  function shardTraitName(shard) {
    return shard.name.split(' · ').at(-1) || shard.name;
  }
  function shardSelectedEffect(shard, tauforged) {
    const exact = shard.displayEffects?.[tauforged ? 'tauforged' : 'normal'];
    if (exact) return exact;
    const parts = String(shard.description || '').split(/;\s*Tauforged\s*/i),
      normal = parts[0];
    if (!tauforged || parts.length < 2) return normal;
    const values =
      parts
        .slice(1)
        .join('; Tauforged ')
        .match(/[+-]?\d[\d,]*(?:\.\d+)?%?/g) || [];
    let i = 0;
    return normal.replace(/[+-]?\d[\d,]*(?:\.\d+)?%?/g, (value) => values[i++] || value);
  }
  function shardPerformanceHTML(database, build, weapon) {
    const energy = shardMaximumEnergy(database, build),
      violetActive = arr(build.shards).some(
        (slot) => slot.id === 'archon-violet-melee-critical-damage',
      ),
      rows = arr(build.shards)
        .map((slot, index) => {
          const shard = get(database, 'archon-shards', slot.id);
          if (!shard) return '';
          const eligible =
              !shard.weaponCategories?.length || shard.weaponCategories.includes(weapon.category),
            modeled = eligible && arr(shard.effects).length > 0,
            conditional = modeled && shard.effects.some((effect) => effect.conditional);
          let detail = !eligible
            ? 'Not applicable to ' + weapon.category + ' weapons'
            : !modeled
              ? 'Tracked in build; no direct weapon calculation'
              : conditional
                ? 'Active stacks ' +
                  slot.stacks +
                  ' / ' +
                  (slot.tauforged ? shard.tauMaxStacks : shard.maxStacks)
                : 'Applied to weapon calculations';
          if (shard.id === 'archon-violet-melee-critical-damage' && modeled) {
            const value =
              (slot.tauforged ? shard.effects[0].tauValue : shard.effects[0].value) *
              (energy > 500 ? 2 : 1);
            detail =
              'Effective max Energy ' +
              energy +
              ' · applied critical damage +' +
              fmt(value * 100, 1) +
              '%';
          } else if (
            shard.maximumEnergyBonus != null &&
            violetActive &&
            weapon.category === 'Melee'
          )
            detail = 'Counts toward Violet threshold · effective max Energy ' + energy;
          return (
            '<li><b>Shard ' +
            (index + 1) +
            ' · ' +
            escape(shardTraitName(shard)) +
            ':</b> ' +
            escape(shardSelectedEffect(shard, slot.tauforged)) +
            ' <small>(' +
            escape(detail) +
            ')</small></li>'
          );
        })
        .filter(Boolean);
    return rows.length
      ? '<div class="shard-performance"><h3>Archon Shard effects</h3><ul>' +
          rows.join('') +
          '</ul></div>'
      : '';
  }
  function openLoadoutChoicePicker(kind, slot) {
    loadoutPicker = { kind, slot };
    $('loadout-choice-search').value = '';
    $('loadout-choice-title').textContent =
      kind === 'arcane'
        ? slot < 2
          ? 'Choose a weapon arcane'
          : 'Choose a Warframe arcane'
        : 'Choose an Archon Shard';
    $('loadout-choice-hint').textContent =
      kind === 'arcane'
        ? 'Select an arcane for this slot. Rank, stack and uptime settings are kept with the slot.'
        : 'Select the shard trait for slot ' +
          (slot + 1) +
          '. Tauforged can be toggled on the equipped shard.';
    renderLoadoutChoicePicker();
    $('loadout-choice-picker').showModal();
    $('loadout-choice-search').focus();
  }
  function renderLoadoutChoicePicker() {
    const { kind, slot } = loadoutPicker;
    if (slot < 0) return;
    const w = chosenWeapon(),
      arcane = kind === 'arcane',
      current = arcane ? state.arcanes[slot]?.id : state.shards[slot]?.id,
      query = $('loadout-choice-search').value.trim().toLowerCase();
    let choices = arcane
      ? records(db, 'arcanes').filter((a) => arcaneCompatible(a, w, slot))
      : records(db, 'archon-shards');
    choices = choices.filter((record) =>
      (record.name + ' ' + (record.description || '')).toLowerCase().includes(query),
    );
    $('loadout-choice-list').classList.toggle('arcane-picker-grid', arcane);
    $('loadout-choice-list').classList.toggle('shard-picker-rows', !arcane);
    const choiceHTML = (record) => {
      const selected = record.id === current;
      if (arcane)
        return (
          '<button type="button" class="arcane-picker-tile' +
          (selected ? ' selected' : '') +
          '" data-pick-loadout-choice="' +
          escape(record.id) +
          '" title="' +
          escape(record.description || record.name) +
          '" aria-label="' +
          escape((selected ? 'Selected: ' : 'Select ') + record.name) +
          '"><img class="asset-image" src="' +
          escape(assetURL(record.image)) +
          '" alt="" loading="lazy"><strong>' +
          escape(record.name) +
          '</strong><small>' +
          escape(record.type || 'Arcane') +
          '</small>' +
          (selected ? '<span class="arcane-picker-selected">Equipped</span>' : '') +
          '</button>'
        );
      return (
        '<button type="button" class="shard-picker-tile' +
        (selected ? ' selected' : '') +
        '" data-pick-loadout-choice="' +
        escape(record.id) +
        '" title="' +
        escape(record.description || record.name) +
        '" aria-label="' +
        escape((selected ? 'Selected: ' : 'Select ') + record.name) +
        '"><img class="asset-image" src="' +
        escape(shardImagePath(record)) +
        '" alt="" loading="lazy"><span>' +
        escape(shardTraitName(record)) +
        '</span>' +
        (selected ? '<small>Equipped</small>' : '') +
        '</button>'
      );
    };
    $('loadout-choice-list').innerHTML = arcane
      ? choices.map(choiceHTML).join('') || '<p class="empty">No matching choices.</p>'
      : SHARD_COLOR_ORDER.map((color) => {
          const group = choices.filter((record) => record.color === color);
          return group.length
            ? '<section class="shard-picker-row" aria-label="' +
                escape(color) +
                ' Archon Shards"><h3>' +
                escape(color) +
                ' Archon Shards</h3><div class="shard-picker-options">' +
                group.map(choiceHTML).join('') +
                '</div></section>'
            : '';
        }).join('') || '<p class="empty">No matching choices.</p>';
    for (const button of $('loadout-choice-list').querySelectorAll('[data-pick-loadout-choice]'))
      button.onclick = () => {
        const id = button.dataset.pickLoadoutChoice;
        if (arcane) {
          const entry = state.arcanes[slot];
          entry.id = id;
          entry.rank = get(db, 'arcanes', id)?.maxRank || 0;
          entry.stacks = 0;
        } else {
          const entry = state.shards[slot];
          entry.id = id;
          entry.tauforged = false;
          entry.stacks = 0;
        }
        closeLoadoutChoicePicker();
        renderArcanes();
        renderArchonShards();
        schedule();
      };
  }
  function closeLoadoutChoicePicker() {
    if ($('loadout-choice-picker').open) $('loadout-choice-picker').close();
    loadoutPicker = { kind: '', slot: -1 };
  }
  function clearLoadoutChoice() {
    const { kind, slot } = loadoutPicker;
    if (slot < 0) return;
    if (kind === 'arcane') {
      const entry = state.arcanes[slot];
      entry.id = '';
      entry.rank = 0;
      entry.stacks = 0;
      entry.uptime = 100;
    } else state.shards[slot] = { id: '', tauforged: false, stacks: 0 };
    closeLoadoutChoicePicker();
    renderArcanes();
    renderArchonShards();
    schedule();
  }
  function renderArcanes() {
    const w = chosenWeapon(),
      renderSlot = (s, i) => {
        const a = get(db, 'arcanes', s.id),
          stackCap = arcaneStackCap(a),
          maxRank = a?.maxRank ?? 5,
          rank = clamp(s.rank, 0, maxRank);
        const slotClass =
          i === 0 ? 'weapon-arcane-one' : i === 1 ? 'weapon-arcane-two' : 'warframe-arcane';
        const name =
          i < 2
            ? /archgun/i.test(w.category)
              ? i === 0
                ? 'Primary arcane'
                : 'Secondary arcane'
              : 'Weapon arcane ' + (i + 1)
            : 'Warframe arcane ' + (i - 1);
        const art = a
          ? recordImage(a, 'arcane')
          : '<span class="arcane-choice-empty" aria-hidden="true"></span>';
        const backer = assetURL('images/mods/frames/' + modFrameAssets(arcaneRarity(a)).backer);
        const choice =
          '<button type="button" class="arcane-choice-card" data-open-loadout-choice="arcane" data-picker-slot="' +
          i +
          '" aria-label="' +
          escape((a ? 'Change ' + a.name + ' in ' : 'Choose ') + name) +
          '"><span class="arcane-choice-art">' +
          art +
          '</span>' +
          (a ? '<strong class="arcane-choice-name">' + escape(a.name) + '</strong>' : '') +
          '<span class="arcane-choice-label">' +
          escape(name) +
          '</span></button>';
        const rankControls = a
          ? '<div class="arcane-settings"><div class="rank-control-row arcane-rank-control" style="--rank-backer:url(' +
            backer +
            ')"><button type="button" class="arcane-rank-step backer-rank-step" data-arcane-rank-step="-1" data-arcane-slot="' +
            i +
            '" aria-label="Decrease rank" ' +
            (rank <= 0 ? 'disabled' : '') +
            '><span aria-hidden="true">−</span></button><span class="rank-level"><small>RANK</small><b>' +
            rank +
            ' / ' +
            maxRank +
            '</b></span><button type="button" class="arcane-rank-step backer-rank-step rank-step-increase" data-arcane-rank-step="1" data-arcane-slot="' +
            i +
            '" aria-label="Increase rank" ' +
            (rank >= maxRank ? 'disabled' : '') +
            '><span aria-hidden="true">+</span></button></div><label>Active stacks<input data-arcane-stacks="' +
            i +
            '" type="number" min="0" max="' +
            stackCap +
            '" step="1" value="' +
            clamp(s.stacks, 0, stackCap) +
            '"></label><label>Uptime %<input data-arcane-uptime="' +
            i +
            '" type="number" min="0" max="100" value="' +
            s.uptime +
            '"></label></div>'
          : '';
        return (
          '<div class="arcane ' +
          slotClass +
          '" data-arcane-slot="' +
          i +
          '">' +
          choice +
          (a
            ? '<div class="arcane-description-tooltip" role="tooltip">' +
              escape(a.description) +
              '</div>'
            : '') +
          rankControls +
          '</div>'
        );
      };
    $('weapon-arcane-slots').innerHTML = state.arcanes
      .slice(0, 2)
      .map((s, i) => (i === 1 && !twoWeaponArcanes(w) ? '' : renderSlot(s, i)))
      .join('');
    $('warframe-arcane-slots').innerHTML = state.arcanes
      .slice(2, 4)
      .map((s, n) => renderSlot(s, n + 2))
      .join('');
    for (const el of document.querySelectorAll('[data-open-loadout-choice="arcane"]'))
      el.onclick = () => openLoadoutChoicePicker('arcane', +el.dataset.pickerSlot);
    for (const el of document.querySelectorAll('[data-arcane-rank-step]'))
      el.onclick = () => {
        const i = +el.dataset.arcaneSlot,
          s = state.arcanes[i],
          a = get(db, 'arcanes', s.id);
        if (!a) return;
        s.rank = clamp(s.rank + +el.dataset.arcaneRankStep, 0, a.maxRank ?? 5);
        renderArcanes();
        document
          .querySelector(
            '[data-arcane-slot="' +
              i +
              '"][data-arcane-rank-step="' +
              el.dataset.arcaneRankStep +
              '"]',
          )
          ?.focus();
        schedule();
      };
    for (const f of ['stacks', 'uptime'])
      for (const el of document.querySelectorAll('[data-arcane-' + f + ']'))
        el.onchange = () => {
          const i = +el.dataset['arcane' + f[0].toUpperCase() + f.slice(1)],
            s = state.arcanes[i],
            a = get(db, 'arcanes', s.id);
          s[f] = Math.round(clamp(+el.value, 0, f === 'uptime' ? 100 : arcaneStackCap(a)));
          el.value = s[f];
          schedule();
        };
    for (const slot of document.querySelectorAll('.arcane[data-arcane-slot]'))
      slot.oncontextmenu = (e) => {
        e.preventDefault();
        const i = +slot.dataset.arcaneSlot;
        if (!state.arcanes[i]?.id) return;
        state.arcanes[i] = { id: '', rank: 0, stacks: 0, uptime: 100 };
        renderArcanes();
        schedule();
      };
  }
  function renderArchonShards() {
    const host = $('archon-shard-slots');
    if (!host) return;
    state.shards ||= defaultState(db).shards;
    const energyControl = $('shard-energy-control');
    if (energyControl)
      energyControl.hidden =
        chosenWeapon()?.category !== 'Melee' ||
        !state.shards.some((slot) => slot.id === 'archon-violet-melee-critical-damage');
    host.innerHTML = state.shards
      .map((slot, i) => {
        const shard = get(db, 'archon-shards', slot.id),
          max = shard
            ? slot.tauforged
              ? (shard.tauMaxStacks ?? shard.maxStacks)
              : shard.maxStacks || 1
            : 1,
          applies =
            shard &&
            shard.weaponCategories?.length &&
            !shard.weaponCategories.includes(chosenWeapon()?.category);
        const artwork =
          '<span class="archon-shard-art"><img class="asset-image archon-shard-image" src="' +
          escape(shardImagePath(shard)) +
          '" alt="" loading="lazy">' +
          (shard && slot.tauforged
            ? '<img class="asset-image archon-shard-overlay" src="' +
              escape(shardImagePath(shard, true)) +
              '" alt="" loading="lazy">'
            : '') +
          (!shard ? '<span class="archon-shard-prompt">Choose Shard</span>' : '') +
          '</span>';
        return (
          '<div class="archon-shard-slot arc-shard-' +
          (i + 1) +
          '"><strong class="shard-slot-title">Shard ' +
          (i + 1) +
          '</strong>' +
          (shard
            ? '<label class="check tauforged-toggle"><input data-shard-tau="' +
              i +
              '" type="checkbox" ' +
              (slot.tauforged ? 'checked' : '') +
              '>Tauforged</label>'
            : '') +
          '<button type="button" class="archon-shard-choice" data-open-loadout-choice="shard" data-picker-slot="' +
          i +
          '" aria-label="' +
          escape((shard ? 'Change ' + shard.name : 'Choose shard') + ' for slot ' + (i + 1)) +
          '">' +
          artwork +
          '<span class="archon-shard-name">' +
          escape(shard ? shard.color + ' · ' + shardTraitName(shard) : 'No Shard Selected') +
          '</span></button>' +
          (shard
            ? '<p class="archon-shard-effect">' +
              escape(shardSelectedEffect(shard, slot.tauforged)) +
              '</p>'
            : '') +
          (applies
            ? '<p class="archon-shard-limitation">Does not apply to ' +
              escape(chosenWeapon()?.category) +
              ' weapons.</p>'
            : '') +
          (shard?.maxStacks > 1
            ? '<label class="shard-stack-control">Active stacks (max ' +
              max +
              ')<input data-shard-stacks="' +
              i +
              '" type="number" min="0" max="' +
              max +
              '" value="' +
              clamp(slot.stacks, 0, max) +
              '"></label>'
            : '') +
          '</div>'
        );
      })
      .join('');
    for (const el of host.querySelectorAll('[data-open-loadout-choice="shard"]'))
      el.onclick = () => openLoadoutChoicePicker('shard', +el.dataset.pickerSlot);
    for (const choice of host.querySelectorAll('.archon-shard-choice'))
      choice.oncontextmenu = (e) => {
        e.preventDefault();
        const i = +choice.dataset.pickerSlot;
        if (!state.shards[i]?.id) return;
        state.shards[i] = { id: '', tauforged: false, stacks: 0 };
        renderArchonShards();
        schedule();
      };
    for (const el of host.querySelectorAll('[data-shard-tau]'))
      el.onchange = () => {
        const slot = state.shards[+el.dataset.shardTau],
          shard = get(db, 'archon-shards', slot.id);
        slot.tauforged = el.checked;
        slot.stacks = clamp(
          slot.stacks,
          0,
          slot.tauforged ? (shard?.tauMaxStacks ?? shard?.maxStacks ?? 1) : shard?.maxStacks || 1,
        );
        renderArchonShards();
        schedule();
      };
    for (const el of host.querySelectorAll('[data-shard-stacks]'))
      el.onchange = () => {
        const slot = state.shards[+el.dataset.shardStacks],
          shard = get(db, 'archon-shards', slot.id);
        slot.stacks = Math.round(
          clamp(
            el.value,
            0,
            slot.tauforged ? (shard?.tauMaxStacks ?? shard?.maxStacks ?? 1) : shard?.maxStacks || 1,
          ),
        );
        el.value = slot.stacks;
        schedule();
      };
  }
  const inputMap = {
    'weapon-rank': ['rank', 0, 40],
    'mastery-rank': ['mastery', 0, 40],
    'forma-count': ['forma', 0, 100],
    'umbra-forma-count': ['umbraForma', 0, 100],
    'progenitor-value': ['progenitorValue', 0, 60],
    'ability-strength': ['abilityStrength', 0, 2000],
    'ability-multiplier': ['abilityMultiplier', 0, 100],
    'shard-max-energy': ['maximumEnergy', 0, 5000],
    distance: ['scenario.distance', 0, 1000],
    'armor-strip': ['scenario.strip', 0, 100],
    'corrosive-cap': ['scenario.corrosiveCap', 10, 14],
    combo: ['scenario.combo', 1, 12],
    'status-types': ['scenario.statusTypes', 0, 16],
    'combo-duration': ['scenario.comboDuration', 0, 60],
  };
  function setPath(object, path, value) {
    const keys = path.split('.');
    let ref = object;
    for (const k of keys.slice(0, -1)) ref = ref[k];
    ref[keys.at(-1)] = value;
  }
  function getPath(object, path) {
    return path.split('.').reduce((o, k) => o?.[k], object);
  }
  function syncInputs() {
    for (const [id, [path]] of Object.entries(inputMap)) $(id).value = getPath(state, path);
    $('enemy-level').value = state.scenario.level;
    $('enemy-level-number').value = state.scenario.level;
    $('steel-path').checked = state.scenario.steelPath;
    $('eximus').checked = state.scenario.eximus;
    for (const [id, field] of [
      ['catalyst', 'catalyst'],
      ['adapter', 'adapter'],
      ['gilded', 'gilded'],
    ])
      $(id).checked = state[field];
    $('progenitor-element').value = state.progenitor;
    for (const el of document.querySelectorAll('[data-status]'))
      el.value = state.scenario.stacks[el.dataset.status];
  }
  function metric(label, value, detail, featured = false) {
    return (
      '<div class="metric' +
      (featured ? ' featured' : '') +
      '"><small>' +
      label +
      '</small><strong>' +
      fmt(value) +
      '</strong><span>' +
      detail +
      '</span></div>'
    );
  }
  function performanceProfileHTML(profile) {
    const a = profile.unmodded || profile.a || {},
      w = profile.w || {},
      baseMag = a.magazine ?? w.magazine,
      baseAmmo = Math.max(0, a.ammoCost || 1),
      baseShots = baseMag == null || baseAmmo <= 1e-9 ? null : Math.floor(baseMag / baseAmmo),
      baseRate = Math.max(0, a.fireRate || 0),
      pairs = [
        ['Critical chance', pct(a.critChance || 0), pct(profile.cc)],
        ['Critical multiplier', fmt(a.critMultiplier || 1, 2) + '×', fmt(profile.cd, 2) + '×'],
        ['Status chance', pct(a.statusChance || 0), pct(profile.sc)],
        ['Attacks / second', fmt(baseRate, 2), fmt(profile.rate, 2)],
        [
          'Magazine',
          baseMag == null ? 'N/A' : fmt(baseMag, 0),
          profile.mag == null ? 'N/A' : fmt(profile.mag, 0),
        ],
        [
          'Shots before reload',
          baseShots == null ? 'N/A' : fmt(baseShots, 0),
          profile.shots == null
            ? profile.mag == null
              ? 'N/A'
              : profile.ammoEfficiency >= 1
                ? '∞'
                : '—'
            : fmt(profile.shots, 0),
        ],
        ['Ammo efficiency', pct(0), pct(profile.ammoEfficiency)],
        [
          'Reload time',
          w.reload == null ? 'N/A' : fmt(w.reload, 2) + ' s',
          profile.reload == null ? 'N/A' : fmt(profile.reload, 2) + ' s',
        ],
      ];
    return (
      '<section class="performance-profile"><h3>' +
      escape(attackProfileGroup(profile.a)) +
      ' · ' +
      escape(profile.a?.name || 'Attack') +
      '</h3><div class="mini-stats">' +
      pairs
        .map(
          ([name, base, modded]) =>
            '<div><span class="perf-label">' +
            escape(name) +
            '</span><strong class="perf-modded">' +
            modded +
            '</strong> <small class="base-stat">(' +
            base +
            ')</small></div>',
        )
        .join('') +
      '</div><div class="critrow">' +
      arr(profile.crit)
        .map(
          (c) =>
            '<span class="critpill">Modded tier ' +
            c.tier +
            ' · ' +
            pct(c.probability) +
            ' · ' +
            fmt(c.multiplier, 2) +
            '×</span>',
        )
        .join('') +
      '</div></section>'
    );
  }
  function statusDamageBreakdown(profile) {
    const parts = arr(profile.damageParts);
    if (!parts.length) return '';
    const total = parts.reduce((n, part) => n + sum(part.damage || {}), 0),
      rows = parts
        .map((part) => {
          const radial = part.shotType === 'AoE',
            elements =
              Object.entries(part.damage || {})
                .filter(([, value]) => value > 0)
                .map(([type, value]) => escape(type) + ' ' + fmt(value, 1))
                .join(' · ') || 'no damage';
          return (
            '<tr><th><span class="status-part-label ' +
            (radial ? 'radial' : 'projectile') +
            '">' +
            (radial ? 'RADIAL · BODY HIT' : 'PROJECTILE') +
            '</span><small>' +
            escape(part.name || 'Attack component') +
            '</small></th><td class="numeric"><b>' +
            fmt(sum(part.damage || {}), 1) +
            '</b><small>' +
            elements +
            '</small></td></tr>'
          );
        })
        .join('');
    return (
      '<div class="tablewrap status-damage-breakdown"><table><thead><tr><th>Projectile damage</th><th class="numeric">Damage / shot</th></tr></thead><tbody><tr class="status-damage-total"><th>Total combined damage</th><td class="numeric">' +
      fmt(total, 1) +
      '</td></tr><tr class="status-breakdown-row"><td colspan="2"><details><summary>Show damage breakdown</summary><div class="tablewrap"><table><tbody>' +
      rows +
      '</tbody></table></div></details></td></tr></tbody></table></div>'
    );
  }
  function orderStatusProfiles(profiles) {
    const rank = (profile) => {
      const a = profile.a || {},
        name = (a.name || '').toLowerCase(),
        trigger = (a.trigger || '').toLowerCase(),
        text = name + ' ' + trigger;
      if (/alt[ -]?fire|alternate fire/.test(text)) return 4;
      if (/normal attack|primary fire|primary attack|main attack/.test(name)) return 0;
      if (/incarnon/.test(name) && a.shotType !== 'AoE' && !/radial/.test(name)) return 0;
      if (a.shotType === 'AoE' || /radial/.test(name)) return 3;
      return 1;
    };
    return arr(profiles)
      .map((profile, index) => ({ profile, index, rank: rank(profile) }))
      .sort((a, b) => a.rank - b.rank || a.index - b.index)
      .map((x) => x.profile);
  }
  function statusModeLayout(profiles, incarnonEnabled, renderProfile) {
    if (!profiles.length) return '';
    if (!incarnonEnabled)
      return (
        '<div class="status-mode-single">' +
        orderStatusProfiles(profiles).map(renderProfile).join('') +
        '</div>'
      );
    const base = orderStatusProfiles(
        profiles.filter((profile) => !/Incarnon/i.test(profile.a?.name || '')),
      ),
      incarnon = orderStatusProfiles(
        profiles.filter((profile) => /Incarnon/i.test(profile.a?.name || '')),
      );
    return (
      '<div class="status-mode-columns"><section class="status-mode-column"><h3>Base mode</h3>' +
      (base.length
        ? base.map(renderProfile).join('')
        : '<p class="empty">No base-mode status data.</p>') +
      '</section><section class="status-mode-column incarnon-mode-column"><h3>Incarnon mode</h3>' +
      (incarnon.length
        ? incarnon.map(renderProfile).join('')
        : '<p class="empty">No Incarnon status data.</p>') +
      '</section></div>'
    );
  }
  function statusProfileHTML(profile, result) {
    const rows =
        result.procs
          .map(
            (p) =>
              '<tr><td>' +
              statusImage(p.type) +
              escape(p.type) +
              '<small>' +
              escape(p.note) +
              (p.forcedPerProjectile
                ? ' · ' + fmt(p.forcedPerProjectile, 3) + ' forced/triggered procs per projectile'
                : '') +
              '</small></td><td class="numeric">' +
              (p.weight == null ? '—' : pct(p.weight)) +
              '</td><td class="numeric">' +
              fmt(p.randomExpected, 3) +
              '</td><td class="numeric">' +
              (p.probability == null ? '—' : pct(p.probability)) +
              '</td><td class="numeric">' +
              fmt(p.rate, 3) +
              '</td><td class="numeric">' +
              fmt(p.tick) +
              '</td><td class="numeric">' +
              fmt(p.lifetime) +
              '</td><td class="numeric">' +
              fmt(p.dps) +
              '</td></tr>',
          )
          .join('') ||
        '<tr><td colspan="8" class="empty">This projectile produces no status effects.</td></tr>',
      componentSummary = statusDamageBreakdown(profile);
    return (
      '<details class="status-profile" open><summary><b>' +
      escape(attackProfileGroup(profile.a)) +
      ' · ' +
      escape(profile.a.name) +
      '</b><small>' +
      fmt(profile.rate, 2) +
      ' attacks/s · ' +
      fmt(profile.ms, 2) +
      ' projectiles/attack · ' +
      pct(profile.sc) +
      ' status chance</small></summary>' +
      componentSummary +
      '<div class="tablewrap spacer"><table class="status-effect-table"><colgroup><col style="width:21%"><col style="width:9%"><col style="width:13%"><col style="width:12%"><col style="width:11%"><col style="width:11%"><col style="width:11%"><col style="width:12%"></colgroup><thead><tr><th><abbr title="Status effect">Effect</abbr></th><th class="numeric"><abbr title="Damage weight">Wt.</abbr></th><th class="numeric"><abbr title="Random procs per projectile">Procs/shot</abbr></th><th class="numeric"><abbr title="Chance of at least one status proc per projectile">Any/shot</abbr></th><th class="numeric"><abbr title="Status procs per second">Procs/s</abbr></th><th class="numeric"><abbr title="Damage per status tick">Tick dmg</abbr></th><th class="numeric"><abbr title="Status effect lifetime per proc">Life</abbr></th><th class="numeric"><abbr title="Status damage per second">DPS</abbr></th></tr></thead><tbody>' +
      rows +
      '</tbody></table></div></details>'
    );
  }
  function statusProbabilityTableHTML(profiles, incarnonEnabled = false) {
    const eligible = arr(profiles).filter((profile) => statusProbabilityRows(profile).length);
    if (!eligible.length) return '';
    const tables = statusModeLayout(eligible, incarnonEnabled, (profile) => {
      const rows = statusProbabilityRows(profile)
        .map(
          (row) =>
            '<tr><td>' +
            statusImage(row.type) +
            escape(row.type) +
            '</td><td class="numeric">' +
            pct(row.damageWeight) +
            '</td><td class="numeric">' +
            pct(row.perProjectile) +
            '</td><td class="numeric">' +
            fmt(row.expected, 1) +
            '</td><td class="numeric">' +
            pct(row.atLeastOne) +
            '</td></tr>',
        )
        .join('');
      if (!rows) return '';
      return (
        '<div class="status-probability-profile"><h4>' +
        escape(attackProfileGroup(profile.a)) +
        ' · ' +
        escape(profile.a?.name || 'Attack') +
        '</h4><div class="tablewrap"><table class="status-probability-table"><colgroup><col style="width:20%"><col style="width:15%"><col style="width:20%"><col style="width:22%"><col style="width:23%"></colgroup><thead><tr><th><abbr title="Damage type">Type</abbr></th><th class="numeric"><abbr title="Damage weight">Wt.</abbr></th><th class="numeric"><abbr title="Chance per projectile">Chance/shot</abbr></th><th class="numeric"><abbr title="Expected number of procs in 500 projectiles">Expected/500</abbr></th><th class="numeric"><abbr title="Chance of at least one proc in 500 projectiles">Chance ≥1/500</abbr></th></tr></thead><tbody>' +
        rows +
        '</tbody></table></div></div>'
      );
    });
    if (!tables) return '';
    return (
      '<section class="status-probability spacer"><h3>Status proc probability · ' +
      STATUS_PROBABILITY_SHOTS +
      ' projectiles per attack profile</h3><p class="hint">Each table uses only that firing profile’s damage and status chance. Weighted random status rolls from the weapon only; counts are projectiles, independent of multishot. Forced procs and enemy status immunity are excluded.</p>' +
      tables +
      '</section>'
    );
  }
  function damageProfileHTML(profile, label, color, incarnonMode = false) {
    const showIncarnon = incarnonMode,
      names = showIncarnon
        ? ['Base / unmodded', 'Incarnon enhancement', 'Modded']
        : ['Base / unmodded', 'Modded'],
      colors = showIncarnon ? ['#86b5be', '#a78be8', '#55d6b0'] : ['#86b5be', color],
      legend = names
        .map((name, i) => '<span style="--stage:' + colors[i] + '">' + name + '</span>')
        .join(''),
      parts = arr(profile.damageParts).length
        ? profile.damageParts
        : [
            {
              id: profile.a.id,
              name: profile.a.name,
              shotType: profile.a.shotType,
              stages: {
                unmodded: profile.stages.unmodded,
                incarnon: profile.stages.incarnon,
                modded: profile.stages.modded,
              },
            },
          ],
      componentHTML = parts
        .map((part) => {
          const stages = part.stages || {},
            distributions = showIncarnon
              ? [stages.unmodded || {}, stages.incarnon || {}, stages.modded || {}]
              : [stages.unmodded || {}, stages.modded || {}],
            types = [...new Set(distributions.flatMap((d) => Object.keys(d)))].sort(
              (a, b) =>
                (distributions[distributions.length - 1][b] || 0) -
                (distributions[distributions.length - 1][a] || 0),
            ),
            max = Math.max(1, ...distributions.flatMap((d) => Object.values(d))),
            rows = types
              .map(
                (type) =>
                  '<div class="damage-row staged"><span>' +
                  escape(type[0].toUpperCase() + type.slice(1)) +
                  '</span><div class="stage-bars">' +
                  distributions
                    .map(
                      (d, i) =>
                        '<div class="stage-bar" title="' +
                        names[i] +
                        ': ' +
                        fmt(d[type] || 0, 3) +
                        '"><div class="damagebar"><div style="width:' +
                        ((d[type] || 0) / max) * 100 +
                        '%;background:' +
                        colors[i] +
                        '"></div></div><small>' +
                        fmt(d[type] || 0, 3) +
                        '</small></div>',
                    )
                    .join('') +
                  '</div></div>',
              )
              .join(''),
            totals = distributions
              .map(
                (d, i) =>
                  '<tr><td>' +
                  names[i] +
                  '</td><td class="numeric">' +
                  fmt(sum(d), 3) +
                  '</td><td class="numeric">' +
                  (i
                    ? (sum(d) - sum(distributions[0]) >= 0 ? '+' : '') +
                      fmt(sum(d) - sum(distributions[0]), 3)
                    : '—') +
                  '</td></tr>',
              )
              .join(''),
            kind = part.shotType === 'AoE' ? 'RADIAL DAMAGE' : 'DIRECT PROJECTILE';
          return (
            '<section class="damage-component"><h4><span>' +
            kind +
            '</span> · ' +
            escape(part.name || 'Damage component') +
            '</h4>' +
            rows +
            '<div class="tablewrap"><table><thead><tr><th>Stage</th><th class="numeric">Damage / projectile</th><th class="numeric">Gain over base</th></tr></thead><tbody>' +
            totals +
            '</tbody></table></div></section>'
          );
        })
        .join('');
    return (
      '<section class="damage-profile"><h3>' +
      escape(label) +
      ' <small>· ' +
      escape(profile.a.name) +
      '</small></h3><div class="stage-legend">' +
      legend +
      '</div>' +
      componentHTML +
      '<p class="hint">Typed damage per projectile before critical hits, multishot, and defenses. ' +
      fmt(profile.ms, 2) +
      ' expected projectiles / attack.</p></section>'
    );
  }
  function damageDistributionHTML(profiles, incarnonEnabled) {
    const activeIncarnon =
        incarnonEnabled && profiles.some((profile) => /Incarnon/i.test(profile.a.name)),
      base = profiles.filter((profile) => !/Incarnon/i.test(profile.a.name)),
      incarnon = profiles.filter((profile) => /Incarnon/i.test(profile.a.name)),
      ordered = (items) =>
        [...items].sort((a, b) => {
          const rank = (profile) =>
            /normal attack|primary fire/i.test(profile.a.name)
              ? 0
              : attackModeLabel(profile.a) === 'Alt-fire mode'
                ? 2
                : 1;
          return rank(a) - rank(b);
        }),
      renderProfiles = (items, incarnonMode) =>
        ordered(items)
          .map((profile) =>
            damageProfileHTML(profile, attackModeLabel(profile.a), '#f4ae78', incarnonMode),
          )
          .join('') || '<p class="empty">No attacks in this mode.</p>';
    if (!activeIncarnon)
      return (
        '<div class="damage-mode-single"><h3>Base mode</h3>' +
        renderProfiles(base, false) +
        '</div>'
      );
    return (
      '<div class="damage-mode-columns"><section class="damage-mode-column"><h3>Base mode</h3>' +
      renderProfiles(base, false) +
      '</section><section class="damage-mode-column incarnon-mode-column"><h3>Incarnon mode</h3>' +
      renderProfiles(incarnon, true) +
      '</section></div>'
    );
  }
  function calculationNoticeHost() {
    let host = $('calculation-notices');
    if (host) return host;
    host = document.createElement('div');
    host.id = 'calculation-notices';
    const metrics = $('metrics'),
      calculator = $('view-calculator');
    if (metrics?.parentNode) metrics.parentNode.insertBefore(host, metrics.nextSibling);
    else if (calculator) calculator.insertBefore(host, calculator.firstChild);
    else if (document.body) document.body.appendChild(host);
    return host;
  }
  function renderCalculations() {
    if (!draftOpen) return;
    const noticeHost = calculationNoticeHost();
    try {
      const w = calculateWeapon(db, state),
        profileAttacks = availableWeaponAttacks(w.w.attacks, state.incarnonEnabled);
      if (!profileAttacks.some((a) => a.id === state.attackId)) profileAttacks.unshift(w.a);
      const profiles = profileAttacks.map((a) =>
        a.id === state.attackId ? w : calculateWeapon(db, { ...state, attackId: a.id }),
      );
      $('performance').innerHTML =
        profiles.map(performanceProfileHTML).join('') + shardPerformanceHTML(db, state, w.w);
      const e = get(db, 'enemies', state.enemyId) || records(db, 'enemies')[0],
        result = calculateEnemy(
          db,
          { ...state, scenario: { ...state.scenario, location: 'body' } },
          w,
          e,
        );
      $('capacity-label').textContent = w.build.used + ' / ' + w.build.capacity + ' CAPACITY';
      $('capacity-bar').classList.toggle('over', w.build.used > w.build.capacity);
      $('capacity-bar').firstElementChild.style.width =
        Math.min(100, (w.build.used / Math.max(1, w.build.capacity)) * 100) + '%';
      const required = w.build.resources,
        formaShort = state.forma < required.forma,
        umbraShort = (state.umbraForma || 0) < required.umbraForma,
        catalystShort = required.catalystRequired && !state.catalyst;
      $('capacity-resources').innerHTML =
        '<span class="badge ' +
        (formaShort ? 'shortfall' : 'good') +
        '">Forma ' +
        required.forma +
        ' required · ' +
        state.forma +
        ' applied</span>' +
        (required.umbraForma || state.umbraForma
          ? '<span class="badge ' +
            (umbraShort ? 'shortfall' : 'good') +
            '">Umbra Forma ' +
            required.umbraForma +
            ' required · ' +
            (state.umbraForma || 0) +
            ' applied</span>'
          : '') +
        '<span class="badge ' +
        (catalystShort ? 'shortfall' : required.catalystRequired ? 'needed' : '') +
        '">Orokin Catalyst ' +
        (required.catalystRequired
          ? state.catalyst
            ? 'required · installed'
            : 'required · missing'
          : 'not required') +
        '</span><span class="badge">Base capacity ' +
        required.baseCapacity +
        '</span>';
      $('build-errors').innerHTML = w.build.errors.length
        ? '<div class="error">' + w.build.errors.map(escape).join('<br>') + '</div>'
        : '';
      $('metrics').innerHTML =
        metric('Base shot damage', w.baseShot, 'Unmodded attack component') +
        metric('Modded expected hit', w.expected, 'Crits + multishot · before defenses', true) +
        metric('Burst DPS', w.burstDps, 'Before defenses · continuous fire') +
        metric('Sustained DPS', w.sustainedDps, 'Before defenses · reloads included');
      const notice = [];
      if (w.notes.length)
        notice.push(
          'Incomplete mechanics: figures include modeled effects only. Combined enemy totals are withheld where relevant rules are unverified.',
        );
      if (w.build.errors.length)
        notice.push(
          'This build is invalid. Values preview the selected combination; fix the listed build errors for a legal result.',
        );
      noticeHost.innerHTML = notice.length
        ? '<div class="warning">' + notice.map(escape).join('<br>') + '</div>'
        : '';
      $('damage-distribution').innerHTML = damageDistributionHTML(
        profiles,
        state.incarnonEnabled && hasIncarnonProfile(w.w),
      );
      const evoText = {
          baseDamage: 'base damage',
          baseCrit: 'base critical chance',
          critChance: 'critical chance',
          critDamage: 'critical damage',
          damage: 'damage',
          baseStatus: 'base status chance',
          statusChance: 'status chance',
          directStatusDamage: 'status damage',
          baseMultishot: 'multishot',
          punchThrough: 'punch through',
          recoil: 'recoil',
          baseMagazine: 'magazine capacity',
          reload: 'reload speed',
        },
        evoRows = w.evolutionEffects
          .map((e) => {
            const isFlat = [
                'baseDamage',
                'baseCrit',
                'baseStatus',
                'baseMultishot',
                'punchThrough',
                'baseMagazine',
                'recoil',
                'reload',
              ].includes(e.stat),
              value = (e.value >= 0 ? '+' : '') + (isFlat ? fmt(e.value, 2) : pct(e.value)),
              condition = arr(
                records(db, 'incarnon-evolutions').find((x) => x.name === e.evolution)?.conditions,
              ).find((c) => c.id === e.condition);
            return (
              '<li><b>' +
              escape(e.evolution || 'Incarnon evolution') +
              ':</b> ' +
              escape(value + ' ' + (evoText[e.stat] || e.stat)) +
              (condition && e.value === 0 ? ' · conditional bonus inactive' : '') +
              '</li>'
            );
          })
          .join('');
      if (evoRows)
        $('performance').insertAdjacentHTML(
          'beforeend',
          '<div class="evolution-performance"><h3>Incarnon:</h3><ul class="limits-list">' +
            evoRows +
            '</ul></div>',
        );
      fillEnemySelector(true);
      $('status-target-name').textContent = e.name.toUpperCase();
      const statusProfiles = statusAttackProfiles(w.w, state.incarnonEnabled)
          .map((a) => profiles.find((p) => p.a.id === a.id))
          .filter(Boolean),
        statusHasIncarnon =
          state.incarnonEnabled && statusProfiles.some((p) => /Incarnon/i.test(p.a.name)),
        statusProfileMarkup = statusModeLayout(statusProfiles, statusHasIncarnon, (p) => {
          const sr = calculateEnemy(
            db,
            { ...state, attackId: p.a.id, scenario: { ...state.scenario, location: 'body' } },
            p,
            e,
          );
          return statusProfileHTML(p, sr);
        });
      $('status-profiles').innerHTML =
        statusProfileMarkup +
          (statusProfileMarkup
            ? statusProbabilityTableHTML(statusProfiles, statusHasIncarnon)
            : '') || '<p class="empty">No applicable attack profiles.</p>';
      renderFactions(w);
      renderEnemyDetails(result, profiles);
      $('formula-details').innerHTML =
        '<div class="mini-stats">' +
        [
          ['Base / projectile', fmt(w.baseTotal)],
          ['Base damage multiplier', fmt(w.ordinary, 3) + '×'],
          ['Average crit multiplier', fmt(w.meanCrit, 3) + '×'],
          ['Reload-adjusted attack rate', fmt(w.sustain, 3) + ' / s'],
          ['Target faction multiplier', fmt(result.factionMultiplier, 3) + '×'],
          ['Target body multiplier', fmt(result.body, 3) + '×'],
        ]
          .map(([n, v]) => '<div>' + n + '<b>' + v + '</b></div>')
          .join('') +
        '</div><p class="footnote spacer">Direct damage = typed modded damage × expected multishot × critical expectation × hit-location multiplier × faction bonus × falloff × layer defenses. Damaging procs use their own coefficients and elemental rules; applicable faction bonuses are applied twice. The game rounds each typed damage component to a 1/32 share of modded base damage and encodes base critical multipliers as 12-bit values; selected-enemy details show rounded normal and critical popup values beside probability-weighted averages.</p>' +
        (result.notes.length
          ? '<h3>Coverage notes</h3><ul class="limits-list footnote">' +
            result.notes.map((n) => '<li>' + escape(n) + '</li>').join('') +
            '</ul>'
          : '<p class="success">Selected mechanics have no recorded coverage gaps.</p>');
    } catch (error) {
      calculationNoticeHost().innerHTML = '<div class="error">' + escape(error.message) + '</div>';
      console.error(error);
    }
  }
  function radialNeighborFalloffNote(db, state, profile, enemy) {
    const parts = arr(profile.damageParts).filter(
      (part) => part.shotType === 'AoE' && part.componentOf,
    );
    if (!parts.length) return '';
    const stacks = Object.fromEntries(
        Object.keys(state.scenario.stacks || {}).map((type) => [type, 0]),
      ),
      zeroState = {
        ...state,
        scenario: { ...state.scenario, location: 'body', stacks, heatStripOverride: 0 },
      },
      notes = parts.map((part) => {
        const falloff = part.falloff,
          start = Number(falloff?.start) || 0,
          end = Number(falloff?.end) || start,
          reduction = clamp(Number(falloff?.reduction) || 0, 0, 1),
          at = (distance) => {
            const result = calculateEnemy(
                db,
                { ...zeroState, scenario: { ...zeroState.scenario, distance } },
                profile,
                enemy,
              ),
              outcome = result.projectileOutcomes.find((x) => !x.critical),
              component = outcome?.components.find((x) => x.id === part.id);
            return component?.damage[result.current] ?? null;
          },
          atStart = at(start),
          atEnd = at(end),
          low = atStart == null || atEnd == null ? null : Math.min(atStart, atEnd),
          high = atStart == null || atEnd == null ? null : Math.max(atStart, atEnd);
        return (
          escape(part.name || 'Radial component') +
          ': ' +
          fmt(low, 0) +
          '–' +
          fmt(high, 0) +
          ' damage per neighbor over ' +
          fmt(start, 1) +
          '–' +
          fmt(end, 1) +
          ' m (' +
          pct(1) +
          '→' +
          pct(1 - reduction) +
          ' damage).'
        );
      });
    return (
      '<p class="hint radial-neighbor-note">Radial damage affects neighboring enemies, not the enemy directly hit. ' +
      notes.join(' ') +
      '</p>'
    );
  }
  function ttkCellHTML(cell) {
    const components = arr(cell.components),
      componentDetails = components
        .map(
          (x) =>
            (x.shotType === 'AoE' ? 'Radial' : 'Direct') +
            ' · ' +
            (x.name || 'component') +
            ' ' +
            fmt(x.damage, 1),
        )
        .join(' · '),
      stripChance =
        cell.armorStripChanceAfter ??
        cell.armorStripChance ??
        (cell.armorStrippedAfter || cell.armorStripped ? 1 : 0),
      details = [
        'Hit ' + (cell.hitLocation === 'body' ? 'Body' : 'Head / weakpoint'),
        'Damage ' + fmt(cell.damage, 1),
        componentDetails,
        cell.dotDamage > 0 ? 'DoT ' + fmt(cell.dotDamage, 1) : '',
        stripChance > 0
          ? 'Full armor strip chance ' + pct(stripChance) + ' (persistent once achieved)'
          : '',
        'Armor ' + fmt(cell.armor, 0),
        'Overguard ' + fmt(cell.overguard, 0),
        'Shield ' + fmt(cell.shield, 0),
        'Health ' + fmt(cell.health, 0),
      ]
        .filter(Boolean)
        .join(' · '),
      tag =
        stripChance >= 1 - 1e-9
          ? '<em class="armor-stripped-tag" title="Armor stripped">STRIP</em>'
          : stripChance > 0
            ? '<em class="armor-strip-tag">' + pct(stripChance) + ' strip</em>'
            : '';
    return (
      '<td class="numeric ttk-cell"><span title="' +
      escape(details) +
      '"><b>' +
      fmt(cell.damage, 1) +
      '</b>' +
      tag +
      '<small title="' +
      (cell.hitLocation === 'body' ? 'Body hit' : 'Head/weakpoint hit') +
      '">' +
      (cell.hitLocation === 'body' ? 'B' : 'H/W') +
      '</small></span></td>'
    );
  }
  function ttkResultHTML(ttk, host) {
    const summaries = ttk.locations
        .map(
          (x) =>
            '<div class="metric"><small>' +
            escape(x.name) +
            '</small><strong>' +
            (x.unavailable ? 'Unavailable' : x.killed ? fmt(x.ttk, 3) + ' s' : 'Not depleted') +
            '</strong><span>' +
            (x.unavailable
              ? 'Defense scaling data is incomplete'
              : x.killed
                ? fmt(x.projectiles, 0) + ' projectiles'
                : 'After ' + fmt(x.projectiles, 0) + ' projectiles') +
            '</span></div>',
        )
        .join(''),
      labels = {
        head: 'H/W',
        mix25: '75:25',
        mix50: '50:50',
        mix75: '25:75',
        mix110: '1:10',
        body: 'Body',
      },
      head =
        '<colgroup><col style="width:13%"><col style="width:8%">' +
        TTK_LOCATIONS.map(() => '<col style="width:13.166%">').join('') +
        '</colgroup><thead><tr><th title="Projectile index, shot number, and pellet number"><abbr title="Projectile index, shot number, and pellet number">Proj.</abbr></th><th title="Time since the first projectile"><abbr title="Time since the first projectile">Time</abbr></th>' +
        TTK_LOCATIONS.map((x) => {
          const full = x.name + ' (head/weakpoint : body)';
          return (
            '<th class="numeric" title="' +
            escape(full) +
            '" aria-label="' +
            escape(full) +
            '"><abbr title="' +
            escape(full) +
            '">' +
            labels[x.id] +
            '</abbr></th>'
          );
        }).join('') +
        '</tr></thead>';
    host.innerHTML =
      '<div class="metricgrid ttk-summaries">' +
      summaries +
      '</div>' +
      ttkGraphSVG(ttk.locations) +
      (ttk.rows.length
        ? '<section class="ttk-projectile-table-section"><h4>Projectile damage by hit scenario</h4><details class="ttk-table-details"><summary>Show projectile table · ' +
          fmt(ttk.rows.length, 0) +
          ' rows</summary><p class="hint">Hit ratios are head/weakpoint : body. Hover a column heading for its full ratio.</p><div class="tablewrap ttk-scroll"><table class="timeline-table ttk-table">' +
          head +
          '<tbody></tbody></table></div></details></section>'
        : '') +
      (ttk.limited
        ? '<p class="hint ttk-limit-note">The display reached its 4,000-projectile safety limit before the target was depleted.</p>'
        : '');
    const body = host.querySelector('tbody'),
      tableDetails = host.querySelector('.ttk-table-details');
    if (!body || !tableDetails) return;
    let index = 0;
    const renderChunk = () => {
      if (!host.isConnected || !tableDetails.open) return;
      const end = Math.min(ttk.rows.length, index + 250),
        html = ttk.rows
          .slice(index, end)
          .map(
            (row) =>
              '<tr><td title="Projectile ' +
              fmt(row.projectile, 0) +
              ' · shot ' +
              fmt(row.shot, 0) +
              ' · pellet ' +
              fmt(row.pellet, 0) +
              '">' +
              fmt(row.projectile, 0) +
              ' <small>' +
              fmt(row.shot, 0) +
              '·' +
              fmt(row.pellet, 0) +
              (row.pelletWeight < 1 ? ' · ' + pct(row.pelletWeight) : '') +
              '</small></td><td>' +
              fmt(row.time, 3) +
              ' s</td>' +
              row.scenarios
                .map((cell) => (cell ? ttkCellHTML(cell) : '<td class="numeric">—</td>'))
                .join('') +
              '</tr>',
          )
          .join('');
      body.insertAdjacentHTML('beforeend', html);
      index = end;
      if (index < ttk.rows.length && tableDetails.open) requestAnimationFrame(renderChunk);
    };
    tableDetails.addEventListener('toggle', () => {
      if (tableDetails.open) renderChunk();
    });
  }
  function armorTag(comparison) {
    return comparison.initial.stats.baseArmor > 0 && comparison.stripPercent > 0
      ? '<span class="badge armor-tag ' +
          (comparison.fullStripChance > 1 - 1e-8 ? 'good' : '') +
          '">armor stripped ' +
          pct(
            comparison.fullStripChance > 1 - 1e-8 ? 1 : Math.min(0.999, comparison.stripPercent),
          ) +
          '</span>'
      : '';
  }
  function comparisonCell(pair) {
    const first = pair.first;
    if (!first.locationAvailable)
      return '<td class="numeric" title="No sourced hit location">N/A</td>';
    return (
      '<td class="numeric hit-comparison"><b>' + fmt(first.layers[first.current].hit) + '</b></td>'
    );
  }
  function renderFactions(w) {
    const filter = $('faction-filter').value,
      distribution = armorProcDistribution(
        w,
        Math.max(14, Math.min(29, state.scenario.corrosiveCap + (w.bonus.corrosiveCapBonus || 0))),
      );
    const enemies = records(db, 'enemies').filter((e) => !filter || e.factionId === filter),
      groups = new Map();
    for (const e of enemies) {
      if (!groups.has(e.factionId)) groups.set(e.factionId, []);
      groups.get(e.factionId).push(e);
    }
    const opened = new Set(
      [...document.querySelectorAll('.faction-block[open]')].map((d) => d.dataset.faction),
    );
    $('enemy-count').textContent = enemies.length + ' ENEMIES';
    const html = [];
    for (const [id, es] of groups) {
      const f = get(db, 'factions', id),
        open = opened.has(id) || filter === id;
      let details = '';
      for (const e of open ? es : []) {
        const comparison = cachedEnemyComparison(db, state, w, e, distribution),
          r = comparison.initial,
          next = comparison.locations.body.next,
          special = r.notes.some((n) => /Special reduction|immunity|unavailable/.test(n));
        details +=
          '<tr data-enemy="' +
          escape(e.id) +
          '" tabindex="0"' +
          (e.id === state.enemyId ? ' class="selected"' : '') +
          '><td class="enemyname">' +
          escape(e.name) +
          '<small>' +
          escape(r.current) +
          (special ? ' · incomplete' : '') +
          '</small></td><td class="numeric">' +
          fmt(r.stats.armor, 0) +
          ' → ' +
          fmt(comparison.armor, 0) +
          ' ' +
          armorTag(comparison) +
          '</td>' +
          comparisonCell(comparison.locations.body) +
          comparisonCell(comparison.locations.weak) +
          comparisonCell(comparison.locations.head) +
          '<td class="numeric">' +
          fmt(next.layers[next.current].sustained) +
          '</td></tr>';
      }
      const mods = Object.entries(f?.modifiers || {})
        .map(([t, n]) => t + ' ' + n + '×')
        .join(' · ');
      html.push(
        '<details class="faction-block" data-faction="' +
          escape(id) +
          '"' +
          (open ? ' open' : '') +
          '><summary><span>' +
          escape(f?.name || id) +
          ' <small>(' +
          es.length +
          ')</small></span><small>' +
          escape(mods || 'Neutral type modifiers') +
          '</small></summary><div class="tablewrap"><table class="enemy-summary"><thead><tr><th>Enemy / layer</th><th class="numeric">Armor</th><th class="numeric">Body hit</th><th class="numeric">Weakpoint</th><th class="numeric">Headshot</th><th class="numeric">Body DPS</th></tr></thead><tbody>' +
          details +
          '</tbody></table></div></details>',
      );
    }
    $('faction-results').innerHTML = html.join('') || '<p class="empty">No matching enemies.</p>';
    for (const detail of document.querySelectorAll('.faction-block'))
      detail.ontoggle = () => {
        if (detail.isConnected && detail.open && !detail.querySelector('[data-enemy]'))
          renderFactions(calculateWeapon(db, state));
      };
    for (const row of document.querySelectorAll('[data-enemy]')) {
      row.onclick = () => {
        state.enemyId = row.dataset.enemy;
        schedule();
      };
      row.onkeydown = (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          row.click();
        }
      };
    }
  }
  function statusTimeline(w, result) {
    const requested = Number.isFinite(w.shots) && w.shots > 0,
      shotsPerMagazine = requested ? Math.max(1, Math.floor(w.shots)) : 10,
      rate = Math.max(0.0001, w.rate || 0),
      reload = Math.max(0, w.reload || 0),
      multishot = Math.max(0.01, w.ms || 1),
      magazineDuration = shotsPerMagazine / rate,
      cycleDuration = magazineDuration + reload,
      cycles = [];
    let totalProjectiles = 0;
    for (let cycle = 0; cycle < 3; cycle++) {
      const start = cycle * cycleDuration,
        projectiles = shotsPerMagazine * multishot;
      cycles.push({
        number: cycle + 1,
        start,
        end: start + magazineDuration,
        shots: shotsPerMagazine,
        projectiles,
        reload: cycle < 2 ? reload : 0,
      });
      totalProjectiles += projectiles;
    }
    const triggerTime = (trigger) => {
      const cycle = Math.floor((trigger - 1) / shotsPerMagazine),
        within = (trigger - 1) % shotsPerMagazine;
      return cycle * cycleDuration + within / rate;
    };
    const statuses = (result.procs || [])
      .filter((proc) => Number(proc.tick) > 0 && Number(proc.lifetime) > 0)
      .map((proc) => {
        const expectedPerProjectile = Math.max(
            0,
            (Number(proc.randomExpected) || 0) + (Number(proc.forcedPerProjectile) || 0),
          ),
          perTrigger = expectedPerProjectile * multishot,
          ticks = Math.max(1, Math.round(proc.lifetime / proc.tick)),
          definition =
            ruleOf(db).status[proc.type] ||
            (/bleed|hunter munitions/i.test(proc.type) ? ruleOf(db).status.slash : null),
          duration = Math.max(
            0.1,
            (definition?.duration || 6) * Math.max(0, 1 + (w.bonus.statusDuration || 0)),
          ),
          firstTrigger = perTrigger > 0 ? Math.ceil(1 / perTrigger) : null,
          firstTime = firstTrigger ? triggerTime(firstTrigger) : null,
          completeTime = firstTime == null ? null : firstTime + duration;
        let projectilesToComplete = null;
        if (completeTime != null) {
          const through = Math.max(0, Math.floor(completeTime / cycleDuration)) * shotsPerMagazine;
          let count = through;
          const cycle = Math.floor(completeTime / cycleDuration),
            within = completeTime - cycle * cycleDuration;
          if (cycle < 10000)
            count =
              cycle * shotsPerMagazine +
              Math.min(shotsPerMagazine, Math.floor(within * rate + 1e-9) + 1);
          projectilesToComplete = Math.min(1e7, count * multishot);
        }
        return {
          type: proc.type,
          tick: proc.tick,
          ticks,
          expectedPerProjectile,
          chancePerProjectile:
            proc.probability == null ? Math.min(1, expectedPerProjectile) : proc.probability,
          perTrigger,
          firstTrigger,
          firstTime,
          completeTime,
          projectilesToComplete,
          expectedPerCycle: perTrigger * shotsPerMagazine,
          expectedThreeCycles: perTrigger * shotsPerMagazine * 3,
          totalTicks: perTrigger * shotsPerMagazine * 3 * ticks,
        };
      })
      .filter((status) => status.expectedPerProjectile > 0)
      .sort((a, b) => b.totalTicks - a.totalTicks);
    return {
      shotsPerMagazine,
      requested,
      rate,
      reload,
      multishot,
      cycles,
      totalProjectiles,
      totalShots: shotsPerMagazine * 3,
      cycleDuration,
      totalDuration: cycleDuration * 3 - reload,
      statuses,
    };
  }
  function renderStatusTimeline(w, result) {
    const host = $('status-timeline');
    if (!host) return;
    const plan = statusTimeline(w, result),
      locationNames = { body: 'Body shot', weak: 'Weakpoint', head: 'Headshot' },
      cycleCards = plan.cycles
        .map(
          (cycle) =>
            '<div class="status-cycle"><div class="status-cycle-head"><b>Magazine ' +
            cycle.number +
            '</b><span>' +
            fmt(cycle.shots, 0) +
            ' attack triggers · ' +
            fmt(cycle.projectiles, 1) +
            ' expected projectiles</span></div><div class="status-projectile-lane" role="img" aria-label="Magazine ' +
            cycle.number +
            ': ' +
            cycle.shots +
            ' attack triggers until empty">' +
            Array.from(
              { length: cycle.shots },
              (_, index) =>
                '<i title="Trigger ' +
                (index + 1) +
                ' · ' +
                fmt(plan.multishot, 2) +
                ' expected projectiles"></i>',
            ).join('') +
            '</div><small>Fire to empty · ' +
            fmt(cycle.start, 2) +
            '–' +
            fmt(cycle.end, 2) +
            ' s</small></div>' +
            (cycle.reload
              ? '<div class="status-reload" aria-label="Reload between magazines">↻<small>Reload<br>' +
                fmt(cycle.reload, 2) +
                ' s</small></div>'
              : ''),
        )
        .join(''),
      rows = plan.statuses
        .map((status) => {
          const expectedProjectiles = status.firstTrigger
              ? status.firstTrigger * plan.multishot
              : null,
            complete =
              status.projectilesToComplete == null ? '—' : fmt(status.projectilesToComplete, 1),
            procs = status.firstTrigger ? fmt(status.expectedThreeCycles, 2) : '0';
          return (
            '<tr><th>' +
            statusImage(status.type) +
            escape(status.type) +
            '</th><td class="numeric">' +
            fmt(status.ticks, 0) +
            ' ticks</td><td class="numeric">' +
            pct(Math.min(1, status.expectedPerProjectile)) +
            '<small>' +
            fmt(status.expectedPerProjectile, 3) +
            ' expected / projectile</small></td><td class="numeric">' +
            (expectedProjectiles == null ? '—' : fmt(expectedProjectiles, 1)) +
            '</td><td class="numeric">' +
            complete +
            '<small>projectiles until first proc completes its ticks</small></td>' +
            plan.cycles
              .map(
                () =>
                  '<td class="numeric">' +
                  fmt(status.expectedPerCycle, 2) +
                  '<small>expected procs</small></td>',
              )
              .join('') +
            '<td class="numeric"><b>' +
            fmt(status.totalTicks, 1) +
            '</b><small>projected ticks after all procs mature (' +
            procs +
            ' procs)</small></td></tr>'
          );
        })
        .join('');
    host.innerHTML =
      '<div class="timeline-tools"><div><p class="hint">Selected target: ' +
      escape(result.enemy.name) +
      ' · ' +
      escape(w.a?.name || 'Selected attack') +
      ' · ' +
      fmt(state.scenario.level, 0) +
      ' · ' +
      escape(locationNames[timelineLocation] || 'Body shot') +
      '</p><p class="hint">Each magazine fires until empty, then reloads. The three magazines include ' +
      fmt(plan.totalProjectiles, 1) +
      ' expected projectiles from ' +
      fmt(plan.totalShots, 0) +
      ' attack triggers' +
      (plan.requested
        ? ''
        : ' (10-trigger display blocks because this weapon has no magazine size in its data).') +
      '</p></div><div class="timeline-tabs">' +
      Object.entries(locationNames)
        .map(
          ([location, label]) =>
            '<button type="button" data-timeline-location="' +
            location +
            '" aria-pressed="' +
            (timelineLocation === location) +
            '">' +
            label +
            '</button>',
        )
        .join('') +
      '</div></div><div class="status-cycle-track">' +
      cycleCards +
      '</div><p class="hint">Status rolls use this attack’s weighted damage, status chance, forced procs, multishot, and rank-adjusted tick duration. “Projectiles to first proc” and tick totals are expected values; the completion count includes shots and reloads while that proc delivers its full tick sequence. Total ticks are the projected full lifetime of procs applied across all three magazines, including ticks that occur after the third magazine empties.</p><div class="tablewrap"><table class="timeline-table status-tick-table"><thead><tr><th>Status</th><th class="numeric">Maximum ticks / proc</th><th class="numeric">Proc / projectile</th><th class="numeric">Projectiles to first proc</th><th class="numeric">Projectiles to full ticks</th><th class="numeric">Cycle 1</th><th class="numeric">Cycle 2</th><th class="numeric">Cycle 3</th><th class="numeric">Three-cycle maximum tick yield</th></tr></thead><tbody>' +
      rows +
      '</tbody></table></div>' +
      (rows
        ? ''
        : '<p class="empty">This attack has no modeled damage-over-time status effects.</p>');
    for (const button of host.querySelectorAll('[data-timeline-location]'))
      button.onclick = () => {
        timelineLocation = button.dataset.timelineLocation;
        renderStatusTimeline(
          w,
          calculateEnemy(
            db,
            { ...state, scenario: { ...state.scenario, location: timelineLocation } },
            w,
            result.enemy,
          ),
        );
      };
  }
  function maxApplicableStatusState(state, profile, enemy) {
    const scenario = state.scenario,
      stacks = { ...scenario.stacks };
    if (enemy.statusImmune) return { state, labels: [] };
    const parts = arr(profile.damageParts),
      damage = profile.damage || {},
      forced = new Set(Object.keys(profile.forced || {}));
    for (const part of parts)
      for (const proc of arr(part.forcedProcs)) forced.add(PROCS[proc] || proc);
    const caps = {
        viral: 10,
        corrosive: corrosiveStackCap(state, profile, enemy),
        heat: 1,
        magnetic: 10,
        cold: 10,
        puncture: 5,
      },
      labels = [];
    for (const [type, cap] of Object.entries(caps)) {
      const canApply =
        forced.has(type) ||
        (profile.sc > 0 &&
          (damage[type] ||
            parts.some((part) => (part.damage?.[type] || 0) > 0 && part.statusChance > 0)));
      if (canApply) {
        stacks[type] = Math.max(Number(stacks[type]) || 0, cap);
        labels.push(
          type === 'heat'
            ? 'Heat up to −50% armor'
            : type === 'viral'
              ? 'Viral ' +
                cap +
                ' stacks · ×' +
                fmt(cap ? 2 + 0.25 * (cap - 1) : 1, 2) +
                ' Health damage'
              : type + ' ' + cap + ' stacks',
        );
      }
    }
    return {
      state: {
        ...state,
        scenario: {
          ...scenario,
          stacks,
          heatStripOverride: stacks.heat > 0 ? 0.5 : scenario.heatStripOverride,
        },
      },
      labels,
    };
  }
  function statusDamageEffectsHTML(db, state, profile, enemy) {
    const parts = arr(profile.damageParts),
      hasType = (type) => parts.some((part) => (part.damage?.[type] || 0) > 0),
      hasViral = hasType('viral'),
      hasHeat = hasType('heat');
    if (!hasViral && !hasHeat) return '';
    const baseStacks = Object.fromEntries(
        Object.keys(state.scenario.stacks || {}).map((type) => [type, 0]),
      ),
      baseState = {
        ...state,
        scenario: { ...state.scenario, stacks: baseStacks, heatStripOverride: 0 },
      },
      cap = corrosiveStackCap(baseState, profile, enemy),
      baseStats = enemyStats(
        db,
        enemy,
        auraEnemyScenario(db, baseState, { ...baseState.scenario, corrosiveCap: cap }),
      ),
      ceiling = maxApplicableStatusState(baseState, profile, enemy),
      maxStats = enemyStats(
        db,
        enemy,
        auraEnemyScenario(db, ceiling.state, {
          ...ceiling.state.scenario,
          corrosiveCap: corrosiveStackCap(ceiling.state, profile, enemy),
        }),
      ),
      heatState = {
        ...baseState,
        scenario: {
          ...baseState.scenario,
          stacks: { ...baseStacks, heat: 1 },
          heatStripOverride: 0.5,
        },
      },
      heatStats = enemyStats(
        db,
        enemy,
        auraEnemyScenario(db, heatState, { ...heatState.scenario, corrosiveCap: cap }),
      ),
      rows = [];
    if (hasViral) {
      const viralCap = Math.max(0, Number(ceiling.state.scenario.stacks.viral) || 0),
        multiplier = (n) => (n ? 2 + 0.25 * (n - 1) : 1),
        progression = Array.from(
          { length: viralCap + 1 },
          (_, n) => '<span><b>' + n + '</b> ' + fmt(multiplier(n), 2) + '×</span>',
        ).join('');
      rows.push(
        '<tr><th>Viral</th><td>Health damage multiplier per stack: <div class="viral-stack-scale">' +
          progression +
          '</div><small>At ' +
          viralCap +
          ' stacks: ' +
          fmt(multiplier(viralCap), 2) +
          '× health damage. Viral boosts the next hit against Health while stacks remain; it does not multiply damage to shields or Overguard.</small></td></tr>',
      );
    }
    if (hasHeat) {
      const baseArmor = baseStats.armor,
        heatArmor = heatStats.armor,
        maxArmor = maxStats.armor;
      rows.push(
        '<tr><th>Heat</th><td>Armor ' +
          fmt(baseArmor, 0) +
          ' → ' +
          fmt(heatArmor, 0) +
          ' with Heat alone (−50%)' +
          (ceiling.state.scenario.stacks.corrosive > 0
            ? ' · ' + fmt(maxArmor, 0) + ' after maximum applicable armor statuses together'
            : '') +
          '<small>Heat progressively removes armor, up to 50%. The resulting increase comes from lower armor damage reduction; Heat does not directly multiply weapon damage.</small></td></tr>',
      );
    }
    const aptitudeSlot = state.slots.find(
        (slot) => get(db, 'mods', slot.id)?.name === 'Galvanized Aptitude',
      ),
      aptitude = profile.bonus?.galvanizedAptitude || 0,
      aptitudeTypes = Object.entries(ceiling.state.scenario.stacks)
        .filter(([type, count]) => STATUS_EFFECT_TYPES.includes(type) && count > 0)
        .map(([type]) => type);
    if (aptitudeSlot)
      rows.push(
        '<tr><th>Galvanized Aptitude</th><td>+' +
          pct(aptitude) +
          ' base damage per active status type × ' +
          aptitudeTypes.length +
          ' (' +
          escape(aptitudeTypes.join(', ') || 'none') +
          ') = +' +
          pct(aptitude * aptitudeTypes.length) +
          ' direct-hit damage<small>' +
          aptitudeSlot.stacks +
          ' of 2 kill stacks active. It affects direct hits, not the linked radial component.</small></td></tr>',
      );
    return (
      '<details class="status-effect-breakdown spacer"><summary>Status modifiers · ' +
      escape(attackModeLabel(profile.a)) +
      ' · Viral' +
      (hasHeat ? ' / Heat' : '') +
      (aptitude > 0 ? ' / Galvanized Aptitude' : '') +
      '</summary><div class="tablewrap"><table><tbody>' +
      rows.join('') +
      '</tbody></table></div></details>'
    );
  }
  function hitOutcomeValue(outcome, layer, upperOutcome = null) {
    if (!outcome) return '—';
    const parts = arr(outcome.components),
      upperParts = arr(upperOutcome?.components),
      formatRange = (value, upper) =>
        upper == null || upper === value ? fmt(value, 0) : fmt(value, 0) + '–' + fmt(upper, 0),
      total = formatRange(outcome.damage[layer], upperOutcome?.damage[layer]);
    if (parts.length < 2) return total;
    const breakdown = parts
      .map(
        (part, index) =>
          (part.shotType === 'AoE' ? 'Radial' : 'Direct') +
          ' ' +
          formatRange(part.damage[layer], upperParts[index]?.damage[layer]),
      )
      .join(' + ');
    return total + '<small class="hit-component-breakdown">' + escape(breakdown) + '</small>';
  }
  function hitOutcomeRangeSet(db, state, profile, enemy, location) {
    const stacks = Object.fromEntries(
        Object.keys(state.scenario.stacks || {}).map((type) => [type, 0]),
      ),
      scenario = {
        ...state,
        attackId: profile.a.id,
        scenario: { ...state.scenario, location, stacks, heatStripOverride: 0 },
      },
      current = calculateEnemy(db, scenario, profile, enemy),
      ceiling = maxApplicableStatusState(scenario, profile, enemy),
      maximum = ceiling.labels.length ? calculateEnemy(db, ceiling.state, profile, enemy) : current,
      findMatch = (source, outcome) =>
        source.projectileOutcomes.find(
          (candidate) => JSON.stringify(candidate.tiers) === JSON.stringify(outcome.tiers),
        ),
      normal = current.projectileOutcomes.find((outcome) => !outcome.critical),
      normalMax = normal ? findMatch(maximum, normal) : null,
      criticals = current.projectileOutcomes
        .filter((outcome) => outcome.critical)
        .map((outcome) => ({ min: outcome, max: findMatch(maximum, outcome) }));
    return { current, maximum, normal, normalMax, criticals, labels: ceiling.labels };
  }
  function ttkHitOutcomesHTML(source, buildState, profile, enemy) {
    const targetProfile = directTargetProfile(profile),
      labels = { body: 'Body', weak: 'Weakpoint', head: 'Headshot' },
      rows = ['body', 'weak', 'head']
        .map((location) => {
          const range = hitOutcomeRangeSet(source, buildState, targetProfile, enemy, location),
            result = range.current;
          if (!result.locationAvailable)
            return (
              '<tr><th>' +
              labels[location] +
              '</th><td colspan="2">N/A — no sourced hit location</td></tr>'
            );
          const value = (min, max) => hitOutcomeValue(min, result.current, max),
            critText =
              range.criticals
                .map(
                  ({ min, max }) =>
                    value(min, max) + ' · Tier ' + min.tier + ' · ' + pct(min.probability),
                )
                .join('<br>') || 'No critical chance';
          return (
            '<tr><th>' +
            labels[location] +
            '</th><td class="numeric">' +
            value(range.normal, range.normalMax) +
            '</td><td class="numeric">' +
            critText +
            '</td></tr>'
          );
        })
        .join('');
    return (
      '<section class="ttk-hit-outcomes"><h4>Direct-hit normal and critical damage · Body, Weakpoint, Headshot</h4><div class="tablewrap"><table><thead><tr><th>Hit location</th><th class="numeric">Normal hit</th><th class="numeric">Critical hit · tier and chance</th></tr></thead><tbody>' +
      rows +
      '</tbody></table></div><p class="hint">Direct damage per projectile, before multishot. Ranges run from zero status stacks to maximum applicable stacks; Heat armor reduction is capped at 50%. Linked radial bursts damage neighboring enemies and are excluded from this directly struck target.</p></section>'
    );
  }
  function renderEnemyDetails(r, profiles = []) {
    const w = calculateWeapon(db, state),
      comparison = cachedEnemyComparison(db, state, w, r.enemy),
      locations = ['body', 'weak', 'head'],
      labels = { body: 'Body shot', weak: 'Weakpoint', head: 'Headshot' };
    const image = recordImage(r.enemy, 'enemy'),
      detailRows = profiles
        .flatMap((profile) => {
          const targetProfile = directTargetProfile(profile);
          return locations.map((location) => {
            const range = hitOutcomeRangeSet(db, state, targetProfile, r.enemy, location),
              hit = range.current;
            if (!hit.locationAvailable)
              return (
                '<tr><td>' +
                escape(
                  attackModeLabel(profile.a) + ' · ' + profile.a.name + ' · ' + labels[location],
                ) +
                '</td><td colspan="4">N/A</td></tr>'
              );
            const value = (min, max) => hitOutcomeValue(min, hit.current, max),
              critical = range.criticals
                .map(({ min, max }) => value(min, max) + ' · ' + pct(min.probability))
                .join('<br>'),
              maxStatusLabel = range.labels.length
                ? '<small class="hit-component-breakdown">Maximum: ' +
                  escape(range.labels.join(' · ')) +
                  '</small>'
                : '';
            return (
              '<tr><td>' +
              escape(
                attackModeLabel(profile.a) +
                  ' · ' +
                  profile.a.name +
                  ' · ' +
                  labels[location] +
                  ' · ' +
                  fmt(hit.layers[hit.current].hit) +
                  ' average',
              ) +
              maxStatusLabel +
              '</td><td>' +
              value(range.normal, range.normalMax) +
              ' normal</td><td>' +
              critical +
              (range.criticals.length ? ' critical' : 'no critical chance') +
              '</td><td>' +
              fmt(hit.body, 2) +
              '×</td><td>' +
              pct(hit.criticalChance) +
              '</td></tr>'
            );
          });
        })
        .join(''),
      summaryRows = profiles
        .flatMap((profile) =>
          locations.map((location) => {
            const range = hitOutcomeRangeSet(
                db,
                state,
                directTargetProfile(profile),
                r.enemy,
                location,
              ),
              hit = range.current;
            if (!hit.locationAvailable)
              return (
                '<tr><th>' +
                escape(attackModeLabel(profile.a) + ' · ' + labels[location]) +
                '</th><td colspan="2">N/A</td></tr>'
              );
            const best = range.criticals.reduce(
                (chosen, item) =>
                  !chosen || item.min.damage[hit.current] > chosen.min.damage[hit.current]
                    ? item
                    : chosen,
                null,
              ),
              normal = hitOutcomeValue(range.normal, hit.current, range.normalMax),
              critical = best
                ? hitOutcomeValue(best.min, hit.current, best.max) +
                  '<small>Highest tier · ' +
                  pct(best.min.probability) +
                  '</small>'
                : 'No critical chance';
            return (
              '<tr><th>' +
              escape(attackModeLabel(profile.a) + ' · ' + labels[location]) +
              '</th><td>' +
              normal +
              '</td><td>' +
              critical +
              '</td></tr>'
            );
          }),
        )
        .join('');
    const ttkProfiles = profiles.map((profile, index) => ({ profile, index })),
      renderTtkProfile = ({ profile, index }) => {
        const radial = arr(profile.damageParts).filter(
            (part) => part.shotType === 'AoE' && part.componentOf,
          ),
          label = attackModeLabel(profile.a),
          profileState = { ...state, attackId: profile.a.id };
        return (
          '<section class="ttk-profile" data-ttk-profile-index="' +
          index +
          '"><h3>' +
          escape(label) +
          ' · ' +
          escape(profile.a.name) +
          (radial.length
            ? ' + ' + radial.map((part) => escape(part.name || 'radial component')).join(', ')
            : '') +
          ' <small>· ' +
          fmt(profile.rate, 2) +
          ' attacks/s · ' +
          fmt(profile.ms, 2) +
          ' projectiles/attack</small></h3>' +
          ttkHitOutcomesHTML(db, profileState, profile, r.enemy) +
          radialNeighborFalloffNote(db, profileState, profile, r.enemy) +
          '<div class="ttk-result" data-ttk-result="' +
          index +
          '"><p class="hint">Calculating projectile and status damage scenarios…</p></div></section>'
        );
      },
      ttkHasIncarnon =
        state.incarnonEnabled &&
        ttkProfiles.some(({ profile }) => /Incarnon/i.test(profile.a.name)),
      baseTtkProfiles = ttkProfiles.filter(({ profile }) => !/Incarnon/i.test(profile.a.name)),
      incarnonTtkProfiles = ttkProfiles.filter(({ profile }) => /Incarnon/i.test(profile.a.name)),
      ttkRows = Array.from(
        { length: Math.max(baseTtkProfiles.length, incarnonTtkProfiles.length) },
        (_, i) =>
          '<div class="ttk-mode-row"><div class="ttk-mode-slot">' +
          (baseTtkProfiles[i] ? renderTtkProfile(baseTtkProfiles[i]) : '') +
          '</div><div class="ttk-mode-slot">' +
          (incarnonTtkProfiles[i] ? renderTtkProfile(incarnonTtkProfiles[i]) : '') +
          '</div></div>',
      ).join(''),
      ttkHTML =
        (ttkHasIncarnon
          ? '<div class="ttk-mode-layout"><div class="ttk-mode-headings"><h3>Base mode</h3><h3>Incarnon mode</h3></div>' +
            ttkRows +
            '</div>'
          : '<div class="ttk-mode-single">' +
            ttkProfiles.map(renderTtkProfile).join('') +
            '</div>') +
        '<p class="hint ttk-disclaimer">Expected critical damage, status applications and DoT ticks are used; fractional multishot and status procs represent expected values. TTK measures damage to the directly struck enemy; linked radial bursts are excluded. Hover a damage value for DoT and remaining defense pools. Shield gating and Incarnon charge cycles are excluded.</p>';
    $('ttk-target-name').textContent =
      r.enemy.name.toUpperCase() + ' · LEVEL ' + fmt(state.scenario.level, 0);
    const enemySummaryHTML =
        '<div class="enemy-detail-head">' +
        image +
        '<div><div class="panelhead"><h3>' +
        escape(r.enemy.name) +
        ' · level ' +
        fmt(state.scenario.level, 0) +
        '</h3><span class="badge ' +
        (r.complete ? 'good' : 'warn') +
        '">' +
        (r.complete ? 'MODELED' : 'INCOMPLETE') +
        '</span></div><p class="hint">' +
        escape(r.enemy.type || 'Enemy') +
        ' · ' +
        escape(r.faction.name) +
        ' · <a href="' +
        escape(safeURL(r.enemy.wiki)) +
        '" target="_blank" rel="noopener">Wiki entry</a></p><p class="hint">Armor ' +
        fmt(r.stats.armor, 0) +
        ' → ' +
        fmt(comparison.armor, 0) +
        ' ' +
        armorTag(comparison) +
        ' · Next attack after ' +
        fmt(comparison.elapsed, 3) +
        ' s · Expected Corrosive stacks ' +
        fmt(comparison.expectedCorrosive, 3) +
        ' · Heat active ' +
        pct(comparison.heatChance) +
        (comparison.truncated ? ' · Proc distribution capped at 256.' : '') +
        '</p></div></div><p class="hint spacer">Hit popups show direct damage to the struck enemy from zero stacks through maximum applicable status stacks. Heat armor reduction ramps over time and caps at 50%; linked radial bursts affect neighboring enemies and their falloff damage is listed with TTK.</p>',
      hitDamageHTML =
        '<section class="enemy-hit-damage"><h3>Hit damage</h3><p class="hint">Direct damage per projectile, before multishot. Normal values span zero through maximum applicable status effects; the critical column shows the highest critical tier. Expand details for all tiers and probabilities.</p><div class="tablewrap"><table><thead><tr><th>Attack · location</th><th>Normal</th><th>Highest critical</th></tr></thead><tbody>' +
        summaryRows +
        '</tbody></table></div></section>',
      detailedHitHTML =
        '<details class="spacer enemy-detailed-hit-details"><summary>Detailed hit values · all critical tiers, status ranges and hit multipliers</summary><div class="tablewrap spacer"><table class="enemy-detailed-hit-table"><colgroup><col style="width:40%"><col style="width:18%"><col style="width:22%"><col style="width:10%"><col style="width:10%"></colgroup><thead><tr><th title="Direct hit, location, and average damage per projectile"><abbr title="Direct hit, location, and average damage per projectile">Hit / location</abbr></th><th title="Normal popup damage, minimum to maximum across status stacks"><abbr title="Normal popup damage, minimum to maximum across status stacks">Normal</abbr></th><th title="Critical popup damage, minimum to maximum across status stacks"><abbr title="Critical popup damage, minimum to maximum across status stacks">Critical</abbr></th><th title="Hit location damage multiplier"><abbr title="Hit location damage multiplier">Hit ×</abbr></th><th title="Critical hit chance"><abbr title="Critical hit chance">Crit %</abbr></th></tr></thead><tbody>' +
        detailRows +
        '</tbody></table></div></details>',
      statusDamageHTML =
        '<div class="enemy-status-details">' +
        profiles
          .map((profile) =>
            statusDamageEffectsHTML(db, state, directTargetProfile(profile), r.enemy),
          )
          .join('') +
        '</div>',
      defenseHTML =
        '<div class="tablewrap enemy-defense-table"><table><thead><tr><th>Defense layer</th><th class="numeric">Pool</th><th class="numeric">Body hit</th><th class="numeric">Weakpoint</th><th class="numeric">Headshot</th></tr></thead><tbody>' +
        [
          ['health', r.stats.health],
          ['shield', r.stats.shield],
          ['overguard', r.stats.overguard],
        ]
          .filter(([, pool]) => pool > 0 || pool == null)
          .map(
            ([layer, pool]) =>
              '<tr><td>' +
              layer +
              (r.current === layer ? ' · active' : '') +
              '</td><td class="numeric">' +
              fmt(pool, 0) +
              '</td>' +
              locations
                .map((location) => {
                  const pair = comparison.locations[location];
                  return (
                    '<td class="numeric">' +
                    (pair.first.locationAvailable
                      ? fmt(pair.first.layers[layer].hit) + ' → ' + fmt(pair.next.layers[layer].hit)
                      : 'N/A') +
                    '</td>'
                  );
                })
                .join('') +
              '</tr>',
          )
          .join('') +
        '</tbody></table></div>',
      enemyHTML =
        '<div class="enemy-overview-grid"><div class="enemy-summary-column">' +
        enemySummaryHTML +
        '</div>' +
        hitDamageHTML +
        '</div>' +
        statusDamageHTML +
        detailedHitHTML +
        '<p class="hint">Faction multiplier ' +
        fmt(r.factionMultiplier, 2) +
        '×. Weakpoint damage bonus ' +
        pct(w.bonus.weakDamage || 0) +
        ' · weakpoint critical chance bonus ' +
        pct(w.bonus.weakCrit || 0) +
        ' · headshot bonus ' +
        pct(w.bonus.headshot || 0) +
        '.</p>' +
        (r.notes.length
          ? '<details class="spacer"><summary>' +
            r.notes.length +
            ' coverage notes</summary><ul class="limits-list footnote spacer">' +
            r.notes.map((n) => '<li>' + escape(n) + '</li>').join('') +
            '</ul></details>'
          : '') +
        defenseHTML +
        '<section class="spacer"><h3>Projectile time to kill</h3><p class="hint">Each projectile is one row, with simultaneous multishot pellets sharing a timestamp. Mixed hit ratios repeat in four-projectile blocks (3 head/weak + 1 body, 2 + 2, or 1 + 3); each table row labels its actual hit. DoT ticks can deplete pools between projectiles.</p><p class="hint">Enemy catalogue: ' +
        fmt(records(db, 'enemies').length, 0) +
        ' entries from the bundled wiki snapshot. Eximus is a stat condition; variants such as Shock Eximus are not separate records.</p>' +
        ttkHTML +
        '</section>';
    const ttkStart = enemyHTML.indexOf('<section class="spacer"><h3>Projectile time to kill</h3>'),
      ttkEnd =
        ttkStart < 0
          ? -1
          : (() => {
              let depth = 0;
              const tags = /<\/?section\b[^>]*>/g;
              tags.lastIndex = ttkStart;
              let match;
              while ((match = tags.exec(enemyHTML))) {
                depth += match[0][1] === '/' ? -1 : 1;
                if (depth === 0) return tags.lastIndex;
              }
              return -1;
            })();
    if (ttkStart >= 0 && ttkEnd > ttkStart) {
      $('ttk-profiles').innerHTML = enemyHTML
        .slice(ttkStart, ttkEnd)
        .replace(
          '<section class="spacer"><h3>Projectile time to kill</h3>',
          '<div class="ttk-attack-profiles">',
        )
        .replace(/<\/section>$/, '</div>');
      $('enemy-details').innerHTML = enemyHTML.slice(0, ttkStart) + enemyHTML.slice(ttkEnd);
    } else {
      $('enemy-details').innerHTML = enemyHTML;
    }
    ttkRenderToken++;
    for (const detail of document.querySelectorAll('.ttk-profile')) {
      const index = Number(detail.dataset.ttkProfileIndex),
        profile = profiles[index],
        host = detail.querySelector('[data-ttk-result]');
      if (!profile || !host) continue;
      host.dataset.loaded = 'true';
      const jobState = { ...state, attackId: profile.a.id };
      requestTtk(jobState, r.enemy.id, (result, error) => {
        if (!host.isConnected) return;
        if (error) {
          host.innerHTML = '<p class="error">TTK calculation failed: ' + escape(error) + '</p>';
          return;
        }
        ttkResultHTML(result, host);
      });
    }
    renderStatusTimeline(
      w,
      calculateEnemy(
        db,
        { ...state, scenario: { ...state.scenario, location: timelineLocation } },
        w,
        r.enemy,
      ),
    );
  }
  function referenceRecord(c, id) {
    return db[c]?.onlineReference?.[id] || get(bundled, c, id);
  }
  function tweakedFields(c, r) {
    if (!ONLINE_CATEGORIES.includes(c) || !r || !r.source?.url) return [];
    const reference = referenceRecord(c, r.id),
      hashes = db[c]?.onlineHashes?.[r.id];
    if (!reference && !hashes) return [];
    return Object.keys(r).filter((key) => {
      if (
        [
          'id',
          'source',
          'image',
          'imageSource',
          'icon',
          'iconSource',
          'iconFallback',
          'wiki',
        ].includes(key)
      )
        return false;
      const onlineHash =
        hashes?.[key] ??
        (reference && Object.hasOwn(reference, key) ? recordFingerprint(reference[key]) : null);
      return onlineHash !== null && recordFingerprint(r[key]) !== onlineHash;
    });
  }
  function renderEditorList() {
    const c = $('database-category').value,
      search = $('database-search').value.trim().toLowerCase(),
      tweakedOnly = $('filter-tweaked-records')?.getAttribute('aria-pressed') === 'true',
      letter =
        $('record-alpha-filter')?.querySelector('[aria-pressed="true"]')?.dataset.recordLetter ||
        '';
    const matching = records(db, c).filter(
        (r) =>
          r.name.toLowerCase().includes(search) && (!tweakedOnly || tweakedFields(c, r).length),
      ),
      items = matching
        .filter((r) => !letter || r.name.trim().toUpperCase().startsWith(letter))
        .sort((a, b) => a.name.localeCompare(b.name));
    $('record-count').textContent =
      items.length +
      ' record' +
      (items.length === 1 ? '' : 's') +
      (letter ? ' under ' + letter : '') +
      (tweakedOnly ? ' · tweaked only' : '');
    $('record-list').innerHTML =
      items
        .map((r) => {
          const tweaked = tweakedFields(c, r).length;
          return (
            '<button data-record="' +
            escape(r.id) +
            '" title="' +
            escape(r.id) +
            '" class="' +
            (r.id === selectedRecord ? 'selected ' : '') +
            (tweaked ? 'tweaked-record' : '') +
            '">' +
            escape(r.name) +
            (tweaked ? '<span class="tweaked-badge">TWEAKED</span>' : '') +
            '</button>'
          );
        })
        .join('') || '<p class="hint">No records match these filters.</p>';
    for (const b of $('record-list').querySelectorAll('[data-record]'))
      b.onclick = () => loadRecord(b.dataset.record);
  }
  function loadRecord(id) {
    selectedRecord = id;
    const c = $('database-category').value,
      r = get(db, c, id);
    if (!r) return;
    $('record-title').textContent = r.name;
    const tweaks = tweakedFields(c, r);
    $('record-coverage').textContent = tweaks.length
      ? 'TWEAKED'
      : r.limitations?.length
        ? 'INCOMPLETE MECHANICS'
        : 'EDITABLE';
    $('record-coverage').classList.toggle('warn', !!tweaks.length);
    const url = safeURL(r.source?.url || ''),
      sourced = url !== '#';
    $('record-source').innerHTML =
      'Source: ' +
      escape(sourced ? new URL(url).hostname : 'Locally maintained') +
      (sourced
        ? ' · <a href="' + escape(url) + '" target="_blank" rel="noopener">View source ↗</a>'
        : '') +
      (ONLINE_CATEGORIES.includes(c)
        ? ' · Online catalogue: Warframe Wiki'
        : ' · No catalogue sync');
    $('force-refresh-record').hidden = !ONLINE_CATEGORIES.includes(c) || !sourced;
    $('record-json').value = JSON.stringify(r, null, 2);
    renderRecordFields(r);
    $('record-tweaks').innerHTML = tweaks.length
      ? '<strong>Locally changed fields:</strong> ' +
        tweaks
          .map((field) => '<span class="tweaked-badge">' + escape(field) + ' TWEAKED</span>')
          .join(' ')
      : '';
    $('record-json').classList.toggle('tweaked-json', !!tweaks.length);
    $('editor-message').textContent = tweaks.length ? 'TWEAKED fields: ' + tweaks.join(', ') : '';
    renderEditorList();
  }
  function renderRecordFields(record) {
    const category = $('database-category').value;
    const tweaks = new Set(tweakedFields(category, record));
    const fields = Object.entries(record).filter(
      ([key, value]) =>
        ['string', 'number', 'boolean'].includes(typeof value) &&
        !['description', 'wiki'].includes(key),
    );
    if (
      category === 'weapons' &&
      record.incarnonVariant &&
      !fields.some(([key]) => key === 'incarnonImage')
    )
      fields.push(['incarnonImage', '']);
    $('record-fields').innerHTML = fields
      .map(([key, value]) => {
        const label = escape(key),
          badge = tweaks.has(key) ? '<span class="tweaked-badge">TWEAKED</span>' : '';
        const control =
          typeof value === 'boolean'
            ? '<select data-record-field="' +
              label +
              '"><option value="true"' +
              (value ? ' selected' : '') +
              '>true</option><option value="false"' +
              (!value ? ' selected' : '') +
              '>false</option></select>'
            : '<input data-record-field="' +
              label +
              '" type="' +
              (typeof value === 'number' ? 'number' : 'text') +
              '"' +
              (typeof value === 'number' ? ' step="any"' : '') +
              ' value="' +
              escape(value) +
              '">';
        return (
          '<label class="' +
          (tweaks.has(key) ? 'tweaked-field' : '') +
          '">' +
          label +
          badge +
          control +
          '</label>'
        );
      })
      .join('');
    for (const input of $('record-fields').querySelectorAll('[data-record-field]')) {
      input.oninput = () => {
        const key = input.dataset.recordField;
        try {
          const edited = JSON.parse($('record-json').value);
          if (typeof edited !== 'object' || edited === null || Array.isArray(edited))
            throw Error('Record JSON must be an object.');
          if (typeof record[key] === 'number') {
            if (input.value.trim() === '' || !Number.isFinite(input.valueAsNumber))
              throw Error('Enter a valid number for ' + key + '.');
            edited[key] = input.valueAsNumber;
          } else
            edited[key] = typeof record[key] === 'boolean' ? input.value === 'true' : input.value;
          $('record-json').value = JSON.stringify(edited, null, 2);
          $('editor-message').textContent = '';
        } catch (error) {
          $('editor-message').textContent = 'Field change not applied: ' + error.message;
        }
      };
    }
  }
  function templateRecord(c) {
    if (c === 'arsenal')
      return { id: 'build-' + Date.now(), name: 'New arsenal build', state: clone(state) };
    const first = records(db, c)[0];
    if (first) {
      const r = clone(first);
      r.id = 'custom-' + Date.now();
      r.name = 'New ' + c;
      r.source = {
        url: '',
        snapshot: new Date().toISOString().slice(0, 10),
        license: 'User-created',
      };
      return r;
    }
    return {
      id: 'custom-' + Date.now(),
      name: 'New Riven',
      family: chosenWeapon().family,
      category: rivenCategory(chosenWeapon()),
      layout: '3p1n',
      rank: 8,
      mastery: 8,
      polarity: 'madurai',
      attributes: [
        { stat: 'damage', quality: 1, negative: false },
        { stat: 'critChance', quality: 1, negative: false },
        { stat: 'multishot', quality: 1, negative: false },
        { stat: 'zoom', quality: 1, negative: true },
      ],
    };
  }
  function newRecord(cloning = false) {
    const c = $('database-category').value;
    let r = templateRecord(c);
    if (cloning) {
      try {
        r = JSON.parse($('record-json').value);
        r.id += '-copy-' + Date.now();
        r.name += ' (copy)';
      } catch {
        notify('Select a valid record to clone.', true);
        return;
      }
    }
    selectedRecord = '';
    $('record-title').textContent = r.name;
    $('record-json').value = JSON.stringify(r, null, 2);
    renderRecordFields(r);
    $('record-tweaks').innerHTML = '';
    $('record-json').classList.remove('tweaked-json');
    $('editor-message').textContent = 'New record — save to add it to the database.';
  }
  function applyDatabase(candidate) {
    normalizeWeaponDatabase(candidate.weapons);
    syncProgenitorLibraryFromWeapons(candidate);
    const errors = validateDatabase(candidate);
    if (errors.length)
      throw Error(
        errors.slice(0, 10).join('\n') +
          (errors.length > 10 ? '\n… ' + (errors.length - 10) + ' more errors' : ''),
      );
    discardTtkWorker();
    comparisonCache.clear();
    db = candidate;
    databaseDirty = true;
    indexData();
    if (activeBuildId && !get(db, 'arsenal', activeBuildId)) {
      activeBuildId = '';
      draftOpen = false;
      savedFingerprint = '';
    }
    if (!get(db, 'weapons', state.weaponId)) state = defaultState(db);
    if (!get(db, 'enemies', state.enemyId)) state.enemyId = records(db, 'enemies')[0]?.id;
    fillCatalogControls();
    renderWeaponControls();
    renderMods();
    renderArcanes();
    renderArchonShards();
    syncInputs();
    renderEditorList();
    renderRivenList();
    schedule();
  }
  function recordReferences(c, id) {
    const refs = [];
    for (const b of records(db, 'arsenal'))
      if (
        buildReferences(b.state).some(([category, recordId]) => category === c && recordId === id)
      )
        refs.push('saved build: ' + b.name);
    if (c === 'weapons' && state.weaponId === id) refs.push('selected weapon');
    if (c === 'enemies' && state.enemyId === id) refs.push('selected enemy');
    if (c === 'mods') {
      if ([...state.slots, state.exilus].some((s) => s.id === id)) refs.push('equipped mod');
      for (const m of records(db, 'mods'))
        if (m.id !== id && m.incompatible?.includes(id)) refs.push(m.name + ' exclusion');
    }
    if (c === 'arcanes' && state.arcanes.some((s) => s.id === id)) refs.push('equipped arcane');
    if (c === 'rivens' && state.slots.some((s) => s.id === 'riven:' + id))
      refs.push('equipped Riven');
    if (c === 'riven-splices' || c === 'riven-tables')
      for (const r of records(db, 'rivens'))
        if (r.attributes.some((a) => a.stat === id && (c === 'riven-splices') === !!a.spliced))
          refs.push('Riven: ' + r.name);
    if (c === 'stances' && state.stance.id === id) refs.push('equipped stance');
    if (c === 'modular-parts' && Object.values(state.parts).includes(id))
      refs.push('selected modular part');
    if (c === 'incarnon-evolutions' && Object.values(state.evolutions).includes(id))
      refs.push('selected evolution');
    if (c === 'archon-shards' && state.shards?.some((s) => s.id === id))
      refs.push('equipped Archon Shard');
    return refs;
  }
  function saveRecord() {
    try {
      const c = $('database-category').value,
        r = JSON.parse($('record-json').value),
        candidate = clone(db),
        index = candidate[c].records.findIndex((r) => r.id === selectedRecord),
        previous = index >= 0 ? candidate[c].records[index] : null;
      if (
        c === 'mods' &&
        previous &&
        (r.description !== previous.description || r.maxRank !== previous.maxRank) &&
        JSON.stringify(r.rankDescriptions) === JSON.stringify(previous.rankDescriptions)
      )
        r.rankDescriptions = Array.from({ length: r.maxRank + 1 }, (_, rank) =>
          rank === r.maxRank ? r.description : null,
        );
      if (index >= 0) {
        if (r.id !== selectedRecord && recordReferences(c, selectedRecord).length)
          throw Error(
            'Resolve active references before changing this ID: ' +
              recordReferences(c, selectedRecord).join(', '),
          );
        candidate[c].records[index] = r;
      } else candidate[c].records.push(r);
      applyDatabase(candidate);
      loadRecord(r.id);
      $('editor-message').textContent = 'Saved. Export ' + c + '.json to keep a portable copy.';
      notify('Record saved.');
    } catch (e) {
      $('editor-message').textContent = e.message;
      notify(e.message, true);
    }
  }
  function deleteRecord() {
    const c = $('database-category').value,
      r = get(db, c, selectedRecord);
    if (!r) return;
    const refs = recordReferences(c, r.id);
    if (refs.length) {
      notify('Resolve references before deleting: ' + refs.slice(0, 5).join(', '), true);
      return;
    }
    if (!confirm('Delete ' + r.name + '?')) return;
    try {
      const candidate = clone(db);
      candidate[c].records = candidate[c].records.filter((x) => x.id !== r.id);
      applyDatabase(candidate);
      selectedRecord = '';
      $('record-title').textContent = 'Select a record';
      $('record-json').value = '';
      $('record-fields').innerHTML = '';
      notify('Record deleted.');
    } catch (e) {
      notify('Deletion blocked: ' + e.message, true);
    }
  }
  // Small STORE-only ZIP implementation. Image formats are already compressed; Blob parts avoid
  // holding a second copy of the entire artwork library in JavaScript memory.
  const ZIP_CRC_TABLE = Uint32Array.from({ length: 256 }, (_, i) => {
    let v = i;
    for (let n = 0; n < 8; n++) v = v & 1 ? 0xedb88320 ^ (v >>> 1) : v >>> 1;
    return v >>> 0;
  });
  async function zipCrc(blob) {
    let crc = 0xffffffff;
    for await (const chunk of blob.stream()) {
      const bytes = new Uint8Array(chunk);
      for (const byte of bytes) crc = ZIP_CRC_TABLE[(crc ^ byte) & 255] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }
  const zipText = new TextEncoder(),
    zipDecoder = new TextDecoder();
  function zip16(view, offset, value) {
    view.setUint16(offset, value, true);
  }
  function zip32(view, offset, value) {
    view.setUint32(offset, value >>> 0, true);
  }
  function checkedZipPath(path) {
    if (
      typeof path !== 'string' ||
      path.startsWith('/') ||
      path.includes('\\') ||
      path
        .split('/')
        .some((part) => !part || part === '.' || part === '..' || /[^\x20-\x7e]/.test(part))
    )
      throw Error('Unsafe ZIP path: ' + path);
    return path;
  }
  async function createZip(entries, progress = () => {}) {
    if (entries.length > 65535) throw Error('ZIP contains too many files.');
    const parts = [],
      central = [];
    let offset = 0;
    for (let i = 0; i < entries.length; i++) {
      const [path, source] = entries[i],
        name = zipText.encode(checkedZipPath(path));
      const blob = source instanceof Blob ? source : new Blob([source]),
        size = blob.size;
      if (name.length > 65535 || size > 0xffffffff || offset + 30 + name.length + size > 0xffffffff)
        throw Error('ZIP exceeds its size limit.');
      const crc = await zipCrc(blob),
        header = new Uint8Array(30 + name.length),
        local = new DataView(header.buffer);
      zip32(local, 0, 0x04034b50);
      zip16(local, 4, 20);
      zip16(local, 6, 0x800);
      zip16(local, 8, 0);
      zip32(local, 14, crc);
      zip32(local, 18, size);
      zip32(local, 22, size);
      zip16(local, 26, name.length);
      header.set(name, 30);
      parts.push(header, blob);
      const record = new Uint8Array(46 + name.length),
        directory = new DataView(record.buffer);
      zip32(directory, 0, 0x02014b50);
      zip16(directory, 4, 20);
      zip16(directory, 6, 20);
      zip16(directory, 8, 0x800);
      zip16(directory, 10, 0);
      zip32(directory, 16, crc);
      zip32(directory, 20, size);
      zip32(directory, 24, size);
      zip16(directory, 28, name.length);
      zip32(directory, 42, offset);
      record.set(name, 46);
      central.push(record);
      offset += header.length + size;
      progress(i + 1, entries.length, path);
      if (i % 25 === 0) await new Promise((resolve) => setTimeout(resolve, 0));
    }
    const centralSize = central.reduce((sum, item) => sum + item.length, 0);
    if (offset + centralSize + 22 > 0xffffffff) throw Error('ZIP exceeds 4 GB limit.');
    const end = new Uint8Array(22),
      footer = new DataView(end.buffer);
    zip32(footer, 0, 0x06054b50);
    zip16(footer, 8, entries.length);
    zip16(footer, 10, entries.length);
    zip32(footer, 12, centralSize);
    zip32(footer, 16, offset);
    return new Blob([...parts, ...central, end], { type: 'application/zip' });
  }
  async function readZip(file) {
    const tail = new Uint8Array(await file.slice(Math.max(0, file.size - 65557)).arrayBuffer());
    let endOffset = -1;
    for (let i = tail.length - 22; i >= 0; i--) {
      if (new DataView(tail.buffer, i, 4).getUint32(0, true) === 0x06054b50) {
        endOffset = i;
        break;
      }
    }
    if (endOffset < 0) throw Error('Not a valid ZIP archive.');
    const end = new DataView(tail.buffer, endOffset),
      count = end.getUint16(10, true);
    const length = end.getUint32(12, true),
      start = end.getUint32(16, true);
    if (count > 10000 || start + length > file.size) throw Error('Invalid ZIP directory.');
    const directory = new Uint8Array(await file.slice(start, start + length).arrayBuffer());
    const view = new DataView(directory.buffer),
      entries = [],
      seen = new Set();
    let at = 0;
    for (let i = 0; i < count; i++) {
      if (at + 46 > directory.length || view.getUint32(at, true) !== 0x02014b50)
        throw Error('Invalid ZIP entry.');
      const method = view.getUint16(at + 10, true),
        crc = view.getUint32(at + 16, true);
      const size = view.getUint32(at + 20, true),
        packed = view.getUint32(at + 24, true);
      const nameLength = view.getUint16(at + 28, true),
        extra = view.getUint16(at + 30, true);
      const comment = view.getUint16(at + 32, true),
        offset = view.getUint32(at + 42, true);
      const next = at + 46 + nameLength + extra + comment;
      if (next > directory.length) throw Error('Truncated ZIP directory entry.');
      const path = checkedZipPath(
        zipDecoder.decode(directory.slice(at + 46, at + 46 + nameLength)),
      );
      if (seen.has(path)) throw Error('Duplicate ZIP path: ' + path);
      seen.add(path);
      if (method !== 0)
        throw Error('Compressed ZIP entries are unsupported. Import a ZIP exported by this app.');
      if (offset + 30 > start) throw Error('Invalid ZIP file header.');
      const local = new DataView(await file.slice(offset, offset + 30).arrayBuffer());
      if (local.getUint32(0, true) !== 0x04034b50 || local.getUint16(8, true) !== 0)
        throw Error('Invalid ZIP file header.');
      const dataStart = offset + 30 + local.getUint16(26, true) + local.getUint16(28, true);
      if (dataStart + packed > start || packed !== size) throw Error('Invalid ZIP entry size.');
      entries.push({ path, blob: file.slice(dataStart, dataStart + packed), size, crc });
      at = next;
    }
    return entries;
  }
  async function verifiedZipBlob(entry) {
    if ((await zipCrc(entry.blob)) !== entry.crc) throw Error('Corrupt ZIP entry: ' + entry.path);
    return entry.blob;
  }
  function backupProgress(title, current, total, detail) {
    const dialog = $('backup-dialog');
    $('backup-heading').textContent = title;
    $('backup-progress').max = Math.max(1, total);
    $('backup-progress').value = current;
    $('backup-detail').textContent = detail || current + ' / ' + total;
    $('backup-close').hidden = true;
    if (!dialog.open) dialog.showModal();
  }
  function backupDone(message) {
    $('backup-heading').textContent = message;
    if (message === 'Data ZIP validated') {
      $('backup-dialog').close();
      return;
    }
    $('backup-close').hidden = false;
    $('backup-close').onclick = () => $('backup-dialog').close();
  }
  function backupFailure(error) {
    backupDone('Backup operation failed');
    $('backup-detail').textContent = error.message;
    notify(error.message, true);
  }
  function downloadBlob(name, blob) {
    const url = URL.createObjectURL(blob),
      a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.hidden = true;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }
  async function exportDataZip() {
    try {
      const entries = CATEGORIES.map((c) => [
        'data/' + c + '.json',
        JSON.stringify(db[c], null, 2) + '\n',
      ]);
      backupProgress('Exporting data', 0, entries.length);
      const blob = await createZip(entries, (n, total, path) =>
        backupProgress('Exporting data', n, total, path),
      );
      downloadBlob('warframe-data.zip', blob);
      backupDone('Data ZIP ready');
    } catch (error) {
      backupFailure(error);
    }
  }
  async function writeImportedDataFolder(entries) {
    const originals = [],
      written = [];
    for (const entry of entries) {
      const name = entry.path.slice(5);
      try {
        const handle = await dataDirectory.getFileHandle(name);
        originals.push({ name, blob: await handle.getFile() });
      } catch (error) {
        if (error.name !== 'NotFoundError') throw error;
        originals.push({ name, blob: null });
      }
    }
    const rollback = async () => {
      for (const previous of originals.filter((item) => written.includes(item.name)).reverse()) {
        if (previous.blob) {
          const handle = await dataDirectory.getFileHandle(previous.name, { create: true }),
            writer = await handle.createWritable();
          await writer.write(previous.blob);
          await writer.close();
        } else await dataDirectory.removeEntry(previous.name);
      }
    };
    try {
      for (const entry of entries) {
        const name = entry.path.slice(5),
          handle = await dataDirectory.getFileHandle(name, { create: true }),
          writer = await handle.createWritable();
        try {
          await writer.write(entry.blob);
          await writer.close();
          written.push(name);
        } catch (error) {
          await writer.abort();
          throw error;
        }
      }
    } catch (error) {
      await rollback();
      throw error;
    }
    return rollback;
  }
  async function importDataZip(file) {
    if (!file) return;
    try {
      backupProgress('Reading data ZIP', 0, 1);
      const entries = await readZip(file),
        expected = new Set(CATEGORIES.map((c) => 'data/' + c + '.json'));
      if (entries.length !== expected.size || entries.some((entry) => !expected.has(entry.path)))
        throw Error(
          'Data ZIP must contain exactly ' +
            CATEGORIES.length +
            ' category JSON files under data/.',
        );
      const candidate = clone(db);
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i],
          category = entry.path.slice(5, -5),
          data = JSON.parse(await (await verifiedZipBlob(entry)).text());
        if (data.category !== category || data.schemaVersion !== 1 || !Array.isArray(data.records))
          throw Error('Invalid category JSON: ' + entry.path);
        candidate[category] = data;
        backupProgress('Validating data ZIP', i + 1, entries.length, entry.path);
      }
      const errors = validateDatabase(candidate);
      if (errors.length) throw Error(errors.slice(0, 8).join('\n'));
      backupDone('Data ZIP validated');
      $('import-preview').hidden = false;
      $('import-preview').innerHTML =
        '<div class="warning">Replace all ' +
        CATEGORIES.length +
        ' working data categories from ' +
        escape(file.name) +
        '? Saved arsenal builds and Rivens are included.<div class="toolbar spacer"><button id="confirm-zip-import" class="primary">Restore Data</button><button id="cancel-zip-import">Cancel</button></div></div>';
      $('cancel-zip-import').onclick = () => ($('import-preview').hidden = true);
      $('confirm-zip-import').onclick = async () => {
        try {
          let rollback = null;
          try {
            if (dataDirectory) rollback = await writeImportedDataFolder(entries);
            applyDatabase(candidate);
          } catch (error) {
            if (rollback) await rollback();
            throw error;
          }
          $('import-preview').hidden = true;
          notify(
            'Data ZIP restored' +
              (dataDirectory
                ? ' to browser and connected data folder.'
                : ' to browser. Connect a data folder during online sync to write JSON files.'),
          );
        } catch (error) {
          notify('Data restore failed: ' + error.message, true);
        }
      };
    } catch (error) {
      backupFailure(error);
    } finally {
      $('data-zip-file').value = '';
    }
  }
  let assetFolder = null;
  const BUNDLED_ASSET_PATHS = [
    'images/archon-shards/plain-shard.png',
    'images/archon-shards/plain-shard-large.png',
    'images/placeholder.svg',
  ];
  async function chooseAssetFolder() {
    if (!global.showDirectoryPicker)
      throw Error('Folder access is unavailable in this browser. Use Chrome or Edge.');
    const folder = await global.showDirectoryPicker({
      id: 'void-arsenal-images',
      mode: 'readwrite',
    });
    await folder.getFileHandle('index.html');
    assetFolder = folder;
    await countLocalAssets();
    return folder;
  }
  async function imageHandle(root, path, create = false) {
    const parts = checkedZipPath(path).split('/');
    if (parts[0] !== 'images') throw Error('Expected an images/ path.');
    let folder = root;
    for (const part of parts.slice(0, -1))
      folder = await folder.getDirectoryHandle(part, { create });
    return folder.getFileHandle(parts.at(-1), { create });
  }
  async function countLocalAssets() {
    const output = $('local-asset-counts');
    if (!assetFolder) {
      output.textContent =
        Object.keys(ASSET_SOURCES).length +
        BUNDLED_ASSET_PATHS.length +
        ' assets in manifest (' +
        Object.keys(ASSET_SOURCES).length +
        ' downloadable) · locally present: unknown (connect project folder)';
      return;
    }
    const manifestFile = await (await imageHandle(assetFolder, 'images/manifest.json')).getFile(),
      manifest = JSON.parse(await manifestFile.text()),
      paths = manifest.assets.map((asset) => checkedZipPath(asset.local)),
      total = paths.length;
    let present = 0,
      checked = 0;
    for (const path of paths) {
      try {
        if ((await (await imageHandle(assetFolder, path)).getFile()).size > 0) present++;
      } catch (error) {
        if (error.name !== 'NotFoundError') throw error;
      }
      checked++;
      if (checked % 100 === 0) {
        output.textContent =
          total + ' in manifest · checking local files ' + checked + ' / ' + total;
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
    output.textContent =
      total +
      ' assets in manifest · ' +
      present +
      ' present locally · ' +
      (total - present) +
      ' missing';
  }
  async function exportAssetsZip() {
    try {
      const folder = assetFolder || (await chooseAssetFolder()),
        entries = [],
        manifest = await (await imageHandle(folder, 'images/manifest.json')).getFile(),
        registry = JSON.parse(await manifest.text()),
        paths = registry.assets
          .filter((asset) => asset.url)
          .map((asset) => checkedZipPath(asset.local));
      backupProgress('Finding downloaded assets', 0, paths.length);
      for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        try {
          const file = await (await imageHandle(folder, path)).getFile();
          if (file.size) entries.push([path, file]);
        } catch (error) {
          if (error.name !== 'NotFoundError') throw error;
        }
        if (i % 100 === 0) backupProgress('Finding downloaded assets', i + 1, paths.length, path);
      }
      entries.unshift(['images/manifest.json', manifest]);
      const blob = await createZip(entries, (n, total, path) =>
        backupProgress('Exporting assets', n, total, path),
      );
      downloadBlob('warframe-assets.zip', blob);
      backupDone('Assets ZIP ready · ' + (entries.length - 1) + ' images');
    } catch (error) {
      if (error.name === 'AbortError') $('backup-dialog').close();
      else backupFailure(error);
    }
  }
  async function importAssetsZip(file) {
    if (!file) return;
    try {
      const folder = assetFolder || (await chooseAssetFolder()),
        entries = await readZip(file);
      if (!entries.length) throw Error('Asset ZIP is empty.');
      if (!entries.some((entry) => entry.path === 'images/manifest.json'))
        throw Error('Asset ZIP is missing images/manifest.json.');
      const manifestEntry = entries.find((entry) => entry.path === 'images/manifest.json'),
        manifest = JSON.parse(await (await verifiedZipBlob(manifestEntry)).text());
      if (!Array.isArray(manifest.assets)) throw Error('Invalid asset manifest.');
      const paths = new Set(
        manifest.assets
          .filter((a) => a.url && typeof a.local === 'string' && a.local.startsWith('images/'))
          .map((a) => checkedZipPath(a.local)),
      );
      if (entries.some((entry) => entry.path !== 'images/manifest.json' && !paths.has(entry.path)))
        throw Error('Image not listed as downloadable in the ZIP manifest.');
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i],
          blob = await verifiedZipBlob(entry);
        if (entry.path !== 'images/manifest.json' && blob.type && !blob.type.startsWith('image/'))
          throw Error('Invalid image MIME type: ' + entry.path);
        backupProgress('Validating assets ZIP', i + 1, entries.length, entry.path);
      }
      if (
        !confirm(
          'Restore ' +
            (entries.length - 1) +
            ' images to ' +
            folder.name +
            '? Existing files with the same names will be replaced.',
        )
      ) {
        $('backup-dialog').close();
        return;
      }
      const writes = [
        ...entries.filter((entry) => entry.path !== 'images/manifest.json'),
        manifestEntry,
      ];
      for (let i = 0; i < writes.length; i++) {
        const entry = writes[i],
          handle = await imageHandle(folder, entry.path, true),
          writer = await handle.createWritable();
        try {
          await writer.write(entry.blob);
          await writer.close();
        } catch (error) {
          await writer.abort();
          throw error;
        }
        backupProgress('Restoring assets', i + 1, entries.length, entry.path);
      }
      await countLocalAssets();
      backupDone('Assets restored · ' + (entries.length - 1) + ' images');
    } catch (error) {
      if (error.name === 'AbortError') $('backup-dialog').close();
      else backupFailure(error);
    } finally {
      $('assets-zip-file').value = '';
    }
  }
  function newRiven() {
    rivenEditing = '';
    const w = draftOpen ? chosenWeapon() : null;
    rivenSelectedWeaponId = w?.id || '';
    rivenDraft = {
      id: 'riven-' + Date.now(),
      name: w ? w.family + ' custom Riven' : 'Custom Riven',
      family: w?.family || '',
      weaponId: w?.id || '',
      category: w ? rivenCategory(w) : '',
      layout: '3p1n',
      rank: 8,
      mastery: 8,
      polarity: 'madurai',
      attributes: [
        { stat: 'damage', quality: 1, negative: false },
        { stat: 'critChance', quality: 1, negative: false },
        { stat: 'multishot', quality: 1, negative: false },
        { stat: 'zoom', quality: 1, negative: true },
      ],
    };
    renderRivenForm();
  }
  function rivenLibraryFace(r) {
    const w = rivenWeaponForDraft(records(db, 'weapons'), r, null);
    if (!w) return '<span class="hint">Weapon unavailable</span>';
    const slot = { id: 'riven:' + r.id, rank: r.rank, polarity: '', stacks: 0, uptime: 100 },
      mod = slotMod(db, slot, w);
    return mod ? modFaceHTML(mod, slot, 0) : '<span class="hint">Riven unavailable</span>';
  }
  function rivenLibrarySearchText(r) {
    const weapon = get(db, 'weapons', r.weaponId),
      traits = arr(r.attributes).map(
        (a) =>
          a.stat +
          ' ' +
          (get(db, a.spliced ? 'riven-splices' : 'riven-tables', a.stat)?.name || '') +
          (a.spliced ? ' spliced' : ''),
      );
    return [r.name, r.family, weapon?.name, r.category, ...traits].join(' ').toLowerCase();
  }
  function renderRivenLibrary() {
    const all = records(db, 'rivens'),
      terms = $('riven-library-search').value.trim().toLowerCase().split(/\s+/).filter(Boolean),
      matching = all.filter((r) => terms.every((term) => rivenLibrarySearchText(r).includes(term)));
    $('riven-list').innerHTML =
      matching
        .map(
          (r) =>
            '<div class="riven-library-item"><div class="mod-card" tabindex="0" aria-label="' +
            escape(r.name) +
            ' Riven mod, rank ' +
            r.rank +
            '">' +
            rivenLibraryFace(r) +
            '</div><span class="riven-library-meta">' +
            escape(r.family) +
            ' · ' +
            escape(r.layout) +
            (r.attributes.some((a) => a.spliced) ? ' · 🔒 Spliced' : '') +
            '</span><button type="button" data-edit-riven="' +
            escape(r.id) +
            '">Edit ' +
            escape(r.name) +
            '</button></div>',
        )
        .join('') ||
      '<p class="empty">' +
        (all.length ? 'No Rivens match your search.' : 'No custom Rivens yet.') +
        '</p>';
    for (const button of $('riven-list').querySelectorAll('[data-edit-riven]'))
      button.onclick = () => {
        rivenEditing = button.dataset.editRiven;
        rivenDraft = clone(get(db, 'rivens', rivenEditing));
        rivenSelectedWeaponId = rivenDraft.weaponId || '';
        renderRivenForm();
      };
  }
  function renderRivenList() {
    const editing = !!rivenDraft;
    $('riven-weapon-card').hidden = !editing;
    $('riven-recommendations').hidden = !editing;
    $('riven-workshop-panel').hidden = !editing;
    $('riven-workshop-empty').hidden = editing;
    $('delete-riven').hidden = !rivenEditing;
    $('cancel-riven').textContent = rivenEditing ? 'Cancel editing' : 'Cancel creation';
    renderRivenLibrary();
    if (!editing) return;
    const weapons = records(db, 'weapons').filter((w) => w.rivenDisposition != null),
      families = [...new Set(weapons.map((w) => w.family))].sort();
    $('riven-family').innerHTML = options(
      families.map((f) => ({ id: f, name: f })),
      rivenDraft.family,
      'Choose a weapon family',
    );
    renderRivenWeaponOptions();
    const weapon = rivenDraft.weaponId ? get(db, 'weapons', rivenDraft.weaponId) : null;
    renderRivenWeaponSummary(weapon);
    renderRivenRecommendations(weapon, rivenDraft.category);
  }
  function renderRivenWeaponOptions() {
    const family = rivenDraft?.family || '',
      models = records(db, 'weapons')
        .filter((w) => w.family === family && w.rivenDisposition != null)
        .sort((a, b) => a.name.localeCompare(b.name));
    $('riven-weapon-model').innerHTML = options(
      models.map((w) => ({ id: w.id, name: w.name })),
      rivenDraft?.weaponId || '',
      'Choose a weapon model',
    );
  }
  function renderRivenWeaponSearch(query) {
    const input = $('riven-weapon-search'),
      results = $('riven-weapon-results');
    if (!rivenDraft) return;
    const q = String(query || '')
        .trim()
        .toLowerCase(),
      locked = rivenDraft.attributes.some((a) => a.spliced),
      matches = records(db, 'weapons')
        .filter(
          (w) =>
            w.rivenDisposition != null &&
            (!locked ||
              (w.family === rivenDraft.family && rivenCategory(w) === rivenDraft.category)) &&
            (!q || (w.name + ' ' + w.family + ' ' + w.category).toLowerCase().includes(q)),
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
      shown = matches.slice(0, 30);
    results.innerHTML =
      shown
        .map(
          (w) =>
            '<button type="button" role="option" data-riven-weapon="' +
            escape(w.id) +
            '"><strong>' +
            escape(w.name) +
            '</strong><small>' +
            escape(w.family) +
            ' · ' +
            escape(w.category) +
            ' · ' +
            fmt(w.rivenDisposition, 2) +
            '× disposition</small></button>',
        )
        .join('') +
      (matches.length > shown.length
        ? '<p class="hint">Showing 30 matches. Refine your search.</p>'
        : '');
    if (!shown.length) results.innerHTML = '<p class="empty">No matching weapons.</p>';
    results.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    for (const button of results.querySelectorAll('[data-riven-weapon]')) {
      button.onmousedown = (e) => e.preventDefault();
      button.onclick = () => selectRivenWeapon(button.dataset.rivenWeapon);
    }
  }
  function closeRivenWeaponSearch() {
    const results = $('riven-weapon-results');
    results.hidden = true;
    $('riven-weapon-search').setAttribute('aria-expanded', 'false');
  }
  function selectRivenWeapon(id) {
    const w = get(db, 'weapons', id);
    if (!rivenDraft || !w || w.rivenDisposition == null) return;
    if (
      rivenDraft.attributes.some((a) => a.spliced) &&
      (w.family !== rivenDraft.family || rivenCategory(w) !== rivenDraft.category)
    ) {
      notify('Remove the splice before changing the weapon family.', true);
      return;
    }
    rivenSelectedWeaponId = w.id;
    rivenDraft.family = w.family;
    rivenDraft.weaponId = w.id;
    rivenDraft.category = rivenCategory(w);
    closeRivenWeaponSearch();
    renderRivenForm();
  }
  function renderRivenWeaponSummary(w) {
    const host = $('riven-weapon-summary');
    if (!host) return;
    if (!w) {
      host.innerHTML = '<p class="hint">No compatible weapon model is selected.</p>';
      return;
    }
    const variants = records(db, 'weapons')
      .filter(
        (model) =>
          model.family === w.family &&
          model.rivenDisposition != null &&
          Number.isFinite(Number(model.rivenDisposition)),
      )
      .sort(
        (left, right) =>
          right.rivenDisposition - left.rivenDisposition || left.name.localeCompare(right.name),
      );
    const highest = variants[0]?.rivenDisposition,
      leaders = variants
        .filter((model) => model.rivenDisposition === highest)
        .map((model) => model.name)
        .join(', ');
    const comparison =
      '<div class="riven-family-dispositions"><h3>Riven disposition across ' +
      escape(w.family) +
      ' models</h3><p class="hint">Highest: <strong>' +
      escape(leaders) +
      '</strong> · ' +
      fmt(highest || 0, 2) +
      '×</p><div class="tablewrap"><table><thead><tr><th>Weapon model</th><th class="numeric">Disposition</th><th>Comparison</th></tr></thead><tbody>' +
      variants
        .map(
          (model) =>
            '<tr' +
            (model.id === w.id ? ' class="selected"' : '') +
            '><td>' +
            escape(model.name) +
            (model.id === w.id ? ' · selected' : '') +
            '</td><td class="numeric">' +
            fmt(model.rivenDisposition, 2) +
            '×</td><td>' +
            (model.rivenDisposition === highest ? '<span class="highest">Highest</span>' : '') +
            '</td></tr>',
        )
        .join('') +
      '</tbody></table></div></div>';
    const analysis = weaponBaseAnalysis(w),
      modes = [analysis?.base, analysis?.incarnon].filter(Boolean),
      modeBadge = (m) =>
        '<span class="badge ' +
        (m.use === 'Status' ? 'good' : m.use === 'Crit' ? 'warn' : '') +
        '"><strong>' +
        escape(m.label) +
        ':</strong> ' +
        escape(m.use) +
        '</span>',
      modeReasons = modes
        .map(
          (m) =>
            '<span><strong>' +
            escape(m.label) +
            ' — ' +
            escape(m.use) +
            ':</strong> ' +
            escape(m.reason) +
            '</span>',
        )
        .join('<br>'),
      img = w.image ? recordImage(w, 'riven-weapon', 'images/placeholder.svg') : '',
      attacks = arr(w.attacks)
        .map((a) => {
          const damage = Object.values(a.damage || {}).reduce((n, v) => n + (Number(v) || 0), 0);
          return (
            '<tr><td>' +
            escape(a.name) +
            (a.componentOf ? ' · component' : '') +
            '</td><td class="numeric">' +
            fmt(damage) +
            '</td><td class="numeric">' +
            pct(a.statusChance || 0) +
            '</td><td class="numeric">' +
            fmt(a.fireRate || 0, 2) +
            '</td><td class="numeric">' +
            pct(a.critChance || 0) +
            '</td><td class="numeric">' +
            fmt(a.critMultiplier || 1, 2) +
            '×</td></tr>'
          );
        })
        .join('');
    host.innerHTML =
      '<div class="riven-weapon-summary">' +
      img +
      '<div><div class="statline spacer"><span class="badge">' +
      escape(w.category || w.type || 'Weapon') +
      '</span>' +
      modes.map(modeBadge).join('') +
      '<span class="badge">' +
      fmt(w.rivenDisposition, 2) +
      '× Riven disposition</span><span class="badge">Magazine ' +
      fmt(w.magazine || 0, 0) +
      ' · Reload ' +
      fmt(w.reload || 0, 2) +
      's</span></div><div class="tablewrap spacer"><table><thead><tr><th>Attack</th><th class="numeric">Base damage</th><th class="numeric">Status</th><th class="numeric">Fire rate</th><th class="numeric">Crit chance</th><th class="numeric">Crit multiplier</th></tr></thead><tbody>' +
      attacks +
      '</tbody></table></div><p class="hint riven-analysis-reason">' +
      (modeReasons ||
        escape(
          analysis?.reason || 'Crit is the fallback when no direct attack profile is available.',
        )) +
      '</p>' +
      comparison +
      '</div></div>';
  }
  function renderRivenForm() {
    if (!rivenDraft) return;
    renderRivenList();
    $('riven-weapon-search').value = get(db, 'weapons', rivenDraft.weaponId)?.name || '';
    closeRivenWeaponSearch();
    $('riven-name').value = rivenDraft.name;
    $('riven-family').value = rivenDraft.family;
    $('riven-weapon-model').value = rivenDraft.weaponId || '';
    $('riven-layout').value = rivenDraft.layout;
    $('riven-rank').value = rivenDraft.rank;
    $('riven-polarity').value = rivenDraft.polarity;
    $('riven-mastery').value = rivenDraft.mastery;
    renderRivenAttributes();
  }
  function rivenWeaponForDraft(weapons, riven, chosen) {
    const compatible = arr(weapons).filter(
      (w) =>
        w.family === riven.family &&
        rivenCategory(w) === riven.category &&
        w.rivenDisposition != null,
    );
    return (
      compatible.find((w) => w.id === riven.weaponId) ||
      compatible.find((w) => w.id === chosen?.id) ||
      compatible[0]
    );
  }
  function rivenPreviewWeapon(riven) {
    return rivenWeaponForDraft(records(db, 'weapons'), riven, chosenWeapon());
  }
  function rivenTraitDescription(id, name, spliced) {
    const descriptions = {
      damage: 'Increases the weapon’s base damage, which scales the damage dealt by its attacks.',
      critChance: 'Increases the chance for a hit to become a critical hit.',
      critDamage: 'Increases the damage multiplier applied by critical hits.',
      multishot:
        'Adds extra projectiles or pellets per shot without consuming additional ammo per projectile.',
      fireRate:
        'Increases shots per second or melee attack speed; faster attacks also apply status effects more often.',
      statusChance:
        'Increases the chance for damage instances to apply a status effect. Damage weighting determines which effect is selected.',
      statusDamage:
        'Increases the damage dealt by damaging status-effect ticks such as Slash, Heat, Toxin, and Gas.',
      statusDuration:
        'Extends the duration of duration-based status effects and the tick window for damage-over-time effects.',
      reload: 'Improves reload speed.',
      magazine: 'Increases magazine capacity.',
      ammo: 'Increases maximum ammunition capacity.',
      punchThrough:
        'Lets projectiles pass through enemies or objects, enabling hits on targets behind them.',
      range: 'Increases melee attack reach.',
      initialCombo: 'Adds starting melee combo without requiring prior hits.',
      comboDuration: 'Extends the time before melee combo count decays.',
      heavyEfficiency: 'Reduces combo consumed by heavy attacks.',
      finisher: 'Increases damage dealt by finishers.',
      slideCrit: 'Increases melee critical chance while sliding.',
      extraCombo: 'Adds a chance for melee hits to grant additional combo count.',
      negativeCombo: 'Adds a chance for melee hits to reduce combo count.',
      projectileSpeed: 'Increases projectile travel speed.',
      recoil: 'Reduces weapon recoil.',
      zoom: 'Changes aim zoom; positive zoom can narrow the field of view.',
      weakDamage: 'Increases direct damage when a projectile hits an enemy weakpoint.',
      weakCrit:
        'Adds critical chance when a projectile hits an enemy weakpoint; it does not increase the chance to hit the weakpoint.',
      ammoEfficiency:
        'Reduces ammunition consumed by shots, increasing the number of effective projectiles before reloading.',
      holsterReload: 'Reloads the weapon magazine while it is holstered.',
      heavyAttackDamage: 'Increases melee heavy-attack damage.',
      windUp: 'Reduces melee heavy-attack windup time.',
      parryAngle: 'Increases the angle from which melee attacks can be parried.',
      slamDamage: 'Increases melee slam attack damage.',
    };
    if (descriptions[id]) return descriptions[id];
    if (id.startsWith('element:'))
      return (
        'Adds ' +
        id.slice(8) +
        ' damage to the weapon. Element order affects combinations and can change the status effects applied.'
      );
    if (id.startsWith('faction:'))
      return (
        'Increases weapon damage against ' +
        id.slice(8) +
        ' enemies. Choose a faction that matches the content you play.'
      );
    if (id.startsWith('faction'))
      return 'Adds damage against the faction named by this spliced trait.';
    if (id.startsWith('element'))
      return 'Adds the combined elemental damage type named by this spliced trait.';
    return (
      (spliced ? 'Spliced Riven trait: ' : 'Riven trait: ') +
      name +
      '. See the linked reference for its detailed mechanics.'
    );
  }
  function rivenTraitGrade(id, use) {
    const common = id === 'damage' || id === 'multishot' || id.startsWith('faction:');
    if (common) return 'good';
    if (id === 'weakDamage') return 'neutral';
    if (Array.isArray(use)) {
      const grades = use.map((lean) => rivenTraitGrade(id, lean));
      return grades.includes('good') ? 'good' : grades.includes('neutral') ? 'neutral' : 'bad';
    }
    if (use === 'Status') {
      if (
        ['statusChance', 'statusDamage', 'statusDuration', 'fireRate'].includes(id) ||
        id.startsWith('element:')
      )
        return 'good';
      if (['critChance', 'critDamage', 'weakCrit', 'slideCrit'].includes(id)) return 'bad';
    } else {
      if (['critChance', 'critDamage', 'weakCrit', 'slideCrit'].includes(id)) return 'good';
      if (['statusChance', 'statusDamage', 'statusDuration'].includes(id)) return 'neutral';
      if (id.startsWith('element:')) return 'neutral';
    }
    return 'bad';
  }
  function rivenTraitWikiLinks(id, spliced) {
    if (spliced)
      return [
        ['Riven Splicer', 'https://wiki.warframe.com/w/Riven_Splicer'],
        ...(id === 'weakDamage' || id === 'weakCrit'
          ? [['Enemy Body Parts', 'https://wiki.warframe.com/w/Enemy_Body_Parts']]
          : id === 'statusDamage'
            ? [['Status Effect', 'https://wiki.warframe.com/w/Status_Effect']]
            : []),
      ];
    if (id === 'weakDamage' || id === 'weakCrit')
      return [['Enemy Body Parts', 'https://wiki.warframe.com/w/Enemy_Body_Parts']];
    if (['statusChance', 'statusDamage', 'statusDuration'].includes(id))
      return [['Status Effect', 'https://wiki.warframe.com/w/Status_Effect']];
    if (id.startsWith('element:') || id.startsWith('faction:'))
      return [['Damage', 'https://wiki.warframe.com/w/Damage']];
    return [['Riven Mods', 'https://wiki.warframe.com/w/Riven_Mods']];
  }
  function rivenTraitRangeSummary(stat, w, table, draft = rivenDraft) {
    const ranges = [];
    if (!draft) return 'Roll range unavailable.';
    if (!table.positiveOnly) {
      const range = rivenRollRange(db, draft, { stat, negative: true, quality: 1 }, w);
      if (range)
        ranges.push(
          'Negative: ' + rivenValueText(stat, range.min) + ' to ' + rivenValueText(stat, range.max),
        );
    }
    if (!table.negativeOnly) {
      const range = rivenRollRange(db, draft, { stat, negative: false, quality: 1 }, w);
      if (range)
        ranges.push(
          'Positive: ' + rivenValueText(stat, range.min) + ' to ' + rivenValueText(stat, range.max),
        );
    }
    return ranges.length ? ranges.join(' · ') : 'Roll range unavailable for this weapon category.';
  }
  function rivenSplicedTraitRangeSummary(stat, w, draft = rivenDraft) {
    if (!draft) return 'TBC estimate unavailable.';
    const recipe = get(db, 'riven-splices', stat),
      base = recipe?.baseValues?.[draft.category],
      layout = ruleOf(db).rivenLayouts[draft.layout];
    if (base == null || !layout) return 'TBC estimate unavailable for this weapon category.';
    const factor = base * layout.positive * ((draft.rank + 1) / 9) * (w.rivenDisposition ?? 0),
      min = factor * 0.9,
      max = factor * 1.1;
    return (
      'TBC · indication only: ' +
      rivenValueText(stat, min) +
      ' to ' +
      rivenValueText(stat, max) +
      ' (assumes the standard 90–110% roll spread applies).'
    );
  }
  function renderRivenTraitTile(item, w, use, draft) {
    const table = item.spliced ? null : get(db, 'riven-tables', item.id),
      name = item.name || item.id,
      range = table
        ? rivenTraitRangeSummary(item.id, w, table, draft)
        : rivenSplicedTraitRangeSummary(item.id, w, draft),
      links = rivenTraitWikiLinks(item.id, item.spliced);
    return (
      '<div class="trait-tile ' +
      rivenTraitGrade(item.id, use) +
      '" tabindex="0" aria-label="' +
      escape(name) +
      '; hover or focus for details"><span>' +
      escape(name) +
      '</span><div class="trait-popover"><strong>' +
      escape(name) +
      (item.spliced ? ' · Spliced · TBC' : '') +
      '</strong><p>' +
      escape(rivenTraitDescription(item.id, name, item.spliced)) +
      '</p><p class="trait-range"><strong>' +
      (item.spliced
        ? 'Provisional min–max · indication only:'
        : 'Min–max at rank ' +
          draft.rank +
          ' and ' +
          fmt(w.rivenDisposition, 2) +
          '× disposition:') +
      '</strong><br>' +
      escape(range) +
      '</p><p class="trait-link-list">' +
      links
        .map(
          ([label, url]) =>
            '<a href="' +
            escape(safeURL(url)) +
            '" target="_blank" rel="noopener">' +
            escape(label) +
            ' ↗</a>',
        )
        .join(' · ') +
      '</p></div></div>'
    );
  }
  function renderRivenTraitGrid(w, use, category, draft) {
    const target = { ...draft, family: w.family, category },
      ordinary = records(db, 'riven-tables')
        .filter(
          (t) =>
            rivenTraitAvailable(db, target, t, false) || rivenTraitAvailable(db, target, t, true),
        )
        .map((t) => ({ id: t.id, name: t.name, spliced: false })),
      spliced = records(db, 'riven-splices')
        .filter((t) => t.categories.includes(category))
        .map((t) => ({ id: t.id, name: t.name, spliced: true }));
    return (
      '<div class="trait-grid" aria-label="Riven trait guide">' +
      ordinary.map((t) => renderRivenTraitTile(t, w, use, draft)).join('') +
      spliced.map((t) => renderRivenTraitTile(t, w, use, draft)).join('') +
      '</div>'
    );
  }
  function renderRivenRecommendations(w, category = rivenDraft?.category || rivenCategory(w)) {
    const host = $('riven-recommendations');
    if (!host) return;
    if (!w) {
      host.innerHTML = '<p class="hint">Select a weapon model to see its trait guide.</p>';
      return;
    }
    category = category || rivenCategory(w);
    const guideDraft = rivenDraft || { category, layout: '3p1n', rank: 8 },
      a = weaponBaseAnalysis(w),
      modes = [a?.base, a?.incarnon].filter(Boolean);
    if (!modes.length)
      modes.push({
        label: 'Base',
        use: 'Crit',
        leanings: ['Crit'],
        reason: 'Crit is the fallback when no direct attack profile is available.',
      });
    if (!modes.some((m) => m.label.toLowerCase() === rivenGuideMode))
      rivenGuideMode = modes.some((m) => m.label === 'Base')
        ? 'base'
        : modes[0].label.toLowerCase();
    const mode = modes.find((m) => m.label.toLowerCase() === rivenGuideMode) || modes[0],
      use = mode.use,
      leanings = mode.leanings || [use],
      recommendation = mode.dual
        ? 'Both paths are viable for this mode. Crit builds favor critical chance and critical damage; Status builds favor status chance, status damage, and useful elemental damage. Multishot, base damage, and faction damage support either path.'
        : use === 'Status'
          ? 'Prioritize multishot, status chance, and useful elemental damage; add faction damage and fire rate for the target.'
          : 'Prioritize critical chance, critical damage, and multishot, then add base and faction damage.',
      grades =
        '<span><i class="trait-dot good"></i>Recommended</span><span><i class="trait-dot neutral"></i>Neutral</span><span><i class="trait-dot bad"></i>Lower priority</span>',
      profiles = (mode.profiles || [])
        .map(
          (p) =>
            '<span class="badge">' +
            escape(p.attack.name) +
            ': ' +
            pct(p.statusChance) +
            ' status · ' +
            pct(p.critChance) +
            ' crit × ' +
            fmt(p.critMultiplier, 2) +
            '×</span>',
        )
        .join(' '),
      selector =
        modes.length > 1
          ? '<label class="riven-mode-select">Build mode <select id="riven-guide-mode">' +
            modes
              .map(
                (m) =>
                  '<option value="' +
                  m.label.toLowerCase() +
                  '"' +
                  (m === mode ? ' selected' : '') +
                  '>' +
                  escape(m.label) +
                  '</option>',
              )
              .join('') +
            '</select></label>'
          : '';
    host.innerHTML =
      '<div class="riven-trait-guide"><div class="panelhead"><h3>Riven trait guide</h3><span class="badge">' +
      escape(w.name) +
      ' · ' +
      escape(mode.label) +
      ' ' +
      escape(use) +
      ' leaning</span></div>' +
      selector +
      '<p class="hint">' +
      escape(mode.label) +
      ' recommendation: ' +
      escape(mode.reason) +
      ' ' +
      profiles +
      ' <strong>Suggested ' +
      escape(use) +
      ' build:</strong> ' +
      escape(recommendation) +
      '</p><div class="trait-legend">' +
      grades +
      '</div>' +
      renderRivenTraitGrid(w, leanings, category, guideDraft) +
      '</div>';
    const modeSelect = $('riven-guide-mode');
    if (modeSelect)
      modeSelect.onchange = () => {
        rivenGuideMode = modeSelect.value;
        renderRivenRecommendations(w, category);
      };
  }
  function rivenValueText(stat, value) {
    if (stat.startsWith('faction:')) return fmt(1 + value, 2) + '×';
    if (stat === 'parryAngle') return (value >= 0 ? '+' : '') + fmt(value, 2) + '°';
    return ['range', 'punchThrough', 'initialCombo', 'comboDuration', 'parryAngle'].includes(stat)
      ? (value >= 0 ? '+' : '') + fmt(value, 2)
      : (value >= 0 ? '+' : '') + pct(value);
  }
  function renderRivenAttributes() {
    if (!rivenDraft) return;
    if (!rivenDraft.weaponId) {
      $('riven-family').disabled = false;
      $('riven-layout').disabled = false;
      $('riven-attributes').innerHTML =
        '<p class="hint">Select a weapon to set Riven attributes and roll values.</p>';
      $('riven-preview').innerHTML = '';
      $('riven-disposition').textContent = 'NO WEAPON SELECTED';
      $('riven-splicer').hidden = true;
      $('save-riven').disabled = true;
      return;
    }
    $('riven-splicer').hidden = false;
    $('save-riven').disabled = false;
    rivenDraft.attributes = normalizeRivenAttributes(db, rivenDraft);
    $('save-riven').disabled = rivenDraft.attributes.some((attribute) => !attribute.stat);
    const w = rivenPreviewWeapon(rivenDraft),
      scale = (w?.rivenDisposition || 0) * ((rivenDraft.rank + 1) / 9);
    $('riven-layout').disabled = rivenDraft.attributes.some((a) => a.spliced);
    $('riven-family').disabled = rivenDraft.attributes.some((a) => a.spliced);
    $('riven-attributes').innerHTML = rivenDraft.attributes
      .map((a, i) => {
        if (a.spliced) {
          const recipe = get(db, 'riven-splices', a.stat);
          return (
            '<div class="rivenrow"><label>Positive ' +
            (i + 1) +
            ' · 🔒 Spliced<strong title="Spliced traits stay locked until the splice is removed">' +
            escape(recipe?.name || a.stat) +
            '</strong></label><label>' +
            escape(splicedInputUnit(a.stat)) +
            ' shown in game<input data-riven-spliced-value="' +
            i +
            '" type="number" min="0.01" step="0.1" value="' +
            fmt(splicedFromEffect(a.stat, a.valueAtMaxRankDisposition1 * scale), 3).replaceAll(
              ',',
              '',
            ) +
            '"></label><span class="badge good" title="Locked spliced trait">🔒</span></div>'
          );
        }
        const range = rivenRollRange(db, rivenDraft, a, w),
          quality = a.quality * 100,
          qualityClass = rivenQualityClass(a.quality),
          shown = range ? rivenShownNumber(a.stat, range.current) : 0;
        return (
          '<div class="rivenrow"><label>' +
          (a.negative ? 'Negative' : 'Positive ' + (i + 1)) +
          '<select data-riven-stat="' +
          i +
          '">' +
          options(rivenSelectableTraits(db, rivenDraft, i), a.stat) +
          '</select></label><label>Value shown in game<input data-riven-game-value="' +
          i +
          '" type="number" step="any" value="' +
          fmt(shown, 3).replaceAll(',', '') +
          '"></label><span class="riven-quality ' +
          qualityClass +
          '" data-riven-quality-indicator="' +
          i +
          '" aria-live="polite"><small>Roll quality</small><b>' +
          fmt(quality, 1) +
          '%</b></span></div>'
        );
      })
      .join('');
    for (const el of document.querySelectorAll('[data-riven-stat]'))
      el.onchange = () => {
        const index = +el.dataset.rivenStat;
        if (!rivenSelectableTraits(db, rivenDraft, index).some((table) => table.id === el.value)) {
          notify('That trait is unavailable or already selected on this Riven.', true);
          renderRivenAttributes();
          return;
        }
        rivenDraft.attributes[index].stat = el.value;
        renderRivenAttributes();
      };
    for (const el of document.querySelectorAll('[data-riven-game-value]'))
      el.oninput = () => {
        const index = +el.dataset.rivenGameValue,
          attribute = rivenDraft.attributes[index],
          quality = rivenQualityFromDisplayed(db, rivenDraft, attribute, w, el.value),
          indicator = document.querySelector('[data-riven-quality-indicator="' + index + '"]');
        if (!indicator) return;
        if (quality == null || quality < 0.9 - 1e-10 || quality > 1.1 + 1e-10) {
          indicator.className = 'riven-quality invalid';
          indicator.querySelector('b').textContent = 'Outside range';
          return;
        }
        attribute.quality = clamp(quality, 0.9, 1.1);
        const tier = rivenQualityClass(attribute.quality);
        indicator.className = 'riven-quality ' + tier;
        indicator.querySelector('b').textContent = fmt(attribute.quality * 100, 1) + '%';
        renderRivenPreview();
      };
    for (const el of document.querySelectorAll('[data-riven-spliced-value]'))
      el.onchange = () => {
        const value = splicedToEffect(
          rivenDraft.attributes[+el.dataset.rivenSplicedValue].stat,
          el.value,
        );
        if (!Number.isFinite(value) || value <= 0 || !scale) {
          notify('Enter a positive spliced value for a compatible weapon.', true);
          return;
        }
        rivenDraft.attributes[+el.dataset.rivenSplicedValue].valueAtMaxRankDisposition1 =
          value / scale;
        renderRivenPreview();
      };
    renderRivenSplicer();
    renderRivenPreview();
  }
  function renderRivenSplicer() {
    if (!rivenDraft) return;
    const hasSplice = rivenDraft.attributes.some((a) => a.spliced),
      choices = hasSplice ? [] : compatibleSplices(db, rivenDraft),
      recipes = records(db, 'riven-splices').filter((r) =>
        r.categories.includes(rivenDraft.category),
      ),
      slots = rivenDraft.attributes
        .map((a, i) => ({ a, i }))
        .filter(({ a }) => !a.negative && !a.spliced);
    $('riven-splice-choice').innerHTML =
      choices
        .map(
          ({ recipe, left, right, pair }) =>
            '<option value="' +
            escape(recipe.id) +
            ':' +
            left +
            ':' +
            right +
            '">' +
            escape(recipe.name) +
            ' · ' +
            escape(pair.map((id) => get(db, 'riven-tables', id)?.name || id).join(' + ')) +
            '</option>',
        )
        .join('') || '<option value="">No compatible trait pair</option>';
    $('riven-existing-slot').innerHTML = slots
      .map(({ i }) => '<option value="' + i + '">Positive ' + (i + 1) + '</option>')
      .join('');
    $('riven-existing-trait').innerHTML = recipes
      .map((r) => '<option value="' + escape(r.id) + '">' + escape(r.name) + '</option>')
      .join('');
    $('apply-riven-splice').disabled = !choices.length;
    $('add-existing-splice').disabled = hasSplice || !slots.length;
    $('remove-riven-splice').disabled = !hasSplice;
    $('riven-splice-message').textContent = hasSplice
      ? '🔒 The spliced trait remains locked. Remove splice before changing its trait or layout.'
      : choices.length
        ? 'Choose a recipe, then enter the percentage shown in game. The ordinary replacement can be edited afterward.'
        : 'Choose two compatible ordinary traits to enable a recipe, or enter an existing spliced Riven.';
  }
  function renderRivenPreview() {
    const w = rivenPreviewWeapon(rivenDraft);
    $('riven-disposition').textContent = w
      ? w.name + ' · ' + fmt(w.rivenDisposition, 2) + '×'
      : 'NO COMPATIBLE WEAPON';
    renderRivenRecommendations(w, rivenDraft?.category);
    if (!w) {
      $('riven-preview').innerHTML =
        '<p class="error">Choose a category that matches the weapon family.</p>';
      return;
    }
    const normalized = rivenEffects(db, rivenDraft, { ...w, rivenDisposition: 1 }),
      final = rivenEffects(db, rivenDraft, w);
    $('riven-preview').innerHTML =
      '<div class="riven-card"><h3>' +
      escape(rivenDraft.name) +
      '</h3><div class="tablewrap"><table><thead><tr><th>Trait</th><th>Min</th><th>Current</th><th>Max</th><th>Roll quality</th><th>At disposition 1.0</th></tr></thead><tbody>' +
      final
        .map((e, i) => {
          const a = rivenDraft.attributes[i],
            range = a.spliced
              ? splicedRivenRollRange(db, rivenDraft, a, w)
              : rivenRollRange(db, rivenDraft, a, w),
            name = get(db, a.spliced ? 'riven-splices' : 'riven-tables', a.stat)?.name || a.stat,
            quality = a.spliced ? range?.quality : a.quality;
          return (
            '<tr><td>' +
            escape(name) +
            (a.spliced
              ? ' <span title="Locked spliced trait; provisional range" aria-label="Locked spliced trait; provisional range">🔒 Spliced · TBC</span>'
              : '') +
            '</td><td>' +
            (range
              ? (a.spliced ? 'TBC · ' : '') + rivenValueText(e.stat, range.min)
              : 'Range unavailable') +
            '</td><td>' +
            rivenValueText(e.stat, e.value) +
            '</td><td>' +
            (range
              ? (a.spliced ? 'TBC · ' : '') + rivenValueText(e.stat, range.max)
              : 'Range unavailable') +
            '</td><td>' +
            (range
              ? '<span class="riven-quality ' +
                rivenQualityClass(quality) +
                '" title="' +
                (a.spliced ? 'TBC indication only; assumes standard 90–110% roll spread.' : '') +
                '">' +
                (a.spliced ? 'TBC · ' : '') +
                fmt(quality * 100, 1) +
                '%</span>'
              : '<span class="riven-quality unknown">Unknown range</span>') +
            '</td><td>' +
            rivenValueText(e.stat, normalized[i].value) +
            '</td></tr>'
          );
        })
        .join('') +
      '</tbody></table></div><p class="hint">Enter the signed value shown in game, including disposition and Riven rank. Roll quality is red at 90–<95%, amber at 95–<105%, and green at 105–110%. Every spliced-trait range and quality is marked <strong>TBC</strong>: an indication only, assuming the standard 90–110% Riven spread and layout/disposition scaling apply.</p></div>';
  }
  function applyRivenSplice() {
    if (!rivenDraft) return;
    const [recipe, left, right] = $('riven-splice-choice').value.split(':');
    if (!recipe) return;
    const shown = prompt(
      'Enter the spliced ' +
        splicedInputUnit(recipe) +
        ' shown in game for ' +
        (rivenPreviewWeapon(rivenDraft)?.name || 'this weapon') +
        ':',
    );
    if (shown === null) return;
    try {
      rivenDraft = spliceRiven(
        db,
        rivenDraft,
        recipe,
        +left,
        +right,
        shown,
        rivenPreviewWeapon(rivenDraft),
      );
      renderRivenAttributes();
    } catch (e) {
      notify(e.message, true);
    }
  }
  function addExistingRivenSplice() {
    if (!rivenDraft || rivenDraft.attributes.some((a) => a.spliced)) return;
    const index = +$('riven-existing-slot').value,
      recipe = get(db, 'riven-splices', $('riven-existing-trait').value),
      w = rivenPreviewWeapon(rivenDraft);
    if (
      !recipe ||
      !recipe.categories.includes(rivenDraft.category) ||
      !rivenDraft.attributes[index] ||
      rivenDraft.attributes[index].negative ||
      !w
    ) {
      notify('Choose a compatible positive trait and weapon.', true);
      return;
    }
    const shown = prompt(
      'Enter the spliced ' + splicedInputUnit(recipe.stat) + ' shown in game for ' + w.name + ':',
    );
    if (shown === null) return;
    const value = splicedToEffect(recipe.stat, shown),
      scale = w.rivenDisposition * ((rivenDraft.rank + 1) / 9);
    if (!Number.isFinite(value) || value <= 0 || !scale) {
      notify('Enter a positive spliced percentage.', true);
      return;
    }
    rivenDraft.attributes[index] = {
      stat: recipe.stat,
      spliced: true,
      negative: false,
      valueAtMaxRankDisposition1: value / scale,
    };
    renderRivenAttributes();
  }
  function saveRiven() {
    try {
      if (!rivenDraft) return false;
      const weapon = get(db, 'weapons', rivenDraft.weaponId);
      if (
        !weapon ||
        weapon.family !== rivenDraft.family ||
        rivenCategory(weapon) !== rivenDraft.category
      )
        throw Error('Select a weapon before saving this Riven.');
      rivenDraft.name = $('riven-name').value.trim() || 'Custom Riven';
      const candidate = clone(db),
        i = candidate.rivens.records.findIndex((r) => r.id === rivenEditing);
      if (i >= 0) candidate.rivens.records[i] = clone(rivenDraft);
      else candidate.rivens.records.push(clone(rivenDraft));
      applyDatabase(candidate);
      rivenDraft = null;
      rivenEditing = '';
      rivenSelectedWeaponId = '';
      persist();
      renderRivenList();
      notify('Riven saved.');
      return true;
    } catch (e) {
      notify(e.message, true);
      return false;
    }
  }
  function renderEnemySelectorResults(query, open) {
    const input = $('enemy-select-search'),
      results = $('enemy-select-results');
    if (!input || !results) return;
    const q = String(query || '')
        .trim()
        .toLowerCase(),
      matches = records(db, 'enemies')
        .filter((e) => {
          const faction = get(db, 'factions', e.factionId)?.name || e.factionId;
          return (
            !q ||
            [e.name, e.type || '', faction, e.id].some((value) =>
              String(value).toLowerCase().includes(q),
            )
          );
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
      shown = matches.slice(0, 30);
    results.innerHTML = shown.length
      ? shown
          .map(
            (e) =>
              '<button type="button" class="enemy-select-option" role="option" aria-selected="false" data-enemy-option="' +
              escape(e.id) +
              '"><strong>' +
              escape(e.name) +
              '</strong><small>' +
              escape(e.type || 'Enemy') +
              ' · ' +
              escape(get(db, 'factions', e.factionId)?.name || e.factionId) +
              '</small></button>',
          )
          .join('')
      : '<div class="enemy-select-empty">No enemies match this search.</div>';
    results.hidden = !open;
    input.setAttribute('aria-expanded', String(!!open));
    for (const option of results.querySelectorAll('[data-enemy-option]')) {
      option.onmousedown = (event) => event.preventDefault();
      option.onclick = () => {
        state.enemyId = option.dataset.enemyOption;
        input.blur();
        fillEnemySelector(false);
        schedule();
      };
    }
    if (open && matches.length > shown.length)
      results.insertAdjacentHTML(
        'beforeend',
        '<div class="enemy-select-empty">Showing ' +
          shown.length +
          ' of ' +
          matches.length +
          ' matches. Refine your search.</div>',
      );
  }
  function fillEnemySelector(keepQuery = false) {
    const input = $('enemy-select-search'),
      selected = get(db, 'enemies', state.enemyId);
    if (!input || !selected) return;
    if (!keepQuery || document.activeElement !== input) input.value = selected.name;
    $('selected-enemy-label').textContent =
      'Selected target: ' +
      selected.name +
      ' · ' +
      (get(db, 'factions', selected.factionId)?.name || selected.factionId);
    renderEnemySelectorResults(input.value, !!keepQuery && document.activeElement === input);
  }
  function fillCatalogControls() {
    const w = chosenWeapon();
    $('weapon-category').innerHTML = options(
      [...new Set(records(db, 'weapons').map((w) => w.category))]
        .sort()
        .map((c) => ({ id: c, name: c })),
      w?.category,
    );
    $('database-category').innerHTML = options(
      CATEGORIES.map((c) => ({ id: c, name: c.replaceAll('-', ' ') })),
      $('database-category').value || 'weapons',
    );
    $('faction-filter').innerHTML = options(
      records(db, 'factions').sort((a, b) => a.name.localeCompare(b.name)),
      $('faction-filter').value,
      'All factions',
    );
    fillEnemySelector();
    $('snapshot-label').textContent = 'SNAPSHOT ' + db.weapons.snapshot;
    $('catalog-summary').textContent =
      records(db, 'weapons').length +
      ' weapons · ' +
      records(db, 'enemies').length +
      ' enemies · ' +
      records(db, 'mods').length +
      ' mods · ' +
      records(db, 'arcanes').length +
      ' arcanes';
    fillWeaponList();
  }
  function showGuide() {
    const references = [
      'Damage',
      'Damage/Calculation',
      'Enemy_Level_Scaling',
      'Armor',
      'Enemy_Body_Parts',
      'Status_Effect',
      'Riven_Mods',
      'Riven_Splicer',
      'Module:Weapons/data',
      'Module:Enemies/data',
      'Module:Mods/data',
      'Module:Arcane/data',
      'Module:Modular/data',
    ];
    const referenceLinks = references
      .map(
        (page) =>
          `<a href="https://wiki.warframe.com/w/${escape(page.replaceAll(' ', '_'))}" ` +
          `target="_blank" rel="noopener">${escape(page)}</a>`,
      )
      .join(' · ');

    $('guide-content').innerHTML = `
      <p class="footnote">
        Open index.html with app.js and styles.css beside it. The calculator needs no server or
        installation. Artwork loads online by default unless you download it locally. Create a
        weapon from its category, add mods and ranked arcanes, then save a named build in your
        personal arsenal. The main selector shows saved builds only. Drag the enemy-level slider
        to recalculate. Inspect individual enemies for defense-layer and status results.
      </p>
      <h3>Keep your changes</h3>
      <p class="footnote">
        Category databases and edits are stored in IndexedDB. The active weapon build, session
        state and saved arsenal profiles stay in localStorage. Export arsenal.json to back up
        saved builds, Riven Workshop Rivens and their custom records, plus recorded progenitor
        weapon acquisition and bonus details; importing arsenal.json restores those personal
        records. Use Export Data to back up the working database as a ZIP, and Import Data to
        restore it in another browser. Connect the app/data folder to grant supported browsers
        access for online JSON sync.
      </p>
      <h3>Reading the numbers</h3>
      <p class="footnote">
        The distribution compares unmodded, Incarnon-enhanced and fully modded damage per
        projectile, before critical hits and multishot. Conditional evolution bonuses start
        inactive. Status probabilities show the chance of at least one weighted random proc per
        projectile, including status chance above 100%; forced and triggered procs are separate.
        Faction comparisons show body, weakpoint and headshot expected damage for the first and
        next attacks, with probabilistic Corrosive and timed Heat armor reduction. Reserve
        ammunition is unlimited, existing stack inputs are treated as maintained, and every
        projectile is assumed to connect. Explicitly linked same-time attack components, such as
        Burston Prime Incarnon radial damage, are summed; unlinked alt-fire modes, including
        Bubonico radial alt-fire, remain separate. Combined totals are withheld for incomplete
        mechanics or invalid builds. Uptime inputs blend conditional bonuses linearly and do not
        simulate buff timing. Enemy damage quantization is modeled. Projectile TTK compares six
        body/head hit mixes and includes expected status applications, damaging DoT ticks, and
        armor stripping from Corrosive and Heat. It excludes shield gating, crowd damage,
        Incarnon charge cycles and enemy phase transitions.
      </p>
      <h3>Catalog &amp; calculation coverage</h3>
      <p class="footnote">
        The bundled catalog is a 2026-10-11 snapshot of the wiki’s weapon, enemy, mod, arcane,
        modular and stance data modules. It retains unmodeled special mechanics and evolution
        choices with explicit limitations. This is a complete import of those source modules,
        not a claim that every special mechanic is solved. The Riven workshop supports published
        splice recipes and shows ordinary trait roll ranges. Spliced percentages are entered
        from the game; specialized utility traits retain explicit calculation limitations.
      </p>
      <h3>References</h3>
      <p class="footnote">${referenceLinks}</p>
      <p class="footnote">
        Wiki data © its contributors, used with attribution under CC BY-NC-SA 3.0. Warframe and
        associated names belong to Digital Extremes. See SOURCES.md for provenance and limitations.
      </p>`;
    $('guide').showModal();
  }

  function runChecks(testDb = db) {
    db = testDb;
    bundled = testDb;
    normalizeWeaponDatabase(testDb.weapons);
    const passed = [];
    const assert = (condition, name) => {
        if (!condition) throw Error(name);
        passed.push(name);
      },
      near = (a, b) => Math.abs(a - b) < 1e-7;
    try {
      const referenceWeapon =
          records(testDb, 'weapons').find((w) => w.name === 'Burston Prime') ||
          records(testDb, 'weapons')[0],
        editedWeapon = clone(referenceWeapon),
        damageType = Object.keys(editedWeapon.attacks[0].damage)[0],
        referenceDamage = editedWeapon.attacks[0].damage[damageType];
      editedWeapon.attacks[0].damage[damageType] = referenceDamage + 7;
      const restoredWeapon = completeOnlineRecord('weapons', editedWeapon, {
        id: referenceWeapon.id,
        name: referenceWeapon.name,
        attacks: clone(referenceWeapon.attacks),
      });
      assert(
        Array.isArray(restoredWeapon.limitations) &&
          Array.isArray(restoredWeapon.polarities) &&
          restoredWeapon.attacks[0].damage[damageType] === referenceDamage,
        'Force refresh restores a complete weapon from a partial online update',
      );
      const timed = ttkProjectileSchedule({ rate: 5, ms: 1, shots: null, reload: null }, 3),
        fractional = ttkProjectileSchedule({ rate: 5, ms: 1.5, shots: null, reload: null }, 2);
      assert(
        timed.length === 3 && near(timed[1].time, 0.2) && near(timed[2].time, 0.4),
        'TTK schedules five fire-rate shots per second starting at time zero',
      );
      assert(
        fractional.length === 2 && fractional[1].pelletWeight === 0.5,
        'TTK represents fractional multishot as an expected projectile',
      );
      assert(
        TTK_LOCATIONS.map((x) => x.id).join('|') === 'head|mix25|mix50|mix75|mix110|body' &&
          TTK_LOCATIONS.map((x) => x.name).join('|') ===
            '100% head/weak|75% head/weak : 25% body|50% head/weak : 50% body|25% head/weak : 75% body|1 head/weak : 10 body|100% body',
        'TTK columns sort from quickest head/weak hits to body hits with clear ratio labels',
      );
      const tooltipCell = ttkCellHTML({
        damage: 12,
        dotDamage: 3,
        armor: 4,
        overguard: 0,
        shield: 2,
        health: 8,
      });
      assert(
        tooltipCell.includes('<b>12</b>') &&
          tooltipCell.includes('Armor 4') &&
          !tooltipCell.includes('<small>Armor'),
        'TTK defense pools remain in hover details and stripped armor has an inline marker',
      );
      const stripCell = ttkCellHTML({
        damage: 12,
        armor: 0,
        overguard: 0,
        shield: 0,
        health: 8,
        armorStrippedAfter: true,
      });
      assert(
        stripCell.includes('>STRIP</em>') && stripCell.includes('Full armor strip chance 100%'),
        'TTK marks persistent full armor strip inline and on hover',
      );
      assert(
        combineElements({ impact: 100 }, [
          { type: 'heat', value: 90 },
          { type: 'cold', value: 90 },
          { type: 'toxin', value: 60 },
        ]).blast === 180,
        'Elemental slot order combines Heat + Cold into Blast',
      );
      assert(
        combineElements({ toxin: 50 }, [
          { type: 'cold', value: 90 },
          { type: 'heat', value: 90 },
        ]).blast === 180,
        'Innate primary element follows mod order',
      );
      const tiers = criticalTiers(2.4, 3);
      assert(
        tiers[0].tier === 2 && near(tiers[0].probability, 0.6) && tiers[1].tier === 3,
        'Critical tiers above 200%',
      );
      assert(
        modDrain({ baseDrain: 4, polarity: 'madurai' }, 5, 'madurai') === 5,
        'Matching polarity drain rounds upward',
      );
      assert(
        modDrain({ baseDrain: 4, polarity: 'madurai' }, 5, 'vazarin') === 12,
        'Mismatched polarity drain rounds upward',
      );
      assert(
        modDrain({ baseDrain: 4, polarity: 'madurai' }, 0, '') === 4 &&
          modDrain({ baseDrain: 4, polarity: 'madurai' }, 10, '') === 14,
        'Raw drain starts at base cost and adds one per fusion rank',
      );
      const rifleAura = get(testDb, 'mods', 'rifle-amp'),
        auraState = defaultState(testDb);
      auraState.weaponId = 'burston-prime';
      const noAuraDamage = calculateWeapon(testDb, auraState);
      auraState.aura = {
        id: rifleAura.id,
        rank: rifleAura.maxRank,
        polarity: rifleAura.polarity,
        stacks: 0,
        uptime: 100,
      };
      const rifleAuraDamage = calculateWeapon(testDb, auraState);
      assert(
        rifleAuraDamage.ordinary > noAuraDamage.ordinary &&
          auraCapacityGain(rifleAura, 5, rifleAura.polarity) === 14,
        'Ranked Rifle Amp boosts compatible weapons and matching Aura polarity doubles Warframe capacity gain',
      );
      const auraChoices = modChoices(get(testDb, 'weapons', 'burston-prime'), 'aura');
      assert(
        auraChoices.length > 0 &&
          auraChoices.every((mod) => mod.type === 'Aura') &&
          slotHTML(auraState.aura, 9, get(testDb, 'weapons', 'burston-prime'), [], 'aura').includes(
            'mod-top-icon aura',
          ),
        'Aura slot lists Aura mods and renders its icon',
      );
      const auraRoundTrip = normalizeBuild(testDb, clone(auraState));
      assert(
        auraRoundTrip.aura.id === rifleAura.id &&
          auraRoundTrip.aura.rank === 5 &&
          buildReferences(auraRoundTrip).some(
            ([category, id]) => category === 'mods' && id === rifleAura.id,
          ),
        'Aura selection and rank survive build normalization and export references',
      );
      const corrosiveAura = get(testDb, 'mods', 'corrosive-projection'),
        lancerAuraTarget = records(testDb, 'enemies').find((enemy) => enemy.name === 'Lancer');
      auraState.aura = { id: corrosiveAura.id, rank: 5, polarity: '', stacks: 0, uptime: 100 };
      const originalArmor = enemyStats(testDb, lancerAuraTarget, auraState.scenario).armor,
        projectedArmor = enemyStats(
          testDb,
          lancerAuraTarget,
          auraEnemyScenario(testDb, auraState),
        ).armor;
      assert(
        near(projectedArmor, originalArmor * 0.82),
        'Corrosive Projection reduces enemy armor in the damage and TTK scenario',
      );
      auraState.aura = { id: 'toxin-resistance', rank: 5, polarity: '', stacks: 0, uptime: 100 };
      assert(
        auraEffects(testDb, auraState).length === 0,
        'Toxin Resistance does not incorrectly add Toxin weapon damage',
      );
      const soma = get(testDb, 'weapons', 'soma-prime'),
        braton = get(testDb, 'weapons', 'braton'),
        vinquibus = get(testDb, 'weapons', 'vinquibus-primary'),
        vinquibusMelee = get(testDb, 'weapons', 'vinquibus-melee');
      assert(
        weaponSlotPolarities(soma)[0] === 'madurai' &&
          weaponSlotPolarities(soma)[1] === 'madurai' &&
          weaponSlotPolarities(soma).length === 8 &&
          weaponSlotPolarities(braton).every((p) => p === '') &&
          vinquibus?.polarities.includes('universal') &&
          normalizePolarity(vinquibusMelee?.stancePolarity) === 'universal',
        'Weapon defaults apply multiple, empty and Omni slot polarities',
      );
      const resourceState = defaultState(testDb),
        resourceWeapon = { category: 'Primary', polarities: [], exilusPolarity: '', maxRank: 30 };
      resourceState.slots.forEach((slot) => (slot.polarity = ''));
      resourceState.exilus.polarity = '';
      resourceState.slots[0].polarity = 'madurai';
      resourceState.slots[1].polarity = 'umbra';
      const needed = buildResources(resourceState, resourceWeapon, 31);
      assert(
        needed.forma === 2 &&
          needed.normalForma === 1 &&
          needed.umbraForma === 1 &&
          needed.catalystRequired &&
          needed.baseCapacity === 30,
        'Changed polarities count normal and Umbra Forma and excess drain requires a Catalyst',
      );
      resourceState.rank = 36;
      assert(
        buildResources(resourceState, { ...resourceWeapon, maxRank: 40 }, 31).forma === 3,
        'Forma needed to unlock rank above 30 is included without double counting changed slots',
      );
      const cryo = get(testDb, 'mods', 'cryo-rounds'),
        toxinMod = get(testDb, 'mods', 'infected-clip'),
        serration = get(testDb, 'mods', 'serration');
      assert(
        ['Common', 'Uncommon', 'Rare', 'Legendary'].every((rarity) =>
          records(testDb, 'arcanes').some((a) => a.rarity === rarity),
        ) &&
          ['Common', 'Uncommon', 'Rare', 'Legendary']
            .map((rarity) => modFrameAssets(arcaneRarity({ rarity })).backer)
            .join('|') ===
            'BronzeTopRightBacker.png|SilverTopRightBacker.png|GoldTopRightBacker.png|LegendaryTopRightBacker.png',
        'Arcane rank controls use the backer for each catalogued rarity',
      );
      const legacyArcaneDb = clone(testDb);
      delete legacyArcaneDb.arcanes.records[0].rarity;
      assert(
        restoreArcaneRarities(legacyArcaneDb) &&
          legacyArcaneDb.arcanes.records[0].rarity === testDb.arcanes.records[0].rarity &&
          !validateDatabase(legacyArcaneDb).length,
        'Older saved arcane records regain rarity from the bundled catalogue',
      );
      assert(
        modMatchesSearch(serration, 'damage') &&
          modMatchesSearch(serration, 'sErRaTiOn') &&
          !modMatchesSearch(serration, 'viral'),
        'Mod search matches names and descriptions without case sensitivity',
      );
      assert(
        modMatchesSearch(cryo, 'viral') &&
          modMatchesSearch(toxinMod, 'viral') &&
          modMatchesSearch(cryo, 'magnetic') &&
          !modMatchesSearch(serration, 'magnetic'),
        'Combined-element searches include both ingredient mods',
      );
      assert(
        modRankDescription(serration, 0).text.includes('+15%') &&
          modRankDescription(serration, 10).text.includes('+165%'),
        'Mod card descriptions follow selected rank',
      );
      const previewSlot = { id: 'serration', rank: 0, polarity: 'madurai', stacks: 0, uptime: 100 },
        previewCard = slotHTML(previewSlot, 0, get(testDb, 'weapons', 'burston-prime'), [
          { id: 'serration', name: 'Serration' },
        ]);
      assert(
        previewCard.includes('rarity-silver') &&
          previewCard.includes('mod-face-drain polarity-match') &&
          previewCard.includes('mod-polarity-icon') &&
          previewCard.includes('data-polarity-picker="0"') &&
          previewCard.includes('data-polarity-value="madurai"') &&
          previewCard.includes('aria-haspopup="listbox"') &&
          previewCard.includes('<svg viewBox=') &&
          previewCard.includes('data-mod-rank-step="-1"') &&
          previewCard.includes('data-mod-rank-step="1"') &&
          previewCard.includes('UNRANKED') &&
          !previewCard.includes('data-mod-star') &&
          !previewCard.includes('mod-preview') &&
          previewCard.includes('+15% Damage'),
        'Mod card follows catalog rarity, has non-clickable stars with rank controls and inline hover summary',
      );
      const expectedFrames = {
        bronze:
          'BronzeBackground.png|BronzeFrameTop.png|BronzeFrameBottom.png|BronzeSideLight.png|BronzeLowerTab.png',
        silver:
          'SilverBackground.png|SilverFrameTop.png|SilverFrameBottom.png|SilverSideLight.png|SilverLowerTab.png',
        gold: 'GoldBackground.png|GoldFrameTop.png|GoldFrameBottom.png|GoldSideLight.png|GoldLowerTab.png',
        legendary:
          'LegendaryBackground.png|LegendaryFrameTop.png|LegendaryFrameBottom.png|LegendarySideLight.png|LegendaryLowerTab.png',
        amalgam:
          'AmalgamBackground.png|AmalgamFrameTop.png|AmalgamFrameBottom.png|LegendarySideLight.png|LegendaryLowerTab.png',
        galvanized:
          'LegendaryBackground.png|GalvanizedFrameTop.png|GalvanizedFrameBottom.png|LegendarySideLight.png|LegendaryLowerTab.png',
        riven:
          'SilverBackground.png|OmegaFrameTop.png|OmegaFrameBottom.png|OmegaSideLight.png|RivenLowerTab.png',
      };
      assert(
        Object.entries(expectedFrames).every(([rarity, expected]) => {
          const f = modFrameAssets(rarity);
          return [f.background, f.top, f.bottom, f.side, f.tab].join('|') === expected;
        }) &&
          previewCard.includes('/SilverBackground.png') &&
          previewCard.includes('/SilverFrameTop.png') &&
          previewCard.includes('/SilverFrameBottom.png') &&
          previewCard.includes('mod-frame-borders'),
        'Each mod rarity composes the matching frame assets',
      );
      assert(
        Object.entries({
          bronze: 'Bronze',
          silver: 'Silver',
          gold: 'Gold',
          legendary: 'Legendary',
          amalgam: 'Silver',
          galvanized: 'Silver',
          riven: 'Riven',
        }).every(([rarity, name]) => modFrameAssets(rarity).corner === name + 'CornerLights.png') &&
          previewCard.includes('/SilverCornerLights.png') &&
          previewCard.includes('mod-corner-light left') &&
          previewCard.includes('mod-corner-light right'),
        'Compact and full mod cards include rarity-matched mirrored corner lights',
      );
      const wrongPolarityCard = slotHTML(
        { ...previewSlot, polarity: 'vazarin' },
        0,
        get(testDb, 'weapons', 'burston-prime'),
        [{ id: 'serration', name: 'Serration' }],
      );
      assert(
        wrongPolarityCard.includes('mod-face-drain polarity-mismatch') &&
          wrongPolarityCard.includes('>5</b>'),
        'Mismatched polarity shows red adjusted drain',
      );
      assert(
        modRarity({ name: 'Galvanized Chamber', rarity: 'Rare' }) === 'galvanized' &&
          modRarity({ name: 'Primed Cryo Rounds', rarity: 'Legendary' }) === 'legendary' &&
          modRarity({ name: 'Common Mod', rarity: 'Common' }) === 'bronze',
        'Galvanized, Legendary and Bronze frame types follow their categories',
      );
      const rankState = defaultState(testDb);
      rankState.slots[0] = { id: 'serration', rank: 0, polarity: '', stacks: 0, uptime: 100 };
      const baseRankDamage = calculateWeapon(testDb, rankState).ordinary;
      rankState.slots[0].rank = 1;
      const rankOneDamage = calculateWeapon(testDb, rankState).ordinary;
      assert(
        near(baseRankDamage, 1.15) && near(rankOneDamage, 1.3),
        'Base-rank mod value applies before each added fusion rank',
      );
      assert(
        records(testDb, 'mods').every(
          (m) => !m.rankDescriptions || m.rankDescriptions.length === m.maxRank + 1,
        ),
        'Rank descriptions align with mod ranks',
      );
      assert(!validateDatabase(testDb).length, 'All category schemas and references are valid');
      const plainDamageWeapon = get(testDb, 'weapons', 'kuva-bramma'),
        plainDamageState = defaultState(testDb);
      if (plainDamageWeapon) {
        plainDamageState.weaponId = plainDamageWeapon.id;
        const plainDamageProfile = calculateWeapon(testDb, plainDamageState),
          plainDamageMarkup = damageProfileHTML(plainDamageProfile, 'Base mode', '#f4ae78');
        assert(
          !plainDamageMarkup.includes('Incarnon enhancement') &&
            (plainDamageMarkup.match(/<span style=\"--stage:/g) || []).length === 2,
          'Non-Incarnon weapons show only base and modded damage stages',
        );
      }
      const acceltraDamageWeapon = records(testDb, 'weapons').find(
        (weapon) => weapon.name === 'Acceltra',
      );
      if (acceltraDamageWeapon) {
        const acceltraState = defaultState(testDb);
        acceltraState.weaponId = acceltraDamageWeapon.id;
        const acceltraProfile = calculateWeapon(testDb, acceltraState),
          acceltraMarkup = damageDistributionHTML([acceltraProfile], false);
        assert(
          acceltraMarkup.includes('damage-mode-single') &&
            acceltraMarkup.includes('DIRECT PROJECTILE') &&
            acceltraMarkup.includes('RADIAL DAMAGE') &&
            acceltraProfile.damageParts.every(
              (part) => part.stages?.unmodded && part.stages?.modded,
            ),
          'Non-Incarnon linked projectile and radial components render as separate full-width distributions with base and modded stages',
        );
      }
      const burstonLayoutWeapon = get(testDb, 'weapons', 'burston-prime');
      if (burstonLayoutWeapon) {
        const burstonLayoutState = defaultState(testDb);
        burstonLayoutState.weaponId = burstonLayoutWeapon.id;
        burstonLayoutState.incarnonEnabled = true;
        const burstonBaseProfile = calculateWeapon(testDb, {
            ...burstonLayoutState,
            attackId: 'attack-0',
          }),
          burstonIncarnonProfile = calculateWeapon(testDb, {
            ...burstonLayoutState,
            attackId: 'attack-1',
          }),
          burstonLayout = damageDistributionHTML(
            [burstonBaseProfile, burstonIncarnonProfile],
            true,
          );
        assert(
          burstonLayout.includes('damage-mode-columns') &&
            burstonLayout.includes('Base mode</h3>') &&
            burstonLayout.includes('Incarnon mode</h3>') &&
            burstonIncarnonProfile.damageParts.some(
              (part) => part.shotType === 'AoE' && part.stages?.incarnon,
            ),
          'Incarnon distribution uses paired mode columns with linked radial component stages',
        );
      }
      const progenitorCheckDb = clone(testDb);
      progenitorCheckDb['progenitor-library'] ||= {
        category: 'progenitor-library',
        schemaVersion: 1,
        records: [],
      };
      for (const name of ['Kuva Bramma', 'Coda Bassocyst']) {
        const weapon = records(progenitorCheckDb, 'weapons').find((item) => item.name === name);
        if (weapon)
          progenitorCheckDb['progenitor-library'].records.push({
            id: 'owned-' + slug(name),
            name,
            weaponId: weapon.id,
            acquired: true,
            element: 'toxin',
            bonusPercent: 48,
          });
      }
      const ownedKuva = records(progenitorCheckDb, 'weapons').find(
          (item) => item.name === 'Kuva Bramma',
        ),
        ownedCoda = records(progenitorCheckDb, 'weapons').find(
          (item) => item.name === 'Coda Bassocyst',
        );
      if (ownedKuva && ownedCoda) {
        const ownedState = defaultState(progenitorCheckDb);
        ownedState.weaponId = ownedKuva.id;
        assert(
          applyOwnedProgenitor(ownedState, progenitorCheckDb) &&
            ownedState.progenitor === 'toxin' &&
            ownedState.progenitorValue === 48,
          'Acquired progenitor element and bonus are applied to a new weapon build',
        );
        const codaState = { ...ownedState, weaponId: ownedCoda.id };
        applyOwnedProgenitor(codaState, progenitorCheckDb);
        const codaConfigured = configureWeapon(progenitorCheckDb, codaState).w;
        assert(
          codaState.progenitor === 'toxin' && codaConfigured.attacks[0].damage.toxin > 0,
          'Acquired Coda progenitor bonus is included in calculator damage',
        );
      }
      const crux = records(testDb, 'arcanes').find((x) => x.name === 'Primary Crux');
      assert(
        crux?.maxStacks === 10 &&
          records(testDb, 'arcanes').every(
            (x) => Number.isInteger(x.maxStacks) && x.maxStacks >= 1,
          ),
        'Arcane stack caps include Primary Crux ten and valid catalog maxima',
      );
      const cruxState = defaultState(testDb),
        cruxBase = calculateWeapon(testDb, cruxState);
      cruxState.arcanes[0] = { id: 'primary-crux', rank: 5, stacks: 10, uptime: 100 };
      const cruxWeapon = calculateWeapon(testDb, cruxState),
        cruxSchedule = ttkProjectileSchedule(cruxWeapon, cruxWeapon.shots + 1);
      assert(
        cruxWeapon.ammoEfficiency === 0.6 &&
          cruxWeapon.shots > cruxBase.shots &&
          cruxWeapon.sc > cruxBase.sc &&
          cruxSchedule.at(-1).time > cruxWeapon.shots / cruxWeapon.rate,
        'Primary Crux ten stacks raise status chance and ammo efficiency, extending shots before the TTK reload',
      );
      const staleArcaneDb = clone(testDb);
      get(staleArcaneDb, 'arcanes', 'primary-crux').maxStacks = 1;
      const staleCruxState = defaultState(staleArcaneDb);
      staleCruxState.arcanes[0] = { id: 'primary-crux', rank: 5, stacks: 8, uptime: 100 };
      assert(
        normalizeBuild(staleArcaneDb, staleCruxState).arcanes[0].stacks === 8 &&
          calculateWeapon(staleArcaneDb, staleCruxState).ammoEfficiency === 0.48,
        'Primary Crux retains stacks above stale local catalog caps',
      );
      const violet = records(testDb, 'archon-shards').find(
          (x) => x.id === 'archon-violet-primary-electricity-damage',
        ),
        emerald = records(testDb, 'archon-shards').find(
          (x) => x.id === 'archon-emerald-toxin-status-damage',
        ),
        corrosiveShard = records(testDb, 'archon-shards').find(
          (x) => x.id === 'archon-emerald-corrosive-status-stack-limit',
        ),
        shardState = defaultState(testDb);
      shardState.shards = [
        { id: violet.id, tauforged: true, stacks: 0 },
        { id: emerald.id, tauforged: false, stacks: 0 },
        { id: corrosiveShard.id, tauforged: true, stacks: 0 },
        { id: violet.id, tauforged: true, stacks: 0 },
        { id: '', tauforged: false, stacks: 0 },
      ];
      const shardWeapon = calculateWeapon(testDb, shardState);
      assert(
        shardWeapon.elementBonuses.electricity === 1.5 &&
          shardWeapon.bonus.toxinStatusDamage === 0.3 &&
          shardWeapon.bonus.corrosiveCapBonus === 3,
        'Tauforged Violet/Emerald shards apply Electricity, Toxin status damage and Corrosive stack-cap effects',
      );
      const legacyShardState = { ...defaultState(testDb) };
      delete legacyShardState.shards;
      assert(
        normalizeBuild(testDb, legacyShardState).shards.length === 5,
        'Legacy builds migrate to five empty Archon Shard slots',
      );
      const crimson = get(testDb, 'archon-shards', 'archon-crimson-primary-status-chance'),
        crimsonState = defaultState(testDb);
      crimsonState.weaponId = 'burston-prime';
      crimsonState.attackId = 'attack-0';
      const bareStatus = calculateWeapon(testDb, crimsonState);
      crimsonState.shards[0] = { id: crimson.id, tauforged: false, stacks: 0 };
      const crimsonNormalStatus = calculateWeapon(testDb, crimsonState);
      crimsonState.shards[0].tauforged = true;
      const tauStatus = calculateWeapon(testDb, crimsonState);
      assert(
        near(bareStatus.sc, 0.3) &&
          near(crimsonNormalStatus.sc, 0.375) &&
          near(tauStatus.sc, 0.4125) &&
          near(bareStatus.total, crimsonNormalStatus.total),
        'Crimson Primary Status Chance changes status rolls without adding direct shot damage',
      );
      assert(
        shardSelectedEffect(crimson, true) === '+37.5% Primary Status Chance',
        'Tauforged shard text retains the affected stat',
      );
      const violetState = defaultState(testDb);
      violetState.weaponId = 'burston-prime';
      violetState.attackId = 'attack-0';
      violetState.shards[0] = { id: violet.id, tauforged: false, stacks: 0 };
      const violetWeapon = calculateWeapon(testDb, violetState);
      assert(
        violetWeapon.damage.electricity > 0 && !violetWeapon.stages.incarnon.electricity,
        'Violet Electricity applies to modded damage without contaminating the Incarnon baseline',
      );
      const meleeShard = get(testDb, 'archon-shards', 'archon-violet-melee-critical-damage'),
        azureEnergy = get(testDb, 'archon-shards', 'archon-azure-maximum-energy'),
        meleeWeapon = records(testDb, 'weapons').find(
          (x) => x.category === 'Melee' && x.attacks[0].critMultiplier > 1,
        ),
        energyState = defaultState(testDb);
      energyState.weaponId = meleeWeapon.id;
      energyState.category = 'Melee';
      energyState.attackId = meleeWeapon.attacks[0].id;
      energyState.shards[0] = { id: meleeShard.id, tauforged: false, stacks: 0 };
      energyState.maximumEnergy = 500;
      const violetBelow = calculateWeapon(testDb, energyState);
      energyState.maximumEnergy = 501;
      const violetAbove = calculateWeapon(testDb, energyState);
      energyState.maximumEnergy = 460;
      energyState.shards[1] = { id: azureEnergy.id, tauforged: false, stacks: 0 };
      const violetAzure = calculateWeapon(testDb, energyState);
      energyState.shards[0].tauforged = true;
      const violetTau = calculateWeapon(testDb, energyState);
      assert(
        near(violetBelow.bonus.critDamage, 0.25) &&
          near(violetAbove.bonus.critDamage, 0.5) &&
          near(violetAzure.bonus.critDamage, 0.5) &&
          near(violetTau.bonus.critDamage, 0.74),
        'Violet Melee Critical Damage doubles only above 500 maximum Energy, including Azure shard Energy',
      );
      for (const [name, parent, child] of [
        ['Bubonico', 'attack-1', 'attack-2'],
        ['Sonicor', 'attack-0', 'attack-1'],
        ['Torid', 'attack-0', 'attack-1'],
        ['Aegrit', 'attack-0', 'attack-1'],
      ]) {
        const weapon = records(testDb, 'weapons').find((x) => x.name === name),
          component = weapon?.attacks.find((x) => x.id === child);
        assert(
          component?.componentOf === parent &&
            availableWeaponAttacks(weapon.attacks, true).every((x) => x.id !== child),
          name +
            ' radial instance is linked to its triggering attack and hidden as a separate mode',
        );
      }
      assert(
        Object.entries(STATUS_ICON_FILES).every(
          ([type, path]) => statusIconPath(ruleOf(testDb), type) === path,
        ),
        'Every standard status uses its matching local damage icon',
      );
      assert(
        statusIconPath({ statusIcons: { heat: 'images/status/DmgColdSmall64.png' } }, 'heat') ===
          'images/status/DmgHeatSmall64.png' &&
          statusIconPath(ruleOf(testDb), 'ignite') === 'images/status/DmgHeatSmall64.png' &&
          statusIconPath(ruleOf(testDb), 'bleed') === 'images/status/DmgSlashSmall64.png',
        'Stale mappings and proc aliases resolve to the matching icon',
      );
      const incarnonWeapon = get(testDb, 'weapons', 'burston-prime');
      assert(
        hasIncarnonProfile(incarnonWeapon, testDb) &&
          hasIncarnonProfile(
            { ...incarnonWeapon, incarnonVariant: null, incarnonImage: null },
            testDb,
          ) &&
          !hasIncarnonProfile(
            records(testDb, 'weapons').find((w) => !w.incarnonVariant),
            testDb,
          ),
        'Incarnon control availability follows explicit metadata or a matching evolution family',
      );
      assert(
        availableWeaponAttacks(incarnonWeapon.attacks, false)
          .map((a) => a.name)
          .join('|') === 'Normal Attack' &&
          availableWeaponAttacks(incarnonWeapon.attacks, true).length === 2,
        'Incarnon attack selector excludes linked radial components',
      );
      assert(
        !shouldShowIncarnonEvolutions(incarnonWeapon, false) &&
          shouldShowIncarnonEvolutions(incarnonWeapon, true),
        'Incarnon evolutions are visible only when Incarnon mode is enabled',
      );
      const normalStatus = statusAttackProfiles(incarnonWeapon, false),
        allStatus = statusAttackProfiles(incarnonWeapon, true);
      assert(
        normalStatus.length === 1 &&
          allStatus.length === 2 &&
          [...new Set(allStatus.map(attackProfileGroup))].join('|') ===
            'Normal attack|Incarnon attack',
        'Status profiles group linked radial components with their projectile',
      );
      const statusState = defaultState(testDb);
      statusState.weaponId = incarnonWeapon.id;
      statusState.incarnonEnabled = true;
      statusState.attackId = 'attack-1';
      const statusProfile = calculateWeapon(testDb, statusState),
        statusTarget = records(testDb, 'enemies').find((e) => e.name === 'Lancer'),
        statusHtml = statusProfileHTML(
          statusProfile,
          calculateEnemy(
            testDb,
            { ...statusState, scenario: { ...statusState.scenario, location: 'body' } },
            statusProfile,
            statusTarget,
          ),
        );
      assert(
        statusProfile.components.length === 2 &&
          statusHtml.includes('Total combined damage') &&
          statusHtml.includes('Show damage breakdown') &&
          statusHtml.includes('PROJECTILE') &&
          statusHtml.includes('RADIAL · BODY HIT') &&
          !statusHtml.includes('status-component-summary') &&
          statusHtml.includes('<details><summary>Show damage breakdown</summary>'),
        'Incarnon status card shows total damage and a collapsed direct/radial subrow breakdown',
      );
      const normalMultiState = defaultState(testDb);
      normalMultiState.weaponId = incarnonWeapon.id;
      normalMultiState.attackId = 'attack-0';
      const normalMultiProfile = calculateWeapon(testDb, normalMultiState),
        normalMultiHtml = statusProfileHTML(
          normalMultiProfile,
          calculateEnemy(
            testDb,
            { ...normalMultiState, scenario: { ...normalMultiState.scenario, location: 'body' } },
            normalMultiProfile,
            statusTarget,
          ),
        );
      assert(
        normalMultiProfile.damageParts.length === 1 &&
          normalMultiHtml.includes('Total combined damage') &&
          normalMultiHtml.includes('<details><summary>Show damage breakdown</summary>') &&
          normalMultiHtml.includes('impact ') &&
          normalMultiHtml.includes('puncture ') &&
          normalMultiHtml.includes('slash '),
        'Single normal projectiles show their total with collapsed elemental damage breakdown',
      );
      const standardComponentWeapon = get(testDb, 'weapons', 'bubonico'),
        standardComponentState = defaultState(testDb);
      standardComponentState.weaponId = standardComponentWeapon.id;
      standardComponentState.attackId = 'attack-1';
      const standardComponentProfile = calculateWeapon(testDb, standardComponentState),
        standardComponentTarget = records(testDb, 'enemies').find((e) => e.name === 'Lancer'),
        standardComponentHtml = statusProfileHTML(
          standardComponentProfile,
          calculateEnemy(
            testDb,
            {
              ...standardComponentState,
              scenario: { ...standardComponentState.scenario, location: 'body' },
            },
            standardComponentProfile,
            standardComponentTarget,
          ),
        );
      assert(
        standardComponentProfile.components.length === 2 &&
          standardComponentHtml.includes('Total combined damage') &&
          standardComponentHtml.includes('<details><summary>Show damage breakdown</summary>'),
        'Normal attacks with linked radial components use the same collapsed damage breakdown',
      );
      const staleWeaponDb = clone(testDb),
        staleBurston = get(staleWeaponDb, 'weapons', 'burston-prime');
      delete staleBurston.attacks.find((a) => a.id === 'attack-2').componentOf;
      restoreIncarnonCatalog(staleWeaponDb);
      assert(
        staleBurston.attacks.find((a) => a.id === 'attack-2').componentOf === 'attack-1',
        'Older saved weapon data restores missing projectile-component links',
      );
      const s = defaultState(testDb),
        w = get(testDb, 'weapons', s.weaponId);
      s.slots[0] = { id: 'serration', rank: 10, polarity: '', stacks: 0, uptime: 100 };
      const modded = calculateWeapon(testDb, s);
      assert(near(modded.ordinary, 2.65), 'Serration applies base damage once');
      assert(modded.sustainedDps < modded.burstDps, 'Reload reduces sustained firearm DPS');
      const e = records(testDb, 'enemies').find((e) => e.name === 'Lancer');
      if (e) {
        s.scenario.level = 1;
        const low = enemyStats(testDb, e, s.scenario);
        s.scenario.level = 100;
        const high = enemyStats(testDb, e, s.scenario);
        assert(
          high.health > low.health && high.armor > low.armor,
          'Enemy level increases scaled health and armor',
        );
        s.scenario.strip = 100;
        assert(enemyStats(testDb, e, s.scenario).armor === 0, 'Full armor strip removes armor');
        s.scenario.strip = 0;
        s.scenario.steelPath = true;
        const sp = enemyStats(testDb, e, s.scenario);
        assert(
          near(sp.health, high.health * 2.5) && sp.armor === high.armor,
          'Steel Path scales health without increasing armor',
        );
      }
      const r = {
        category: 'Rifle',
        layout: '2p0n',
        rank: 8,
        attributes: [{ stat: 'damage', negative: false, quality: 1 }],
      };
      const rv = rivenEffects(testDb, r, { rivenDisposition: 1.35 })[0].value;
      assert(
        near(rv, 1.65 * 0.99 * 1.35),
        'Riven layout and weapon disposition apply exactly once',
      );
      const meleeRivenWeapon = records(testDb, 'weapons').find(
          (weapon) => weapon.category === 'Melee' && weapon.rivenDisposition != null,
        ),
        meleeTraitDraft = {
          family: meleeRivenWeapon.family,
          category: 'Melee',
          layout: '3p1n',
          attributes: [],
        },
        rifleTraitDraft = {
          family: 'Burston',
          category: 'Rifle',
          layout: '3p1n',
          attributes: [
            { stat: 'critDamage', quality: 1, negative: false },
            { stat: 'critChance', quality: 1, negative: false },
            { stat: 'damage', quality: 1, negative: false },
            { stat: 'critDamage', quality: 1, negative: true },
          ],
        };
      assert(
        !rivenTraitAvailable(testDb, meleeTraitDraft, get(testDb, 'riven-tables', 'magazine')) &&
          rivenTraitAvailable(testDb, rifleTraitDraft, get(testDb, 'riven-tables', 'magazine')) &&
          rivenTraitAvailable(testDb, meleeTraitDraft, get(testDb, 'riven-tables', 'range')) &&
          !rivenTraitAvailable(testDb, rifleTraitDraft, get(testDb, 'riven-tables', 'range')) &&
          get(testDb, 'riven-splices', 'parryAngle').categories.join('|') === 'Melee',
        'Riven traits follow weapon-category restrictions for magazine, melee range and Parry Angle',
      );
      const uniqueTraits = normalizeRivenAttributes(testDb, rifleTraitDraft),
        uniqueDraft = { ...rifleTraitDraft, attributes: uniqueTraits };
      assert(
        new Set(uniqueTraits.map((attribute) => attribute.stat)).size === uniqueTraits.length &&
          !rivenSelectableTraits(testDb, uniqueDraft, 3).some((table) => table.id === 'critDamage'),
        'Positive and negative Riven slots cannot select the same trait',
      );
      const lockFace = modFaceHTML(
        {
          riven: true,
          name: 'Test Riven',
          type: 'Melee',
          weaponId: meleeRivenWeapon.id,
          maxRank: 8,
          baseDrain: 10,
          polarity: 'madurai',
          effects: [
            { stat: 'damage', value: 1, spliced: false },
            { stat: 'parryAngle', value: 1.45, spliced: true },
          ],
        },
        { id: 'riven:test', rank: 8, polarity: '' },
        0,
      );
      assert(
        (lockFace.match(/class="riven-effect-lock"/g) || []).length === 1 &&
          /riven-effect-lock[^]*?<span>\+145% parryAngle/.test(lockFace),
        'Riven card places one lock immediately before the spliced effect',
      );
      const rivenRange = rivenRollRange(testDb, r, r.attributes[0], { rivenDisposition: 1.35 });
      assert(
        near(rivenRange.min, 1.65 * 0.99 * 1.35 * 0.9) &&
          near(rivenRange.max, 1.65 * 0.99 * 1.35 * 1.1) &&
          near(rivenRange.rollPercent, 50),
        'Riven ordinary trait displays disposition-adjusted 90–110% bounds',
      );
      const broncoModeAnalysis = weaponBaseAnalysis(get(testDb, 'weapons', 'bronco-prime'));
      assert(
        broncoModeAnalysis?.base?.use === 'Status' &&
          broncoModeAnalysis?.incarnon?.use === 'Crit' &&
          rivenTraitGrade('statusChance', broncoModeAnalysis.base.leanings) === 'good' &&
          rivenTraitGrade('critChance', broncoModeAnalysis.incarnon.leanings) === 'good' &&
          weaponBaseAnalysis({
            attacks: [
              { name: 'Normal Attack', critChance: 0.2, critMultiplier: 2, statusChance: 0.1 },
            ],
          }).incarnon === null,
        'Bronco Prime shows different Base and Incarnon recommendations and mode-specific trait priorities; non-Incarnon weapons have no Incarnon mode',
      );
      const backupDb = clone(testDb),
        backupRiven = {
          id: 'backup-riven-test',
          name: 'Unreferenced backup Riven',
          family: 'Burston',
          category: 'Rifle',
          layout: '2p0n',
          rank: 8,
          mastery: 8,
          polarity: 'madurai',
          attributes: [
            { stat: 'damage', quality: 1, negative: false },
            { stat: 'critChance', quality: 1, negative: false },
          ],
        };
      backupDb.rivens.records.push(backupRiven);
      const arsenalBackup = arsenalExport(backupDb, testDb),
        restoreDb = clone(testDb);
      restoreDb.rivens.records = [];
      const restoredBackup = importArsenalCandidate(arsenalBackup, restoreDb).db;
      assert(
        arsenalBackup.customRecords.rivens.some((x) => x.id === backupRiven.id) &&
          restoredBackup.rivens.records.some((x) => x.id === backupRiven.id),
        'Arsenal backup includes and restores workshop Rivens even when no saved build references them',
      );
      const libraryBackupDb = clone(testDb),
        trackedWeapon = records(libraryBackupDb, 'progenitor-library').find(
          (item) => item.name === 'Kuva Bramma',
        );
      if (trackedWeapon) {
        trackedWeapon.acquired = true;
        trackedWeapon.element = 'toxin';
        trackedWeapon.bonusPercent = 48.5;
      }
      const libraryBackup = arsenalExport(libraryBackupDb, testDb),
        libraryRestoreBase = clone(testDb),
        libraryRestored = importArsenalCandidate(libraryBackup, libraryRestoreBase).db,
        restoredKuva = records(libraryRestored, 'progenitor-library').find(
          (item) => item.name === 'Kuva Bramma',
        );
      assert(
        libraryBackup.customRecords['progenitor-library']?.some(
          (item) => item.id === 'kuva-bramma',
        ) &&
          restoredKuva?.acquired &&
          restoredKuva.element === 'toxin' &&
          near(restoredKuva.bonusPercent, 48.5),
        'Arsenal backup includes and restores acquired progenitor library weapon records',
      );
      assert(
        near(
          rivenRollRange(
            testDb,
            r,
            { ...r.attributes[0], quality: 0.9 },
            { rivenDisposition: 1.35 },
            0,
          ).rollPercent,
          0,
        ) &&
          near(
            rivenRollRange(
              testDb,
              r,
              { ...r.attributes[0], quality: 1.1 },
              { rivenDisposition: 1.35 },
              0,
            ).rollPercent,
            100,
          ),
        'Riven roll indicator reaches both endpoints at low rank',
      );
      assert(
        near(splicedToEffect('faction:orokin', 1.5), 0.5) &&
          near(splicedFromEffect('faction:orokin', 0.5), 1.5) &&
          near(splicedToEffect('parryAngle', 25), 25),
        'Spliced faction multipliers and parry degrees use their displayed units',
      );
      const negativeRiven = {
          category: 'Rifle',
          layout: '2p1n',
          rank: 8,
          attributes: [
            { stat: 'damage', quality: 1, negative: false },
            { stat: 'critChance', quality: 1, negative: false },
            { stat: 'reload', quality: 1, negative: true },
          ],
        },
        negativeRange = rivenRollRange(testDb, negativeRiven, negativeRiven.attributes[2], {
          rivenDisposition: 1,
        });
      assert(
        negativeRange.min < negativeRange.current &&
          negativeRange.current < negativeRange.max &&
          near(negativeRange.min, 0.49995 * -0.495 * 1.1),
        'Negative Riven bounds sort by displayed numeric value',
      );
      const spliceDraft = {
        id: 'test-splice',
        name: 'Test splice',
        family: 'Burston',
        category: 'Rifle',
        layout: '2p1n',
        rank: 8,
        mastery: 8,
        polarity: 'madurai',
        attributes: [
          { stat: 'damage', quality: 1, negative: false },
          { stat: 'critChance', quality: 1, negative: false },
          { stat: 'zoom', quality: 1, negative: true },
        ],
      };
      const spliceWeapon = get(testDb, 'weapons', 'burston-prime');
      const choices = compatibleSplices(testDb, spliceDraft);
      assert(
        choices.some((x) => x.recipe.id === 'weakDamage' && x.left === 0 && x.right === 2),
        'Splice recipes recognize a positive and negative source pair',
      );
      const spliced = spliceRiven(testDb, spliceDraft, 'weakDamage', 0, 2, 274.1, spliceWeapon),
        locked = spliced.attributes.find((a) => a.spliced);
      assert(
        spliced.attributes.length === 3 &&
          spliced.attributes.filter((a) => a.negative).length === 1 &&
          locked.stat === 'weakDamage' &&
          near(rivenEffects(testDb, spliced, spliceWeapon)[0].value, 2.741),
        'Splicing replaces two traits, preserves layout and applies entered value',
      );
      const assumedRoll = { ...locked, valueAtMaxRankDisposition1: 2.25 * 1.2375 },
        provisionalRange = splicedRivenRollRange(testDb, spliced, assumedRoll, {
          ...spliceWeapon,
          rivenDisposition: 0.98,
        }),
        expectedSpliceBase = 2.25 * 1.2375 * 0.98;
      assert(
        provisionalRange?.provisional &&
          near(provisionalRange.min, expectedSpliceBase * 0.9) &&
          near(provisionalRange.max, expectedSpliceBase * 1.1) &&
          near(provisionalRange.quality, 1),
        'Spliced traits receive a TBC range estimate from base value, layout, disposition and 90–110% spread',
      );
      const lowerDisposition = rivenEffects(testDb, spliced, {
        ...spliceWeapon,
        rivenDisposition: spliceWeapon.rivenDisposition / 2,
      })[0].value;
      assert(
        near(lowerDisposition, 1.3705) &&
          !validateDatabase({ ...testDb, rivens: { ...testDb.rivens, records: [spliced] } }).length,
        'Spliced trait scales once with disposition and passes database validation',
      );
      assert(
        !clearRivenSplice(testDb, spliced).attributes.some((a) => a.spliced),
        'Removing a splice restores an ordinary editable trait',
      );
      const fixture = clone(testDb);
      const fe = {
        id: 'test-enemy',
        name: 'Test enemy',
        factionId: 'grineer',
        health: 100,
        shield: 0,
        armor: 0,
        baseLevel: 1,
        eximusHealth: 100,
        eximusShield: 0,
        weakpoints: [],
        damageMultiplier: 1,
        statusImmune: false,
        statusCaps: {},
        modifiers: {},
        limitations: [],
      };
      fixture.enemies.records.push(fe);
      const sw = defaultState(fixture);
      sw.scenario.level = 1;
      sw.slots[0] = { id: 'bane-of-grineer', rank: 5, polarity: '', stacks: 0, uptime: 100 };
      sw.slots[1] = { id: 'infected-clip', rank: 5, polarity: '', stacks: 0, uptime: 100 };
      sw.slots[2] = { id: 'rifle-elementalist', rank: 5, polarity: '', stacks: 0, uptime: 100 };
      const weapon = calculateWeapon(fixture, sw),
        result = calculateEnemy(fixture, sw, weapon, fe),
        toxin = result.procs.find((p) => p.type === 'toxin');
      assert(
        near(
          toxin.tick,
          (weapon.baseTotal * weapon.ordinary * 1.3 + 1) * 0.5 * 1.3 * 1.9 * 1.9 * weapon.meanCrit,
        ),
        'Toxin uses the unquantized DoT seed, starting damage and faction double dipping',
      );
      const ttk = simulateTtk(fixture, sw, weapon, fe, 1000);
      assert(
        ttk.locations.length === 6 &&
          ttk.locations.every((x) => x.killed) &&
          ttk.locations.every((x) => x.rows.at(-1).health === 0),
        'TTK simulates all hit mixes through the health pool until depletion',
      );
      const patternEnemy = { ...fe, health: 100000, eximusHealth: 100000 },
        pattern = simulateTtk(fixture, sw, weapon, patternEnemy, 11),
        hits = (id) =>
          pattern.locations
            .find((x) => x.id === id)
            .rows.map((x) => (x.hitLocation === 'body' ? 'B' : 'H'))
            .join('');
      assert(
        hits('mix25').slice(0, 4) === 'HHHB' &&
          hits('mix50').slice(0, 4) === 'HHBB' &&
          hits('mix75').slice(0, 4) === 'HBBB' &&
          hits('mix110') === 'HBBBBBBBBBB',
        'Mixed TTK ratios apply deterministic head/weak and body hits per projectile instead of averaged damage',
      );
      const dotEnemy = { ...fe, health: 2, eximusHealth: 2 },
        dotBase = {
          ...weapon,
          damage: { slash: 1 },
          total: 1,
          baseTotal: 1,
          ordinary: 1,
          sc: 1,
          ms: 1,
          rate: 1,
          shots: null,
          reload: null,
          forced: {},
          bonus: { ...weapon.bonus, statusDuration: 0 },
          a: { ...weapon.a, forcedProcs: [] },
        },
        dotTypes = ['slash', 'heat', 'gas', 'electricity', 'toxin'],
        dotRuns = dotTypes.map((type) =>
          simulateTtk(
            fixture,
            sw,
            {
              ...dotBase,
              damage: { [type]: 1 },
              damageParts: [
                {
                  id: 'dot-' + type,
                  name: type,
                  damage: { [type]: 1 },
                  shotType: 'Projectile',
                  criticalChance: 0,
                  criticalMultiplier: 1,
                  statusChance: 1,
                  forcedProcs: [],
                },
              ],
            },
            dotEnemy,
            1,
          ),
        );
      assert(
        dotRuns.every((run, i) =>
          run.locations[0].timeline.some(
            (p) => p.kind === 'dot' && p.label === dotTypes[i] + ' tick',
          ),
        ),
        'TTK schedules Slash, Heat, Gas, Electricity and Toxin damage ticks',
      );
      assert(
        dotRuns.every((run) => run.locations[0].ttk > 0),
        'DoT ticks contribute to kill time after the final projectile',
      );
      const durationSlash = simulateTtk(
        fixture,
        sw,
        {
          ...dotBase,
          damage: { slash: 1 },
          damageParts: [
            {
              id: 'dot-slash',
              name: 'slash',
              damage: { slash: 1 },
              shotType: 'Projectile',
              criticalChance: 0,
              criticalMultiplier: 1,
              statusChance: 1,
              forcedProcs: [],
            },
          ],
          bonus: { ...dotBase.bonus, statusDuration: 1 },
        },
        dotEnemy,
        1,
      );
      assert(
        durationSlash.locations[0].ttk > dotRuns[0].locations[0].ttk,
        'Status duration extends TTK DoT tick spacing',
      );
      assert(
        ttkGraphSVG(ttk.locations).includes('<polyline') &&
          ttkGraphSVG(ttk.locations).includes(
            '100% body · ' + fmt(ttk.locations.find((x) => x.id === 'body').ttk, 2) + ' s',
          ),
        'TTK graph draws scenario series',
      );
      const graphStress = TTK_LOCATIONS.map((location) => ({
        ...location,
        timeline: Array.from({ length: 12000 }, (_, i) => ({ time: i / 10, remaining: 12000 - i })),
      }));
      assert(
        ttkGraphSVG(graphStress).includes('<svg'),
        'TTK graph handles long firing timelines without argument overflow',
      );
      const corrosiveState = defaultState(testDb);
      corrosiveState.weaponId = 'braton';
      corrosiveState.slots[0] = {
        id: 'infected-clip',
        rank: 5,
        polarity: '',
        stacks: 0,
        uptime: 100,
      };
      corrosiveState.slots[1] = {
        id: 'stormbringer',
        rank: 5,
        polarity: '',
        stacks: 0,
        uptime: 100,
      };
      const corrosiveWeapon = calculateWeapon(testDb, corrosiveState),
        armored = get(testDb, 'enemies', 'arid-lancer'),
        corrosiveTtk = simulateTtk(testDb, corrosiveState, corrosiveWeapon, armored, 100);
      assert(
        corrosiveTtk.locations.find((x) => x.id === 'head').rows[30].armor <
          corrosiveTtk.locations.find((x) => x.id === 'head').rows[0].armor,
        'TTK carries expected Corrosive armor reduction into subsequent projectiles',
      );
      const heatWeapon = {
          ...corrosiveWeapon,
          ms: 1,
          sc: 0,
          rate: 5,
          shots: null,
          reload: null,
          forced: { heat: 1 },
          damage: { heat: 100 },
          total: 100,
          damageParts: [
            {
              id: 'forced-heat',
              name: 'Heat',
              damage: { heat: 100 },
              shotType: 'Projectile',
              criticalChance: 0,
              criticalMultiplier: 1,
              statusChance: 0,
              baseTotal: 100,
              forcedProcs: [],
            },
          ],
        },
        heatTtk = simulateTtk(
          testDb,
          { ...corrosiveState, scenario: { ...corrosiveState.scenario, level: 100 } },
          heatWeapon,
          { ...armored, health: 1e9, eximusHealth: 1e9 },
          6,
        ),
        heatRows = heatTtk.locations.find((x) => x.id === 'body').rows,
        unstrippedArmor = enemyStats(testDb, armored, {
          ...corrosiveState.scenario,
          level: 100,
        }).armor;
      assert(
        near(heatRows[1].armor, unstrippedArmor) && near(heatRows[3].armor, unstrippedArmor * 0.85),
        'TTK applies Heat armor reduction after its half-second ramp instead of instantly',
      );
      const viralState = defaultState(testDb),
        viralBuild = calculateWeapon(testDb, viralState),
        viralWeapon = {
          ...viralBuild,
          damage: { viral: 100 },
          total: 100,
          baseTotal: 100,
          ordinary: 1,
          ms: 1,
          sc: 0,
          rate: 5,
          sustain: 5,
          shots: null,
          reload: null,
          forced: { viral: 1 },
          damageParts: [
            {
              id: 'forced-viral',
              name: 'Viral',
              damage: { viral: 100 },
              shotType: 'Projectile',
              criticalChance: 0,
              criticalMultiplier: 1,
              statusChance: 0,
              baseTotal: 100,
              forcedProcs: [],
            },
          ],
        },
        viralEnemy = { ...fe, health: 1e9, eximusHealth: 1e9 },
        viralTtk = simulateTtk(testDb, viralState, viralWeapon, viralEnemy, 2),
        viralRows = viralTtk.locations.find((x) => x.id === 'body').rows,
        expiredViralTtk = simulateTtk(
          testDb,
          viralState,
          { ...viralWeapon, rate: 0.1 },
          viralEnemy,
          2,
        ),
        expiredViralRows = expiredViralTtk.locations.find((x) => x.id === 'body').rows;
      assert(
        near(viralRows[1].damage / viralRows[0].damage, 2) &&
          near(expiredViralRows[1].damage / expiredViralRows[0].damage, 1),
        'TTK applies Viral stack multipliers to following health hits and drops them after their duration',
      );
      const persistentState = {
          ...corrosiveState,
          scenario: { ...corrosiveState.scenario, level: 100, corrosiveCap: 14 },
        },
        forcedCorWeapon = {
          ...corrosiveWeapon,
          ms: 1,
          sc: 0,
          rate: 5,
          shots: null,
          reload: null,
          forced: { corrosive: 1 },
          damage: { corrosive: 100 },
          total: 100,
          bonus: { ...corrosiveWeapon.bonus, statusDuration: 0 },
        },
        persistentEnemy = { ...armored, health: 1e9, eximusHealth: 1e9 },
        persistentTtk = simulateTtk(testDb, persistentState, forcedCorWeapon, persistentEnemy, 20),
        persistentHead = persistentTtk.locations.find((x) => x.id === 'head'),
        stripRow = persistentHead.rows.find((x) => x.armorStrippedAfter),
        afterStrip = persistentHead.rows.find((x) => x.time > stripRow?.time);
      assert(
        persistentHead.rows.indexOf(stripRow) === 13 &&
          afterStrip?.armor === 0 &&
          persistentHead.timeline.some((p) => p.armorStripped) &&
          ttkGraphSVG(compactTtkResult(persistentTtk).locations).includes('Armor stripped at'),
        'Fourteen Corrosive stacks permanently strip armor and mark the TTK table and graph',
      );
      const burstonAnalysis = weaponBaseAnalysis(get(testDb, 'weapons', 'burston-prime')),
        mockCritAnalysis = weaponBaseAnalysis({
          attacks: [
            {
              id: 'crit',
              name: 'Crit profile',
              critChance: 0.4,
              critMultiplier: 3,
              statusChance: 0.1,
              damage: { impact: 100 },
            },
          ],
        }),
        dualWithin = weaponBaseAnalysis({
          attacks: [
            { name: 'Near tie', critChance: 0.2, critMultiplier: 2.5, statusChance: 0.286 },
          ],
        }),
        dualOutside = weaponBaseAnalysis({
          attacks: [
            { name: 'Outside tie', critChance: 0.2, critMultiplier: 2.5, statusChance: 0.284 },
          ],
        });
      assert(
        burstonAnalysis?.use === 'Crit' &&
          burstonAnalysis.profiles.length === 2 &&
          burstonAnalysis.profiles[0].attack.id === 'attack-0' &&
          burstonAnalysis.profiles[1].attack.id === 'attack-1' &&
          near(burstonAnalysis.statusChance, 0.3) &&
          mockCritAnalysis?.use === 'Crit' &&
          dualWithin?.use === 'Crit or Status' &&
          dualWithin.leanings.length === 2 &&
          dualOutside?.use === 'Crit',
        'Weapon suggestions average normal and direct Incarnon profiles, mark score gaps up to 5% as dual leaning, and exclude linked radial damage',
      );
      assert(
        rivenTraitGrade('critChance', ['Crit', 'Status']) === 'good' &&
          rivenTraitGrade('statusChance', ['Crit', 'Status']) === 'good' &&
          rivenTraitGrade('ammo', ['Crit', 'Status']) === 'bad',
        'Dual-leaning Riven guides combine both trait recommendations',
      );
      const strunDraft = { family: 'Strun', category: 'Shotgun', weaponId: 'strun-prime' },
        strunPreview = rivenWeaponForDraft(
          records(testDb, 'weapons'),
          strunDraft,
          get(testDb, 'weapons', 'mk1-strun'),
        );
      assert(
        strunPreview?.id === 'strun-prime' &&
          strunPreview.rivenDisposition !== get(testDb, 'weapons', 'mk1-strun').rivenDisposition,
        'Riven model selection uses the exact family variant and its disposition',
      );
      assert(
        rivenTraitGrade('statusDamage', 'Status') === 'good' &&
          rivenTraitGrade('critChance', 'Status') === 'bad' &&
          rivenTraitGrade('weakDamage', 'Crit') === 'neutral' &&
          rivenTraitGrade('weakCrit', 'Crit') === 'good' &&
          rivenTraitGrade('damage', 'Status') === 'good',
        'Trait guide colors adapt to Status or Crit recommendations',
      );
      const qualityAttr = { stat: 'damage', negative: false, quality: 1 },
        qualityRiven = { category: 'Rifle', layout: '2p0n', rank: 8, attributes: [qualityAttr] },
        qualityWeapon = { rivenDisposition: 1.35 },
        qualityCases = [0.9, 0.95, 1, 1.05, 1.1].map((q) => {
          const shown = rivenShownNumber(
            'damage',
            rivenEffects(
              testDb,
              { ...qualityRiven, attributes: [{ ...qualityAttr, quality: q }] },
              qualityWeapon,
            )[0].value,
          );
          return rivenQualityFromDisplayed(testDb, qualityRiven, qualityAttr, qualityWeapon, shown);
        });
      assert(
        qualityCases.every((q, i) => near(q, [0.9, 0.95, 1, 1.05, 1.1][i])) &&
          rivenQualityClass(0.9) === 'red' &&
          rivenQualityClass(0.949) === 'red' &&
          rivenQualityClass(0.95) === 'amber' &&
          rivenQualityClass(1.049) === 'amber' &&
          rivenQualityClass(1.05) === 'green' &&
          rivenQualityClass(1.1) === 'green',
        'Riven in-game values recover roll quality and classify the requested band boundaries',
      );
      const negAttr = { stat: 'reload', negative: true, quality: 1 },
        negRiven = { category: 'Rifle', layout: '2p1n', rank: 8, attributes: [negAttr] },
        negShown = rivenShownNumber(
          'reload',
          rivenEffects(
            testDb,
            { ...negRiven, attributes: [{ ...negAttr, quality: 1.05 }] },
            qualityWeapon,
          )[0].value,
        );
      assert(
        near(rivenQualityFromDisplayed(testDb, negRiven, negAttr, qualityWeapon, negShown), 1.05),
        'Negative Riven values derive quality using the signed displayed value',
      );
      const bad = clone(testDb);
      bad.enemies.records[0].factionId = 'missing-faction';
      assert(validateDatabase(bad).length > 0, 'Broken faction references reject an import');
      if (e) {
        const ss = defaultState(testDb);
        ss.scenario.level = 100;
        const normal = enemyStats(testDb, e, ss.scenario).armor;
        ss.scenario.stacks.corrosive = 1;
        assert(
          near(enemyStats(testDb, e, ss.scenario).armor, normal * 0.74),
          'First Corrosive stack removes 26% armor',
        );
        ss.scenario.stacks.corrosive = 10;
        assert(
          near(enemyStats(testDb, e, ss.scenario).armor, normal * 0.2),
          'Ten Corrosive stacks remove 80% armor',
        );
        const acuity = defaultState(testDb);
        acuity.slots[0] = { id: 'primary-acuity', rank: 10, polarity: '', stacks: 0, uptime: 100 };
        acuity.slots[1] = { id: 'split-chamber', rank: 5, polarity: '', stacks: 0, uptime: 100 };
        acuity.scenario.location = 'head';
        const aw = calculateWeapon(testDb, acuity),
          ar = calculateEnemy(testDb, acuity, aw, e);
        assert(
          aw.ms === 1 && ar.body === 8.25,
          'Primary Acuity locks multishot and adds 1.5× head weakpoint bonus',
        );
      }
      const burston = records(testDb, 'weapons').find((w) => w.id === 'burston');
      if (burston) {
        const ss = defaultState(testDb);
        ss.weaponId = burston.id;
        ss.attackId = burston.attacks[0].id;
        const bw = calculateWeapon(testDb, ss);
        assert(
          near(bw.rate, 3 / (1 / 5 + 2 * 0.061)),
          'Burston burst delay reproduces the sourced firing-rate example',
        );
      }
      const bp = get(testDb, 'weapons', 'burston-prime');
      if (bp) {
        const empty = defaultState(testDb);
        empty.weaponId = bp.id;
        empty.attackId = 'attack-0';
        const plain = calculateWeapon(testDb, empty);
        assert(
          JSON.stringify(plain.stages.unmodded) === JSON.stringify(plain.stages.modded),
          'An empty Burston Prime build has equal base and modded damage',
        );
        const st = defaultState(testDb);
        st.weaponId = bp.id;
        st.attackId = 'attack-0';
        st.incarnonEnabled = true;
        st.evolutions = { 2: 'burston-2-forceful-finality' };
        const first = calculateWeapon(testDb, st);
        assert(
          near(first.rawBaseTotal, 46) &&
            near(first.baseTotal, 88) &&
            near(first.incarnonTotal, 90.75) &&
            near(first.total, 90.75),
          'Burston Prime Evolution II adds 42 base damage before combat quantization',
        );
        assert(
          damageProfileHTML(first, 'Incarnon mode', '#a78be8', true).includes('#a78be8') &&
            damageProfileHTML(first, 'Incarnon mode', '#a78be8', true).includes('#55d6b0'),
          'Incarnon chart distinguishes enhancement and modded colors',
        );
        st.evolutions[4] = 'burston-4-absolute-valor';
        assert(
          calculateWeapon(testDb, st).evolutionEffects.some(
            (e) => e.stat === 'baseCrit' && near(e.value, 0.22),
          ),
          'Weapon performance receives selected Incarnon critical bonuses',
        );
        delete st.evolutions[4];
        assert(
          near(first.stages.incarnon.impact, 27.5) &&
            near(first.stages.incarnon.puncture, 27.5) &&
            near(first.stages.incarnon.slash, 35.75),
          'Flat Incarnon damage preserves physical damage proportions',
        );
        st.slots[0] = { id: 'serration', rank: 10, polarity: '', stacks: 0, uptime: 100 };
        const second = calculateWeapon(testDb, st);
        assert(
          near(second.total, 240.4875) &&
            near(second.rawBaseTotal, 46) &&
            near(second.baseTotal, 88) &&
            near(second.incarnonTotal, 90.75),
          'Serration scales enhanced base damage while keeping three stages',
        );
        assert(
          near(bp.attacks[0].damage.impact, 13.8),
          'Calculation leaves weapon JSON stats unchanged',
        );
        st.evolutions[3] = 'burston-3-extended-volley';
        assert(
          calculateWeapon(testDb, st).mag === bp.magazine + 21,
          'Flat magazine evolution applies before magazine mods',
        );
        st.evolutionConditions = { 'burston-2-forceful-finality': { 'final-burst': 1 } };
        assert(calculateWeapon(testDb, st).ms === 6, 'Final burst condition adds base multishot');
        st.attackId = 'attack-1';
        const transformed = calculateWeapon(testDb, st);
        assert(
          transformed.ms === 1 &&
            transformed.mag === 600 &&
            near(transformed.baseTotal, 110) &&
            transformed.damageParts.every((part) => near(part.baseTotal, 55)) &&
            transformed.components.length === 2,
          'Burston Fortress Salvo adds base damage to both simultaneous Incarnon components without changing projectile cadence',
        );
        const serrationState = {
            ...st,
            slots: st.slots.map((slot, index) =>
              index === 0
                ? { id: 'serration', rank: 10, polarity: '', stacks: 0, uptime: 100 }
                : slot,
            ),
            scenario: { ...st.scenario, level: 100, distance: 1, location: 'body' },
          },
          serrated = calculateWeapon(testDb, serrationState),
          arid = get(testDb, 'enemies', 'arid-lancer'),
          serratedHit = calculateEnemy(testDb, serrationState, serrated, arid),
          normalOutcome = serratedHit.projectileOutcomes.find((outcome) => !outcome.critical);
        assert(
          serrated.damageParts.length === 2 &&
            serrated.damageParts.every((part) => near(part.damage.heat, 145.75)) &&
            normalOutcome.components.length === 2 &&
            normalOutcome.components.every((part) => Number.isFinite(part.damage.health)) &&
            normalOutcome.damage.health ===
              normalOutcome.components.reduce((total, part) => total + part.damage.health, 0),
          'Serration modifies both Burston Incarnon damage packets and hit outcomes expose direct and radial values separately',
        );
        const bodyRange = hitOutcomeRangeSet(testDb, serrationState, serrated, arid, 'body'),
          headRange = hitOutcomeRangeSet(
            testDb,
            { ...serrationState, scenario: { ...serrationState.scenario, location: 'head' } },
            serrated,
            arid,
            'head',
          ),
          bodyMaxCrit = bodyRange.criticals.find(
            (hit) => hit.min.tiers[0] > 0 && hit.min.tiers[1] === 0,
          ),
          headMaxCrit = headRange.criticals.find(
            (hit) => hit.min.tiers[0] > 0 && hit.min.tiers[1] === 0,
          );
        assert(
          bodyRange.labels.includes('Heat up to −50% armor') &&
            bodyRange.normal.components[0].damage.health === 53 &&
            bodyRange.normalMax.components[0].damage.health === 81 &&
            bodyMaxCrit?.min.components[0].damage.health === 159 &&
            bodyMaxCrit?.max.components[0].damage.health === 241 &&
            headRange.normal.components[0].damage.health === 159 &&
            headRange.normalMax.components[0].damage.health === 241 &&
            headMaxCrit?.min.components[0].damage.health === 951 &&
            headMaxCrit?.max.components[0].damage.health === 1441,
          'Hit popup ranges apply maximum Heat armor strip to direct damage while retaining separate radial damage',
        );
        st.attackId = 'attack-0';
        st.evolutions = { 4: 'burston-4-absolute-valor' };
        st.slots[0] = { id: 'point-strike', rank: 5, polarity: '', stacks: 0, uptime: 100 };
        assert(
          near(calculateWeapon(testDb, st).cc, 1),
          'Base critical chance evolution is multiplied by critical chance mods',
        );
      }
      const aptitudeDb = testDb,
        aptitudeWeaponRecord = get(aptitudeDb, 'weapons', 'burston-prime');
      if (aptitudeWeaponRecord) {
        const plainState = defaultState(aptitudeDb);
        plainState.weaponId = aptitudeWeaponRecord.id;
        plainState.incarnonEnabled = true;
        plainState.attackId = 'attack-1';
        plainState.evolutions = {
          1: 'burston-1-incarnon-form',
          2: 'burston-2-fortress-salvo',
          3: 'burston-3-kinetic-battle',
          4: 'burston-4-absolute-valor',
        };
        plainState.scenario.stacks.viral = 1;
        const aptState = {
            ...plainState,
            slots: plainState.slots.map((slot, index) =>
              index === 0 ? { id: 'galvanized-aptitude', rank: 10, stacks: 2, uptime: 100 } : slot,
            ),
          },
          plainInc = calculateWeapon(aptitudeDb, aptState),
          plainIncNoApt = calculateWeapon(aptitudeDb, plainState),
          target = get(aptitudeDb, 'enemies', 'arid-lancer'),
          hitState = {
            ...aptState,
            scenario: { ...aptState.scenario, level: 100, location: 'body' },
          },
          noAptState = {
            ...plainState,
            scenario: { ...plainState.scenario, level: 100, location: 'body' },
          },
          withApt = calculateEnemy(aptitudeDb, hitState, plainInc, target).projectileOutcomes.find(
            (outcome) => outcome.tiers.every((tier) => tier === 0),
          ),
          withoutApt = calculateEnemy(
            aptitudeDb,
            noAptState,
            plainIncNoApt,
            target,
          ).projectileOutcomes.find((outcome) => outcome.tiers.every((tier) => tier === 0));
        assert(
          near(plainInc.bonus.galvanizedAptitude, 0.8) &&
            withApt.components[0].damage.health > withoutApt.components[0].damage.health &&
            near(
              withApt.components[0].damage.health / withoutApt.components[0].damage.health,
              1.8,
            ) &&
            near(withApt.components[1].damage.health, withoutApt.components[1].damage.health),
          'Galvanized Aptitude adds max kill-stack bonus per target status type to direct hits, not linked radial damage',
        );
      }
      const popupDb = testDb,
        popupState = defaultState(popupDb),
        popupWeapon = get(popupDb, 'weapons', 'burston-prime');
      if (popupWeapon) {
        popupState.weaponId = popupWeapon.id;
        popupState.attackId = 'attack-0';
        popupState.incarnonEnabled = true;
        popupState.evolutions = {
          1: 'burston-1-incarnon-form',
          2: 'burston-2-fortress-salvo',
          3: 'burston-3-kinetic-battle',
          4: 'burston-4-absolute-valor',
        };
        const pw = calculateWeapon(popupDb, popupState),
          outcomes = (enemyId, location) => {
            const enemy = get(popupDb, 'enemies', enemyId),
              r = calculateEnemy(
                popupDb,
                { ...popupState, scenario: { ...popupState.scenario, level: 100, location } },
                pw,
                enemy,
              );
            return r.projectileOutcomes.map((x) => x.damage[r.current]);
          };
        assert(
          JSON.stringify(outcomes('arid-lancer', 'body')) === '[38,68]' &&
            JSON.stringify(outcomes('arid-lancer', 'head')) === '[114,408]' &&
            JSON.stringify(outcomes('elite-crewman', 'body')) === '[105,188]' &&
            JSON.stringify(outcomes('elite-crewman', 'head')) === '[314,563]',
          'Burston Prime level 100 hit popups match the in-game faction and headshot values',
        );
        const target = get(popupDb, 'enemies', 'arid-lancer'),
          incTtkState = { ...popupState, attackId: 'attack-1' },
          incTtkWeapon = calculateWeapon(popupDb, incTtkState),
          ttk = simulateTtk(popupDb, incTtkState, incTtkWeapon, target, 1000),
          kills = Object.fromEntries(ttk.locations.map((x) => [x.id, x.ttk])),
          headRow = ttk.locations.find((x) => x.id === 'head').rows[0],
          bodyRow = ttk.locations.find((x) => x.id === 'body').rows[0],
          headDirect = headRow.components.find((x) => x.id === 'attack-1'),
          bodyDirect = bodyRow.components.find((x) => x.id === 'attack-1'),
          radialNote = radialNeighborFalloffNote(popupDb, incTtkState, incTtkWeapon, target);
        assert(
          ttk.locations.every((x) => x.killed) &&
            kills.head < kills.mix25 &&
            kills.mix25 < kills.mix50 &&
            kills.mix50 < kills.mix75 &&
            kills.mix75 < kills.mix110 &&
            kills.mix110 < kills.body,
          'TTK scenarios run from fastest head/weak mix to slowest body mix',
        );
        assert(
          headDirect &&
            bodyDirect &&
            headDirect.damage > bodyDirect.damage &&
            headRow.components.length === 1 &&
            near(headRow.damage, headDirect.damage) &&
            !ttkCellHTML(headRow).includes('R ') &&
            radialNote.includes('neighboring enemies, not the enemy directly hit') &&
            radialNote.includes('0–2 m'),
          'Direct-hit TTK excludes linked radial damage and reports its neighbor falloff range',
        );
        const childSelection = normalizeBuild(popupDb, { ...popupState, attackId: 'attack-2' });
        assert(
          childSelection.attackId === 'attack-1',
          'Legacy radial-only selections migrate to their parent projectile profile',
        );
      }
      const ttkModeDb = clone(testDb),
        ttkModeWeapon = get(ttkModeDb, 'weapons', 'burston-prime'),
        ttkModeState = defaultState(ttkModeDb);
      if (ttkModeWeapon) {
        ttkModeState.weaponId = ttkModeWeapon.id;
        ttkModeState.category = ttkModeWeapon.category;
        ttkModeState.incarnonEnabled = true;
        ttkModeState.attackId = 'attack-1';
        const incProfile = calculateWeapon(ttkModeDb, ttkModeState),
          incHitHtml = ttkHitOutcomesHTML(
            ttkModeDb,
            ttkModeState,
            incProfile,
            records(ttkModeDb, 'enemies').find((e) => e.name === 'Arid Lancer'),
          );
        assert(
          attackModeLabel(incProfile.a) === 'Incarnon mode' &&
            incHitHtml.includes('Body') &&
            incHitHtml.includes('Weakpoint') &&
            incHitHtml.includes('Headshot') &&
            incHitHtml.includes('Critical hit'),
          'Incarnon TTK profile includes normal and critical body, weakpoint and headshot damage',
        );
      }
      const altModeWeapon = records(ttkModeDb, 'weapons').find((w) =>
        arr(w.attacks).some(
          (a) => !a.componentOf && /(?:alt[ -]?fire|alternate fire)/i.test(a.name),
        ),
      );
      if (altModeWeapon) {
        const altAttack = altModeWeapon.attacks.find(
            (a) => !a.componentOf && /(?:alt[ -]?fire|alternate fire)/i.test(a.name),
          ),
          altState = normalizeBuild(ttkModeDb, {
            ...defaultState(ttkModeDb),
            weaponId: altModeWeapon.id,
            category: altModeWeapon.category,
            attackId: altAttack.id,
          }),
          altProfile = calculateWeapon(ttkModeDb, altState),
          altHitHtml = ttkHitOutcomesHTML(
            ttkModeDb,
            altState,
            altProfile,
            records(ttkModeDb, 'enemies').find((e) => e.name === 'Arid Lancer'),
          );
        assert(
          attackModeLabel(altProfile.a) === 'Alt-fire mode' &&
            altHitHtml.includes('Body') &&
            altHitHtml.includes('Critical hit'),
          'Alt-fire TTK profile includes normal and critical hit-location damage',
        );
      }
      assert(near(procProbability(0.3, 0.4), 0.12), 'Weighted status probability below 100%');
      assert(near(procProbability(1, 0.4), 0.4), 'Weighted status probability at 100%');
      assert(
        near(procProbability(2.5, 0.4), 0.712),
        'Above 100% status distinguishes expected procs from at-least-one probability',
      );
      const probabilityFixture = {
          a: { name: 'Test attack' },
          ms: 4,
          damageParts: [{ damage: { impact: 25, heat: 75 }, statusChance: 1.1 }],
        },
        probabilityRows = statusProbabilityRows(probabilityFixture),
        impactRow = probabilityRows.find((row) => row.type === 'impact'),
        heatRow = probabilityRows.find((row) => row.type === 'heat');
      assert(
        near(impactRow.damageWeight, 0.25) &&
          near(impactRow.perProjectile, 0.26875) &&
          near(impactRow.expected, 137.5) &&
          near(heatRow.damageWeight, 0.75) &&
          near(heatRow.perProjectile, 0.76875) &&
          near(heatRow.expected, 412.5),
        '500-projectile status estimates apply weighted procs above 100% status chance',
      );
      assert(
        near(impactRow.atLeastOne, 1) &&
          statusProbabilityRows({ ...probabilityFixture, ms: 1 })[0].expected ===
            impactRow.expected,
        '500-projectile cumulative probability is displayed and independent of multishot',
      );
      const linkedProbability = statusProbabilityRows({
        a: { name: 'Linked attack' },
        damageParts: [
          { damage: { impact: 50, slash: 50 }, statusChance: 0.5 },
          { damage: { impact: 100 }, statusChance: 0.5, shotType: 'AoE' },
        ],
      }).find((row) => row.type === 'impact');
      assert(
        near(linkedProbability.damageWeight, 0.75) &&
          near(linkedProbability.perProjectile, 0.625) &&
          near(linkedProbability.expected, 375) &&
          linkedProbability.atLeastOne === 1,
        'Linked projectile and radial status probabilities combine as independent component rolls',
      );
      const separateProfileMarkup = statusProbabilityTableHTML([
        {
          a: { name: 'Normal Attack' },
          damageParts: [{ damage: { heat: 100 }, statusChance: 0.5 }],
        },
        {
          a: { name: 'Incarnon Form' },
          damageParts: [{ damage: { toxin: 100 }, statusChance: 0.5 }],
        },
        { a: { name: 'Alt Fire' }, damageParts: [{ damage: { cold: 100 }, statusChance: 0.5 }] },
      ]);
      assert(
        (separateProfileMarkup.match(/<table class="status-probability-table">/g) || []).length ===
          3 &&
          separateProfileMarkup.includes('Normal attack · Normal Attack') &&
          separateProfileMarkup.includes('Incarnon attack · Incarnon Form') &&
          separateProfileMarkup.includes('Normal attack · Alt Fire'),
        'Normal, Incarnon and alt-fire probability tables keep damage weights separate',
      );
      const probabilityMarkup = statusProbabilityTableHTML([probabilityFixture]);
      assert(
        probabilityMarkup.includes(
          'Status proc probability · 500 projectiles per attack profile',
        ) &&
          probabilityMarkup.includes('Expected/500') &&
          probabilityMarkup.includes('Chance ≥1/500') &&
          probabilityMarkup.includes('Weighted random status rolls from the weapon only'),
        'Status probability table explains its 500-projectile weapon-roll scope',
      );
      assert(
        procProbability(3, 0) === 0 && procProbability(1.2, 1) === 1,
        'Status zero weight and guaranteed proc boundaries',
      );
      const arch = records(testDb, 'weapons').find((w) => /archgun/i.test(w.category));
      if (arch) {
        assert(
          arcaneCompatible(get(testDb, 'arcanes', 'primary-merciless'), arch, 0) &&
            arcaneCompatible(get(testDb, 'arcanes', 'secondary-merciless'), arch, 1) &&
            !arcaneCompatible(get(testDb, 'arcanes', 'secondary-merciless'), arch, 0),
          'Archgun slots accept Primary then Secondary arcanes',
        );
      }
      const saved = clone(testDb),
        build = defaultState(saved);
      saved.arsenal.records = [{ id: 'fixture-build', name: 'Fixture build', state: build }];
      assert(
        !validateDatabase(saved).length,
        'Saved arsenal builds validate against database references',
      );
      saved.arsenal.records[0].state.slots[0].id = 'missing-mod';
      assert(
        validateDatabase(saved).some((e) => e.includes('missing-mod')),
        'Missing saved-build references reject database imports',
      );
      assert(
        records(testDb, 'incarnon-evolutions').every(
          (e) => e.effects.length || e.nonDamageEffects?.length || e.limitations.length,
        ),
        'Every Incarnon choice has structured effects, utility effects or a specific limitation',
      );
      if (e && get(testDb, 'weapons', 'braton')) {
        const ss = defaultState(testDb);
        ss.weaponId = 'braton';
        ss.attackId = 'attack-0';
        const target = { ...e, statusImmune: false, statusCaps: {} },
          aw = calculateWeapon(testDb, ss);
        aw.damage = { corrosive: 100 };
        aw.total = 100;
        aw.sc = 1;
        aw.ms = 1;
        aw.rate = 10;
        aw.forced = {};
        aw.a = { ...aw.a, forcedProcs: [] };
        aw.bonus.statusDuration = 0;
        const cor = enemyComparison(testDb, ss, aw, target),
          original = cor.initial.stats.armor;
        assert(
          near(cor.armor, original * 0.74),
          'Next attack applies one guaranteed Corrosive proc',
        );
        assert(
          cor.locations.body.next.layers.health.hit > cor.locations.body.first.layers.health.hit,
          'Armor reduction improves follow-up health damage',
        );
        aw.sc = 0.5;
        const partial = enemyComparison(testDb, ss, aw, target);
        assert(
          near(
            partial.locations.body.next.layers.health.hit,
            (cor.locations.body.first.layers.health.hit +
              cor.locations.body.next.layers.health.hit) /
              2,
          ),
          'Follow-up damage averages proc outcomes instead of average armor',
        );
        aw.sc = 0;
        assert(
          near(enemyComparison(testDb, ss, aw, target).armor, original),
          'Corrosive damage without procs does not strip armor',
        );
        aw.damage = { heat: 100 };
        aw.sc = 1;
        assert(
          near(enemyComparison(testDb, ss, aw, target).armor, original),
          'Fast next attack precedes Heat armor reduction',
        );
        aw.rate = 2;
        assert(
          near(enemyComparison(testDb, ss, aw, target).armor, original * 0.85),
          'Heat starts with 15% strip after half a second',
        );
        aw.rate = 0.5;
        assert(
          near(enemyComparison(testDb, ss, aw, target).armor, original * 0.5),
          'Heat reaches 50% strip after two seconds',
        );
        aw.rate = 1 / 8;
        assert(
          near(enemyComparison(testDb, ss, aw, target).armor, original * 0.6),
          'Heat armor reduction recovers in steps after expiry',
        );
        aw.rate = 1 / 12;
        assert(
          near(enemyComparison(testDb, ss, aw, target).armor, original),
          'Heat armor reduction fully recovers after twelve seconds',
        );
        aw.rate = 0.5;
        aw.bonus.statusDuration = 1;
        assert(
          near(enemyComparison(testDb, ss, aw, target).armor, original * 0.7),
          'Status duration slows Heat armor-strip ramp',
        );
        aw.bonus.statusDuration = 0;
        aw.damage = { corrosive: 100 };
        aw.rate = 10;
        aw.sc = 14;
        ss.scenario.corrosiveCap = 10;
        assert(
          near(enemyComparison(testDb, ss, aw, target).armor, original * 0.2),
          'Default Corrosive cap prevents false full strip',
        );
        ss.scenario.corrosiveCap = 14;
        const full = enemyComparison(testDb, ss, aw, target);
        assert(
          full.armor === 0 && near(full.fullStripChance, 1),
          'Raised Corrosive cap permits full armor strip at fourteen stacks',
        );
        target.statusImmune = true;
        assert(
          near(enemyComparison(testDb, ss, aw, target).armor, original),
          'Status immunity prevents proc-induced armor stripping',
        );
      }

      return { passed, ok: true };
    } catch (e) {
      return { passed, ok: false, error: e.message };
    }
  }
  API.runChecks = runChecks;
  function normalizeWeaponRecord(w) {
    if (Array.isArray(w.polarities)) w.polarities = w.polarities.map(normalizePolarity);
    if ('exilusPolarity' in w) w.exilusPolarity = normalizePolarity(w.exilusPolarity);
    if ('stancePolarity' in w) w.stancePolarity = normalizePolarity(w.stancePolarity);
    return w;
  }
  function normalizeWeaponDatabase(weapons) {
    for (const w of weapons?.records || []) normalizeWeaponRecord(w);
    return weapons;
  }
  function restoreIncarnonCatalog(savedDb) {
    const bundledWeapons = bundled.weapons?.records || [];
    for (const w of savedDb.weapons?.records || []) {
      const fresh = bundledWeapons.find((x) => x.id === w.id);
      if (!fresh) continue;
      for (const key of ['incarnonVariant', 'incarnonImage', 'incarnonImageSource'])
        if (!w[key] && fresh[key]) w[key] = fresh[key];
      if (!Array.isArray(w.polarities) && Array.isArray(fresh.polarities))
        w.polarities = clone(fresh.polarities);
      for (const key of ['exilusPolarity', 'stancePolarity'])
        if (!(key in w) && key in fresh) w[key] = fresh[key];
      const freshAttacks = new Map(arr(fresh.attacks).map((a) => [a.id, a]));
      for (const attack of arr(w.attacks)) {
        const source = freshAttacks.get(attack.id);
        if (source?.componentOf && !attack.componentOf && attack.name === source.name)
          attack.componentOf = source.componentOf;
      }
      normalizeWeaponRecord(w);
    }
    const saved = savedDb['incarnon-evolutions'];
    if (!saved) return;
    const known = new Set((saved.records || []).map((e) => e.id));
    for (const e of bundled['incarnon-evolutions']?.records || [])
      if (!known.has(e.id)) saved.records.push(clone(e));
  }
  function restoreModRankDescriptions(savedDb) {
    for (const mod of records(savedDb, 'mods')) {
      const fresh = get(bundled, 'mods', mod.id);
      if (!fresh) continue;
      if (
        !mod.rankDescriptions &&
        fresh.rankDescriptions &&
        mod.maxRank === fresh.maxRank &&
        mod.description === fresh.description
      )
        mod.rankDescriptions = clone(fresh.rankDescriptions);
      if (!mod.icon && fresh.icon) mod.icon = fresh.icon;
      if (!mod.rarity && fresh.rarity) mod.rarity = fresh.rarity;
      if (
        mod.type === 'Aura' &&
        !mod.effects?.length &&
        fresh.effects?.length &&
        mod.description === fresh.description
      ) {
        mod.effects = clone(fresh.effects);
        mod.rankEffects = clone(fresh.rankEffects);
        mod.limitations = clone(fresh.limitations);
      }
      if (
        mod.id === 'toxin-resistance' &&
        mod.effects?.length === 1 &&
        mod.effects[0].stat === 'element:toxin' &&
        mod.effects[0].value === 0.15
      ) {
        mod.effects = [];
        mod.rankEffects = clone(fresh.rankEffects);
      }
    }
  }
  function restoreRivenSpliceRanges(savedDb) {
    const saved = savedDb['riven-splices'],
      fresh = records(bundled, 'riven-splices');
    if (!saved) return;
    for (const recipe of saved.records || []) {
      const source = fresh.find((r) => r.id === recipe.id);
      if (source && !recipe.baseValues && source.baseValues) {
        recipe.baseValues = clone(source.baseValues);
        recipe.rangeStatus = source.rangeStatus;
        recipe.rangeNote = source.rangeNote;
      }
    }
  }
  function restoreArcaneRarities(catalogue) {
    let changed = false;
    for (const arcane of records(catalogue, 'arcanes')) {
      const fresh = get(bundled, 'arcanes', arcane.id);
      if (!arcane.rarity && fresh?.rarity) {
        arcane.rarity = fresh.rarity;
        changed = true;
      }
    }
    return changed;
  }
  function restoreShardData(savedDb) {
    let changed = false;
    for (const id of [
      'archon-azure-maximum-energy',
      'archon-violet-primary-electricity-damage',
      'archon-violet-melee-critical-damage',
      'archon-violet-health-and-energy-pickups',
    ]) {
      const shard = get(savedDb, 'archon-shards', id),
        fresh = get(bundled, 'archon-shards', id);
      if (!shard || !fresh) continue;
      const oldVioletMelee =
        id === 'archon-violet-melee-critical-damage' &&
        shard.description === '+25% Melee Critical Damage; doubles above 500 maximum Energy.' &&
        !arr(shard.effects).length;
      if (oldVioletMelee) {
        shard.description = fresh.description;
        shard.effects = clone(fresh.effects);
        shard.limitations = clone(fresh.limitations);
        changed = true;
      }
      if (
        (shard.description === fresh.description || oldVioletMelee) &&
        fresh.displayEffects &&
        !shard.displayEffects
      ) {
        shard.displayEffects = clone(fresh.displayEffects);
        changed = true;
      }
      if (
        id === 'archon-azure-maximum-energy' &&
        shard.description === fresh.description &&
        shard.maximumEnergyBonus == null
      ) {
        shard.maximumEnergyBonus = fresh.maximumEnergyBonus;
        shard.tauMaximumEnergyBonus = fresh.tauMaximumEnergyBonus;
        changed = true;
      }
    }
    if (changed) databaseDirty = true;
  }
  function restoreArcaneData(savedDb) {
    savedDb['archon-shards'] ||= clone(bundled['archon-shards']);
    restoreShardData(savedDb);
    if (restoreArcaneRarities(savedDb)) databaseDirty = true;
    for (const arcane of records(savedDb, 'arcanes')) {
      arcane.maxStacks = arcaneStackCap(arcane);
      const fresh = get(bundled, 'arcanes', arcane.id);
      if (
        fresh &&
        arcane.description === fresh.description &&
        fresh.effects?.length &&
        arcane.limitations?.some((n) => /not been modeled/.test(n))
      ) {
        arcane.effects = clone(fresh.effects);
        arcane.rankEffects = clone(fresh.rankEffects);
        arcane.limitations = clone(fresh.limitations);
      }
    }
  }
  function renderImageAssetControls() {
    $('image-mode').value = assetMode;
    $('image-mode-label').textContent = assetMode.toUpperCase();
    $('artwork-mode-text').textContent =
      assetMode === 'local'
        ? 'Primary Asset source: LOCAL ASSETS >> Fallback: REMOTE ASSETS'
        : 'Primary Asset source: REMOTE ASSETS >> Fallback: LOCAL ASSETS';
    $('artwork-mode-indicator').title =
      assetMode === 'local'
        ? 'Load local images first; use online sources when a local image is missing.'
        : 'Load online images first; use local copies when an online image fails.';
    $('image-download-status').textContent =
      assetMode === 'local'
        ? 'Using local images where available; missing images fall back to their online sources.'
        : 'Using online image sources. Download images to make artwork available offline.';
    try {
      const summary = sessionStorage.getItem(ASSET_DOWNLOAD_SUMMARY_KEY);
      if (summary) {
        $('image-download-status').textContent = summary;
        sessionStorage.removeItem(ASSET_DOWNLOAD_SUMMARY_KEY);
      }
    } catch (error) {
      reportOptionalFailure('Image download summary could not be restored', error);
    }
  }
  async function fetchAssetBlob(url, signal) {
    const attempt = async (source) => {
      const response = await fetch(source, {
        signal: AbortSignal.any([signal, AbortSignal.timeout(60000)]),
      });
      if (!response.ok) throw Error('HTTP ' + response.status);
      const blob = await response.blob();
      if (!blob.type.startsWith('image/')) throw Error('Source did not return an image');
      return blob;
    };
    try {
      return await attempt(url);
    } catch (firstError) {
      if (signal.aborted) throw firstError;
      const proxy = 'https://images.weserv.nl/?url=' + encodeURIComponent(url);
      try {
        return await attempt(proxy);
      } catch (secondError) {
        throw Error(firstError.message + '; image proxy: ' + secondError.message);
      }
    }
  }
  function showImageDownloadHelp() {
    const dialog = $('image-download-help');
    if (!dialog.open) dialog.showModal();
  }
  async function downloadImagesLocally() {
    const button = $('download-images-locally'),
      status = $('image-download-status');
    if (!global.showDirectoryPicker) {
      status.textContent =
        'Folder-write access is unavailable in this browser or page. Use Chrome or Edge, or see “How to download images” for the Python fallback.';
      return;
    }
    let folder;
    try {
      folder = await global.showDirectoryPicker({ id: 'void-arsenal-images', mode: 'readwrite' });
      await folder.getFileHandle('index.html');
      assetFolder = folder;
    } catch (error) {
      if (error.name !== 'AbortError')
        status.textContent =
          'Folder selection failed: ' +
          error.message +
          '. Select the folder containing index.html, or see “How to download images” for help.';
      return;
    }
    const assets = Object.entries(ASSET_SOURCES),
      total = assets.length,
      failures = [];
    let next = 0,
      done = 0,
      saved = 0,
      skipped = 0;
    const dialog = $('image-download-dialog'),
      progress = $('image-download-progress'),
      counts = $('image-download-counts'),
      heading = $('image-download-heading'),
      details = $('image-download-details'),
      cancel = $('image-download-cancel'),
      useLocal = $('image-download-local'),
      keepSource = $('image-download-remote'),
      controller = new AbortController();
    const updateProgress = (force = false) => {
      progress.value = done;
      if (force || done % 25 === 0 || done === total)
        counts.textContent =
          done +
          ' / ' +
          total +
          ' checked · ' +
          saved +
          ' downloaded · ' +
          skipped +
          ' already present · ' +
          failures.length +
          ' failed';
    };
    progress.max = total;
    progress.value = 0;
    heading.textContent = 'Downloading images to ' + folder.name;
    counts.textContent = '0 / ' + total + ' checked';
    details.textContent = '';
    cancel.hidden = false;
    useLocal.hidden = true;
    keepSource.hidden = true;
    dialog.oncancel = (event) => {
      event.preventDefault();
      if (cancel.hidden) dialog.close();
      else if (!controller.signal.aborted) controller.abort();
    };
    cancel.onclick = () => {
      controller.abort();
      cancel.disabled = true;
      heading.textContent = 'Stopping image download…';
    };
    button.disabled = true;
    cancel.disabled = false;
    status.textContent = 'Downloading ' + total + ' images…';
    dialog.showModal();
    const worker = async () => {
      while (!controller.signal.aborted && next < total) {
        const [local, url] = assets[next++];
        try {
          const parts = local.split('/');
          if (
            parts.shift() !== 'images' ||
            parts.some(
              (part) => !part || part === '.' || part === '..' || !/^[a-zA-Z0-9_.-]+$/.test(part),
            )
          )
            throw Error('Unsafe image path');
          let directory = await folder.getDirectoryHandle('images', { create: true });
          for (const part of parts.slice(0, -1))
            directory = await directory.getDirectoryHandle(part, { create: true });
          let file;
          try {
            file = await directory.getFileHandle(parts.at(-1));
          } catch (error) {
            if (error.name !== 'NotFoundError') throw error;
          }
          if (file && (await file.getFile()).size > 0) {
            skipped++;
          } else {
            const blob = await fetchAssetBlob(url, controller.signal);
            if (controller.signal.aborted) continue;
            const target = file || (await directory.getFileHandle(parts.at(-1), { create: true })),
              writer = await target.createWritable();
            try {
              if (controller.signal.aborted) {
                await writer.abort();
                continue;
              }
              await writer.write(blob);
              if (controller.signal.aborted) {
                await writer.abort();
                continue;
              }
              await writer.close();
              saved++;
            } catch (error) {
              await writer.abort().catch(() => {});
              throw error;
            }
          }
        } catch (error) {
          if (!controller.signal.aborted) failures.push(local + ': ' + error.message);
        } finally {
          done++;
          updateProgress();
        }
      }
    };
    try {
      await Promise.all(Array.from({ length: 4 }, worker));
      updateProgress(true);
      const summary =
        saved +
        ' images downloaded, ' +
        skipped +
        ' already present' +
        (failures.length ? ', ' + failures.length + ' failed.' : '.');
      status.textContent = (controller.signal.aborted ? 'Download canceled · ' : '') + summary;
      cancel.hidden = true;
      keepSource.hidden = false;
      keepSource.textContent = controller.signal.aborted
        ? 'Close'
        : assetMode === 'local'
          ? 'Keep Local Images'
          : 'Stay Remote';
      keepSource.onclick = () => dialog.close();
      if (controller.signal.aborted) {
        heading.textContent = 'Image download canceled';
        details.textContent =
          'Files already downloaded were kept. Run the download again to continue.';
      } else {
        heading.textContent = 'Image download complete';
        details.textContent = failures.length
          ? 'Some images could not be saved. Local mode will use remote sources for missing files. First failures: ' +
            failures.slice(0, 5).join('; ')
          : 'Switch to Local images to use the downloaded files?';
        useLocal.hidden = assetMode === 'local';
        useLocal.onclick = () => {
          try {
            localStorage.setItem(ASSET_MODE_KEY, 'local');
          } catch (error) {
            dialog.close();
            notify(
              'Images were downloaded, but Local Images could not be saved: ' + error.message,
              true,
            );
            return;
          }
          assetMode = 'local';
          try {
            sessionStorage.setItem(ASSET_DOWNLOAD_SUMMARY_KEY, summary);
          } catch (error) {
            reportOptionalFailure('Image download summary could not be saved', error);
          }
          dialog.close();
          location.reload();
        };
      }
    } finally {
      button.disabled = false;
      if (assetFolder)
        countLocalAssets().catch((error) =>
          notify('Could not count local assets: ' + error.message, true),
        );
    }
  }
  function bind() {
    renderImageAssetControls();
    if (!$('record-tweaks'))
      $('record-fields').insertAdjacentHTML(
        'afterend',
        '<div id="record-tweaks" class="hint"></div>',
      );
    for (const category of CATEGORIES)
      if (!$('database-category').querySelector('option[value="' + category + '"]'))
        $('database-category').add(new Option(category.replaceAll('-', ' '), category));
    for (const button of document.querySelectorAll('[data-check-online]'))
      button.textContent = 'Sync all sourced data';
    countLocalAssets();
    $('connect-assets-folder').onclick = () =>
      chooseAssetFolder().catch((error) => {
        if (error.name !== 'AbortError') notify('Folder access failed: ' + error.message, true);
      });
    $('export-assets-zip').onclick = exportAssetsZip;
    $('import-assets-zip').onclick = () => $('assets-zip-file').click();
    $('assets-zip-file').onchange = () => importAssetsZip($('assets-zip-file').files[0]);
    $('export-data-zip').onclick = exportDataZip;
    $('import-data-zip').onclick = () => $('data-zip-file').click();
    $('data-zip-file').onchange = () => importDataZip($('data-zip-file').files[0]);
    const folderButton = $('connect-data-folder');
    folderButton.hidden = false;
    $('import-data-zip').after(folderButton);
    if (!document.querySelector('[data-check-online]'))
      folderButton.insertAdjacentHTML(
        'afterend',
        '<button type="button" data-check-online>Sync all sourced data</button>',
      );
    folderButton.onclick = connectDataFolder;
    $('local-asset-counts').after($('online-progress'));
    $('online-progress').hidden = false;
    $('download-images-locally').onclick = downloadImagesLocally;
    $('show-image-download-help').onclick = () => showImageDownloadHelp();
    $('close-image-download-help').onclick = () => $('image-download-help').close();
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.polarity-picker')) closePolarityMenus();
    });
    $('image-mode').onchange = () => {
      const previous = assetMode;
      assetMode = $('image-mode').value === 'local' ? 'local' : 'remote';
      try {
        localStorage.setItem(ASSET_MODE_KEY, assetMode);
      } catch (error) {
        assetMode = previous;
        $('image-mode').value = previous;
        notify('Image source preference could not be saved: ' + error.message, true);
        return;
      }
      location.reload();
    };
    const ttkProfilesRoot = $('ttk-profiles'),
      ttkGraphDialog = $('ttk-graph-dialog'),
      ttkGraphDialogContent = $('ttk-graph-dialog-content'),
      ttkGraphDialogTitle = $('ttk-graph-dialog-title');
    const openTtkGraph = (wrap) => {
      if (!wrap || !ttkGraphDialog || !ttkGraphDialogContent) return;
      const profile = wrap.closest('.ttk-profile'),
        heading = profile?.querySelector('h3')?.textContent?.trim() || 'Selected enemy';
      ttkGraphDialogTitle.textContent = heading;
      ttkGraphDialogContent.replaceChildren(wrap.cloneNode(true));
      const clone = ttkGraphDialogContent.querySelector('.ttk-graph-wrap');
      clone?.removeAttribute('role');
      clone?.removeAttribute('tabindex');
      clone?.removeAttribute('title');
      clone?.removeAttribute('aria-label');
      ttkGraphDialog.showModal();
    };
    ttkProfilesRoot?.addEventListener('click', (e) => {
      const wrap = e.target.closest('.ttk-graph-wrap[role="button"]');
      if (wrap) openTtkGraph(wrap);
    });
    ttkProfilesRoot?.addEventListener('keydown', (e) => {
      const wrap = e.target.closest('.ttk-graph-wrap[role="button"]');
      if (wrap && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        openTtkGraph(wrap);
      }
    });
    $('close-ttk-graph-dialog').onclick = () => ttkGraphDialog.close();
    for (const b of document.querySelectorAll('[data-check-online]'))
      b.onclick = checkOnlineUpdates;
    $('connect-data-folder').onclick = connectDataFolder;
    $('connect-online-folder').onclick = async () => {
      await connectDataFolder();
      if (dataDirectory) {
        onlineDraft = null;
        $('online-dialog').close();
        await checkOnlineUpdates();
      }
    };
    $('apply-online').onclick = applyOnlineUpdates;
    $('online-dialog').oncancel = (e) => {
      if (onlineBusy) e.preventDefault();
    };
    $('cancel-online').onclick = () => {
      if (!onlineBusy) {
        onlineDraft = null;
        $('online-dialog').close();
      }
    };
    for (const b of document.querySelectorAll('[data-view]'))
      b.onclick = () => showView(b.dataset.view);
    $('check-tenet-wiki').onclick = () => checkProgenitorWiki('tenet-offerings');
    $('check-coda-wiki').onclick = () => checkProgenitorWiki('coda-offerings');
    $('progenitor-library-search').oninput = renderProgenitorLibrary;
    $('progenitor-library-filter').onchange = renderProgenitorLibrary;
    bindArsenal();
    $('attack-select').onchange = () => {
      state.attackId = $('attack-select').value;
      renderEvolutionControls();
      schedule();
    };
    $('mod-picker-search').oninput = renderModPicker;
    $('mod-picker-list').onscroll = hideModPickerPreview;
    $('close-mod-picker').onclick = () => $('mod-picker').close();
    $('mod-picker').addEventListener('close', () => {
      hideModPickerPreview();
      modPickerSlot = -1;
    });
    $('clear-mod-selection').onclick = () => {
      if (modPickerSlot < 0) return;
      const s = modSlotState(modPickerSlot);
      s.id = '';
      s.rank = 0;
      s.stacks = 0;
      s.uptime = 100;
      modPickerSlot = -1;
      $('mod-picker').close();
      renderMods();
      schedule();
    };
    $('loadout-choice-search').oninput = renderLoadoutChoicePicker;
    $('close-loadout-choice').onclick = closeLoadoutChoicePicker;
    $('clear-loadout-choice').onclick = clearLoadoutChoice;
    $('loadout-choice-picker').addEventListener('close', () => {
      loadoutPicker = { kind: '', slot: -1 };
    });
    const levelChange = (value) => {
      state.scenario.level = Math.round(clamp(value, 1, 9999));
      $('enemy-level').value = state.scenario.level;
      $('enemy-level-number').value = state.scenario.level;
      schedule();
    };
    $('enemy-level').oninput = (e) => levelChange(e.target.value);
    $('enemy-level-number').oninput = (e) => {
      if (e.target.value !== '') levelChange(e.target.value);
    };
    $('enemy-level-number').onchange = (e) => levelChange(e.target.value);
    $('reset-level').onclick = () => levelChange(100);
    for (const [id, [path, min, max]] of Object.entries(inputMap))
      $(id).oninput = (e) => {
        let value = clamp(e.target.value, min, max);
        if (path === 'scenario.corrosiveCap') {
          value = Math.round(value);
          e.target.value = value;
        }
        setPath(state, path, value);
        schedule();
      };
    for (const [id, field] of [
      ['steel-path', 'steelPath'],
      ['eximus', 'eximus'],
    ])
      $(id).onchange = (e) => {
        state.scenario[field] = e.target.checked;
        schedule();
      };
    for (const id of ['catalyst', 'adapter', 'gilded'])
      $(id).onchange = (e) => {
        state[id] = e.target.checked;
        schedule();
      };
    $('progenitor-element').onchange = (e) => {
      state.progenitor = e.target.value;
      schedule();
    };
    for (const el of document.querySelectorAll('[data-status]'))
      el.oninput = () => {
        state.scenario.stacks[el.dataset.status] = clamp(el.value, 0, +el.max);
        schedule();
      };
    $('faction-filter').onchange = schedule;
    $('enemy-select-search').onfocus = (e) => renderEnemySelectorResults(e.target.value, true);
    $('enemy-select-search').oninput = (e) => renderEnemySelectorResults(e.target.value, true);
    $('enemy-select-search').onkeydown = (e) => {
      const results = $('enemy-select-results'),
        items = [...results.querySelectorAll('[data-enemy-option]')];
      let active = items.findIndex((item) => item.classList.contains('active'));
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        renderEnemySelectorResults(e.target.value, true);
        const current = [...results.querySelectorAll('[data-enemy-option]')],
          nextIndex =
            e.key === 'ArrowDown'
              ? Math.min(current.length - 1, Math.max(-1, active) + 1)
              : Math.max(0, active < 0 ? current.length - 1 : active - 1);
        current.forEach((item, index) => {
          item.classList.toggle('active', index === nextIndex);
          item.setAttribute('aria-selected', String(index === nextIndex));
        });
        current[nextIndex]?.scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        const current = [...results.querySelectorAll('[data-enemy-option]')],
          choice =
            current.find((item) => item.classList.contains('active')) ||
            (current.length === 1 ? current[0] : null);
        if (choice) {
          e.preventDefault();
          choice.click();
        }
      } else if (e.key === 'Escape') {
        results.hidden = true;
        e.target.setAttribute('aria-expanded', 'false');
        e.target.value = get(db, 'enemies', state.enemyId)?.name || '';
      }
    };
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.enemy-selection-panel')) {
        $('enemy-select-results').hidden = true;
        $('enemy-select-search').setAttribute('aria-expanded', 'false');
      }
    });
    if (!$('filter-tweaked-records'))
      $('database-search')
        .closest('label')
        .insertAdjacentHTML(
          'afterend',
          '<button id="filter-tweaked-records" type="button" aria-pressed="false" title="Show only records with locally changed source fields">Show tweaked only</button>',
        );
    $('filter-tweaked-records').onclick = () => {
      const button = $('filter-tweaked-records'),
        active = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(active));
      button.classList.toggle('primary', active);
      button.textContent = active ? 'Showing tweaked · Show all' : 'Show tweaked only';
      renderEditorList();
    };
    if (!$('record-alpha-filter'))
      $('record-count').insertAdjacentHTML(
        'beforebegin',
        '<div id="record-alpha-filter" class="record-alpha-filter" role="group" aria-label="Filter records by starting letter">' +
          ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ']
            .map(
              (letter) =>
                '<button type="button" data-record-letter="' +
                (letter === 'All' ? '' : letter) +
                '" aria-pressed="' +
                (letter === 'All') +
                '" class="' +
                (letter === 'All' ? 'primary' : '') +
                '">' +
                letter +
                '</button>',
            )
            .join('') +
          '</div>',
      );
    for (const button of $('record-alpha-filter').querySelectorAll('[data-record-letter]'))
      button.onclick = () => {
        for (const option of $('record-alpha-filter').querySelectorAll('[data-record-letter]')) {
          const active = option === button;
          option.setAttribute('aria-pressed', String(active));
          option.classList.toggle('primary', active);
        }
        renderEditorList();
      };
    $('database-category').onchange = () => {
      selectedRecord = '';
      $('record-title').textContent = 'Select a record';
      $('record-json').value = '';
      $('record-fields').innerHTML = '';
      $('record-source').textContent = '';
      $('force-refresh-record').hidden = true;
      renderEditorList();
    };
    $('database-search').oninput = renderEditorList;
    $('new-record').onclick = () => newRecord();
    $('clone-record').onclick = () => newRecord(true);
    $('save-record').onclick = saveRecord;
    $('delete-record').onclick = deleteRecord;
    $('force-refresh-record').onclick = forceRefreshSelectedRecord;
    $('export-build').onclick = () =>
      download(
        'warframe-build.json',
        JSON.stringify({ format: 'void-arsenal-build', version: 1, state }, null, 2),
      );
    $('import-build').onclick = () => $('build-file').click();
    $('build-file').onchange = async () => {
      try {
        const file = $('build-file').files[0];
        if (!file) return;
        const d = JSON.parse(await file.text());
        if (d.format !== 'void-arsenal-build' || d.version !== 1)
          throw Error('Unrecognized build format.');
        if (!allowDiscard()) return;
        const defaults = defaultState(db);
        if (
          !get(db, 'weapons', d.state?.weaponId) ||
          !Array.isArray(d.state.slots) ||
          d.state.slots.length !== 8 ||
          !Array.isArray(d.state.arcanes) ||
          d.state.arcanes.length !== 4
        )
          throw Error('Build has invalid weapon or slots.');
        const candidate = {
          ...defaults,
          ...d.state,
          scenario: {
            ...defaults.scenario,
            ...d.state.scenario,
            stacks: { ...defaults.scenario.stacks, ...d.state.scenario?.stacks },
          },
        };
        candidate.scenario.level = Math.round(clamp(candidate.scenario.level, 1, 9999));
        state = normalizeBuild(db, candidate);
        activeBuildId = '';
        draftOpen = true;
        savedFingerprint = '';
        fillCatalogControls();
        renderWeaponControls();
        renderMods();
        renderArcanes();
        renderArchonShards();
        syncInputs();
        schedule();
        notify('Build imported.');
      } catch (e) {
        notify('Build import rejected: ' + e.message, true);
      } finally {
        $('build-file').value = '';
      }
    };
    $('apply-riven-splice').onclick = applyRivenSplice;
    $('add-existing-splice').onclick = addExistingRivenSplice;
    $('remove-riven-splice').onclick = () => {
      if (!rivenDraft) return;
      rivenDraft = clearRivenSplice(db, rivenDraft);
      renderRivenAttributes();
    };
    $('new-riven').onclick = newRiven;
    $('riven-library-search').oninput = renderRivenLibrary;
    $('save-riven').onclick = () => saveRiven();
    $('cancel-riven').onclick = () => {
      rivenDraft = null;
      rivenEditing = '';
      rivenSelectedWeaponId = '';
      closeRivenWeaponSearch();
      renderRivenList();
    };
    $('delete-riven').onclick = () => {
      if (!rivenEditing) return;
      if (
        records(db, 'arsenal').some((b) =>
          buildReferences(b.state).some(([c, id]) => c === 'rivens' && id === rivenEditing),
        )
      ) {
        notify('This Riven is referenced by a saved arsenal build.', true);
        return;
      }
      if (!confirm('Delete this custom Riven? This cannot be undone.')) return;
      const deletedId = rivenEditing;
      db.rivens.records = db.rivens.records.filter((r) => r.id !== deletedId);
      databaseDirty = true;
      for (const slot of state.slots) if (slot.id === 'riven:' + deletedId) slot.id = '';
      rivenDraft = null;
      rivenEditing = '';
      renderRivenList();
      renderMods();
      persist();
      schedule();
      notify('Riven deleted.');
    };
    for (const [id, key] of [
      ['riven-name', 'name'],
      ['riven-layout', 'layout'],
      ['riven-rank', 'rank'],
      ['riven-polarity', 'polarity'],
      ['riven-mastery', 'mastery'],
    ])
      $(id).oninput = () => {
        if (!rivenDraft) return;
        rivenDraft[key] =
          key === 'rank'
            ? clamp($('riven-rank').value, 0, 8)
            : key === 'mastery'
              ? clamp($('riven-mastery').value, 8, 16)
              : $(id).value;
        if (key === 'layout' || key === 'rank') renderRivenAttributes();
        else renderRivenPreview();
      };
    $('riven-family').onchange = () => {
      const family = $('riven-family').value,
        weapon = records(db, 'weapons')
          .filter((w) => w.family === family && w.rivenDisposition != null)
          .sort((a, b) => a.name.localeCompare(b.name))[0];
      if (weapon) selectRivenWeapon(weapon.id);
    };
    $('riven-weapon-model').onchange = () => selectRivenWeapon($('riven-weapon-model').value);
    $('riven-weapon-search').onfocus = (e) => {
      if (rivenDraft) renderRivenWeaponSearch(e.target.value);
    };
    $('riven-weapon-search').oninput = (e) => renderRivenWeaponSearch(e.target.value);
    $('riven-weapon-search').onblur = closeRivenWeaponSearch;
    $('riven-weapon-search').onkeydown = (e) => {
      const results = $('riven-weapon-results'),
        buttons = [...results.querySelectorAll('[data-riven-weapon]')];
      if (e.key === 'Escape') {
        closeRivenWeaponSearch();
        return;
      }
      if (e.key === 'Enter' && buttons.length) {
        e.preventDefault();
        selectRivenWeapon(buttons[0].dataset.rivenWeapon);
      }
    };
    $('help').onclick = showGuide;
    $('close-guide').onclick = () => $('guide').close();
    $('run-tests').onclick = () => {
      const r = runChecks();
      $('test-output').textContent =
        r.passed.map((n) => 'PASS ' + n).join('\n') +
        '\n' +
        (r.ok ? 'All ' + r.passed.length + ' checks passed.' : 'FAIL ' + r.error);
    };
  }
  async function boot() {
    try {
      for (const c of CATEGORIES) {
        const el = $('data-' + c);
        if (!el) throw Error('Missing embedded dataset: ' + c);
        bundled[c] = JSON.parse(el.textContent);
      }
      normalizeWeaponDatabase(bundled.weapons);
      let saved = null,
        legacyDatabase = null,
        indexedCategories = {},
        indexedAvailable = true;
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) saved = JSON.parse(stored);
      } catch {
        $('storage-notice').hidden = false;
        $('storage-notice').textContent =
          'The saved session could not be read. Your bundled database is still available; import arsenal.json to recover saved builds.';
      }
      try {
        indexedCategories = await readCatalogueDatabase();
      } catch (error) {
        indexedAvailable = false;
        const notice = $('storage-notice');
        if (notice) {
          notice.hidden = false;
          notice.textContent =
            'IndexedDB is unavailable: ' +
            error.message +
            '. The bundled database can still be used, but database edits cannot be saved in this browser.';
        }
      }
      const hasIndexedCatalogue = CATEGORIES.some((c) => c !== 'arsenal' && indexedCategories[c]);
      db = clone(bundled);
      if (hasIndexedCatalogue) {
        for (const c of CATEGORIES)
          if (c !== 'arsenal' && indexedCategories[c]) db[c] = indexedCategories[c];
      } else if (saved?.db) {
        legacyDatabase = saved.db;
        db = legacyDatabase;
      }
      if (saved?.arsenal?.category === 'arsenal' && Array.isArray(saved.arsenal.records))
        db.arsenal = saved.arsenal;
      else if (
        saved?.db?.arsenal?.category === 'arsenal' &&
        Array.isArray(saved.db.arsenal.records)
      )
        db.arsenal = saved.db.arsenal;
      db.arsenal ||= clone(bundled.arsenal);
      db['riven-splices'] ||= clone(bundled['riven-splices']);
      db['archon-shards'] ||= clone(bundled['archon-shards']);
      db['progenitor-library'] ||= clone(bundled['progenitor-library']);
      restoreIncarnonCatalog(db);
      restoreModRankDescriptions(db);
      restoreRivenSpliceRanges(db);
      restoreArcaneData(db);
      syncProgenitorLibraryFromWeapons(db);
      const legacyFormat = !!legacyDatabase && !legacyDatabase.arsenal;
      if (legacyFormat) {
        const previous = db['incarnon-evolutions'];
        if (previous)
          for (const fresh of bundled['incarnon-evolutions'].records) {
            const i = previous.records.findIndex((e) => e.id === fresh.id);
            if (
              i >= 0 &&
              !previous.records[i].effectSchemaVersion &&
              recordFingerprint(previous.records[i]) === fresh.legacyFingerprint
            )
              previous.records[i] = clone(fresh);
          }
      }
      let errors = validateDatabase(db);
      if (errors.length) {
        if (hasIndexedCatalogue) {
          const notice = $('storage-notice');
          if (notice) {
            notice.hidden = false;
            notice.textContent =
              'The saved IndexedDB catalogue failed validation and was ignored: ' +
              errors[0] +
              '. Bundled data will be used.';
          }
          db = clone(bundled);
          db.arsenal = saved?.arsenal || saved?.db?.arsenal || clone(bundled.arsenal);
          restoreIncarnonCatalog(db);
          restoreModRankDescriptions(db);
          restoreRivenSpliceRanges(db);
          restoreArcaneData(db);
          syncProgenitorLibraryFromWeapons(db);
          errors = validateDatabase(db);
        }
        if (errors.length) throw Error(errors[0]);
      }
      state = defaultState(db);
      if (saved) {
        if (saved.state) {
          state = normalizeBuild(db, saved.state);
          activeBuildId = saved.activeBuildId || '';
          draftOpen = !!saved.draftOpen;
          recoveredDraft = saved.recoveredDraft || (legacyFormat ? saved.state : null);
          restoredSession = true;
        } else if (saved.version === 2) {
          activeBuildId = saved.activeBuildId || '';
          draftOpen = !!saved.draftOpen;
          recoveredDraft = saved.recoveredDraft || null;
          restoredSession = true;
        }
      }
      if (legacyFormat && recoveredDraft) {
        const choices = {};
        for (const id of Object.values(recoveredDraft.evolutions || {})) {
          const e = get(db, 'incarnon-evolutions', id);
          if (e) choices[e.tier] = id;
        }
        recoveredDraft.evolutions = choices;
      }
      try {
        const rawDraft = localStorage.getItem(BUILD_DRAFT_STORAGE_KEY);
        if (rawDraft) {
          const savedDraft = JSON.parse(rawDraft);
          if (savedDraft?.state) {
            state = normalizeBuild(db, savedDraft.state);
            activeBuildId = savedDraft.activeBuildId || '';
            draftOpen = !!savedDraft.draftOpen;
            restoredSession = true;
          }
        }
      } catch {
        $('storage-notice').hidden = false;
        $('storage-notice').textContent =
          'The active build draft could not be restored. Saved arsenal profiles remain available.';
      }
      if ($('embedded-build') && !localStorageAvailable())
        state = normalizeBuild(db, JSON.parse($('embedded-build').textContent));
      if ($('embedded-session') && !localStorageAvailable()) {
        const session = JSON.parse($('embedded-session').textContent);
        activeBuildId = session.activeBuildId || '';
        draftOpen = !!session.draftOpen;
      }
      if (activeBuildId && !get(db, 'arsenal', activeBuildId)) activeBuildId = '';
      if (draftOpen) applyOwnedProgenitor(state);
      if (!restoredSession && !$('embedded-session') && !draftOpen && db.arsenal.records.length) {
        const b = db.arsenal.records[0];
        state = normalizeBuild(db, b.state);
        applyOwnedProgenitor(state);
        activeBuildId = b.id;
        draftOpen = true;
      }
      savedFingerprint = activeBuildId
        ? JSON.stringify(normalizeBuild(db, get(db, 'arsenal', activeBuildId).state))
        : '';
      for (const c of ['weapons', 'mods', 'arcanes', 'enemies'])
        for (const r of records(db, c)) {
          const fresh = get(bundled, c, r.id);
          if (!Object.hasOwn(r, 'image') && fresh?.image) {
            r.image = fresh.image;
            r.imageSource = fresh.imageSource;
          }
          if (c !== 'mods' || !fresh) continue;
          if (fresh.iconSource && !r.iconSource) {
            r.iconSource = fresh.iconSource;
            r.icon = fresh.icon;
            r.iconFallback = fresh.iconFallback;
            databaseDirty = hasIndexedCatalogue || !!legacyDatabase;
          } else if (
            r.iconSource?.startsWith('https://wiki.warframe.com/w/File:') &&
            r.iconSource !== fresh.iconSource
          ) {
            if (r.icon?.startsWith('images/mods/icons/wiki/') || r.icon === r.iconFallback)
              r.icon = fresh.icon || fresh.image;
            if (fresh.iconSource) r.iconSource = fresh.iconSource;
            else delete r.iconSource;
            if (fresh.iconFallback) r.iconFallback = fresh.iconFallback;
            databaseDirty = hasIndexedCatalogue || !!legacyDatabase;
          }
        }
      if (db['incarnon-evolutions'].onlinePageHashVersion !== 2) {
        db['incarnon-evolutions'].onlinePageHashes = clone(
          bundled['incarnon-evolutions'].onlinePageHashes || {},
        );
        db['incarnon-evolutions'].onlinePageHashVersion = 2;
        databaseDirty = hasIndexedCatalogue || !!legacyDatabase;
      }
      const iconRules = ruleOf(db),
        defaultIcons = ruleOf(bundled).statusIcons || {};
      iconRules.statusIcons ||= {};
      for (const [type, path] of Object.entries(defaultIcons))
        iconRules.statusIcons[type] = statusIconPath(iconRules, type) || path;
      autoSelectEvolutions(db, state);
      indexData();
      configureBuildPanels();
      $('status-controls').innerHTML = [
        'viral',
        'corrosive',
        'heat',
        'magnetic',
        'cold',
        'puncture',
      ]
        .map(
          (t) =>
            '<label>' +
            t[0].toUpperCase() +
            t.slice(1) +
            '<input data-status="' +
            t +
            '" type="number" min="0" max="' +
            (t === 'puncture' ? 5 : t === 'heat' ? 1 : 10) +
            '" value="0"></label>',
        )
        .join('');
      fillCatalogControls();
      renderWeaponControls();
      renderMods();
      renderArcanes();
      renderArchonShards();
      syncInputs();
      renderRivenList();
      bind();
      renderArsenalUI();
      renderCalculations();
      let savedView = 'calculator';
      try {
        const candidate = localStorage.getItem('void-arsenal-selected-view-v1');
        if (candidate && document.getElementById('view-' + candidate)) savedView = candidate;
      } catch (error) {
        reportOptionalFailure('Selected tab could not be restored', error);
      }
      showView(savedView);
      if (legacyDatabase && indexedAvailable && !hasIndexedCatalogue) {
        try {
          await writeCatalogueDatabase(db);
          databaseDirty = false;
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionSnapshot()));
          } catch {
            localStorage.removeItem(STORAGE_KEY);
            persistSession();
          }
        } catch (error) {
          legacyStorageUnmigrated = true;
          const notice = $('storage-notice');
          if (notice) {
            notice.hidden = false;
            notice.textContent =
              'Your previous catalogue is loaded, but its migration to IndexedDB failed: ' +
              error.message +
              '. The original saved data was kept; use Export Data to back up a ZIP before clearing browser data.';
          }
        }
      } else if (legacyDatabase && !indexedAvailable) legacyStorageUnmigrated = true;
      else if (databaseDirty) persistCatalogue();
      else if (saved?.version === 2) persistSession();
      void refreshMissingProgenitorData();
      if (location.hash === '#checks') {
        showGuide();
        $('run-tests').click();
      }
    } catch (e) {
      document.querySelector('main').innerHTML =
        '<div class="error">Unable to initialize: ' +
        escape(e.message) +
        '. Ensure all embedded datasets are present.</div>';
      console.error(e);
    }
  }

  function localStorageAvailable() {
    try {
      return !!(localStorage.getItem(STORAGE_KEY) || localStorage.getItem(BUILD_DRAFT_STORAGE_KEY));
    } catch {
      return false;
    }
  }
  API.getArsenal = () => arsenalExport(db, bundled);
  API.getActiveBuild = () => ({ id: activeBuildId, draftOpen, unsaved: unsavedBuild() });
  API.previewArsenal = importArsenalCandidate;
  API.getDatabase = () => clone(db);
  API.getState = () => clone(state);
  API.getResult = () => {
    const w = calculateWeapon(db, state);
    return { weapon: w, enemy: calculateEnemy(db, state, w, get(db, 'enemies', state.enemyId)) };
  };
  if (typeof document !== 'undefined') boot();
  else if (typeof WorkerGlobalScope !== 'undefined' && global instanceof WorkerGlobalScope) {
    let workerDb = null;
    global.onmessage = (event) => {
      const message = event.data || {};
      try {
        if (message.type === 'init') {
          workerDb = message.db;
          global.postMessage({ type: 'ready' });
          return;
        }
        if (message.type === 'ttk' && workerDb) {
          const state = message.state,
            enemy = get(workerDb, 'enemies', message.enemyId),
            weapon = calculateWeapon(workerDb, state),
            result = compactTtkResult(simulateTtk(workerDb, state, weapon, enemy));
          global.postMessage({ type: 'ttk', id: message.id, result });
        }
      } catch (error) {
        global.postMessage({ type: 'error', id: message.id, message: error.message });
      }
    };
  }
})(typeof window !== 'undefined' ? window : globalThis);
