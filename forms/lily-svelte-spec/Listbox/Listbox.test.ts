import { render, screen, fireEvent } from "@testing-library/svelte";
import { describe, expect, test, vi } from "vitest";

import Subject from "./Listbox.svelte";

function optionsSnippet() {
    return (($anchor: Comment) => {
        const opt1 = document.createElement("div");
        opt1.setAttribute("role", "option");
        opt1.setAttribute("tabindex", "-1");
        opt1.textContent = "Apple";
        const opt2 = document.createElement("div");
        opt2.setAttribute("role", "option");
        opt2.setAttribute("tabindex", "-1");
        opt2.textContent = "Banana";
        $anchor.before(opt1, opt2);
    }) as any;
}

describe("Listbox", () => {
    test("renders a listbox", () => {
        render(Subject, { props: { label: "Fruits", children: optionsSnippet() } });
        expect(screen.getByRole("listbox")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Fruits", children: optionsSnippet() } });
        expect(screen.getByLabelText("Fruits")).toBeTruthy();
    });

    test("renders option children", () => {
        render(Subject, { props: { label: "Fruits", children: optionsSnippet() } });
        expect(screen.getAllByRole("option").length).toBe(2);
    });

    test("arrow down navigates to next option", () => {
        render(Subject, { props: { label: "Fruits", children: optionsSnippet() } });
        const options = screen.getAllByRole("option");
        options[0].focus();
        options[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));
        expect(document.activeElement).toBe(options[1]);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "F", "data-testid": "lb", children: optionsSnippet() } });
        expect(screen.getByTestId("lb")).toBeTruthy();
    });
});

function activeDescendantOptionsSnippet(activeIndex: number) {
    return (($anchor: Comment) => {
        const labels = ["Apple", "Banana", "Cherry"];
        labels.forEach((text, i) => {
            const opt = document.createElement("div");
            opt.setAttribute("role", "option");
            opt.id = `opt-${i}`;
            opt.setAttribute("aria-selected", String(i === activeIndex));
            opt.textContent = text;
            $anchor.before(opt);
        });
    }) as any;
}

describe("Listbox — active-descendant mode (opt-in, additive)", () => {
    test("default mode is unaffected: no tabindex/aria-activedescendant unless opted in", () => {
        render(Subject, { props: { label: "Fruits", children: optionsSnippet() } });
        const listbox = screen.getByRole("listbox");
        expect(listbox.hasAttribute("tabindex")).toBe(false);
        expect(listbox.hasAttribute("aria-activedescendant")).toBe(false);
    });

    test("root carries tabindex=-1 and aria-activedescendant tracking activeIndex", async () => {
        const { rerender } = render(Subject, {
            props: {
                label: "Fruits",
                navigation: "active-descendant",
                activeIndex: 1,
                children: activeDescendantOptionsSnippet(1),
            },
        });
        const listbox = screen.getByRole("listbox");
        expect(listbox.getAttribute("tabindex")).toBe("-1");
        expect(listbox.getAttribute("aria-activedescendant")).toBe("opt-1");
    });

    test("ArrowDown/ArrowUp move the cursor and clamp when clamp is set", async () => {
        const activeIndex = 2;
        const onActivate = vi.fn();
        render(Subject, {
            props: {
                label: "Fruits",
                navigation: "active-descendant",
                clamp: true,
                activeIndex,
                onActivate,
                children: activeDescendantOptionsSnippet(activeIndex),
            },
        });
        const listbox = screen.getByRole("listbox");
        // At the last option (index 2 of 3), ArrowDown must clamp, not wrap to 0.
        await fireEvent.keyDown(listbox, { key: "ArrowDown" });
        expect(listbox.getAttribute("aria-activedescendant")).toBe("opt-2");
    });

    test("ArrowDown wraps when clamp is not set", async () => {
        render(Subject, {
            props: {
                label: "Fruits",
                navigation: "active-descendant",
                activeIndex: 2,
                children: activeDescendantOptionsSnippet(2),
            },
        });
        const listbox = screen.getByRole("listbox");
        await fireEvent.keyDown(listbox, { key: "ArrowDown" });
        expect(listbox.getAttribute("aria-activedescendant")).toBe("opt-0");
    });

    test("Home/End jump to the first/last option", async () => {
        render(Subject, {
            props: {
                label: "Fruits",
                navigation: "active-descendant",
                activeIndex: 1,
                children: activeDescendantOptionsSnippet(1),
            },
        });
        const listbox = screen.getByRole("listbox");
        await fireEvent.keyDown(listbox, { key: "End" });
        expect(listbox.getAttribute("aria-activedescendant")).toBe("opt-2");
        await fireEvent.keyDown(listbox, { key: "Home" });
        expect(listbox.getAttribute("aria-activedescendant")).toBe("opt-0");
    });

    test("Enter calls onActivate with the active index", async () => {
        const onActivate = vi.fn();
        render(Subject, {
            props: {
                label: "Fruits",
                navigation: "active-descendant",
                activeIndex: 1,
                onActivate,
                children: activeDescendantOptionsSnippet(1),
            },
        });
        await fireEvent.keyDown(screen.getByRole("listbox"), { key: "Enter" });
        expect(onActivate).toHaveBeenCalledWith(1);
    });

    test("Escape calls onEscape", async () => {
        const onEscape = vi.fn();
        render(Subject, {
            props: {
                label: "Fruits",
                navigation: "active-descendant",
                activeIndex: 0,
                onEscape,
                children: activeDescendantOptionsSnippet(0),
            },
        });
        await fireEvent.keyDown(screen.getByRole("listbox"), { key: "Escape" });
        expect(onEscape).toHaveBeenCalled();
    });

    test("Tab calls onTabOut without preventDefault", async () => {
        const onTabOut = vi.fn();
        render(Subject, {
            props: {
                label: "Fruits",
                navigation: "active-descendant",
                activeIndex: 0,
                onTabOut,
                children: activeDescendantOptionsSnippet(0),
            },
        });
        const event = await fireEvent.keyDown(screen.getByRole("listbox"), { key: "Tab" });
        expect(onTabOut).toHaveBeenCalled();
        expect(event).toBe(true); // fireEvent resolves the dispatch's return value; true means not cancelled.
    });

    test("typeahead moves to the next option starting with the typed character, only when enabled", async () => {
        const withTypeahead = render(Subject, {
            props: {
                label: "Fruits",
                navigation: "active-descendant",
                typeahead: true,
                activeIndex: 0,
                children: activeDescendantOptionsSnippet(0),
            },
        });
        await fireEvent.keyDown(withTypeahead.getByRole("listbox"), { key: "b" });
        expect(withTypeahead.getByRole("listbox").getAttribute("aria-activedescendant")).toBe(
            "opt-1",
        );
        withTypeahead.unmount();

        const withoutTypeahead = render(Subject, {
            props: {
                label: "Fruits",
                navigation: "active-descendant",
                activeIndex: 0,
                children: activeDescendantOptionsSnippet(0),
            },
        });
        await fireEvent.keyDown(withoutTypeahead.getByRole("listbox"), { key: "b" });
        expect(withoutTypeahead.getByRole("listbox").getAttribute("aria-activedescendant")).toBe(
            "opt-0",
        );
    });

    test("PageDown/PageUp move by pageSize, clamped", async () => {
        render(Subject, {
            props: {
                label: "Fruits",
                navigation: "active-descendant",
                clamp: true,
                pageSize: 1,
                activeIndex: 0,
                children: activeDescendantOptionsSnippet(0),
            },
        });
        const listbox = screen.getByRole("listbox");
        await fireEvent.keyDown(listbox, { key: "PageDown" });
        expect(listbox.getAttribute("aria-activedescendant")).toBe("opt-1");
        await fireEvent.keyDown(listbox, { key: "PageDown" });
        await fireEvent.keyDown(listbox, { key: "PageDown" });
        expect(listbox.getAttribute("aria-activedescendant")).toBe("opt-2"); // clamped at the end
    });

    test("default root is a div with the listbox base class", () => {
        render(Subject, { props: { label: "Fruits", children: optionsSnippet() } });
        expect(screen.getByRole("listbox").tagName).toBe("DIV");
        expect(screen.getByRole("listbox").className).toContain("listbox");
    });

    test("as changes the root tag; baseClass replaces the default class token outright", () => {
        render(Subject, {
            props: {
                label: "Fruits",
                as: "ul",
                baseClass: "motion-picker-list",
                children: optionsSnippet(),
            },
        });
        const listbox = screen.getByRole("listbox");
        expect(listbox.tagName).toBe("UL");
        expect(listbox.className).toBe("motion-picker-list ");
    });

    test("bind:ref exposes the rendered root", () => {
        let ref: HTMLElement | undefined;
        render(Subject, {
            props: {
                label: "Fruits",
                navigation: "active-descendant",
                get ref() {
                    return ref;
                },
                set ref(v: HTMLElement | undefined) {
                    ref = v;
                },
                children: activeDescendantOptionsSnippet(0),
            },
        });
        expect(ref).toBe(screen.getByRole("listbox"));
    });
});
