import { fireEvent, render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { describe, expect, test, vi } from "vitest";

import Subject from "./TagInputDiv.svelte";

const field = (label: string) => screen.getByRole("textbox", { name: label }) as HTMLInputElement;

describe("TagInputDiv", () => {
    test("the root is a named group with the base class", () => {
        render(Subject, { props: { label: "Add tag", class: "extra" } });
        const root = screen.getByRole("group", { name: "Add tag" });
        expect(root.tagName).toBe("DIV");
        expect(root.classList.contains("tag-input-div")).toBe(true);
        expect(root.classList.contains("extra")).toBe(true);
    });

    test("holds a named text field", () => {
        render(Subject, { props: { label: "New tag" } });
        expect(field("New tag").type).toBe("text");
        expect(field("New tag").classList.contains("tag-input-div-field")).toBe(true);
    });

    test("the field takes disabled, placeholder, name and required", () => {
        render(Subject, {
            props: { label: "T", disabled: true, placeholder: "P", name: "n", required: true },
        });
        const input = field("T");
        expect(input.disabled).toBe(true);
        expect(input.placeholder).toBe("P");
        expect(input.name).toBe("n");
        expect(input.required).toBe(true);
    });

    test("passes other attributes to the root", () => {
        render(Subject, { props: { label: "T", "data-testid": "ti" } });
        expect(screen.getByTestId("ti").tagName).toBe("DIV");
    });

    test("renders the consumer's tags before the field", () => {
        const children = createRawSnippet(() => ({
            render: () => `<span data-testid="tag">one</span>`,
        }));
        render(Subject, { props: { label: "T", children } });
        expect(screen.getByTestId("tag").nextElementSibling).toBe(field("T"));
    });

    test("Enter adds the trimmed text and clears the field", async () => {
        const onadd = vi.fn();
        render(Subject, { props: { label: "T", value: "  one  ", onadd } });
        await fireEvent.keyDown(field("T"), { key: "Enter" });
        expect(onadd).toHaveBeenCalledWith("one");
        expect(field("T").value).toBe("");
    });

    test("Enter on blank text adds nothing and stays a normal Enter", async () => {
        const onadd = vi.fn();
        render(Subject, { props: { label: "T", value: "   ", onadd } });
        const notPrevented = await fireEvent.keyDown(field("T"), { key: "Enter" });
        expect(onadd).not.toHaveBeenCalled();
        expect(notPrevented).toBe(true);
    });

    test("Enter during an IME composition adds nothing", async () => {
        const onadd = vi.fn();
        render(Subject, { props: { label: "T", value: "one", onadd } });
        await fireEvent.keyDown(field("T"), { key: "Enter", isComposing: true });
        expect(onadd).not.toHaveBeenCalled();
        expect(field("T").value).toBe("one");
    });
});
