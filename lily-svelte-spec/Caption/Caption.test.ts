import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./Caption.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("Caption", () => {
    test("renders as a figcaption element", () => {
        render(Subject, { props: {
            "data-testid": "caption",
            children: textSnippet("A photo caption"),
        }});

        const caption = screen.getByTestId("caption");
        expect(caption.tagName.toLowerCase()).toBe("figcaption");
    });

    test("renders children content", () => {
        render(Subject, { props: {
            "data-testid": "caption",
            children: textSnippet("Figure 1: Revenue growth"),
        }});

        expect(screen.getByTestId("caption").textContent).toContain("Figure 1: Revenue growth");
    });

    test("applies id for aria-describedby references", () => {
        render(Subject, { props: {
            id: "chart-desc",
            "data-testid": "caption",
            children: textSnippet("Chart description"),
        }});

        expect(screen.getByTestId("caption").getAttribute("id")).toBe("chart-desc");
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: {
            "data-testid": "caption",
            "data-media": "image",
            children: textSnippet("Content"),
        }});

        expect(screen.getByTestId("caption").getAttribute("data-media")).toBe("image");
    });
});
