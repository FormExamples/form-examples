<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="5. Visual Acuity">
	<p class="hint">LogMAR and Snellen-equivalent, per eye, for unaided, best-corrected, and pinhole acuity. Best-corrected acuity drives the surgical-candidacy computation (6/12 and 6/18 thresholds).</p>

	<h3 class="text-sm font-semibold text-base-content">Unaided</h3>
	<Field label="Unaided VA LogMAR — right" inputId="acuity-unaidedVaLogmarRight">
		<NumberInput id="acuity-unaidedVaLogmarRight" label="Unaided VA LogMAR — right" min={-0.3} max={3} step="0.02" bind:value={d.acuity.unaidedVaLogmarRight} />
	</Field>
	<Field label="Unaided VA LogMAR — left" inputId="acuity-unaidedVaLogmarLeft">
		<NumberInput id="acuity-unaidedVaLogmarLeft" label="Unaided VA LogMAR — left" min={-0.3} max={3} step="0.02" bind:value={d.acuity.unaidedVaLogmarLeft} />
	</Field>
	<Field label="Unaided VA Snellen — right" inputId="acuity-unaidedVaSnellenRight">
		<TextInput id="acuity-unaidedVaSnellenRight" label="Unaided VA Snellen — right" placeholder="6/9" bind:value={d.acuity.unaidedVaSnellenRight} />
	</Field>
	<Field label="Unaided VA Snellen — left" inputId="acuity-unaidedVaSnellenLeft">
		<TextInput id="acuity-unaidedVaSnellenLeft" label="Unaided VA Snellen — left" placeholder="6/9" bind:value={d.acuity.unaidedVaSnellenLeft} />
	</Field>

	<h3 class="mt-4 text-sm font-semibold text-base-content">Best-corrected</h3>
	<Field label="Best-corrected VA LogMAR — right" inputId="acuity-bestCorrectedVaLogmarRight">
		<NumberInput id="acuity-bestCorrectedVaLogmarRight" label="Best-corrected VA LogMAR — right" min={-0.3} max={3} step="0.02" bind:value={d.acuity.bestCorrectedVaLogmarRight} />
	</Field>
	<Field label="Best-corrected VA LogMAR — left" inputId="acuity-bestCorrectedVaLogmarLeft">
		<NumberInput id="acuity-bestCorrectedVaLogmarLeft" label="Best-corrected VA LogMAR — left" min={-0.3} max={3} step="0.02" bind:value={d.acuity.bestCorrectedVaLogmarLeft} />
	</Field>
	<Field label="Best-corrected VA Snellen — right" inputId="acuity-bestCorrectedVaSnellenRight">
		<TextInput id="acuity-bestCorrectedVaSnellenRight" label="Best-corrected VA Snellen — right" placeholder="6/6" bind:value={d.acuity.bestCorrectedVaSnellenRight} />
	</Field>
	<Field label="Best-corrected VA Snellen — left" inputId="acuity-bestCorrectedVaSnellenLeft">
		<TextInput id="acuity-bestCorrectedVaSnellenLeft" label="Best-corrected VA Snellen — left" placeholder="6/6" bind:value={d.acuity.bestCorrectedVaSnellenLeft} />
	</Field>

	<h3 class="mt-4 text-sm font-semibold text-base-content">Pinhole</h3>
	<Field label="Pinhole VA LogMAR — right" inputId="acuity-pinholeVaLogmarRight">
		<NumberInput id="acuity-pinholeVaLogmarRight" label="Pinhole VA LogMAR — right" min={-0.3} max={3} step="0.02" bind:value={d.acuity.pinholeVaLogmarRight} />
	</Field>
	<Field label="Pinhole VA LogMAR — left" inputId="acuity-pinholeVaLogmarLeft">
		<NumberInput id="acuity-pinholeVaLogmarLeft" label="Pinhole VA LogMAR — left" min={-0.3} max={3} step="0.02" bind:value={d.acuity.pinholeVaLogmarLeft} />
	</Field>
	<Field label="Pinhole VA Snellen — right" inputId="acuity-pinholeVaSnellenRight">
		<TextInput id="acuity-pinholeVaSnellenRight" label="Pinhole VA Snellen — right" placeholder="6/6" bind:value={d.acuity.pinholeVaSnellenRight} />
	</Field>
	<Field label="Pinhole VA Snellen — left" inputId="acuity-pinholeVaSnellenLeft">
		<TextInput id="acuity-pinholeVaSnellenLeft" label="Pinhole VA Snellen — left" placeholder="6/6" bind:value={d.acuity.pinholeVaSnellenLeft} />
	</Field>
</Fieldset>
