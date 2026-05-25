import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./BodyText.svelte";

function snippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}

describe("BodyText", () => {
    test("renders a div with class body-text", () => {
        const { container } = render(Subject, { children: snippet("content") });
        const root = container.querySelector(".body-text");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders children content", () => {
        const { container } = render(Subject, { children: snippet("content") });
        expect(container.textContent).toContain("content");
    });
});
