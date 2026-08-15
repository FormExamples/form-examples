<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TriStateField from '#lib/components/ui/TriStateField.svelte';

	const c = assessment.data.cprAed;
</script>

<Fieldset legend="CPR & AED">
	<p class="hint">Effective compressions and prompt, safe AED delivery are critical competencies.</p>

	<Field label="Compression rate (per minute)" description="Target 100-120/min." inputId="compressionRate">
		<NumberInput id="compressionRate" label="Compression rate per minute" min={0} step="1" bind:value={c.compressionRate} />
	</Field>
	<Field label="Compression depth (cm)" description="Target 5-6 cm." inputId="compressionDepth">
		<NumberInput id="compressionDepth" label="Compression depth in centimetres" min={0} step="0.1" bind:value={c.compressionDepth} />
	</Field>
	<TriStateField label="Effective compressions to standard rate and depth" name="effectiveCompressions" critical bind:value={c.effectiveCompressions} />
	<TriStateField label="Delivers effective ventilations producing visible chest rise" name="effectiveVentilations" bind:value={c.effectiveVentilations} />

	<Field label="Time to first AED shock (seconds)" description="Target ≤ 90 s." inputId="timeToFirstShockSeconds">
		<NumberInput id="timeToFirstShockSeconds" label="Time to first AED shock in seconds" min={0} step="1" bind:value={c.timeToFirstShockSeconds} />
	</Field>
	<TriStateField label="Delivers AED shock promptly without unsafe contact" name="aedDeliveredPromptly" critical bind:value={c.aedDeliveredPromptly} />
	<TriStateField label="Calls 'all clear' and verifies no contact before shock" name="safeShockNoUnsafeContact" bind:value={c.safeShockNoUnsafeContact} />
	<TriStateField label="Maintains continuous high-quality CPR with minimal interruptions" name="continuousQualityCpr" bind:value={c.continuousQualityCpr} />
</Fieldset>
