import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ContentsLink from "./ContentsLink.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        $$anchor.before(document.createTextNode(text));
    }) as any;
}

const link = () => screen.getByRole("link");

describe("ContentsLink", () => {
    test("renders an anchor with the href, the class and the children as text", () => {
        render(ContentsLink, { props: { href: "#intro", children: textSnippet("Introduction") } });
        expect(link().tagName).toBe("A");
        expect(link().getAttribute("href")).toBe("#intro");
        expect(link().getAttribute("class")).toContain("contents-link");
        expect(link().textContent).toContain("Introduction");
    });

    test("href defaults to #", () => {
        render(ContentsLink, { props: { children: textSnippet("x") } });
        expect(link().getAttribute("href")).toBe("#");
    });

    test("label sets aria-label; without it none is set", () => {
        const a = render(ContentsLink, { props: { label: "More", children: textSnippet("x") } });
        expect(link().getAttribute("aria-label")).toBe("More");
        a.unmount();
        render(ContentsLink, { props: { children: textSnippet("x") } });
        expect(link().hasAttribute("aria-label")).toBe(false);
    });

    test("countLabel renders inside the link, so the link's name includes it", () => {
        render(ContentsLink, {
            props: { count: 3, countLabel: "3 to do", children: textSnippet("Address") },
        });
        expect(link().querySelector(".contents-link-count")!.textContent).toBe("3 to do");
        expect(screen.getByRole("link", { name: /Address.*3 to do/ })).toBeTruthy();
    });

    test("no countLabel renders no count element", () => {
        render(ContentsLink, { props: { count: 3, children: textSnippet("Address") } });
        expect(link().querySelector(".contents-link-count")).toBeNull();
    });

    test("count sets data-count; zero adds data-complete; none sets neither", () => {
        const a = render(ContentsLink, { props: { count: 3, children: textSnippet("x") } });
        expect(link().getAttribute("data-count")).toBe("3");
        expect(link().hasAttribute("data-complete")).toBe(false);
        a.unmount();
        const b = render(ContentsLink, { props: { count: 0, children: textSnippet("x") } });
        expect(link().getAttribute("data-count")).toBe("0");
        expect(link().hasAttribute("data-complete")).toBe(true);
        b.unmount();
        render(ContentsLink, { props: { children: textSnippet("x") } });
        expect(link().hasAttribute("data-count")).toBe(false);
        expect(link().hasAttribute("data-complete")).toBe(false);
    });

    test("class and rest props land on the anchor", () => {
        render(ContentsLink, {
            props: { class: "extra", "data-testid": "l", children: textSnippet("x") },
        });
        expect(link().classList.contains("extra")).toBe(true);
        expect(link().getAttribute("data-testid")).toBe("l");
    });
});
