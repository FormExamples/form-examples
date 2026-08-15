<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Checkbox from '#lib/components/ui/Checkbox.svelte';

	const r = assessment.data.highRiskSigns;
</script>

<Fieldset
	title="High Risk Signs"
	description="Tick any high-risk signs identified at triage. These guide rapid clinical escalation."
>
	<Checkbox label="Abnormal AVPU" name="abnormalAvpu" bind:checked={r.abnormalAvpu} />
	<Checkbox
		label="HR < 55 or > 130 (adult)"
		name="abnormalHeartRate"
		bind:checked={r.abnormalHeartRate}
	/>
	<Checkbox
		label="Stridor, voice change, or unable to swallow"
		name="stridorOrVoiceChange"
		bind:checked={r.stridorOrVoiceChange}
	/>
	<Checkbox
		label="Poor perfusion / weak pulse / capillary refill > 3s"
		name="poorPerfusion"
		bind:checked={r.poorPerfusion}
	/>
	<Checkbox
		label="Temperature > 39°C or < 36°C"
		name="abnormalTemperature"
		bind:checked={r.abnormalTemperature}
	/>
	<Checkbox label="SpO2 < 90% on room air" name="lowSpo2" bind:checked={r.lowSpo2} />
	<Checkbox
		label="Respiratory distress (grunting in child, retractions, cyanosis)"
		name="respiratoryDistress"
		bind:checked={r.respiratoryDistress}
	/>
	<Checkbox
		label="Vomits everything / can't drink or feed"
		name="vomitsEverythingOrCannotFeed"
		bind:checked={r.vomitsEverythingOrCannotFeed}
	/>
</Fieldset>
