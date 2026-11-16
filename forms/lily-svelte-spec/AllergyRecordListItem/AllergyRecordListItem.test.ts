import { render } from "@testing-library/svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "../dev-warning";
import Subject from "./AllergyRecordListItem.svelte";

const root = () => document.querySelector(".allergy-record-list-item") as HTMLElement;
const part = (name: string) => root().querySelector(`.allergy-record-list-item-${name}`);

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("AllergyRecordListItem", () => {
    test("renders an li with each part, each status as text and data", () => {
        render(Subject, {
            props: {
                substance: "Penicillin",
                reaction: "Anaphylaxis",
                severity: "severe",
                severityLabel: "Severe",
                criticality: "high",
                criticalityLabel: "High risk",
                clinicalStatus: "active",
                clinicalStatusLabel: "Active",
                verificationStatus: "confirmed",
                verificationStatusLabel: "Confirmed",
                typeLabel: "Allergy",
                categoryLabel: "Medication",
                updated: "2026-11-03",
                updatedLabel: "Updated 3 Nov 2026",
            },
        });
        expect(root().tagName).toBe("LI");
        expect(root().getAttribute("data-severity")).toBe("severe");
        expect(root().getAttribute("data-criticality")).toBe("high");
        expect(root().getAttribute("data-clinical-status")).toBe("active");
        expect(root().getAttribute("data-verification-status")).toBe("confirmed");
        expect(part("substance")?.textContent).toBe("Penicillin");
        expect(part("reaction")?.textContent).toBe("Anaphylaxis");
        expect(part("severity")?.textContent).toBe("Severe");
        expect(part("criticality")?.textContent).toBe("High risk");
        expect(part("clinical-status")?.textContent).toBe("Active");
        expect(part("verification-status")?.textContent).toBe("Confirmed");
        expect(part("type")?.textContent).toBe("Allergy");
        expect(part("category")?.textContent).toBe("Medication");
        expect(part("updated")?.tagName).toBe("TIME");
        expect(part("updated")?.getAttribute("datetime")).toBe("2026-11-03");
        expect(part("updated")?.textContent).toBe("Updated 3 Nov 2026");
    });

    test("renders only the parts that are given", () => {
        render(Subject, { props: { substance: "Penicillin" } });
        expect(part("reaction")).toBeNull();
        expect(part("severity")).toBeNull();
        expect(part("criticality")).toBeNull();
        expect(part("clinical-status")).toBeNull();
        expect(part("verification-status")).toBeNull();
        expect(part("type")).toBeNull();
        expect(part("category")).toBeNull();
        expect(part("updated")).toBeNull();
        expect(root().hasAttribute("data-severity")).toBe(false);
        expect(root().hasAttribute("data-criticality")).toBe(false);
        expect(root().hasAttribute("data-clinical-status")).toBe(false);
        expect(root().hasAttribute("data-verification-status")).toBe(false);
    });

    test("warns when a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { substance: "Penicillin", severity: "severe" } as never });
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("AllergyRecordListItem has no severityLabel"),
            ),
        ).toBe(true);
    });
});
