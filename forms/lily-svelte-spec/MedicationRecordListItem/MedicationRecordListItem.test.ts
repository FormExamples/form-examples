import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "../dev-warning";
import Subject from "./MedicationRecordListItem.svelte";

const root = () => document.querySelector(".medication-record-list-item") as HTMLElement;
const part = (name: string) => root().querySelector(`.medication-record-list-item-${name}`);

const content = createRawSnippet(() => ({
    render: () => '<span class="content">ramipril 5 mg capsule, oral, once a day</span>',
}));

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("MedicationRecordListItem", () => {
    test("renders an li with each part, each status as text and data", () => {
        render(Subject, {
            props: {
                status: "active",
                statusLabel: "Active",
                effective: "2025-03-03",
                effectiveLabel: "Since 3 Mar 2025",
                children: content,
            },
        });
        expect(root().tagName).toBe("LI");
        expect(root().getAttribute("data-status")).toBe("active");
        expect(part("status")?.textContent).toBe("Active");
        expect(part("effective")?.tagName).toBe("TIME");
        expect(part("effective")?.getAttribute("datetime")).toBe("2025-03-03");
        expect(part("effective")?.textContent).toBe("Since 3 Mar 2025");
        expect(root().querySelector(".content")?.textContent).toBe(
            "ramipril 5 mg capsule, oral, once a day",
        );
    });

    test("renders only the parts that are given", () => {
        render(Subject, { props: {} });
        expect(part("status")).toBeNull();
        expect(part("effective")).toBeNull();
        expect(root().hasAttribute("data-status")).toBe(false);
    });

    test("warns when a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { status: "active" } as never });
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("MedicationRecordListItem has no statusLabel"),
            ),
        ).toBe(true);
    });
});
