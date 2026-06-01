import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Event from "./Event.svelte";

describe("Event", () => {
    test("renders with content", () => {
        render(Event, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("event");
    });
});
