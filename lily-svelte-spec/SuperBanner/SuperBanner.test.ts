import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import SuperBanner from "./SuperBanner.svelte";

describe("SuperBanner", () => {
    test("renders with content", () => {
        render(SuperBanner, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("super-banner");
    });
});
