<script lang="ts">
  import Field from '$lib/components/ui/Field.svelte';
  import Fieldset from '$lib/components/ui/Fieldset.svelte';
  import NumberInput from '$lib/components/ui/NumberInput.svelte';
  import Select from '$lib/components/ui/Select.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';

  import { store } from '$lib/stores/assessment.svelte.js';

  const m = store.data.pastMedicalHistoryProforma;

  const simpleItems = [
    ['hypertension', 'Hypertension'],
    ['heartFailure', 'Heart failure'],
    ['palpitation', 'Palpitation'],
    ['arrhythmia', 'Arrhythmia'],
    ['syncopeOrFainting', 'Syncope / fainting'],
    ['heartMurmur', 'Heart murmur'],
    ['rheumaticFever', 'Rheumatic fever'],
    ['implantedIcdCrtd', 'Implanted ICD / CRTD'],
    ['angioplasty', 'Angioplasty'],
    ['valveDisease', 'Valve disease'],
    ['peripheralVascularDisease', 'Peripheral vascular disease'],
    ['ischemicHeartDisease', 'Ischemic heart disease'],
    ['asthma', 'Asthma'],
    ['copd', 'COPD'],
    ['tb', 'TB'],
    ['bronchiectasis', 'Bronchiectasis'],
    ['previousHospitalAdmission', 'Previous hospital admission'],
    ['icuAdmission', 'ICU admission'],
    ['onHomeOxygenOrNebulizers', 'On home O2 / nebulizers'],
    ['usesInhalerDailyOrMore', 'Uses inhaler once a day or more'],
    ['fluCoughSputum', 'Flu / cough / sputum'],
    ['haemoptysis', 'Haemoptysis'],
    ['otherRespiratoryDisease', 'Other respiratory disease'],
    ['hypothyroid', 'Hypothyroid'],
    ['hyperthyroid', 'Hyperthyroid'],
    ['ms', 'MS'],
    ['muscularDystrophy', 'Muscular dystrophy'],
    ['dementia', 'Dementia'],
    ['creutzfeldtJakobDisease', 'Creutzfeldt-Jakob disease'],
    ['growthHormoneOrGonadotrophin', 'Growth hormone / gonadotrophin'],
    ['complexNeeds', 'Complex needs'],
    ['liverDisease', 'Liver disease'],
    ['clottingDisordersHaemophilia', 'Clotting disorders / haemophilia'],
    ['easyBruisingProlongedBleeding', 'Easy bruising, prolonged bleeding'],
    ['gord', 'Gastro oesophageal reflux disease'],
    ['anyOtherDisease', 'Any other disease'],
    ['chronicPain', 'Chronic pain'],
    ['cortisonePrednisoneSteroid', 'Cortisone / prednisone / steroid'],
    ['bloodTransfusionHistory', 'H/o blood transfusion'],
    ['chemotherapyDrugs', 'Chemotherapy drugs'],
    ['radiotherapy', 'Radiotherapy'],
  ] as const;

  const anginaTriggerOptions = [
    { value: 'vigorous-exercise', label: 'Vigorous exercise' },
    { value: 'climbing-1-flight-stairs', label: 'Climbing 1 flight of stairs' },
    { value: 'walking-flat-200m', label: 'Walking on flat 200 metres' },
    { value: 'walking-flat-lt-50m', label: 'Walking on flat < 50 metres' },
    { value: 'at-rest', label: 'At rest' },
    { value: 'at-night', label: 'At night' },
  ] as const;

  const dyspnoeaSubtypeOptions = [
    { value: 'at-rest', label: 'At rest' },
    { value: 'on-lying-flat', label: 'On lying flat' },
    { value: 'wakes-at-night-gasping', label: 'Wake at night gasping for breath' },
  ] as const;

  function toggleArrayValue<T extends string>(arr: T[], value: T): T[] {
    return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
  }
</script>

<Fieldset legend="Step 18 — Past medical history">
  <p class="hint">Cardiovascular, respiratory, endocrine, neurological, renal/hepatic and other conditions</p>

  <div class="field-grid field-grid-3">
    {#each simpleItems as [key, label]}
      <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m[key]} /> {label}</label>
    {/each}
  </div>

  <h3 class="step-subhead">MI</h3>
  <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.mi} /> MI</label>
  {#if m.mi}
    <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.miWithinPast6Months} /> Within the past 6 months</label>
  {/if}

  <h3 class="step-subhead">Angina or chest pain</h3>
  <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.anginaOrChestPain} /> Angina or chest pain</label>
  {#if m.anginaOrChestPain}
    <p class="hint">What brings on the pain?</p>
    <div class="field-grid field-grid-3">
      {#each anginaTriggerOptions as opt (opt.value)}
        <label class="checkbox-label">
          <input
            type="checkbox"
            class="checkbox-input"
            checked={m.anginaTriggers.includes(opt.value)}
            onchange={() => (m.anginaTriggers = toggleArrayValue(m.anginaTriggers, opt.value))}
          /> {opt.label}
        </label>
      {/each}
    </div>
  {/if}

  <h3 class="step-subhead">Dyspnoea</h3>
  <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.dyspnoea} /> Dyspnoea</label>
  {#if m.dyspnoea}
    <div class="field-grid field-grid-3">
      {#each dyspnoeaSubtypeOptions as opt (opt.value)}
        <label class="checkbox-label">
          <input
            type="checkbox"
            class="checkbox-input"
            checked={m.dyspnoeaSubtypes.includes(opt.value)}
            onchange={() => (m.dyspnoeaSubtypes = toggleArrayValue(m.dyspnoeaSubtypes, opt.value))}
          /> {opt.label}
        </label>
      {/each}
    </div>
  {/if}

  <h3 class="step-subhead">Pacemaker</h3>
  <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.pacemaker} /> Pacemaker</label>
  {#if m.pacemaker}
    <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.pacemakerLastCheckWithin6Months} /> Last check within 6 months</label>
  {/if}

  <h3 class="step-subhead">Stenting</h3>
  <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.stenting} /> Stenting</label>
  {#if m.stenting}
    <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.stentingWithinPast6Months} /> Within the past 6 months</label>
    <Field label="Type of stent?" inputId="stentType">
      <Select id="stentType" label="Type of stent?" bind:value={m.stentType}>
        <option value="">-- Select --</option>
        <option value="drug-eluting">Drug eluting</option>
        <option value="bare-metal">Bare metal</option>
        <option value="unknown">Unknown</option>
      </Select>
    </Field>
  {/if}

  <h3 class="step-subhead">Cardiac surgery</h3>
  <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.cardiacSurgery} /> Cardiac surgery</label>
  {#if m.cardiacSurgery}
    <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.cardiacSurgeryWithinPastYear} /> Within the past year</label>
  {/if}

  <h3 class="step-subhead">Sleep apnoea</h3>
  <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.sleepApnoea} /> Sleep apnoea</label>
  {#if m.sleepApnoea}
    <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.sleepApnoeaUsingCpap} /> Using CPAP</label>
  {/if}
  <Field label="STOP-Bang risk" inputId="stopBangRisk">
    <Select id="stopBangRisk" label="STOP-Bang risk" bind:value={m.stopBangRisk}>
      <option value="">-- Select --</option>
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
    </Select>
  </Field>

  <h3 class="step-subhead">Diabetes mellitus</h3>
  <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.diabetesMellitus} /> Diabetes mellitus</label>
  {#if m.diabetesMellitus}
    <div class="field-grid field-grid-3">
      <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.diabetesDietControlled} /> Diet controlled</label>
      <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.diabetesDrugControlled} /> Drug controlled</label>
      <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.diabetesInsulinControlled} /> Insulin controlled</label>
      <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.diabetesHba1cOver69} /> HbA1c &gt; 69 mmol/mol</label>
    </div>
  {/if}

  <h3 class="step-subhead">Stroke / TIA</h3>
  <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.strokeOrTia} /> Stroke / TIA</label>
  {#if m.strokeOrTia}
    <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.strokeWithin3Months} /> Within 3 months</label>
    <Field label="Residual disability, if any" inputId="strokeResidual">
      <TextInput id="strokeResidual" label="Residual disability, if any" bind:value={m.strokeResidualDisability} />
    </Field>
  {/if}

  <h3 class="step-subhead">Epilepsy or seizures</h3>
  <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.epilepsyOrSeizures} /> Epilepsy or seizures</label>
  {#if m.epilepsyOrSeizures}
    <Field label="Control" inputId="epilepsyControl">
      <Select id="epilepsyControl" label="Control" bind:value={m.epilepsyControl}>
        <option value="">-- Select --</option>
        <option value="well-controlled">Well controlled, last fit &gt; 1 year ago</option>
        <option value="3-12-months-ago">Last fit 3-12 months ago</option>
        <option value="poorly-controlled">Poorly controlled, or fit within last 3 months</option>
      </Select>
    </Field>
  {/if}

  <h3 class="step-subhead">Other neurological disease</h3>
  <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.otherNeurologicalDisease} /> Other neurological disease</label>
  {#if m.otherNeurologicalDisease}
    <Field label="Please provide details" inputId="otherNeuroDetails">
      <TextInput id="otherNeuroDetails" label="Please provide details" bind:value={m.otherNeurologicalDiseaseDetails} />
    </Field>
  {/if}

  <h3 class="step-subhead">Brain or spinal cord surgery</h3>
  <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.brainOrSpinalCordSurgery} /> Brain or spinal cord surgery</label>
  <Field label="4AT score">
    <NumberInput label="4AT score" bind:value={m.fourAtScore} min={0} max={12} />
  </Field>

  <h3 class="step-subhead">Renal impairment</h3>
  <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.renalImpairment} /> Renal impairment</label>
  {#if m.renalImpairment}
    <div class="field-grid field-grid-3">
      <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.ckdStage3} /> CKD stage 3</label>
      <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.ckdStage4OrHemodialysis} /> CKD stage &ge; 4 or on haemodialysis</label>
    </div>
  {/if}

  <h3 class="step-subhead">DVT or PE</h3>
  <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.dvtOrPe} /> DVT or PE</label>
  {#if m.dvtOrPe}
    <label class="checkbox-label"><input type="checkbox" class="checkbox-input" bind:checked={m.dvtOrPeWithinPast3Months} /> Within the past 3 months</label>
  {/if}

  <h3 class="step-subhead">Functional status and medications</h3>
  <div class="field-grid field-grid-3">
    <Field label="Duke Activity Status Index">
      <NumberInput label="Duke Activity Status Index" bind:value={m.dukeActivityStatusIndex} min={0} max={100} />
    </Field>
    <Field label="METs score">
      <NumberInput label="METs score" step="0.1" bind:value={m.metsScore} min={0} max={20} />
    </Field>
  </div>
  <Field label="Ongoing medications" class="field-span-2">
    <TextInput label="Ongoing medications" bind:value={m.ongoingMedications} />
  </Field>
</Fieldset>
