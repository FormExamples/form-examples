<script lang="ts">
  import { store } from '$lib/stores/assessment.svelte.js';
  import YesNoField from '$lib/components/ui/YesNoField.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 4 — Reason MEDIF is required</h2>
  <p class="text-sm text-slate-600 mb-4">
    Select all that apply. Any one trigger is sufficient to require an
    airline-medical-desk submission.
  </p>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <YesNoField label="In-flight medical equipment requested" bind:value={store.data.reasons.reasonEquipment} />
    <YesNoField label="Recent acute event (MI, stroke, surgery, fracture)" bind:value={store.data.reasons.reasonRecentAcuteEvent} />
    <YesNoField label="Unstable or potentially decompensating condition" bind:value={store.data.reasons.reasonUnstableCondition} />
    <YesNoField label="Communicable disease" bind:value={store.data.reasons.reasonCommunicableDisease} />
    <YesNoField label="Late-stage pregnancy" bind:value={store.data.reasons.reasonPregnancy} />
    <YesNoField label="Mobility assistance or escort" bind:value={store.data.reasons.reasonMobilityEscort} />
    <YesNoField label="Recent psychiatric event requiring clearance" bind:value={store.data.reasons.reasonPsychiatric} />
  </div>
</section>
