<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import Button from '#lib/components/ui/Button.svelte';
	import RowCard from '#lib/components/ui/RowCard.svelte';
	import * as options from '#lib/config/options.js';
	import { TOTAL_STEPS } from '#lib/config/steps.js';
	import { emptyMedicationRow } from '#lib/engine/types.js';

	const s = assessment.data.medications;

	function add() {
		s.rows.push(emptyMedicationRow());
	}

	function remove(index: number) {
		s.rows.splice(index, 1);
	}
</script>

<Fieldset legend={`Step 8 of ${TOTAL_STEPS} — Medications and prescribing`}>
	<p class="hint">
		Prescribing changes made on this entry. Required component — record changes, or tick "no
		medication changes".
	</p>

	<Field
		label="No medication changes?"
		description="Yes documents the medications component as a deliberate negative."
		inputId="medications-noMedicationChanges"
	>
		<Select id="medications-noMedicationChanges" label="No medication changes?" bind:value={s.noMedicationChanges}>
			<option value="">— Select —</option>
			{#each options.yesNo as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field
		label="Allergy status checked?"
		description="Recording a prescribing change without this raises a high-priority flag."
		inputId="medications-allergyChecked"
	>
		<Select id="medications-allergyChecked" label="Allergy status checked?" bind:value={s.allergyChecked}>
			<option value="">— Select —</option>
			{#each options.yesNo as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Medicines reconciliation" inputId="medications-medicinesReconciliationStatus">
		<Select
			id="medications-medicinesReconciliationStatus"
			label="Medicines reconciliation"
			bind:value={s.medicinesReconciliationStatus}
		>
			<option value="">— Select —</option>
			{#each options.medicinesReconciliation as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field
		label="Antimicrobial review"
		description="NICE NG15 expects a documented review at 48–72 hours. Overdue raises a flag."
		inputId="medications-antimicrobialReviewStatus"
	>
		<Select
			id="medications-antimicrobialReviewStatus"
			label="Antimicrobial review"
			bind:value={s.antimicrobialReviewStatus}
		>
			<option value="">— Select —</option>
			{#each options.antimicrobialReview as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<p class="label">Medication changes ({s.rows.length})</p>
	{#if s.rows.length === 0}
		<p class="hint">No medication changes added yet.</p>
	{/if}

	{#each s.rows as row, i (i)}
		<RowCard title="Medication change" index={i} onRemove={() => remove(i)}>
			<Field label="Drug" inputId={`medications-${i}-drugName`}>
				<TextInput
					id={`medications-${i}-drugName`}
					label="Drug"
					placeholder="Generic name where possible"
					bind:value={row.drugName}
				/>
			</Field>

			<Field label="Action" inputId={`medications-${i}-action`}>
				<Select id={`medications-${i}-action`} label="Action" bind:value={row.action}>
					<option value="">— Select —</option>
					{#each options.medicationAction as o (o.value)}
						<option value={o.value}>{o.label}</option>
					{/each}
				</Select>
			</Field>

			<Field label="Dose" inputId={`medications-${i}-dose`}>
				<TextInput id={`medications-${i}-dose`} label="Dose" placeholder="e.g. 500 mg" bind:value={row.dose} />
			</Field>

			<Field label="Route" inputId={`medications-${i}-route`}>
				<Select id={`medications-${i}-route`} label="Route" bind:value={row.route}>
					<option value="">— Select —</option>
					{#each options.medicationRoute as o (o.value)}
						<option value={o.value}>{o.label}</option>
					{/each}
				</Select>
			</Field>

			<Field label="Frequency" inputId={`medications-${i}-frequency`}>
				<TextInput
					id={`medications-${i}-frequency`}
					label="Frequency"
					placeholder="e.g. three times a day"
					bind:value={row.frequency}
				/>
			</Field>

			<Field
				label="Indication"
				description="Required by NICE NG15 for every antimicrobial."
				inputId={`medications-${i}-indication`}
			>
				<TextInput id={`medications-${i}-indication`} label="Indication" bind:value={row.indication} />
			</Field>

			<Field label="Antimicrobial?" inputId={`medications-${i}-isAntimicrobial`}>
				<Select id={`medications-${i}-isAntimicrobial`} label="Antimicrobial?" bind:value={row.isAntimicrobial}>
					<option value="">— Select —</option>
					{#each options.yesNo as o (o.value)}
						<option value={o.value}>{o.label}</option>
					{/each}
				</Select>
			</Field>

			<Field label="Review date" inputId={`medications-${i}-reviewDate`}>
				<DateInput id={`medications-${i}-reviewDate`} label="Review date" bind:value={row.reviewDate} />
			</Field>

			<Field label="Notes" inputId={`medications-${i}-notes`}>
				<TextAreaInput id={`medications-${i}-notes`} label="Notes" rows={2} bind:value={row.notes} />
			</Field>
		</RowCard>
	{/each}

	<Button data-variant="secondary" onclick={add}>Add a medication change</Button>
</Fieldset>
