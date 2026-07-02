import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Byline.svelte";

function snippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}

function htmlSnippet(html: string) {
    return (($anchor: Comment) => {
        const tpl = document.createElement("template");
        tpl.innerHTML = html;
        for (const node of Array.from(tpl.content.childNodes)) $anchor.before(node);
    }) as any;
}

describe("Byline", () => {
    test("renders a div with class byline", () => {
        const { container } = render(Subject, { children: snippet("Jane") });
        const root = container.querySelector(".byline");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders the authors slot", () => {
        const { container } = render(Subject, { children: snippet("Jane Smith") });
        expect(container.querySelector(".byline-authors")?.textContent).toBe("Jane Smith");
    });

    test("renders the published snippet when provided", () => {
        const { container } = render(Subject, {
            children: snippet("Jane"),
            published: htmlSnippet('<time datetime="2026-04-15">April 15</time>'),
        });
        const t = container.querySelector(".byline-published time");
        expect(t?.getAttribute("datetime")).toBe("2026-04-15");
    });

    test("omits published when not provided", () => {
        const { container } = render(Subject, { children: snippet("Jane") });
        expect(container.querySelector(".byline-published")).toBeNull();
    });
});
