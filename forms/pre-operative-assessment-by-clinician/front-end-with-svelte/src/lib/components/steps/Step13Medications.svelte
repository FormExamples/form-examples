<script lang="ts">
  import { store } from "$lib/stores/assessment.svelte.js";
  import type { Medication, Allergy } from "$lib/engine/types.js";
  import Fieldset from "$lib/components/ui/Fieldset.svelte";
  import Field from "$lib/components/ui/Field.svelte";
  import Button from "$lib/components/ui/Button.svelte";
  import TextInput from "$lib/components/ui/TextInput.svelte";
  import TextAreaInput from "$lib/components/ui/TextAreaInput.svelte";
  import Select from "$lib/components/ui/Select.svelte";

  function newMed(): Medication {
    return {
      name: "",
      dose: "",
      route: "",
      frequency: "",
      indication: "",
      class: "",
      perioperativeAction: "",
      perioperativeNotes: "",
      lastDoseAt: "",
    };
  }
  function newAllergy(): Allergy {
    return {
      allergen: "",
      category: "",
      reactionType: "",
      reactionSeverity: "",
      reactionNotes: "",
      verified: "",
    };
  }
</script>

<Fieldset legend="Step 13 — Medications and allergies">
  <h3 class="step-subhead">Medications (clinician-reconciled)</h3>
  <Button
    data-variant="secondary"
    onclick={() => store.data.medications.push(newMed())}
  >
    + Add medication
  </Button>

  {#each store.data.medications as med, i}
    <div class="row-grid">
      <TextInput label="Name" placeholder="Name" bind:value={med.name} />
      <TextInput label="Dose" placeholder="Dose" bind:value={med.dose} />
      <TextInput
        label="Frequency"
        placeholder="Frequency"
        bind:value={med.frequency}
      />
      <Select label="Class" bind:value={med.class}>
        <option value="">Class</option>
        <option value="anticoagulant">Anticoagulant</option>
        <option value="antiplatelet">Antiplatelet</option>
        <option value="antihypertensive">Antihypertensive</option>
        <option value="insulin">Insulin</option>
        <option value="steroid">Steroid</option>
        <option value="opioid">Opioid</option>
        <option value="other">Other</option>
      </Select>
      <Select label="Peri-op action" bind:value={med.perioperativeAction}>
        <option value="">Peri-op action</option>
        <option value="continue">Continue</option>
        <option value="hold-on-day">Hold on day</option>
        <option value="stop">Stop</option>
        <option value="bridge">Bridge</option>
      </Select>
      <TextInput
        label="Notes"
        class="row-span-2"
        placeholder="Notes"
        bind:value={med.perioperativeNotes}
      />
      <Button
        data-variant="danger"
        onclick={() => store.data.medications.splice(i, 1)}>Remove</Button
      >
    </div>
  {/each}

  <h3 class="step-subhead">Allergies</h3>
  <Button
    data-variant="secondary"
    onclick={() => store.data.allergies.push(newAllergy())}
  >
    + Add allergy
  </Button>

  {#each store.data.allergies as a, i}
    <div class="row-grid">
      <TextInput
        label="Allergen"
        placeholder="Allergen"
        bind:value={a.allergen}
      />
      <Select label="Category" bind:value={a.category}>
        <option value="">Category</option>
        <option value="drug">Drug</option>
        <option value="latex">Latex</option>
        <option value="food">Food</option>
        <option value="contrast">Contrast</option>
      </Select>
      <Select label="Reaction" bind:value={a.reactionType}>
        <option value="">Reaction</option>
        <option value="anaphylaxis">Anaphylaxis</option>
        <option value="rash">Rash</option>
        <option value="urticaria">Urticaria</option>
        <option value="bronchospasm">Bronchospasm</option>
      </Select>
      <Select label="Severity" bind:value={a.reactionSeverity}>
        <option value="">Severity</option>
        <option value="mild">Mild</option>
        <option value="moderate">Moderate</option>
        <option value="severe">Severe</option>
        <option value="life-threatening">Life-threatening</option>
      </Select>
      <Button
        data-variant="danger"
        onclick={() => store.data.allergies.splice(i, 1)}>Remove</Button
      >
    </div>
  {/each}

  <h3 class="step-subhead">GLP-1 receptor agonist management</h3>
  <div class="field-grid field-grid-3">
    <Field label="On a GLP-1 receptor agonist">
      <Select
        label="On a GLP-1 receptor agonist"
        bind:value={store.data.glp1Management.onGlp1ReceptorAgonist}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Agonist">
      <Select
        label="Agonist"
        bind:value={store.data.glp1Management.glp1AgonistName}
      >
        <option value="">—</option>
        <option value="semaglutide">Semaglutide</option>
        <option value="tirzepatide">Tirzepatide</option>
        <option value="dulaglutide">Dulaglutide</option>
        <option value="liraglutide">Liraglutide</option>
        <option value="exenatide">Exenatide</option>
        <option value="other">Other</option>
      </Select>
    </Field>
    <Field label="Formulation">
      <Select
        label="Formulation"
        bind:value={store.data.glp1Management.glp1Formulation}
      >
        <option value="">—</option>
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
      </Select>
    </Field>
    <Field label="Held per guideline">
      <Select
        label="Held per guideline"
        bind:value={store.data.glp1Management.glp1HeldPerGuideline}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Extended clear-fluid fast confirmed">
      <Select
        label="Extended clear-fluid fast confirmed"
        bind:value={store.data.glp1Management.glp1ExtendedClearFluidsConfirmed}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Active GI symptoms">
      <Select
        label="Active GI symptoms"
        bind:value={store.data.glp1Management.glp1GiSymptoms}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="GI symptom details" class="field-span-2">
      <TextInput
        label="GI symptom details"
        bind:value={store.data.glp1Management.glp1GiSymptomsDetails}
      />
    </Field>
    <Field label="Gastric ultrasound performed">
      <Select
        label="Gastric ultrasound performed"
        bind:value={store.data.glp1Management.glp1GastricUltrasoundPerformed}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Gastric ultrasound finding">
      <Select
        label="Gastric ultrasound finding"
        bind:value={store.data.glp1Management.glp1GastricUltrasoundFindings}
      >
        <option value="">—</option>
        <option value="empty">Empty</option>
        <option value="low-risk">Low risk</option>
        <option value="full-stomach">Full stomach</option>
      </Select>
    </Field>
    <Field label="Full-stomach precautions planned">
      <Select
        label="Full-stomach precautions planned"
        bind:value={store.data.glp1Management.glp1FullStomachPrecautionsPlanned}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="GLP-1 notes" class="field-span-3">
      <TextAreaInput
        label="GLP-1 notes"
        rows={3}
        bind:value={store.data.glp1Management.glp1Notes}
      />
    </Field>
  </div>
</Fieldset>
