import { render, screen } from "@testing-library/svelte";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import Subject from "./SignaturePad.svelte";
function textSnippet(text: string) {
    return (($anchor: Comment) => {
        $anchor.before(document.createTextNode(text));
    }) as any;
}
describe("SignaturePad", () => {
    test("is a named group, not an application, so a screen reader keeps its own keys", () => {
        render(Subject, { props: { label: "Signature", children: textSnippet("canvas") } });
        expect(screen.getByRole("group", { name: "Signature" })).toBeTruthy();
        expect(screen.queryByRole("application")).toBeNull();
    });
    test("passes through attributes", () => {
        render(Subject, { props: { label: "S", "data-testid": "sp", children: textSnippet("x") } });
        expect(screen.getByTestId("sp")).toBeTruthy();
    });
    test("the attestation is shown first and is the group's description", () => {
        const { container } = render(Subject, {
            props: {
                label: "Consent signature",
                attestation: "I confirm I have read and understood the information.",
                children: textSnippet("canvas"),
            },
        });
        const group = screen.getByRole("group", { name: "Consent signature" });
        const attestation = container.querySelector(".signature-pad-attestation") as HTMLElement;
        expect(group.firstElementChild).toBe(attestation);
        expect(group.getAttribute("aria-describedby")).toBe(attestation.id);
        expect(attestation.textContent?.trim()).toBe(
            "I confirm I have read and understood the information.",
        );
    });
    test("a signature can be completed by keyboard alone, by typing a name", async () => {
        const user = userEvent.setup();
        render(Subject, {
            props: {
                label: "Consent signature",
                typedNameLabel: "Type your full name",
                name: "signature",
            },
        });
        await user.tab();
        const field = screen.getByRole("textbox", { name: "Type your full name" });
        expect(document.activeElement).toBe(field);
        await user.keyboard("Ada Lovelace");
        expect((field as HTMLInputElement).value).toBe("Ada Lovelace");
        expect(field.getAttribute("name")).toBe("signature");
        expect(field.getAttribute("autocomplete")).toBe("name");
    });
    test("an outcome other than signed is a notice in the consumer's words, and data-outcome", () => {
        const { container } = render(Subject, {
            props: {
                label: "Consent signature",
                outcome: "declined",
                outcomeLabel: "Declined to sign",
            },
        });
        const group = screen.getByRole("group", { name: "Consent signature" });
        expect(group.getAttribute("data-outcome")).toBe("declined");
        expect(container.querySelector(".signature-pad-outcome")?.textContent).toBe(
            "Declined to sign",
        );
    });
});
