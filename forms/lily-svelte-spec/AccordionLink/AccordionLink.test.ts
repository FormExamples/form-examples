import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import AccordionLink from "./AccordionLink.svelte";

describe("AccordionLink", () => {
    test("renders with content", () => {
        render(AccordionLink, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("accordion-link");
    });
});
