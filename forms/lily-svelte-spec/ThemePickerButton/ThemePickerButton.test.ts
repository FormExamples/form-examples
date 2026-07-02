import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ThemeSelectButton from "./ThemeSelectButton.svelte";

describe("ThemeSelectButton", () => {
    test("renders with content", () => {
        render(ThemeSelectButton, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("theme-select-button");
    });
});
