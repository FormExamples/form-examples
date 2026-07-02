import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./NederlandIdentiteitskaartNummerView.svelte";

describe("NederlandIdentiteitskaartNummerView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Dutch National Identity Card Number", value: "test-value" } });

        const el = screen.getByLabelText("Dutch National Identity Card Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("nederland-identiteitskaart-nummer-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Dutch National Identity Card Number", value: "test-value" } });

        const el = screen.getByLabelText("Dutch National Identity Card Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Dutch National Identity Card Number" } });

        const el = screen.getByLabelText("Dutch National Identity Card Number");
        expect(el.getAttribute("aria-label")).toBe("Dutch National Identity Card Number");
    });
});
