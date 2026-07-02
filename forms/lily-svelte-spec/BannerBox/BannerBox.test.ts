import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import BannerBox from "./BannerBox.svelte";

describe("BannerBox", () => {
    test("renders with content", () => {
        render(BannerBox, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("banner-box");
    });
});
