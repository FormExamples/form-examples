import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./SummaryList.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("SummaryList", () => {
    test("renders a dl element", () => {
        render(Subject, { props: {
            label: "Summary",
            children: textSnippet("Content"),
        }});

        const el = screen.getByLabelText("Summary");
        expect(el.tagName).toBe("DL");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: {
            label: "Summary",
            children: textSnippet("Content"),
        }});

        const el = screen.getByLabelText("Summary");
        expect(el.getAttribute("aria-label")).toBe("Summary");
    });

    test("renders children content", () => {
        render(Subject, { props: {
            label: "Summary",
            children: textSnippet("Item details"),
        }});

        const el = screen.getByLabelText("Summary");
        expect(el.textContent).toContain("Item details");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: {
            label: "Summary",
            "data-testid": "summary-list",
            children: textSnippet("Content"),
        }});

        expect(screen.getByTestId("summary-list")).toBeTruthy();
    });

    test("accepts id attribute", () => {
        render(Subject, { props: {
            label: "Summary",
            id: "my-summary",
            children: textSnippet("Content"),
        }});

        const el = screen.getByLabelText("Summary");
        expect(el.getAttribute("id")).toBe("my-summary");
    });
});
