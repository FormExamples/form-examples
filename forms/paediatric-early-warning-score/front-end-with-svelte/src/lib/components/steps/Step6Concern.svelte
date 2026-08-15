<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const c = assessment.data.concern;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 6 of 7 — Documented concern">
	<p class="hint">
		Nurse / staff concern and parent / carer concern are independent escalation triggers — each
		raises the escalation regardless of the aggregate total.
	</p>

	<Field
		label="Is there documented nurse / staff concern?"
		description="A recognised, independent predictor of deterioration."
	>
		<RadioGroup label="Is there documented nurse / staff concern?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="concern-nurseConcern"
						value={opt.value}
						bind:group={c.nurseConcern}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field
		label="Is there documented parent / carer concern?"
		description="A recognised, independent predictor of deterioration."
	>
		<RadioGroup label="Is there documented parent / carer concern?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="concern-parentConcern"
						value={opt.value}
						bind:group={c.parentConcern}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
