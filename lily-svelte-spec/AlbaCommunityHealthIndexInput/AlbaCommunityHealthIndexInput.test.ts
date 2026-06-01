import { render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./AlbaCommunityHealthIndexInput.svelte";

describe("AlbaCommunityHealthIndexInput", () => {
    test("renders a text input", () => {
        render(Subject, { props: { label: "Community Health Index" } });

        const input = screen.getByLabelText("Community Health Index") as HTMLInputElement;
        expect(input.type).toBe("text");
    });

    test("has the correct class", () => {
        render(Subject, { props: { label: "Community Health Index" } });

        const input = screen.getByLabelText("Community Health Index");
        expect(input.getAttribute("class")).toContain("alba-community-health-index-input");
    });

    test("has autocomplete off", () => {
        render(Subject, { props: { label: "Community Health Index" } });

        const input = screen.getByLabelText("Community Health Index");
        expect(input.getAttribute("autocomplete")).toBe("off");
    });

    test("is not required by default", () => {
        render(Subject, { props: { label: "Community Health Index" } });

        const input = screen.getByLabelText("Community Health Index") as HTMLInputElement;
        expect(input.required).toBe(false);
    });

    test("can be set to required", () => {
        render(Subject, { props: { label: "Community Health Index", required: true } });

        const input = screen.getByLabelText("Community Health Index") as HTMLInputElement;
        expect(input.required).toBe(true);
    });

    test("is not disabled by default", () => {
        render(Subject, { props: { label: "Community Health Index" } });

        const input = screen.getByLabelText("Community Health Index") as HTMLInputElement;
        expect(input.disabled).toBe(false);
    });

    test("can be set to disabled", () => {
        render(Subject, { props: { label: "Community Health Index", disabled: true } });

        const input = screen.getByLabelText("Community Health Index") as HTMLInputElement;
        expect(input.disabled).toBe(true);
    });

    test("passes through additional HTML attributes", () => {
        render(Subject, { props: { label: "Community Health Index", "data-testid": "subject" } });

        const input = screen.getByTestId("subject");
        expect(input).toBeTruthy();
    });
});
