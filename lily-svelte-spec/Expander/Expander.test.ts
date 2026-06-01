import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./Expander.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Expander", () => {
    test("renders toggle button", () => {
        render(Subject, { props: { label: "More", children: textSnippet("Content") } });
        expect(screen.getByRole("button", { name: "More" })).toBeTruthy();
    });

    test("collapsed by default", () => {
        render(Subject, { props: { label: "More", children: textSnippet("Hidden") } });
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
        expect(screen.queryByRole("region")).toBeNull();
    });

    test("clicking expands content", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "More", children: textSnippet("Visible") } });
        await user.click(screen.getByRole("button"));
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
        expect(screen.getByRole("region")).toBeTruthy();
    });

    test("region has aria-label", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Details", children: textSnippet("Info") } });
        await user.click(screen.getByRole("button"));
        expect(screen.getByRole("region").getAttribute("aria-label")).toBe("Details");
    });

    test("button has aria-controls", () => {
        render(Subject, { props: { label: "More", children: textSnippet("C") } });
        expect(screen.getByRole("button").getAttribute("aria-controls")).toBeTruthy();
    });

    test("clicking again collapses", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "More", expanded: true, children: textSnippet("C") } });
        await user.click(screen.getByRole("button"));
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "M", "data-testid": "exp", children: textSnippet("C") } });
        expect(screen.getByTestId("exp")).toBeTruthy();
    });
});
