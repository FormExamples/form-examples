import { fireEvent, render, screen } from "@testing-library/svelte";
import { describe, expect, test, vi } from "vitest";

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

    test("a drop zone takes dropped files into the same callback and count, without a new tab stop", async () => {
        const onchange = vi.fn();
        const { container } = render(Subject, {
            props: {
                label: "Upload",
                dropZone: true,
                multiple: true,
                onchange,
                selectedLabel: (n: number) => `${n} files`,
            },
        });
        const root = container.querySelector(".file-upload") as HTMLElement;
        expect(root.hasAttribute("data-drop-zone")).toBe(true);
        const file = new File(["x"], "scan.pdf", { type: "application/pdf" });
        const dataTransfer = { types: ["Files"], files: [file] as unknown as FileList };
        await fireEvent.dragOver(root, { dataTransfer });
        expect(root.hasAttribute("data-drag-over")).toBe(true);
        await fireEvent.drop(root, { dataTransfer });
        expect(root.hasAttribute("data-drag-over")).toBe(false);
        expect(onchange).toHaveBeenCalledWith(dataTransfer.files);
        expect(root.querySelector("[data-file-count]")?.textContent?.trim()).toBe("1 files");
        expect(root.querySelectorAll("[tabindex]")).toHaveLength(0);
        expect(root.querySelector("button")).toBeTruthy();
    });

    test("without dropZone a drop does nothing", async () => {
        const onchange = vi.fn();
        const { container } = render(Subject, { props: { label: "Upload", onchange } });
        const root = container.querySelector(".file-upload") as HTMLElement;
        await fireEvent.drop(root, {
            dataTransfer: { types: ["Files"], files: [new File(["x"], "a.txt")] },
        });
        expect(onchange).not.toHaveBeenCalled();
    });
});
