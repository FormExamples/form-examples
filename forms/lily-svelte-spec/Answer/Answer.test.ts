import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Answer from "./Answer.svelte";

describe("Answer", () => {
    test("renders with content", () => {
        render(Answer, { props: { label: "Test" } as any });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("answer");
    });

    test("is a named group when labelled", () => {
        const { container } = render(Answer, { props: { label: "Story" } as any });
        const root = container.querySelector(".answer");
        expect(root?.getAttribute("role")).toBe("group");
        expect(root?.getAttribute("aria-label")).toBe("Story");
    });

    test("has no role without a label", () => {
        const { container } = render(Answer, { props: {} as any });
        expect(container.querySelector(".answer")?.hasAttribute("role")).toBe(false);
    });
});
