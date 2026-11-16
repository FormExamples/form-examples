import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./Framer.svelte";

function snippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}

describe("Framer", () => {
    test("renders a div with class framer", () => {
        const { container } = render(Subject, { children: snippet("content") });
        const root = container.querySelector(".framer");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders children content", () => {
        const { container } = render(Subject, { children: snippet("content") });
        expect(container.textContent).toContain("content");
    });

    test("is a named group when labelled", () => {
        const { container } = render(Subject, { label: "Story", children: snippet("content") });
        const root = container.querySelector(".framer");
        expect(root?.getAttribute("role")).toBe("group");
        expect(root?.getAttribute("aria-label")).toBe("Story");
    });

    test("has no role without a label", () => {
        const { container } = render(Subject, { children: snippet("content") });
        expect(container.querySelector(".framer")?.hasAttribute("role")).toBe(false);
    });
});
