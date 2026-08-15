<script lang="ts">
	import '../../app.css';
	import { page } from '$app/state';
	import ThemePicker from '#lib/components/ui/ThemePicker.svelte';
	import { THEME_OPTIONS, THEME_STORAGE_KEY, DEFAULT_THEME } from '#lib/config/themes.js';
	import LocalePicker from '#lib/components/ui/LocalePicker.svelte';
	import { LOCALE_OPTIONS, LOCALE_STORAGE_KEY, DEFAULT_LOCALE } from '#lib/config/locales.js';
	import TextSizePicker from '#lib/components/ui/TextSizePicker.svelte';
	import SharePicker from '#lib/components/ui/SharePicker.svelte';
	import { TEXT_SIZE_OPTIONS, TEXT_SIZE_STORAGE_KEY, DEFAULT_TEXT_SIZE } from '#lib/config/text-sizes.js';
	let { children } = $props();

	const navClass = (href: string) =>
		page.url.pathname === href
			? 'rounded-md px-3 py-2 text-sm font-semibold text-primary bg-primary/10'
			: 'rounded-md px-3 py-2 text-sm font-medium text-base-content/70 hover:bg-base-200';

	// ThemePicker/LocalePicker manage <link>/data-theme/lang/dir + localStorage themselves.
	const themeValues = THEME_OPTIONS.map((o) => o.value);
	const themeLabels = Object.fromEntries(THEME_OPTIONS.map((o) => [o.value, o.label]));
	const localeValues = LOCALE_OPTIONS.map((o) => o.value);
	const localeLabels = Object.fromEntries(LOCALE_OPTIONS.map((o) => [o.value, o.label]));
	const textSizeValues = TEXT_SIZE_OPTIONS.map((o) => o.value);
	const textSizeLabels = Object.fromEntries(TEXT_SIZE_OPTIONS.map((o) => [o.value, o.label]));
</script>

<svelte:head>
	<title>MRI Scan Test Request</title>
</svelte:head>

<div class="min-h-screen bg-base-200 text-base-content">
	<nav class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
			<a href="/mri-scan-test-request/" class="text-lg font-bold text-base-content">MRI Scan Test Request</a>
			<div class="flex items-center gap-1">
				<a href="/mri-scan-test-request/" class={navClass('/')}>Welcome</a>
				<a href="/mri-scan-test-request/mri-scan-test-requests/new" class={navClass('/mri-scan-test-requests/new')}>New request</a>
				<a href="/mri-scan-test-request/mri-scan-test-requests" class={navClass('/mri-scan-test-requests')}>Vetting dashboard</a>
				<LocalePicker
					label="Language"
					class="ml-2"
					locales={localeValues}
					localeLabels={localeLabels}
					defaultValue={DEFAULT_LOCALE}
					storageKey={LOCALE_STORAGE_KEY}
				/>
				<ThemePicker
					label="Theme"
					class="ml-2"
					themesUrl="/themes/"
					themes={themeValues}
					themeLabels={themeLabels}
					defaultValue={DEFAULT_THEME}
					storageKey={THEME_STORAGE_KEY}
				/>
				<TextSizePicker
					label="Text size"
					class="ml-2"
					sizes={textSizeValues}
					sizeLabels={textSizeLabels}
					defaultValue={DEFAULT_TEXT_SIZE}
					storageKey={TEXT_SIZE_STORAGE_KEY}
				/>
				<SharePicker
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
