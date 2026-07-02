import { render } from "@testing-library/svelte";
import { describe, expect, test, vi } from "vitest";

import Subject from "./HorizontalScroller.svelte";

function snippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}

describe("HorizontalScroller", () => {
    test("renders a div with class horizontal-scroller", () => {
        const { container } = render(Subject, { label: "Gallery", children: snippet("items") });
        const root = container.querySelector(".horizontal-scroller");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("applies role=region with aria-label and tabindex=0", () => {
        const { container } = render(Subject, { label: "Gallery", children: snippet("items") });
        const root = container.querySelector(".horizontal-scroller");
        expect(root?.getAttribute("role")).toBe("region");
        expect(root?.getAttribute("aria-label")).toBe("Gallery");
        expect(root?.getAttribute("tabindex")).toBe("0");
    });

    test("ArrowRight calls scrollBy with positive step", () => {
        const { container } = render(Subject, { label: "x", step: 150, children: snippet("items") });
        const region = container.querySelector(".horizontal-scroller") as HTMLDivElement;
        const scrollBy = vi.fn();
        Object.defineProperty(region, "scrollBy", { value: scrollBy, configurable: true });
        region.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
        expect(scrollBy).toHaveBeenCalledWith({ left: 150, behavior: "smooth" });
    });

    test("ArrowLeft calls scrollBy with negative step", () => {
        const { container } = render(Subject, { label: "x", step: 150, children: snippet("items") });
        const region = container.querySelector(".horizontal-scroller") as HTMLDivElement;
        const scrollBy = vi.fn();
        Object.defineProperty(region, "scrollBy", { value: scrollBy, configurable: true });
        region.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
        expect(scrollBy).toHaveBeenCalledWith({ left: -150, behavior: "smooth" });
    });

    test("Home scrolls to start", () => {
        const { container } = render(Subject, { label: "x", children: snippet("items") });
        const region = container.querySelector(".horizontal-scroller") as HTMLDivElement;
        const scrollTo = vi.fn();
        Object.defineProperty(region, "scrollTo", { value: scrollTo, configurable: true });
        region.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
        expect(scrollTo).toHaveBeenCalledWith({ left: 0, behavior: "smooth" });
    });

    test("End scrolls to scrollWidth", () => {
        const { container } = render(Subject, { label: "x", children: snippet("items") });
        const region = container.querySelector(".horizontal-scroller") as HTMLDivElement;
        const scrollTo = vi.fn();
        Object.defineProperty(region, "scrollTo", { value: scrollTo, configurable: true });
        Object.defineProperty(region, "scrollWidth", { value: 1234, configurable: true });
        region.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true }));
        expect(scrollTo).toHaveBeenCalledWith({ left: 1234, behavior: "smooth" });
    });
});
