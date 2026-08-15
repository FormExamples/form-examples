<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const q = assessment.data.questionsUnderstanding;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const rows: { key: keyof typeof q; label: string; name: string }[] = [
		{ key: 'understandsProcedure', label: 'Patient understands the procedure', name: 'understandsProcedure' },
		{ key: 'understandsRisks', label: 'Patient understands the risks', name: 'understandsRisks' },
		{ key: 'understandsAlternatives', label: 'Patient understands the alternatives', name: 'understandsAlternatives' },
		{ key: 'understandsRecovery', label: 'Patient understands the recovery process', name: 'understandsRecovery' }
	];
</script>

<Fieldset legend="Questions & Understanding">
	<p class="hint">Confirm patient understanding and record any questions.</p>

	<Field label="Questions Asked by Patient" inputId="questionsAsked">
		<TextAreaInput
			id="questionsAsked"
			label="Questions Asked by Patient"
			rows={3}
			placeholder="Record any questions the patient has asked..."
			bind:value={q.questionsAsked}
		/>
	</Field>

	{#each rows as row (row.key)}
		<Field label={row.label} required>
			<RadioGroup label={row.label}>
				{#each yesNoOptions as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name={row.name}
							value={opt.value}
							bind:group={q[row.key]}
							required
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Additional Concerns" inputId="additionalConcerns">
		<TextAreaInput
			id="additionalConcerns"
			label="Additional Concerns"
			rows={3}
			placeholder="Record any additional concerns raised by the patient..."
			bind:value={q.additionalConcerns}
		/>
	</Field>
</Fieldset>
