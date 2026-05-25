import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Fieldset.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Fieldset", () => {
    test("renders as a group with legend", () => {
        render(Subject, { props: { legend: "Contact", children: textSnippet("Fields") } });
        expect(screen.getByRole("group", { name: "Contact" })).toBeTruthy();
    });

    test("displays legend text", () => {
        render(Subject, { props: { legend: "Address", children: textSnippet("Fields") } });
        expect(screen.getByText("Address")).toBeTruthy();
    });

    test("supports disabled", () => {
        render(Subject, { props: { legend: "Info", disabled: true, "data-testid": "fs", children: textSnippet("C") } });
        expect((screen.getByTestId("fs") as HTMLFieldSetElement).disabled).toBe(true);
    });

    test("renders children", () => {
        render(Subject, { props: { legend: "G", children: textSnippet("Child content") } });
        expect(screen.getByRole("group").textContent).toContain("Child content");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { legend: "G", "data-testid": "fs", children: textSnippet("C") } });
        expect(screen.getByTestId("fs")).toBeTruthy();
    });
});
