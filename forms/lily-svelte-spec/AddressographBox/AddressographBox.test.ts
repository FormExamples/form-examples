import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import AddressographBox from "./AddressographBox.svelte";

describe("AddressographBox", () => {
    test("renders with content", () => {
        render(AddressographBox, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("addressograph-box");
    });
});
