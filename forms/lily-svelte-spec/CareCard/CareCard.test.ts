import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./CareCard.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("CareCard", () => {
    test("renders as a region with heading", () => {
        render(Subject, { props: {
            heading: "Speak to a GP",
            children: textSnippet("Advice content"),
        }});

        expect(screen.getByRole("region", { name: "Speak to a GP" })).toBeTruthy();
        expect(screen.getByRole("heading", { name: "Speak to a GP" })).toBeTruthy();
    });

    test("defaults to non-urgent type", () => {
        render(Subject, { props: {
            heading: "Advice",
            "data-testid": "card",
            children: textSnippet("Content"),
        }});

        expect(screen.getByTestId("card").getAttribute("data-type")).toBe("non-urgent");
    });

    test("applies urgent type", () => {
        render(Subject, { props: {
            type: "urgent",
            heading: "Urgent",
            "data-testid": "card",
            children: textSnippet("Content"),
        }});

        expect(screen.getByTestId("card").getAttribute("data-type")).toBe("urgent");
    });

    test("applies immediate type", () => {
        render(Subject, { props: {
            type: "immediate",
            heading: "Call 999",
            "data-testid": "card",
            children: textSnippet("Content"),
        }});

        expect(screen.getByTestId("card").getAttribute("data-type")).toBe("immediate");
    });

    test("uses label prop for aria-label when provided", () => {
        render(Subject, { props: {
            heading: "GP advice",
            label: "Non-urgent care advice",
            children: textSnippet("Content"),
        }});

        expect(screen.getByRole("region", { name: "Non-urgent care advice" })).toBeTruthy();
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: {
            heading: "Test",
            "data-testid": "care",
            children: textSnippet("Content"),
        }});

        expect(screen.getByTestId("care")).toBeTruthy();
    });
});
