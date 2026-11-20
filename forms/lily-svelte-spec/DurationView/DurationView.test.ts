import { render } from "@testing-library/svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "../dev-warning";
import Subject from "./DurationView.svelte";

const root = () => document.querySelector(".duration-view") as HTMLElement;

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("DurationView", () => {
    test("renders a time whose datetime is the duration, holding the consumer's words", () => {
        render(Subject, { props: { value: "3 days 4 hours", duration: "P3DT4H", class: "extra" } });
        expect(root().tagName).toBe("TIME");
        expect(root().className).toContain("duration-view");
        expect(root().className).toContain("extra");
        expect(root().getAttribute("datetime")).toBe("P3DT4H");
        expect(root().textContent).toBe("3 days 4 hours");
        expect(root().hasAttribute("data-negative")).toBe(false);
    });

    test("a negative duration keeps its length as datetime and is marked data-negative", () => {
        render(Subject, { props: { value: "3 days early", duration: "-P3D" } });
        expect(root().getAttribute("datetime")).toBe("P3D");
        expect(root().hasAttribute("data-negative")).toBe(true);
        expect(root().textContent).toBe("3 days early");
    });

    test("a duration in years or months is no datetime, and warns", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { value: "2 years", duration: "P2Y" } });
        expect(root().hasAttribute("datetime")).toBe(false);
        expect(warn).toHaveBeenCalledWith(expect.stringContaining("DurationView has no duration"));
    });

    test("names the value with hidden text when a label is given", () => {
        render(Subject, { props: { value: "4 days", duration: "P4D", label: "Length of stay" } });
        expect(root().querySelector(".screen-reader-span")?.textContent).toBe("Length of stay ");
        expect(root().textContent).toBe("Length of stay 4 days");
    });

    test("warns when the words are missing", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { value: "", duration: "PT5M" } });
        expect(warn).toHaveBeenCalledWith(expect.stringContaining("DurationView has no value"));
    });

    test("passes through attributes", () => {
        render(Subject, { props: { value: "5 minutes", duration: "PT5M", "data-testid": "d" } });
        expect(root().getAttribute("data-testid")).toBe("d");
    });
});
