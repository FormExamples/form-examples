import { render, screen } from "@testing-library/svelte";
import { describe, expect, test, vi } from "vitest";
import type { Component } from "svelte";

import Tested from "./TextInputWithSearch.svelte";

// These tests leave required props out on purpose, to prove what the component does then.
const TextInputWithSearch = Tested as unknown as Component<Record<string, unknown>>;

describe("TextInputWithSearch", () => {
    test("renders with content", () => {
        render(TextInputWithSearch, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("text-input-with-search");
    });

    test("Enter in the field searches, without submitting a form", () => {
        const onsearch = vi.fn();
        render(Tested, {
            props: {
                label: "Site",
                inputLabel: "Query",
                searchLabel: "Search",
                value: "lily",
                onsearch,
            },
        });
        const input = screen.getByLabelText("Query");
        const enter = new KeyboardEvent("keydown", {
            key: "Enter",
            bubbles: true,
            cancelable: true,
        });
        input.dispatchEvent(enter);
        expect(enter.defaultPrevented).toBe(true);
        expect(onsearch).toHaveBeenCalledWith("lily");
        const other = new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true });
        input.dispatchEvent(other);
        expect(other.defaultPrevented).toBe(false);
        expect(onsearch).toHaveBeenCalledOnce();
    });

    test("the search button searches with the current value", () => {
        const onsearch = vi.fn();
        render(Tested, {
            props: {
                label: "Site",
                inputLabel: "Query",
                searchLabel: "Search",
                value: "tea",
                onsearch,
            },
        });
        screen.getByRole("button", { name: "Search" }).click();
        expect(onsearch).toHaveBeenCalledWith("tea");
    });
});
