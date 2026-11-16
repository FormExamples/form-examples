import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "../dev-warning";
import Subject from "./ProcedureRecordList.svelte";

const items = createRawSnippet(() => ({
    render: () => '<li class="procedure-record-list-item">One record</li>',
}));

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("ProcedureRecordList", () => {
    test("renders a ul named by its status, with the status as data", () => {
        render(Subject, { props: { status: "known", statusLabel: "Procedures", children: items } });
        const list = screen.getByRole("list", { name: "Procedures" });
        expect(list.tagName).toBe("UL");
        expect(list.getAttribute("class")).toContain("procedure-record-list");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".procedure-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No known procedures (none-known)"],
        ["not-recorded", "No known procedures (not-recorded)"],
        ["unavailable", "No known procedures (unavailable)"],
        ["omitted", "No known procedures (omitted)"],
    ] as const)("status %s is shown as the list's one item, never blank", (status, words) => {
        render(Subject, { props: { status, statusLabel: words } });
        const list = screen.getByRole("list", { name: words });
        const only = list.querySelectorAll("li");
        expect(only).toHaveLength(1);
        expect(only[0].className).toBe("procedure-record-list-status");
        expect(only[0].textContent).toBe(words);
        expect(list.getAttribute("data-status")).toBe(status);
    });

    test("label overrides the accessible name", () => {
        render(Subject, {
            props: { status: "none-known", statusLabel: "No known procedures", label: "Record" },
        });
        expect(screen.getByRole("list", { name: "Record" })).toBeTruthy();
    });

    test("warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { statusLabel: "Procedures" } as never });
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("ProcedureRecordList has no status"),
            ),
        ).toBe(true);
    });
});
