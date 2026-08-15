<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const d = assessment.data.anaestheticAssessment;
</script>

<Fieldset legend="Anaesthetic Assessment">
	<p class="hint">Pre-anaesthetic fitness for marrow harvest under general anaesthetic.</p>

	<div class="grid">
		<Field label="ASA Grade" inputId="asaGrade">
			<Select id="asaGrade" label="ASA Grade" bind:value={d.asaGrade}>
				<option value="">Select…</option>
				<option value="I">I — Healthy</option>
				<option value="II">II — Mild systemic disease</option>
				<option value="III">III — Severe systemic disease</option>
				<option value="IV">IV — Life-threatening disease</option>
			</Select>
		</Field>
		<Field label="Mallampati Score" inputId="mallampatiScore">
			<Select id="mallampatiScore" label="Mallampati Score" bind:value={d.mallampatiScore}>
				<option value="">Select…</option>
				<option value="I">I</option>
				<option value="II">II</option>
				<option value="III">III</option>
				<option value="IV">IV</option>
			</Select>
		</Field>
	</div>

	<Field label="Previous Anaesthetic" inputId="previousAnaesthetic">
		<Select id="previousAnaesthetic" label="Previous Anaesthetic" bind:value={d.previousAnaesthetic}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Anaesthetic Complications" inputId="anaestheticComplications">
		<Select id="anaestheticComplications" label="Anaesthetic Complications" bind:value={d.anaestheticComplications}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
	{#if d.anaestheticComplications === 'yes'}
		<Field label="Complication details" inputId="complicationDetails">
			<TextInput id="complicationDetails" label="Complication details" bind:value={d.complicationDetails} />
		</Field>
	{/if}

	<Field label="Family Anaesthetic Problems" inputId="familyAnaestheticProblems">
		<Select id="familyAnaestheticProblems" label="Family Anaesthetic Problems" bind:value={d.familyAnaestheticProblems}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Airway Concerns" inputId="airwayConcerns">
		<Select id="airwayConcerns" label="Airway Concerns" bind:value={d.airwayConcerns}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<div class="grid grid-3">
		<Field label="Smoking Status" inputId="smokingStatus">
			<Select id="smokingStatus" label="Smoking Status" bind:value={d.smokingStatus}>
				<option value="">Select…</option>
				<option value="current">Current</option>
				<option value="ex">Ex-smoker</option>
				<option value="never">Never</option>
			</Select>
		</Field>
		<Field label="Alcohol Use" inputId="alcoholUse">
			<Select id="alcoholUse" label="Alcohol Use" bind:value={d.alcoholUse}>
				<option value="">Select…</option>
				<option value="none">None</option>
				<option value="occasional">Occasional</option>
				<option value="moderate">Moderate</option>
				<option value="heavy">Heavy</option>
			</Select>
		</Field>
		<Field label="Anaesthetic Plan" inputId="anaestheticPlan">
			<Select id="anaestheticPlan" label="Anaesthetic Plan" bind:value={d.anaestheticPlan}>
				<option value="">Select…</option>
				<option value="general">General</option>
				<option value="regional">Regional</option>
				<option value="sedation">Sedation</option>
			</Select>
		</Field>
	</div>

	<Field label="Nil By Mouth Confirmed" inputId="nilByMouthConfirmed">
		<Select id="nilByMouthConfirmed" label="Nil By Mouth Confirmed" bind:value={d.nilByMouthConfirmed}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.grid.grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		.grid,
		.grid.grid-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
