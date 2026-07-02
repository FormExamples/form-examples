import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";

import Subject from "./TaskListItem.svelte";

describe("TaskListItem", () => {
    test("renders a list item", () => {
        render(Subject, { props: { label: "Buy groceries" } });
        expect(screen.getByRole("listitem")).toBeTruthy();
    });

    test("renders a checkbox", () => {
        render(Subject, { props: { label: "Buy groceries" } });
        expect(screen.getByRole("checkbox")).toBeTruthy();
    });

    test("renders the label text", () => {
        render(Subject, { props: { label: "Buy groceries" } });
        expect(screen.getByText("Buy groceries")).toBeTruthy();
    });

    test("checkbox is unchecked by default", () => {
        render(Subject, { props: { label: "Task" } });
        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        expect(checkbox.checked).toBe(false);
    });

    test("checkbox is checked when checked prop is true", () => {
        render(Subject, { props: { label: "Done task", checked: true } });
        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        expect(checkbox.checked).toBe(true);
    });

    test("checkbox toggles on user click", async () => {
        const user = userEvent.setup();
        render(Subject, { props: { label: "Toggle me" } });
        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        expect(checkbox.checked).toBe(false);
        await user.click(checkbox);
        expect(checkbox.checked).toBe(true);
        await user.click(checkbox);
        expect(checkbox.checked).toBe(false);
    });

    test("checkbox is disabled when disabled prop is true", () => {
        render(Subject, { props: { label: "Locked task", disabled: true } });
        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        expect(checkbox.disabled).toBe(true);
    });

    test("disabled checkbox does not toggle on click", async () => {
        const user = userEvent.setup();
        render(Subject, { props: { label: "Locked", disabled: true } });
        const checkbox = screen.getByRole("checkbox") as HTMLInputElement;
        await user.click(checkbox);
        expect(checkbox.checked).toBe(false);
    });

    test("sets data-checked attribute", () => {
        render(Subject, { props: { label: "Task", checked: true } });
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("data-checked")).toBe("true");
    });

    test("sets data-disabled attribute when disabled", () => {
        render(Subject, { props: { label: "Task", disabled: true } });
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("data-disabled")).toBe("true");
    });

    test("no data-disabled when not disabled", () => {
        render(Subject, { props: { label: "Task" } });
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("data-disabled")).toBeNull();
    });

    test("label wraps the checkbox for click association", () => {
        render(Subject, { props: { label: "Wrapped" } });
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox.closest("label")).toBeTruthy();
    });

    test("passes through data-testid attribute", () => {
        render(Subject, { props: { label: "Task", "data-testid": "task-item" } });
        expect(screen.getByTestId("task-item")).toBeTruthy();
        expect(screen.getByTestId("task-item").tagName).toBe("LI");
    });

    test("passes through id attribute", () => {
        render(Subject, { props: { label: "Task", id: "task-1" } });
        const li = screen.getByRole("listitem");
        expect(li.getAttribute("id")).toBe("task-1");
    });
});
