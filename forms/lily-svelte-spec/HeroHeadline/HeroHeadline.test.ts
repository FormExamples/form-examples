import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./HeroHeadline.svelte";

function snippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}

describe("HeroHeadline", () => {
    test("renders a div with class hero-headline", () => {
        const { container } = render(Subject, { label: "x", children: snippet("content") } as any);
        const root = container.querySelector(".hero-headline");
        expect(root).toBeTruthy();
        expect(root?.tagName).toBe("DIV");
    });

    test("renders children content", () => {
        const { container } = render(Subject, { label: "x", children: snippet("content") } as any);
        expect(container.textContent).toContain("content");
    });

    test("applies aria-label from label prop", () => {
        const { container } = render(Subject, { label: "Hello", children: snippet("x") } as any);
        const root = container.querySelector(".hero-headline");
        expect(root?.getAttribute("aria-label")).toBe("Hello");
    });

    test("renders media slot", () => {
        const { container } = render(Subject, {
            label: "x",
            media: snippet("MEDIA"),
            children: snippet("HEADLINE"),
        });
        expect(container.textContent).toContain("MEDIA");
        expect(container.textContent).toContain("HEADLINE");
    });

    test("is a named group when labelled", () => {
        const { container } = render(Subject, {
            label: "Story",
            media: snippet("MEDIA"),
            children: snippet("content"),
        });
        const root = container.querySelector(".hero-headline");
        expect(root?.getAttribute("role")).toBe("group");
        expect(root?.getAttribute("aria-label")).toBe("Story");
    });
});
