import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import ConvertIntoDiv from "./ConvertIntoDiv.svelte";

const txt = () =>
    createRawSnippet(() => ({ render: () => `<span data-testid="txt">Hello</span>` }));

describe("ConvertIntoDiv", () => {
    it("renders a <div> with the base class", () => {
        const { container } = render(ConvertIntoDiv, { props: { children: txt() } });
        expect(container.querySelector("div.convert-into-div")).toBeTruthy();
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(ConvertIntoDiv, { props: { class: "mine", children: txt() } });
        expect(container.querySelector(".convert-into-div")!.getAttribute("class")).toBe(
            "convert-into-div mine",
        );
    });

    it("renders the children", () => {
        render(ConvertIntoDiv, { props: { children: txt() } });
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });

    it("spreads rest props onto the root", () => {
        const { container } = render(ConvertIntoDiv, { props: { id: "x1", children: txt() } });
        expect(container.querySelector(".convert-into-div")!.id).toBe("x1");
    });

    it("has no role and no accessible name of its own", () => {
        const { container } = render(ConvertIntoDiv, { props: { children: txt() } });
        const root = container.querySelector(".convert-into-div")!;
        expect(root.getAttribute("role")).toBeNull();
        expect(root.getAttribute("aria-label")).toBeNull();
    });
});
