import { fireEvent, render, screen } from "@testing-library/svelte";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import Subject from "./NavigationMenu.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("NavigationMenu", () => {
    test("renders a navigation landmark", () => {
        render(Subject, { props: { label: "Main", children: textSnippet("content") } });
        expect(screen.getByRole("navigation")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Main navigation", children: textSnippet("content") } });
        expect(screen.getByLabelText("Main navigation")).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Nav", children: textSnippet("Home") } });
        expect(screen.getByText("Home")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "N", "data-testid": "nm", children: textSnippet("x") } });
        expect(screen.getByTestId("nm")).toBeTruthy();
    });
});

// Overflow mode. jsdom has no layout, so the sizes and the ResizeObserver are stubbed.
function itemsSnippet(count: number) {
    return (($anchor: Comment) => {
        for (let i = 0; i < count; i++) {
            const li = document.createElement("li");
            li.id = `item-${i}`;
            const a = document.createElement("a");
            a.href = `/${i}`;
            a.textContent = `Item ${i}`;
            if (i === 1) a.setAttribute("aria-current", "page");
            li.appendChild(a);
            $anchor.before(li);
        }
    }) as any;
}

describe("NavigationMenu overflow", () => {
    let width = 1000;
    let callbacks: Array<() => void> = [];

    beforeEach(() => {
        width = 1000;
        callbacks = [];
        vi.stubGlobal(
            "ResizeObserver",
            class {
                constructor(cb: () => void) {
                    callbacks.push(cb);
                }
                observe() {}
                disconnect() {}
            },
        );
        Object.defineProperty(HTMLElement.prototype, "clientWidth", {
            configurable: true,
            get: () => width,
        });
        Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
            configurable: true,
            get(this: HTMLElement) {
                return this.hidden ? 0 : this.classList.contains("navigation-menu-more") ? 40 : 100;
            },
        });
    });
    afterEach(() => {
        vi.unstubAllGlobals();
        delete (HTMLElement.prototype as any).clientWidth;
        delete (HTMLElement.prototype as any).offsetWidth;
    });

    const mount = (props: Record<string, unknown> = {}) =>
        render(Subject, {
            props: {
                label: "Main",
                overflow: true,
                moreLabel: "More",
                children: itemsSnippet(5),
                ...props,
            },
        });

    test("overflow unset renders as before: no list, no More, no data-overflow", () => {
        const { container } = render(Subject, {
            props: { label: "Main", children: itemsSnippet(2) },
        });
        expect(container.querySelector(".navigation-menu-list")).toBeNull();
        expect(container.querySelector(".navigation-menu-more")).toBeNull();
        expect(container.querySelector("nav")!.hasAttribute("data-overflow")).toBe(false);
    });

    test("publishes data-overflow and renders a hidden More item with the consumer's label", () => {
        const { container } = mount();
        expect(container.querySelector("nav")!.getAttribute("data-overflow")).toBe("true");
        const more = container.querySelector<HTMLElement>(".navigation-menu-more")!;
        expect(more.hidden).toBe(true);
        const button = container.querySelector<HTMLElement>(".navigation-menu-more-button")!;
        expect(button.getAttribute("type")).toBe("button");
        expect(button.textContent).toBe("More");
        expect(button.getAttribute("aria-expanded")).toBe("false");
    });

    test("wide: nothing moves", () => {
        const { container } = mount();
        expect(container.querySelector<HTMLElement>(".navigation-menu-more")!.hidden).toBe(true);
        expect(container.querySelector(".navigation-menu-more-list")!.children.length).toBe(0);
    });

    test("narrow: extra items move into the More list in order and More is unhidden", () => {
        width = 300;
        const { container } = mount();
        expect(container.querySelector<HTMLElement>(".navigation-menu-more")!.hidden).toBe(false);
        const moved = Array.from(
            container.querySelector(".navigation-menu-more-list")!.children,
        ).map((c) => c.id);
        expect(moved).toEqual(["item-2", "item-3", "item-4"]);
        expect(container.querySelector('[aria-current="page"]')!.getAttribute("href")).toBe("/1");
    });

    test("the button toggles aria-expanded and the list; Escape closes and refocuses", async () => {
        width = 300;
        const { container } = mount();
        const button = container.querySelector<HTMLElement>(".navigation-menu-more-button")!;
        const list = container.querySelector<HTMLElement>(".navigation-menu-more-list")!;
        expect(button.getAttribute("aria-controls")).toBe(list.id);
        await fireEvent.click(button);
        expect(button.getAttribute("aria-expanded")).toBe("true");
        expect(list.hidden).toBe(false);
        const link = list.querySelector("a")!;
        link.focus();
        await fireEvent.keyDown(link, { key: "Escape" });
        expect(button.getAttribute("aria-expanded")).toBe("false");
        expect(list.hidden).toBe(true);
        expect(document.activeElement).toBe(button);
    });

    test("widening moves the items back and hides More", () => {
        width = 300;
        const { container } = mount();
        width = 1000;
        callbacks.forEach((cb) => cb());
        expect(container.querySelector<HTMLElement>(".navigation-menu-more")!.hidden).toBe(true);
        expect(container.querySelector(".navigation-menu-more-list")!.children.length).toBe(0);
        expect(container.querySelector(".navigation-menu-list")!.children.length).toBe(6);
    });
});
