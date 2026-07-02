import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./EspanaCodigoDeIdentificacionFiscalView.svelte";

describe("EspanaCodigoDeIdentificacionFiscalView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Tax Identification Code", value: "test-value" } });

        const el = screen.getByLabelText("Tax Identification Code");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("espana-codigo-de-identificacion-fiscal-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Tax Identification Code", value: "test-value" } });

        const el = screen.getByLabelText("Tax Identification Code");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Tax Identification Code" } });

        const el = screen.getByLabelText("Tax Identification Code");
        expect(el.getAttribute("aria-label")).toBe("Tax Identification Code");
    });
});
