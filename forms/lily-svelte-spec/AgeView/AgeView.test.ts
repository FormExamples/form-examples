import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import { ageParts, toIsoDuration } from "../clinical-format";
import Subject from "./AgeView.svelte";

const root = () => document.querySelector(".age-view") as HTMLElement;

describe("AgeView", () => {
    test("renders the consumer's words and the duration as data", () => {
        render(Subject, { props: { value: "3 weeks 2 days", duration: "P23D" } });
        expect(root().tagName).toBe("SPAN");
        expect(root().textContent).toBe("3 weeks 2 days");
        expect(root().getAttribute("data-duration")).toBe("P23D");
    });

    test("label renders as hidden text", () => {
        render(Subject, { props: { label: "Age", value: "76 years" } });
        expect(root().querySelector(".screen-reader-span")?.textContent).toBe("Age ");
        expect(root().hasAttribute("aria-label")).toBe(false);
    });

    test("works with ageParts and toIsoDuration", () => {
        const parts = ageParts("2026-10-20", "2026-11-14");
        const value = parts.map((p) => `${p.value} ${p.unit}`).join(" ");
        render(Subject, { props: { value, duration: toIsoDuration(parts) } });
        expect(root().textContent).toBe("25 days");
        expect(root().getAttribute("data-duration")).toBe("P25D");
    });
});
