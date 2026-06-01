import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./PolskaPeselView.svelte";

describe("PolskaPeselView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "PESEL", value: "test-value" } });

        const el = screen.getByLabelText("PESEL");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("polska-pesel-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "PESEL", value: "test-value" } });

        const el = screen.getByLabelText("PESEL");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "PESEL" } });

        const el = screen.getByLabelText("PESEL");
        expect(el.getAttribute("aria-label")).toBe("PESEL");
    });
});
