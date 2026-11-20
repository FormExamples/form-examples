import { render } from "@testing-library/svelte";
import { tick } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import Subject from "./ScrollerBase.svelte";

function snippet(html: string) {
    return (($anchor: Comment) => {
        const tpl = document.createElement("template");
        tpl.innerHTML = html;
        for (const node of Array.from(tpl.content.childNodes)) $anchor.before(node);
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

describe("ScrollerBase", () => {
    test("renders a div with class scroller-base", () => {
        const { container } = render(Subject, { children: snippet("<div>step</div>") });
        const root = container.querySelector(".scroller-base");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("applies aria-label when provided", () => {
        const { container } = render(Subject, {
            label: "My story",
            children: snippet("<div>1</div>"),
        });
        expect(container.querySelector(".scroller-base")?.getAttribute("aria-label")).toBe(
            "My story",
        );
    });

    test("does not set aria-label when omitted", () => {
        const { container } = render(Subject, { children: snippet("<div>1</div>") });
        expect(container.querySelector(".scroller-base")?.getAttribute("aria-label")).toBeNull();
    });

    test("renders all step children", () => {
        const { container } = render(Subject, {
            children: snippet("<div>one</div><div>two</div><div>three</div>"),
        });
        const root = container.querySelector(".scroller-base") as HTMLElement;
        expect(root.children.length).toBe(3);
        expect(root.children[2].textContent).toBe("three");
    });

    test("is a named group when labelled", () => {
        const { container } = render(Subject, { label: "Story", children: snippet("content") });
        const root = container.querySelector(".scroller-base");
        expect(root?.getAttribute("role")).toBe("group");
        expect(root?.getAttribute("aria-label")).toBe("Story");
    });

    test("has no role without a label", () => {
        const { container } = render(Subject, { children: snippet("content") });
        expect(container.querySelector(".scroller-base")?.hasAttribute("role")).toBe(false);
    });
});

describe("ScrollerBase with an IntersectionObserver", () => {
    afterEach(() => vi.unstubAllGlobals());

    test("each step entering the trigger line reports its index, and scrolling reports progress", async () => {
        vi.stubGlobal("IntersectionObserver", StubObserver);
        const onIndexChange = vi.fn();
        const onProgressChange = vi.fn();
        const { container } = render(Subject, {
            offset: 0.25,
            onIndexChange,
            onProgressChange,
            children: snippet("<div>1</div><div>2</div><div>3</div>"),
        });
        await tick();
        const root = container.querySelector(".scroller-base") as HTMLElement;
        const steps = [...root.children];
        const observer = StubObserver.last!;
        expect(observer.targets).toEqual(steps);
        expect(observer.options).toEqual({ rootMargin: "-25.00% 0px -75.00% 0px", threshold: 0 });
        observer.fire(steps[2], true);
        observer.fire(steps[1], false);
        observer.fire(document.body, true);
        expect(onIndexChange.mock.calls).toEqual([[2]]);

        // Progress is how far the block has passed through the window, from 0 to 1.
        expect(onProgressChange).toHaveBeenCalled();
        root.getBoundingClientRect = () => ({ top: -500, height: 1000 }) as DOMRect;
        window.dispatchEvent(new Event("scroll"));
        const expected = (window.innerHeight + 500) / (1000 + window.innerHeight);
        expect(onProgressChange).toHaveBeenLastCalledWith(Math.min(1, expected));
        root.getBoundingClientRect = () => ({ top: -99999, height: 10 }) as DOMRect;
        window.dispatchEvent(new Event("scroll"));
        expect(onProgressChange).toHaveBeenLastCalledWith(1);
    });

    test("unmounting stops observing and listening", async () => {
        vi.stubGlobal("IntersectionObserver", StubObserver);
        const onProgressChange = vi.fn();
        const { unmount } = render(Subject, {
            onProgressChange,
            children: snippet("<div>1</div><div>2</div>"),
        });
        await tick();
        const observer = StubObserver.last!;
        unmount();
        expect(observer.disconnected).toBe(true);
        onProgressChange.mockClear();
        window.dispatchEvent(new Event("scroll"));
        expect(onProgressChange).not.toHaveBeenCalled();
    });
});
