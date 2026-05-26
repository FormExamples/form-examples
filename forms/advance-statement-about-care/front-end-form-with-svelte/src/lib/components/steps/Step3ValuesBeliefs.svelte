<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const v = assessment.data.valuesBeliefs;
</script>

<Fieldset legend="Values & Beliefs">
	<p class="hint">Share what matters most to you - your beliefs, values and what gives your life meaning</p>
	<Field label="Religious beliefs" inputId="religiousBeliefs"><TextAreaInput id="religiousBeliefs" label="Religious beliefs" rows={3} placeholder="Describe any religious beliefs that are important to you and may affect your care..." bind:value={v.religiousBeliefs} /></Field>

	<Field label="Spiritual beliefs" inputId="spiritualBeliefs"><TextAreaInput id="spiritualBeliefs" label="Spiritual beliefs" rows={3} placeholder="Describe any spiritual beliefs or practices important to you..." bind:value={v.spiritualBeliefs} /></Field>

	<Field label="Cultural values" inputId="culturalValues"><TextAreaInput id="culturalValues" label="Cultural values" rows={3} placeholder="Describe any cultural values or practices that are important to you..." bind:value={v.culturalValues} /></Field>

	<Field label="Quality of life priorities" inputId="qualityOfLifePriorities"><TextAreaInput id="qualityOfLifePriorities" label="Quality of life priorities" rows={4} placeholder="What does quality of life mean to you? What would make life no longer worth living?" bind:value={v.qualityOfLifePriorities} /></Field>

	<Field label="What makes life meaningful to you?" inputId="whatMakesLifeMeaningful"><TextAreaInput id="whatMakesLifeMeaningful" label="What makes life meaningful to you?" rows={4} placeholder="e.g. Family, hobbies, music, nature, social connections..." bind:value={v.whatMakesLifeMeaningful} /></Field>

	<Field label="Important traditions or rituals" inputId="importantTraditions"><TextAreaInput id="importantTraditions" label="Important traditions or rituals" rows={3} placeholder="Any traditions, celebrations, or rituals that are important to maintain..." bind:value={v.importantTraditions} /></Field>

	<Field label="Views on dying and death" inputId="viewsOnDying"><TextAreaInput id="viewsOnDying" label="Views on dying and death" rows={4} placeholder="How you feel about dying and what you would wish for at end of life..." bind:value={v.viewsOnDying} /></Field>
</Fieldset>
