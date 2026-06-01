import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./ElladaDematerialisedSecuritiesSystemView.svelte";

describe("ElladaDematerialisedSecuritiesSystemView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Dematerialised Securities System", value: "test-value" } });

        const el = screen.getByLabelText("Dematerialised Securities System");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("ellada-dematerialised-securities-system-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Dematerialised Securities System", value: "test-value" } });

        const el = screen.getByLabelText("Dematerialised Securities System");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Dematerialised Securities System" } });

        const el = screen.getByLabelText("Dematerialised Securities System");
        expect(el.getAttribute("aria-label")).toBe("Dematerialised Securities System");
    });
});
