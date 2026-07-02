import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Answer from "./Answer.svelte";

describe("Answer", () => {
    test("renders with content", () => {
        render(Answer, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("answer");
    });
});
