import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import type { Component } from "svelte";

import Tested from "./DoList.svelte";

// These tests leave required props out on purpose, to prove what the component does then.
const Subject = Tested as unknown as Component<Record<string, unknown>>;

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("DoList", () => {
    test("renders as a list", () => {
        render(Subject, { props: { children: textSnippet("Items") } });
        expect(screen.getByRole("list")).toBeTruthy();
    });

    test("has no English label of its own", () => {
        render(Subject, { props: { children: textSnippet("Items") } });
        expect(screen.getByRole("list").hasAttribute("aria-label")).toBe(false);
    });

    test("accepts custom label", () => {
        render(Subject, { props: { label: "Recommended", children: textSnippet("Items") } });
        expect(screen.getByRole("list").getAttribute("aria-label")).toBe("Recommended");
    });

    test("renders children", () => {
        render(Subject, { props: { children: textSnippet("Use alt text") } });
        expect(screen.getByRole("list").textContent).toContain("Use alt text");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "dl", children: textSnippet("C") } });
        expect(screen.getByTestId("dl")).toBeTruthy();
    });
});
