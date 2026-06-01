import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./HoverCard.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("HoverCard", () => {
    test("hidden when closed", () => {
        render(Subject, { props: { label: "Info", open: false, children: textSnippet("C") } });
        expect(screen.queryByRole("tooltip")).toBeNull();
    });

    test("visible when open", () => {
        render(Subject, { props: { label: "Info", open: true, children: textSnippet("C") } });
        expect(screen.getByRole("tooltip", { name: "Info" })).toBeTruthy();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Info", open: true, children: textSnippet("Details") } });
        expect(screen.getByRole("tooltip").textContent).toContain("Details");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "I", open: true, "data-testid": "hc", children: textSnippet("C") } });
        expect(screen.getByTestId("hc")).toBeTruthy();
    });
});
