import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Code from "./Code.svelte";

describe("Code", () => {
    test("renders with content", () => {
        render(Code, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("code");
    });
});
