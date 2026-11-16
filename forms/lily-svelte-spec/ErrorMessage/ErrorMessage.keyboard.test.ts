import { describe, expect, test } from "vitest";
import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";

import Subject from "./ErrorMessage.svelte";

const children = (html: string) =>
    createRawSnippet(() => ({ render: () => `<span>${html}</span>` }));

describe("ErrorMessage keyboard", () => {
    test("is announced as an alert", async () => {
        render(Subject, {
            props: { ...{ label: "Error" }, children: children("Enter your name") },
        });

        expect(document.querySelector(".error-message")?.getAttribute("role")).toBe("alert");
    });
});
