import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "../dev-warning";
import Subject from "./DeviceRecordList.svelte";

const items = createRawSnippet(() => ({
    render: () => '<li class="device-record-list-item">One record</li>',
}));

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("DeviceRecordList", () => {
    test("renders a ul named by its status, with the status as data", () => {
        render(Subject, {
            props: { status: "known", statusLabel: "Medical devices", children: items },
        });
        const list = screen.getByRole("list", { name: "Medical devices" });
        expect(list.tagName).toBe("UL");
        expect(list.getAttribute("class")).toContain("device-record-list");
        expect(list.getAttribute("data-status")).toBe("known");
        expect(list.querySelector(".device-record-list-status")).toBeNull();
        expect(list.textContent).toContain("One record");
    });

    test.each([
        ["none-known", "No known medical devices (none-known)"],
        ["not-recorded", "No known medical devices (not-recorded)"],
        ["unavailable", "No known medical devices (unavailable)"],
        ["omitted", "No known medical devices (omitted)"],
    ] as const)("status %s is shown as the list's one item, never blank", (status, words) => {
        render(Subject, { props: { status, statusLabel: words } });
        const list = screen.getByRole("list", { name: words });
        const only = list.querySelectorAll("li");
        expect(only).toHaveLength(1);
        expect(only[0].className).toBe("device-record-list-status");
        expect(only[0].textContent).toBe(words);
        expect(list.getAttribute("data-status")).toBe(status);
    });

    test("label overrides the accessible name", () => {
        render(Subject, {
            props: {
                status: "none-known",
                statusLabel: "No known medical devices",
                label: "Record",
            },
        });
        expect(screen.getByRole("list", { name: "Record" })).toBeTruthy();
    });

    test("warns when the status is missing", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { statusLabel: "Medical devices" } as never });
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("DeviceRecordList has no status"),
            ),
        ).toBe(true);
    });
});
