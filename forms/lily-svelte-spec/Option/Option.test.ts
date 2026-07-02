import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Option.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Option", () => {
    test("renders an option element", () => {
        render(Subject, { props: { value: "a", children: textSnippet("Alpha") } });
        expect(screen.getByRole("option")).toBeTruthy();
    });

    test("has the correct value", () => {
        render(Subject, { props: { value: "us", children: textSnippet("United States") } });
        expect((screen.getByRole("option") as HTMLOptionElement).value).toBe("us");
    });

    test("renders children text", () => {
        render(Subject, { props: { value: "uk", children: textSnippet("United Kingdom") } });
        expect(screen.getByRole("option").textContent).toContain("United Kingdom");
    });

    test("supports selected", () => {
        render(Subject, { props: { value: "a", selected: true, children: textSnippet("A") } });
        expect((screen.getByRole("option") as HTMLOptionElement).selected).toBe(true);
    });

    test("supports disabled", () => {
        render(Subject, { props: { value: "a", disabled: true, children: textSnippet("A") } });
        expect((screen.getByRole("option") as HTMLOptionElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { value: "a", "data-testid": "opt", children: textSnippet("A") } });
        expect(screen.getByTestId("opt")).toBeTruthy();
    });
});
