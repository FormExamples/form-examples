import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./LietuvaPasasView.svelte";

describe("LietuvaPasasView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Lithuanian Passport", value: "test-value" } });

        const el = screen.getByLabelText("Lithuanian Passport");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("lietuva-pasas-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Lithuanian Passport", value: "test-value" } });

        const el = screen.getByLabelText("Lithuanian Passport");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Lithuanian Passport" } });

        const el = screen.getByLabelText("Lithuanian Passport");
        expect(el.getAttribute("aria-label")).toBe("Lithuanian Passport");
    });
});
