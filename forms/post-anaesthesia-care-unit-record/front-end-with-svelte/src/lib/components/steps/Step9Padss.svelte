<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { PADSS_OPTIONS } from '$lib/engine/pacu-rules';
	import { calculatePacuGrade } from '$lib/engine/pacu-grader';
	import { scoreColor } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const p = assessment.data.padss;
	const grade = $derived(calculatePacuGrade(assessment.data));

	const criteria: { field: keyof typeof p; label: string; key: string }[] = [
		{ field: 'padssVitalSigns', label: 'Vital signs (vs baseline)', key: 'padssVitalSigns' },
		{ field: 'padssAmbulation', label: 'Ambulation', key: 'padssAmbulation' },
		{ field: 'padssNauseaVomiting', label: 'Nausea and vomiting', key: 'padssNauseaVomiting' },
		{ field: 'padssPain', label: 'Pain', key: 'padssPain' },
		{ field: 'padssSurgicalBleeding', label: 'Surgical bleeding', key: 'padssSurgicalBleeding' }
	];
</script>

<Fieldset legend="Step 9 of 10 — PADSS (day surgery, optional)">
	<p class="hint">
		Post-Anaesthesia Discharge Scoring System — five criteria, each 0-2, total 0-10; 9 or more
		indicates street fitness for discharge home. Scored only for ambulatory (day-surgery) cases.
	</p>

	{#each criteria as crit (crit.key)}
		<Field label={crit.label}>
			<RadioGroup label={crit.label}>
				{#each PADSS_OPTIONS[crit.key] as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name={crit.key}
							value={opt.value}
							bind:group={p[crit.field]}
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Live PADSS total">
		{#if grade.padssTotal === null}
			<span class="text-sm text-base-content/70">
				Not scored — set the day-surgery case to Yes (Step 2) and complete all five criteria.
			</span>
		{:else}
			<span class="inline-flex items-center gap-3">
				<strong class="text-lg text-base-content">{grade.padssTotal} of 10</strong>
				<span
					class="inline-block rounded-full border px-3 py-1 text-sm font-bold {scoreColor(
						grade.padssStreetFit ? 2 : 0
					)}"
				>
					{grade.padssStreetFit ? 'Street-fit' : 'Not yet street-fit'}
				</span>
			</span>
		{/if}
	</Field>
</Fieldset>
