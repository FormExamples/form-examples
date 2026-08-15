<script lang="ts">
	import { store } from '#lib/stores/fitnote.svelte.js';
	import { PRACTICE_SETTINGS, PROFESSIONS, REGISTRATION_BODIES } from '#lib/engine/types.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import YesNo from '#lib/components/ui/YesNo.svelte';

	const c = store.data.clinician;
	const mp = store.data.medicalPractice;
</script>

<Fieldset legend="Issuer identification">
	<p class="hint">The healthcare professional issuing the fit note and their practice.</p>

	<div class="field-grid">
		<Field label="Clinician name" required inputId="clinician-name">
			<TextInput id="clinician-name" label="Clinician name" required bind:value={c.name} />
		</Field>
		<Field label="Profession" required inputId="clinician-profession">
			<Select id="clinician-profession" label="Profession" required bind:value={c.profession}>
				<option value="">—</option>
				{#each PROFESSIONS as p (p.value)}
					<option value={p.value}>{p.label}</option>
				{/each}
			</Select>
		</Field>
		<Field label="Registration body" inputId="clinician-registration-body">
			<Select
				id="clinician-registration-body"
				label="Registration body"
				bind:value={c.registrationBody}
			>
				<option value="">—</option>
				{#each REGISTRATION_BODIES as r (r.value)}
					<option value={r.value}>{r.label}</option>
				{/each}
			</Select>
		</Field>
		<Field label="Registration number" inputId="clinician-registration-number">
			<TextInput
				id="clinician-registration-number"
				label="Registration number"
				bind:value={c.registrationNumber}
			/>
		</Field>
	</div>

	<Field label="Private practice?">
		<YesNo label="Private practice?" name="isPrivatePractice" bind:value={c.isPrivatePractice} />
	</Field>

	<div class="field-grid">
		<Field label="Medical practice name" inputId="practice-name">
			<TextInput id="practice-name" label="Medical practice name" bind:value={mp.name} />
		</Field>
		<Field label="Postcode" inputId="practice-postcode">
			<TextInput id="practice-postcode" label="Postcode" bind:value={mp.postcode} />
		</Field>
	</div>

	<Field
		label="Practice address"
		required
		description="Postal address as a single free-text block."
		inputId="practice-address"
	>
		<TextAreaInput
			id="practice-address"
			label="Practice address"
			rows={3}
			required
			bind:value={mp.postalAddressAsFullText}
		/>
	</Field>

	<div class="field-grid">
		<Field label="Practice setting" inputId="practice-setting">
			<Select id="practice-setting" label="Practice setting" bind:value={mp.setting}>
				<option value="">—</option>
				{#each PRACTICE_SETTINGS as s (s.value)}
					<option value={s.value}>{s.label}</option>
				{/each}
			</Select>
		</Field>
		<Field
			label="ODS code (optional)"
			description="NHS Organisation Data Service code."
			inputId="practice-ods"
		>
			<TextInput id="practice-ods" label="ODS code" bind:value={mp.odsCode} />
		</Field>
	</div>
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
