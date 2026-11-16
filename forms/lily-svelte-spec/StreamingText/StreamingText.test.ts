import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import StreamingText from "./StreamingText.svelte";

const text = (t: string) =>
    createRawSnippet(() => ({ render: () => `<span data-testid="txt">${t}</span>` }));

describe("StreamingText", () => {
    it("renders a <div> with the base class", () => {
        const { container } = render(StreamingText, { props: { children: text("Hello") } });
        expect(container.querySelector("div.streaming-text")).toBeTruthy();
    });

    it("is a polite, atomic status region", () => {
        render(StreamingText, { props: { children: text("Hello") } });
        const el = screen.getByRole("status");
        expect(el.getAttribute("aria-live")).toBe("polite");
        expect(el.getAttribute("aria-atomic")).toBe("true");
    });

    it("is not busy by default", () => {
        render(StreamingText, { props: { children: text("Hello") } });
        const el = screen.getByRole("status");
        expect(el.hasAttribute("aria-busy")).toBe(false);
        expect(el.hasAttribute("data-streaming")).toBe(false);
    });

    it("marks the region busy while streaming", () => {
        render(StreamingText, { props: { streaming: true, children: text("Hel") } });
        const el = screen.getByRole("status");
        expect(el.getAttribute("aria-busy")).toBe("true");
        expect(el.getAttribute("data-streaming")).toBe("true");
    });

    it("clears busy when streaming becomes false", async () => {
        const { rerender } = render(StreamingText, {
            props: { streaming: true, children: text("Hel") },
        });
        await rerender({ streaming: false });
        const el = screen.getByRole("status");
        expect(el.hasAttribute("aria-busy")).toBe(false);
        expect(el.hasAttribute("data-streaming")).toBe(false);
    });

    it("sets aria-label from label, and omits it without one", () => {
        const a = render(StreamingText, { props: { label: "Answer", children: text("x") } });
        expect(screen.getByRole("status").getAttribute("aria-label")).toBe("Answer");
        a.unmount();
        render(StreamingText, { props: { children: text("x") } });
        expect(screen.getByRole("status").hasAttribute("aria-label")).toBe(false);
    });

    it("appends the consumer class after the base class", () => {
        render(StreamingText, { props: { class: "mine", children: text("x") } });
        expect(screen.getByRole("status").getAttribute("class")).toBe("streaming-text mine");
    });

    it("renders the children", () => {
        render(StreamingText, { props: { children: text("Hello") } });
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });

    it("spreads rest props onto the root", () => {
        render(StreamingText, { props: { id: "s1", "data-testid": "root", children: text("x") } });
        expect(screen.getByTestId("root").id).toBe("s1");
    });
});
