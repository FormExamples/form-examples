import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import WarningText from "./WarningText.svelte";

const text = () =>
    createRawSnippet(() => ({
        render: () =>
            `<span><span class="screen-reader-span">Warning</span> You can be fined if you do not register.</span>`,
    }));
const icon = () => createRawSnippet(() => ({ render: () => `<span>!</span>` }));

describe("WarningText", () => {
    it("renders a <div> with the base class", () => {
        const { container } = render(WarningText, { props: { children: text() } });
        expect(container.querySelector("div.warning-text")).toBeTruthy();
    });

    it("appends the consumer class after the base class", () => {
        const { container } = render(WarningText, { props: { class: "mine", children: text() } });
        expect(container.querySelector(".warning-text")!.getAttribute("class")).toBe(
            "warning-text mine",
        );
    });

    it("renders the children, hidden prefix included, inside strong.warning-text-text", () => {
        const { container } = render(WarningText, { props: { children: text() } });
        const strong = container.querySelector(".warning-text > strong.warning-text-text")!;
        expect(strong.querySelector(".screen-reader-span")!.textContent).toBe("Warning");
        expect(strong.textContent).toContain("You can be fined");
    });

    it("renders a supplied icon first, inside an aria-hidden wrapper", () => {
        const { container } = render(WarningText, { props: { icon: icon(), children: text() } });
        const wrap = container.querySelector(".warning-text > .warning-text-icon")!;
        expect(wrap.getAttribute("aria-hidden")).toBe("true");
        expect(wrap.textContent).toBe("!");
        expect(container.querySelector(".warning-text")!.firstElementChild).toBe(wrap);
    });

    it("renders no icon wrapper when no icon is supplied", () => {
        const { container } = render(WarningText, { props: { children: text() } });
        expect(container.querySelector(".warning-text-icon")).toBeNull();
    });

    it("adds no role and no text of its own", () => {
        const empty = createRawSnippet(() => ({ render: () => `<span></span>` }));
        const { container } = render(WarningText, { props: { children: empty } });
        const root = container.querySelector(".warning-text")!;
        expect(root.getAttribute("role")).toBeNull();
        expect(root.textContent!.trim()).toBe("");
    });

    it("spreads rest props onto the root", () => {
        const { container } = render(WarningText, { props: { id: "x1", children: text() } });
        expect(container.querySelector(".warning-text")!.id).toBe("x1");
    });
});
