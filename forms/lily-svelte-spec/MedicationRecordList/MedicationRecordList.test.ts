import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "../dev-warning";
import Subject from "./MedicationRecordList.svelte";

const items = createRawSnippet(() => ({
    render: () => '<li class="medication-record-list-item">One record</li>',
}));

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("MedicationRecordList", () => {
    test("renders a ul named by its status, with the status as data", () => {
        render(Subject, {
            props: { status: "known", statusLabel: "Current medicines", children: items },
        });
        const list = screen.getByRole("list", { name: "Current medicines" });
        expect(list.tagName).toBe("UL");
        expect(list.getAttribute("class")).toContain("medication-record-list");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".medication-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No known medicines (none-known)"],
        ["not-recorded", "No known medicines (not-recorded)"],
        ["unavailable", "No known medicines (unavailable)"],
        ["omitted", "No known medicines (omitted)"],
    ] as const)("status %s is shown as the list's one item, never blank", (status, words) => {
        render(Subject, { props: { status, statusLabel: words } });
        const list = screen.getByRole("list", { name: words });
        const only = list.querySelectorAll("li");
        expect(only).toHaveLength(1);
        expect(only[0].className).toBe("medication-record-list-status");
        expect(only[0].textContent).toBe(words);
        expect(list.getAttribute("data-status")).toBe(status);
    });

    test("label overrides the accessible name", () => {
        render(Subject, {
            props: { status: "none-known", statusLabel: "No known medicines", label: "Record" },
        });
        expect(screen.getByRole("list", { name: "Record" })).toBeTruthy();
    });

    test("warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { statusLabel: "Current medicines" } as never });
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("MedicationRecordList has no status"),
            ),
        ).toBe(true);
    });
});
