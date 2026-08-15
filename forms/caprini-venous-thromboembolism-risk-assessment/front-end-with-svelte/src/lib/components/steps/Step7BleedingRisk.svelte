<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const b = assessment.data.bleeding;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 7 of 8 — Bleeding risk">
	<p class="hint">
		An active or high risk of bleeding contraindicates pharmacological prophylaxis. When present,
		any pharmacological recommendation is downgraded to mechanical prophylaxis.
	</p>

	<Field
		label="Is there an active or high risk of bleeding?"
		description="e.g. active bleeding, recent intracranial haemorrhage, severe thrombocytopenia, or a bleeding disorder."
	>
		<RadioGroup label="Is there an active or high risk of bleeding?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="bleeding-highBleedingRisk"
						value={opt.value}
						bind:group={b.highBleedingRisk}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
