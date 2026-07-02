import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Loading from "./Loading.svelte";

describe("Loading", () => {
    test("renders with content", () => {
        render(Loading, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("loading");
    });
});
