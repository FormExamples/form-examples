import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import ToolCallName from "./ToolCallName.svelte";

const txt = () =>
    createRawSnippet(() => ({ render: () => `<span data-testid="txt">Hello</span>` }));

describe("ToolCallName", () => {
    it("renders a <span> with the base class", () => {
        const { container } = render(ToolCallName, { props: { children: txt() } });
        expect(container.querySelector("span.tool-call-name")).toBeTruthy();
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(ToolCallName, { props: { class: "mine", children: txt() } });
        expect(container.querySelector(".tool-call-name")!.getAttribute("class")).toBe(
            "tool-call-name mine",
        );
    });

    it("renders the children", () => {
        render(ToolCallName, { props: { children: txt() } });
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });

    it("spreads rest props onto the root", () => {
        const { container } = render(ToolCallName, { props: { id: "x1", children: txt() } });
        expect(container.querySelector(".tool-call-name")!.id).toBe("x1");
    });
});
