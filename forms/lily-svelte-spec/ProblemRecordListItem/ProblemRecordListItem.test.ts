import { render } from "@testing-library/svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "../dev-warning";
import Subject from "./ProblemRecordListItem.svelte";

const root = () => document.querySelector(".problem-record-list-item") as HTMLElement;
const part = (name: string) => root().querySelector(`.problem-record-list-item-${name}`);

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("ProblemRecordListItem", () => {
    test("renders an li with each part, each status as text and data", () => {
        render(Subject, {
            props: {
                condition: "Type 2 diabetes",
                clinicalStatus: "active",
                clinicalStatusLabel: "Active",
                verificationStatus: "confirmed",
                verificationStatusLabel: "Confirmed",
                severityLabel: "Moderate",
                onset: "2019-06-01",
                onsetLabel: "Since June 2019",
                abatement: "2024-01-15",
                abatementLabel: "Resolved 15 Jan 2024",
            },
        });
        expect(root().tagName).toBe("LI");
        expect(root().getAttribute("data-clinical-status")).toBe("active");
        expect(root().getAttribute("data-verification-status")).toBe("confirmed");
        expect(part("condition")?.textContent).toBe("Type 2 diabetes");
        expect(part("clinical-status")?.textContent).toBe("Active");
        expect(part("verification-status")?.textContent).toBe("Confirmed");
        expect(part("severity")?.textContent).toBe("Moderate");
        expect(part("onset")?.tagName).toBe("TIME");
        expect(part("onset")?.getAttribute("datetime")).toBe("2019-06-01");
        expect(part("onset")?.textContent).toBe("Since June 2019");
        expect(part("abatement")?.tagName).toBe("TIME");
        expect(part("abatement")?.getAttribute("datetime")).toBe("2024-01-15");
        expect(part("abatement")?.textContent).toBe("Resolved 15 Jan 2024");
    });

    test("renders only the parts that are given", () => {
        render(Subject, { props: { condition: "Type 2 diabetes" } });
        expect(part("clinical-status")).toBeNull();
        expect(part("verification-status")).toBeNull();
        expect(part("severity")).toBeNull();
        expect(part("onset")).toBeNull();
        expect(part("abatement")).toBeNull();
        expect(root().hasAttribute("data-clinical-status")).toBe(false);
        expect(root().hasAttribute("data-verification-status")).toBe(false);
    });

    test("warns when a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, {
            props: { condition: "Type 2 diabetes", clinicalStatus: "active" } as never,
        });
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("ProblemRecordListItem has no clinicalStatusLabel"),
            ),
        ).toBe(true);
    });
});
