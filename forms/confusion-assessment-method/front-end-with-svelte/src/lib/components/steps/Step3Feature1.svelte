<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { featureStateLabel } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const f = assessment.data.feature1;
	const presentAbsent = [
		{ value: 'present', label: 'Present' },
		{ value: 'absent', label: 'Absent' }
	];
	const pillColor = $derived(
		f.acuteOnsetFluctuating === 'present'
			? 'bg-error text-error-content border-error'
			: 'bg-base-300 text-base-content border-base-300'
	);
</script>

<Fieldset legend="Step 3 of 8 — Feature 1: acute onset and fluctuating course">
	<p class="hint">
		Positive when there is an acute change in mental status from baseline AND the abnormal behaviour
		fluctuates during the day.
	</p>

	<Field
		label="Is feature 1 (acute onset and fluctuating course) present?"
		description="Usually established from a family member, carer, or nurse who knows the patient's baseline."
	>
		<RadioGroup label="Is feature 1 (acute onset and fluctuating course) present?">
			{#each presentAbsent as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="feature1-acuteOnsetFluctuating"
						value={opt.value}
						bind:group={f.acuteOnsetFluctuating}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Onset timing of the change" inputId="feature1-onsetTiming">
		<Select id="feature1-onsetTiming" label="Onset timing of the change" bind:value={f.onsetTiming}>
			<option value="">— Select —</option>
			<option value="hours">Hours</option>
			<option value="days">Days</option>
			<option value="weeks">Weeks</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Feature 1 status">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pillColor}">
			{featureStateLabel(f.acuteOnsetFluctuating)}
		</span>
	</Field>
</Fieldset>
