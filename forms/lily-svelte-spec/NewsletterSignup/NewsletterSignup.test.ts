import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./NewsletterSignup.svelte";

const baseProps = {
    label: "Subscribe to newsletter",
    emailLabel: "Email",
    submitLabel: "Subscribe",
};

describe("NewsletterSignup", () => {
    test("renders as a form with the newsletter-signup class", () => {
        const { container } = render(Subject, { props: { ...baseProps } });

        const root = container.querySelector("form.newsletter-signup") as HTMLElement;
        expect(root).toBeTruthy();
    });

    test("applies aria-label from required label prop", () => {
        const { container } = render(Subject, { props: { ...baseProps } });

        const root = container.querySelector("form") as HTMLElement;
        expect(root.getAttribute("aria-label")).toBe("Subscribe to newsletter");
    });

    test("defaults state to idle and applies as data-state", () => {
        const { container } = render(Subject, { props: { ...baseProps } });

        const root = container.querySelector("form") as HTMLElement;
        expect(root.getAttribute("data-state")).toBe("idle");
    });

    test("renders email input and submit button", () => {
        const { container } = render(Subject, { props: { ...baseProps } });

        const input = container.querySelector("input[type='email']") as HTMLInputElement;
        const submit = container.querySelector("button[type='submit']") as HTMLButtonElement;
        expect(input).toBeTruthy();
        expect(submit).toBeTruthy();
        expect(submit.textContent).toContain("Subscribe");
    });

    test("renders heading and description when provided", () => {
        const { container } = render(Subject, { props: {
            ...baseProps,
            heading: "Stay in touch",
            description: "Monthly updates.",
        }});

        const h3 = container.querySelector("h3.newsletter-signup-heading") as HTMLElement;
        const p = container.querySelector("p.newsletter-signup-description") as HTMLElement;
        expect(h3.textContent).toContain("Stay in touch");
        expect(p.textContent).toContain("Monthly updates.");
    });

    test("disables input and submit when state is submitting", () => {
        const { container } = render(Subject, { props: {
            ...baseProps,
            state: "submitting",
        }});

        const input = container.querySelector("input[type='email']") as HTMLInputElement;
        const submit = container.querySelector("button[type='submit']") as HTMLButtonElement;
        expect(input.disabled).toBe(true);
        expect(submit.disabled).toBe(true);
    });

    test("hides success and error messages when state is idle", () => {
        const { container } = render(Subject, { props: { ...baseProps } });

        const success = container.querySelector("p.newsletter-signup-success") as HTMLElement;
        const error = container.querySelector("p.newsletter-signup-error") as HTMLElement;
        expect(success.hasAttribute("hidden")).toBe(true);
        expect(error.hasAttribute("hidden")).toBe(true);
    });

    test("shows success message with role=status when state is success", () => {
        const { container } = render(Subject, { props: {
            ...baseProps,
            state: "success",
            successMessage: "Thanks for subscribing!",
        }});

        const success = container.querySelector("p.newsletter-signup-success") as HTMLElement;
        expect(success.hasAttribute("hidden")).toBe(false);
        expect(success.getAttribute("role")).toBe("status");
        expect(success.getAttribute("aria-live")).toBe("polite");
        expect(success.textContent).toContain("Thanks for subscribing!");
    });

    test("shows error message with role=alert when state is error", () => {
        const { container } = render(Subject, { props: {
            ...baseProps,
            state: "error",
            errorMessage: "Something went wrong.",
        }});

        const error = container.querySelector("p.newsletter-signup-error") as HTMLElement;
        expect(error.hasAttribute("hidden")).toBe(false);
        expect(error.getAttribute("role")).toBe("alert");
        expect(error.textContent).toContain("Something went wrong.");
    });

    test("appends consumer class to base class", () => {
        const { container } = render(Subject, { props: {
            ...baseProps,
            class: "extra",
        }});

        const root = container.querySelector("form") as HTMLElement;
        expect(root.className).toContain("newsletter-signup");
        expect(root.className).toContain("extra");
    });
});
