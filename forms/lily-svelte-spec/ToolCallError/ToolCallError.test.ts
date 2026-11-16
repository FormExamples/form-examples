import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import ToolCallError from "./ToolCallError.svelte";

const txt = () =>
    createRawSnippet(() => ({ render: () => `<span data-testid="txt">Hello</span>` }));

describe("ToolCallError", () => {
    it("renders a <div> with the base class", () => {
        const { container } = render(ToolCallError, { props: { children: txt() } });
        expect(container.querySelector("div.tool-call-error")).toBeTruthy();
    });

    it("is an alert region", () => {
        render(ToolCallError, { props: { children: txt() } });
        expect(screen.getByRole("alert")).toBeTruthy();
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(ToolCallError, { props: { class: "mine", children: txt() } });
        expect(container.querySelector(".tool-call-error")!.getAttribute("class")).toBe(
            "tool-call-error mine",
        );
    });

    it("renders the children", () => {
        render(ToolCallError, { props: { children: txt() } });
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });

    it("spreads rest props onto the root", () => {
        const { container } = render(ToolCallError, { props: { id: "x1", children: txt() } });
        expect(container.querySelector(".tool-call-error")!.id).toBe("x1");
    });
});
