import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Timer.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Timer", () => {
    test("renders a time element", () => {
        render(Subject, { props: {
            label: "Countdown",
            children: textSnippet("05:30"),
        }});

        const el = screen.getByRole("timer");
        expect(el.tagName).toBe("TIME");
    });

    test("has role timer", () => {
        render(Subject, { props: {
            label: "Countdown",
            children: textSnippet("05:30"),
        }});

        expect(screen.getByRole("timer")).toBeTruthy();
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: {
            label: "Countdown",
            children: textSnippet("05:30"),
        }});

        const el = screen.getByRole("timer");
        expect(el.getAttribute("aria-label")).toBe("Countdown");
    });

    test("has aria-live polite for screen reader announcements", () => {
        render(Subject, { props: {
            label: "Countdown",
            children: textSnippet("05:30"),
        }});

        const el = screen.getByRole("timer");
        expect(el.getAttribute("aria-live")).toBe("polite");
    });

    test("displays children as timer content", () => {
        render(Subject, { props: {
            label: "Countdown",
            children: textSnippet("05:30"),
        }});

        const el = screen.getByRole("timer");
        expect(el.textContent).toContain("05:30");
    });

    test("displays elapsed time format", () => {
        render(Subject, { props: {
            label: "Elapsed",
            children: textSnippet("01:23:45"),
        }});

        const el = screen.getByRole("timer");
        expect(el.textContent).toContain("01:23:45");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: {
            label: "Timer",
            "data-testid": "my-timer",
            children: textSnippet("00:00"),
        }});

        expect(screen.getByTestId("my-timer")).toBeTruthy();
    });

    test("passes through datetime attribute", () => {
        render(Subject, { props: {
            label: "Timer",
            datetime: "PT5M30S",
            children: textSnippet("05:30"),
        }});

        const el = screen.getByRole("timer");
        expect(el.getAttribute("datetime")).toBe("PT5M30S");
    });
});
