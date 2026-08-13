<script lang="ts" module>
	import type { Snippet } from "svelte";
	import {
		defaultLocaleLabels,
		RTL_LANGUAGE_TAGS,
		RTL_SCRIPT_SUBTAGS,
	} from "./locales.js";

	/**
	 * Default button glyph: U+1F310 GLOBE WITH MERIDIANS followed by
	 * U+FE0E VARIATION SELECTOR-15.
	 *
	 * VS15 requests *text* presentation. Without it the browser picks the
	 * colour-emoji font and the globe renders blue, which does not match
	 * theme-picker's monochrome ◑ — the two controls sit next to each
	 * other in a page header and should read as one set.
	 */
	export const GLOBE_WITH_MERIDIANS = "\u{1F310}\uFE0E";

	/** Arguments passed to a custom `children` snippet (the button glyph). */
	export type ChildArgs = {
		/** Currently selected locale code (consumer form, not BCP 47-normalised). */
		value: string;
		/** Is the listbox open? */
		open: boolean;
		/** Resolve a locale code to its display label. */
		labelFor: (locale: string) => string;
	};

	/** Public props for LocalePicker. See `spec/index.md` §4 for the contract. */
	export type Props = {
		/** Accessible name for the button and the listbox. */
		label: string;
		/** Available locale codes. */
		locales: string[];
		/** Currently selected locale code. Two-way bindable. */
		value?: string;
		/** Initial locale when nothing else is supplied. */
		defaultValue?: string;
		/** If set, persist the selection to localStorage under this key. */
		storageKey?: string;
		/** Resolve `navigator.languages` to a supported locale on first visit. */
		detectFromNavigator?: boolean;
		/** `name` of the hidden input that carries the value in a form. */
		name?: string;
		/** Element that receives `lang` and `dir`. Defaults to document.documentElement. */
		target?: HTMLElement | null;
		/** If false, the select only writes `lang` and never touches `dir`. */
		applyDir?: boolean;
		/** Optional pretty labels per locale code. */
		localeLabels?: Record<string, string>;
		/** Replaces the default globe glyph inside the button. */
		children?: Snippet<[ChildArgs]>;
		/** Called after the control applies a new locale. */
		onChange?: (locale: string) => void;
		/** Extra CSS class on the root. */
		class?: string;
		/** Spread props onto the root element. */
		[key: string]: unknown;
	};

	// ---------------------------------------------------------------
	// Pure helpers (exported so consumers can reuse them)
	// ---------------------------------------------------------------

	/** Convert a locale code to its BCP 47 hyphen form. */
	export function bcp47LocaleTag(locale: string): string {
		return locale.replace(/_/g, "-");
	}

	/** Detect whether a locale is right-to-left. See spec/index.md §5.6. */
	export function isRtlLocale(locale: string): boolean {
		if (!locale) return false;
		const parts = locale.split(/[-_]/);
		for (const part of parts) {
			if (RTL_SCRIPT_SUBTAGS.has(part.toLowerCase())) return true;
		}
		const base = parts[0]?.toLowerCase() ?? "";
		return RTL_LANGUAGE_TAGS.has(base);
	}

	/** Resolve a locale code to its English name via the built-in table. */
	export function localeName(locale: string): string {
		return defaultLocaleLabels[locale] ?? locale;
	}

	/**
	 * The language's own name for itself — "de" → "Deutsch", "cy" →
	 * "Cymraeg" — from `Intl.DisplayNames` asked *in that language*.
	 *
	 * Endonyms are the right default for a language menu: the user who
	 * needs it most is the one lost in a UI that is not in their
	 * language, and they recognise "Cymraeg" where "Welsh" means
	 * nothing to them. Deterministic (no `navigator` dependency), so
	 * the server and the client render the same label. Returns "" when
	 * the runtime has no data — some runtimes echo the tag back instead
	 * of failing, and an echo is not a name.
	 */
	export function localeEndonym(locale: string): string {
		try {
			const tag = bcp47LocaleTag(locale);
			const dn = new Intl.DisplayNames([tag], { type: "language" });
			const found = dn.of(tag) ?? "";
			return found && found.toLowerCase() !== tag.toLowerCase()
				? found
				: "";
		} catch {
			return "";
		}
	}

	/** Re-export the built-in label table and RTL sets for convenience. */
	export { defaultLocaleLabels, RTL_LANGUAGE_TAGS, RTL_SCRIPT_SUBTAGS };

	/** Opportunistic Intl.DisplayNames lookup; never throws. */
	function intlDisplayName(locale: string): string {
		try {
			const env =
				typeof navigator !== "undefined" && navigator.language
					? navigator.language
					: "en";
			const dn = new Intl.DisplayNames([env], { type: "language" });
			return dn.of(bcp47LocaleTag(locale)) ?? "";
		} catch {
			return "";
		}
	}

	/** Match a navigator preference against a supported-locales list. */
	export function matchNavigatorLanguage(
		navLangs: readonly string[],
		locales: readonly string[],
	): string | "" {
		const lc = (s: string) => s.toLowerCase().replace(/_/g, "-");
		const localesLc = locales.map(lc);
		for (const raw of navLangs) {
			const nav = lc(raw);

			// 1. Exact match (treating - and _ as equivalent).
			const exactIndex = localesLc.indexOf(nav);
			if (exactIndex !== -1) return locales[exactIndex];

			// 2. Language-only match: pick the first locale whose
			//    base language matches the navigator's base language.
			const navBase = nav.split("-")[0];
			for (let i = 0; i < locales.length; i++) {
				const base = localesLc[i].split("-")[0];
				if (base === navBase) return locales[i];
			}
		}
		return "";
	}

	let uid = 0;
	/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
	export function nextLocalePickerId(): string {
		uid += 1;
		return `locale-picker-${uid}`;
	}
</script>

<script lang="ts">
	let {
		class: className = "",
		label,
		locales,
		value = $bindable(""),
		defaultValue,
		storageKey,
		detectFromNavigator = false,
		name = "locale",
		target,
		applyDir = true,
		localeLabels = {},
		children,
		onChange,
		...restProps
	}: Props = $props();

	const baseId = nextLocalePickerId();
	const listId = `${baseId}-list`;
	const optionId = (i: number) => `${baseId}-option-${i}`;

	let open = $state(false);
	let activeIndex = $state(-1);
	let buttonEl: HTMLButtonElement | undefined = $state();
	let listEl: HTMLUListElement | undefined = $state();
	let rootEl: HTMLDivElement | undefined = $state();

	// Typeahead buffer: APG listbox behaviour. Reset after a pause.
	let typeahead = "";
	let typeaheadTimer: ReturnType<typeof setTimeout> | undefined;

	function labelFor(locale: string): string {
		if (locale in localeLabels) return localeLabels[locale];
		// Endonym first: a language menu names each language in itself,
		// because the user who needs the menu is the one who cannot read
		// the page's language. The English table and the environment
		// lookup are fallbacks for runtimes without DisplayNames data.
		const endonym = localeEndonym(locale);
		if (endonym) return endonym;
		if (locale in defaultLocaleLabels) return defaultLocaleLabels[locale];
		const intl = intlDisplayName(locale);
		if (intl) return intl;
		return locale;
	}

	/**
	 * The `lang` attribute for one option — a claim about the language
	 * of the option's TEXT, made only when the text is the endonym we
	 * derived ourselves. A consumer label or the English fallback is in
	 * whatever language the consumer's UI speaks, and claiming otherwise
	 * sends a screen reader's speech engine to the wrong voice: the
	 * English word "Arabic" read out by an Arabic synthesizer.
	 */
	function optionLang(locale: string): string | undefined {
		if (locale in localeLabels) return undefined;
		return localeEndonym(locale) ? bcp47LocaleTag(locale) : undefined;
	}

	// The code the DOM currently carries. Applying is idempotent: the
	// effect below can run for reasons other than a locale change, and
	// re-applying would re-fire `onChange`. A consumer whose onChange
	// writes reactive state then re-enters this effect, and Svelte stops
	// updating the component altogether (effect_update_depth_exceeded) —
	// the listbox freezes mid-open with a stale aria-expanded. Guarding
	// here also matches the spec: other prop changes are not retroactive.
	let appliedValue = "";

	function applyLocale(code: string): void {
		if (typeof document === "undefined" || !code) return;
		if (code === appliedValue) return;
		appliedValue = code;
		const root = target ?? document.documentElement;
		root.setAttribute("lang", bcp47LocaleTag(code));
		if (applyDir) {
			root.setAttribute("dir", isRtlLocale(code) ? "rtl" : "ltr");
		}
		if (storageKey) {
			try {
				localStorage.setItem(storageKey, code);
			} catch {
				// ignore quota / privacy errors
			}
		}
		onChange?.(code);
	}

	function setLocale(code: string): void {
		value = code;
	}

	// ---------------------------------------------------------------
	// Open / close
	// ---------------------------------------------------------------

	function openList(startIndex?: number): void {
		const selected = locales.indexOf(value);
		// An empty list has no option to activate; -1 keeps
		// aria-activedescendant off rather than pointing at an id that
		// does not exist.
		activeIndex =
			locales.length === 0
				? -1
				: (startIndex ?? (selected >= 0 ? selected : 0));
		open = true;
		// Focus moves to the listbox; the active option is conveyed via
		// aria-activedescendant, per the APG listbox pattern.
		queueMicrotask(() => {
			listEl?.focus();
			scrollActiveIntoView();
		});
	}

	function closeList(refocus = true): void {
		if (!open) return;
		open = false;
		activeIndex = -1;
		if (refocus) queueMicrotask(() => buttonEl?.focus());
	}

	function choose(index: number): void {
		const code = locales[index];
		if (code) setLocale(code);
		closeList();
	}

	function scrollActiveIntoView(): void {
		if (activeIndex < 0 || !listEl) return;
		// getElementById, not a `#id` selector: ids here are generated and
		// contain nothing needing escaping, and `CSS` is absent entirely in
		// jsdom — `CSS.escape` there throws inside the keydown handler,
		// after activeIndex is already assigned, so the suite stays green
		// while this path never actually runs.
		const el = document.getElementById(optionId(activeIndex));
		// Guard the METHOD, not just the element: jsdom implements no
		// scrollIntoView, so `el?.scrollIntoView(...)` throws once `el`
		// exists — and it throws after activeIndex is already assigned,
		// which is why the suite stayed green while this path never ran.
		el?.scrollIntoView?.({ block: "nearest" });
	}

	function moveActive(delta: number): void {
		if (locales.length === 0) return;
		const next = Math.min(Math.max(activeIndex + delta, 0), locales.length - 1);
		activeIndex = next;
		scrollActiveIntoView();
	}

	function runTypeahead(char: string): void {
		const lower = char.toLowerCase();
		// APG listbox typeahead: a single character moves to the NEXT
		// option starting with it, and repeating that character keeps
		// cycling. Only a buffer of differing characters refines the
		// match, and that buffer stays anchored on the active option.
		const sameCharRun =
			typeahead === "" || [...typeahead].every((c) => c === lower);
		typeahead += lower;
		clearTimeout(typeaheadTimer);
		typeaheadTimer = setTimeout(() => (typeahead = ""), 500);
		const query = sameCharRun ? lower : typeahead;
		const anchor = activeIndex < 0 ? 0 : activeIndex;
		const start = sameCharRun ? anchor + 1 : anchor;
		// Search forward, wrapping once — typeahead wraps even though the
		// arrows clamp, or options above the cursor would be untypable.
		for (let n = 0; n < locales.length; n++) {
			const i = (start + n) % locales.length;
			if (labelFor(locales[i]).toLowerCase().startsWith(query)) {
				activeIndex = i;
				scrollActiveIntoView();
				return;
			}
		}
	}

	function onButtonKeydown(event: KeyboardEvent): void {
		switch (event.key) {
			case "ArrowDown":
			case "Enter":
			case " ":
				event.preventDefault();
				openList();
				break;
			case "ArrowUp":
				event.preventDefault();
				openList(locales.length - 1);
				break;
		}
	}

	function onListKeydown(event: KeyboardEvent): void {
		switch (event.key) {
			case "ArrowDown":
				event.preventDefault();
				moveActive(1);
				break;
			case "ArrowUp":
				event.preventDefault();
				moveActive(-1);
				break;
			case "Home":
				event.preventDefault();
				activeIndex = 0;
				scrollActiveIntoView();
				break;
			case "End":
				event.preventDefault();
				activeIndex = locales.length - 1;
				scrollActiveIntoView();
				break;
			case "Enter":
			case " ":
				event.preventDefault();
				if (activeIndex >= 0) choose(activeIndex);
				break;
			case "Escape":
				event.preventDefault();
				closeList();
				break;
			case "PageUp":
				event.preventDefault();
				moveActive(-10);
				break;
			case "PageDown":
				// ±10, clamped: an APG-optional key for long locale lists.
				event.preventDefault();
				moveActive(10);
				break;
			case "Tab":
				// Tab moves on — but focus goes to the button FIRST,
				// without cancelling the key. Hiding the focused list
				// drops focus to <body>, and the browser then computes
				// the default Tab move from the top of the document, so
				// tabbing out of an open picker teleported the user to
				// the page's first tab stop. From the button, the default
				// Tab lands exactly where leaving the picker should.
				buttonEl?.focus?.();
				closeList(false);
				break;
			default:
				if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
					runTypeahead(event.key);
				}
		}
	}

	function onRootFocusOut(event: FocusEvent): void {
		const next = event.relatedTarget as Node | null;
		if (next && rootEl?.contains(next)) return;
		closeList(false);
	}

	// ---------------------------------------------------------------
	// Initial value resolution + apply (unchanged from the select era)
	// ---------------------------------------------------------------

	let initialised = false;

	$effect(() => {
		const current = value;

		if (!initialised) {
			initialised = true;
			let initial = current;

			if (!initial && storageKey) {
				try {
					initial = localStorage.getItem(storageKey) ?? "";
				} catch {
					// ignore privacy errors
				}
			}

			if (!initial && detectFromNavigator && typeof navigator !== "undefined") {
				const navLangs =
					navigator.languages && navigator.languages.length > 0
						? Array.from(navigator.languages)
						: navigator.language
						  ? [navigator.language]
						  : [];
				initial = matchNavigatorLanguage(navLangs, locales);
			}

			if (!initial) {
				initial =
					defaultValue ??
					(locales.includes("en") ? "en" : locales[0]) ??
					"";
			}

			if (initial && initial !== current) {
				value = initial;
				return;
			}
		}

		if (current) applyLocale(current);
	});
</script>

<svelte:document
	onclick={(event) => {
		if (!open) return;
		const t = event.target as Node | null;
		if (t && rootEl && !rootEl.contains(t)) closeList(false);
	}}
/>

<div
	bind:this={rootEl}
	class={`locale-picker ${className}`.trim()}
	onfocusout={onRootFocusOut}
	{...restProps}
>
	<input type="hidden" {name} {value} />

	<button
		bind:this={buttonEl}
		type="button"
		class="locale-picker-button"
		aria-label={label}
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-controls={listId}
		onclick={() => (open ? closeList() : openList())}
		onkeydown={onButtonKeydown}
	>
		{#if children}
			{@render children({ value: value ?? "", open, labelFor })}
		{:else}
			<span class="locale-picker-icon" aria-hidden="true">{GLOBE_WITH_MERIDIANS}</span>
		{/if}
	</button>

	<ul
		bind:this={listEl}
		class="locale-picker-list"
		id={listId}
		role="listbox"
		aria-label={label}
		aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
		tabindex="-1"
		hidden={!open}
		onkeydown={onListKeydown}
	>
		{#each locales as locale, i (locale)}
			<!-- The option's keyboard interaction lives on the listbox
				 (aria-activedescendant pattern): the list is the focused
				 element and its keydown handler operates the options, so a
				 per-option key handler would be wrong, not missing. -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<li
				class="locale-picker-option"
				id={optionId(i)}
				role="option"
				aria-selected={locale === value}
				data-active={i === activeIndex ? "" : undefined}
				lang={optionLang(locale)}
				onclick={() => choose(i)}
			>
				{labelFor(locale)}
			</li>
		{/each}
	</ul>
</div>
