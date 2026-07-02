import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./StickyPromoBanner.svelte";

// Helper to create a Svelte 5 snippet for HTML content.
function htmlSnippet(html: string) {
    return (($$anchor: Comment) => {
        const template = document.createElement("template");
        template.innerHTML = html;
        $$anchor.before(template.content.cloneNode(true));
    }) as any;
}

const baseProps = {
    label: "Promotional banner",
    dismissLabel: "Dismiss banner",
};

describe("StickyPromoBanner", () => {
    test("renders as an aside with the sticky-promo-banner class", () => {
        const { container } = render(Subject, { props: { ...baseProps } });

        const root = container.querySelector("aside.sticky-promo-banner") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("applies role=complementary and aria-label", () => {
        const { container } = render(Subject, { props: { ...baseProps } });

        const root = container.querySelector("aside") as HTMLElement;
        expect(root.getAttribute("role")).toBe("complementary");
        expect(root.getAttribute("aria-label")).toBe("Promotional banner");
    });

    test("defaults to open and position bottom", () => {
        const { container } = render(Subject, { props: { ...baseProps } });

        const root = container.querySelector("aside") as HTMLElement;
        expect(root.hasAttribute("hidden")).toBe(false);
        expect(root.getAttribute("data-position")).toBe("bottom");
    });

    test("supports position top", () => {
        const { container } = render(Subject, { props: {
            ...baseProps,
            position: "top",
        }});

        const root = container.querySelector("aside") as HTMLElement;
        expect(root.getAttribute("data-position")).toBe("top");
        const style = root.getAttribute("style") || "";
        expect(style).toContain("top: 0");
    });

    test("uses bottom: 0 inline style by default", () => {
        const { container } = render(Subject, { props: { ...baseProps } });

        const root = container.querySelector("aside") as HTMLElement;
        const style = root.getAttribute("style") || "";
        expect(style).toContain("position: fixed");
        expect(style).toContain("bottom: 0");
        expect(style).toContain("left: 0");
        expect(style).toContain("right: 0");
    });

    test("hides when open is false", () => {
        const { container } = render(Subject, { props: {
            ...baseProps,
            open: false,
        }});

        const root = container.querySelector("aside") as HTMLElement;
        expect(root.hasAttribute("hidden")).toBe(true);
    });

    test("does not render dismiss button when ondismiss is not provided", () => {
        const { container } = render(Subject, { props: { ...baseProps } });

        const button = container.querySelector("button.sticky-promo-banner-dismiss");
        expect(button).toBeNull();
    });

    test("renders dismiss button when ondismiss is provided", () => {
        const { container } = render(Subject, { props: {
            ...baseProps,
            ondismiss: () => {},
        }});

        const button = container.querySelector("button.sticky-promo-banner-dismiss") as HTMLButtonElement;
        expect(button).toBeTruthy();
        expect(button.getAttribute("aria-label")).toBe("Dismiss banner");
        expect(button.getAttribute("type")).toBe("button");
    });

    test("invokes ondismiss when dismiss button is clicked", async () => {
        const user: UserEvent = userEvent.setup();
        const handleDismiss = vi.fn();
        render(Subject, { props: {
            ...baseProps,
            ondismiss: handleDismiss,
        }});

        await user.click(screen.getByRole("button", { name: "Dismiss banner" }));
        expect(handleDismiss).toHaveBeenCalledOnce();
    });

    test("renders children content", () => {
        const { container } = render(Subject, { props: {
            ...baseProps,
            children: htmlSnippet("<p data-testid='promo'>Special offer</p>"),
        }});

        const content = container.querySelector("[data-testid='promo']") as HTMLElement;
        expect(content).toBeTruthy();
        expect(content.textContent).toContain("Special offer");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            ...baseProps,
            class: "extra",
        }});

        const root = container.querySelector("aside") as HTMLElement;
        expect(root.className).toContain("sticky-promo-banner");
        expect(root.className).toContain("extra");
    });
});
