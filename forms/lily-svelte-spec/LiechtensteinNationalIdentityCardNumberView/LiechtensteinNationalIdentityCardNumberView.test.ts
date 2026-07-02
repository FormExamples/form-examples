import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./LiechtensteinNationalIdentityCardNumberView.svelte";

describe("LiechtensteinNationalIdentityCardNumberView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Liechtenstein National Identity Card Number", value: "test-value" } });

        const el = screen.getByLabelText("Liechtenstein National Identity Card Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("liechtenstein-national-identity-card-number-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Liechtenstein National Identity Card Number", value: "test-value" } });

        const el = screen.getByLabelText("Liechtenstein National Identity Card Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Liechtenstein National Identity Card Number" } });

        const el = screen.getByLabelText("Liechtenstein National Identity Card Number");
        expect(el.getAttribute("aria-label")).toBe("Liechtenstein National Identity Card Number");
    });
});
