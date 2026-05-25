import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Headline.svelte";

function snippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}

describe("Headline", () => {
    test("renders a div with class headline", () => {
        const { container } = render(Subject, { children: snippet("Title") });
        const root = container.querySelector(".headline");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders h1 by default", () => {
        const { container } = render(Subject, { children: snippet("Title") });
        const h = container.querySelector(".headline-heading");
        expect(h?.tagName).toBe("H1");
        expect(h?.textContent).toBe("Title");
    });

    test("respects the level prop", () => {
        const { container } = render(Subject, { level: 3, children: snippet("Title") });
        expect(container.querySelector(".headline-heading")?.tagName).toBe("H3");
    });

    test("renders subtitle when provided", () => {
        const { container } = render(Subject, {
            children: snippet("Title"),
            subtitle: snippet("The dek"),
        });
        expect(container.querySelector(".headline-subtitle")?.textContent).toBe("The dek");
    });

    test("renders byline when provided", () => {
        const { container } = render(Subject, {
            children: snippet("Title"),
            byline: snippet("By Jane"),
        });
        expect(container.querySelector(".headline-byline")?.textContent).toBe("By Jane");
    });
});
