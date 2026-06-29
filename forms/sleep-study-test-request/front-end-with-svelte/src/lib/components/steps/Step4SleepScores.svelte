<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const s = request.data.scores;
</script>

<Fieldset legend="4. Sleep Scores">
	<p class="hint">
		The Epworth Sleepiness Scale and STOP-BANG drive appropriateness, priority, and triage.
	</p>

	<Field label="Epworth Sleepiness Scale" inputId="epworthScore" description="0–24; over 10 indicates abnormal daytime sleepiness.">
		<NumberInput id="epworthScore" label="Epworth Sleepiness Scale" min={0} max={24} bind:value={s.epworthScore} />
	</Field>

	<Field label="STOP-BANG score" inputId="stopBangScore" description="0–8; 5 or more indicates high OSA risk.">
		<NumberInput id="stopBangScore" label="STOP-BANG score" min={0} max={8} bind:value={s.stopBangScore} />
	</Field>

	<Field label="Neck circumference" inputId="neckCircumferenceCm" description="cm">
		<NumberInput
			id="neckCircumferenceCm"
			label="Neck circumference"
			min={20}
			max={70}
			step={0.1}
			bind:value={s.neckCircumferenceCm}
		/>
	</Field>
</Fieldset>
