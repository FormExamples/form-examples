import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DigitalObjectIdentifierLink from "./DigitalObjectIdentifierLink.svelte";

describe("DigitalObjectIdentifierLink", () => {
    test("renders with content", () => {
        render(DigitalObjectIdentifierLink, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("digital-object-identifier-link");
    });
});
