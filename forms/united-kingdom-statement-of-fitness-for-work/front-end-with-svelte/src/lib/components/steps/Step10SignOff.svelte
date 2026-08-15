<script lang="ts">
	import { store } from '#lib/stores/fitnote.svelte.js';
	import { ISSUED_VIA_OPTIONS, PRACTICE_SETTINGS } from '#lib/engine/types.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import YesNo from '#lib/components/ui/YesNo.svelte';

	const d = store.data;
</script>

<Fieldset legend="Sign-off">
	<p class="hint">Issue details and any safeguarding concerns.</p>

	<div class="field-grid">
		<Field label="Issue date" inputId="issued-at">
			<DateInput id="issued-at" label="Issue date" bind:value={d.issuedAt} />
		</Field>
		<Field label="Issued via" inputId="issued-via">
			<Select id="issued-via" label="Issued via" bind:value={d.issuedVia}>
				<option value="">—</option>
				{#each ISSUED_VIA_OPTIONS as v (v.value)}
					<option value={v.value}>{v.label}</option>
				{/each}
			</Select>
		</Field>
		<Field label="Issue setting" inputId="issue-setting">
			<Select id="issue-setting" label="Issue setting" bind:value={d.issueSetting}>
				<option value="">—</option>
				{#each PRACTICE_SETTINGS as s (s.value)}
					<option value={s.value}>{s.label}</option>
				{/each}
			</Select>
		</Field>
		<Field label="Safeguarding concern raised?">
			<YesNo
				label="Safeguarding concern raised?"
				name="safeguardingConcern"
				bind:value={d.safeguardingConcern}
			/>
		</Field>
	</div>

	<Field
		label="Safeguarding notes (not printed on fit note)"
		inputId="safeguarding-notes"
	>
		<TextAreaInput
			id="safeguarding-notes"
			label="Safeguarding notes"
			rows={3}
			bind:value={d.safeguardingNotes}
		/>
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
