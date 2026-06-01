import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./Drawer.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Drawer", () => {
    test("hidden when open is false", () => {
        render(Subject, { props: { label: "Nav", open: false, children: textSnippet("Content") } });
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("visible when open is true", () => {
        render(Subject, { props: { label: "Nav", open: true, children: textSnippet("Content") } });
        expect(screen.getByRole("dialog", { name: "Nav" })).toBeTruthy();
    });

    test("has aria-modal", () => {
        render(Subject, { props: { label: "Nav", open: true, children: textSnippet("C") } });
        expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe("true");
    });

    test("has data-side attribute", () => {
        render(Subject, { props: { label: "Nav", open: true, side: "right", children: textSnippet("C") } });
        expect(screen.getByRole("dialog").getAttribute("data-side")).toBe("right");
    });

    test("defaults to left side", () => {
        render(Subject, { props: { label: "Nav", open: true, children: textSnippet("C") } });
        expect(screen.getByRole("dialog").getAttribute("data-side")).toBe("left");
    });

    test("Escape closes the drawer", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Nav", open: true, children: textSnippet("C") } });
        screen.getByRole("dialog").focus();
        await user.keyboard("{Escape}");
        expect(screen.queryByRole("dialog")).toBeNull();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Nav", open: true, children: textSnippet("Drawer content") } });
        expect(screen.getByRole("dialog").textContent).toContain("Drawer content");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Nav", open: true, "data-testid": "dr", children: textSnippet("C") } });
        expect(screen.getByTestId("dr")).toBeTruthy();
    });
});
