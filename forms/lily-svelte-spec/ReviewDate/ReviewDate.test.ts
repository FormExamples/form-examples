import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ReviewDate.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("ReviewDate", () => {
    test("renders a time element", () => {
        render(Subject, {
            props: {
                label: "Next review",
                datetime: "2025-06-15",
                children: textSnippet("June 15, 2025"),
            },
        });

        const el = document.querySelector(".review-date") as HTMLElement;
        expect(el.tagName).toBe("TIME");
    });

    test("renders label as hidden text, not aria-label", () => {
        render(Subject, {
            props: {
                label: "Next review",
                datetime: "2025-06-15",
                children: textSnippet("June 15, 2025"),
            },
        });

        const el = document.querySelector(".review-date") as HTMLElement;
        expect(el.getAttribute("aria-label")).toBeNull();
        expect(el.querySelector(".screen-reader-span")?.textContent).toBe("Next review ");
    });

    test("has datetime attribute", () => {
        render(Subject, {
            props: {
                label: "Next review",
                datetime: "2025-06-15",
                children: textSnippet("June 15, 2025"),
            },
        });

        const el = document.querySelector(".review-date") as HTMLElement;
        expect(el.getAttribute("datetime")).toBe("2025-06-15");
    });

    test("displays children as text content", () => {
        render(Subject, {
            props: {
                label: "Next review",
                datetime: "2025-06-15",
                children: textSnippet("June 15, 2025"),
            },
        });

        const el = document.querySelector(".review-date") as HTMLElement;
        expect(el.textContent).toContain("June 15, 2025");
    });

    test("supports ISO 8601 datetime with time", () => {
        render(Subject, {
            props: {
                label: "Review",
                datetime: "2025-06-15T14:30:00Z",
                children: textSnippet("Jun 15 at 2:30 PM"),
            },
        });

        const el = document.querySelector(".review-date") as HTMLElement;
        expect(el.getAttribute("datetime")).toBe("2025-06-15T14:30:00Z");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: {
                label: "Review",
                datetime: "2025-06-15",
                "data-testid": "review-date",
                children: textSnippet("Date"),
            },
        });

        expect(screen.getByTestId("review-date")).toBeTruthy();
    });
});
