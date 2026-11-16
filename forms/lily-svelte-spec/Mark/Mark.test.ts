import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import Mark from "./Mark.svelte";

const txt = () =>
    createRawSnippet(() => ({ render: () => `<span data-testid="txt">Hello</span>` }));

describe("Mark", () => {
    it("renders a <mark> with the base class", () => {
        const { container } = render(Mark, { props: { children: txt() } });
        expect(container.querySelector("mark.mark")).toBeTruthy();
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(Mark, { props: { class: "mine", children: txt() } });
        expect(container.querySelector(".mark")!.getAttribute("class")).toBe("mark mine");
    });

    it("renders the children", () => {
        render(Mark, { props: { children: txt() } });
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });

    it("spreads rest props onto the root", () => {
        const { container } = render(Mark, { props: { id: "x1", children: txt() } });
        expect(container.querySelector(".mark")!.id).toBe("x1");
    });
});
