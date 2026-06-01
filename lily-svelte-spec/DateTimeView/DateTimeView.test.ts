import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./DateTimeView.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("DateTimeView", () => {
    test("renders as a <time> element with the date-time-view class", () => {
        const { container } = render(Subject, { props: {
            value: "2026-01-31T10:00:00Z",
        }});

        const root = container.querySelector("time.date-time-view") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("sets the datetime attribute to the value", () => {
        const { container } = render(Subject, { props: {
            value: "2026-01-31T10:00:00Z",
        }});

        const root = container.querySelector("time") as HTMLElement;
        expect(root.getAttribute("datetime")).toBe("2026-01-31T10:00:00Z");
    });

    test("falls back to value when no format or children", () => {
        const { container } = render(Subject, { props: {
            value: "2026-01-31T10:00:00Z",
        }});

        const root = container.querySelector("time") as HTMLElement;
        expect(root.textContent).toContain("2026-01-31T10:00:00Z");
    });

    test("renders format when provided", () => {
        const { container } = render(Subject, { props: {
            value: "2026-01-31T10:00:00Z",
            format: "Jan 31, 2026, 10:00 AM",
        }});

        const root = container.querySelector("time") as HTMLElement;
        expect(root.textContent).toContain("Jan 31, 2026, 10:00 AM");
    });

    test("children take priority over format", () => {
        const { container } = render(Subject, { props: {
            value: "2026-01-31T10:00:00Z",
            format: "Jan 31, 2026",
            children: textSnippet("Custom"),
        }});

        const root = container.querySelector("time") as HTMLElement;
        expect(root.textContent).toContain("Custom");
        expect(root.textContent).not.toContain("Jan 31, 2026");
    });

    test("applies aria-label when label prop is provided", () => {
        const { container } = render(Subject, { props: {
            value: "2026-01-31T10:00:00Z",
            label: "Published date",
        }});

        const root = container.querySelector("time") as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("Published date");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            value: "2026-01-31T10:00:00Z",
            class: "extra",
        }});

        const root = container.querySelector("time") as HTMLElement;
        expect(root.className).toContain("date-time-view");
        expect(root.className).toContain("extra");
    });
});
