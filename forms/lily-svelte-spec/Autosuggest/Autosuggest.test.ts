import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/svelte";

import Autosuggest from "./Autosuggest.svelte";

const fruit = [
    { value: "apple", label: "Apple" },
    { value: "apricot", label: "Apricot" },
    { value: "avocado", label: "Avocado" },
];

function setup(props: Record<string, unknown> = {}) {
    const result = render(Autosuggest, { props: { label: "Fruit", suggestions: fruit, ...props } });
    const input = screen.getByRole("combobox") as HTMLInputElement;
    const list = result.container.querySelector('[role="listbox"]') as HTMLElement;
    const options = () =>
        Array.from(result.container.querySelectorAll('[role="option"]')) as HTMLElement[];
    return { ...result, input, list, options };
}

async function type(input: HTMLInputElement, text: string) {
    input.focus();
    input.value = text;
    await fireEvent.input(input);
}

describe("Autosuggest", () => {
    test("renders a div root with an input combobox and a hidden listbox", () => {
        const { container, input, list } = setup({ class: "extra" });
        const root = container.querySelector("div.autosuggest") as HTMLElement;
        expect(root.classList.contains("extra")).toBe(true);
        expect(input.getAttribute("aria-label")).toBe("Fruit");
        expect(input.getAttribute("aria-autocomplete")).toBe("list");
        expect(input.getAttribute("aria-expanded")).toBe("false");
        expect(input.getAttribute("aria-controls")).toBe(list.id);
        expect(list.hidden).toBe(true);
    });

    test("typing reports the query and opens the list", async () => {
        const onInput = vi.fn();
        const { input, list } = setup({ onInput });
        await type(input, "ap");
        expect(onInput).toHaveBeenCalledWith("ap");
        expect(input.getAttribute("aria-expanded")).toBe("true");
        expect(list.hidden).toBe(false);
    });

    test("the list stays closed while there are no suggestions", async () => {
        const { input } = setup({ suggestions: [] });
        await type(input, "zz");
        expect(input.getAttribute("aria-expanded")).toBe("false");
    });

    test("ArrowDown and ArrowUp move the highlight, wrapping, via aria-activedescendant", async () => {
        const { input, options } = setup();
        await fireEvent.keyDown(input, { key: "ArrowDown" });
        expect(input.getAttribute("aria-expanded")).toBe("true");
        expect(input.getAttribute("aria-activedescendant")).toBe(options()[0].id);
        expect(options()[0].getAttribute("aria-selected")).toBe("true");
        await fireEvent.keyDown(input, { key: "ArrowDown" });
        expect(input.getAttribute("aria-activedescendant")).toBe(options()[1].id);
        await fireEvent.keyDown(input, { key: "ArrowUp" });
        await fireEvent.keyDown(input, { key: "ArrowUp" });
        expect(input.getAttribute("aria-activedescendant")).toBe(options()[2].id);
        await fireEvent.keyDown(input, { key: "ArrowDown" });
        expect(input.getAttribute("aria-activedescendant")).toBe(options()[0].id);
    });

    test("Home and End jump to the first and last option", async () => {
        const { input, options } = setup();
        await fireEvent.keyDown(input, { key: "ArrowDown" });
        await fireEvent.keyDown(input, { key: "End" });
        expect(input.getAttribute("aria-activedescendant")).toBe(options()[2].id);
        await fireEvent.keyDown(input, { key: "Home" });
        expect(input.getAttribute("aria-activedescendant")).toBe(options()[0].id);
    });

    test("Enter chooses the highlighted option, fills the input and closes", async () => {
        const onSelect = vi.fn();
        const { input } = setup({ onSelect });
        await fireEvent.keyDown(input, { key: "ArrowDown" });
        await fireEvent.keyDown(input, { key: "ArrowDown" });
        await fireEvent.keyDown(input, { key: "Enter" });
        expect(onSelect).toHaveBeenCalledWith("apricot");
        expect(input.value).toBe("apricot");
        expect(input.getAttribute("aria-expanded")).toBe("false");
        expect(input.hasAttribute("aria-activedescendant")).toBe(false);
    });

    test("Escape closes without choosing", async () => {
        const onSelect = vi.fn();
        const { input } = setup({ onSelect, value: "ap" });
        await fireEvent.keyDown(input, { key: "ArrowDown" });
        await fireEvent.keyDown(input, { key: "Escape" });
        expect(input.getAttribute("aria-expanded")).toBe("false");
        expect(onSelect).not.toHaveBeenCalled();
        expect(input.value).toBe("ap");
    });

    test("pressing an option keeps focus in the input (mousedown is cancelled)", async () => {
        const { input, options } = setup();
        await type(input, "a");
        const event = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
        options()[0].dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
    });

    test("clicking an option chooses it; blur closes the list", async () => {
        const onSelect = vi.fn();
        const { input, options } = setup({ onSelect });
        await type(input, "a");
        await fireEvent.click(options()[2]);
        expect(onSelect).toHaveBeenCalledWith("avocado");
        await type(input, "a");
        await fireEvent.blur(input);
        expect(input.getAttribute("aria-expanded")).toBe("false");
    });

    test("a form reset restores the starting text and closes the list", async () => {
        const form = document.createElement("form");
        document.body.appendChild(form);
        const { container } = render(Autosuggest, {
            target: form,
            props: { label: "Fruit", suggestions: fruit, value: "init" },
        });
        const input = container.querySelector("input") as HTMLInputElement;
        await type(input, "chg");
        form.reset();
        await new Promise((resolve) => setTimeout(resolve, 0));
        expect(input.value).toBe("init");
        await fireEvent.keyDown(input, { key: "Escape" });
        form.remove();
    });
});
