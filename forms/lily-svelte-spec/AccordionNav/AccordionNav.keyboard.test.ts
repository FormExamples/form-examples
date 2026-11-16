import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";

import Subject from "./AccordionNav.svelte";

const children = (html: string) =>
    createRawSnippet(() => ({ render: () => `<span>${html}</span>` }));

describe("AccordionNav keyboard", () => {
    test("is a named navigation landmark", async () => {
        render(Subject, { props: { ...{ label: "Sections" }, children: children("Content") } });

        const el = document.querySelector("nav.accordion-nav");
        expect(el?.hasAttribute("role")).toBe(false);
        expect(el?.getAttribute("aria-label")).toBe("Sections");
    });
});
