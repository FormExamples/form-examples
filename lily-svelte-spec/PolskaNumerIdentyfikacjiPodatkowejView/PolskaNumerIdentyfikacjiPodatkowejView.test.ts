import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./PolskaNumerIdentyfikacjiPodatkowejView.svelte";

describe("PolskaNumerIdentyfikacjiPodatkowejView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Tax Identification Number", value: "test-value" } });

        const el = screen.getByLabelText("Tax Identification Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("polska-numer-identyfikacji-podatkowej-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Tax Identification Number", value: "test-value" } });

        const el = screen.getByLabelText("Tax Identification Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Tax Identification Number" } });

        const el = screen.getByLabelText("Tax Identification Number");
        expect(el.getAttribute("aria-label")).toBe("Tax Identification Number");
    });
});
