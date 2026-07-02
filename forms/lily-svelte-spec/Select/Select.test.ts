import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Select.svelte";

function optionsSnippet() {
    return (($$anchor: Comment) => {
        const opt1 = document.createElement("option");
        opt1.value = "a";
        opt1.textContent = "Alpha";
        const opt2 = document.createElement("option");
        opt2.value = "b";
        opt2.textContent = "Beta";
        $$anchor.before(opt1);
        $$anchor.before(opt2);
    }) as any;
}

describe("Select", () => {
    test("renders a select element", () => {
        render(Subject, { props: { label: "Choice", children: optionsSnippet() } });
        expect(screen.getByRole("combobox")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Country", children: optionsSnippet() } });
        expect(screen.getByLabelText("Country")).toBeTruthy();
    });

    test("renders children options", () => {
        render(Subject, { props: { label: "C", children: optionsSnippet() } });
        expect(screen.getByText("Alpha")).toBeTruthy();
        expect(screen.getByText("Beta")).toBeTruthy();
    });

    test("supports required", () => {
        render(Subject, { props: { label: "C", required: true, children: optionsSnippet() } });
        expect((screen.getByRole("combobox") as HTMLSelectElement).required).toBe(true);
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "C", disabled: true, children: optionsSnippet() } });
        expect((screen.getByRole("combobox") as HTMLSelectElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "C", "data-testid": "sel", children: optionsSnippet() } });
        expect(screen.getByTestId("sel")).toBeTruthy();
    });
});
