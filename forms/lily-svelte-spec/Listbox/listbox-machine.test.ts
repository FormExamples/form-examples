import { describe, expect, test } from "vitest";
import {
    initialListboxState,
    listboxKeydown,
    LISTBOX_TYPEAHEAD_RESET_MS,
    stepListboxIndex,
    type ListboxConfig,
    type ListboxState,
} from "./listbox-machine";

const fruits = ["Apple", "Banana", "Cherry"];
const AD: ListboxConfig = { navigation: "active-descendant" };
const at = (activeIndex: number): ListboxState => initialListboxState(activeIndex);
const key = (k: string, mods: { ctrlKey?: boolean; altKey?: boolean; metaKey?: boolean } = {}) => ({
    key: k,
    ...mods,
});

describe("stepListboxIndex", () => {
    test("wraps both ways", () => {
        expect(stepListboxIndex(2, 1, 3, false)).toBe(0);
        expect(stepListboxIndex(0, -1, 3, false)).toBe(2);
        expect(stepListboxIndex(1, 10, 3, false)).toBe(2);
        expect(stepListboxIndex(1, -10, 3, false)).toBe(0);
    });
    test("clamps both ways", () => {
        expect(stepListboxIndex(2, 1, 3, true)).toBe(2);
        expect(stepListboxIndex(0, -1, 3, true)).toBe(0);
        expect(stepListboxIndex(-1, 1, 3, true)).toBe(0);
        expect(stepListboxIndex(1, 10, 3, true)).toBe(2);
    });
    test("from no cursor, -1 + 1 is the first option and -1 - 1 wraps to the second last", () => {
        expect(stepListboxIndex(-1, 1, 3, false)).toBe(0);
        expect(stepListboxIndex(-1, -1, 3, false)).toBe(1);
    });
});

describe("initialListboxState", () => {
    test("defaults to no cursor and an empty typeahead prefix", () => {
        expect(initialListboxState()).toEqual({
            activeIndex: -1,
            typeahead: { prefix: "", at: 0 },
        });
        expect(initialListboxState(2).activeIndex).toBe(2);
    });
});

describe("roving-focus (default)", () => {
    const roving = (k: string, focusedIndex: number, labels: readonly string[] = fruits) =>
        listboxKeydown(at(-1), key(k), { labels, focusedIndex });

    test("is the default navigation", () => {
        expect(
            listboxKeydown(at(-1), key("ArrowDown"), { labels: fruits, focusedIndex: 0 }).focus,
        ).toBe(1);
    });
    test("ArrowDown moves focus to the next option and wraps", () => {
        expect(roving("ArrowDown", 0)).toEqual({ state: at(-1), preventDefault: true, focus: 1 });
        expect(roving("ArrowDown", 2).focus).toBe(0);
    });
    test("ArrowUp moves focus to the previous option and wraps", () => {
        expect(roving("ArrowUp", 2).focus).toBe(1);
        expect(roving("ArrowUp", 0).focus).toBe(2);
    });
    test("with no option focused, ArrowDown goes to the first and ArrowUp to the last", () => {
        expect(roving("ArrowDown", -1).focus).toBe(0);
        expect(roving("ArrowUp", -1).focus).toBe(2);
    });
    test("Home and End jump", () => {
        expect(roving("Home", 1).focus).toBe(0);
        expect(roving("End", 1).focus).toBe(2);
    });
    test("navigation keys are prevented even with no options, but focus nothing", () => {
        for (const k of ["ArrowDown", "ArrowUp", "Home", "End"]) {
            const t = roving(k, -1, []);
            expect(t.preventDefault).toBe(true);
            expect(t.focus).toBeUndefined();
        }
    });
    test("ignores paging, activation, Escape, Tab and typeahead", () => {
        for (const k of ["PageDown", "PageUp", "Enter", " ", "Escape", "Tab", "b"]) {
            const t = listboxKeydown(
                at(-1),
                key(k),
                { labels: fruits, focusedIndex: 0 },
                { typeahead: true },
            );
            expect(t).toEqual({ state: at(-1), preventDefault: false });
        }
    });
    test("never sets an active index", () => {
        expect(roving("ArrowDown", 0).setActiveIndex).toBeUndefined();
    });
});

describe("active-descendant: movement", () => {
    const ad = (
        k: string,
        activeIndex: number,
        config: ListboxConfig = {},
        labels: readonly string[] = fruits,
    ) => listboxKeydown(at(activeIndex), key(k), { labels }, { ...AD, ...config });

    test("ArrowDown and ArrowUp move the cursor and wrap by default", () => {
        expect(ad("ArrowDown", 0).setActiveIndex).toBe(1);
        expect(ad("ArrowDown", 2).setActiveIndex).toBe(0);
        expect(ad("ArrowUp", 0).setActiveIndex).toBe(2);
        expect(ad("ArrowDown", 0).preventDefault).toBe(true);
        expect(ad("ArrowDown", 0).state.activeIndex).toBe(1);
    });
    test("clamp stops at the ends but still reports the (unchanged) index", () => {
        expect(ad("ArrowDown", 2, { clamp: true }).setActiveIndex).toBe(2);
        expect(ad("ArrowUp", 0, { clamp: true }).setActiveIndex).toBe(0);
    });
    test("from no cursor, ArrowDown goes to the first option", () => {
        expect(ad("ArrowDown", -1).setActiveIndex).toBe(0);
        expect(ad("ArrowDown", -1, { clamp: true }).setActiveIndex).toBe(0);
    });
    test("Home and End jump", () => {
        expect(ad("Home", 1).setActiveIndex).toBe(0);
        expect(ad("End", 1).setActiveIndex).toBe(2);
    });
    test("Home and End with no options set the cursor to -1", () => {
        expect(ad("Home", 0, {}, []).setActiveIndex).toBe(-1);
        expect(ad("End", 0, {}, []).setActiveIndex).toBe(-1);
    });
    test("arrows and paging with no options are prevented and change nothing", () => {
        for (const k of ["ArrowDown", "ArrowUp", "PageDown", "PageUp"]) {
            const t = ad(k, 0, {}, []);
            expect(t.preventDefault).toBe(true);
            expect(t.setActiveIndex).toBeUndefined();
        }
    });
    test("PageDown and PageUp move by pageSize (default 10), clamped when clamp is set", () => {
        const many = Array.from({ length: 25 }, (_, i) => `Option ${i}`);
        expect(ad("PageDown", 0, { clamp: true }, many).setActiveIndex).toBe(10);
        expect(ad("PageDown", 20, { clamp: true }, many).setActiveIndex).toBe(24);
        expect(ad("PageUp", 5, { clamp: true }, many).setActiveIndex).toBe(0);
        expect(ad("PageDown", 0, { clamp: true, pageSize: 3 }, many).setActiveIndex).toBe(3);
    });
    test("PageDown and PageUp wrap when clamp is not set, like the arrows", () => {
        expect(ad("PageDown", 1, { pageSize: 2 }).setActiveIndex).toBe(0);
        expect(ad("PageUp", 0, { pageSize: 2 }).setActiveIndex).toBe(1);
    });
    test("a stale cursor beyond the end wraps back into range", () => {
        expect(ad("ArrowDown", 5).setActiveIndex).toBe(0);
    });
    test("never moves real focus", () => {
        expect(ad("ArrowDown", 0).focus).toBeUndefined();
    });
});

describe("active-descendant: activation, Escape and Tab", () => {
    const ad = (k: string, activeIndex: number) =>
        listboxKeydown(at(activeIndex), key(k), { labels: fruits }, AD);

    test("Enter and Space activate the active option", () => {
        expect(ad("Enter", 1)).toEqual({ state: at(1), preventDefault: true, activate: 1 });
        expect(ad(" ", 2).activate).toBe(2);
    });
    test("Enter with no cursor is prevented but activates nothing", () => {
        const t = ad("Enter", -1);
        expect(t.preventDefault).toBe(true);
        expect(t.activate).toBeUndefined();
    });
    test("Escape is prevented and reported", () => {
        expect(ad("Escape", 0)).toEqual({ state: at(0), preventDefault: true, escape: true });
    });
    test("Tab is reported and never prevented", () => {
        expect(ad("Tab", 0)).toEqual({ state: at(0), preventDefault: false, tabOut: true });
    });
    test("other keys do nothing", () => {
        expect(ad("F1", 0)).toEqual({ state: at(0), preventDefault: false });
        expect(ad("ArrowLeft", 0)).toEqual({ state: at(0), preventDefault: false });
    });
});

describe("active-descendant: typeahead", () => {
    const labels = ["Apple", "Banana", "Blueberry", "Cherry", "Bilberry", "Date"];
    const TA: ListboxConfig = { ...AD, typeahead: true };
    /** Type `keys` at the given times, starting from `state`; returns the final transition. */
    function type(
        state: ListboxState,
        keys: string,
        times: number[],
        config: ListboxConfig = TA,
        list = labels,
    ) {
        let t = { state, preventDefault: false } as ReturnType<typeof listboxKeydown>;
        [...keys].forEach((k, i) => {
            t = listboxKeydown(t.state, key(k), { labels: list, now: times[i] }, config);
        });
        return t;
    }

    test("is off unless enabled", () => {
        const t = listboxKeydown(at(0), key("b"), { labels, now: 0 }, AD);
        expect(t).toEqual({ state: at(0), preventDefault: false });
    });
    test("a character moves to the next option starting with it, never prevented", () => {
        const t = type(at(0), "b", [1000]);
        expect(t.setActiveIndex).toBe(1);
        expect(t.preventDefault).toBe(false);
        expect(t.state.typeahead.prefix).toBe("b");
    });
    test("is case-insensitive", () => {
        expect(type(at(0), "B", [1000]).setActiveIndex).toBe(1);
        expect(type(at(0), "c", [1000], TA, ["apple", "CHERRY"]).setActiveIndex).toBe(1);
    });
    test("repeating the same character cycles through the matches", () => {
        let t = type(at(0), "b", [1000]);
        expect(t.setActiveIndex).toBe(1);
        t = type(t.state, "b", [1100]);
        expect(t.setActiveIndex).toBe(2);
        t = type(t.state, "b", [1200]);
        expect(t.setActiveIndex).toBe(4);
        t = type(t.state, "b", [1300]);
        expect(t.setActiveIndex).toBe(1);
    });
    test("characters typed quickly form a prefix that may keep the current option", () => {
        const t = type(at(0), "bl", [1000, 1100]);
        expect(t.state.typeahead.prefix).toBe("bl");
        expect(t.setActiveIndex).toBe(2);
        const kept = type(at(2), "bl", [1000, 1100], TA, ["Apple", "Black", "Blue"]);
        // "b" from 2 moves on to... wraps to 1 ("Black"); "bl" from 1 keeps 1.
        expect(kept.setActiveIndex).toBe(1);
    });
    test("a single character with no cursor searches from the second option, then wraps", () => {
        expect(type(at(-1), "a", [1000]).setActiveIndex).toBe(0);
        expect(type(at(-1), "b", [1000]).setActiveIndex).toBe(1);
    });
    test("the prefix resets after a pause of LISTBOX_TYPEAHEAD_RESET_MS", () => {
        expect(LISTBOX_TYPEAHEAD_RESET_MS).toBe(500);
        const t = type(at(0), "bd", [1000, 1000 + LISTBOX_TYPEAHEAD_RESET_MS + 1]);
        expect(t.state.typeahead.prefix).toBe("d");
        expect(t.setActiveIndex).toBe(5);
    });
    test("typeaheadResetMs overrides the pause", () => {
        const t = type(at(0), "bd", [1000, 1200], { ...TA, typeaheadResetMs: 100 });
        expect(t.state.typeahead.prefix).toBe("d");
    });
    test("no match keeps the cursor but remembers the prefix", () => {
        const t = type(at(0), "z", [1000]);
        expect(t.setActiveIndex).toBeUndefined();
        expect(t.state.activeIndex).toBe(0);
        expect(t.state.typeahead.prefix).toBe("z");
    });
    test("with no options nothing changes, not even the prefix", () => {
        const t = type(at(0), "b", [1000], TA, []);
        expect(t).toEqual({ state: at(0), preventDefault: false });
    });
    test("ignores modified keys, named keys and Space", () => {
        for (const mods of [{ ctrlKey: true }, { altKey: true }, { metaKey: true }]) {
            const t = listboxKeydown(at(0), key("b", mods), { labels, now: 0 }, TA);
            expect(t).toEqual({ state: at(0), preventDefault: false });
        }
        expect(
            listboxKeydown(at(0), key("F2"), { labels, now: 0 }, TA).setActiveIndex,
        ).toBeUndefined();
        expect(listboxKeydown(at(0), key(" "), { labels, now: 0 }, TA).activate).toBe(0);
    });
    test("folds diacritics (shared/typeahead)", () => {
        expect(type(at(0), "e", [1000], TA, ["Apple", "Éclair"]).setActiveIndex).toBe(1);
    });
});

describe("purity", () => {
    test("never mutates the state it is given", () => {
        const state = Object.freeze({
            activeIndex: 0,
            typeahead: Object.freeze({ prefix: "", at: 0 }),
        });
        expect(() =>
            listboxKeydown(state, key("b"), { labels: fruits, now: 1 }, { ...AD, typeahead: true }),
        ).not.toThrow();
        expect(() => listboxKeydown(state, key("ArrowDown"), { labels: fruits }, AD)).not.toThrow();
        expect(state.activeIndex).toBe(0);
    });
});
