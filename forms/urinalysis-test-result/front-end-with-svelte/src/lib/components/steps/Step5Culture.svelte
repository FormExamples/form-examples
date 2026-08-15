<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Culture & Sensitivities">
	<p class="hint">Culture outcome, organism, colony count, and antibiotic sensitivities.</p>

	<Field label="Culture result" inputId="cultureResult">
		<Select id="cultureResult" label="Culture result" bind:value={d.cultureResult}>
			<option value="">Select…</option>
			<option value="no-growth">No growth</option>
			<option value="mixed-growth-likely-contaminant">Mixed growth (likely contaminant)</option>
			<option value="significant-growth">Significant growth</option>
		</Select>
	</Field>

	<Field label="Organism isolated" inputId="organismIsolated">
		<TextInput
			id="organismIsolated"
			label="Organism isolated"
			placeholder="e.g. Escherichia coli"
			bind:value={d.organismIsolated}
		/>
	</Field>

	<Field label="Colony count" inputId="colonyCountCfuMl">
		<TextInput
			id="colonyCountCfuMl"
			label="Colony count"
			placeholder="e.g. >10^5 cfu/mL"
			bind:value={d.colonyCountCfuMl}
		/>
	</Field>

	<Field label="Antibiotic sensitivities" inputId="antibioticSensitivities">
		<TextAreaInput
			id="antibioticSensitivities"
			label="Antibiotic sensitivities"
			rows={3}
			placeholder="e.g. Trimethoprim R, Nitrofurantoin S"
			bind:value={d.antibioticSensitivities}
		/>
	</Field>

	<Field label="Critical-finding flags">
		<CheckboxGroup label="Critical-finding flags">
			<label>
				<CheckboxInput label="Critical organism (requires prompt action)" bind:checked={d.criticalOrganism} />
				Critical organism (requires prompt action)
			</label>
			<label>
				<CheckboxInput label="Visible (frank) haematuria" bind:checked={d.visibleHaematuria} /> Visible
				(frank) haematuria
			</label>
			<label>
				<CheckboxInput label="Findings suggesting urosepsis" bind:checked={d.suspectedUrosepsis} /> Findings
				suggesting urosepsis
			</label>
		</CheckboxGroup>
	</Field>

	{#if (d.cultureResult === 'significant-growth' && d.pregnant) || d.criticalOrganism || d.visibleHaematuria || d.suspectedUrosepsis}
		<Alert type="error" heading="Critical finding selected">
			<p>
				Significant growth in pregnancy, a critical organism, suspected urosepsis, or visible
				haematuria auto-escalates the follow-up urgency to a critical alert. Ensure the result is
				communicated to the requester on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
