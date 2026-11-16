import { render } from "@testing-library/svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "../dev-warning";
import Subject from "./ObservationView.svelte";

const root = () => document.querySelector(".observation-view") as HTMLElement;
const part = (name: string) => root().querySelector(`.observation-view-${name}`);

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("ObservationView", () => {
    test("renders a span with the value, unit, flag and range as parts", () => {
        render(Subject, {
            props: {
                value: "5.9",
                unit: "mmol/L",
                interpretation: "H",
                flagLabel: "High",
                range: "3.5–5.3",
            },
        });
        expect(root().tagName).toBe("SPAN");
        expect(part("value")?.textContent).toBe("5.9");
        expect(part("unit")?.textContent).toBe("mmol/L");
        expect(part("flag")?.textContent).toBe("High");
        expect(part("range")?.textContent).toBe("3.5–5.3");
    });

    test("joins value and unit with a no-break space", () => {
        render(Subject, { props: { value: "5.9", unit: "mmol/L" } });
        expect(root().textContent).toContain("5.9 mmol/L");
    });

    test("renders the interpretation code as data, and the flag only as the consumer's words", () => {
        render(Subject, {
            props: { value: "2.1", interpretation: "LL", flagLabel: "Critically low" },
        });
        expect(root().getAttribute("data-interpretation")).toBe("LL");
        expect(root().textContent).not.toContain("LL");
        expect(root().textContent).toContain("Critically low");
    });

    test("not-recorded and unavailable show different words, never a blank", () => {
        const { unmount } = render(Subject, {
            props: { status: "not-recorded", statusLabel: "Not recorded" },
        });
        expect(root().getAttribute("data-status")).toBe("not-recorded");
        expect(part("status")?.textContent).toBe("Not recorded");
        expect(part("value")).toBeNull();
        unmount();
        render(Subject, { props: { status: "unavailable", statusLabel: "Result unavailable" } });
        expect(root().getAttribute("data-status")).toBe("unavailable");
        expect(part("status")?.textContent).toBe("Result unavailable");
    });

    test.each([
        ["amended", "Amended"],
        ["corrected", "Corrected"],
        ["entered-in-error", "Entered in error"],
    ])("an %s result shows its value with its words beside it", (status, words) => {
        render(Subject, { props: { value: "5.9", status, statusLabel: words } as never });
        expect(root().getAttribute("data-status")).toBe(status);
        expect(part("value")?.textContent).toBe("5.9");
        expect(part("status")?.textContent).toBe(words);
    });

    test.each([
        ["cancelled", "Test cancelled"],
        ["masked", "Withheld"],
    ])("a %s result shows its words instead of a value", (status, words) => {
        render(Subject, { props: { value: "5.9", status, statusLabel: words } as never });
        expect(part("value")).toBeNull();
        expect(part("status")?.textContent).toBe(words);
    });

    test("a preliminary result shows its value and its status", () => {
        render(Subject, {
            props: { value: "140", status: "preliminary", statusLabel: "Preliminary" },
        });
        expect(part("value")?.textContent).toBe("140");
        expect(part("status")?.textContent).toBe("Preliminary");
    });

    test("label renders as hidden text, not aria-label", () => {
        render(Subject, { props: { label: "Potassium", value: "4.1" } });
        expect(root().querySelector(".screen-reader-span")?.textContent).toBe("Potassium ");
        expect(root().hasAttribute("aria-label")).toBe(false);
    });

    test("warns when an abnormal flag or a status has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { value: "5.9", interpretation: "H" } });
        render(Subject, { props: { status: "unavailable" } });
        const messages = spy.mock.calls.map((call) => String(call[0]));
        expect(messages.some((m) => m.includes("ObservationView has no flagLabel"))).toBe(true);
        expect(messages.some((m) => m.includes("ObservationView has no statusLabel"))).toBe(true);
    });

    test("a normal result needs no flag words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { value: "4.1", interpretation: "N" } });
        expect(spy).not.toHaveBeenCalled();
    });
});
