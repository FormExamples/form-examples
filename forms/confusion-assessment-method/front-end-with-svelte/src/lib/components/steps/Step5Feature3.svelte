<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { featureStateLabel } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const f = assessment.data.feature3;
	const presentAbsent = [
		{ value: 'present', label: 'Present' },
		{ value: 'absent', label: 'Absent' }
	];
	const pillColor = $derived(
		f.disorganisedThinking === 'present'
			? 'bg-error text-error-content border-error'
			: 'bg-base-300 text-base-content border-base-300'
	);
</script>

<Fieldset legend="Step 5 of 8 — Feature 3: disorganised thinking">
	<p class="hint">
		Positive when thinking is disorganised or incoherent — rambling or irrelevant conversation,
		illogical flow of ideas, or unpredictable switching between subjects.
	</p>

	<Field label="Is feature 3 (disorganised thinking) present?">
		<RadioGroup label="Is feature 3 (disorganised thinking) present?">
			{#each presentAbsent as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="feature3-disorganisedThinking"
						value={opt.value}
						bind:group={f.disorganisedThinking}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Feature 3 status">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pillColor}">
			{featureStateLabel(f.disorganisedThinking)}
		</span>
	</Field>
</Fieldset>
