import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import ToolCallOutput from "./ToolCallOutput.svelte";

const txt = () =>
    createRawSnippet(() => ({ render: () => `<span data-testid="txt">Hello</span>` }));

describe("ToolCallOutput", () => {
    it("renders a <div> with the base class", () => {
        const { container } = render(ToolCallOutput, { props: { children: txt() } });
        expect(container.querySelector("div.tool-call-output")).toBeTruthy();
    });

    it("with a label it is a named group; without one it has neither role nor aria-label", () => {
        const a = render(ToolCallOutput, { props: { label: "Input", children: txt() } });
        const g = screen.getByRole("group", { name: "Input" });
        expect(g.getAttribute("aria-label")).toBe("Input");
        a.unmount();
        const { container } = render(ToolCallOutput, { props: { children: txt() } });
        const el = container.querySelector(".tool-call-output")!;
        expect(el.hasAttribute("role")).toBe(false);
        expect(el.hasAttribute("aria-label")).toBe(false);
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(ToolCallOutput, { props: { class: "mine", children: txt() } });
        expect(container.querySelector(".tool-call-output")!.getAttribute("class")).toBe(
            "tool-call-output mine",
        );
    });

    it("renders the children", () => {
        render(ToolCallOutput, { props: { children: txt() } });
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });

    it("spreads rest props onto the root", () => {
        const { container } = render(ToolCallOutput, { props: { id: "x1", children: txt() } });
        expect(container.querySelector(".tool-call-output")!.id).toBe("x1");
    });
});
