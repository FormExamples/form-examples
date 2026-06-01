import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Question from "./Question.svelte";

describe("Question", () => {
    test("renders with content", () => {
        render(Question, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("question");
    });
});
