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
});
