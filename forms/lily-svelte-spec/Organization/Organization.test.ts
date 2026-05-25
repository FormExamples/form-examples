import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Organization from "./Organization.svelte";

describe("Organization", () => {
    test("renders with content", () => {
        render(Organization, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("organization");
    });
});
