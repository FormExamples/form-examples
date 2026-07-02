<script lang="ts">
    // ScrollerVideo component
    //
    // Scroll-driven video: the muted <video> currentTime advances
    // proportionally to scroll progress. Foreground children scroll over
    // the sticky video.

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
