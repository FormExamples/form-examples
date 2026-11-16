import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "../dev-warning";
import Subject from "./ProblemRecordList.svelte";

const items = createRawSnippet(() => ({
    render: () => '<li class="problem-record-list-item">One record</li>',
}));

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("ProblemRecordList", () => {
    test("renders a ul named by its status, with the status as data", () => {
        render(Subject, { props: { status: "known", statusLabel: "Problems", children: items } });
        const list = screen.getByRole("list", { name: "Problems" });
        expect(list.tagName).toBe("UL");
        expect(list.getAttribute("class")).toContain("problem-record-list");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".problem-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No known problems (none-known)"],
        ["not-recorded", "No known problems (not-recorded)"],
        ["unavailable", "No known problems (unavailable)"],
        ["omitted", "No known problems (omitted)"],
    ] as const)("status %s is shown as the list's one item, never blank", (status, words) => {
        render(Subject, { props: { status, statusLabel: words } });
        const list = screen.getByRole("list", { name: words });
        const only = list.querySelectorAll("li");
        expect(only).toHaveLength(1);
        expect(only[0].className).toBe("problem-record-list-status");
        expect(only[0].textContent).toBe(words);
        expect(list.getAttribute("data-status")).toBe(status);
    });

    test("label overrides the accessible name", () => {
        render(Subject, {
            props: { status: "none-known", statusLabel: "No known problems", label: "Record" },
        });
        expect(screen.getByRole("list", { name: "Record" })).toBeTruthy();
    });

    test("warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { statusLabel: "Problems" } as never });
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("ProblemRecordList has no status"),
            ),
        ).toBe(true);
    });
});
