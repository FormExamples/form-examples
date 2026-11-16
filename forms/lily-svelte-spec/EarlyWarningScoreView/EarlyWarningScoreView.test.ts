import { render } from "@testing-library/svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "../dev-warning";
import Subject from "./EarlyWarningScoreView.svelte";

const root = () => document.querySelector(".early-warning-score-view") as HTMLElement;
const part = (name: string) => root().querySelector(`.early-warning-score-view-${name}`);

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("EarlyWarningScoreView", () => {
    test("renders the system, score, band and escalation", () => {
        render(Subject, {
            props: {
                system: "NEWS2",
                score: 7,
                band: "high",
                bandLabel: "High",
                escalation: "Urgent response",
            },
        });
        expect(root().tagName).toBe("SPAN");
        expect(root().getAttribute("data-band")).toBe("high");
        expect(part("system")?.textContent).toBe("NEWS2");
        expect(part("score")?.textContent).toBe("7");
        expect(part("band")?.textContent).toBe("High");
        expect(part("escalation")?.textContent).toBe("Urgent response");
    });

    test("shows the score it is given and computes nothing", () => {
        render(Subject, { props: { score: "3" } });
        expect(part("score")?.textContent).toBe("3");
        expect(root().hasAttribute("data-band")).toBe(false);
    });

    test("warns when a band has no words", () => {
        const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, { props: { score: 7, band: "high" } });
        expect(spy.mock.calls.some((call) => String(call[0]).includes("has no bandLabel"))).toBe(
            true,
        );
    });
});
