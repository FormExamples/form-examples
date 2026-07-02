import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./Editable.svelte";

describe("Editable", () => {
    test("displays value as text by default", () => {
        render(Subject, { props: { label: "Name", value: "Alice" } });
        expect(screen.getByText("Alice")).toBeTruthy();
    });

    test("text element has button role", () => {
        render(Subject, { props: { label: "Name", value: "Alice" } });
        expect(screen.getByRole("button", { name: "Name" })).toBeTruthy();
    });

    test("clicking activates edit mode", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Name", value: "Alice" } });
        await user.click(screen.getByRole("button"));
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
    });

    test("Escape cancels edit", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Name", value: "Alice", editing: true } });
        const input = screen.getByLabelText("Name") as HTMLInputElement;
        await user.clear(input);
        await user.type(input, "Bob");
        await user.keyboard("{Escape}");
        expect(screen.getByText("Alice")).toBeTruthy();
    });

    test("disabled prevents editing", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: { label: "Name", value: "Alice", disabled: true } });
        await user.click(screen.getByRole("button"));
        // Should still be in display mode.
        expect(screen.getByRole("button")).toBeTruthy();
        expect(screen.queryByRole("textbox")).toBeNull();
    });

    test("disabled shows aria-disabled", () => {
        render(Subject, { props: { label: "Name", value: "Alice", disabled: true } });
        expect(screen.getByRole("button").getAttribute("aria-disabled")).toBe("true");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Name", value: "A", "data-testid": "ed" } });
        expect(screen.getByTestId("ed")).toBeTruthy();
    });
});
