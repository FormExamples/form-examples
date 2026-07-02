import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./ArticleLayout.svelte";

function snippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}

describe("ArticleLayout", () => {
    test("renders a article with class article-layout", () => {
        const { container } = render(Subject, { children: snippet("content") });
        const root = container.querySelector(".article-layout");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("ARTICLE");
    });

    test("renders children content", () => {
        const { container } = render(Subject, { children: snippet("content") });
        expect(container.textContent).toContain("content");
    });
});
