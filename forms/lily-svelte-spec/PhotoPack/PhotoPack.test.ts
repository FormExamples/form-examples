import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./PhotoPack.svelte";

function snippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}

describe("PhotoPack", () => {
    test("renders a div with class photo-pack", () => {
        const { container } = render(Subject, { label: "x", children: snippet("content") });
        const root = container.querySelector(".photo-pack");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders children content", () => {
        const { container } = render(Subject, { label: "x", children: snippet("content") });
        expect(container.textContent).toContain("content");
    });

    test("applies role=group", () => {
        const { container } = render(Subject, { label: "x", children: snippet("content") });
        const root = container.querySelector(".photo-pack");
        expect(root?.getAttribute("role")).toBe("group");
    });

    test("applies aria-label from label prop", () => {
        const { container } = render(Subject, { label: "Hello", children: snippet("x") });
        const root = container.querySelector(".photo-pack");
        expect(root?.getAttribute("aria-label")).toBe("Hello");
    });
});
