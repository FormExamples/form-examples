import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./CalendarDayTable.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}

describe("CalendarDayTable", () => {
    test("renders a grid", () => {
        render(Subject, { props: { label: "Monday 6 January 2025", children: textSnippet("1") } });
        expect(screen.getByRole("grid")).toBeTruthy();
    });

    test("renders as a table element", () => {
        render(Subject, { props: { label: "Monday 6 January 2025", children: textSnippet("1") } });
        expect(screen.getByRole("grid").tagName).toBe("TABLE");
    });

    test("has the calendar-day-table base class", () => {
        render(Subject, { props: { label: "Monday 6 January 2025", children: textSnippet("1") } });
        expect(screen.getByRole("grid").classList.contains("calendar-day-table")).toBe(true);
    });

    test("appends the consumer class after the base class", () => {
        render(Subject, {
            props: { label: "Monday 6 January 2025", class: "mine", children: textSnippet("1") },
        });
        expect(screen.getByRole("grid").getAttribute("class")).toBe("calendar-day-table mine");
    });

    test("has aria-label from label", () => {
        render(Subject, { props: { label: "Monday 6 January 2025", children: textSnippet("1") } });
        expect(screen.getByRole("grid").getAttribute("aria-label")).toBe("Monday 6 January 2025");
    });

    test("marks the view as data-view=day", () => {
        render(Subject, { props: { label: "Monday 6 January 2025", children: textSnippet("1") } });
        expect(screen.getByRole("grid").getAttribute("data-view")).toBe("day");
    });

    test("renders caption when provided", () => {
        render(Subject, {
            props: {
                label: "Monday 6 January 2025",
                caption: "Visible caption",
                children: textSnippet("1"),
            },
        });
        const cap = screen.getByRole("grid").querySelector("caption");
        expect(cap?.textContent).toBe("Visible caption");
    });

    test("renders without caption by default", () => {
        render(Subject, { props: { label: "Monday 6 January 2025", children: textSnippet("1") } });
        expect(screen.getByRole("grid").querySelector("caption")).toBeNull();
    });

    test("renders children content", () => {
        render(Subject, { props: { label: "Monday 6 January 2025", children: textSnippet("15") } });
        expect(screen.getByText("15")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: {
                label: "Monday 6 January 2025",
                "data-testid": "cal",
                children: textSnippet("1"),
            },
        });
        expect(screen.getByTestId("cal")).toBeTruthy();
    });
});
