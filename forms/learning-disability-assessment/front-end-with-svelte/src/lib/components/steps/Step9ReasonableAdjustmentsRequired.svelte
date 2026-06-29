<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const r = assessment.data.reasonableAdjustments;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Reasonable Adjustments Required">
	<p class="hint">
		Adjustments that make NHS services accessible (Equality Act 2010 / Accessible Information
		Standard).
	</p>

	<Field label="Needs longer appointments?">
		<RadioGroup label="Needs longer appointments?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="needsLongerAppointments" value={opt.value} bind:group={r.needsLongerAppointments} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Needs a quiet room or low-stimulation environment?">
		<RadioGroup label="Needs a quiet room or low-stimulation environment?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="needsQuietRoom" value={opt.value} bind:group={r.needsQuietRoom} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Needs a familiar staff member or carer present?">
		<RadioGroup label="Needs a familiar staff member or carer present?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="needsFamiliarStaff" value={opt.value} bind:group={r.needsFamiliarStaff} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Needs Easy Read letters and information?">
		<RadioGroup label="Needs Easy Read letters and information?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="needsEasyReadLetters" value={opt.value} bind:group={r.needsEasyReadLetters} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Needs home visits rather than clinic appointments?">
		<RadioGroup label="Needs home visits rather than clinic appointments?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="needsHomeVisits" value={opt.value} bind:group={r.needsHomeVisits} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Needs a double-length appointment slot?">
		<RadioGroup label="Needs a double-length appointment slot?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="needsDoubleAppointment" value={opt.value} bind:group={r.needsDoubleAppointment} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Reasonable adjustments flag set on patient record?">
		<RadioGroup label="Reasonable adjustments flag set on patient record?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="flagOnRecord" value={opt.value} bind:group={r.flagOnRecord} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Other reasonable adjustments" inputId="otherAdjustments">
		<TextAreaInput id="otherAdjustments" label="Other reasonable adjustments" rows={3} placeholder="Any other adjustments needed for fair access to services…" bind:value={r.otherAdjustments} />
	</Field>
</Fieldset>
