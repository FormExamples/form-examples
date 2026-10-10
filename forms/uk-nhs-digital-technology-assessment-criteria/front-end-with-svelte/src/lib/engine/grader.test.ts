import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { calculateGrade } from "./grader.js";
import { createDefaultAssessment } from "./defaults.js";
import type { DtacAssessment, GradingResult } from "./types.js";

interface Persona {
  name: string;
  state: DtacAssessment;
  expected: GradingResult;
}

const path = fileURLToPath(new URL("../../../../examples/personas.json", import.meta.url));
const { personas } = JSON.parse(readFileSync(path, "utf8")) as { personas: Persona[] };

describe("DTAC grader vs personas.json oracle", () => {
  it("loads personas", () => {
    expect(personas.length).toBeGreaterThan(0);
  });
  for (const p of personas) {
    describe(p.name, () => {
      const got = calculateGrade(p.state);
      it("outcome", () => {
        expect(got.outcome).toBe(p.expected.outcome);
        expect(got.outcomeLabel).toBe(p.expected.outcomeLabel);
      });
      it("counts", () => {
        expect({
          a: got.mandatoryTotal, b: got.mandatoryMet, c: got.advisoryTotal, d: got.advisoryMet,
        }).toEqual({
          a: p.expected.mandatoryTotal, b: p.expected.mandatoryMet,
          c: p.expected.advisoryTotal, d: p.expected.advisoryMet,
        });
      });
      it("sections", () => expect(got.sections).toEqual(p.expected.sections));
      it("firedRules", () => expect(got.firedRules).toEqual(p.expected.firedRules));
      it("flags", () => expect(got.flags).toEqual(p.expected.flags));
    });
  }
  it("blank default is incomplete", () => {
    expect(calculateGrade(createDefaultAssessment()).outcome).toBe("incomplete");
  });
});
