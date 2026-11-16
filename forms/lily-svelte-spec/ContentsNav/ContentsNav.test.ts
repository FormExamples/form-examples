import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ContentsNav.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("ContentsNav", () => {
    test("renders as navigation landmark", () => {
        render(Subject, { props: { label: "On this page", children: textSnippet("Items") } });
        expect(screen.getByRole("navigation", { name: "On this page" })).toBeTruthy();
    });

    test("applies aria-label", () => {
        render(Subject, { props: { label: "Contents", children: textSnippet("Items") } });
        expect(screen.getByRole("navigation").getAttribute("aria-label")).toBe("Contents");
    });

    test("renders children", () => {
        render(Subject, { props: { label: "Contents", children: textSnippet("Section 1") } });
        expect(screen.getByRole("navigation").textContent).toContain("Section 1");
    });

    test("passes through attributes", () => {
        render(Subject, {
            props: { label: "Contents", "data-testid": "cn", children: textSnippet("Items") },
        });
        expect(screen.getByTestId("cn")).toBeTruthy();
    });
});

// =====================================================================
// Scrollspy (spy)
// =====================================================================

import { afterEach, vi } from "vitest";
import { activeSectionIndex } from "./ContentsNav.svelte";

function linksSnippet(ids: string[]) {
    return (($$anchor: Comment) => {
        const ol = document.createElement("ol");
        for (const id of ids) {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = `#${id}`;
            a.textContent = id;
            li.appendChild(a);
            ol.appendChild(li);
        }
        $$anchor.before(ol);
    }) as any;
}

/** Sections whose tops the test controls; jsdom has no layout. */
function sections(ids: string[]): Record<string, number> {
    const tops: Record<string, number> = {};
    // A tall page, so the viewport is not "at the bottom" unless a test says so.
    Object.defineProperty(document.documentElement, "scrollHeight", {
        value: 5000,
        configurable: true,
    });
    for (const id of ids) {
        const el = document.createElement("section");
        el.id = id;
        tops[id] = 0;
        el.getBoundingClientRect = () =>
            ({
                top: tops[id],
                bottom: tops[id] + 100,
                left: 0,
                right: 0,
                width: 0,
                height: 100,
                x: 0,
                y: tops[id],
                toJSON() {},
            }) as DOMRect;
        document.body.appendChild(el);
    }
    return tops;
}

const frame = () => new Promise<void>((r) => requestAnimationFrame(() => r()));
const settle = async () => {
    await frame();
    await frame();
};
const activeLink = () => document.querySelector("a[aria-current]");

const IDS = ["intro", "usage", "api"];

describe("ContentsNav — activeSectionIndex (pure)", () => {
    test("the last section whose top has passed the line is current", () => {
        expect(activeSectionIndex([-300, -10, 400], 0, false)).toBe(1);
        expect(activeSectionIndex([-300, -10, 400], 500, false)).toBe(2);
    });
    test("before the first section, the first is current", () => {
        expect(activeSectionIndex([200, 600, 900], 0, false)).toBe(0);
    });
    test("at the bottom of the scroll range the last section is current", () => {
        expect(activeSectionIndex([-300, -10, 400], 0, true)).toBe(2);
    });
    test("no sections gives -1", () => {
        expect(activeSectionIndex([], 0, false)).toBe(-1);
    });
});

describe("ContentsNav — scrollspy", () => {
    afterEach(() => {
        document.body.innerHTML = "";
        window.location.hash = "";
    });

    test("spy is off by default: no link is marked", async () => {
        sections(IDS);
        render(Subject, { props: { label: "Contents", children: linksSnippet(IDS) } });
        await settle();
        expect(activeLink()).toBeNull();
    });

    test("marks the link of the section in view with aria-current and data-active", async () => {
        const tops = sections(IDS);
        tops.intro = -400;
        tops.usage = -20;
        tops.api = 500;
        render(Subject, { props: { label: "Contents", spy: true, children: linksSnippet(IDS) } });
        await settle();
        expect(activeLink()!.textContent).toBe("usage");
        expect(activeLink()!.getAttribute("aria-current")).toBe("true");
        expect(activeLink()!.hasAttribute("data-active")).toBe(true);
        expect(document.querySelectorAll("a[aria-current]")).toHaveLength(1);
    });

    test("moves the mark when the reader scrolls, and back again", async () => {
        const tops = sections(IDS);
        tops.intro = 0;
        tops.usage = 300;
        tops.api = 600;
        render(Subject, { props: { label: "Contents", spy: true, children: linksSnippet(IDS) } });
        await settle();
        expect(activeLink()!.textContent).toBe("intro");

        tops.intro = -400;
        tops.usage = -100;
        tops.api = 200;
        window.dispatchEvent(new Event("scroll"));
        await settle();
        expect(activeLink()!.textContent).toBe("usage");

        tops.intro = 0;
        tops.usage = 300;
        tops.api = 600;
        window.dispatchEvent(new Event("scroll"));
        await settle();
        expect(activeLink()!.textContent).toBe("intro");
    });

    test("offset moves the activation line", async () => {
        const tops = sections(IDS);
        tops.intro = -400;
        tops.usage = 60;
        tops.api = 500;
        render(Subject, {
            props: { label: "Contents", spy: true, offset: 80, children: linksSnippet(IDS) },
        });
        await settle();
        expect(activeLink()!.textContent).toBe("usage");
    });

    test("current sets the aria-current token", async () => {
        sections(IDS);
        render(Subject, {
            props: {
                label: "Contents",
                spy: true,
                current: "location",
                children: linksSnippet(IDS),
            },
        });
        await settle();
        expect(activeLink()!.getAttribute("aria-current")).toBe("location");
    });

    test("a click makes its link current at once and holds it while the scroll settles", async () => {
        const tops = sections(IDS);
        tops.intro = 0;
        tops.usage = 300;
        tops.api = 600;
        render(Subject, { props: { label: "Contents", spy: true, children: linksSnippet(IDS) } });
        await settle();
        (document.querySelector('a[href="#api"]') as HTMLElement).click();
        expect(activeLink()!.textContent).toBe("api");
        // A scroll event mid-flight (the smooth scroll passing through "usage") must not steal the mark.
        tops.intro = -100;
        tops.usage = 0;
        tops.api = 300;
        window.dispatchEvent(new Event("scroll"));
        await settle();
        expect(activeLink()!.textContent).toBe("api");
        // When the scroll settles, the real position decides again.
        window.dispatchEvent(new Event("scrollend"));
        await settle();
        expect(activeLink()!.textContent).toBe("usage");
    });

    test("onActiveChange fires once per change, with the section id", async () => {
        const tops = sections(IDS);
        tops.intro = 0;
        tops.usage = 300;
        tops.api = 600;
        const onActiveChange = vi.fn();
        render(Subject, {
            props: { label: "Contents", spy: true, onActiveChange, children: linksSnippet(IDS) },
        });
        await settle();
        window.dispatchEvent(new Event("scroll"));
        await settle();
        expect(onActiveChange).toHaveBeenCalledTimes(1);
        expect(onActiveChange).toHaveBeenLastCalledWith("intro");
        tops.intro = -400;
        tops.usage = -100;
        tops.api = 200;
        window.dispatchEvent(new Event("scroll"));
        await settle();
        expect(onActiveChange).toHaveBeenCalledTimes(2);
        expect(onActiveChange).toHaveBeenLastCalledWith("usage");
    });

    test("at the bottom of the page the last section is current even if it never reaches the line", async () => {
        const tops = sections(IDS);
        tops.intro = -900;
        tops.usage = -500;
        tops.api = 400;
        Object.defineProperty(document.documentElement, "scrollHeight", {
            value: window.innerHeight + 10,
            configurable: true,
        });
        Object.defineProperty(window, "scrollY", { value: 10, configurable: true });
        render(Subject, { props: { label: "Contents", spy: true, children: linksSnippet(IDS) } });
        await settle();
        expect(activeLink()!.textContent).toBe("api");
        Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
    });

    test("the URL hash wins on load", async () => {
        const tops = sections(IDS);
        tops.intro = 0;
        tops.usage = 300;
        tops.api = 600;
        window.location.hash = "#api";
        render(Subject, { props: { label: "Contents", spy: true, children: linksSnippet(IDS) } });
        await settle();
        expect(activeLink()!.textContent).toBe("api");
    });

    test("ancestors of the active link get data-descendant-active", async () => {
        const tops = sections(["intro", "child"]);
        tops.intro = -400;
        tops.child = -10;
        const nested = (($$anchor: Comment) => {
            const ol = document.createElement("ol");
            ol.innerHTML =
                '<li><a href="#intro">intro</a><ol><li><a href="#child">child</a></li></ol></li>';
            $$anchor.before(ol);
        }) as any;
        render(Subject, { props: { label: "Contents", spy: true, children: nested } });
        await settle();
        expect(activeLink()!.textContent).toBe("child");
        const parentLi = document.querySelector("li")!;
        expect(parentLi.hasAttribute("data-descendant-active")).toBe(true);
        expect(activeLink()!.closest("li")!.hasAttribute("data-descendant-active")).toBe(false);
    });

    test("links with no matching element are ignored", async () => {
        const tops = sections(["intro"]);
        tops.intro = 0;
        render(Subject, {
            props: { label: "Contents", spy: true, children: linksSnippet(["intro", "missing"]) },
        });
        await settle();
        expect(activeLink()!.textContent).toBe("intro");
    });
});
