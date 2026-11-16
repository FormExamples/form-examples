import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import ToolCallInput from "./ToolCallInput.svelte";

const txt = () =>
    createRawSnippet(() => ({ render: () => `<span data-testid="txt">Hello</span>` }));

describe("ToolCallInput", () => {
    it("renders a <div> with the base class", () => {
        const { container } = render(ToolCallInput, { props: { children: txt() } });
        expect(container.querySelector("div.tool-call-input")).toBeTruthy();
    });

    it("with a label it is a named group; without one it has neither role nor aria-label", () => {
        const a = render(ToolCallInput, { props: { label: "Input", children: txt() } });
        const g = screen.getByRole("group", { name: "Input" });
        expect(g.getAttribute("aria-label")).toBe("Input");
        a.unmount();
        const { container } = render(ToolCallInput, { props: { children: txt() } });
        const el = container.querySelector(".tool-call-input")!;
        expect(el.hasAttribute("role")).toBe(false);
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(ToolCallInput, { props: { class: "mine", children: txt() } });
        expect(container.querySelector(".tool-call-input")!.getAttribute("class")).toBe(
            "tool-call-input mine",
        );
    });

    it("renders the children", () => {
        render(ToolCallInput, { props: { children: txt() } });
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });

    it("spreads rest props onto the root", () => {
        const { container } = render(ToolCallInput, { props: { id: "x1", children: txt() } });
        expect(container.querySelector(".tool-call-input")!.id).toBe("x1");
    });
});
