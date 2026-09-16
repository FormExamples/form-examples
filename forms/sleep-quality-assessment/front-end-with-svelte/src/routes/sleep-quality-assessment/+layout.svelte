<script lang="ts">
	import '../../app.css';
	import { page } from '$app/state';
	import PickerBar from "lily-design-system-svelte-picker-bar";
	import { SHARE_TARGETS } from "#lib/config/share-targets.js";
	import { THEME_OPTIONS, THEME_STORAGE_KEY, DEFAULT_THEME } from '#lib/config/themes.js';
	import { LOCALE_OPTIONS, LOCALE_STORAGE_KEY, DEFAULT_LOCALE } from '#lib/config/locales.js';
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
	<title>Sleep Quality Assessment</title>
</svelte:head>

<div class="min-h-screen bg-base-200 text-base-content">
	<nav class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
			<a href="/sleep-quality-assessment/" class="text-lg font-bold text-base-content">Sleep Quality Assessment</a>
			<div class="flex items-center gap-1">
				<a href="/sleep-quality-assessment/" class={navClass('/')}>Welcome</a>
				<a href="/sleep-quality-assessment/sleep-quality-assessments/new" class={navClass('/sleep-quality-assessments/new')}>New assessment</a>
				<a href="/sleep-quality-assessment/sleep-quality-assessments" class={navClass('/sleep-quality-assessments')}>Dashboard</a>
				<PickerBar
					class="ml-2"
					labels={{
						theme: "Theme",
						locale: "Language",
						textSize: "Text size",
						share: "Share this page",
					}}
					themesUrl="/themes/"
					themes={themeValues}
					themeProps={{ themeLabels, defaultValue: DEFAULT_THEME, storageKey: THEME_STORAGE_KEY }}
					locales={localeValues}
					localeProps={{ localeLabels, defaultValue: DEFAULT_LOCALE, storageKey: LOCALE_STORAGE_KEY }}
					sizes={textSizeValues}
					textSizeProps={{ sizeLabels: textSizeLabels, defaultValue: DEFAULT_TEXT_SIZE, storageKey: TEXT_SIZE_STORAGE_KEY }}
					shareTargets={SHARE_TARGETS}
					shareProps={{ copyLabel: "Copy Link", copiedLabel: "Link copied", copyFailedLabel: "Could not copy — copy it from the address bar" }}
				/>
			</div>
		</div>
	</nav>

	{@render children()}
</div>
