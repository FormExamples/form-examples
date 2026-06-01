import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import TimerButton from "./TimerButton.svelte";

describe("TimerButton", () => {
    test("renders with content", () => {
        render(TimerButton, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("timer-button");
    });
});
