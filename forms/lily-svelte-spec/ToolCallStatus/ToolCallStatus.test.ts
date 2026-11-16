import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import ToolCallStatus from "./ToolCallStatus.svelte";

const txt = () =>
    createRawSnippet(() => ({ render: () => `<span data-testid="txt">Hello</span>` }));

describe("ToolCallStatus", () => {
    it("renders a <span> with the base class", () => {
        const { container } = render(ToolCallStatus, { props: { children: txt() } });
        expect(container.querySelector("span.tool-call-status")).toBeTruthy();
    });

    it("sets data-status from status, and omits it without one", () => {
        const a = render(ToolCallStatus, { props: { status: "running", children: txt() } });
        expect(a.container.querySelector(".tool-call-status")!.getAttribute("data-status")).toBe(
            "running",
        );
        a.unmount();
        const b = render(ToolCallStatus, { props: { children: txt() } });
        expect(b.container.querySelector(".tool-call-status")!.hasAttribute("data-status")).toBe(
            false,
        );
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(ToolCallStatus, { props: { class: "mine", children: txt() } });
        expect(container.querySelector(".tool-call-status")!.getAttribute("class")).toBe(
            "tool-call-status mine",
        );
    });

    it("renders the children", () => {
        render(ToolCallStatus, { props: { children: txt() } });
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });

    it("spreads rest props onto the root", () => {
        const { container } = render(ToolCallStatus, { props: { id: "x1", children: txt() } });
        expect(container.querySelector(".tool-call-status")!.id).toBe("x1");
    });
});
