<script lang="ts">
	import '../app.css';
	import { base } from '$app/paths';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import ThemeSelect from '$lib/components/ui/ThemeSelect.svelte';
	import ThemeSelectOption from '$lib/components/ui/ThemeSelectOption.svelte';
	import { THEME_OPTIONS, THEME_STORAGE_KEY, DEFAULT_THEME } from '$lib/config/themes';
	let { children } = $props();

	const navClass = (href: string) =>
		page.url.pathname === href
			? 'rounded-md px-3 py-2 text-sm font-semibold text-primary bg-primary/10'
			: 'rounded-md px-3 py-2 text-sm font-medium text-base-content/70 hover:bg-base-200';

	// Default theme is the Lily Design System light theme (gold standard).
	let theme = $state(
		browser ? (localStorage.getItem(THEME_STORAGE_KEY) ?? DEFAULT_THEME) : DEFAULT_THEME
	);

	// The active Lily theme stylesheet — exactly one standalone file at a time.
	const themeHref = $derived(`${base}/themes/${theme}.css`);

	// Mirror the choice onto <html data-theme> and persist it.
	$effect(() => {
		if (!browser) return;
		document.documentElement.dataset.theme = theme;
		localStorage.setItem(THEME_STORAGE_KEY, theme);
	});
</script>

<svelte:head>
	<title>Screening Program Privacy Notice</title>
	<link rel="stylesheet" href={themeHref} />
</svelte:head>

<div class="min-h-screen bg-base-200 text-base-content">
	<nav class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
			<a href="/screening-program-privacy-notice/" class="text-lg font-bold text-base-content">Screening Program Privacy Notice</a>
			<div class="flex items-center gap-1">
				<a href="/screening-program-privacy-notice/" class={navClass('/')}>Welcome</a>
				<a
					href="/screening-program-privacy-notice/screening-program-privacy-notices/new"
					class={navClass('/screening-program-privacy-notices/new')}>New acknowledgment</a
				>
				<a
					href="/screening-program-privacy-notice/screening-program-privacy-notices"
					class={navClass('/screening-program-privacy-notices')}>Dashboard</a
				>
				<ThemeSelect label="Theme" class="ml-2" bind:value={theme}>
					{#each THEME_OPTIONS as opt (opt.value)}
						<ThemeSelectOption value={opt.value}>{opt.label}</ThemeSelectOption>
					{/each}
				</ThemeSelect>
			</div>
		</div>
	</nav>

	{@render children()}
</div>
