import { fireEvent, render, screen } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./FileUpload.svelte";

function choose(input: HTMLInputElement, count: number) {
    const files = Array.from({ length: count }, (_, i) => new File(["x"], `f${i}.pdf`));
    Object.defineProperty(input, "files", {
        value: Object.assign(files, { item: (i: number) => files[i] ?? null }),
        configurable: true,
    });
    fireEvent.change(input);
}

describe("FileUpload", () => {
    test("renders upload button", () => {
        render(Subject, { props: { label: "Upload" } });
        expect(screen.getByRole("button", { name: "Upload" })).toBeTruthy();
    });

    test("has hidden file input", () => {
        render(Subject, { props: { label: "Upload", "data-testid": "fu" } });
        const hidden = screen
            .getByTestId("fu")
            .querySelector("input[type='file']") as HTMLInputElement;
        expect(hidden).toBeTruthy();
        expect(hidden.hidden).toBe(true);
    });

    test("has live region for status", () => {
        render(Subject, { props: { label: "Upload", "data-testid": "fu" } });
        const live = screen.getByTestId("fu").querySelector("[aria-live='polite']");
        expect(live).toBeTruthy();
    });

    test("supports disabled", () => {
        render(Subject, { props: { label: "Upload", disabled: true } });
        expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
    });

    test("passes through attributes", () => {
        render(Subject, { props: { label: "Upload", "data-testid": "fu" } });
        expect(screen.getByTestId("fu")).toBeTruthy();
    });

    test("announces the count in the consumer's words from selectedLabel", async () => {
        const fr = (n: number) => (n === 1 ? "1 fichier choisi" : `${n} fichiers choisis`);
        const { container } = render(Subject, { props: { label: "Upload", selectedLabel: fr } });
        await choose(container.querySelector('input[type="file"]') as HTMLInputElement, 2);
        await Promise.resolve();
        expect(container.querySelector("[aria-live]")!.textContent!.trim()).toBe(
            "2 fichiers choisis",
        );
    });

    test("without selectedLabel the status stays empty: no English", async () => {
        const { container } = render(Subject, { props: { label: "Upload" } });
        await choose(container.querySelector('input[type="file"]') as HTMLInputElement, 1);
        await Promise.resolve();
        const status = container.querySelector("[aria-live]")!;
        expect(status.getAttribute("data-file-count")).toBe("1");
        expect(status.textContent!.trim()).toBe("");
    });
});
