import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./SplitButton.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("SplitButton", () => {
    test("renders with the split-button class", () => {
        const { container } = render(Subject, { props: {
            label: "Save options",
            primaryLabel: "Save",
            menuLabel: "More save options",
            children: textSnippet("Menu items"),
        }});

        const root = container.querySelector(".split-button") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("has role group with aria-label", () => {
        const { container } = render(Subject, { props: {
            label: "Save options",
            primaryLabel: "Save",
            menuLabel: "More save options",
            children: textSnippet("X"),
        }});

        const root = container.querySelector(".split-button") as HTMLElement;
        expect(root.getAttribute("role")).toBe("group");
        expect(root.getAttribute("aria-label")).toBe("Save options");
    });

    test("renders the primary button with primaryLabel", () => {
        render(Subject, { props: {
            label: "Save options",
            primaryLabel: "Save",
            menuLabel: "More",
            children: textSnippet("X"),
        }});

        const primary = screen.getByRole("button", { name: "Save" });
        expect(primary).toBeTruthy();
        expect(primary.classList.contains("split-button-primary")).toBe(true);
    });

    test("renders the menu trigger with menuLabel", () => {
        render(Subject, { props: {
            label: "Save options",
            primaryLabel: "Save",
            menuLabel: "More save options",
            children: textSnippet("X"),
        }});

        const trigger = screen.getByRole("button", { name: "More save options" });
        expect(trigger).toBeTruthy();
        expect(trigger.classList.contains("split-button-menu-trigger")).toBe(true);
        expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    });

    test("aria-expanded reflects menuOpen", () => {
        render(Subject, { props: {
            label: "Save options",
            primaryLabel: "Save",
            menuLabel: "More",
            menuOpen: true,
            children: textSnippet("X"),
        }});

        const trigger = screen.getByRole("button", { name: "More" });
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
    });

    test("menu is hidden when menuOpen is false", () => {
        const { container } = render(Subject, { props: {
            label: "L",
            primaryLabel: "P",
            menuLabel: "M",
            menuOpen: false,
            children: textSnippet("Item 1"),
        }});

        const menu = container.querySelector(".split-button-menu") as HTMLElement;
        expect(menu.hasAttribute("hidden")).toBe(true);
    });

    test("menu is visible when menuOpen is true", () => {
        const { container } = render(Subject, { props: {
            label: "L",
            primaryLabel: "P",
            menuLabel: "M",
            menuOpen: true,
            children: textSnippet("Item 1"),
        }});

        const menu = container.querySelector(".split-button-menu") as HTMLElement;
        expect(menu.hasAttribute("hidden")).toBe(false);
        expect(menu.textContent).toContain("Item 1");
    });

    test("primary button click fires onprimaryclick", async () => {
        const user: UserEvent = userEvent.setup();
        const handlePrimary = vi.fn();
        render(Subject, { props: {
            label: "L",
            primaryLabel: "Save",
            menuLabel: "More",
            onprimaryclick: handlePrimary,
            children: textSnippet("X"),
        }});

        await user.click(screen.getByRole("button", { name: "Save" }));
        expect(handlePrimary).toHaveBeenCalledOnce();
    });

    test("menu trigger click fires onmenutoggle", async () => {
        const user: UserEvent = userEvent.setup();
        const handleToggle = vi.fn();
        render(Subject, { props: {
            label: "L",
            primaryLabel: "Save",
            menuLabel: "More",
            onmenutoggle: handleToggle,
            children: textSnippet("X"),
        }});

        await user.click(screen.getByRole("button", { name: "More" }));
        expect(handleToggle).toHaveBeenCalledOnce();
    });

    test("disabled disables both buttons", () => {
        render(Subject, { props: {
            label: "L",
            primaryLabel: "Save",
            menuLabel: "More",
            disabled: true,
            children: textSnippet("X"),
        }});

        const primary = screen.getByRole("button", { name: "Save" }) as HTMLButtonElement;
        const trigger = screen.getByRole("button", { name: "More" }) as HTMLButtonElement;
        expect(primary.disabled).toBe(true);
        expect(trigger.disabled).toBe(true);
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            label: "L",
            primaryLabel: "P",
            menuLabel: "M",
            class: "extra",
            children: textSnippet("X"),
        }});

        const root = container.querySelector(".split-button") as HTMLElement;
        expect(root.className).toContain("split-button");
        expect(root.className).toContain("extra");
    });
});
