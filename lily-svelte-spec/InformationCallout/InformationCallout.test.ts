import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./InformationCallout.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("InformationCallout", () => {
    test("renders with note role", () => {
        render(Subject, { props: { label: "Note", children: textSnippet("Info") } });
        expect(screen.getByRole("note")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Important", children: textSnippet("C") } });
        expect(screen.getByRole("note").getAttribute("aria-label")).toBe("Important");
    });

    test("renders children", () => {
        render(Subject, { props: { label: "N", children: textSnippet("Beta feature") } });
        expect(screen.getByRole("note").textContent).toContain("Beta feature");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "N", "data-testid": "ic", children: textSnippet("C") } });
        expect(screen.getByTestId("ic")).toBeTruthy();
    });
});
