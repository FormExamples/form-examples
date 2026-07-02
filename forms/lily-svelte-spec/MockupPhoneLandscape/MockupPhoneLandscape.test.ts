import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./MockupPhoneLandscape.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("MockupPhoneLandscape", () => {
    test("renders root with class mockup-phone-landscape", () => {
        const { container } = render(Subject, { props: { label: "Test", children: textSnippet("Body") } });
        expect(container.querySelector(".mockup-phone-landscape")).toBeTruthy();
    });
});
