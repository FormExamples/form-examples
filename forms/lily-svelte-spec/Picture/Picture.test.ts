import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import Picture from "./Picture.svelte";

const parts = () =>
    createRawSnippet(() => ({
        render: () =>
            `<span><source srcset="wide.webp" media="(min-width: 800px)" type="image/webp"><img src="small.jpg" alt="A lily" width="320" height="200"></span>`,
    }));

describe("Picture", () => {
    it("renders a <picture> with the base class", () => {
        const { container } = render(Picture, { props: { children: parts() } });
        expect(container.querySelector("picture.picture")).toBeTruthy();
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(Picture, { props: { class: "mine", children: parts() } });
        expect(container.querySelector(".picture")!.getAttribute("class")).toBe("picture mine");
    });

    it("renders the source and img children, keeping the consumer's alt", () => {
        const { container } = render(Picture, { props: { children: parts() } });
        expect(container.querySelector("picture source")!.getAttribute("media")).toBe(
            "(min-width: 800px)",
        );
        expect(container.querySelector("picture img")!.getAttribute("alt")).toBe("A lily");
    });

    it("adds no text of its own", () => {
        const { container } = render(Picture, { props: {} });
        expect(container.querySelector(".picture")!.textContent).toBe("");
    });

    it("spreads rest props onto the root", () => {
        const { container } = render(Picture, { props: { id: "x1", children: parts() } });
        expect(container.querySelector(".picture")!.id).toBe("x1");
    });
});
