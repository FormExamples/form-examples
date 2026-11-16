import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import ConvertFromUnitDiv from "./ConvertFromUnitDiv.svelte";

const txt = () =>
    createRawSnippet(() => ({ render: () => `<span data-testid="txt">Hello</span>` }));

describe("ConvertFromUnitDiv", () => {
    it("renders a <div> with the base class", () => {
        const { container } = render(ConvertFromUnitDiv, { props: { children: txt() } });
        expect(container.querySelector("div.convert-from-unit-div")).toBeTruthy();
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(ConvertFromUnitDiv, {
            props: { class: "mine", children: txt() },
        });
        expect(container.querySelector(".convert-from-unit-div")!.getAttribute("class")).toBe(
            "convert-from-unit-div mine",
        );
    });

    it("renders the children", () => {
        render(ConvertFromUnitDiv, { props: { children: txt() } });
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });

    it("spreads rest props onto the root", () => {
        const { container } = render(ConvertFromUnitDiv, { props: { id: "x1", children: txt() } });
        expect(container.querySelector(".convert-from-unit-div")!.id).toBe("x1");
    });

    it("has no role and no accessible name of its own", () => {
        const { container } = render(ConvertFromUnitDiv, { props: { children: txt() } });
        const root = container.querySelector(".convert-from-unit-div")!;
        expect(root.getAttribute("role")).toBeNull();
        expect(root.getAttribute("aria-label")).toBeNull();
    });
});
