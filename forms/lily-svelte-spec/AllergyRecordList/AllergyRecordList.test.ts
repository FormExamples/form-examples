import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "../dev-warning";
import Subject from "./AllergyRecordList.svelte";

const items = createRawSnippet(() => ({
    render: () => '<li class="allergy-record-list-item">One record</li>',
}));

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("AllergyRecordList", () => {
    test("renders a ul named by its status, with the status as data", () => {
        render(Subject, {
            props: { status: "known", statusLabel: "Known allergies", children: items },
        });
        const list = screen.getByRole("list", { name: "Known allergies" });
        expect(list.tagName).toBe("UL");
        expect(list.getAttribute("class")).toContain("allergy-record-list");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".allergy-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No known allergies (none-known)"],
        ["not-recorded", "No known allergies (not-recorded)"],
        ["unavailable", "No known allergies (unavailable)"],
        ["omitted", "No known allergies (omitted)"],
    ] as const)("status %s is shown as the list's one item, never blank", (status, words) => {
        render(Subject, { props: { status, statusLabel: words } });
        const list = screen.getByRole("list", { name: words });
        const only = list.querySelectorAll("li");
        expect(only).toHaveLength(1);
        expect(only[0].className).toBe("allergy-record-list-status");
        expect(only[0].textContent).toBe(words);
        expect(list.getAttribute("data-status")).toBe(status);
    });

    test("label overrides the accessible name", () => {
        render(Subject, {
            props: { status: "none-known", statusLabel: "No known allergies", label: "Record" },
        });
        expect(screen.getByRole("list", { name: "Record" })).toBeTruthy();
    });

    test("warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { statusLabel: "Known allergies" } as never });
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("AllergyRecordList has no status"),
            ),
        ).toBe(true);
    });
});
