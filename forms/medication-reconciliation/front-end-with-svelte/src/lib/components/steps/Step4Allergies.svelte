<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { emptyAllergy } from '#lib/engine/utils.js';
	import type { Allergy } from '#lib/engine/types.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import ListEditor from '#lib/components/ui/ListEditor.svelte';

	const data = assessment.data;
</script>

<Fieldset legend="Step 4 of 7 — Allergies and adverse reactions">
	<p class="hint">
		Record the allergy status, then add each documented drug allergy or adverse reaction.
	</p>

	<Field
		label="Allergy status"
		required
		description='Required. "Not documented" or blank keeps the reconciliation incomplete.'
		inputId="allergyReview-allergyStatus"
	>
		<Select
			id="allergyReview-allergyStatus"
			label="Allergy status"
			required
			bind:value={data.allergyReview.allergyStatus}
		>
			<option value="">— Select —</option>
			<option value="documented">Allergies documented (add below)</option>
			<option value="no-known-drug-allergies">No known drug allergies</option>
			<option value="not-documented">Not documented</option>
		</Select>
	</Field>

	<ListEditor
		bind:items={data.allergies}
		factory={emptyAllergy}
		singular="Allergy"
		addLabel="+ Add allergy"
		emptyText="No allergies added. Add each documented drug allergy or adverse reaction."
	>
		{#snippet row(item: Allergy)}
			<label class="list-cell block sm:col-span-2">
				<span class="mb-1 block text-sm font-medium text-base-content/80"
					>Substance (drug or class)</span
				>
				<TextInput label="Substance" placeholder="e.g. Penicillin" bind:value={item.substance} />
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Reaction type</span>
				<Select label="Reaction type" bind:value={item.reactionType}>
					<option value="">— Select —</option>
					<option value="allergy">Allergy</option>
					<option value="intolerance">Intolerance</option>
					<option value="adverse-effect">Adverse effect</option>
					<option value="unknown">Unknown</option>
				</Select>
			</label>
			<label class="list-cell block">
				<span class="mb-1 block text-sm font-medium text-base-content/80">Severity</span>
				<Select label="Severity" bind:value={item.severity}>
					<option value="">— Select —</option>
					<option value="mild">Mild</option>
					<option value="moderate">Moderate</option>
					<option value="severe">Severe</option>
					<option value="anaphylaxis">Anaphylaxis</option>
				</Select>
			</label>
		{/snippet}
	</ListEditor>
</Fieldset>
