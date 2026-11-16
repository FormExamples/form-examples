import { render } from "@testing-library/svelte";
import { describe, expect, test } from "vitest";

import Subject from "./MedicationView.svelte";

const root = () => document.querySelector(".medication-view") as HTMLElement;
const part = (name: string) => root().querySelector(`.medication-view-${name}`);

describe("MedicationView", () => {
    test("renders a span with each part", () => {
        render(Subject, {
            props: {
                name: "amoxicillin",
                strength: "500 mg",
                form: "capsule",
                route: "oral",
                frequency: "three times daily",
            },
        });
        expect(root().tagName).toBe("SPAN");
        expect(part("name")?.textContent).toBe("amoxicillin");
        expect(part("strength")?.textContent).toBe("500 mg");
        expect(part("form")?.textContent).toBe("capsule");
        expect(part("route")?.textContent).toBe("oral");
        expect(part("frequency")?.textContent).toBe("three times daily");
    });

    test("marks the consumer's tall man segments, and only those", () => {
        render(Subject, {
            props: { nameSegments: [{ text: "hydr" }, { text: "ALAZINE", tallMan: true }] },
        });
        expect(part("name")?.textContent).toBe("hydrALAZINE");
        const marked = root().querySelectorAll(".medication-view-tall-man");
        expect(marked).toHaveLength(1);
        expect(marked[0].textContent).toBe("ALAZINE");
    });

    test("writes no tall man letters of its own", () => {
        render(Subject, { props: { name: "hydroxyzine HCl" } });
        expect(root().querySelector(".medication-view-tall-man")).toBeNull();
        expect(part("name")?.textContent).toBe("hydroxyzine HCl");
    });

    test("renders only the parts that are given", () => {
        render(Subject, { props: { name: "paracetamol" } });
        expect(part("strength")).toBeNull();
        expect(part("route")).toBeNull();
    });

    test("renders a free-text dose as its own part", () => {
        render(Subject, {
            props: { name: "metformin", dosageText: "Take one tablet twice a day with food" },
        });
        expect(document.querySelector(".medication-view-dosage")?.textContent).toBe(
            "Take one tablet twice a day with food",
        );
    });
});
