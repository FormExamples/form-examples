<script lang="ts">
    // ScrollerVideo component
    //
    // Scroll-driven video: the muted <video>'s currentTime advances in proportion to scroll progress while
    // the foreground children scroll over the sticky video. Built on ScrollerBase; progress 0 to 1 maps to
    // 0 to the video's duration.
    //
    // Props:
    //   className — string, optional. CSS class name.
    //   src — string, required. The video URL.
    //   label — string, required. Accessible name. Rendered as aria-label on the root.
    //   alt — string, required. Text alternative for the video, on its role="img" background.
    //   offset — number, default 0.5. Passed to ScrollerBase.
    //   onIndexChange — (index: number) => void, optional. Called when the active step changes.
    //   onProgressChange — (progress: number) => void, optional. Called with the scroll progress after the video time is set.
    //   children — Snippet, required. The foreground steps.
    //   ...restProps — additional HTML attributes spread onto the root <div>.
    //
    // Syntax:
    //   <ScrollerVideo src="…" label="…" alt="…">…steps…</ScrollerVideo>
    //
    // Examples:
    //   <ScrollerVideo src="/city.mp4" label="A day in the city" alt="Time-lapse of the city from dawn to dusk"><section>Morning</section><section>Evening</section></ScrollerVideo>
    //
    // Keyboard:
    //   - None -- not interactive; any interactive children handle their own keys; the page scrolls with the usual keys, which also drive the video
    //
    // Accessibility:
    //   - The background is role="img" with aria-roledescription="scrollable video" and aria-label from `alt`
    //   - The video is muted and has no controls; it carries no sound or captions, so any spoken content needs a text alternative in the steps
    //   - Motion follows the user's scrolling, so it stops when they stop; still honour prefers-reduced-motion in the consumer's CSS
    //
    // Internationalization:
    //   - No hardcoded user-facing strings
    //
    // Claude rules:
    //   - Headless: no CSS, no styles -- consumer provides all styling
    //   - The video is forced muted and playsinline in an effect, which scroll-seeking needs on mobile
    //   - currentTime is set only once the video's duration is known
    //
    // References:
    //   - Reuters Graphics ScrollerVideo (the inspiration): https://github.com/reuters-graphics/graphics-components
    //   - MDN <video>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video

    import { warnMissingName } from "../dev-warning";
    import type { Snippet } from "svelte";
    import ScrollerBase from "../ScrollerBase/ScrollerBase.svelte";

    let {
        class: className = "",
        src,
        label,
        alt,
        offset = 0.5,
        onIndexChange = undefined,
        onProgressChange = undefined,
        children,
        ...restProps
    }: {
        src: string;
        label: string;
        alt: string;
        offset?: number;
        onIndexChange?: (index: number) => void;
        onProgressChange?: (progress: number) => void;
        children: Snippet;
        [key: string]: unknown;
    } = $props();

    $effect(() =>
        warnMissingName(
            "ScrollerVideo",
            label,
            restProps["aria-label"],
            restProps["aria-labelledby"],
        ),
    );

    let videoEl: HTMLVideoElement | undefined = $state(undefined);

    function handleProgress(progress: number) {
        if (videoEl && Number.isFinite(videoEl.duration) && videoEl.duration > 0) {
            videoEl.currentTime = videoEl.duration * progress;
        }
        onProgressChange?.(progress);
    }

    $effect(() => {
        if (videoEl) {
            videoEl.muted = true;
            (videoEl as any).playsInline = true;
        }
    });
</script>

<!-- ScrollerVideo.svelte -->
<div
    class={`scroller-video ${className}`}
    role={label ? "group" : undefined}
    aria-label={label}
    {...restProps}
>
    <div
        class="scroller-video-background"
        role="img"
        aria-roledescription="scrollable video"
        aria-label={alt}
    >
        <video
            bind:this={videoEl}
            class="scroller-video-element"
            {src}
            muted
            playsinline
            preload="auto"
        ></video>
    </div>
    <ScrollerBase
        class="scroller-video-foreground"
        {offset}
        {onIndexChange}
        onProgressChange={handleProgress}
    >
        {@render children?.()}
    </ScrollerBase>
</div>
