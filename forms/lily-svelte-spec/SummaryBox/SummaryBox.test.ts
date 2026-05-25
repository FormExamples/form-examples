import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./SummaryBox.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("SummaryBox", () => {
    test("renders as an aside with the summary-box class", () => {
        const { container } = render(Subject, { props: {
            heading: "Key takeaways",
        }});

        const root = container.querySelector("aside.summary-box") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("uses heading as default aria-label", () => {
        const { container } = render(Subject, { props: {
            heading: "Key takeaways",
        }});

        const aside = container.querySelector("aside") as HTMLElement;
        expect(aside.getAttribute("aria-label")).toBe("Key takeaways");
    });

    test("overrides aria-label when label provided", () => {
        const { container } = render(Subject, { props: {
            heading: "Key takeaways",
            label: "Article summary",
        }});

        const aside = container.querySelector("aside") as HTMLElement;
        expect(aside.getAttribute("aria-label")).toBe("Article summary");
    });

    test("renders heading inside h3", () => {
        const { container } = render(Subject, { props: {
            heading: "Hello",
        }});

        const h3 = container.querySelector("h3.summary-box-heading") as HTMLElement;
        expect(h3.textContent).toBe("Hello");
    });

    test("renders children inside body", () => {
        const { container } = render(Subject, { props: {
            heading: "Title",
            children: textSnippet("Body content"),
        }});

        const body = container.querySelector("div.summary-box-body") as HTMLElement;
        expect(body.textContent).toContain("Body content");
    });

    test("renders empty body when no children", () => {
        const { container } = render(Subject, { props: {
            heading: "Title",
        }});

        const body = container.querySelector("div.summary-box-body") as HTMLElement;
        expect(body).toBeTruthy();
        expect(body.textContent).toBe("");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            heading: "X",
            class: "extra",
        }});

        const root = container.querySelector("aside") as HTMLElement;
        expect(root.className).toContain("summary-box");
        expect(root.className).toContain("extra");
    });
});
