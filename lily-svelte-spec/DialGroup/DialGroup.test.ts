import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import DialGroup from "./DialGroup.svelte";

describe("DialGroup", () => {
    test("renders with content", () => {
        render(DialGroup, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("dial-group");
    });
});
