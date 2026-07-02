import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./AiLabel.svelte";

describe("AiLabel", () => {
    test("renders a span", () => {
        render(Subject, { props: {} });
        expect(document.querySelector(".ai-label")).toBeTruthy();
    });

    test("renders default text", () => {
        render(Subject, { props: {} });
        expect(screen.getByText("AI")).toBeTruthy();
    });

    test("renders custom text", () => {
        render(Subject, { props: { text: "AI generated" } });
        expect(screen.getByText("AI generated")).toBeTruthy();
    });

    test("has default aria-label", () => {
        render(Subject, { props: {} });
        expect(screen.getByLabelText("AI")).toBeTruthy();
    });

    test("has custom aria-label", () => {
        render(Subject, { props: { label: "AI content" } });
        expect(screen.getByLabelText("AI content")).toBeTruthy();
    });

    test("passes through attributes", () => {
        render(Subject, { props: { "data-testid": "ai" } });
        expect(screen.getByTestId("ai")).toBeTruthy();
    });
});
