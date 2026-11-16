import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "../dev-warning";
import Subject from "./RecordList.svelte";

const items = createRawSnippet(() => ({
    render: () => '<li class="record-list-item">One record</li>',
}));

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("RecordList", () => {
    test("renders a ul named by its status, with the status as data", () => {
        render(Subject, {
            props: { status: "known", statusLabel: "Vital signs", children: items },
        });
        const list = screen.getByRole("list", { name: "Vital signs" });
        expect(list.tagName).toBe("UL");
        expect(list.getAttribute("class")).toContain("record-list");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No vital signs recorded (none-known)"],
        ["not-recorded", "No vital signs recorded (not-recorded)"],
        ["unavailable", "No vital signs recorded (unavailable)"],
        ["omitted", "No vital signs recorded (omitted)"],
    ] as const)("status %s is shown as the list's one item, never blank", (status, words) => {
        render(Subject, { props: { status, statusLabel: words } });
        const list = screen.getByRole("list", { name: words });
        const only = list.querySelectorAll("li");
        expect(only).toHaveLength(1);
        expect(only[0].className).toBe("record-list-status");
        expect(only[0].textContent).toBe(words);
        expect(list.getAttribute("data-status")).toBe(status);
    });

    test("label overrides the accessible name", () => {
        render(Subject, {
            props: {
                status: "none-known",
                statusLabel: "No vital signs recorded",
                label: "Record",
            },
        });
        expect(screen.getByRole("list", { name: "Record" })).toBeTruthy();
    });

    test("warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { statusLabel: "Vital signs" } as never });
        expect(
            spy.mock.calls.some((call) => String(call[0]).includes("RecordList has no status")),
        ).toBe(true);
    });
});
