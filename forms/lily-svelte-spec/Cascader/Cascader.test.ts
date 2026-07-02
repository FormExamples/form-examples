import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./Cascader.svelte";

// Helper to create a Svelte 5 snippet for children content.
function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Cascader", () => {
    test("renders as a div with the cascader class and combobox role", () => {
        const { container } = render(Subject, { props: {
            label: "Region",
        }});

        const root = container.querySelector("div.cascader") as HTMLElement;
        expect(root).toBeTruthy();
        expect(root.getAttribute("role")).toBe("combobox");
        expect(root.getAttribute("aria-haspopup")).toBe("tree");
    });

    test("applies aria-label", () => {
        render(Subject, { props: {
            label: "Region selection",
        }});

        const root = screen.getByRole("combobox");
        expect(root.getAttribute("aria-label")).toBe("Region selection");
    });

    test("aria-expanded reflects expanded prop", () => {
        const { container } = render(Subject, { props: {
            label: "Region",
            expanded: true,
        }});

        const root = container.querySelector("div.cascader") as HTMLElement;
        expect(root.getAttribute("aria-expanded")).toBe("true");
    });

    test("panel is hidden when not expanded", () => {
        const { container } = render(Subject, { props: {
            label: "Region",
            expanded: false,
            children: textSnippet("Panel"),
        }});

        const panel = container.querySelector(".cascader-panel") as HTMLElement;
        expect(panel.hasAttribute("hidden")).toBe(true);
    });

    test("panel is visible when expanded", () => {
        const { container } = render(Subject, { props: {
            label: "Region",
            expanded: true,
            children: textSnippet("Panel"),
        }});

        const panel = container.querySelector(".cascader-panel") as HTMLElement;
        expect(panel.hasAttribute("hidden")).toBe(false);
        expect(panel.textContent).toContain("Panel");
    });

    test("trigger displays value when provided", () => {
        const { container } = render(Subject, { props: {
            label: "Region",
            value: "USA / California",
        }});

        const trigger = container.querySelector(".cascader-trigger") as HTMLElement;
        expect(trigger.textContent).toContain("USA / California");
    });

    test("trigger displays placeholder when no value", () => {
        const { container } = render(Subject, { props: {
            label: "Region",
            placeholder: "Choose region",
        }});

        const trigger = container.querySelector(".cascader-trigger") as HTMLElement;
        expect(trigger.textContent).toContain("Choose region");
    });

    test("trigger is a button of type button", () => {
        const { container } = render(Subject, { props: {
            label: "Region",
        }});

        const trigger = container.querySelector(".cascader-trigger") as HTMLButtonElement;
        expect(trigger.tagName).toBe("BUTTON");
        expect(trigger.getAttribute("type")).toBe("button");
    });

    test("trigger can be disabled", () => {
        const { container } = render(Subject, { props: {
            label: "Region",
            disabled: true,
        }});

        const trigger = container.querySelector(".cascader-trigger") as HTMLButtonElement;
        expect(trigger.disabled).toBe(true);
    });

    test("invokes onclick handler", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        const { container } = render(Subject, { props: {
            label: "Region",
            onclick: handleClick,
        }});

        const trigger = container.querySelector(".cascader-trigger") as HTMLButtonElement;
        await user.click(trigger);
        expect(handleClick).toHaveBeenCalledOnce();
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            label: "Region",
            class: "extra",
        }});

        const root = container.querySelector("div.cascader") as HTMLElement;
        expect(root.className).toContain("cascader");
        expect(root.className).toContain("extra");
    });
});
