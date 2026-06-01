import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Person from "./Person.svelte";

describe("Person", () => {
    test("renders with content", () => {
        render(Person, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("person");
    });
});
