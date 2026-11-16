import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./TourListItem.svelte";

function textSnippet(text: string) {
    return (($anchor: Comment) => {
        const node = document.createTextNode(text);
        $anchor.before(node);
    }) as any;
}

describe("TourListItem", () => {
    test("renders with role group", () => {
        render(Subject, {
            props: {
                label: "Welcome",
                current: true,
                children: textSnippet("Step content"),
            },
        });
        expect(screen.getByRole("listitem")).toBeTruthy();
    });

    test("renders children content", () => {
        render(Subject, {
            props: {
                label: "Welcome",
                current: true,
                children: textSnippet("Hello world"),
            },
        });
        expect(screen.getByText("Hello world")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, {
            props: {
                label: "Welcome step",
                current: true,
                children: textSnippet("content"),
            },
        });
        expect(screen.getByLabelText("Welcome step")).toBeTruthy();
    });

    test("has no aria-roledescription: it is a list item", () => {
        render(Subject, {
            props: {
                label: "Welcome",
                current: true,
                children: textSnippet("content"),
            },
        });
        const el = screen.getByRole("listitem");
        expect(el.getAttribute("aria-roledescription")).toBeNull();
    });

    test("has data-current when current", () => {
        render(Subject, {
            props: {
                label: "Welcome",
                current: true,
                children: textSnippet("content"),
            },
        });
        const el = screen.getByRole("listitem");
        expect(el.hasAttribute("data-current")).toBe(true);
        // The item marks itself with data-current; aria-current is the consumer's, on the link or text inside.
        expect(el.hasAttribute("aria-current")).toBe(false);
    });

    test("hidden when not current", () => {
        render(Subject, {
            props: {
                label: "Welcome",
                current: false,
                children: textSnippet("content"),
            },
        });
        const el = document.querySelector(".tour-list-item");
        expect(el).toBeTruthy();
        expect(el!.getAttribute("aria-hidden")).toBe("true");
        expect((el as HTMLElement).hidden).toBe(true);
    });

    test("not hidden when current", () => {
        render(Subject, {
            props: {
                label: "Welcome",
                current: true,
                children: textSnippet("content"),
            },
        });
        const el = screen.getByRole("listitem");
        expect(el.getAttribute("aria-hidden")).toBeNull();
        expect((el as HTMLElement).hidden).toBe(false);
    });

    test("fills in the consumer's stepTemplate with the label and both numbers", () => {
        render(Subject, {
            props: {
                label: "Features",
                current: true,
                stepNumber: 2,
                totalSteps: 5,
                stepTemplate: "{label} (Step {step} of {total})",
                children: textSnippet("content"),
            },
        });
        expect(screen.getByLabelText("Features (Step 2 of 5)")).toBeTruthy();
    });

    test("names the step with label alone when no stepTemplate is given: no English", () => {
        render(Subject, {
            props: {
                label: "Features",
                current: true,
                stepNumber: 2,
                totalSteps: 5,
                children: textSnippet("content"),
            },
        });
        expect(screen.getByLabelText("Features")).toBeTruthy();
        expect(document.body.innerHTML).not.toContain("Step 2");
    });

    test("label without step numbers when not provided", () => {
        render(Subject, {
            props: {
                label: "Intro",
                current: true,
                children: textSnippet("content"),
            },
        });
        expect(screen.getByLabelText("Intro")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: {
                label: "Step",
                current: true,
                "data-testid": "tour-step",
                children: textSnippet("content"),
            },
        });
        expect(screen.getByTestId("tour-step")).toBeTruthy();
    });

    test("defaults current to false", () => {
        render(Subject, {
            props: {
                label: "Step",
                children: textSnippet("content"),
            },
        });
        const el = document.querySelector(".tour-list-item");
        expect(el).toBeTruthy();
        expect((el as HTMLElement).hidden).toBe(true);
    });
});
