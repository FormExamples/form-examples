import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import ConvertDiv from "./ConvertDiv.svelte";

const txt = () =>
    createRawSnippet(() => ({ render: () => `<span data-testid="txt">Hello</span>` }));

describe("ConvertDiv", () => {
    it("renders a <div> with the base class", () => {
        const { container } = render(ConvertDiv, {
            props: { label: "Currency converter", children: txt() },
        });
        expect(container.querySelector("div.convert-div")).toBeTruthy();
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(ConvertDiv, {
            props: { class: "mine", label: "Currency converter", children: txt() },
        });
        expect(container.querySelector(".convert-div")!.getAttribute("class")).toBe(
            "convert-div mine",
        );
    });

    it("renders the children", () => {
        render(ConvertDiv, { props: { label: "Currency converter", children: txt() } });
        expect(screen.getByTestId("txt").textContent).toBe("Hello");
    });

    it("spreads rest props onto the root", () => {
        const { container } = render(ConvertDiv, {
            props: { id: "x1", label: "Currency converter", children: txt() },
        });
        expect(container.querySelector(".convert-div")!.id).toBe("x1");
    });

    it("is a named group", () => {
        render(ConvertDiv, { props: { label: "Currency converter", children: txt() } });
        expect(screen.getByRole("group", { name: "Currency converter" })).toBeTruthy();
    });
});
