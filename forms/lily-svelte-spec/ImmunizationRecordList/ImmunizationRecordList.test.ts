import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "../dev-warning";
import Subject from "./ImmunizationRecordList.svelte";

const items = createRawSnippet(() => ({
    render: () => '<li class="immunization-record-list-item">One record</li>',
}));

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("ImmunizationRecordList", () => {
    test("renders a ul named by its status, with the status as data", () => {
        render(Subject, {
            props: { status: "known", statusLabel: "Immunizations", children: items },
        });
        const list = screen.getByRole("list", { name: "Immunizations" });
        expect(list.tagName).toBe("UL");
        expect(list.getAttribute("class")).toContain("immunization-record-list");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".immunization-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No immunizations recorded (none-known)"],
        ["not-recorded", "No immunizations recorded (not-recorded)"],
        ["unavailable", "No immunizations recorded (unavailable)"],
        ["omitted", "No immunizations recorded (omitted)"],
    ] as const)("status %s is shown as the list's one item, never blank", (status, words) => {
        render(Subject, { props: { status, statusLabel: words } });
        const list = screen.getByRole("list", { name: words });
        const only = list.querySelectorAll("li");
        expect(only).toHaveLength(1);
        expect(only[0].className).toBe("immunization-record-list-status");
        expect(only[0].textContent).toBe(words);
        expect(list.getAttribute("data-status")).toBe(status);
    });

    test("label overrides the accessible name", () => {
        render(Subject, {
            props: {
                status: "none-known",
                statusLabel: "No immunizations recorded",
                label: "Record",
            },
        });
        expect(screen.getByRole("list", { name: "Record" })).toBeTruthy();
    });

    test("warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { statusLabel: "Immunizations" } as never });
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("ImmunizationRecordList has no status"),
            ),
        ).toBe(true);
    });
});
