import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import type { Component } from "svelte";

import Tested from "./TextInputWithSearch.svelte";

// These tests leave required props out on purpose, to prove what the component does then.
const TextInputWithSearch = Tested as unknown as Component<Record<string, unknown>>;

describe("TextInputWithSearch", () => {
    test("renders with content", () => {
        render(TextInputWithSearch, { props: { label: "Test" } });
        const el = screen.getByLabelText("Test");
        expect(el).toBeTruthy();
        expect(el.getAttribute("class")).toContain("text-input-with-search");
    });
});
