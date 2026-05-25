import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./Form.svelte";

function buttonSnippet(label: string, type: string = "submit") {
    return (($$anchor: Comment) => {
        const btn = document.createElement("button");
        btn.type = type;
        btn.textContent = label;
        $$anchor.before(btn);
    }) as any;
}

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Form", () => {
    test("renders as a form", () => {
        render(Subject, { props: { label: "Login", children: textSnippet("Fields") } });
        expect(screen.getByRole("form", { name: "Login" })).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Register", children: textSnippet("C") } });
        expect(screen.getByRole("form").getAttribute("aria-label")).toBe("Register");
    });

    test("calls onsubmit and prevents default", async () => {
        const user: UserEvent = userEvent.setup();
        const handleSubmit = vi.fn();
        render(Subject, { props: { label: "F", onsubmit: handleSubmit, children: buttonSnippet("Go") } });
        await user.click(screen.getByRole("button", { name: "Go" }));
        expect(handleSubmit).toHaveBeenCalledOnce();
    });

    test("renders children", () => {
        render(Subject, { props: { label: "F", children: textSnippet("Form content") } });
        expect(screen.getByRole("form").textContent).toContain("Form content");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "F", "data-testid": "fm", children: textSnippet("C") } });
        expect(screen.getByTestId("fm")).toBeTruthy();
    });
});
