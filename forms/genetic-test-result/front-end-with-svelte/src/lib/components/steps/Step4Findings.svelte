<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;

	const isPathogenic = $derived(
		d.pathogenicVariantFound ||
			d.variantClassification === 'pathogenic' ||
			d.variantClassification === 'likely-pathogenic'
	);
</script>

<Fieldset legend="4. Findings">
	<p class="hint">
		The detected variant(s), the ACMG/AMP (ACGS) classification, zygosity, and the structured
		finding flags.
	</p>

	<Field label="Variants detected" inputId="variantsDetected">
		<TextAreaInput
			id="variantsDetected"
			label="Variants detected"
			rows={5}
			placeholder="Narrative description of the variant(s) with HGVS nomenclature, gene, and transcript…"
			bind:value={d.variantsDetected}
		/>
	</Field>

	<Field label="Variant classification (ACMG/AMP)" inputId="variantClassification">
		<Select
			id="variantClassification"
			label="Variant classification"
			bind:value={d.variantClassification}
		>
			<option value="">Select…</option>
			<option value="pathogenic">Pathogenic (Class 5)</option>
			<option value="likely-pathogenic">Likely pathogenic (Class 4)</option>
			<option value="variant-uncertain-significance">Variant of uncertain significance (Class 3)</option>
			<option value="likely-benign">Likely benign (Class 2)</option>
			<option value="benign">Benign (Class 1)</option>
			<option value="no-variant-detected">No variant detected</option>
		</Select>
	</Field>

	<Field label="Zygosity" inputId="zygosity">
		<Select id="zygosity" label="Zygosity" bind:value={d.zygosity}>
			<option value="">Select…</option>
			<option value="heterozygous">Heterozygous</option>
			<option value="homozygous">Homozygous</option>
			<option value="hemizygous">Hemizygous</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Structured findings">
		<CheckboxGroup label="Structured findings">
			<label><CheckboxInput label="Pathogenic / likely-pathogenic variant found" bind:checked={d.pathogenicVariantFound} /> Pathogenic / likely-pathogenic variant found</label>
			<label><CheckboxInput label="Variant of uncertain significance found" bind:checked={d.vusFound} /> Variant of uncertain significance found</label>
			<label><CheckboxInput label="Carrier status positive" bind:checked={d.carrierStatusPositive} /> Carrier status positive</label>
			<label><CheckboxInput label="Secondary / incidental finding" bind:checked={d.secondaryFinding} /> Secondary / incidental finding</label>
			<label><CheckboxInput label="No clinically significant variant" bind:checked={d.noClinicallySignificantVariant} /> No clinically significant variant</label>
		</CheckboxGroup>
	</Field>

	{#if isPathogenic}
		<Alert type="error" heading="Actionable variant selected">
			<p>
				A pathogenic or likely-pathogenic variant auto-escalates the follow-up urgency to a critical
				alert. Ensure the result is communicated to the referrer and cascade testing is offered on
				sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
