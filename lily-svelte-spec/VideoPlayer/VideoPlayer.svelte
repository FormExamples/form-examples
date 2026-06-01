<script lang="ts">
    // VideoPlayer component
    //
    // <video> rendered inside <figure>. Optional autoplay-on-scroll via
    // IntersectionObserver: video plays when scrolled in, pauses when out.

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
            { threshold: 0.5 }
        );
        observer.observe(video);
        return () => observer.disconnect();
    });
</script>

<!-- VideoPlayer.svelte -->
<figure class={`video-player ${className}`} aria-label={label} {...restProps}>
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
