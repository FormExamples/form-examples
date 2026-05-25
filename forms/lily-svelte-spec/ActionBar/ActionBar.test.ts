import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./ActionBar.svelte";

describe("ActionBar", () => {
    test("renders as a toolbar with the action-bar class", () => {
        const { container } = render(Subject, { props: {
            label: "Bulk actions",
            selectedCount: 3,
            selectedCountLabel: "3 selected",
        }});

        const root = container.querySelector("div.action-bar") as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.getAttribute("role")).toBe("toolbar");
    });

    test("applies aria-label", () => {
        render(Subject, { props: {
            label: "Bulk actions",
            selectedCount: 3,
            selectedCountLabel: "3 selected",
        }});

        const toolbar = screen.getByRole("toolbar", { name: "Bulk actions" });
        expect(toolbar).toBeTruthy();
    });

    test("exposes selectedCount via data attribute", () => {
        const { container } = render(Subject, { props: {
            label: "Bulk actions",
            selectedCount: 5,
            selectedCountLabel: "5 selected",
        }});

        const root = container.querySelector(".action-bar") as HTMLElement;
        expect(root.getAttribute("data-selected-count")).toBe("5");
    });

    test("renders selectedCountLabel", () => {
        const { container } = render(Subject, { props: {
            label: "Bulk actions",
            selectedCount: 7,
            selectedCountLabel: "7 selected",
        }});

        const count = container.querySelector(".action-bar-count") as HTMLElement;
        expect(count.textContent).toContain("7 selected");
    });

    test("does not render clear button when only label is provided", () => {
        const { container } = render(Subject, { props: {
            label: "Bulk actions",
            selectedCount: 1,
            selectedCountLabel: "1 selected",
            clearSelectionLabel: "Clear",
        }});

        expect(container.querySelector(".action-bar-clear")).toBeNull();
    });

    test("does not render clear button when only handler is provided", () => {
        const { container } = render(Subject, { props: {
            label: "Bulk actions",
            selectedCount: 1,
            selectedCountLabel: "1 selected",
            onClearSelection: () => {},
        }});

        expect(container.querySelector(".action-bar-clear")).toBeNull();
    });

    test("renders clear button when both label and handler are provided", () => {
        render(Subject, { props: {
            label: "Bulk actions",
            selectedCount: 2,
            selectedCountLabel: "2 selected",
            clearSelectionLabel: "Clear selection",
            onClearSelection: () => {},
        }});

        const button = screen.getByRole("button", { name: "Clear selection" });
        expect(button).toBeTruthy();
    });

    test("calls onClearSelection when clear button clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const handle = vi.fn();
        render(Subject, { props: {
            label: "Bulk actions",
            selectedCount: 2,
            selectedCountLabel: "2 selected",
            clearSelectionLabel: "Clear selection",
            onClearSelection: handle,
        }});

        await user.click(screen.getByRole("button", { name: "Clear selection" }));
        expect(handle).toHaveBeenCalledOnce();
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            label: "Bulk actions",
            selectedCount: 1,
            selectedCountLabel: "1 selected",
            class: "extra",
        }});

        const root = container.querySelector(".action-bar") as HTMLElement;
        expect(root.className).toContain("action-bar");
        expect(root.className).toContain("extra");
    });
});
