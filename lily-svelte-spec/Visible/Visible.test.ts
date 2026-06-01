import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Visible.svelte";

function visibleSnippet(label: string) {
    return ((($anchor: Comment, _visible: boolean) => {
        $anchor.before(document.createTextNode(label));
    }) as any);
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
