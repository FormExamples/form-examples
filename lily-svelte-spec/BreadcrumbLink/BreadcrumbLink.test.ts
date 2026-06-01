import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import BreadcrumbLink from "./BreadcrumbLink.svelte";

describe("BreadcrumbLink", () => {
    test("renders with content", () => {
        render(BreadcrumbLink, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("breadcrumb-link");
    });
});
