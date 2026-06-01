import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./SegmentGroupItem.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("SegmentGroupItem", () => {
    test("renders a radio button", () => {
        render(Subject, { props: { children: textSnippet("Grid") } });
        expect(screen.getByRole("radio")).toBeTruthy();
    });

    test("has aria-checked false by default", () => {
        render(Subject, { props: { children: textSnippet("Grid") } });
        expect(screen.getByRole("radio").getAttribute("aria-checked")).toBe("false");
    });

    test("has aria-checked true when checked", () => {
        render(Subject, { props: { checked: true, children: textSnippet("Grid") } });
        expect(screen.getByRole("radio").getAttribute("aria-checked")).toBe("true");
    });

    test("has tabindex -1 when not checked", () => {
        render(Subject, { props: { children: textSnippet("Grid") } });
        expect(screen.getByRole("radio").getAttribute("tabindex")).toBe("-1");
    });

    test("has tabindex 0 when checked", () => {
        render(Subject, { props: { checked: true, children: textSnippet("Grid") } });
        expect(screen.getByRole("radio").getAttribute("tabindex")).toBe("0");
    });

    test("has data-value attribute", () => {
        render(Subject, { props: { value: "grid", children: textSnippet("Grid") } });
        expect(screen.getByRole("radio").getAttribute("data-value")).toBe("grid");
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { children: textSnippet("Grid") } });
        expect((screen.getByRole("radio") as HTMLButtonElement).disabled).toBe(false);
    });

    test("supports disabled state", () => {
        render(Subject, { props: { disabled: true, children: textSnippet("Grid") } });
        expect((screen.getByRole("radio") as HTMLButtonElement).disabled).toBe(true);
    });

    test("renders children", () => {
        render(Subject, { props: { children: textSnippet("List View") } });
        expect(screen.getByText("List View")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "sgi", children: textSnippet("x") } });
        expect(screen.getByTestId("sgi")).toBeTruthy();
    });
});
