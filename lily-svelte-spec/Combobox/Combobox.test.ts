import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Combobox.svelte";

function optionsSnippet() {
    return (($anchor: Comment) => {
        const opt = document.createElement("div");
        opt.setAttribute("role", "option");
        opt.textContent = "Apple";
        $anchor.before(opt);
    }) as any;
}

describe("Combobox", () => {
    test("renders a combobox input", () => {
        render(Subject, { props: { label: "Fruit", children: optionsSnippet() } });
        expect(screen.getByRole("combobox")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Search fruit", children: optionsSnippet() } });
        expect(screen.getByLabelText("Search fruit")).toBeTruthy();
    });

    test("listbox hidden when closed", () => {
        render(Subject, { props: { label: "Fruit", open: false, children: optionsSnippet() } });
        expect(screen.queryByRole("listbox")).toBeNull();
    });

    test("listbox shown when open", () => {
        render(Subject, { props: { label: "Fruit", open: true, children: optionsSnippet() } });
        expect(screen.getByRole("listbox")).toBeTruthy();
    });

    test("has aria-expanded", () => {
        render(Subject, { props: { label: "Fruit", open: true, children: optionsSnippet() } });
        expect(screen.getByRole("combobox").getAttribute("aria-expanded")).toBe("true");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "F", "data-testid": "cb", children: optionsSnippet() } });
        expect(screen.getByTestId("cb")).toBeTruthy();
    });
});
