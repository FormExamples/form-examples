import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./RadioGroup.svelte";

function radioSnippet() {
    return (($anchor: Comment) => {
        const label1 = document.createElement("label");
        const radio1 = document.createElement("input");
        radio1.type = "radio";
        radio1.name = "size";
        radio1.value = "s";
        label1.append(radio1, " Small");
        const label2 = document.createElement("label");
        const radio2 = document.createElement("input");
        radio2.type = "radio";
        radio2.name = "size";
        radio2.value = "m";
        label2.append(radio2, " Medium");
        $anchor.before(label1, label2);
    }) as any;
}

describe("RadioGroup", () => {
    test("renders a radiogroup", () => {
        render(Subject, { props: { label: "Size", children: radioSnippet() } });
        expect(screen.getByRole("radiogroup")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Size", children: radioSnippet() } });
        expect(screen.getByLabelText("Size")).toBeTruthy();
    });

    test("renders radio children", () => {
        render(Subject, { props: { label: "Size", children: radioSnippet() } });
        expect(screen.getAllByRole("radio").length).toBe(2);
    });

    test("uses fieldset element", () => {
        render(Subject, { props: { label: "Size", children: radioSnippet() } });
        expect(screen.getByRole("radiogroup").tagName).toBe("FIELDSET");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "S", "data-testid": "rg", children: radioSnippet() } });
        expect(screen.getByTestId("rg")).toBeTruthy();
    });
});
