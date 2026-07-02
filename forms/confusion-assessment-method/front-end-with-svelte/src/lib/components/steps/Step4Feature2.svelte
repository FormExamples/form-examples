<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { featureStateLabel } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const f = assessment.data.feature2;
	const presentAbsent = [
		{ value: 'present', label: 'Present' },
		{ value: 'absent', label: 'Absent' }
	];
	const pillColor = $derived(
		f.inattention === 'present'
			? 'bg-error text-error-content border-error'
			: 'bg-base-300 text-base-content border-base-300'
	);
</script>

<Fieldset legend="Step 4 of 8 — Feature 2: inattention">
	<p class="hint">
		Positive when the patient has difficulty focusing attention — easily distractible or unable to
		keep track — confirmed with a formal attention test.
	</p>

	<Field label="Is feature 2 (inattention) present?">
		<RadioGroup label="Is feature 2 (inattention) present?">
			{#each presentAbsent as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="feature2-inattention"
						value={opt.value}
						bind:group={f.inattention}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Attention test used" inputId="feature2-attentionTest">
		<Select id="feature2-attentionTest" label="Attention test used" bind:value={f.attentionTest}>
			<option value="">— Select —</option>
			<option value="digit-span">Digit span</option>
			<option value="months-backwards">Months of the year backwards</option>
			<option value="serial-sevens">Serial sevens</option>
			<option value="attention-screening-examination">Attention Screening Examination (CAM-ICU)</option>
			<option value="not-completable">Not completable</option>
		</Select>
	</Field>

	<Field label="Feature 2 status">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pillColor}">
			{featureStateLabel(f.inattention)}
		</span>
	</Field>
</Fieldset>
