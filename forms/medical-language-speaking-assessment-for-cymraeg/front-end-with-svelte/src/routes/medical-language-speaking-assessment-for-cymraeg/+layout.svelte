<script lang="ts">
	import '../../app.css';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import ThemeChooser from '$lib/components/ui/ThemeChooser.svelte';
	import LocaleChooser from '$lib/components/ui/LocaleChooser.svelte';
	import TextSizeChooser from '$lib/components/ui/TextSizeChooser.svelte';
	import ShareChooser from '$lib/components/ui/ShareChooser.svelte';
	import { THEME_OPTIONS, THEME_STORAGE_KEY, DEFAULT_THEME } from '$lib/config/themes';
	import { TEXT_SIZE_OPTIONS, TEXT_SIZE_STORAGE_KEY, DEFAULT_TEXT_SIZE } from '$lib/config/text-sizes';
	import { locale, LOCALE_OPTIONS } from '$lib/i18n/locale.svelte';
	const t = locale.t;
	let { children } = $props();

	const plural = 'medical-language-speaking-assessments-for-cymraeg';
	// Locale-aware document/app title (kept in sync with the active UI language).
	const title = $derived(t('appTitle'));
	// Local mirror of the store locale so LocaleChooser binds a plain string; the
	// effect narrows and pushes the choice back into the shared locale store,
	// which remains the sole authority over <html lang> (its own BCP-47 mapping,
	// e.g. 'en' -> 'en-GB') and message lookup via t(). LocaleChooser's own
	// lang/dir/storage management is redirected onto a detached decoy element
	// so it never touches the real <html> tag and fights the store's effect.
	let localeValue = $state(locale.current as string);
	$effect(() => {
		locale.set(localeValue);
	});
	const localeDecoyTarget = typeof document !== 'undefined' ? document.createElement('div') : undefined;

	const navClass = (href: string) =>
		page.url.pathname === href
			? 'rounded-md px-3 py-2 text-sm font-semibold text-primary bg-primary/10'
			: 'rounded-md px-3 py-2 text-sm font-medium text-base-content/70 hover:bg-base-200';

	// ThemeChooser manages <link>/data-theme/localStorage itself.
	const themeValues = THEME_OPTIONS.map((o) => o.value);
	const themeLabels = Object.fromEntries(THEME_OPTIONS.map((o) => [o.value, o.label]));
	const localeValues = LOCALE_OPTIONS.map((opt) => opt.value);
	const localeLabels = Object.fromEntries(LOCALE_OPTIONS.map((opt) => [opt.value, opt.label]));
	const textSizeValues = TEXT_SIZE_OPTIONS.map((o) => o.value);
	const textSizeLabels = Object.fromEntries(TEXT_SIZE_OPTIONS.map((o) => [o.value, o.label]));
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="min-h-screen bg-base-200 text-base-content">
	<nav class="border-b border-base-300 bg-base-100 shadow-sm no-print">
		<div class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
			<a href="/medical-language-speaking-assessment-for-cymraeg/" class="text-lg font-bold text-base-content">{t('brand')}</a>
			<div class="flex items-center gap-1">
				<a href="/medical-language-speaking-assessment-for-cymraeg/" class={navClass('/')}>{t('navWelcome')}</a>
				<a href={`/${plural}/new`} class={navClass(`/${plural}/new`)}>{t('navNewAssessment')}</a>
				<a href={`/${plural}`} class={navClass(`/${plural}`)}>{t('navDashboard')}</a>
				<LocaleChooser
					label={t('localeLabel')}
					class="ml-2"
					locales={localeValues}
					localeLabels={localeLabels}
					bind:value={localeValue}
					target={localeDecoyTarget}
				/>
				<ThemeChooser
					label={t('themeLabel')}
					class="ml-2"
					themesUrl={`${base}/themes/`}
					themes={themeValues}
					themeLabels={themeLabels}
					defaultValue={DEFAULT_THEME}
					storageKey={THEME_STORAGE_KEY}
				/>
				<TextSizeChooser
					label={t('textSizeLabel')}
					class="ml-2"
					sizes={textSizeValues}
					sizeLabels={textSizeLabels}
					defaultValue={DEFAULT_TEXT_SIZE}
					storageKey={TEXT_SIZE_STORAGE_KEY}
				/>
				<ShareChooser
					label={t('shareLabel')}
					class="ml-2"
					copyLabel={t('copyLinkLabel')}
					copiedLabel={t('linkCopiedLabel')}
					copyFailedLabel={t('copyFailedLabel')}
				/>
			</div>
		</div>
	</nav>

	{@render children()}
</div>
