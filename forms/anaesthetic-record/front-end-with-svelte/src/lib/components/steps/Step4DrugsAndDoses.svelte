<script lang="ts">
	import { assessment, createDefaultDrug } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import Button from '#lib/components/ui/Button.svelte';

	// Bind directly to the live store array so add/remove stay reactive and any
	// seeded child rows (merged in place by the store's deepAssign) show here.
	const d = $state(assessment.data);

	function addDrug() {
		d.drugs.push(createDefaultDrug());
	}
	function removeDrug(i: number) {
		d.drugs.splice(i, 1);
	}
</script>

<Fieldset legend="Step 4 of 12 — Drugs & doses">
	<p class="hint">One row per drug administered — dose, unit, route, category, and time.</p>

	{#if d.drugs.length === 0}
		<p class="hint">No drugs added yet. Add one row per drug administered.</p>
	{/if}

	{#each d.drugs as drug, i (i)}
		<div class="repeating-row">
			<div class="repeating-row-header">
				<h4 class="repeating-row-title">Drug {i + 1}</h4>
				<Button data-variant="danger" label={`Remove drug ${i + 1}`} onclick={() => removeDrug(i)}>
					Remove
				</Button>
			</div>

			<Field label="Drug name" inputId={`drugs-${i}-drugName`}>
				<TextInput id={`drugs-${i}-drugName`} label="Drug name" placeholder="e.g. Propofol" bind:value={drug.drugName} />
			</Field>

			<Field label="Category" inputId={`drugs-${i}-category`}>
				<Select id={`drugs-${i}-category`} label="Category" bind:value={drug.category}>
					<option value="">— Select —</option>
					<option value="induction">Induction</option>
					<option value="neuromuscular-blocker">Neuromuscular blocker</option>
					<option value="maintenance">Maintenance</option>
					<option value="reversal">Reversal</option>
					<option value="analgesia">Analgesia</option>
					<option value="antiemetic">Antiemetic</option>
					<option value="antibiotic">Antibiotic</option>
					<option value="vasoactive">Vasoactive</option>
					<option value="local-anaesthetic">Local anaesthetic</option>
					<option value="other">Other</option>
				</Select>
			</Field>

			<Field label="Dose" inputId={`drugs-${i}-dose`}>
				<NumberInput id={`drugs-${i}-dose`} label="Dose" min={0} step="any" bind:value={drug.dose} />
			</Field>

			<Field label="Unit" inputId={`drugs-${i}-doseUnit`}>
				<Select id={`drugs-${i}-doseUnit`} label="Unit" bind:value={drug.doseUnit}>
					<option value="">— Select —</option>
					<option value="mg">mg</option>
					<option value="mcg">mcg</option>
					<option value="g">g</option>
					<option value="ml">mL</option>
					<option value="units">units</option>
					<option value="mmol">mmol</option>
					<option value="puff">puff</option>
					<option value="other">other</option>
				</Select>
			</Field>

			<Field label="Route" inputId={`drugs-${i}-route`}>
				<Select id={`drugs-${i}-route`} label="Route" bind:value={drug.route}>
					<option value="">— Select —</option>
					<option value="iv">IV</option>
					<option value="im">IM</option>
					<option value="subcutaneous">Subcutaneous</option>
					<option value="inhalational">Inhalational</option>
					<option value="oral">Oral</option>
					<option value="topical">Topical</option>
					<option value="neuraxial">Neuraxial</option>
					<option value="infusion">Infusion</option>
					<option value="other">Other</option>
				</Select>
			</Field>

			<Field label="Time administered" inputId={`drugs-${i}-administeredAt`}>
				<TextInput
					id={`drugs-${i}-administeredAt`}
					label="Time administered"
					type="datetime-local"
					class="date-input"
					bind:value={drug.administeredAt}
				/>
			</Field>
		</div>
	{/each}

	<Button data-variant="secondary" onclick={addDrug}>+ Add drug</Button>
</Fieldset>
