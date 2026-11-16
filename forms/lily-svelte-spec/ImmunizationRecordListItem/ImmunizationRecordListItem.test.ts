import { render } from "@testing-library/svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "../dev-warning";
import Subject from "./ImmunizationRecordListItem.svelte";

const root = () => document.querySelector(".immunization-record-list-item") as HTMLElement;
const part = (name: string) => root().querySelector(`.immunization-record-list-item-${name}`);

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("ImmunizationRecordListItem", () => {
    test("renders an li with each part, each status as text and data", () => {
        render(Subject, {
            props: {
                vaccine: "MMR vaccine",
                occurrence: "2025-09-12",
                occurrenceLabel: "12 Sep 2025",
                doseNumberLabel: "Dose 2 of 2",
                status: "completed",
                statusLabel: "Given",
                lotNumber: "AB1234",
            },
        });
        expect(root().tagName).toBe("LI");
        expect(root().getAttribute("data-status")).toBe("completed");
        expect(part("vaccine")?.textContent).toBe("MMR vaccine");
        expect(part("occurrence")?.tagName).toBe("TIME");
        expect(part("occurrence")?.getAttribute("datetime")).toBe("2025-09-12");
        expect(part("occurrence")?.textContent).toBe("12 Sep 2025");
        expect(part("dose-number")?.textContent).toBe("Dose 2 of 2");
        expect(part("status")?.textContent).toBe("Given");
        expect(part("lot-number")?.textContent).toBe("AB1234");
    });

    test("renders only the parts that are given", () => {
        render(Subject, { props: { vaccine: "MMR vaccine" } });
        expect(part("occurrence")).toBeNull();
        expect(part("dose-number")).toBeNull();
        expect(part("status")).toBeNull();
        expect(part("lot-number")).toBeNull();
        expect(root().hasAttribute("data-status")).toBe(false);
    });

    test("warns when a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { vaccine: "MMR vaccine", status: "completed" } as never });
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("ImmunizationRecordListItem has no statusLabel"),
            ),
        ).toBe(true);
    });
});
