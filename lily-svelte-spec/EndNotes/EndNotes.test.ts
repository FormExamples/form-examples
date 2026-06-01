import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./EndNotes.svelte";

function snippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}

describe("EndNotes", () => {
    test("renders a section with class end-notes", () => {
        const { container } = render(Subject, { children: snippet("content") });
        const root = container.querySelector(".end-notes");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("SECTION");
    });

    test("renders children content", () => {
        const { container } = render(Subject, { children: snippet("content") });
        expect(container.textContent).toContain("content");
    });

    test("defaults aria-label to 'End notes'", () => {
        const { container } = render(Subject, { children: snippet("x") });
        const root = container.querySelector(".end-notes");
        expect(root?.getAttribute("aria-label")).toBe("End notes");
    });

    test("aria-label can be overridden", () => {
        const { container } = render(Subject, { label: "Other", children: snippet("x") });
        const root = container.querySelector(".end-notes");
        expect(root?.getAttribute("aria-label")).toBe("Other");
    });
});
