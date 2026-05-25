import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ThemePickerButton from "./ThemePickerButton.svelte";

describe("ThemePickerButton", () => {
    test("renders with content", () => {
        render(ThemePickerButton, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("theme-picker-button");
    });
});
