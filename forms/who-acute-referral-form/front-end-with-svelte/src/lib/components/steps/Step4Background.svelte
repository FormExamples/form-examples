<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';

	const b = assessment.data.background;
</script>

<Fieldset
	title="Background"
	description="The second part of the SBAR framework. Briefly describe the relevant history and the ABCDE assessment with interventions."
>
	<TextAreaInput
		label="Brief history of present illness"
		name="historyOfPresentIllness"
		bind:value={b.historyOfPresentIllness}
		rows={3}
		required
	/>

	<TextAreaInput
		label="Relevant past medical & surgical history"
		name="pastMedicalAndSurgicalHistory"
		bind:value={b.pastMedicalAndSurgicalHistory}
		rows={3}
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">
		ABCDE — finding & intervention
	</h3>
	<p class="mb-4 text-xs text-base-content/60">
		For each system: tick "Normal" or describe the finding; then tick "None" or describe
		the intervention.
	</p>

	<!-- Airway -->
	<div class="mb-4 rounded-lg border border-base-300 bg-base-200 p-4">
		<h4 class="mb-2 text-sm font-semibold text-base-content/80">A — Airway</h4>
		<Checkbox
			label="Normal"
			name="airwayFindingNormal"
			bind:checked={b.airway.findingNormal}
		/>
		{#if !b.airway.findingNormal}
			<TextAreaInput
				label="Finding (describe abnormality)"
				name="airwayFindingDetails"
				bind:value={b.airway.findingDetails}
				rows={2}
			/>
		{/if}
		<Checkbox
			label="No intervention required"
			name="airwayInterventionNone"
			bind:checked={b.airway.interventionNone}
		/>
		{#if !b.airway.interventionNone}
			<TextAreaInput
				label="Intervention performed"
				name="airwayInterventionDetails"
				bind:value={b.airway.interventionDetails}
				rows={2}
			/>
		{/if}
	</div>

	<!-- Breathing -->
	<div class="mb-4 rounded-lg border border-base-300 bg-base-200 p-4">
		<h4 class="mb-2 text-sm font-semibold text-base-content/80">B — Breathing</h4>
		<Checkbox
			label="Normal"
			name="breathingFindingNormal"
			bind:checked={b.breathing.findingNormal}
		/>
		{#if !b.breathing.findingNormal}
			<TextAreaInput
				label="Finding (describe abnormality)"
				name="breathingFindingDetails"
				bind:value={b.breathing.findingDetails}
				rows={2}
			/>
		{/if}
		<Checkbox
			label="No intervention required"
			name="breathingInterventionNone"
			bind:checked={b.breathing.interventionNone}
		/>
		{#if !b.breathing.interventionNone}
			<TextAreaInput
				label="Intervention performed"
				name="breathingInterventionDetails"
				bind:value={b.breathing.interventionDetails}
				rows={2}
			/>
		{/if}
	</div>

	<!-- Circulation -->
	<div class="mb-4 rounded-lg border border-base-300 bg-base-200 p-4">
		<h4 class="mb-2 text-sm font-semibold text-base-content/80">C — Circulation</h4>
		<Checkbox
			label="Normal"
			name="circulationFindingNormal"
			bind:checked={b.circulation.findingNormal}
		/>
		{#if !b.circulation.findingNormal}
			<TextAreaInput
				label="Finding (describe abnormality)"
				name="circulationFindingDetails"
				bind:value={b.circulation.findingDetails}
				rows={2}
			/>
		{/if}
		<Checkbox
			label="No intervention required"
			name="circulationInterventionNone"
			bind:checked={b.circulation.interventionNone}
		/>
		{#if !b.circulation.interventionNone}
			<TextAreaInput
				label="Intervention performed"
				name="circulationInterventionDetails"
				bind:value={b.circulation.interventionDetails}
				rows={2}
			/>
		{/if}
	</div>

	<!-- Disability -->
	<div class="mb-4 rounded-lg border border-base-300 bg-base-200 p-4">
		<h4 class="mb-2 text-sm font-semibold text-base-content/80">
			D — Disability (neurologic status)
		</h4>
		<Checkbox
			label="Normal"
			name="disabilityFindingNormal"
			bind:checked={b.disability.findingNormal}
		/>
		{#if !b.disability.findingNormal}
			<TextAreaInput
				label="Finding (describe abnormality)"
				name="disabilityFindingDetails"
				bind:value={b.disability.findingDetails}
				rows={2}
			/>
		{/if}
		<Checkbox
			label="No intervention required"
			name="disabilityInterventionNone"
			bind:checked={b.disability.interventionNone}
		/>
		{#if !b.disability.interventionNone}
			<TextAreaInput
				label="Intervention performed"
				name="disabilityInterventionDetails"
				bind:value={b.disability.interventionDetails}
				rows={2}
			/>
		{/if}
	</div>

	<!-- Exposure -->
	<div class="mb-4 rounded-lg border border-base-300 bg-base-200 p-4">
		<h4 class="mb-2 text-sm font-semibold text-base-content/80">E — Exposure</h4>
		<Checkbox
			label="Normal"
			name="exposureFindingNormal"
			bind:checked={b.exposure.findingNormal}
		/>
		{#if !b.exposure.findingNormal}
			<TextAreaInput
				label="Finding (describe abnormality)"
				name="exposureFindingDetails"
				bind:value={b.exposure.findingDetails}
				rows={2}
			/>
		{/if}
		<Checkbox
			label="No intervention required"
			name="exposureInterventionNone"
			bind:checked={b.exposure.interventionNone}
		/>
		{#if !b.exposure.interventionNone}
			<TextAreaInput
				label="Intervention performed"
				name="exposureInterventionDetails"
				bind:value={b.exposure.interventionDetails}
				rows={2}
			/>
		{/if}
	</div>

	<TextAreaInput
		label="Any other significant treatments or procedures"
		name="otherSignificantTreatments"
		bind:value={b.otherSignificantTreatments}
		rows={3}
	/>
</Fieldset>
