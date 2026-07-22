<script lang="ts">
	import '../../app.css';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import ThemeChooser from '$lib/components/ui/ThemeChooser.svelte';
	import { THEME_OPTIONS, THEME_STORAGE_KEY, DEFAULT_THEME } from '$lib/config/themes';
	import LocaleChooser from '$lib/components/ui/LocaleChooser.svelte';
	import { LOCALE_OPTIONS, LOCALE_STORAGE_KEY, DEFAULT_LOCALE } from '$lib/config/locales';
	import TextSizeChooser from '$lib/components/ui/TextSizeChooser.svelte';
	import ShareChooser from '$lib/components/ui/ShareChooser.svelte';
	import { TEXT_SIZE_OPTIONS, TEXT_SIZE_STORAGE_KEY, DEFAULT_TEXT_SIZE } from '$lib/config/text-sizes';
	let { children } = $props();

	const navClass = (href: string) =>
		page.url.pathname === href
			? 'rounded-md px-3 py-2 text-sm font-semibold text-primary bg-primary/10'
			: 'rounded-md px-3 py-2 text-sm font-medium text-base-content/70 hover:bg-base-200';

	// ThemeChooser/LocaleChooser manage <link>/data-theme/lang/dir + localStorage themselves.
	const themeValues = THEME_OPTIONS.map((o) => o.value);
	const themeLabels = Object.fromEntries(THEME_OPTIONS.map((o) => [o.value, o.label]));
	const localeValues = LOCALE_OPTIONS.map((o) => o.value);
	const localeLabels = Object.fromEntries(LOCALE_OPTIONS.map((o) => [o.value, o.label]));
	const textSizeValues = TEXT_SIZE_OPTIONS.map((o) => o.value);
	const textSizeLabels = Object.fromEntries(TEXT_SIZE_OPTIONS.map((o) => [o.value, o.label]));
</script>

<svelte:head>
	<title>Cardiology Assessment</title>
</svelte:head>

<div class="min-h-screen bg-base-200 text-base-content">
	<nav class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
			<a href="/cardiology-assessment/" class="text-lg font-bold text-base-content">Cardiology Assessment</a>
			<div class="flex items-center gap-1">
				<a href="/cardiology-assessment/" class={navClass('/')}>Welcome</a>
				<a href="/cardiology-assessment/cardiology-assessments/new" class={navClass('/cardiology-assessments/new')}>New assessment</a>
				<a href="/cardiology-assessment/cardiology-assessments" class={navClass('/cardiology-assessments')}>Dashboard</a>
				<LocaleChooser
					label="Language"
					class="ml-2"
					locales={localeValues}
					localeLabels={localeLabels}
					defaultValue={DEFAULT_LOCALE}
					storageKey={LOCALE_STORAGE_KEY}
				/>
				<ThemeChooser
					label="Theme"
					class="ml-2"
					themesUrl={`${base}/themes/`}
					themes={themeValues}
					themeLabels={themeLabels}
					defaultValue={DEFAULT_THEME}
					storageKey={THEME_STORAGE_KEY}
				/>
				<TextSizeChooser
					label="Text size"
					class="ml-2"
					sizes={textSizeValues}
					sizeLabels={textSizeLabels}
					defaultValue={DEFAULT_TEXT_SIZE}
					storageKey={TEXT_SIZE_STORAGE_KEY}
				/>
				<ShareChooser
					label="Share this page"
					class="ml-2"
					copyLabel="Copy link"
					copiedLabel="Link copied"
					copyFailedLabel="Could not copy — copy it from the address bar"
				/>
			</div>
		</div>
	</nav>

	{@render children()}
</div>
