<script lang="ts">
  import { store } from "$lib/stores/assessment.svelte.js";
  import Fieldset from "$lib/components/ui/Fieldset.svelte";
  import Field from "$lib/components/ui/Field.svelte";
  import NumberInput from "$lib/components/ui/NumberInput.svelte";
  import Select from "$lib/components/ui/Select.svelte";
  import TextInput from "$lib/components/ui/TextInput.svelte";
  import DateInput from "$lib/components/ui/DateInput.svelte";
</script>

<Fieldset legend="Step 14 — Functional capacity and frailty">
  <div class="field-grid field-grid-3">
    <Field label="METs">
      <NumberInput
        label="METs"
        step="0.1"
        bind:value={store.data.functionalCapacity.metsEstimate}
      />
    </Field>
    <Field label="DASI score">
      <NumberInput
        label="DASI score"
        step="0.1"
        bind:value={store.data.functionalCapacity.dasiScore}
      />
    </Field>
    <Field label="Clinical Frailty Scale (1-9)">
      <NumberInput
        label="Clinical Frailty Scale (1-9)"
        min={1}
        max={9}
        bind:value={store.data.functionalCapacity.clinicalFrailtyScale}
      />
    </Field>
    <Field label="ECOG (0-4)">
      <NumberInput
        label="ECOG (0-4)"
        min={0}
        max={4}
        bind:value={store.data.functionalCapacity.ecogPerformanceStatus}
      />
    </Field>
    <Field label="6-min walk (m)">
      <NumberInput
        label="6-min walk (m)"
        bind:value={store.data.functionalCapacity.sixMinuteWalkMetres}
      />
    </Field>
    <Field label="CPET performed">
      <Select
        label="CPET performed"
        bind:value={store.data.functionalCapacity.cpetPerformed}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="CPET VO2 peak">
      <NumberInput
        label="CPET VO2 peak"
        step="0.1"
        bind:value={store.data.functionalCapacity.cpetVo2PeakMlKgMin}
      />
    </Field>
    <Field label="AT (mL/kg/min)">
      <NumberInput
        label="AT (mL/kg/min)"
        step="0.1"
        bind:value={store.data.functionalCapacity.cpetAnaerobicThresholdMlKgMin}
      />
    </Field>
    <Field label="Malnutrition risk">
      <Select
        label="Malnutrition risk"
        bind:value={store.data.functionalCapacity.malnutritionRisk}
      >
        <option value="">—</option>
        <option value="none">None</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </Select>
    </Field>
  </div>

  <h3 class="step-subhead">Social history</h3>
  <div class="field-grid field-grid-3">
    <Field label="Living situation">
      <Select
        label="Living situation"
        bind:value={store.data.functionalCapacity.livingSituation}
      >
        <option value="">—</option>
        <option value="independent">Independent</option>
        <option value="lives-with-family">Lives with family</option>
        <option value="sheltered-housing">Sheltered housing</option>
        <option value="residential-care">Residential care</option>
        <option value="nursing-home">Nursing home</option>
      </Select>
    </Field>
    <Field label="Support at home">
      <Select
        label="Support at home"
        bind:value={store.data.functionalCapacity.supportAtHome}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Falls within last year">
      <Select
        label="Falls within last year"
        bind:value={store.data.functionalCapacity.fallsRiskWithinYear}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Mobility status" class="field-span-2">
      <TextInput
        label="Mobility status"
        bind:value={store.data.functionalCapacity.mobilityStatus}
      />
    </Field>
  </div>

  <h3 class="step-subhead">Fried Frailty Phenotype</h3>
  <div class="field-grid field-grid-3">
    <Field label="Weakness">
      <Select
        label="Weakness"
        bind:value={store.data.functionalCapacity.friedWeakness}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Slowness">
      <Select
        label="Slowness"
        bind:value={store.data.functionalCapacity.friedSlowness}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Low physical activity">
      <Select
        label="Low physical activity"
        bind:value={store.data.functionalCapacity.friedLowPhysicalActivity}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Exhaustion">
      <Select
        label="Exhaustion"
        bind:value={store.data.functionalCapacity.friedExhaustion}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Unintentional weight loss">
      <Select
        label="Unintentional weight loss"
        bind:value={store.data.functionalCapacity.friedUnintentionalWeightLoss}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Risk Analysis Index score">
      <NumberInput
        label="Risk Analysis Index score"
        min={0}
        max={100}
        bind:value={store.data.functionalCapacity.riskAnalysisIndexScore}
      />
    </Field>
  </div>

  <h3 class="step-subhead">Cognitive screening (Mini-Cog)</h3>
  <p class="hint">Indicated when the Clinical Frailty Scale is 5 or above.</p>
  <div class="field-grid field-grid-3">
    <Field label="Mini-Cog performed">
      <Select
        label="Mini-Cog performed"
        bind:value={store.data.functionalCapacity.miniCogPerformed}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Mini-Cog score (0-5)">
      <NumberInput
        label="Mini-Cog score (0-5)"
        min={0}
        max={5}
        bind:value={store.data.functionalCapacity.miniCogScore}
      />
    </Field>
  </div>

  <h3 class="step-subhead">Prehabilitation</h3>
  <div class="field-grid field-grid-3">
    <Field label="Prehabilitation indicated">
      <Select
        label="Prehabilitation indicated"
        bind:value={store.data.functionalCapacity.prehabilitationIndicated}
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Prehabilitation type">
      <Select
        label="Prehabilitation type"
        bind:value={store.data.functionalCapacity.prehabilitationType}
      >
        <option value="">—</option>
        <option value="nutrition">Nutrition</option>
        <option value="aerobic">Aerobic</option>
        <option value="resistance">Resistance</option>
        <option value="multimodal">Multimodal</option>
        <option value="other">Other</option>
      </Select>
    </Field>
    <Field label="Prehabilitation start date">
      <DateInput
        label="Prehabilitation start date"
        bind:value={store.data.functionalCapacity.prehabilitationStartDate}
      />
    </Field>
    <Field label="Protein supplementation recommended">
      <Select
        label="Protein supplementation recommended"
        bind:value={
          store.data.functionalCapacity.proteinSupplementationRecommended
        }
      >
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
  </div>
</Fieldset>
