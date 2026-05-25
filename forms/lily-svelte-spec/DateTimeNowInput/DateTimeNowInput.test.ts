import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DateTimeNowInput from "./DateTimeNowInput.svelte";

describe("DateTimeNowInput", () => {
    test("renders with content", () => {
        render(DateTimeNowInput, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("date-time-now-input");
    });
});
