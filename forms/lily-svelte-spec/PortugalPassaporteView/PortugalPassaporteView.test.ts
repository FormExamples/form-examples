import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./PortugalPassaporteView.svelte";

describe("PortugalPassaporteView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Portuguese Passport", value: "test-value" } });

        const el = screen.getByLabelText("Portuguese Passport");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("portugal-passaporte-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Portuguese Passport", value: "test-value" } });

        const el = screen.getByLabelText("Portuguese Passport");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Portuguese Passport" } });

        const el = screen.getByLabelText("Portuguese Passport");
        expect(el.getAttribute("aria-label")).toBe("Portuguese Passport");
    });
});
