import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TuaisceartEireannHealthAndCareNumberView from "./TuaisceartEireannHealthAndCareNumberView.svelte";

describe("TuaisceartEireannHealthAndCareNumberView", () => {
    test("renders with content", () => {
        render(TuaisceartEireannHealthAndCareNumberView, { props: { label: "Test" } });
        const el = document.querySelector(
            ".tuaisceart-eireann-health-and-care-number-view",
        ) as HTMLElement;
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain(
            "tuaisceart-eireann-health-and-care-number-view",
        );
    });
});
