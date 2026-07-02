import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./BulgariaEdinenGrazhdanskiNomerView.svelte";

describe("BulgariaEdinenGrazhdanskiNomerView", () => {
    test("renders with the correct class", () => {
        render(Subject, { props: { label: "Uniform Civil Number", value: "test-value" } });

        const el = screen.getByLabelText("Uniform Civil Number");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("bulgaria-edinen-grazhdanski-nomer-view");
    });

    test("renders the value as text content", () => {
        render(Subject, { props: { label: "Uniform Civil Number", value: "test-value" } });

        const el = screen.getByLabelText("Uniform Civil Number");
        expect(el.textContent).toBe("test-value");
    });

    test("has aria-label from the label prop", () => {
        render(Subject, { props: { label: "Uniform Civil Number" } });

        const el = screen.getByLabelText("Uniform Civil Number");
        expect(el.getAttribute("aria-label")).toBe("Uniform Civil Number");
    });
});
