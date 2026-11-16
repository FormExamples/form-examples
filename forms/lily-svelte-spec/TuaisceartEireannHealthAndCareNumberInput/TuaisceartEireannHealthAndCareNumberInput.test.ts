import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TuaisceartEireannHealthAndCareNumberInput from "./TuaisceartEireannHealthAndCareNumberInput.svelte";

describe("TuaisceartEireannHealthAndCareNumberInput", () => {
    test("renders with content", () => {
        render(TuaisceartEireannHealthAndCareNumberInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain(
            "tuaisceart-eireann-health-and-care-number-input",
        );
    });
});
