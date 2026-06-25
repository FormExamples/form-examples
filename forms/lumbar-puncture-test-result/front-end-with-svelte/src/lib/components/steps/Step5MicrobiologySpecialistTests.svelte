<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';
	import { culturePositive } from '$lib/engine/utils';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Microbiology & Specialist Tests">
	<p class="hint">Gram stain, culture, PCR, and the specialist CSF tests.</p>

	<Field label="Gram stain result" inputId="gramStainResult">
		<TextAreaInput
			id="gramStainResult"
			label="Gram stain result"
			rows={2}
			placeholder="Gram stain appearance and organisms seen…"
			bind:value={d.gramStainResult}
		/>
	</Field>

	<Field
		label="Culture result"
		inputId="cultureResult"
		description="A positive culture is a critical result. Use phrases such as “No growth” when negative."
	>
		<TextAreaInput
			id="cultureResult"
			label="Culture result"
			rows={2}
			placeholder="Organisms grown, or “No growth”…"
			bind:value={d.cultureResult}
		/>
	</Field>

	{#if culturePositive(d)}
		<Alert type="error" heading="Positive culture">
			<p>
				A positive CSF culture is a critical result; the follow-up urgency auto-escalates to a
				critical alert. Communicate the result to the requesting clinician and record it on sign-off.
			</p>
		</Alert>
	{/if}

	<Field label="PCR / molecular result" inputId="pcrResult">
		<TextAreaInput
			id="pcrResult"
			label="PCR / molecular result"
			rows={2}
			placeholder="e.g. meningococcal, pneumococcal, herpes simplex, enterovirus PCR…"
			bind:value={d.pcrResult}
		/>
	</Field>

	<Field
		label="Oligoclonal bands"
		inputId="oligoclonalBands"
		description="CSF-specific bands support demyelination / multiple sclerosis."
	>
		<Select id="oligoclonalBands" label="Oligoclonal bands" bind:value={d.oligoclonalBands}>
			<option value="">Select…</option>
			<option value="positive">Positive</option>
			<option value="negative">Negative</option>
			<option value="not-tested">Not tested</option>
		</Select>
	</Field>

	<Field
		label="Xanthochromia (spectrophotometry)"
		inputId="xanthochromia"
		description="Positive supports subarachnoid haemorrhage when LP performed ≥ 12 h after headache onset (UK NEQAS)."
	>
		<Select id="xanthochromia" label="Xanthochromia (spectrophotometry)" bind:value={d.xanthochromia}>
			<option value="">Select…</option>
			<option value="positive">Positive</option>
			<option value="negative">Negative</option>
			<option value="not-tested">Not tested</option>
		</Select>
	</Field>
</Fieldset>
