import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./GoToNextSection.svelte";

describe("GoToNextSection", () => {
    test("renders root with class go-to-next-section", () => {
        const { container } = render(Subject, { props: { href: "#section", label: "Test" } });
        expect(container.querySelector(".go-to-next-section")).toBeTruthy();
    });
});
