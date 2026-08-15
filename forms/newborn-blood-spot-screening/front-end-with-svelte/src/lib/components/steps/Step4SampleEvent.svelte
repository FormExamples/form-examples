<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { computeAgeAtSampleDays } from '#lib/engine/bloodspot-rules.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.sampleEvent;
	const age = $derived(
		computeAgeAtSampleDays(assessment.data.babyId.dateOfBirth, s.sampleDate)
	);
	const withinWindow = $derived(age !== null && age >= 5 && age <= 8);
</script>

<Fieldset legend="Step 4 of 7 — Sample event">
	<p class="hint">
		When and where the heel-prick was taken. The optimal age is day 5; the acceptable window is
		day 5 to day 8.
	</p>

	<Field label="Sample date" inputId="sampleEvent-sampleDate">
		<DateInput id="sampleEvent-sampleDate" label="Sample date" bind:value={s.sampleDate} />
	</Field>

	<Field label="Sample time" inputId="sampleEvent-sampleTime">
		<TextInput
			id="sampleEvent-sampleTime"
			label="Sample time"
			type="time"
			bind:value={s.sampleTime}
		/>
	</Field>

	<Field label="Age at sample">
		<span class="inline-flex flex-wrap items-center gap-3">
			<span class="text-sm font-semibold text-base-content">
				{age === null ? 'Not calculable' : `Day ${age}`}
			</span>
			{#if age !== null}
				<span
					class="inline-block rounded-full border px-3 py-1 text-xs font-bold {withinWindow
						? 'bg-success text-success-content border-success'
						: 'bg-warning text-warning-content border-warning'}"
				>
					{withinWindow ? 'Within day 5–8 window' : 'Outside day 5–8 window'}
				</span>
			{/if}
		</span>
	</Field>

	<Field label="Sampling site" inputId="sampleEvent-samplingSite">
		<Select id="sampleEvent-samplingSite" label="Sampling site" bind:value={s.samplingSite}>
			<option value="">— Select —</option>
			<option value="heel">Heel</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Sample notes" inputId="sampleEvent-sampleNotes">
		<TextAreaInput
			id="sampleEvent-sampleNotes"
			label="Sample notes"
			rows={3}
			placeholder="Free-text note about the sample event."
			bind:value={s.sampleNotes}
		/>
	</Field>
</Fieldset>
