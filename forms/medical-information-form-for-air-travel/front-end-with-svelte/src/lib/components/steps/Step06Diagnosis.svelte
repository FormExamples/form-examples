<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import TextField from '#lib/components/ui/TextField.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 6 — Diagnosis and clinical history</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <label class="block md:col-span-2">
      <span class="text-sm text-base-content/80">Primary diagnosis</span>
      <textarea rows="2" class="w-full border rounded px-2 py-1" bind:value={store.data.diagnosis.primaryDiagnosis}></textarea>
    </label>
    <TextField label="ICD-10 codes (comma-separated)" bind:value={store.data.diagnosis.icd10Codes} />
    <TextField label="Diagnosis date" type="date" bind:value={store.data.diagnosis.diagnosisDate} />
    <label class="block md:col-span-2">
      <span class="text-sm text-base-content/80">Current treatment</span>
      <textarea rows="2" class="w-full border rounded px-2 py-1" bind:value={store.data.diagnosis.currentTreatment}></textarea>
    </label>
    <TextField label="Last admission date" type="date" bind:value={store.data.diagnosis.lastAdmissionDate} />
    <TextField label="Last discharge date" type="date" bind:value={store.data.diagnosis.lastDischargeDate} />
    <TextField label="Last specialist review" type="date" bind:value={store.data.diagnosis.lastSpecialistReviewDate} />
  </div>
</section>
