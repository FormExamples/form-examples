<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const pc = assessment.data.physicalCognitiveStatus;
</script>

<Fieldset legend="Physical and Cognitive Status">
	<p class="hint">Current physical and cognitive abilities relevant to occupational performance.</p>

	<Field label="Upper Extremity Function" inputId="upperExtremity">
		<TextAreaInput id="upperExtremity" label="Upper Extremity" rows={2} placeholder="Describe upper extremity strength, range of motion, fine motor skills..." bind:value={pc.upperExtremity} />
	</Field>

	<Field label="Lower Extremity Function" inputId="lowerExtremity">
		<TextAreaInput id="lowerExtremity" label="Lower Extremity" rows={2} placeholder="Describe lower extremity strength, range of motion, weight-bearing status..." bind:value={pc.lowerExtremity} />
	</Field>

	<Field label="Coordination" inputId="coordination">
		<TextAreaInput id="coordination" label="Coordination" rows={2} placeholder="Describe gross and fine motor coordination, balance..." bind:value={pc.coordination} />
	</Field>

	<Field label="Cognition" inputId="cognition">
		<TextAreaInput id="cognition" label="Cognition" rows={2} placeholder="Describe cognitive function: memory, attention, problem-solving, orientation..." bind:value={pc.cognition} />
	</Field>

	<Field label="Vision" inputId="vision">
		<TextAreaInput id="vision" label="Vision" rows={2} placeholder="Describe visual function, any impairments..." bind:value={pc.vision} />
	</Field>

	<Field label="Fatigue" inputId="fatigue">
		<TextAreaInput id="fatigue" label="Fatigue" rows={2} placeholder="Describe fatigue levels, impact on daily activities..." bind:value={pc.fatigue} />
	</Field>

	<Field label="Pain" inputId="pain">
		<TextAreaInput id="pain" label="Pain" rows={2} placeholder="Describe pain: location, intensity, frequency, impact on function..." bind:value={pc.pain} />
	</Field>
</Fieldset>
