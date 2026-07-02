import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";
import Subject from "./Container.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Container", () => {
    test("renders root with class container", () => {
        const { container } = render(Subject, { props: { children: textSnippet("Body") } });
        expect(container.querySelector(".container")).toBeTruthy();
    });
});
