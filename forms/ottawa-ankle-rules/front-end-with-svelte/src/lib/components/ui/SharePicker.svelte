<script lang="ts" module>
	import type { Snippet } from "svelte";

	/**
	 * Default button glyph: U+27A4 BLACK RIGHTWARDS ARROWHEAD.
	 *
	 * An in-font arrow rather than a pictograph, matching the other helpers'
	 * rule: it renders in the page's own font on every platform and stays
	 * monochrome alongside theme-picker's ◑, locale-picker's 🌐 and
	 * text-size-picker's "A".
	 */
	export const BLACK_RIGHTWARDS_ARROWHEAD = "\u27A4";

	/**
	 * One destination in the share list.
	 *
	 * `href` is a function, not a string, so the consumer owns the whole URL
	 * — this package ships no third-party endpoints and takes no view on
	 * which networks exist. See `spec/index.md` §3.
	 */
	export type ShareTarget = {
		/** Stable identifier, passed back to `onShare`. */
		id: string;
		/** Visible link text. Consumer-supplied, so it localises. */
		label: string;
		/** Build the destination URL from the shared page's metadata. */
		href: (url: string, title: string, text: string) => string;
		/** Overrides the default `target="_blank"` for this destination. */
		newTab?: boolean;
	};

	/** Arguments passed to a custom `children` snippet (the button glyph). */
	export type ChildArgs = {
		/** Is the list open? */
		open: boolean;
		/** The URL that would be shared right now. */
		url: string;
	};

	/** How the button behaves when activated. */
	export type ShareStrategy = "auto" | "native" | "list";

	/** Public props for SharePicker. See `spec/index.md` §4 for the contract. */
	export type Props = {
		/** Accessible name for the button and the list. */
		label: string;
		/** Destinations to offer. Empty is valid if `copyLabel` is set. */
		targets?: ShareTarget[];
		/** URL to share. Defaults to the current page URL, read at share time. */
		url?: string;
		/** Title passed to `href(...)` and to the native share sheet. */
		title?: string;
		/** Longer text passed to `href(...)` and to the native share sheet. */
		text?: string;
		/**
		 * Label for the built-in copy-to-clipboard item. The item renders
		 * only when this is supplied — there is no default, because a
		 * default would be a hardcoded English string.
		 */
		copyLabel?: string;
		/** Announced in the status region after a successful copy. */
		copiedLabel?: string;
		/** Announced in the status region when the clipboard write fails. */
		copyFailedLabel?: string;
		/**
		 * `"auto"` (default) uses the native share sheet when the browser
		 * provides one and falls back to the list; `"native"` always tries
		 * the sheet; `"list"` always shows the list.
		 */
		strategy?: ShareStrategy;
		/** Replaces the default ➤ glyph inside the button. */
		children?: Snippet<[ChildArgs]>;
		/** Fires after a destination is chosen, with its `id`. */
		onShare?: (targetId: string, url: string) => void;
		/** Fires after the URL is copied. */
		onCopy?: (url: string) => void;
		/** Fires when the native share sheet is used, instead of the list. */
		onNativeShare?: (url: string) => void;
		/** Extra CSS class on the root. */
		class?: string;
		/** Spread props onto the root element. */
		[key: string]: unknown;
	};

	/** Is a native share sheet available? SSR-safe. */
	export function canShareNatively(): boolean {
		return typeof navigator !== "undefined" && typeof navigator.share === "function";
	}

	/** Is an async clipboard available? SSR-safe. */
	export function canCopy(): boolean {
		return (
			typeof navigator !== "undefined" &&
			typeof navigator.clipboard?.writeText === "function"
		);
	}

	let uid = 0;
	/** Stable per-instance id prefix; SSR-safe (no Math.random / Date.now). */
	export function nextSharePickerId(): string {
		uid += 1;
		return `share-picker-${uid}`;
	}
</script>

<script lang="ts">
	let {
		class: className = "",
		label,
		targets = [],
		url,
		title = "",
		text = "",
		copyLabel,
		copiedLabel,
		copyFailedLabel,
		strategy = "auto",
		children,
		onShare,
		onCopy,
		onNativeShare,
		...restProps
	}: Props = $props();

	const baseId = nextSharePickerId();
	const listId = `${baseId}-list`;

	let open = $state(false);
	let status = $state("");
	let buttonEl: HTMLButtonElement | undefined = $state();
	let listEl: HTMLUListElement | undefined = $state();
	let rootEl: HTMLDivElement | undefined = $state();

	/**
	 * The URL to share. Resolved lazily so the default works without the
	 * consumer threading `location.href` through, and so SSR never touches
	 * `location`.
	 */
	function currentUrl(): string {
		if (url) return url;
		return typeof location !== "undefined" ? location.href : "";
	}

	/** Every focusable item in the list, in DOM order. */
	function items(): HTMLElement[] {
		if (!listEl) return [];
		return Array.from(
			listEl.querySelectorAll<HTMLElement>(".share-picker-target, .share-picker-copy"),
		);
	}

	function openList(focusLast = false): void {
		open = true;
		status = "";
		queueMicrotask(() => {
			const all = items();
			(focusLast ? all[all.length - 1] : all[0])?.focus();
		});
	}

	function closeList(refocus = true): void {
		if (!open) return;
		open = false;
		if (refocus) queueMicrotask(() => buttonEl?.focus());
	}

	async function shareNatively(): Promise<boolean> {
		if (!canShareNatively()) return false;
		const shareUrl = currentUrl();
		try {
			await navigator.share({ url: shareUrl, title, text });
			onNativeShare?.(shareUrl);
			return true;
		} catch {
			// A rejected promise here is almost always the user dismissing
			// the sheet, which is not an error and must not fall through to
			// the list — that would reopen UI they just dismissed.
			return true;
		}
	}

	async function onButtonClick(): Promise<void> {
		if (open) {
			closeList();
			return;
		}
		if (strategy === "native" || (strategy === "auto" && canShareNatively())) {
			if (await shareNatively()) return;
		}
		openList();
	}

	function onButtonKeydown(event: KeyboardEvent): void {
		// Enter and Space are the button's own activation keys and already
		// produce a click; only the arrows need handling here.
		if (event.key === "ArrowDown") {
			event.preventDefault();
			if (!open) openList();
			else items()[0]?.focus();
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			if (!open) openList(true);
			else items()[items().length - 1]?.focus();
		}
	}

	function moveFocus(delta: number): void {
		const all = items();
		if (all.length === 0) return;
		const i = all.indexOf(document.activeElement as HTMLElement);
		const next = Math.min(Math.max((i < 0 ? 0 : i) + delta, 0), all.length - 1);
		all[next]?.focus();
	}

	function onListKeydown(event: KeyboardEvent): void {
		switch (event.key) {
			case "ArrowDown":
				event.preventDefault();
				moveFocus(1);
				break;
			case "ArrowUp":
				event.preventDefault();
				moveFocus(-1);
				break;
			case "Home":
				event.preventDefault();
				items()[0]?.focus();
				break;
			case "End": {
				event.preventDefault();
				const all = items();
				all[all.length - 1]?.focus();
				break;
			}
			case "Escape":
				event.preventDefault();
				closeList();
				break;
			case "Tab":
				// Tab leaves the control: close, but let focus go where the
				// browser was sending it.
				closeList(false);
				break;
		}
	}

	function onRootFocusOut(event: FocusEvent): void {
		const next = event.relatedTarget as Node | null;
		if (next && rootEl?.contains(next)) return;
		closeList(false);
	}

	function chooseTarget(target: ShareTarget): void {
		onShare?.(target.id, currentUrl());
		closeList();
	}

	async function copyUrl(): Promise<void> {
		const shareUrl = currentUrl();
		try {
			if (!canCopy()) throw new Error("clipboard unavailable");
			await navigator.clipboard.writeText(shareUrl);
			onCopy?.(shareUrl);
			if (copiedLabel) status = copiedLabel;
		} catch {
			if (copyFailedLabel) status = copyFailedLabel;
		}
		closeList();
	}
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
	class={`share-picker ${className}`.trim()}
	onfocusout={onRootFocusOut}
	{...restProps}
>
	<button
		bind:this={buttonEl}
		type="button"
		class="share-picker-button"
		aria-label={label}
		aria-expanded={open}
		aria-controls={listId}
		onclick={onButtonClick}
		onkeydown={onButtonKeydown}
	>
		{#if children}
			{@render children({ open, url: currentUrl() })}
		{:else}
			<span class="share-picker-icon" aria-hidden="true"
				>{BLACK_RIGHTWARDS_ARROWHEAD}</span
			>
		{/if}
	</button>

	<ul
		bind:this={listEl}
		class="share-picker-list"
		id={listId}
		hidden={!open}
		onkeydown={onListKeydown}
	>
		{#each targets as target (target.id)}
			<li class="share-picker-list-item">
				<!-- A real link, not role="menuitem": these ARE navigation,
					 and menuitem would strip middle-click, open-in-new-tab
					 and copy-link-address. -->
				<a
					class="share-picker-target"
					data-target-id={target.id}
					href={target.href(currentUrl(), title, text)}
					target={target.newTab === false ? undefined : "_blank"}
					rel="noopener noreferrer"
					onclick={() => chooseTarget(target)}
				>
					{target.label}
				</a>
			</li>
		{/each}

		{#if copyLabel}
			<li class="share-picker-list-item">
				<button type="button" class="share-picker-copy" onclick={copyUrl}>
					{copyLabel}
				</button>
			</li>
		{/if}
	</ul>

	<!-- Copying gives no visual feedback of its own, so the outcome is
		 announced. Empty until something happens, so it stays silent on
		 load; aria-live announces mutations only. -->
	<p class="share-picker-status" aria-live="polite">{status}</p>
</div>
