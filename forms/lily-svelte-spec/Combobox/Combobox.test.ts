import { fireEvent, render, screen, waitFor } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Combobox.svelte";

function optionsSnippet() {
    return (($anchor: Comment) => {
        const opt = document.createElement("div");
        opt.setAttribute("role", "option");
        opt.textContent = "Apple";
        $anchor.before(opt);
    }) as any;
}

describe("Combobox", () => {
    test("renders a combobox input", () => {
        render(Subject, { props: { label: "Fruit", children: optionsSnippet() } });
        expect(screen.getByRole("combobox")).toBeTruthy();
    });

    test("has aria-label", () => {
        render(Subject, { props: { label: "Search fruit", children: optionsSnippet() } });
        expect(screen.getByRole("combobox", { name: "Search fruit" })).toBeTruthy();
    });

    test("listbox hidden when closed", () => {
        render(Subject, { props: { label: "Fruit", open: false, children: optionsSnippet() } });
        expect(screen.queryByRole("listbox")).toBeNull();
    });

    test("listbox shown when open", () => {
        render(Subject, { props: { label: "Fruit", open: true, children: optionsSnippet() } });
        expect(screen.getByRole("listbox")).toBeTruthy();
    });

    test("has aria-expanded", () => {
        render(Subject, { props: { label: "Fruit", open: true, children: optionsSnippet() } });
        expect(screen.getByRole("combobox").getAttribute("aria-expanded")).toBe("true");
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "F", "data-testid": "cb", children: optionsSnippet() } });
        expect(screen.getByTestId("cb")).toBeTruthy();
    });

    test("Escape closes the listbox and collapses the combobox", async () => {
        render(Subject, { props: { label: "Fruit", open: true, children: optionsSnippet() } });
        const input = screen.getByRole("combobox");
        await fireEvent.keyDown(input, { key: "Escape" });
        expect(screen.queryByRole("listbox")).toBeNull();
        expect(input.getAttribute("aria-expanded")).toBe("false");
    });

    test("announces the consumer's count when typing pauses, and says when nothing matches", async () => {
        const { rerender } = render(Subject, {
            props: {
                label: "Medicine",
                open: true,
                resultCount: 4,
                resultsLabel: (n: number) => `${n} matches`,
                noResultsLabel: "No matches",
                statusDelay: 0,
                children: optionsSnippet(),
            },
        });
        // waitFor, not a fixed sleep: under a loaded CI machine a 10 ms sleep could finish before the status timer.
        const status = screen.getByRole("status");
        await waitFor(() => expect(status.textContent?.trim()).toBe("4 matches"));
        await rerender({ resultCount: 0 });
        await waitFor(() => expect(status.textContent?.trim()).toBe("No matches"));
        expect(status.getAttribute("data-results")).toBe("0");
    });

    test("renders no status without the consumer's words", () => {
        render(Subject, {
            props: { label: "Medicine", resultCount: 3, children: optionsSnippet() },
        });
        expect(screen.queryByRole("status")).toBeNull();
    });
});
