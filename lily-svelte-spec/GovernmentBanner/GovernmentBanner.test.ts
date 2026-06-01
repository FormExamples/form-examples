import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./GovernmentBanner.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

const baseProps = {
    label: "Official government website",
    headerText: "An official website of the United States government",
    expandLabel: "Here's how you know",
};

describe("GovernmentBanner", () => {
    test("renders as an aside with the government-banner class", () => {
        const { container } = render(Subject, { props: { ...baseProps } });

        const root = container.querySelector("aside.government-banner") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("applies aria-label and renders header text", () => {
        const { container } = render(Subject, { props: { ...baseProps } });

        const aside = container.querySelector("aside") as HTMLElement;
        expect(aside.getAttribute("aria-label")).toBe("Official government website");
        expect(aside.textContent).toContain("An official website of the United States government");
    });

    test("renders a toggle button with expand label and aria-expanded false by default", () => {
        render(Subject, { props: { ...baseProps } });

        const button = screen.getByRole("button", { name: "Here's how you know" });
        expect(button).toBeTruthy();
        expect(button.getAttribute("aria-expanded")).toBe("false");
    });

    test("aria-controls points to a panel id matching the panel element", () => {
        const { container } = render(Subject, { props: { ...baseProps } });

        const button = container.querySelector("button.government-banner-toggle") as HTMLElement;
        const panel = container.querySelector("div.government-banner-details") as HTMLElement;
        const controls = button.getAttribute("aria-controls");
        expect(controls).toBeTruthy();
        expect(panel.getAttribute("id")).toBe(controls);
    });

    test("hides the panel when not expanded", () => {
        const { container } = render(Subject, { props: { ...baseProps } });

        const panel = container.querySelector("div.government-banner-details") as HTMLElement;
        expect(panel.hasAttribute("hidden")).toBe(true);
    });

    test("shows the panel when expanded", () => {
        const { container } = render(Subject, { props: { ...baseProps, expanded: true } });

        const panel = container.querySelector("div.government-banner-details") as HTMLElement;
        expect(panel.hasAttribute("hidden")).toBe(false);
    });

    test("invokes ontoggle with the next expanded state", async () => {
        const user: UserEvent = userEvent.setup();
        const handleToggle = vi.fn();
        render(Subject, { props: { ...baseProps, ontoggle: handleToggle } });

        await user.click(screen.getByRole("button"));
        expect(handleToggle).toHaveBeenCalledWith(true);
    });

    test("renders children inside the details panel", () => {
        const { container } = render(Subject, { props: {
            ...baseProps,
            expanded: true,
            children: textSnippet("Why this matters"),
        }});

        const panel = container.querySelector("div.government-banner-details") as HTMLElement;
        expect(panel.textContent).toContain("Why this matters");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: { ...baseProps, class: "extra" } });

        const root = container.querySelector("aside") as HTMLElement;
        expect(root.className).toContain("government-banner");
        expect(root.className).toContain("extra");
    });

    test("accepts a consumer-supplied panelId", () => {
        const { container } = render(Subject, { props: { ...baseProps, panelId: "fixed-panel" } });

        const panel = container.querySelector("div.government-banner-details") as HTMLElement;
        const button = container.querySelector("button.government-banner-toggle") as HTMLElement;
        expect(panel.getAttribute("id")).toBe("fixed-panel");
        expect(button.getAttribute("aria-controls")).toBe("fixed-panel");
    });
});
