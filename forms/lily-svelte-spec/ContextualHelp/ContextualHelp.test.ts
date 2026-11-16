import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./ContextualHelp.svelte";

describe("ContextualHelp", () => {
    test("renders with the contextual-help wrapper class", () => {
        const { container } = render(Subject, {
            props: {
                label: "Help",
                triggerLabel: "?",
            },
        });

        const root = container.querySelector("div.contextual-help") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("trigger button has aria-label, aria-haspopup, aria-expanded, aria-controls", () => {
        const { container } = render(Subject, {
            props: {
                label: "Help with this field",
                triggerLabel: "?",
                expanded: false,
            },
        });

        const trigger = container.querySelector(".contextual-help-trigger") as HTMLElement;
        expect(trigger.getAttribute("aria-label")).toBe("Help with this field");
        expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
        expect(trigger.getAttribute("aria-expanded")).toBe("false");

        const panel = container.querySelector(".contextual-help-panel") as HTMLElement;
        expect(trigger.getAttribute("aria-controls")).toBe(panel.id);
        expect(panel.id).toBeTruthy();
    });

    test("panel has role dialog and is hidden when collapsed", () => {
        const { container } = render(Subject, {
            props: {
                label: "Help",
                triggerLabel: "?",
                expanded: false,
            },
        });

        const panel = container.querySelector(".contextual-help-panel") as HTMLElement;
        expect(panel.getAttribute("role")).toBe("dialog");
        expect(panel.hasAttribute("hidden")).toBe(true);
    });

    test("panel is visible when expanded", () => {
        const { container } = render(Subject, {
            props: {
                label: "Help",
                triggerLabel: "?",
                expanded: true,
            },
        });

        const panel = container.querySelector(".contextual-help-panel") as HTMLElement;
        expect(panel.hasAttribute("hidden")).toBe(false);

        const trigger = container.querySelector(".contextual-help-trigger") as HTMLElement;
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
    });

    test("calls onclick when trigger clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const handle = vi.fn();
        render(Subject, {
            props: {
                label: "Help",
                triggerLabel: "?",
                onclick: handle,
            },
        });

        await user.click(screen.getByRole("button", { name: "Help" }));
        expect(handle).toHaveBeenCalledOnce();
    });

    test("renders triggerLabel as the trigger's visible text", () => {
        const { container } = render(Subject, {
            props: {
                label: "Help",
                triggerLabel: "؟",
            },
        });

        const trigger = container.querySelector(".contextual-help-trigger") as HTMLElement;
        expect(trigger.textContent).toBe("؟");
        // The accessible name stays the label, not the glyph.
        expect(screen.getByRole("button", { name: "Help" })).toBe(trigger);
    });

    test("trigger opens the panel natively with command/commandfor and popovertarget", () => {
        const { container } = render(Subject, {
            props: {
                label: "Help",
                triggerLabel: "?",
            },
        });

        const trigger = container.querySelector(".contextual-help-trigger") as HTMLElement;
        const panel = container.querySelector(".contextual-help-panel") as HTMLElement;
        expect(trigger.getAttribute("command")).toBe("toggle-popover");
        expect(trigger.getAttribute("commandfor")).toBe(panel.id);
        expect(trigger.getAttribute("popovertarget")).toBe(panel.id);
    });

    test("without the Popover API, clicking the trigger toggles the panel", async () => {
        const user: UserEvent = userEvent.setup();
        const { container } = render(Subject, {
            props: {
                label: "Help",
                triggerLabel: "?",
            },
        });

        const trigger = screen.getByRole("button", { name: "Help" });
        const panel = container.querySelector(".contextual-help-panel") as HTMLElement;
        await user.click(trigger);
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
        expect(panel.hasAttribute("hidden")).toBe(false);
        await user.click(trigger);
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
        expect(panel.hasAttribute("hidden")).toBe(true);
    });

    test("onclick calling preventDefault stops the toggle", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, {
            props: {
                label: "Help",
                triggerLabel: "?",
                onclick: (event: MouseEvent) => event.preventDefault(),
            },
        });

        const trigger = screen.getByRole("button", { name: "Help" });
        await user.click(trigger);
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, {
            props: {
                label: "Help",
                triggerLabel: "?",
                class: "extra",
            },
        });

        const root = container.querySelector(".contextual-help") as HTMLElement;
        expect(root.className).toContain("contextual-help");
        expect(root.className).toContain("extra");
    });

    test("names the dialog as the trigger is named", () => {
        render(Subject, { props: { label: "Help: name", triggerLabel: "?" } });
        expect(document.querySelector(".contextual-help-panel")!.getAttribute("aria-label")).toBe(
            "Help: name",
        );
    });
});
