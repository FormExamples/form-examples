import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ScrollerVideo.svelte";

function snippet(html: string) {
    return (($anchor: Comment) => {
        const tpl = document.createElement("template");
        tpl.innerHTML = html;
        for (const node of Array.from(tpl.content.childNodes)) $anchor.before(node);
    }) as any;
}

describe("ScrollerVideo", () => {
    test("renders a div with class scroller-video", () => {
        const { container } = render(Subject, {
            src: "/v.mp4", label: "Story", alt: "A video",
            children: snippet("<section>step</section>"),
        });
        const root = container.querySelector(".scroller-video");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("applies aria-label from label prop", () => {
        const { container } = render(Subject, {
            src: "/v.mp4", label: "Story", alt: "alt",
            children: snippet("<section>step</section>"),
        });
        expect(container.querySelector(".scroller-video")?.getAttribute("aria-label")).toBe("Story");
    });

    test("renders a video with the src attribute", () => {
        const { container } = render(Subject, {
            src: "/v.mp4", label: "x", alt: "alt",
            children: snippet("<section>step</section>"),
        });
        const video = container.querySelector("video.scroller-video-element");
        expect(video).toBeTruthy();
        expect(video?.getAttribute("src")).toBe("/v.mp4");
    });

    test("background region exposes role=img with alt as aria-label", () => {
        const { container } = render(Subject, {
            src: "/v.mp4", label: "x", alt: "A waterfall scene",
            children: snippet("<section>step</section>"),
        });
        const bg = container.querySelector(".scroller-video-background");
        expect(bg?.getAttribute("role")).toBe("img");
        expect(bg?.getAttribute("aria-roledescription")).toBe("scrollable video");
        expect(bg?.getAttribute("aria-label")).toBe("A waterfall scene");
    });

    test("renders children inside the foreground", () => {
        const { container } = render(Subject, {
            src: "/v.mp4", label: "x", alt: "alt",
            children: snippet("<section>step 1</section><section>step 2</section>"),
        });
        const fg = container.querySelector(".scroller-video-foreground");
        expect(fg).toBeTruthy();
        expect(fg?.children.length).toBe(2);
    });
});
