import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import ConvertFromValueDiv from "./ConvertFromValueDiv.svelte";

const txt = () =>
    createRawSnippet(() => ({ render: () => `<span data-testid="txt">Hello</span>` }));

describe("ConvertFromValueDiv", () => {
    it("renders a <div> with the base class", () => {
        const { container } = render(ConvertFromValueDiv, { props: { children: txt() } });
        expect(container.querySelector("div.convert-from-value-div")).toBeTruthy();
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(ConvertFromValueDiv, {
            props: { class: "mine", children: txt() },
        });
        expect(container.querySelector(".convert-from-value-div")!.getAttribute("class")).toBe(
            "convert-from-value-div mine",
        );
    });

    it("renders the children", () => {
        render(ConvertFromValueDiv, { props: { children: txt() } });
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });

    it("spreads rest props onto the root", () => {
        const { container } = render(ConvertFromValueDiv, { props: { id: "x1", children: txt() } });
        expect(container.querySelector(".convert-from-value-div")!.id).toBe("x1");
    });

    it("has no role and no accessible name of its own", () => {
        const { container } = render(ConvertFromValueDiv, { props: { children: txt() } });
        const root = container.querySelector(".convert-from-value-div")!;
        expect(root.getAttribute("role")).toBeNull();
        expect(root.getAttribute("aria-label")).toBeNull();
    });
});
