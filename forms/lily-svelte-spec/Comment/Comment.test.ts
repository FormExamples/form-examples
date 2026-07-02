import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Comment from "./Comment.svelte";

describe("Comment", () => {
    test("renders with content", () => {
        render(Comment, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("comment");
    });
});
