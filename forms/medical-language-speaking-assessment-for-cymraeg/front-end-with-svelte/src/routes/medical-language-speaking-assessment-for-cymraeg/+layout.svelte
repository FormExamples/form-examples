<script lang="ts">
	import '../../app.css';
	import { base } from '$app/paths';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import ThemeSelect from '$lib/components/ui/ThemeSelect.svelte';
	import ThemeSelectOption from '$lib/components/ui/ThemeSelectOption.svelte';
	import LocaleSelect from '$lib/components/ui/LocaleSelect.svelte';
	import LocaleSelectOption from '$lib/components/ui/LocaleSelectOption.svelte';
	import { THEME_OPTIONS, THEME_STORAGE_KEY, DEFAULT_THEME } from '$lib/config/themes';
	import { locale, LOCALE_OPTIONS } from '$lib/i18n/locale.svelte';
	const t = locale.t;
	let { children } = $props();

	const plural = 'medical-language-speaking-assessments-for-cymraeg';
	// Locale-aware document/app title (kept in sync with the active UI language).
	const title = $derived(t('appTitle'));
	// Local mirror of the store locale so <select> binds a plain string; the
	// effect narrows and pushes the choice back into the shared locale store.
	let localeValue = $state(locale.current as string);
	$effect(() => {
		locale.set(localeValue);
	});

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
	<title>{title}</title>
	<link rel="stylesheet" href={themeHref} />
</svelte:head>

<div class="min-h-screen bg-base-200 text-base-content">
	<nav class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
			<a href="/medical-language-speaking-assessment-for-cymraeg/" class="text-lg font-bold text-base-content">{t('brand')}</a>
			<div class="flex items-center gap-1">
				<a href="/medical-language-speaking-assessment-for-cymraeg/" class={navClass('/')}>{t('navWelcome')}</a>
				<a href={`/${plural}/new`} class={navClass(`/${plural}/new`)}>{t('navNewAssessment')}</a>
				<a href={`/${plural}`} class={navClass(`/${plural}`)}>{t('navDashboard')}</a>
				<LocaleSelect label={t('localeLabel')} class="ml-2" bind:value={localeValue}>
					{#each LOCALE_OPTIONS as opt (opt.value)}
						<LocaleSelectOption value={opt.value}>{opt.label}</LocaleSelectOption>
					{/each}
				</LocaleSelect>
				<ThemeSelect label={t('themeLabel')} class="ml-2" bind:value={theme}>
					{#each THEME_OPTIONS as opt (opt.value)}
						<ThemeSelectOption value={opt.value}>{opt.label}</ThemeSelectOption>
					{/each}
				</ThemeSelect>
			</div>
		</div>
	</nav>

	{@render children()}
</div>
