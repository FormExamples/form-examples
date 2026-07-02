import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./SelectWithExtras.svelte";

function optionSnippet() {
    return (($anchor: Comment) => {
        const opt = document.createElement("option");
        opt.value = "a";
        opt.textContent = "Option A";
        $anchor.before(opt);
    }) as any;
}

describe("SelectWithExtras", () => {
    test("renders a select", () => {
        render(Subject, { props: { label: "Choose", children: optionSnippet() } });
        expect(screen.getByRole("combobox")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Pick one", children: optionSnippet() } });
        expect(screen.getByLabelText("Pick one")).toBeTruthy();
    });

    test("renders option children", () => {
        render(Subject, { props: { label: "Choose", children: optionSnippet() } });
        expect(screen.getByText("Option A")).toBeTruthy();
    });

    test("supports required", () => {
        render(Subject, { props: { label: "Choose", required: true, children: optionSnippet() } });
        expect((screen.getByRole("combobox") as HTMLSelectElement).required).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "C", "data-testid": "swe", children: optionSnippet() } });
        expect(screen.getByTestId("swe")).toBeTruthy();
    });
});
