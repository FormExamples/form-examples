import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import ConvertFromDiv from "./ConvertFromDiv.svelte";

const txt = () =>
    createRawSnippet(() => ({ render: () => `<span data-testid="txt">Hello</span>` }));

describe("ConvertFromDiv", () => {
    it("renders a <div> with the base class", () => {
        const { container } = render(ConvertFromDiv, { props: { children: txt() } });
        expect(container.querySelector("div.convert-from-div")).toBeTruthy();
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(ConvertFromDiv, { props: { class: "mine", children: txt() } });
        expect(container.querySelector(".convert-from-div")!.getAttribute("class")).toBe(
            "convert-from-div mine",
        );
    });

    it("renders the children", () => {
        render(ConvertFromDiv, { props: { children: txt() } });
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });

    it("spreads rest props onto the root", () => {
        const { container } = render(ConvertFromDiv, { props: { id: "x1", children: txt() } });
        expect(container.querySelector(".convert-from-div")!.id).toBe("x1");
    });

    it("has no role and no accessible name of its own", () => {
        const { container } = render(ConvertFromDiv, { props: { children: txt() } });
        const root = container.querySelector(".convert-from-div")!;
        expect(root.getAttribute("role")).toBeNull();
        expect(root.getAttribute("aria-label")).toBeNull();
    });
});
