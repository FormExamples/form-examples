<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const r = assessment.data.risk;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const yesNoUnknown = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'unknown', label: 'Unknown' }
	];
</script>

<Fieldset legend="Step 6 of 9 — Immediate risk and safety">
	<p class="hint">
		Whether the child is in immediate danger, where they are, and who else may be at risk.
	</p>

	<Field
		label="Is the child in immediate danger?"
		description="If yes, this is an emergency — phone 999 and social care now; do not wait for this form."
	>
		<RadioGroup label="Is the child in immediate danger?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="risk-immediateDanger"
						value={opt.value}
						bind:group={r.immediateDanger}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Where is the child now?" inputId="risk-childWhereabouts">
		<TextAreaInput
			id="risk-childWhereabouts"
			label="Where is the child now?"
			rows={2}
			placeholder="Current location of the child."
			bind:value={r.childWhereabouts}
		/>
	</Field>

	<Field label="Who is with the child?" inputId="risk-whoWithChild">
		<TextInput
			id="risk-whoWithChild"
			label="Who is with the child?"
			placeholder="Who is currently with the child."
			bind:value={r.whoWithChild}
		/>
	</Field>

	<Field label="Is the alleged person who caused harm in contact with the child?">
		<RadioGroup label="Is the alleged person who caused harm in contact with the child?">
			{#each yesNoUnknown as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="risk-allegedPersonInContact"
						value={opt.value}
						bind:group={r.allegedPersonInContact}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field
		label="Are other children at risk?"
		description="Siblings or other children in the household."
	>
		<RadioGroup label="Are other children at risk?">
			{#each yesNoUnknown as opt (opt.value)}
				<label>
					<input
						type="radio"
						class="radio-input"
						name="risk-otherChildrenAtRisk"
						value={opt.value}
						bind:group={r.otherChildrenAtRisk}
					/>
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
