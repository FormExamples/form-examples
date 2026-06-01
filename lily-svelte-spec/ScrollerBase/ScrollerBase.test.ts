import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ScrollerBase.svelte";

function snippet(html: string) {
    return (($anchor: Comment) => {
        const tpl = document.createElement("template");
        tpl.innerHTML = html;
        for (const node of Array.from(tpl.content.childNodes)) $anchor.before(node);
    }) as any;
}

describe("ScrollerBase", () => {
    test("renders a div with class scroller-base", () => {
        const { container } = render(Subject, { children: snippet("<div>step</div>") });
        const root = container.querySelector(".scroller-base");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("applies aria-label when provided", () => {
        const { container } = render(Subject, {
            label: "My story",
            children: snippet("<div>1</div>"),
        });
        expect(container.querySelector(".scroller-base")?.getAttribute("aria-label")).toBe("My story");
    });

    test("does not set aria-label when omitted", () => {
        const { container } = render(Subject, { children: snippet("<div>1</div>") });
        expect(container.querySelector(".scroller-base")?.getAttribute("aria-label")).toBeNull();
    });

    test("renders all step children", () => {
        const { container } = render(Subject, {
            children: snippet("<div>one</div><div>two</div><div>three</div>"),
        });
        const root = container.querySelector(".scroller-base") as HTMLElement;
        expect(root.children.length).toBe(3);
        expect(root.children[2].textContent).toBe("three");
    });
});
