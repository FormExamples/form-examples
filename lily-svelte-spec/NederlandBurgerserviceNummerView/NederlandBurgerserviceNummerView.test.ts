import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./NederlandBurgerserviceNummerView.svelte";

describe("NederlandBurgerserviceNummerView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Citizen Service Number", value: "test-value" } });

        const el = screen.getByLabelText("Citizen Service Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("nederland-burgerservice-nummer-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Citizen Service Number", value: "test-value" } });

        const el = screen.getByLabelText("Citizen Service Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Citizen Service Number" } });

        const el = screen.getByLabelText("Citizen Service Number");
        expect(el.getAttribute("aria-label")).toBe("Citizen Service Number");
    });
});
