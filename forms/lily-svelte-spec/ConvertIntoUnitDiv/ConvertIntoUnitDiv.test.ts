import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import ConvertIntoUnitDiv from "./ConvertIntoUnitDiv.svelte";

const txt = () =>
    createRawSnippet(() => ({ render: () => `<span data-testid="txt">Hello</span>` }));

describe("ConvertIntoUnitDiv", () => {
    it("renders a <div> with the base class", () => {
        const { container } = render(ConvertIntoUnitDiv, { props: { children: txt() } });
        expect(container.querySelector("div.convert-into-unit-div")).toBeTruthy();
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(ConvertIntoUnitDiv, {
            props: { class: "mine", children: txt() },
        });
        expect(container.querySelector(".convert-into-unit-div")!.getAttribute("class")).toBe(
            "convert-into-unit-div mine",
        );
    });

    it("renders the children", () => {
        render(ConvertIntoUnitDiv, { props: { children: txt() } });
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });

    it("spreads rest props onto the root", () => {
        const { container } = render(ConvertIntoUnitDiv, { props: { id: "x1", children: txt() } });
        expect(container.querySelector(".convert-into-unit-div")!.id).toBe("x1");
    });

    it("has no role and no accessible name of its own", () => {
        const { container } = render(ConvertIntoUnitDiv, { props: { children: txt() } });
        const root = container.querySelector(".convert-into-unit-div")!;
        expect(root.getAttribute("role")).toBeNull();
        expect(root.getAttribute("aria-label")).toBeNull();
    });
});
