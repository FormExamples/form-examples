import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./DoList.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("DoList", () => {
    test("renders as a list", () => {
        render(Subject, { props: { children: textSnippet("Items") } });
        expect(screen.getByRole("list", { name: "Do" })).toBeTruthy();
    });

    test("has default label", () => {
        render(Subject, { props: { children: textSnippet("Items") } });
        expect(screen.getByRole("list").getAttribute("aria-label")).toBe("Do");
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
