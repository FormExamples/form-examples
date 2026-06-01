import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./GoToPreviousSection.svelte";

describe("GoToPreviousSection", () => {
    test("renders root with class go-to-previous-section", () => {
        const { container } = render(Subject, { props: { href: "#section", label: "Test" } });
        expect(container.querySelector(".go-to-previous-section")).toBeTruthy();
    });
});
