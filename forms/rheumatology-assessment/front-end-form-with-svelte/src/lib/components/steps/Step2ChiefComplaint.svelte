<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.chiefComplaint;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Chief Complaint">
	<p class="hint">Primary joint complaint and symptom details.</p>

	<Field label="Primary Joint Complaint" inputId="primaryJointComplaint">
		<TextAreaInput id="primaryJointComplaint" label="Primary joint complaint" placeholder="Describe your main joint complaint..." bind:value={d.primaryJointComplaint} />
	</Field>

	<Field label="Onset Date" inputId="onsetDate">
		<DateInput id="onsetDate" label="Onset date" bind:value={d.onsetDate} />
	</Field>

	<Field label="Duration of Symptoms (months)" inputId="durationMonths">
		<NumberInput id="durationMonths" label="Duration" min={0} max={600} bind:value={d.durationMonths} />
	</Field>

	<Field label="Morning Stiffness Duration (minutes)" inputId="morningStiffness">
		<NumberInput id="morningStiffness" label="Morning stiffness" min={0} max={1440} bind:value={d.morningStiffnessDurationMinutes} />
	</Field>

	<Field label="Symmetric Joint Involvement">
		<RadioGroup label="Symmetric joint involvement">
			{#each yesNoOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="symmetricInvolvement" value={opt.value} bind:group={d.symmetricInvolvement} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
