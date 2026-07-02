<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.cpr;
	const cprOptions = [
		{ value: 'attempt', label: 'CPR should be attempted' },
		{ value: 'do-not-attempt', label: 'CPR should NOT be attempted (DNACPR)' }
	];
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 5 of 9 — CPR recommendation">
	<p class="hint">
		The explicit recommendation on cardiopulmonary resuscitation — the most safety-critical field.
	</p>

	<Field label="CPR recommendation" required>
		<RadioGroup label="CPR recommendation">
			{#each cprOptions as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="cpr-cprRecommendation"
						value={opt.value}
						bind:group={c.cprRecommendation}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Clinical rationale" inputId="cpr-cprRationale">
		<TextAreaInput
			id="cpr-cprRationale"
			label="Clinical rationale"
			rows={3}
			placeholder="The clinical reasoning behind this recommendation."
			bind:value={c.cprRationale}
		/>
	</Field>

	<Field
		label="Was this discussed with the person or their proxy?"
		description="A do-not-attempt recommendation should be accompanied by a documented discussion."
	>
		<RadioGroup label="Was this discussed with the person or their proxy?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="cpr-cprDiscussed"
						value={opt.value}
						bind:group={c.cprDiscussed}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
