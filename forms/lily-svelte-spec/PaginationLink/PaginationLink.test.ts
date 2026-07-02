import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import PaginationLink from "./PaginationLink.svelte";

describe("PaginationLink", () => {
    test("renders with content", () => {
        render(PaginationLink, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("pagination-link");
    });
});
