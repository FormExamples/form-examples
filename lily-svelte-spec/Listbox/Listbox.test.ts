import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Listbox.svelte";

function optionsSnippet() {
    return (($anchor: Comment) => {
        const opt1 = document.createElement("div");
        opt1.setAttribute("role", "option");
        opt1.setAttribute("tabindex", "-1");
        opt1.textContent = "Apple";
        const opt2 = document.createElement("div");
        opt2.setAttribute("role", "option");
        opt2.setAttribute("tabindex", "-1");
        opt2.textContent = "Banana";
        $anchor.before(opt1, opt2);
    }) as any;
}

describe("Listbox", () => {
    test("renders a listbox", () => {
        render(Subject, { props: { label: "Fruits", children: optionsSnippet() } });
        expect(screen.getByRole("listbox")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Fruits", children: optionsSnippet() } });
        expect(screen.getByLabelText("Fruits")).toBeTruthy();
    });

    test("renders option children", () => {
        render(Subject, { props: { label: "Fruits", children: optionsSnippet() } });
        expect(screen.getAllByRole("option").length).toBe(2);
    });

    test("arrow down navigates to next option", () => {
        render(Subject, { props: { label: "Fruits", children: optionsSnippet() } });
        const options = screen.getAllByRole("option");
        options[0].focus();
        options[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        expect(document.activeElement).toBe(options[1]);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "F", "data-testid": "lb", children: optionsSnippet() } });
        expect(screen.getByTestId("lb")).toBeTruthy();
    });
});
