import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import type { Component } from "svelte";

import Tested from "./SkipLink.svelte";

// These tests leave required props out on purpose, to prove what the component does then.
const Subject = Tested as unknown as Component<Record<string, unknown>>;

describe("SkipLink", () => {
    test("renders a link", () => {
        render(Subject, { props: {} });
        expect(screen.getByRole("link")).toBeTruthy();
    });

    test("has default href #content", () => {
        render(Subject, { props: {} });
        expect((screen.getByRole("link") as HTMLAnchorElement).getAttribute("href")).toBe(
            "#content",
        );
    });

    test("has no English text of its own", () => {
        render(Subject, { props: {} });
        expect(screen.getByRole("link").textContent?.trim()).toBe("");
    });

    test("supports custom href", () => {
        render(Subject, { props: { href: "#main" } });
        expect((screen.getByRole("link") as HTMLAnchorElement).getAttribute("href")).toBe("#main");
    });

    test("supports custom label", () => {
        render(Subject, { props: { label: "Jump to main" } });
        expect(screen.getByText("Jump to main")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "sl" } });
        expect(screen.getByTestId("sl")).toBeTruthy();
    });
});
