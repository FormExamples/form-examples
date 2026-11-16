import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import ToolCall from "./ToolCall.svelte";

const snip = (html: string) => createRawSnippet(() => ({ render: () => html }));
const base = (extra: Record<string, unknown> = {}) => ({
    props: {
        summary: snip(`<span data-testid="sum">search_web</span>`),
        children: snip(`<span data-testid="body">Body</span>`),
        ...extra,
    },
});

describe("ToolCall", () => {
    it("renders a <details> with the base class, closed by default", () => {
        const { container } = render(ToolCall, base());
        const el = container.querySelector("details.tool-call") as HTMLDetailsElement;
        expect(el).toBeTruthy();
        expect(el.open).toBe(false);
    });

    it("puts the summary content in <summary class=tool-call-summary>", () => {
        const { container } = render(ToolCall, base());
        expect(container.querySelector("summary.tool-call-summary [data-testid=sum]")).toBeTruthy();
    });

    it("puts the body in <div class=tool-call-content>", () => {
        const { container } = render(ToolCall, base());
        expect(container.querySelector("div.tool-call-content [data-testid=body]")).toBeTruthy();
    });

    it("reflects open", () => {
        const { container } = render(ToolCall, base({ open: true }));
        expect((container.querySelector("details") as HTMLDetailsElement).open).toBe(true);
    });

    it("sets data-status from status, and omits it without one", () => {
        const a = render(ToolCall, base({ status: "done" }));
        expect(a.container.querySelector("details")!.getAttribute("data-status")).toBe("done");
        a.unmount();
        const b = render(ToolCall, base());
        expect(b.container.querySelector("details")!.hasAttribute("data-status")).toBe(false);
    });

    it("is busy only while running", () => {
        const a = render(ToolCall, base({ status: "running" }));
        expect(a.container.querySelector("details")!.getAttribute("aria-busy")).toBe("true");
        a.unmount();
        for (const s of ["pending", "done", "error"]) {
            const b = render(ToolCall, base({ status: s }));
            expect(b.container.querySelector("details")!.hasAttribute("aria-busy")).toBe(false);
            b.unmount();
        }
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(ToolCall, base({ class: "mine" }));
        expect(container.querySelector("details")!.getAttribute("class")).toBe("tool-call mine");
    });

    it("spreads rest props onto the root", () => {
        const { container } = render(ToolCall, base({ id: "t1" }));
        expect(container.querySelector("details")!.id).toBe("t1");
    });
});
