import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./TimelineList.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("TimelineList", () => {
    test("renders an ordered list element", () => {
        render(Subject, { props: {
            label: "Project milestones",
            children: textSnippet("events"),
        }});

        const list = screen.getByRole("list");
        expect(list.tagName).toBe("OL");
    });

    test("has aria-label from label prop", () => {
        render(Subject, { props: {
            label: "Activity history",
            children: textSnippet("events"),
        }});

        const list = screen.getByRole("list");
        expect(list.getAttribute("aria-label")).toBe("Activity history");
    });

    test("renders children content", () => {
        render(Subject, { props: {
            label: "Timeline",
            children: textSnippet("Event details here"),
        }});

        const list = screen.getByRole("list");
        expect(list.textContent).toContain("Event details here");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: {
            label: "Timeline",
            "data-testid": "my-timeline",
            children: textSnippet("events"),
        }});

        const list = screen.getByTestId("my-timeline");
        expect(list).toBeTruthy();
    });

    test("passes through id attribute", () => {
        render(Subject, { props: {
            label: "Timeline",
            id: "project-timeline",
            children: textSnippet("events"),
        }});

        const list = screen.getByRole("list");
        expect(list.getAttribute("id")).toBe("project-timeline");
    });
});
