import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./SkipLink.svelte";

describe("SkipLink", () => {
    test("renders a link", () => {
        render(Subject, { props: {} });
        expect(screen.getByRole("link")).toBeTruthy();
    });

    test("has default href #content", () => {
        render(Subject, { props: {} });
        expect((screen.getByRole("link") as HTMLAnchorElement).getAttribute("href")).toBe("#content");
    });

    test("has default label text", () => {
        render(Subject, { props: {} });
        expect(screen.getByText("Skip to content")).toBeTruthy();
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
