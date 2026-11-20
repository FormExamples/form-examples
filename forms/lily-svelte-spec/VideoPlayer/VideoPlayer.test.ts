import { render } from "@testing-library/svelte";
import { tick } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import Subject from "./VideoPlayer.svelte";

function snippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}

/** A stand-in IntersectionObserver (jsdom has none) that a test triggers by hand. */
class StubObserver {
    static last: StubObserver | undefined;
    targets: Element[] = [];
    disconnected = false;
    constructor(
        public callback: IntersectionObserverCallback,
        public options?: IntersectionObserverInit,
    ) {
        StubObserver.last = this;
    }
    observe(target: Element) {
        this.targets.push(target);
    }
    unobserve() {}
    disconnect() {
        this.disconnected = true;
    }
    takeRecords() {
        return [];
    }
    fire(target: Element, isIntersecting: boolean) {
        this.callback(
            [{ target, isIntersecting } as IntersectionObserverEntry],
            this as unknown as IntersectionObserver,
        );
    }
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
        expect(container.querySelector(".video-player")?.getAttribute("aria-label")).toBe(
            "Demo video",
        );
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
            src: "/v.mp4",
            label: "x",
            caption: snippet("A caption"),
        });
        expect(container.querySelector("figcaption.video-player-caption")?.textContent).toBe(
            "A caption",
        );
    });

    test("omits figcaption when no caption snippet", () => {
        const { container } = render(Subject, { src: "/v.mp4", label: "x" });
        expect(container.querySelector("figcaption")).toBeNull();
    });
});

describe("VideoPlayer autoplay", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    test("plays when half in view and pauses when it leaves", async () => {
        vi.stubGlobal("IntersectionObserver", StubObserver);
        const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
        const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
        const { container } = render(Subject, {
            src: "/v.mp4",
            label: "Demo",
            autoplay: true,
            muted: true,
        });
        await tick();
        const video = container.querySelector("video")!;
        const observer = StubObserver.last!;
        expect(observer.targets).toEqual([video]);
        expect(observer.options).toEqual({ threshold: 0.5 });
        observer.fire(video, true);
        expect(play).toHaveBeenCalledOnce();
        observer.fire(video, false);
        expect(pause).toHaveBeenCalledOnce();
    });

    test("a refused play is swallowed, not thrown", async () => {
        vi.stubGlobal("IntersectionObserver", StubObserver);
        vi.spyOn(HTMLMediaElement.prototype, "play").mockRejectedValue(
            new Error("NotAllowedError"),
        );
        const { container } = render(Subject, { src: "/v.mp4", label: "Demo", autoplay: true });
        await tick();
        expect(() =>
            StubObserver.last!.fire(container.querySelector("video")!, true),
        ).not.toThrow();
        await tick();
    });

    test("without autoplay nothing is observed", async () => {
        StubObserver.last = undefined;
        vi.stubGlobal("IntersectionObserver", StubObserver);
        render(Subject, { src: "/v.mp4", label: "Demo" });
        await tick();
        expect(StubObserver.last).toBeUndefined();
    });
});
