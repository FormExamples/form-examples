import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./TimelineListItem.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("TimelineListItem", () => {
    test("renders a list item", () => {
        render(Subject, {
            props: {
                children: textSnippet("Order placed"),
            },
        });
        expect(screen.getByRole("listitem")).toBeTruthy();
    });

    test("renders children content", () => {
        render(Subject, {
            props: {
                children: textSnippet("Order shipped"),
            },
        });
        expect(screen.getByText("Order shipped")).toBeTruthy();
    });

    test("renders time element with datetime and heading", () => {
        render(Subject, {
            props: {
                datetime: "2024-01-15",
                heading: "January 15, 2024",
                children: textSnippet("Order placed"),
            },
        });
        const time = screen.getByText("January 15, 2024");
        expect(time.tagName).toBe("TIME");
        expect(time.getAttribute("datetime")).toBe("2024-01-15");
    });

    test("renders time element with heading only", () => {
        render(Subject, {
            props: {
                heading: "Last week",
                children: textSnippet("Event happened"),
            },
        });
        const time = screen.getByText("Last week");
        expect(time.tagName).toBe("TIME");
    });

    test("renders time element with datetime only", () => {
        render(Subject, {
            props: {
                datetime: "2024-06-01",
                children: textSnippet("Milestone reached"),
            },
        });
        const li = screen.getByRole("listitem");
        const time = li.querySelector("time");
        expect(time).toBeTruthy();
        expect(time!.getAttribute("datetime")).toBe("2024-06-01");
    });

    test("does not render time element when no datetime or heading", () => {
        render(Subject, {
            props: {
                children: textSnippet("Simple event"),
            },
        });
        const li = screen.getByRole("listitem");
        expect(li.querySelector("time")).toBeNull();
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, {
            props: {
                "data-testid": "tl-item",
                children: textSnippet("Event"),
            },
        });
        expect(screen.getByTestId("tl-item")).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(Subject, {
            props: {
                id: "event-1",
                children: textSnippet("Event"),
            },
        });
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("id")).toBe("event-1");
    });

    test("a withheld entry keeps its date and shows only the consumer's words", () => {
        const { container } = render(Subject, {
            props: {
                datetime: "2026-11-03",
                heading: "3 Nov 2026",
                entryState: "withheld",
                entryStateLabel: "Restricted entry",
                children: textSnippet("Sensitive note"),
            },
        });
        const li = container.querySelector("li.timeline-list-item")!;
        expect(li.getAttribute("data-entry-state")).toBe("withheld");
        expect(li.querySelector("time")?.textContent).toBe("3 Nov 2026");
        expect(li.textContent).not.toContain("Sensitive note");
        expect(li.querySelector(".timeline-list-item-entry-state")?.textContent).toBe(
            "Restricted entry",
        );
    });

    test("an entry in error is kept, struck through, with the consumer's words", () => {
        const { container } = render(Subject, {
            props: {
                entryState: "entered-in-error",
                entryStateLabel: "Entered in error",
                children: textSnippet("Wrong patient"),
            },
        });
        const li = container.querySelector("li.timeline-list-item")!;
        expect(li.querySelector("del.timeline-list-item-entry")?.textContent).toContain(
            "Wrong patient",
        );
        expect(li.querySelector(".timeline-list-item-entry-state")?.textContent).toBe(
            "Entered in error",
        );
    });
});
