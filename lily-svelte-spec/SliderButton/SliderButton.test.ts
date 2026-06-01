import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SliderButton from "./SliderButton.svelte";

describe("SliderButton", () => {
    test("renders with content", () => {
        render(SliderButton, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("slider-button");
    });
});
