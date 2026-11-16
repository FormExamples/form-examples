<script lang="ts">
    // VideoPlayer component
    //
    // A <video> rendered inside a <figure>. Optionally autoplays on scroll: with `autoplay` the video
    // plays when at least half of it is in view and pauses when it leaves. The native controls are on by
    // default; `children` render in `.video-player-controls` and `caption` in a <figcaption>.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   src — string, required. The video URL.
    //   label — string, required. Accessible name. Rendered as aria-label on the <figure>.
    //   poster — string, optional. Poster image URL.
    //   autoplay — boolean, default false. Play when scrolled into view and pause when out of view (not the native autoplay attribute).
    //   muted — boolean, default false. Browsers usually block sound-on autoplay, so set it with `autoplay`.
    //   loop — boolean, default false.
    //   controls — boolean, default true. Native controls.
    //   caption — Snippet, optional. Rendered in `.video-player-caption`.
    //   children — Snippet, optional. Extra controls, rendered in `.video-player-controls`.
    //   ...restProps — additional HTML attributes spread onto the root <figure>.
    //
    // Syntax:
    //   <VideoPlayer src="…" label="…" {caption} />
    //
    // Examples:
    //   <VideoPlayer src="/talk.mp4" label="Opening talk" poster="/talk.jpg" {caption} />
    //
    // Keyboard:
    //   - Native <video controls> keys apply (Space toggles playback, arrows seek and change volume in most browsers)
    //
    // Accessibility:
    //   - Provide captions with a <track kind="captions"> child through restProps or a wrapper (WCAG 1.2.2); the component does not render tracks
    //   - Auto-playing media over 5 seconds needs a way to pause (WCAG 2.2.2); keep `controls` on when using `autoplay`
    //   - aria-label on the <figure> names the video; a <figcaption> is also available
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - The play() promise rejection (blocked autoplay) is swallowed
    //   - Without IntersectionObserver `autoplay` does nothing
    //
    // References:
    //   - MDN <video>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
    //   - WCAG 2.2.2 Pause, Stop, Hide: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html

    import { warnMissingName } from "../dev-warning";
    import type { Snippet } from "svelte";

    let {
        class: className = "",
        src,
        label,
        poster = undefined,
        autoplay = false,
        muted = false,
        loop = false,
        controls = true,
        caption = undefined,
        children = undefined,
        ...restProps
    }: {
        src: string;
        label: string;
        poster?: string;
        autoplay?: boolean;
        muted?: boolean;
        loop?: boolean;
        controls?: boolean;
        caption?: Snippet;
        children?: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName(
            "VideoPlayer",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );

    let videoEl: HTMLVideoElement | undefined = $state(undefined);

    $effect(() => {
        if (!autoplay) return;
        const video = videoEl;
        if (!video || typeof IntersectionObserver === "undefined") return;
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        void video.play().catch(() => {});
                    } else {
                        video.pause();
                    }
                }
            },
            { threshold: 0.5 },
        );
        observer.observe(video);
        return () => observer.disconnect();
    });
</script>

<!-- VideoPlayer.svelte -->
<figure
    class={`video-player ${className}`}
    aria-label={label}
    {...restProps}
>
    <video
        bind:this={videoEl}
        class="video-player-element"
        {src}
        {poster}
        {muted}
        {loop}
        {controls}
        playsinline
    ></video>
    {#if children}
        <div class="video-player-controls">{@render children()}</div>
    {/if}
    {#if caption}
        <figcaption class="video-player-caption">{@render caption()}</figcaption>
    {/if}
</figure>
