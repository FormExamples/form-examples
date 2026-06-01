import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./DontList.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("DontList", () => {
    test("renders as a list", () => {
        render(Subject, { props: { children: textSnippet("Items") } });
        expect(screen.getByRole("list", { name: "Don't" })).toBeTruthy();
    });

    test("has default label", () => {
        render(Subject, { props: { children: textSnippet("Items") } });
        expect(screen.getByRole("list").getAttribute("aria-label")).toBe("Don't");
    });

    test("accepts custom label", () => {
        render(Subject, { props: { label: "Avoid", children: textSnippet("Items") } });
        expect(screen.getByRole("list").getAttribute("aria-label")).toBe("Avoid");
    });

    test("renders children", () => {
        render(Subject, { props: { children: textSnippet("Skip tests") } });
        expect(screen.getByRole("list").textContent).toContain("Skip tests");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "dnl", children: textSnippet("C") } });
        expect(screen.getByTestId("dnl")).toBeTruthy();
    });
});
