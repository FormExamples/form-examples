import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./VideoPlayer.svelte";

function snippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}

describe("VideoPlayer", () => {
    test("renders a figure with class video-player", () => {
        const { container } = render(Subject, { src: "/v.mp4", label: "Demo" });
        const fig = container.querySelector(".video-player");
        expect(fig).toBeTruthy();
        expect(fig?.tagName).toBe("FIGURE");
    });

    test("applies aria-label from label prop", () => {
        const { container } = render(Subject, { src: "/v.mp4", label: "Demo video" });
        expect(container.querySelector(".video-player")?.getAttribute("aria-label")).toBe("Demo video");
    });

    test("renders a video with src", () => {
        const { container } = render(Subject, { src: "/v.mp4", label: "x" });
        const video = container.querySelector("video.video-player-element");
        expect(video).toBeTruthy();
        expect(video?.getAttribute("src")).toBe("/v.mp4");
    });

    test("controls default to true", () => {
        const { container } = render(Subject, { src: "/v.mp4", label: "x" });
        expect(container.querySelector("video")?.hasAttribute("controls")).toBe(true);
    });

    test("controls=false omits the controls attribute", () => {
        const { container } = render(Subject, { src: "/v.mp4", label: "x", controls: false });
        expect(container.querySelector("video")?.hasAttribute("controls")).toBe(false);
    });

    test("renders caption snippet inside figcaption", () => {
        const { container } = render(Subject, {
            src: "/v.mp4", label: "x", caption: snippet("A caption"),
        });
        expect(container.querySelector("figcaption.video-player-caption")?.textContent).toBe("A caption");
    });

    test("omits figcaption when no caption snippet", () => {
        const { container } = render(Subject, { src: "/v.mp4", label: "x" });
        expect(container.querySelector("figcaption")).toBeNull();
    });
});
