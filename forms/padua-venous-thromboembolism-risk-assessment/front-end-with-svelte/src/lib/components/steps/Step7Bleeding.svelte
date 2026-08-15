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

<Fieldset legend="Step 7 of 8 — Bleeding-risk check">
	<p class="hint">
		Informational only — these answers do not change the Padua score, but they gate the prophylaxis
		recommendation.
	</p>

	<Field label="Active bleeding?">
		<p class="hint">Active bleeding contraindicates pharmacological thromboprophylaxis.</p>
		<RadioGroup label="Active bleeding?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="bleeding-activeBleeding"
						value={opt.value}
						bind:group={b.activeBleeding}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Other high bleeding-risk factors present?">
		<p class="hint">
			e.g. recent bleeding, severe thrombocytopenia, untreated bleeding disorder.
		</p>
		<RadioGroup label="Other high bleeding-risk factors present?">
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
