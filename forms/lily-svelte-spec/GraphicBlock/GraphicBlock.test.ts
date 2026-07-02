import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./GraphicBlock.svelte";

function snippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}

describe("GraphicBlock", () => {
    test("renders a figure with class graphic-block", () => {
        const { container } = render(Subject, { label: "Sales chart", children: snippet("chart") });
        const root = container.querySelector(".graphic-block");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("FIGURE");
    });

    test("applies role=img with aria-label", () => {
        const { container } = render(Subject, { label: "Sales chart", children: snippet("chart") });
        const root = container.querySelector(".graphic-block");
        expect(root?.getAttribute("role")).toBe("img");
        expect(root?.getAttribute("aria-label")).toBe("Sales chart");
    });

    test("renders children inside graphic-block-content", () => {
        const { container } = render(Subject, { label: "x", children: snippet("chart") });
        expect(container.querySelector(".graphic-block-content")?.textContent).toBe("chart");
    });

    test("omits figcaption when no title, description, or notes", () => {
        const { container } = render(Subject, { label: "x", children: snippet("c") });
        expect(container.querySelector("figcaption")).toBeNull();
    });

    test("renders all caption parts when provided", () => {
        const { container } = render(Subject, {
            label: "x", title: "T", description: "D", notes: "N", children: snippet("c"),
        });
        expect(container.querySelector(".graphic-block-title")?.textContent).toBe("T");
        expect(container.querySelector(".graphic-block-description")?.textContent).toBe("D");
        expect(container.querySelector(".graphic-block-notes")?.textContent).toBe("N");
    });
});
