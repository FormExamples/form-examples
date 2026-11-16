import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./Editable.svelte";

describe("Editable", () => {
    test("displays value as text by default", () => {
        render(Subject, { props: { label: "Name", value: "Alice" } });
        expect(screen.getByText("Alice")).toBeTruthy();
    });

    test("the root is a div with the base class, holding a native button", () => {
        const { container } = render(Subject, {
            props: { label: "Name", value: "Alice", class: "mine" },
        });
        const root = container.querySelector(".editable")!;
        expect(root.tagName).toBe("DIV");
        expect(root.getAttribute("class")).toBe("editable mine");
        const button = screen.getByRole("button", { name: "Alice, Name" });
        expect(button.tagName).toBe("BUTTON");
        expect(button.getAttribute("type")).toBe("button");
        expect(button.className).toBe("editable-button");
        expect(root.contains(button)).toBe(true);
    });

    test("the accessible name starts with the visible value (WCAG 2.5.3 label in name)", () => {
        render(Subject, { props: { label: "Name", value: "Alice" } });
        expect(screen.getByRole("button").getAttribute("aria-label")).toBe("Alice, Name");
    });

    test("an empty value names the button by its label alone", () => {
        render(Subject, { props: { label: "Name", value: "" } });
        expect(screen.getByRole("button", { name: "Name" })).toBeTruthy();
    });

    test("clicking activates edit mode", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Name", value: "Alice" } });
        await user.click(screen.getByRole("button"));
        const input = screen.getByLabelText("Name");
        expect(input.tagName).toBe("INPUT");
        expect(input.className).toBe("editable-input");
        expect(document.activeElement).toBe(input);
    });

    test("Space on the button, its own key, activates edit mode", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Name", value: "Alice" } });
        screen.getByRole("button").focus();
        await user.keyboard(" ");
        expect(screen.getByLabelText("Name").tagName).toBe("INPUT");
    });

    test("Enter confirms edit", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Name", value: "Alice", editing: true } });
        const input = screen.getByLabelText("Name") as HTMLInputElement;
        await user.clear(input);
        await user.type(input, "Bob");
        await user.keyboard("{Enter}");
        expect(screen.getByText("Bob")).toBeTruthy();
        expect(document.activeElement).toBe(screen.getByRole("button"));
    });

    test("Escape cancels edit", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Name", value: "Alice", editing: true } });
        const input = screen.getByLabelText("Name") as HTMLInputElement;
        await user.clear(input);
        await user.type(input, "Bob");
        await user.keyboard("{Escape}");
        expect(screen.getByText("Alice")).toBeTruthy();
        expect(document.activeElement).toBe(screen.getByRole("button"));
    });

    test("disabled prevents editing", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Name", value: "Alice", disabled: true } });
        await user.click(screen.getByRole("button"));
        // Should still be in display mode.
        expect(screen.getByRole("button")).toBeTruthy();
        expect(screen.queryByRole("textbox")).toBeNull();
    });

    test("disabled disables the button", () => {
        render(Subject, { props: { label: "Name", value: "Alice", disabled: true } });
        expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Name", value: "A", "data-testid": "ed" } });
        expect(screen.getByTestId("ed").tagName).toBe("DIV");
    });
});
