// The Popover API path. jsdom has no showPopover/hidePopover, so these tests stub them on the prototype (opening
// and closing the way a browser would, including the `toggle` event) and assert the calls; the component tests run
// the `hidden` fallback.
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/svelte";
import { createRawSnippet, flushSync, type Component } from "svelte";
import Popover from "./Popover.svelte";
import Popup from "../Popup/Popup.svelte";
import ContextualHelp from "../ContextualHelp/ContextualHelp.svelte";
import { popoverSupported, syncPopover } from "./popover.js";

const body = () => createRawSnippet(() => ({ render: () => `<p>Body</p>` }));

type Proto = { showPopover?: () => void; hidePopover?: () => void };
const proto = HTMLElement.prototype as unknown as Proto;
let showPopover: ReturnType<typeof vi.fn>;
let hidePopover: ReturnType<typeof vi.fn>;

/** What a browser fires after a popover opens or closes. */
function fireToggle(node: Element, newState: "open" | "closed") {
    const event = new Event("toggle");
    Object.assign(event, { newState, oldState: newState === "open" ? "closed" : "open" });
    node.dispatchEvent(event);
}

beforeEach(() => {
    showPopover = vi.fn();
    hidePopover = vi.fn();
    proto.showPopover = showPopover as unknown as () => void;
    proto.hidePopover = hidePopover as unknown as () => void;
});

afterEach(() => {
    delete proto.showPopover;
    delete proto.hidePopover;
});

describe("syncPopover", () => {
    test("calls showPopover and hidePopover where the API exists", () => {
        const node = document.createElement("div");
        expect(popoverSupported(node)).toBe(true);
        syncPopover(node, true);
        expect(showPopover).toHaveBeenCalledOnce();
        syncPopover(node, false);
        expect(hidePopover).toHaveBeenCalledOnce();
        expect(node.hasAttribute("hidden")).toBe(false);
    });

    test("swallows InvalidStateError from an older engine", () => {
        showPopover.mockImplementation(() => {
            throw new DOMException("already open", "InvalidStateError");
        });
        expect(() => syncPopover(document.createElement("div"), true)).not.toThrow();
    });

    test("falls back to hidden without the API", () => {
        delete proto.showPopover;
        const node = document.createElement("div");
        node.setAttribute("popover", "auto");
        expect(popoverSupported(node)).toBe(false);
        syncPopover(node, false);
        expect(node.hasAttribute("hidden")).toBe(true);
        expect(node.hasAttribute("popover")).toBe(false);
        syncPopover(node, true);
        expect(node.hasAttribute("hidden")).toBe(false);
    });
});

for (const [name, Subject, cls] of [
    ["Popover", Popover, "popover"],
    ["Popup", Popup, "popup"],
] as const) {
    describe(`${name} with the Popover API`, () => {
        test("renders popover=auto and opens with showPopover, never with hidden", () => {
            const { container } = render(Subject, {
                props: { label: "Info", open: true, children: body() },
            });
            const root = container.querySelector(`div.${cls}`) as HTMLElement;
            expect(root.getAttribute("popover")).toBe("auto");
            expect(root.getAttribute("role")).toBe("dialog");
            expect(showPopover).toHaveBeenCalledOnce();
            expect(root.hasAttribute("hidden")).toBe(false);
        });

        test("closed, it neither shows nor sets hidden (the UA style hides it)", () => {
            const { container } = render(Subject, {
                props: { label: "Info", children: body() },
            });
            const root = container.querySelector(`div.${cls}`) as HTMLElement;
            expect(showPopover).not.toHaveBeenCalled();
            expect(root.hasAttribute("hidden")).toBe(false);
        });

        test("closing open calls hidePopover", async () => {
            const { rerender } = render(Subject, {
                props: { label: "Info", open: true, children: body() },
            });
            await rerender({ open: false });
            expect(hidePopover).toHaveBeenCalledOnce();
        });

        test("a light dismiss (toggle closed) writes open back to false", () => {
            const { container } = render(Subject, {
                props: { label: "Info", open: true, children: body() },
            });
            fireToggle(container.querySelector(`div.${cls}`)!, "closed");
            flushSync();
            // open is now false, so the action asks for the (already closed) popover to hide.
            expect(hidePopover).toHaveBeenCalledOnce();
        });

        test("a commandfor trigger opening it (toggle open) writes open back to true", () => {
            const { container } = render(Subject, {
                props: { label: "Info", open: false, children: body() },
            });
            hidePopover.mockClear();
            fireToggle(container.querySelector(`div.${cls}`)!, "open");
            flushSync();
            expect(showPopover).toHaveBeenCalledOnce();
        });
    });
}

describe("ContextualHelp with the Popover API", () => {
    test("the trigger leaves toggling to the browser (command / popovertarget)", async () => {
        render(ContextualHelp, { props: { label: "Help", triggerLabel: "?", children: body() } });
        await fireEvent.click(screen.getByRole("button", { name: "Help" }));
        // The click did not toggle in script: the browser runs command="toggle-popover".
        expect(screen.getByRole("button", { name: "Help" }).getAttribute("aria-expanded")).toBe(
            "false",
        );
        expect(showPopover).not.toHaveBeenCalled();
    });

    test("the panel's toggle event drives aria-expanded", () => {
        const { container } = render(ContextualHelp, {
            props: { label: "Help", triggerLabel: "?", children: body() },
        });
        const panel = container.querySelector(".contextual-help-panel")!;
        const trigger = container.querySelector(".contextual-help-trigger")!;
        fireToggle(panel, "open");
        flushSync();
        expect(trigger.getAttribute("aria-expanded")).toBe("true");
        fireToggle(panel, "closed");
        flushSync();
        expect(trigger.getAttribute("aria-expanded")).toBe("false");
        expect(panel.hasAttribute("hidden")).toBe(false);
    });

    test("expanded opens the panel with showPopover", () => {
        render(ContextualHelp, {
            props: { label: "Help", triggerLabel: "?", expanded: true, children: body() },
        });
        expect(showPopover).toHaveBeenCalledOnce();
    });
});

// The menu group (tasks.md P18-T11): the menu panel is popover="auto"; the APG arrow-key focus code stays.
import DropdownMenu from "../DropdownMenu/DropdownMenu.svelte";
import SplitButton from "../SplitButton/SplitButton.svelte";
import ActionGroup from "../ActionGroup/ActionGroup.svelte";
import ContextMenu from "../ContextMenu/ContextMenu.svelte";

const items = () =>
    createRawSnippet(() => ({
        render: () =>
            `<div><div role="menuitem" tabindex="-1">Edit</div><div role="menuitem" tabindex="-1">Delete</div></div>`,
    }));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loose = (c: unknown) => c as Component<any>;

for (const [name, Subject, props, triggerSel, menuSel] of [
    [
        "DropdownMenu",
        loose(DropdownMenu),
        { label: "Options", children: items() },
        "button",
        "[role='menu']",
    ],
    [
        "SplitButton",
        loose(SplitButton),
        { label: "Save", primaryLabel: "Save", menuLabel: "More", children: items() },
        ".split-button-menu-trigger",
        ".split-button-menu",
    ],
    [
        "ActionGroup",
        loose(ActionGroup),
        { label: "Editing", overflowLabel: "More", overflow: items() },
        ".action-group-overflow-trigger",
        ".action-group-overflow-menu",
    ],
] as const) {
    describe(`${name} with the Popover API`, () => {
        test("the trigger names the popover=auto menu and leaves the click to the browser", async () => {
            const { container } = render(Subject, { props });
            const trigger = container.querySelector(triggerSel) as HTMLElement;
            const menu = container.querySelector(menuSel) as HTMLElement;
            expect(menu.getAttribute("popover")).toBe("auto");
            expect(trigger.getAttribute("command")).toBe("toggle-popover");
            expect(trigger.getAttribute("commandfor")).toBe(menu.id);
            expect(trigger.getAttribute("popovertarget")).toBe(menu.id);
            expect(trigger.getAttribute("aria-controls")).toBe(menu.id);
            await fireEvent.click(trigger);
            expect(trigger.getAttribute("aria-expanded")).toBe("false");
            expect(showPopover).not.toHaveBeenCalled();
            expect(menu.hasAttribute("hidden")).toBe(false);
        });

        test("the menu's toggle event drives aria-expanded", () => {
            const { container } = render(Subject, { props });
            const trigger = container.querySelector(triggerSel) as HTMLElement;
            const menu = container.querySelector(menuSel) as HTMLElement;
            fireToggle(menu, "open");
            flushSync();
            expect(trigger.getAttribute("aria-expanded")).toBe("true");
            fireToggle(menu, "closed");
            flushSync();
            expect(trigger.getAttribute("aria-expanded")).toBe("false");
        });
    });
}

describe("ContextMenu with the Popover API", () => {
    test("open shows it with showPopover, and a light dismiss writes open back", async () => {
        const { container, rerender } = render(ContextMenu, {
            props: { label: "Actions", open: true, children: items() },
        });
        const menu = container.querySelector(".context-menu") as HTMLElement;
        expect(menu.getAttribute("popover")).toBe("auto");
        expect(showPopover).toHaveBeenCalledOnce();
        await rerender({ open: false });
        expect(hidePopover).toHaveBeenCalledOnce();
        await rerender({ open: true });
        fireToggle(menu, "closed");
        flushSync();
        // open is false again, so the action hides the (already closed) popover a second time.
        expect(hidePopover).toHaveBeenCalledTimes(2);
    });
});

describe("SplitButton and ActionGroup without the Popover API", () => {
    beforeEach(() => {
        delete proto.showPopover;
        delete proto.hidePopover;
    });

    for (const [name, Subject, props, triggerSel, menuSel, handler] of [
        [
            "SplitButton",
            loose(SplitButton),
            { label: "Save", primaryLabel: "Save", menuLabel: "More", children: items() },
            ".split-button-menu-trigger",
            ".split-button-menu",
            "onmenutoggle",
        ],
        [
            "ActionGroup",
            loose(ActionGroup),
            { label: "Editing", overflowLabel: "More", overflow: items() },
            ".action-group-overflow-trigger",
            ".action-group-overflow-menu",
            "onOverflowToggle",
        ],
    ] as const) {
        test(`${name}: the trigger toggles the menu with hidden, unless its handler prevents the default`, async () => {
            const { container, rerender } = render(Subject, { props });
            const trigger = container.querySelector(triggerSel) as HTMLElement;
            const menu = container.querySelector(menuSel) as HTMLElement;
            expect(menu.hasAttribute("hidden")).toBe(true);
            await fireEvent.click(trigger);
            expect(menu.hasAttribute("hidden")).toBe(false);
            expect(trigger.getAttribute("aria-expanded")).toBe("true");
            await fireEvent.click(trigger);
            expect(menu.hasAttribute("hidden")).toBe(true);
            await rerender({ [handler]: (event: MouseEvent) => event.preventDefault() });
            await fireEvent.click(trigger);
            expect(menu.hasAttribute("hidden")).toBe(true);
        });
    }
});
