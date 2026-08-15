<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';

	const d = assessment.data.jointAssessment;
</script>

<Fieldset legend="Joint Assessment">
	<p class="hint">28-joint count assessment for DAS28 calculation. Includes bilateral shoulders, elbows, wrists, MCP joints (1-5), PIP joints (1-5), and knees. Count each tender or swollen joint.</p>

	<Field label="Tender Joint Count (TJC28)" required inputId="tenderJointCount28">
		<NumberInput id="tenderJointCount28" label="Tender joint count" min={0} max={28} required bind:value={d.tenderJointCount28} />
	</Field>

	<Field label="Swollen Joint Count (SJC28)" required inputId="swollenJointCount28">
		<NumberInput id="swollenJointCount28" label="Swollen joint count" min={0} max={28} required bind:value={d.swollenJointCount28} />
	</Field>

	<Field label="Pain VAS (0-100mm)" required inputId="painVAS">
		<input id="painVAS" type="range" class="range-input" min={0} max={100} bind:value={d.painVAS} aria-label="Pain VAS" />
		<div class="range-legend">
			<span>0 - No pain</span>
			<span class="range-current">{d.painVAS ?? 0}mm</span>
			<span>100 - Worst pain</span>
		</div>
	</Field>

	<Field label="Patient Global Assessment VAS (0-100mm)" required inputId="patientGlobalVAS">
		<input id="patientGlobalVAS" type="range" class="range-input" min={0} max={100} bind:value={d.patientGlobalVAS} aria-label="Patient global VAS" />
		<div class="range-legend">
			<span>0 - Very well</span>
			<span class="range-current">{d.patientGlobalVAS ?? 0}mm</span>
			<span>100 - Very poor</span>
		</div>
	</Field>
</Fieldset>

<style>
	.range-input { width: 100%; accent-color: var(--color-primary); }
	.range-legend { margin-top: 0.25rem; display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--color-muted); }
	.range-current { color: var(--color-text); font-weight: 500; }
</style>
