import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import type { Component } from "svelte";

import Tested from "./EndNotes.svelte";

// These tests leave required props out on purpose, to prove what the component does then.
const Subject = Tested as unknown as Component<Record<string, unknown>>;

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

    test("has no English aria-label of its own", () => {
        const { container } = render(Subject, { children: snippet("x") });
        const root = container.querySelector(".end-notes");
        expect(root?.hasAttribute("aria-label")).toBe(false);
    });

    test("aria-label can be overridden", () => {
        const { container } = render(Subject, { label: "Other", children: snippet("x") });
        const root = container.querySelector(".end-notes");
        expect(root?.getAttribute("aria-label")).toBe("Other");
    });
});
