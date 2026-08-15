<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.clinicianSignoff;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Clinician Sign-off">
	<p class="hint">Person completing the discharge summary.</p>

	<div class="field-grid">
		<Field label="Clinician name" required inputId="clinicianName">
			<TextInput id="clinicianName" label="Clinician name" required bind:value={d.clinicianName} />
		</Field>
		<Field label="Role / grade" required inputId="clinicianRole">
			<TextInput id="clinicianRole" label="Role / grade" required bind:value={d.clinicianRole} placeholder="e.g. ST3, Registrar, Consultant" />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="GMC / professional number" inputId="gmcNumber">
			<TextInput id="gmcNumber" label="GMC / professional number" bind:value={d.gmcNumber} />
		</Field>
		<Field label="Sign-off date" required inputId="signoffDate">
			<DateInput id="signoffDate" label="Sign-off date" required bind:value={d.signoffDate} />
		</Field>
	</div>

	<Field label="Bleep / contact number" inputId="bleepOrContact">
		<TextInput id="bleepOrContact" label="Bleep / contact number" bind:value={d.bleepOrContact} placeholder="For follow-up queries" />
	</Field>

	<Field label="Responsible consultant informed of discharge?">
		<RadioGroup label="Responsible consultant informed of discharge?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="responsibleConsultantInformed" value={opt.value} bind:group={d.responsibleConsultantInformed} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Additional notes for the receiving clinician / GP" inputId="additionalNotes">
		<TextAreaInput id="additionalNotes" label="Additional notes" rows={4} bind:value={d.additionalNotes} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
