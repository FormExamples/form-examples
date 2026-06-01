import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./PortugalNumeroDeIdentificacaoFiscalView.svelte";

describe("PortugalNumeroDeIdentificacaoFiscalView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Tax Identification Number", value: "test-value" } });

        const el = screen.getByLabelText("Tax Identification Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("portugal-numero-de-identificacao-fiscal-view");
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
