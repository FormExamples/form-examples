import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./ProgressBar.svelte";

describe("ProgressBar", () => {
    test("renders root with class progress-bar", () => {
        const { container } = render(Subject, { props: { value: 42, label: "Test" } });
        expect(container.querySelector(".progress-bar")).toBeTruthy();
    });
});
