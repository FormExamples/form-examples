// @vitest-environment jsdom
// What the combobox contract does not reach: the module's edges. The contract in pattern-contracts.json covers the keys.
import { afterEach, expect, test, vi } from "vitest";

import { attachCombobox, setActiveOption } from "./combobox-keys";

function mount(optionsHtml: string, open = true) {
    document.body.innerHTML = `<input aria-expanded="false" /><div id="l">${optionsHtml}</div>`;
    const input = document.querySelector("input")!;
    const list = document.getElementById("l")!;
    const state = { open, chosen: [] as string[] };
    const detach = attachCombobox(input, list, {
        open: () => state.open,
        setOpen: (next) => {
            state.open = next;
        },
        choose: (value) => state.chosen.push(value),
    });
    const press = (key: string, init: KeyboardEventInit = {}) => {
        const event = new KeyboardEvent("keydown", {
            key,
            bubbles: true,
            cancelable: true,
            ...init,
        });
        input.dispatchEvent(event);
        return event;
    };
    return { input, list, state, detach, press };
}

const THREE =
    '<div role="option">Apple</div><div role="option" aria-disabled="true">Banana</div><div role="option" data-value="c">Cherry</div>';

afterEach(() => {
    document.body.innerHTML = "";
});

test("a key during IME composition belongs to the IME", () => {
    const { press, input, state } = mount(THREE);
    expect(press("ArrowDown", { isComposing: true }).defaultPrevented).toBe(false);
    expect(input.hasAttribute("aria-activedescendant")).toBe(false);
    press("Escape", { isComposing: true });
    expect(state.open).toBe(true);
});

test("the arrows skip a disabled option and a hidden one", () => {
    const { press, input, list } = mount(THREE);
    list.querySelector<HTMLElement>('[data-value="c"]')!.hidden = true;
    press("ArrowDown");
    press("ArrowDown");
    expect(input.getAttribute("aria-activedescendant")).toBe("l-option-0");
});

test("clicking a disabled option does nothing", () => {
    const { list, state } = mount(THREE);
    list.querySelectorAll<HTMLElement>('[role="option"]')[1].click();
    expect(state.chosen).toEqual([]);
    expect(state.open).toBe(true);
});

test("the value is data-value, else the trimmed text", () => {
    const { list, state } = mount(THREE);
    list.querySelectorAll<HTMLElement>('[role="option"]')[2].click();
    list.querySelectorAll<HTMLElement>('[role="option"]')[0].click();
    expect(state.chosen).toEqual(["c", "Apple"]);
});

test("with no options the arrows leave the caret alone and do not open", () => {
    const { press, state } = mount("", false);
    expect(press("ArrowDown").defaultPrevented).toBe(false);
    expect(press("ArrowDown", { altKey: true }).defaultPrevented).toBe(false);
    expect(state.open).toBe(false);
});

test("Enter with nothing highlighted is left alone, so a form still submits", () => {
    const { press, state } = mount(THREE);
    expect(press("Enter").defaultPrevented).toBe(false);
    expect(state.open).toBe(true);
});

test("Home and End are the caret's while closed", () => {
    const { press } = mount(THREE, false);
    expect(press("Home").defaultPrevented).toBe(false);
    expect(press("End").defaultPrevented).toBe(false);
});

test("blur closes and drops the highlight", () => {
    const { press, input, state } = mount(THREE);
    press("ArrowDown");
    input.dispatchEvent(new FocusEvent("blur"));
    expect(state.open).toBe(false);
    expect(input.hasAttribute("aria-activedescendant")).toBe(false);
});

test("pressing an option keeps focus in the input", () => {
    const { list } = mount(THREE);
    const event = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
    list.firstElementChild!.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
});

test("typing drops the highlight", () => {
    const { press, input } = mount(THREE);
    press("ArrowDown");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(input.hasAttribute("aria-activedescendant")).toBe(false);
});

test("the highlighted option scrolls into view and keeps its own id", () => {
    const { input, list } = mount('<div role="option" id="mine">Apple</div>');
    const option = list.firstElementChild as HTMLElement;
    option.scrollIntoView = vi.fn();
    setActiveOption(input, list, option);
    expect(option.scrollIntoView).toHaveBeenCalledWith({ block: "nearest" });
    expect(input.getAttribute("aria-activedescendant")).toBe("mine");
    expect(option.hasAttribute("data-active")).toBe(true);
    setActiveOption(input, list, null);
    expect(option.hasAttribute("data-active")).toBe(false);
    expect(option.getAttribute("aria-selected")).toBe("false");
});

test("the cleanup removes every listener", () => {
    const { press, detach, input, state } = mount(THREE, false);
    detach();
    press("ArrowDown");
    input.dispatchEvent(new Event("input", { bubbles: true }));
    expect(state.open).toBe(false);
});
