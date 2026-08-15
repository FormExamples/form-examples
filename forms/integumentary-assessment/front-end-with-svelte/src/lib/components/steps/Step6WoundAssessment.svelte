<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateWoundArea } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.woundAssessment;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const stageOptions = [
		{ value: 'stage-i', label: 'Stage I — non-blanchable erythema' },
		{ value: 'stage-ii', label: 'Stage II — partial-thickness skin loss' },
		{ value: 'stage-iii', label: 'Stage III — full-thickness skin loss' },
		{ value: 'stage-iv', label: 'Stage IV — full-thickness tissue loss (muscle/bone)' },
		{ value: 'unstageable', label: 'Unstageable — slough/eschar obscures depth' },
		{ value: 'deep-tissue-injury', label: 'Suspected deep tissue injury' },
		{ value: 'non-pressure', label: 'Non-pressure wound (e.g. surgical, traumatic)' }
	];
	const tissueOptions = [
		{ value: 'granulation', label: 'Granulation (red, healthy)' },
		{ value: 'epithelialising', label: 'Epithelialising (pink)' },
		{ value: 'slough', label: 'Slough (yellow)' },
		{ value: 'necrotic', label: 'Necrotic (black, soft)' },
		{ value: 'eschar', label: 'Eschar (black, hard)' },
		{ value: 'mixed', label: 'Mixed' }
	];
	const moistureOptions = [
		{ value: 'dry', label: 'Dry' },
		{ value: 'balanced', label: 'Balanced' },
		{ value: 'macerated', label: 'Macerated (over-moist)' }
	];
	const edgeOptions = [
		{ value: 'attached', label: 'Attached / advancing' },
		{ value: 'rolled', label: 'Rolled (epibole)' },
		{ value: 'undermined', label: 'Undermined' },
		{ value: 'callused', label: 'Callused' },
		{ value: 'macerated', label: 'Macerated' }
	];
	const exudateAmountOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'minimal', label: 'Minimal' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'heavy', label: 'Heavy' }
	];
	const exudateTypeOptions = [
		{ value: 'serous', label: 'Serous (clear)' },
		{ value: 'sanguineous', label: 'Sanguineous (bloody)' },
		{ value: 'serosanguineous', label: 'Serosanguineous' },
		{ value: 'purulent', label: 'Purulent' }
	];
	const odourOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'mild', label: 'Mild' },
		{ value: 'strong', label: 'Strong' },
		{ value: 'foul', label: 'Foul' }
	];

	const area = $derived(calculateWoundArea(d.woundLength, d.woundWidth));
</script>

<Fieldset legend="Wound Assessment">
	<p class="hint">If a wound is present, document stage and TIME (Tissue, Infection, Moisture, Edge).</p>

	<Field label="Is a wound present?">
		<RadioGroup label="Is a wound present?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="woundPresent" value={opt.value} bind:group={d.woundPresent} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.woundPresent === 'yes'}
		<Field label="Wound location" inputId="woundLocation">
			<TextInput id="woundLocation" label="Wound location" placeholder="e.g. Sacrum, left heel" bind:value={d.woundLocation} />
		</Field>

		<Field label="Wound stage / classification" inputId="woundStage">
			<Select id="woundStage" label="Wound stage / classification" bind:value={d.woundStage}>
				<option value="">— Select —</option>
				{#each stageOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>

		<div class="field-grid field-grid-3">
			<Field label="Length (cm)" inputId="woundLength">
				<NumberInput id="woundLength" label="Length" min={0} max={100} step={0.1} bind:value={d.woundLength} />
			</Field>
			<Field label="Width (cm)" inputId="woundWidth">
				<NumberInput id="woundWidth" label="Width" min={0} max={100} step={0.1} bind:value={d.woundWidth} />
			</Field>
			<Field label="Depth (cm)" inputId="woundDepth">
				<NumberInput id="woundDepth" label="Depth" min={0} max={100} step={0.1} bind:value={d.woundDepth} />
			</Field>
		</div>

		<Field label="Wound area (length × width)" description="Auto-calculated">
			{#if area !== null}
				<p class="font-medium">{area} cm²</p>
			{:else}
				<p class="text-base-content/60">—</p>
			{/if}
		</Field>

		<Field label="Tissue type (T)" inputId="tissueType">
			<Select id="tissueType" label="Tissue type" bind:value={d.tissueType}>
				<option value="">— Select —</option>
				{#each tissueOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>

		<Field label="Signs of infection (I)? (erythema, warmth, swelling, purulence, fever)">
			<RadioGroup label="Signs of infection?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="infectionSigns" value={opt.value} bind:group={d.infectionSigns} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="Moisture balance (M)" inputId="moistureBalance">
			<Select id="moistureBalance" label="Moisture balance" bind:value={d.moistureBalance}>
				<option value="">— Select —</option>
				{#each moistureOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>

		<Field label="Edge condition (E)" inputId="edgeCondition">
			<Select id="edgeCondition" label="Edge condition" bind:value={d.edgeCondition}>
				<option value="">— Select —</option>
				{#each edgeOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>

		<Field label="Exudate amount" inputId="exudateAmount">
			<Select id="exudateAmount" label="Exudate amount" bind:value={d.exudateAmount}>
				<option value="">— Select —</option>
				{#each exudateAmountOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>

		<Field label="Exudate type" inputId="exudateType">
			<Select id="exudateType" label="Exudate type" bind:value={d.exudateType}>
				<option value="">— Select —</option>
				{#each exudateTypeOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>

		<Field label="Wound odour" inputId="woundOdour">
			<Select id="woundOdour" label="Wound odour" bind:value={d.woundOdour}>
				<option value="">— Select —</option>
				{#each odourOptions as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}
			</Select>
		</Field>

		<Field label="Wound notes" inputId="woundNotes">
			<TextAreaInput id="woundNotes" label="Wound notes" rows={3} placeholder="Tunnelling, undermining measurements, surrounding skin…" bind:value={d.woundNotes} />
		</Field>
	{/if}
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
