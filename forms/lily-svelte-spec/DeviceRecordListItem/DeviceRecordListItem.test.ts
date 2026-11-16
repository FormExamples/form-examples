import { render } from "@testing-library/svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "../dev-warning";
import Subject from "./DeviceRecordListItem.svelte";

const root = () => document.querySelector(".device-record-list-item") as HTMLElement;
const part = (name: string) => root().querySelector(`.device-record-list-item-${name}`);

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("DeviceRecordListItem", () => {
    test("renders an li with each part, each status as text and data", () => {
        render(Subject, {
            props: {
                device: "Cardiac pacemaker",
                status: "active",
                statusLabel: "In use",
                timing: "2021-02-08",
                timingLabel: "Since 8 Feb 2021",
            },
        });
        expect(root().tagName).toBe("LI");
        expect(root().getAttribute("data-status")).toBe("active");
        expect(part("device")?.textContent).toBe("Cardiac pacemaker");
        expect(part("status")?.textContent).toBe("In use");
        expect(part("timing")?.tagName).toBe("TIME");
        expect(part("timing")?.getAttribute("datetime")).toBe("2021-02-08");
        expect(part("timing")?.textContent).toBe("Since 8 Feb 2021");
    });

    test("renders only the parts that are given", () => {
        render(Subject, { props: { device: "Cardiac pacemaker" } });
        expect(part("status")).toBeNull();
        expect(part("timing")).toBeNull();
        expect(root().hasAttribute("data-status")).toBe(false);
    });

    test("warns when a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { device: "Cardiac pacemaker", status: "active" } as never });
        expect(
            spy.mock.calls.some((call) =>
                String(call[0]).includes("DeviceRecordListItem has no statusLabel"),
            ),
        ).toBe(true);
    });
});
