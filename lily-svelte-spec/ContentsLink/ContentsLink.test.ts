import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import ContentsLink from "./ContentsLink.svelte";

describe("ContentsLink", () => {
    test("renders with content", () => {
        render(ContentsLink, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("contents-link");
    });
});
