<script lang="ts" module>
	import type { Snippet } from "svelte";

	/** Default button glyph: U+25D1 CIRCLE WITH RIGHT HALF BLACK. */
	export const CIRCLE_WITH_RIGHT_HALF_BLACK = "◑";

	/** Arguments passed to a custom `children` snippet (the button glyph). */
	export type ChildArgs = {
		/** Currently selected theme slug. */
		value: string;
		/** Is the listbox open? */
		open: boolean;
		/** Resolve a slug to its display label. */
		labelFor: (theme: string) => string;
	};

	/** Public props for ThemeChooser. See `spec/index.md` §4 for the contract. */
	export type Props = {
		/** Accessible name for the button and the listbox. */
		label: string;
		/** Base URL of the themes directory, e.g. "/assets/themes/". */
		themesUrl: string;
		/** Available theme slugs. */
		themes: string[];
		/** Currently selected theme slug. Two-way bindable. */
		value?: string;
		/** Initial theme when nothing else is supplied. */
		defaultValue?: string;
		/** If set, persist the selection to localStorage under this key. */
		storageKey?: string;
		/** Resolve `prefers-color-scheme` to a supported theme on first visit. */
		detectFromSystem?: boolean;
		/** Discriminates the managed <link>; also the hidden input's `name`. */
		name?: string;
		/** File extension appended to each slug when constructing the URL. */
		extension?: string;
		/** Element that receives `data-theme`. Defaults to document.documentElement. */
		target?: HTMLElement | null;
		/** Optional pretty labels per slug. */
		themeLabels?: Record<string, string>;
		/** Replaces the default half-circle glyph inside the button. */
		children?: Snippet<[ChildArgs]>;
		/** Called after the control applies a new theme. */
		onChange?: (theme: string) => void;
		/** Extra CSS class on the root. */
		class?: string;
		/** Spread props onto the root element. */
		[key: string]: unknown;
	};

	/**
	 * Resolve a theme slug to its display label: each hyphen-separated
	 * word title-cased, so a slug like
	 * "united-kingdom-national-health-service-england-for-patients"
	 * renders as "United Kingdom National Health Service England For
	 * Patients". Mirrors `localeName` in locale-chooser.
	 */
	export function themeName(theme: string): string {
		return theme
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	}

	/**
	 * Resolve the OS colour-scheme preference to a supported theme slug.
	 * Mirrors `matchNavigatorLanguage` in locale-chooser. Returns "" when
	 * the preferred scheme is not in `themes`, or when matchMedia is
	 * unavailable (SSR).
	 */
	export function matchSystemTheme(themes: readonly string[]): string {
		if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
			return "";
		}
		const wanted = window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
		return themes.includes(wanted) ? wanted : "";
	}

	/** Normalise the themes directory URL to end with exactly one "/". */
	export function normaliseThemesUrl(themesUrl: string): string {
		return themesUrl.endsWith("/") ? themesUrl : themesUrl + "/";
	}

	/** Construct the href for a given theme slug. */
	export function themeHref(themesUrl: string, slug: string, extension: string): string {
		return normaliseThemesUrl(themesUrl) + slug + extension;
	}

	let uid = 0;
	/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
	export function nextThemeChooserId(): string {
		uid += 1;
		return `theme-chooser-${uid}`;
	}
</script>

<script lang="ts">
	let {
		class: className = "",
		label,
		themesUrl,
		themes,
		value = $bindable(""),
		defaultValue,
		storageKey,
		detectFromSystem = false,
		name = "theme",
		extension = ".css",
		target,
		themeLabels = {},
		children,
		onChange,
		...restProps
	}: Props = $props();

	const baseId = nextThemeChooserId();
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

	function labelFor(theme: string): string {
		if (theme in themeLabels) return themeLabels[theme];
		return themeName(theme);
	}

	function getManagedLink(): HTMLLinkElement {
		const selector = `link[data-lily-theme-chooser="${name}"]`;
		let link = document.head.querySelector<HTMLLinkElement>(selector);
		if (!link) {
			link = document.createElement("link");
			link.rel = "stylesheet";
			link.setAttribute("data-lily-theme-chooser", name);
			document.head.appendChild(link);
		}
		return link;
	}

	function applyTheme(slug: string): void {
		if (typeof document === "undefined" || !slug) return;
		getManagedLink().href = themeHref(themesUrl, slug, extension);
		(target ?? document.documentElement).setAttribute("data-theme", slug);
		if (storageKey) {
			try {
				localStorage.setItem(storageKey, slug);
			} catch {
				// ignore quota / privacy errors
			}
		}
		onChange?.(slug);
	}

	function setTheme(slug: string): void {
		value = slug;
	}

	// ---------------------------------------------------------------
	// Open / close
	// ---------------------------------------------------------------

	function openList(startIndex?: number): void {
		const selected = themes.indexOf(value);
		activeIndex = startIndex ?? (selected >= 0 ? selected : 0);
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
		const slug = themes[index];
		if (slug) setTheme(slug);
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
		if (themes.length === 0) return;
		const next = Math.min(Math.max(activeIndex + delta, 0), themes.length - 1);
		activeIndex = next;
		scrollActiveIntoView();
	}

	function runTypeahead(char: string): void {
		typeahead += char.toLowerCase();
		clearTimeout(typeaheadTimer);
		typeaheadTimer = setTimeout(() => (typeahead = ""), 500);
		const from = activeIndex < 0 ? 0 : activeIndex;
		// Search forward from the active option, wrapping once.
		for (let n = 0; n < themes.length; n++) {
			const i = (from + n) % themes.length;
			if (labelFor(themes[i]).toLowerCase().startsWith(typeahead)) {
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
				openList(themes.length - 1);
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
				activeIndex = themes.length - 1;
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
			case "Tab":
				// Tab moves on: close without stealing focus back.
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
			if (!initial && detectFromSystem) {
				initial = matchSystemTheme(themes);
			}

			if (!initial) {
				initial =
					defaultValue ??
					(themes.includes("light") ? "light" : themes[0]) ??
					"";
			}
			if (initial && initial !== current) {
				value = initial;
				return;
			}
		}

		if (current) applyTheme(current);
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
	class={`theme-chooser ${className}`.trim()}
	onfocusout={onRootFocusOut}
	{...restProps}
>
	<input type="hidden" {name} {value} />

	<button
		bind:this={buttonEl}
		type="button"
		class="theme-chooser-button"
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
			<span class="theme-chooser-icon" aria-hidden="true"
				>{CIRCLE_WITH_RIGHT_HALF_BLACK}</span
			>
		{/if}
	</button>

	<ul
		bind:this={listEl}
		class="theme-chooser-list"
		id={listId}
		role="listbox"
		aria-label={label}
		aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
		tabindex="-1"
		hidden={!open}
		onkeydown={onListKeydown}
	>
		{#each themes as theme, i (theme)}
			<li
				class="theme-chooser-option"
				id={optionId(i)}
				role="option"
				aria-selected={theme === value}
				data-active={i === activeIndex ? "" : undefined}
				onclick={() => choose(i)}
			>
				{labelFor(theme)}
			</li>
		{/each}
	</ul>
</div>
