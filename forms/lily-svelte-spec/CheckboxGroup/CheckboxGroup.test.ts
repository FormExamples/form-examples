import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./CheckboxGroup.svelte";

function checkboxSnippet() {
    return (($anchor: Comment) => {
        const label1 = document.createElement("label");
        const checkbox1 = document.createElement("input");
        checkbox1.type = "checkbox";
        checkbox1.name = "features";
        checkbox1.value = "wifi";
        label1.append(checkbox1, " Wi-Fi");
        const label2 = document.createElement("label");
        const checkbox2 = document.createElement("input");
        checkbox2.type = "checkbox";
        checkbox2.name = "features";
        checkbox2.value = "bluetooth";
        label2.append(checkbox2, " Bluetooth");
        $anchor.before(label1, label2);
    }) as any;
}

describe("CheckboxGroup", () => {
    test("renders a group", () => {
        render(Subject, { props: { label: "Features", children: checkboxSnippet() } });
        expect(screen.getByRole("group")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Features", children: checkboxSnippet() } });
        expect(screen.getByLabelText("Features")).toBeTruthy();
    });

    test("renders checkbox children", () => {
        render(Subject, { props: { label: "Features", children: checkboxSnippet() } });
        expect(screen.getAllByRole("checkbox").length).toBe(2);
    });

    test("uses fieldset element", () => {
        render(Subject, { props: { label: "Features", children: checkboxSnippet() } });
        expect(screen.getByRole("group").tagName).toBe("FIELDSET");
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Features", disabled: true, children: checkboxSnippet() } });
        expect((screen.getByRole("group") as HTMLFieldSetElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "F", "data-testid": "cg", children: checkboxSnippet() } });
        expect(screen.getByTestId("cg")).toBeTruthy();
    });
});
