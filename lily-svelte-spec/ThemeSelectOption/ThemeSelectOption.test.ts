import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ThemeSelectOption.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("ThemeSelectOption", () => {
    test("renders an option element", () => {
        render(Subject, { props: { value: "dark", children: textSnippet("Dark") } });
        expect(screen.getByRole("option")).toBeTruthy();
    });

    test("has the correct value", () => {
        render(Subject, { props: { value: "light", children: textSnippet("Light") } });
        expect((screen.getByRole("option") as HTMLOptionElement).value).toBe("light");
    });

    test("renders children text", () => {
        render(Subject, { props: { value: "dark", children: textSnippet("Dark Mode") } });
        expect(screen.getByRole("option").textContent).toContain("Dark Mode");
    });

    test("supports selected", () => {
        render(Subject, { props: { value: "dark", selected: true, children: textSnippet("Dark") } });
        expect((screen.getByRole("option") as HTMLOptionElement).selected).toBe(true);
    });

    test("supports disabled", () => {
        render(Subject, { props: { value: "dark", disabled: true, children: textSnippet("Dark") } });
        expect((screen.getByRole("option") as HTMLOptionElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { value: "dark", "data-testid": "tso", children: textSnippet("Dark") } });
        expect(screen.getByTestId("tso")).toBeTruthy();
    });
});
