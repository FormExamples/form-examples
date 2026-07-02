import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Toast.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Toast", () => {
    test("renders with status role by default", () => {
        render(Subject, { props: { children: textSnippet("Saved") } });
        expect(screen.getByRole("status")).toBeTruthy();
    });

    test("renders with alert role when urgent", () => {
        render(Subject, { props: { urgent: true, children: textSnippet("Error") } });
        expect(screen.getByRole("alert")).toBeTruthy();
    });

    test("has polite live region by default", () => {
        render(Subject, { props: { "data-testid": "t", children: textSnippet("Info") } });
        expect(screen.getByTestId("t").getAttribute("aria-live")).toBe("polite");
    });

    test("has assertive live region when urgent", () => {
        render(Subject, { props: { urgent: true, "data-testid": "t", children: textSnippet("E") } });
        expect(screen.getByTestId("t").getAttribute("aria-live")).toBe("assertive");
    });

    test("renders children", () => {
        render(Subject, { props: { children: textSnippet("Changes saved") } });
        expect(screen.getByRole("status").textContent).toContain("Changes saved");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "t", children: textSnippet("C") } });
        expect(screen.getByTestId("t")).toBeTruthy();
    });
});
