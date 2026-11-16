import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Question from "./Question.svelte";

describe("Question", () => {
    test("renders with content", () => {
        render(Question, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("question");
    });

    test("is a named group when labelled", () => {
        const { container } = render(Question, { props: { label: "Story" } as any });
        const root = container.querySelector(".question");
        expect(root?.getAttribute("role")).toBe("group");
        expect(root?.getAttribute("aria-label")).toBe("Story");
    });

    test("has no role without a label", () => {
        const { container } = render(Question, { props: {} as any });
        expect(container.querySelector(".question")?.hasAttribute("role")).toBe(false);
    });
});
