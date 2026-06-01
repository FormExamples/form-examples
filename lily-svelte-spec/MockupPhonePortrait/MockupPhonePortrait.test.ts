import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import MockupPhonePortrait from "./MockupPhonePortrait.svelte";

describe("MockupPhonePortrait", () => {
    test("renders with content", () => {
        render(MockupPhonePortrait, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("mockup-phone-portrait");
    });
});
