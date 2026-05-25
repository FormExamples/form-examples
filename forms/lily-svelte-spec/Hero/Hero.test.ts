import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Hero from "./Hero.svelte";

describe("Hero", () => {
    test("renders with content", () => {
        render(Hero, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("hero");
    });
});
