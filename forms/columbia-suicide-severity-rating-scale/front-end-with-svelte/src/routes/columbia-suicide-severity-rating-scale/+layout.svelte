<script lang="ts">
    import "../../app.css";
    import { base } from "$app/paths";
    import { page } from "$app/state";
    import ThemePicker from "$lib/components/ui/ThemePicker.svelte";
    import {
        THEME_OPTIONS,
        THEME_STORAGE_KEY,
        DEFAULT_THEME,
    } from "$lib/config/themes";
    import LocalePicker from "$lib/components/ui/LocalePicker.svelte";
    import {
        LOCALE_OPTIONS,
        LOCALE_STORAGE_KEY,
        DEFAULT_LOCALE,
    } from "$lib/config/locales";
    import TextSizePicker from "$lib/components/ui/TextSizePicker.svelte";
    import SharePicker from "$lib/components/ui/SharePicker.svelte";
    import {
        TEXT_SIZE_OPTIONS,
        TEXT_SIZE_STORAGE_KEY,
        DEFAULT_TEXT_SIZE,
    } from "$lib/config/text-sizes";
    let { children } = $props();

    const navClass = (href: string) =>
        page.url.pathname === href
            ? "rounded-md px-3 py-2 text-sm font-semibold text-primary bg-primary/10"
            : "rounded-md px-3 py-2 text-sm font-medium text-base-content/70 hover:bg-base-200";

    // ThemePicker/LocalePicker manage <link>/data-theme/lang/dir + localStorage themselves.
    const themeValues = THEME_OPTIONS.map((o) => o.value);
    const themeLabels = Object.fromEntries(
        THEME_OPTIONS.map((o) => [o.value, o.label]),
    );
    const localeValues = LOCALE_OPTIONS.map((o) => o.value);
    const localeLabels = Object.fromEntries(
        LOCALE_OPTIONS.map((o) => [o.value, o.label]),
    );
    const textSizeValues = TEXT_SIZE_OPTIONS.map((o) => o.value);
    const textSizeLabels = Object.fromEntries(
        TEXT_SIZE_OPTIONS.map((o) => [o.value, o.label]),
    );
</script>

<svelte:head>
    <title>Columbia Suicide Severity Rating Scale (C-SSRS)</title>
</svelte:head>

<div class="min-h-screen bg-base-200 text-base-content">
    <nav class="border-b border-base-300 bg-base-100 shadow-sm no-print">
        <div
            class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3"
        >
            <a
                href="/columbia-suicide-severity-rating-scale/"
                class="text-lg font-bold text-base-content">C-SSRS</a
            >
            <div class="flex items-center gap-1">
                <a
                    href="/columbia-suicide-severity-rating-scale/"
                    class={navClass("/")}>Welcome</a
                >
                <a
                    href="/columbia-suicide-severity-rating-scale/columbia-suicide-severity-rating-scales/new"
                    class={navClass(
                        "/columbia-suicide-severity-rating-scales/new",
                    )}>New assessment</a
                >
                <a
                    href="/columbia-suicide-severity-rating-scale/columbia-suicide-severity-rating-scales"
                    class={navClass("/columbia-suicide-severity-rating-scales")}
                    >Dashboard</a
                >
                <LocalePicker
                    label="Language"
                    class="ml-2"
                    locales={localeValues}
                    {localeLabels}
                    defaultValue={DEFAULT_LOCALE}
                    storageKey={LOCALE_STORAGE_KEY}
                />
                <ThemePicker
                    label="Theme"
                    class="ml-2"
                    themesUrl={`${base}/themes/`}
                    themes={themeValues}
                    {themeLabels}
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
