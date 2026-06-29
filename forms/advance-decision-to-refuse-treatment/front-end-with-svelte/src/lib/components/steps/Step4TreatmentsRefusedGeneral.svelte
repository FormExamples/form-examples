<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const g = assessment.data.treatmentsRefusedGeneral;
	const yesNo = [
		{ value: 'yes', label: 'Yes - Refuse' },
		{ value: 'no', label: 'No - Do not refuse' }
	];

	function addOtherTreatment() {
		g.otherTreatments = [...g.otherTreatments, { treatment: '', refused: 'yes', specification: '' }];
	}

	function removeOtherTreatment(index: number) {
		g.otherTreatments = g.otherTreatments.filter((_, i) => i !== index);
	}
</script>

<Fieldset legend="Treatments Refused - General">
	<p class="hint">Select which general treatments you wish to refuse in the circumstances described</p>
	<div class="mb-4 rounded-lg border border-warning/40 bg-warning/10 p-4 text-sm text-warning">
		<p class="font-semibold">Important</p>
		<p class="mt-1">This section covers general treatments that are NOT life-sustaining. Life-sustaining treatment refusals require additional legal safeguards and are covered in the next step.</p>
	</div>

	<div class="space-y-6">
		<div class="rounded-lg border border-base-300 p-4">
			<Field label="Antibiotics"><RadioGroup label="Antibiotics">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="antibiotics" value={opt.value} bind:group={g.antibiotics.refused}/> {opt.label}</label>{/each}</RadioGroup></Field>
			{#if g.antibiotics.refused === 'yes'}
				<Field label="Specification" inputId="antibioticsSpec"><TextAreaInput id="antibioticsSpec" label="Specification" placeholder="Please specify which antibiotics or circumstances (e.g. 'only for life-threatening infections')" bind:value={g.antibiotics.specification} /></Field>
			{/if}
		</div>

		<div class="rounded-lg border border-base-300 p-4">
			<Field label="Blood Transfusion"><RadioGroup label="Blood Transfusion">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="bloodTransfusion" value={opt.value} bind:group={g.bloodTransfusion.refused}/> {opt.label}</label>{/each}</RadioGroup></Field>
			{#if g.bloodTransfusion.refused === 'yes'}
				<Field label="Specification" inputId="bloodSpec"><TextAreaInput id="bloodSpec" label="Specification" placeholder="Please specify any conditions or limitations" bind:value={g.bloodTransfusion.specification} /></Field>
			{/if}
		</div>

		<div class="rounded-lg border border-base-300 p-4">
			<Field label="IV Fluids"><RadioGroup label="IV Fluids">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="ivFluids" value={opt.value} bind:group={g.ivFluids.refused}/> {opt.label}</label>{/each}</RadioGroup></Field>
			{#if g.ivFluids.refused === 'yes'}
				<Field label="Specification" inputId="ivSpec"><TextAreaInput id="ivSpec" label="Specification" placeholder="Please specify any conditions or limitations" bind:value={g.ivFluids.specification} /></Field>
			{/if}
		</div>

		<div class="rounded-lg border border-base-300 p-4">
			<Field label="Tube Feeding"><RadioGroup label="Tube Feeding">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="tubeFeeding" value={opt.value} bind:group={g.tubeFeeding.refused}/> {opt.label}</label>{/each}</RadioGroup></Field>
			{#if g.tubeFeeding.refused === 'yes'}
				<Field label="Specification" inputId="tubeSpec"><TextAreaInput id="tubeSpec" label="Specification" placeholder="Please specify any conditions or limitations" bind:value={g.tubeFeeding.specification} /></Field>
			{/if}
		</div>

		<div class="rounded-lg border border-base-300 p-4">
			<Field label="Dialysis"><RadioGroup label="Dialysis">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="dialysis" value={opt.value} bind:group={g.dialysis.refused}/> {opt.label}</label>{/each}</RadioGroup></Field>
			{#if g.dialysis.refused === 'yes'}
				<Field label="Specification" inputId="dialysisSpec"><TextAreaInput id="dialysisSpec" label="Specification" placeholder="Please specify any conditions or limitations" bind:value={g.dialysis.specification} /></Field>
			{/if}
		</div>

		<div class="rounded-lg border border-base-300 p-4">
			<Field label="Non-invasive Ventilation (e.g. CPAP/BiPAP)"><RadioGroup label="Non-invasive Ventilation (e.g. CPAP/BiPAP)">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="ventilation" value={opt.value} bind:group={g.ventilation.refused}/> {opt.label}</label>{/each}</RadioGroup></Field>
			{#if g.ventilation.refused === 'yes'}
				<Field label="Specification" inputId="ventSpec"><TextAreaInput id="ventSpec" label="Specification" placeholder="Please specify any conditions or limitations" bind:value={g.ventilation.specification} /></Field>
			{/if}
		</div>
	</div>

	<!-- Other treatments -->
	<div class="mt-6">
		<h3 class="mb-3 text-sm font-semibold text-base-content/80">Other Treatments to Refuse</h3>
		{#each g.otherTreatments as other, i}
			<div class="mb-3 rounded-lg border border-base-300 bg-base-200 p-3">
				<div class="flex items-start justify-between">
					<div class="flex-1">
						<input
							type="text"
							placeholder="Treatment name"
							bind:value={other.treatment}
							class="mb-2 w-full rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
						/>
						<textarea
							placeholder="Specification"
							bind:value={other.specification}
							rows={2}
							class="w-full rounded border border-base-300 px-2 py-1.5 text-sm focus:border-primary focus:outline-none"
						></textarea>
					</div>
					<button
						type="button"
						onclick={() => removeOtherTreatment(i)}
						class="ml-2 text-error hover:text-error"
						aria-label="Remove treatment"
					>
						&times;
					</button>
				</div>
			</div>
		{/each}
		<button
			type="button"
			onclick={addOtherTreatment}
			class="rounded-lg border-2 border-dashed border-base-300 px-4 py-2 text-sm text-base-content/70 transition-colors hover:border-primary hover:text-primary"
		>
			+ Add Another Treatment
		</button>
	</div>
</Fieldset>
