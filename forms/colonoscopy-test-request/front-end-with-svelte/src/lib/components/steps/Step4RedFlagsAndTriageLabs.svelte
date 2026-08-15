<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { request } from '#lib/stores/request.svelte.js';
	import { FIT_POSITIVE_THRESHOLD } from '#lib/engine/urgency-rules.js';

	const d = request.data;

	const fitPositive = $derived(
		d.redFlags.fitResultUgG !== null && Number(d.redFlags.fitResultUgG) >= FIT_POSITIVE_THRESHOLD
	);
	const redFlagCount = $derived(
		[d.redFlags.weightLoss, d.redFlags.anaemia, d.redFlags.abdominalMass, d.redFlags.rectalBleeding].filter(
			Boolean
		).length
	);
</script>

<Fieldset legend="4. Red Flags and Triage Labs">
	<p class="hint">Lower-GI red flags and FIT / haemoglobin results drive the cancer-pathway urgency axis.</p>

	<Field label="Lower-GI red flags (NICE NG12)">
		<CheckboxGroup label="Lower-GI red flags">
			<label><CheckboxInput label="Unexplained weight loss" bind:checked={d.redFlags.weightLoss} /> Unexplained weight loss</label>
			<label><CheckboxInput label="Iron-deficiency anaemia" bind:checked={d.redFlags.anaemia} /> Iron-deficiency anaemia</label>
			<label><CheckboxInput label="Palpable abdominal / rectal mass" bind:checked={d.redFlags.abdominalMass} /> Palpable abdominal / rectal mass</label>
			<label><CheckboxInput label="Unexplained rectal bleeding" bind:checked={d.redFlags.rectalBleeding} /> Unexplained rectal bleeding</label>
		</CheckboxGroup>
	</Field>

	{#if d.redFlags.abdominalMass || redFlagCount >= 2}
		<Alert type="warning" heading="Suspected-cancer pathway">
			<p>
				A palpable mass, or a combination of lower-GI red flags, meets NICE NG12 two-week-wait
				criteria and escalates triage to the suspected-cancer pathway.
			</p>
		</Alert>
	{/if}

	<Field label="FIT result" inputId="fitResultUgG" description="µg Hb/g — ≥ 10 triggers the suspected-cancer 2WW pathway (NICE DG56).">
		<NumberInput id="fitResultUgG" label="FIT result" min={0} step={0.1} bind:value={d.redFlags.fitResultUgG} />
	</Field>

	{#if fitPositive}
		<Alert type="warning" heading="Positive FIT">
			<p>FIT ≥ {FIT_POSITIVE_THRESHOLD} µg Hb/g (NICE DG56) escalates this request to the two-week-wait suspected-cancer pathway.</p>
		</Alert>
	{/if}

	<Field label="Haemoglobin" inputId="haemoglobinGL" description="g/L">
		<NumberInput id="haemoglobinGL" label="Haemoglobin" min={0} step={0.1} bind:value={d.redFlags.haemoglobinGL} />
	</Field>
</Fieldset>
