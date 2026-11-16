import { render } from "@testing-library/svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "../dev-warning";
import Subject from "./ProcedureRecordListItem.svelte";

const root = () => document.querySelector(".procedure-record-list-item") as HTMLElement;
const part = (name: string) => root().querySelector(`.procedure-record-list-item-${name}`);

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("ProcedureRecordListItem", () => {
    test("renders an li with each part, each status as text and data", () => {
        render(Subject, {
            props: {
                procedure: "Appendectomy",
                status: "completed",
                statusLabel: "Completed",
                performed: "2018-04-22",
                performedLabel: "22 Apr 2018",
            },
        });
        expect(root().tagName).toBe("LI");
        expect(root().getAttribute("data-status")).toBe("completed");
        expect(part("procedure")?.textContent).toBe("Appendectomy");
        expect(part("status")?.textContent).toBe("Completed");
        expect(part("performed")?.tagName).toBe("TIME");
        expect(part("performed")?.getAttribute("datetime")).toBe("2018-04-22");
        expect(part("performed")?.textContent).toBe("22 Apr 2018");
    });

    test("renders only the parts that are given", () => {
        render(Subject, { props: { procedure: "Appendectomy" } });
        expect(part("status")).toBeNull();
        expect(part("performed")).toBeNull();
        expect(root().hasAttribute("data-status")).toBe(false);
    });

    test("warns when a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { procedure: "Appendectomy", status: "completed" } as never });
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("ProcedureRecordListItem has no statusLabel"),
            ),
        ).toBe(true);
    });
});
