import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./ContentBlock.svelte";

function snippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}

describe("ContentBlock", () => {
    test("renders a div with class content-block", () => {
        const { container } = render(Subject, { children: snippet("content") });
        const root = container.querySelector(".content-block");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders children content", () => {
        const { container } = render(Subject, { children: snippet("content") });
        expect(container.textContent).toContain("content");
    });

    test("data-width defaults to normal", () => {
        const { container } = render(Subject, { children: snippet("content") });
        const root = container.querySelector(".content-block");
        expect(root?.getAttribute("data-width")).toBe("normal");
    });

    test("data-width reflects the width prop", () => {
        const { container } = render(Subject, { width: "wide", children: snippet("x") });
        const root = container.querySelector(".content-block");
        expect(root?.getAttribute("data-width")).toBe("wide");
    });
});
