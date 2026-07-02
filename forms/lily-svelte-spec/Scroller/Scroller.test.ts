import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Scroller.svelte";

function snippet(html: string) {
    return (($anchor: Comment) => {
        const tpl = document.createElement("template");
        tpl.innerHTML = html;
        for (const node of Array.from(tpl.content.childNodes)) $anchor.before(node);
    }) as any;
}

describe("Scroller", () => {
    test("renders a div with class scroller", () => {
        const { container } = render(Subject, {
            children: snippet("<section>step</section>"),
            background: snippet("<div>BG</div>"),
        });
        const root = container.querySelector(".scroller");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("applies aria-label when label provided", () => {
        const { container } = render(Subject, {
            label: "Story",
            children: snippet("<section>step</section>"),
            background: snippet("<div />"),
        });
        expect(container.querySelector(".scroller")?.getAttribute("aria-label")).toBe("Story");
    });

    test("renders background inside scroller-background with aria-live=polite", () => {
        const { container } = render(Subject, {
            children: snippet("<section>step</section>"),
            background: snippet("<div>BG</div>"),
        });
        const bg = container.querySelector(".scroller-background");
        expect(bg).toBeTruthy();
        expect(bg?.getAttribute("aria-live")).toBe("polite");
        expect(bg?.textContent).toBe("BG");
    });

    test("renders children inside the foreground", () => {
        const { container } = render(Subject, {
            children: snippet("<section>step 1</section><section>step 2</section>"),
            background: snippet("<div />"),
        });
        const fg = container.querySelector(".scroller-foreground");
        expect(fg).toBeTruthy();
        expect(fg?.children.length).toBe(2);
    });

    test("foreground is a ScrollerBase (has scroller-base class)", () => {
        const { container } = render(Subject, {
            children: snippet("<section>step</section>"),
            background: snippet("<div />"),
        });
        const fg = container.querySelector(".scroller-foreground");
        expect(fg?.classList.contains("scroller-base")).toBe(true);
    });
});
