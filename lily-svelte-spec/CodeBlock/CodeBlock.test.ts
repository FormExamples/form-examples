import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import CodeBlock from "./CodeBlock.svelte";

describe("CodeBlock", () => {
    test("renders with content", () => {
        render(CodeBlock, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("code-block");
    });
});
