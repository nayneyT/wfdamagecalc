# Void Arsenal

## How to Use

In PowerShell, create a folder for the checkout, enter it, and clone the repository:

```powershell
mkdir C:\github
cd C:\github
git clone https://github.com/nayneyT/wfdamagecalc.git
cd C:\github\wfdamagecalc
start .\index.html
```

If `C:\github` already exists, skip the `mkdir` command. You can also open `index.html` from File Explorer. The page uses online images by default.

To save images for offline use, open the page in Chrome or Edge, go to **Database editor → Image assets**, and click **Download Images Locally**. Select the folder containing `index.html` (for example, `C:\github\wfdamagecalc`) and allow the browser to edit files there. When the download finishes, choose **Use Local Images**.

Alternatively, from the project folder run the Python downloader:

```powershell
cd C:\github\wfdamagecalc
py scripts/download_images.py
```

You can use `python scripts/download_images.py` if `py` is unavailable. After it finishes, return to **Database editor → Image assets** and change **Image source** from **Remote images** to **Local images**. See **How to download images** in the app for more help.

A browser-only Warframe damage calculator. Open [index.html](index.html) with `app.js` beside it. There is no installation, Node.js, npm, framework, build step, or server. Artwork loads from its online source by default; download it locally for offline use.

The original application code is licensed under GPL-3.0-or-later; see [LICENSE.md](LICENSE.md). The bundled parser, Wiki-derived data, and third-party artwork have separate terms documented in [LICENSES.md](LICENSES.md), [SOURCES.md](SOURCES.md), and `images/manifest.json`.

## Use

1. Your personal arsenal starts empty. Choose **Create weapon**, pick a category and base weapon, then select its attack/damage component. Configure modular parts or Incarnon choices when available.
2. Equip mods, choose their ranks and slot polarities, and select arcane ranks and active stacks. New weapon builds start with the weapon’s catalogued polarity slots. Primary Crux stacks apply its Status Chance and Ammo Efficiency, with the latter extending shots between reloads in TTK. Set up to five Archon Shards, choose Tauforged variants and any earned Heat-kill stacks; modeled weapon effects include Primary/Secondary shard bonuses, Violet Electricity damage, Emerald Toxin status damage, and Emerald Corrosive stack capacity.
3. Drag the enemy-level slider (1–9,999, default 100). Results update while dragging, preserving the weapon build. You can also enter a level or reset to 100.
4. Choose mission and hit settings. Expand factions and select an enemy for individual health, shield, Overguard, and status results.
5. Use the Riven workshop to create ordinary or spliced rolls. Ordinary traits show their minimum, current, and maximum at the selected rank and weapon disposition. Spliced values are entered from the game and scaled once when equipped.

Choose **Save build** and enter a name to add the configured weapon to your arsenal. The main selector contains saved profiles only. **Save as new** creates another profile of the same weapon; subsequent edits require an explicit save.

## Riven workshop

Choose ordinary Riven traits and their roll quality from 90% to 110%. The preview shows each trait's minimum, current and maximum at the selected weapon variant's disposition and Riven rank, plus its position within that roll interval. Negative ranges are ordered by displayed numeric value; a higher roll quality gives a larger penalty.

**Use Riven Splicer** offers the combinations valid for the current Riven. Enter the resulting value shown in game; the two source traits are replaced by one locked spliced trait and one ordinary replacement trait, preserving the existing layout. Edit the replacement trait to match the game. **Enter an existing spliced Riven** marks a positive slot without requiring its original source traits. A padlock marks the persistent spliced trait. Remove the splice to change its identity or layout. Spliced trait ranges are shown as unavailable because their base roll tables have not been verified. Some utility effects are displayed with explicit calculation limitations.

## Personal arsenal

`data/arsenal.json` is an empty starter database. Browser storage restores saved profiles and the current draft on reload. **Export arsenal.json** downloads named builds together with referenced custom Rivens, edited/custom records, and their required dependencies. **Import arsenal.json** previews replacement of the arsenal and any conflicting custom records before applying the import together.

A directly opened HTML file cannot automatically read or overwrite a neighbouring JSON file. Import a populated `arsenal.json` once in a new browser, or export updated HTML to embed your arsenal into its next offline starter. Arsenal exports include saved builds only; save current edits before making a backup. Profiles can be renamed or deleted, and leaving a changed build prompts before discarding it.

Upgrading from the previous calculator preserves browser data and offers its active build as a recoverable unsaved draft. Unchanged legacy Incarnon records are upgraded; custom evolution edits are preserved. Save the recovered build to add it to the arsenal.

Mod capacity, slot restrictions, incompatibilities, mastery requirements, and polarity changes are checked. Forma count unlocks eligible rank-40 weapons and accounts for changed polarities. Adapter controls apply to special slots. Invalid builds remain visible for correction.

## JSON databases

The `data` directory contains independent JSON files for weapons, mods, arcanes, Archon Shard traits, enemies, factions, custom Rivens, Riven tables, Riven splice recipes, modular parts, Incarnon evolutions, stances, calculation rules, and the personal arsenal. Each file has `category`, `schemaVersion`, `snapshot`, `sources`, and `records` fields. Records have stable IDs; related categories reference those IDs.

Browser restrictions generally prevent automatically fetching JSON beside a directly opened HTML file. Therefore `index.html` also embeds a starter copy of each dataset. The working database is saved in IndexedDB. **Export Data** downloads a ZIP containing every current `data/*.json` category, including arsenal and Rivens. **Import Data** validates and previews that ZIP before replacing the working data; if you connect the data folder, it updates those JSON files too. No local `fetch()` calls are used.

The editor supports creating, cloning, changing, and deleting records. Its simple fields update the full record JSON. Nested damage profiles, effects, conditions, and defenses are edited in the JSON area. Percentage effect values are decimals: `0.9` means +90%.

For ranked mods and arcanes, `rankEffects` contains explicit effects for every rank and takes precedence over `effects`. Update the appropriate `rankEffects` entries when changing rank values, or remove `rankEffects` to use linearly scaled `effects`. Unsupported mechanics remain marked until their `limitations` are resolved; removing a limitation does not implement an effect.

Data ZIP imports are validated as one replacement and require a preview confirmation. Missing references leave the existing browser database intact. Referenced records cannot be deleted until their references are changed, including references from saved arsenal builds. Legacy single-build exports reference database IDs; arsenal exports include referenced custom records for portability.

Database edits, saved arsenal builds, and the current draft are stored locally when browser storage is available. Draft autosaving does not overwrite an explicitly saved arsenal profile. Moving files, changing browsers, private browsing, or storage limits can affect persistence. **Export Data** backs up every active category as a ZIP; **Export Assets** backs up downloaded artwork. Keep `index.html`, `app.js`, and the three included local-only images together.

## Calculation model

- Damage graphs compare base and fully modded values per attack component. The Incarnon checkbox is off by default; enabling it adds Incarnon-mode attack components and their base/modded graphs beside normal attacks. Graph values exclude crits, multishot, combo/stance multipliers and enemy defenses.
- For Burston Prime's normal attack, Evolution II changes 46 base damage to 88. The game rounds each typed damage share to 1/32 of the base total without renormalizing, producing 27.5/27.5/35.75 (90.75 total); maximum Serration scales this to 240.4875. Separate attack profiles show the original and modded totals.
- Incarnon choices have hover/focus previews and tappable details. Variant-specific values and normal/Incarnon scope are applied. Conditional bonuses start inactive and use explicit switches or stack counts. Conditions preview a static scenario; their activation and decay are not simulated.
- Archguns expose a Primary weapon arcane slot and a Secondary weapon arcane slot, in addition to separate Warframe arcane inputs. The adapter checkbox represents installation of all required slot adapters.
- Weighted random status results show damage fraction, expected procs per projectile, and probability of at least one proc of that type. For status chance `s` and type weight `w`, expected procs are `s*w`; probability is `1-(1-w)^floor(s)*(1-fraction(s)*w)`. For example, 250% status and a 40% damage weight yields 1 expected proc but a 71.2% chance of at least one. The bottom of the Status damage card also shows a separate per-type probability table for each normal, Incarnon, or alt-fire profile, using that profile’s damage weights only. Each reports chance per projectile, expected random procs, and cumulative chance of at least one proc over 500 projectiles. These weapon-only tables exclude forced procs, multishot, and target immunity. Forced/triggered procs are separate, and immunity sets actual proc probabilities to zero in enemy damage calculations.
- Damage is reported per projectile and per attack component, before and after enemy defenses. Components explicitly linked as simultaneous hits (such as a direct projectile plus its radial explosion) are calculated together, while retaining separate direct and radial values. Unlinked alt-fire modes remain separate.
- Critical tiers are probabilistic, including chances over 100%. Enemy weakpoint and critical-headshot metadata affects enemy comparisons. Acuity locks multishot to the innate value and modifies weakpoint damage/chance.
- Sustained firearm DPS includes magazine consumption and reloads. Burst delay, charge time, bow charge/reload cycles, beam ammo consumption, and regenerating ammunition are represented. Reserve ammunition is unlimited. Semi-automatic weapons assume maximum achievable firing cadence.
- The Status damage card uses the fixed debuff inputs and reports theoretical steady-state contribution. Linked direct and radial components share one projectile’s combined proc result; their damage and the radial body-hit behavior are labeled separately. The selected-enemy card is separate from faction rows and includes defense pools, popup values, a cumulative status timeline, and projectile-by-projectile TTK. TTK compares 100% body, 100% head/weakpoint, and body:head mixes of 25:75, 50:50, and 75:25. It uses expected critical and status chances, applies Corrosive/Heat armor stripping to later projectiles, and shows remaining armor, Overguard, shields, and health after each hit. Linked projectile rows show direct + radial = total damage. Status damage-over-time, shield gating, Incarnon charge cycles, and enemy phase transitions are excluded.
- The slider is the **final enemy level**. Steel Path applies sourced health/shield modifiers without silently adding another 100 levels. Armor is capped before stripping; Heat and Corrosive debuffs are applied after the cap.
- Health, shield, and armor curves use the source's float32 smoothstep scaling. Below-base level differences are floored at zero. Missing base levels or defense statistics prevent scaled damage totals.
- Typed direct damage uses 1/32 quantization and base critical multipliers use the game's 12-bit encoding. The selected-enemy panel separates rounded normal and critical popup values from probability-weighted averages. Buff uptime blends bonuses linearly rather than simulating timing.

## Coverage and verification

The source snapshot contains **911 weapon profiles, 1,019 enemies, 1,534 mods, 166 arcanes, 106 modular parts, 331 named Incarnon choices across 35 families, and 114 stance profiles**. Catalog inclusion does not mean every special mechanic is implemented. Descriptions and `limitations` identify incomplete mod effects, arcane effects, evolutions, enemy attenuation/adaptation, and special weapon interactions. Combined totals are withheld for incomplete comparisons.

Core weapon-stat modifiers and selected conditional handlers are implemented. The Incarnon tables were audited and all previous choice IDs retained. 246 choices contain structured numeric effects; other choices have explicit utility effects or specific unresolved limitations. Complex multishot-ammunition interactions, some conditional damage placement, secondary explosions and other unresolved effects remain flagged. Selecting a partial evolution applies its verified portion and lists the remaining gaps. Zaw heavy/slam profiles, modular radial components, Railjack heat/space status systems, unusual boss mechanics, some specialized spliced utility traits, and specific ability interactions require further sourced rules.

Use **Guide & sources → Run calculation checks**, or open `index.html#checks`, to run the built-in calculation fixtures. The built-in checks cover damage stages, Incarnon conditions/scopes, ranked mods, status probabilities, Archgun slots, arsenal references, and the Burston Prime popup values for Arid Lancer and Elite Crewman. Firefox was not installed in the implementation environment and has not been verified.

See [SOURCES.md](SOURCES.md) for provenance.



### Artwork and local downloads

The GitHub checkout includes `images/placeholder.svg`, `images/archon-shards/plain-shard.png`, and `images/archon-shards/plain-shard-large.png`. Other artwork is deliberately omitted from Git and loads from the source URLs listed in `images/manifest.json`. A compact source lookup is embedded in `index.html`, so opening the page directly from disk does not require a local JSON fetch. Internet access is needed for artwork in the default **Remote images** mode; unavailable sources show a local image, when present, or the placeholder.

To save artwork for offline use, open the app in a current Chromium browser such as Chrome or Edge, then choose **Database editor → Image assets → Download Images Locally**. Select the project folder containing `index.html` when the browser asks for folder access. A progress window shows checked, downloaded, skipped, and failed images; **Cancel download** keeps files already saved. At completion, choose **Use Local Images** or **Stay Remote**. Local mode tries the online source for any missing image, so it can also be used after a partial download. Run the download again to retry failures. If a source blocks browser cross-origin downloads, the downloader retries it through `images.weserv.nl`; source attribution remains in the manifest. The app does not upload your local images.

Opening `index.html` directly from disk works in Chrome and Edge with folder access; a local server is not required. If folder access is unavailable, the Image assets card displays an error and points to **How to download images**. The Python fallback reads `images/manifest.json`, skips images already present, prints progress and failures, and writes a detailed, ignored `image-download.log` in the project folder. It can be rerun after an interruption. Python is optional for image downloads and is not required to run the app.

Weapon artwork lives in `images/weapons`, enemy portraits in `images/enemies`, status icons in `images/status`, mod and arcane artwork in `images/mods`, and Archon Shards in `images/archon-shards`. The manifests retain source URLs and attribution. Artwork is kept on your computer after Git stops tracking it; `.gitignore` prevents it from being added to future commits. The three included images have no remote source.

**Connect project folder** in Database editor to count downloaded assets against the manifest. **Export Assets** creates a ZIP of locally present, manifest-listed images and `images/manifest.json`; **Import Assets** validates and restores that ZIP into the selected project folder. These controls require folder access in a compatible browser. The bundled local-only placeholder and empty-shard images remain in the checkout.

The database editor supports optional `image` and `imageSource` fields on weapons, enemies, mods, and arcanes. Use relative paths such as `images/weapons/my-weapon.png`. Status icon paths are editable in the rules record's `statusIcons` object. Standard status icons resolve to their matching images even if an older browser save points at a different bundled status icon; custom image paths remain available. Older browser databases receive missing image metadata while keeping custom edits and explicitly chosen image paths. Custom images must accompany exported builds and HTML separately.

Single-choice Incarnon evolution tiers select automatically. Hover or focus an evolution or selected mod for its description; use the collapsed Effect details or Mod details controls on touch screens. Conditional bonuses still start inactive. Cancel creation discards a draft after confirmation, and Back to arsenal returns from a saved build. Returning to the arsenal survives reloading. Faction comparisons initially remain collapsed.

Enemy artwork was verified locally for 976 enemy records; unavailable artwork uses the shared placeholder. The enemy panel shows the selected portrait and the compact six-column faction summary keeps horizontal table scrolling inside its wrapper.


## Online catalogue sync

Use **Sync all sourced data** in the calculator or database editor. It reads the Warframe Wiki API, previews new/changed weapons, mods, arcanes, enemies, factions, modular parts, stances, and Incarnon sources, and applies validated changes together. The record editor shows the actual source link and marks locally changed sourced fields and records **TWEAKED**. Normal sync preserves those fields; **Force refresh record** fetches the latest Wiki data, shows differences, and replaces that one record only after confirmation. Personal and curated categories are maintained locally. WFCD supplies some artwork, but the catalogue update reads the Warframe Wiki. Browser internet access is only needed for this optional check. Lua source tables are parsed as data without running their code; the parser is bundled in the single JavaScript file (see LICENSES.md).

To update files directly, use **Database editor → Connect app/data folder**, select this app's folder (or its data folder), check online, then choose **Apply sync**. You can also connect the folder from the preview and recheck. Supported browsers require their normal folder-access dialog. Category JSON files already on disk are read before merging, and files changed after the preview cause sync to stop. Completed writes are restored if another file write fails. Folder access is connected for the current page session; reconnect after reopening the page.

Without folder access, applying sync updates browser storage and downloads the changed category JSON files. Save them into `data/`; your browser may ask to allow multiple downloads. **Export Data** creates a portable ZIP of the working database. A Git pull restores the committed JSON files on disk; existing browser data remains until you import updated data or sync it.

Sync keeps saved builds, custom Rivens, locally edited fields, and records no longer listed online. The calculation-rule and Riven-base-value tables are maintained separately; online sync does not replace them with inferred formulas. Online source fingerprints track subsequent changes. New/changed conditional mod, arcane, or Incarnon mechanics that cannot be verified are explicitly marked incomplete rather than silently treated as supported. When the complete app folder is connected, artwork for newly added catalogue records is also downloaded when available; unavailable artwork uses the placeholder. Connecting only `data/` grants no access to its parent image folders.

## First hit and follow-up comparisons

Faction rows show enemy, armor, expected body/weakpoint/headshot hits, and body direct DPS. Selecting an enemy reveals defense layers, hit-location bonuses, enemy artwork, and separate rounded normal/critical popup values. A selected-enemy status tick table follows continuous fire and magazine reloads for an adjustable 1–60 seconds. It accumulates expected procs and damage over time; Heat refresh and Blast fuse timing remain outside its model.

Corrosive/Heat damage types do not automatically guarantee armor reduction. The follow-up calculation uses weighted proc probabilities, status chance above 100%, expected multishot, forced procs, enemy status immunity/caps, and the time until the next attack. It averages damage over proc outcomes instead of calculating damage from average armor. Heat strips 15%, 30%, 40%, then 50% every half-second after a proc, with timing scaled by status duration. Corrosive procs expire after eight seconds, scaled by status duration. After Heat expires, armor reduction recovers through 50%, 40%, 30%, 15%, and zero in 1.5-second steps, scaled by status duration.

The Armor column shows initial → expected follow-up armor and its stripped percentage. Fully stripped armored enemies show **armor stripped 100%**; enemies that started unarmored do not receive that tag. Ordinary Corrosive is capped at ten stacks (80% reduction), and Heat adds a multiplicative 50% at full ramp. Set the Corrosive stack cap to 14 only when external support supplies that cap; fourteen stacks can remove all armor. Manual armor strip and existing status stacks remain available; existing stack inputs are treated as maintained.

Faction rows remain a first-hit/follow-up comparison; defense pools do not transition or deplete there. The separate timeline estimates status buildup and cumulative ticks with fractional expected proc counts, while fixed target defenses and unsupported proc timing remain documented limitations. Extreme custom values above 256 status chance or multishot are capped for the faction proc-distribution calculation and labeled in enemy details.

The 48 built-in checks pass, including all eight reported Burston Prime popup values. The selected enemy view was checked in Chrome with the Arid Lancer portrait, six-column faction summary, and status timeline.
