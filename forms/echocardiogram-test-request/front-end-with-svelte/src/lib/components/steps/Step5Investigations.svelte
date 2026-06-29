<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.investigations;
</script>

<Fieldset legend="5. Investigations">
	<p class="hint">
		Investigations already performed. Natriuretic peptide (NT-proBNP) drives the urgency and
		priority axes per NICE NG106.
	</p>

	<Field label="ECG findings" inputId="ecgFindings">
		<TextAreaInput
			id="ecgFindings"
			label="ECG findings"
			rows={2}
			placeholder="e.g. Sinus rhythm, no acute changes…"
			bind:value={d.ecgFindings}
		/>
	</Field>

	<Field
		label="BNP / NT-proBNP (ng/L)"
		inputId="bnpOrNtProbnp"
		description="NICE NG106: > 2000 ng/L → echo within 2 weeks; 400–2000 ng/L → within 6 weeks."
	>
		<NumberInput id="bnpOrNtProbnp" label="BNP / NT-proBNP (ng/L)" min={0} bind:value={d.bnpOrNtProbnp} />
	</Field>

	{#if d.bnpOrNtProbnp !== null && Number(d.bnpOrNtProbnp) > 2000}
		<Alert type="warning" heading="Raised natriuretic peptide">
			<p>NT-proBNP above 2000 ng/L (NICE NG106) — echo within 2 weeks and high clinical priority.</p>
		</Alert>
	{/if}

	<Field label="Other findings">
		<CheckboxGroup label="Other findings">
			<label><CheckboxInput label="Known murmur" bind:checked={d.knownMurmur} /> Known murmur</label>
			<label
				><CheckboxInput label="On cardiotoxic chemotherapy" bind:checked={d.onCardiotoxicChemotherapy} />
				On cardiotoxic chemotherapy</label
			>
		</CheckboxGroup>
	</Field>
</Fieldset>
