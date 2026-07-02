import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./HamburgerMenu.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("HamburgerMenu", () => {
    test("renders toggle button", () => {
        render(Subject, { props: { label: "Menu", children: textSnippet("Nav") } });
        expect(screen.getByRole("button", { name: "Menu" })).toBeTruthy();
    });

    test("button has aria-expanded false when closed", () => {
        render(Subject, { props: { children: textSnippet("Nav") } });
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("false");
    });

    test("navigation hidden when closed", () => {
        render(Subject, { props: { children: textSnippet("Nav") } });
        expect(screen.queryByRole("navigation")).toBeNull();
    });

    test("clicking opens navigation", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { children: textSnippet("Nav items") } });
        await user.click(screen.getByRole("button"));
        expect(screen.getByRole("navigation")).toBeTruthy();
    });

    test("has aria-expanded true when open", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { children: textSnippet("Nav") } });
        await user.click(screen.getByRole("button"));
        expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe("true");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "hm", children: textSnippet("Nav") } });
        expect(screen.getByTestId("hm")).toBeTruthy();
    });
});
