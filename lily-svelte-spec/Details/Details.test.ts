import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./Details.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Details", () => {
    test("renders summary text", () => {
        render(Subject, { props: { summary: "Show more", children: textSnippet("Content") } });
        expect(screen.getByText("Show more")).toBeTruthy();
    });

    test("is collapsed by default", () => {
        render(Subject, { props: { summary: "Info", "data-testid": "det", children: textSnippet("Content") } });
        expect((screen.getByTestId("det") as HTMLDetailsElement).open).toBe(false);
    });

    test("can be initially open", () => {
        render(Subject, { props: { summary: "Info", open: true, "data-testid": "det", children: textSnippet("Content") } });
        expect((screen.getByTestId("det") as HTMLDetailsElement).open).toBe(true);
    });

    test("toggles on summary click", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { summary: "Toggle", "data-testid": "det", children: textSnippet("Content") } });
        const details = screen.getByTestId("det") as HTMLDetailsElement;

        await user.click(screen.getByText("Toggle"));
        expect(details.open).toBe(true);

        await user.click(screen.getByText("Toggle"));
        expect(details.open).toBe(false);
    });

    test("renders children content", () => {
        render(Subject, { props: { summary: "S", "data-testid": "det", children: textSnippet("Inner text") } });
        expect(screen.getByTestId("det").textContent).toContain("Inner text");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { summary: "S", "data-testid": "det", children: textSnippet("C") } });
        expect(screen.getByTestId("det")).toBeTruthy();
    });
});
