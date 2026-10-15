# Data sources and attribution

The main catalog JSON files and their embedded HTML copies were normalized from Warframe Wiki data on **11 October 2026**. Riven splice recipes were added from the official 7 October 2026 Icebind patch notes. Every category identifies its sources, and records retain their reference URL. The source's missing/sentinel values are preserved as unknown (`null`) with limitations rather than fabricated statistics.

## Catalogs

- [Weapons database](https://wiki.warframe.com/w/Module:Weapons/data): primary, secondary, melee, archwing, companion, railjack, modular, and miscellaneous partitions. Catalogued weapon slot, Exilus, and stance polarities are applied as build defaults; Aura/Omni source labels are stored as the calculator's universal polarity. [Update 41 notes](https://www.warframe.com/ja/patch-notes/ios/41-0-0) confirm the Vinquibus' Omni stance polarity and shared slot polarities across forms. Alternate fire modes remain separate; simultaneous projectile components use `componentOf` links so radial damage and status applications resolve on the same shot.
- [Enemies database](https://wiki.warframe.com/w/Module:Enemies/data): Grineer, Corpus, Infested, Orokin, Sentient, Stalker, Narmer, Murmur, Techrot, Scaldra, Anarch, and unaffiliated partitions. Base levels and body multipliers come from these partitions.
- [Mods database](https://wiki.warframe.com/w/Module:Mods/data) and [Arcane database](https://wiki.warframe.com/w/Module:Arcane/data): names, descriptions, ranks, polarities, compatibility and exclusions. Structured numeric effects were extracted from simple descriptions; complex effects remain flagged.
- [Archon Shard](https://wiki.warframe.com/w/Archon_Shard): shard trait descriptions, Tauforged scaling, weapon status/critical bonuses, Violet Electricity damage, Emerald Toxin status damage and Corrosive stack-limit increases. [Official Update 35 notes](https://www.warframe.com/en/patch-notes/pc/35-0-0) confirm Violet's Melee Critical Damage values and the over-500 maximum-Energy condition; the calculator's Energy input also counts equipped Azure Energy shards toward that threshold. Other survivability and utility traits can be selected for build tracking but do not directly change weapon damage or TTK. Primary Crux uses the sourced maximum of ten stacks; its user-selected stacks apply Status Chance and Ammo Efficiency, while TTK uses the increased shots per magazine.
- [Damage types database](https://wiki.warframe.com/w/Module:DamageTypes/data): current faction weaknesses and resistances, avoiding obsolete health-material modifiers.
- [Modular database](https://wiki.warframe.com/w/Module:Modular/data), [Amp](https://wiki.warframe.com/w/Amp), and [Stances](https://wiki.warframe.com/w/Module:Stances/data): sourced part statistics, braces and strike profiles. Weapon disposition comes from the selected weapon profile, rather than potentially older part-table dispositions.
- Individual Incarnon Genesis and innate Incarnon weapon pages: 331 choices across 35 existing families, with structured stat effects, variant tables, attack scope, condition controls and explicit unresolved source interactions. The audit retains all 312 previous IDs and adds missing choices. [Burston Incarnon Genesis](https://wiki.warframe.com/w/Burston_Incarnon_Genesis) supplies the +42 damage, final-burst multishot, flat magazine and critical chance fixtures. [Braton Incarnon Genesis](https://wiki.warframe.com/w/Braton_Incarnon_Genesis) supplies variant-specific values. Source markup is cleaned for readable previews; utility effects are distinguished from unresolved damage mechanics.

## Mechanics

- [Damage](https://wiki.warframe.com/w/Damage), [Damage Calculation](https://wiki.warframe.com/w/Damage/Calculation), [Enemy Level Scaling](https://wiki.warframe.com/w/Enemy_Level_Scaling), and [Armor](https://wiki.warframe.com/w/Armor).
- Damage calculation follows the documented 1/32 quantization of typed damage and 12-bit encoding of critical multipliers. The selected-enemy popup fixture is Burston Prime at level 100 against Arid Lancer and Elite Crewman, with the three specified Incarnon evolutions.
- [Enemy Body Parts](https://wiki.warframe.com/w/Enemy_Body_Parts), [Primary Acuity](https://wiki.warframe.com/w/Primary_Acuity), and [Status Effect](https://wiki.warframe.com/w/Status_Effect).
- Individual [Slash](https://wiki.warframe.com/w/Damage/Slash_Damage), [Heat](https://wiki.warframe.com/w/Damage/Heat_Damage), [Toxin](https://wiki.warframe.com/w/Damage/Toxin_Damage), [Electricity](https://wiki.warframe.com/w/Damage/Electricity_Damage), [Gas](https://wiki.warframe.com/w/Damage/Gas_Damage), and [Blast](https://wiki.warframe.com/w/Damage/Blast_Damage) pages for damaging-proc coefficients and duration rules.
- [Riven Mods](https://wiki.warframe.com/w/Riven_Mods): classic attribute base tables, roll range (90–110%) and layouts (0.99, 1.2375/−0.495, 0.75, 0.9375/−0.75). Values are max-rank table values before disposition. Spliced traits use the combinations listed in [Update 44.1.0: The Icebind](https://www.warframe.com/en/patch-notes/pc/44-1-0). Their displayed values are entered by the user; no unverified spliced base-value table or roll range is assumed.
- [Fire Rate](https://wiki.warframe.com/w/Fire_Rate), [The Steel Path](https://wiki.warframe.com/w/The_Steel_Path), [Primary Merciless](https://wiki.warframe.com/w/Primary_Merciless), and [Arcane Acceleration](https://wiki.warframe.com/w/Arcane_Acceleration).

- [Official Update 40 patch notes](https://www.warframe.com/en/patch-notes/pc/40-0-0), “New Adapter: Archgun Arcane Adapter”: the upper Archgun slot accepts Primary Arcanes and the lower slot accepts Secondary Arcanes. [Archgun reference](https://wiki.warframe.com/w/Archgun).
- Weighted proc probabilities are derived from the status tier count and independent weighted damage-type draws; expected counts and at-least-one probabilities are separate quantities.

The arsenal contains user-created build profiles and referenced custom records, rather than game account data. An exported arsenal retains source metadata on derived records.

## Attribution

Wiki content and data © Warframe Wiki contributors, including the database module authors FINNER, Cephalon Scientia, and other contributors. Derived wiki data retains attribution and is distributed under [Creative Commons Attribution–NonCommercial–ShareAlike 3.0](https://creativecommons.org/licenses/by-nc-sa/3.0/), consistent with the wiki's stated content license. Normalization includes field renaming, explicit IDs/references, numeric effect extraction, source metadata, and incomplete-mechanics flags.

Warframe and its names are the property of Digital Extremes. This is an independent community calculator, with no connection to game accounts or ownership tracking. All application behavior runs locally in the browser.


## Local artwork

The canonical local-to-source image registry is `images/manifest.json`. It maps each artwork path to its remote URL, source page, provider, downloaded byte size, and the data records that use it. It covers Wiki artwork, enemy portraits, mod and arcane art, status and shard icons, and interface assets. `images/enemies/manifest.json` is retained as a legacy enemy-only subset. The online catalogue sync in `app.js` and `scripts/fetch_mod_card_assets.py` update the canonical registry when they add downloaded images. Warframe game artwork is by Digital Extremes; source-table licensing should not be interpreted as licensing every image. The local placeholder is an original SVG supplied with this app.

`images/archon-shards/plain-shard.png` and `plain-shard-large.png` are user-supplied, local-only artwork. Their manifest entries have no remote URL, and image downloads must leave them in place.

Standalone mod icons in `images/mods/icons/wiki/` come from the `Icon` fields in the Warframe Wiki `Module:Mods/data`; the canonical Wiki file URL is stored as `iconSource` on each mod record. WFCD icons can be downloaded as local fallbacks, and the complete Wiki mod-card image remains the final fallback. `scripts/fetch_mod_card_assets.py` downloads and records these assets in `images/manifest.json`. The calculator composes mod cards from the Warframe interface frame assets in `images/mods/frames/`, sourced through the [Warframe Wiki file catalog](https://wiki.warframe.com/w/Mod). Empty-slot silhouettes and Aura/Exilus symbols in `images/mods/slots/` come from [Overframe](https://overframe.gg/). Artwork loads remotely by default; its individual source URLs are recorded in `images/manifest.json`, and the Database editor can download it to the app folder for offline use. Separate frame assets let the calculator render the selected rank and current drain instead of relying on numbers printed into full-card images.

Aura entries come from the bundled [Warframe Wiki mod catalogue](https://wiki.warframe.com/w/Module:Mods/data). The calculator applies ranked damage, critical, status, armor and shield effects for the supported Aura mods and labels other Aura effects as unmodeled. Aura polarity changes the displayed Warframe capacity gain; it does not change weapon mod capacity. Toxin Resistance is defensive and does not add Toxin damage to the weapon.

Polarity symbols in `images/mods/polarities/` come from the [Warframe Wiki polarity file catalog](https://warframe.fandom.com/wiki/Module:Polarity). They are tinted in the interface to show matching and mismatching mod slots.


## Live catalogue and armor follow-up

The optional browser sync uses `https://wiki.warframe.com/api.php` with `origin=*`, querying revision source and timestamps for the same weapon/enemy/module tables as the bundled snapshot and the catalogue's Incarnon pages. Existing conditional mechanics are retained when their sourced description is unchanged; changed unsupported mechanics receive explicit coverage notes. Formula/riven base tables are not inferred from prose. No Lua source is executed. See LICENSES.md for the embedded parser license.

Follow-up armor reduction uses the sourced Corrosive rules (26% initial reduction, +6% per subsequent stack, ten-stack default cap, eight-second proc duration), Heat armor-ramp steps (15/30/40/50% at 0.5/1/1.5/2 seconds, scaled by status duration), and fourteen-stack full strip with a raised external cap. References: https://wiki.warframe.com/w/Damage/Corrosive_Damage and https://wiki.warframe.com/w/Damage/Heat_Damage. The probabilistic follow-up model and its timing/grouping assumptions are described in README.md.
