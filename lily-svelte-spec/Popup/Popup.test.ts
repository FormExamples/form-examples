import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Popup.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Popup", () => {
    test("hidden when closed", () => {
        render(Subject, { props: { label: "Info", open: false, children: textSnippet("C") } });
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("visible when open", () => {
        render(Subject, { props: { label: "Info", open: true, children: textSnippet("C") } });
        expect(screen.getByRole("dialog", { name: "Info" })).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "I", open: true, children: textSnippet("Content") } });
        expect(screen.getByRole("dialog").textContent).toContain("Content");
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "My Popup", open: true, children: textSnippet("C") } });
        expect(screen.getByRole("dialog").getAttribute("aria-label")).toBe("My Popup");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "I", open: true, "data-testid": "pu", children: textSnippet("C") } });
        expect(screen.getByTestId("pu")).toBeTruthy();
    });
});
