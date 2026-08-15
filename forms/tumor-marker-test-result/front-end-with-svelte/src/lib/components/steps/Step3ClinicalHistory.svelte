<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';
	import { hasGermCellCriticalMarker } from '#lib/engine/utils.js';

	const d = resultStore.data;

	const germCellAlert = $derived(hasGermCellCriticalMarker(d));
</script>

<Fieldset legend="3. Measured Values">
	<p class="hint">
		Enter each measured serum tumour marker. Leave a field blank when the marker was not measured.
	</p>

	<Field label="PSA (ng/mL)" inputId="psa" description="Prostate cancer; informed-choice testing.">
		<NumberInput id="psa" label="PSA (ng/mL)" min={0} step={0.1} bind:value={d.psa} />
	</Field>

	<Field
		label="CA125 (IU/mL)"
		inputId="ca125"
		description="Suspected ovarian cancer (NICE CG122 ultrasound threshold 35 IU/mL)."
	>
		<NumberInput id="ca125" label="CA125 (IU/mL)" min={0} step={0.1} bind:value={d.ca125} />
	</Field>

	<Field
		label="CA19-9 (U/mL)"
		inputId="ca19_9"
		description="Pancreatic / hepatobiliary cancer (reference < 37 U/mL)."
	>
		<NumberInput id="ca19_9" label="CA19-9 (U/mL)" min={0} step={0.1} bind:value={d.ca19_9} />
	</Field>

	<Field label="CEA (ng/mL)" inputId="carcinoembryonicAntigenCea" description="Colorectal cancer monitoring.">
		<NumberInput
			id="carcinoembryonicAntigenCea"
			label="CEA (ng/mL)"
			min={0}
			step={0.1}
			bind:value={d.carcinoembryonicAntigenCea}
		/>
	</Field>

	<Field
		label="AFP (ng/mL)"
		inputId="alphaFetoproteinAfp"
		description="Hepatocellular / germ-cell tumours; a very high value suggests a germ-cell tumour."
	>
		<NumberInput
			id="alphaFetoproteinAfp"
			label="AFP (ng/mL)"
			min={0}
			step={0.1}
			bind:value={d.alphaFetoproteinAfp}
		/>
	</Field>

	<Field
		label="beta-hCG (IU/L)"
		inputId="betaHcg"
		description="Germ-cell / trophoblastic tumours; a very high value suggests a germ-cell tumour."
	>
		<NumberInput id="betaHcg" label="beta-hCG (IU/L)" min={0} step={0.1} bind:value={d.betaHcg} />
	</Field>

	<Field label="CA15-3 (U/mL)" inputId="ca15_3" description="Breast cancer monitoring.">
		<NumberInput id="ca15_3" label="CA15-3 (U/mL)" min={0} step={0.1} bind:value={d.ca15_3} />
	</Field>

	<Field
		label="LDH (U/L)"
		inputId="lactateDehydrogenaseLdh"
		description="Germ-cell tumour staging; lymphoma prognosis."
	>
		<NumberInput
			id="lactateDehydrogenaseLdh"
			label="LDH (U/L)"
			min={0}
			step={0.1}
			bind:value={d.lactateDehydrogenaseLdh}
		/>
	</Field>

	<Field label="Calcitonin (ng/L)" inputId="calcitonin" description="Medullary thyroid carcinoma.">
		<NumberInput id="calcitonin" label="Calcitonin (ng/L)" min={0} step={0.1} bind:value={d.calcitonin} />
	</Field>

	<Field label="Chromogranin A (nmol/L)" inputId="chromograninA" description="Neuroendocrine tumours.">
		<NumberInput
			id="chromograninA"
			label="Chromogranin A (nmol/L)"
			min={0}
			step={0.1}
			bind:value={d.chromograninA}
		/>
	</Field>

	{#if germCellAlert}
		<Alert type="error" heading="Very high germ-cell marker">
			<p>
				A very high AFP or beta-hCG suggests a germ-cell tumour and is treated as a critical
				result; the follow-up urgency auto-escalates to a critical alert. Ensure the result is
				communicated to the requester on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
