import { render, screen } from "@testing-library/svelte";
import { userEvent, type UserEvent } from "@testing-library/user-event";
import { describe, expect, test, vi } from "vitest";

import Subject from "./CallToAction.svelte";

function textSnippet(text: string) {
    return (($$anchor: Comment) => {
        const node = document.createTextNode(text);
        $$anchor.before(node);
    }) as any;
}

describe("CallToAction", () => {
    test("renders as a link when href is provided", () => {
        render(Subject, { props: {
            href: "/signup",
            children: textSnippet("Sign Up"),
        }});

        const link: HTMLElement = screen.getByRole("link", { name: "Sign Up" });
        expect(link).toBeTruthy();
        expect(link.getAttribute("href")).toBe("/signup");
    });

    test("renders as a button when no href", () => {
        render(Subject, { props: {
            children: textSnippet("Get Started"),
        }});

        const button: HTMLElement = screen.getByRole("button", { name: "Get Started" });
        expect(button).toBeTruthy();
    });

    test("button handles click events", async () => {
        const user: UserEvent = userEvent.setup();
        const handleClick = vi.fn();
        render(Subject, { props: {
            onclick: handleClick,
            children: textSnippet("Act Now"),
        }});

        await user.click(screen.getByRole("button"));
        expect(handleClick).toHaveBeenCalledOnce();
    });

    test("button can be disabled", () => {
        render(Subject, { props: {
            disabled: true,
            children: textSnippet("Disabled"),
        }});

        const button = screen.getByRole("button") as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });

    test("applies aria-label", () => {
        render(Subject, { props: {
            href: "/learn",
            label: "Learn more about our services",
            children: textSnippet("Learn More"),
        }});

        const link: HTMLElement = screen.getByRole("link", { name: "Learn more about our services" });
        expect(link).toBeTruthy();
    });

    test("is focusable via keyboard", async () => {
        const user: UserEvent = userEvent.setup();
        render(Subject, { props: {
            children: textSnippet("CTA"),
        }});

        await user.tab();
        expect(document.activeElement).toBe(screen.getByRole("button"));
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: {
            "data-testid": "cta",
            children: textSnippet("Action"),
        }});

        expect(screen.getByTestId("cta")).toBeTruthy();
    });
});
