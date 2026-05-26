<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';

	const r = assessment.data.patientRights;

	const yesNoOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const rows: { key: keyof typeof r; label: string; name: string }[] = [
		{ key: 'rightToWithdraw', label: 'Patient understands they have the right to withdraw consent at any time', name: 'rightToWithdraw' },
		{ key: 'rightToSecondOpinion', label: 'Patient understands they have the right to seek a second opinion', name: 'rightToSecondOpinion' },
		{ key: 'informedVoluntarily', label: 'Patient confirms consent is given voluntarily and without coercion', name: 'informedVoluntarily' },
		{ key: 'noGuaranteeAcknowledged', label: 'Patient acknowledges that no guarantee of outcome has been made', name: 'noGuaranteeAcknowledged' }
	];
</script>

<Fieldset legend="Patient Rights">
	<p class="hint">Confirm understanding and acknowledgement of patient rights.</p>

	<Alert type="info">
		<p>Please confirm the following patient rights have been discussed.</p>
	</Alert>

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
							bind:group={r[row.key]}
							required
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}
</Fieldset>
