import { render } from "@testing-library/svelte";
import { tick } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import Subject from "./Visible.svelte";

function visibleSnippet(label: string) {
    return (($anchor: Comment, _visible: boolean) => {
        $anchor.before(document.createTextNode(label));
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

describe("Visible", () => {
    test("renders a div with class visible", () => {
        const { container } = render(Subject, { children: visibleSnippet("x") });
        const root = container.querySelector(".visible");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("exposes data-visible attribute initially false", () => {
        const { container } = render(Subject, { children: visibleSnippet("x") });
        expect(container.querySelector(".visible")?.getAttribute("data-visible")).toBe("false");
    });

    test("renders children content", () => {
        const { container } = render(Subject, { children: visibleSnippet("hello") });
        expect(container.textContent).toBe("hello");
    });
});

describe("Visible with an IntersectionObserver", () => {
    afterEach(() => vi.unstubAllGlobals());

    test("data-visible follows the observer, with the threshold and margin passed on", async () => {
        vi.stubGlobal("IntersectionObserver", StubObserver);
        const { container } = render(Subject, {
            threshold: 0.25,
            rootMargin: "10px",
            children: visibleSnippet("x"),
        });
        await tick();
        const root = container.querySelector(".visible")!;
        const observer = StubObserver.last!;
        expect(observer.targets).toEqual([root]);
        expect(observer.options).toEqual({ threshold: 0.25, rootMargin: "10px" });
        observer.fire(root, true);
        await tick();
        expect(root.getAttribute("data-visible")).toBe("true");
        observer.fire(document.body, false); // another element's entry is ignored
        await tick();
        expect(root.getAttribute("data-visible")).toBe("true");
        observer.fire(root, false);
        await tick();
        expect(root.getAttribute("data-visible")).toBe("false");
    });

    test("once stops observing after it first becomes visible", async () => {
        vi.stubGlobal("IntersectionObserver", StubObserver);
        const { container } = render(Subject, { once: true, children: visibleSnippet("x") });
        await tick();
        const observer = StubObserver.last!;
        observer.fire(container.querySelector(".visible")!, true);
        expect(observer.disconnected).toBe(true);
    });

    test("unmounting disconnects the observer", async () => {
        vi.stubGlobal("IntersectionObserver", StubObserver);
        const { unmount } = render(Subject, { children: visibleSnippet("x") });
        await tick();
        const observer = StubObserver.last!;
        unmount();
        expect(observer.disconnected).toBe(true);
    });
});
