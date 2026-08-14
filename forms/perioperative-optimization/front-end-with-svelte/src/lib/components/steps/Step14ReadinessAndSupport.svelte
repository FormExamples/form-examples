<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO_OPTS } from '$lib/config/options';
	import { assessmentStore } from '$lib/stores/assessment.svelte';

	const d = assessmentStore.data;
</script>

<Fieldset legend="14. Psychological Readiness and Social Support">
	<p class="hint">Assessed and flagged rather than gated. A plan the patient cannot follow, or a discharge with no support, undoes the rest of the optimization.</p>

	<Field label="Anxiety about the procedure" inputId="social-anxietyLevel">
		<Select id="social-anxietyLevel" label="Anxiety about the procedure" bind:value={d.social.anxietyLevel}>
			<option value="">— Select —</option>
			{#each OPTIONS.severity4 as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Depression screen" inputId="social-depressionScreen">
		<Select id="social-depressionScreen" label="Depression screen" bind:value={d.social.depressionScreen}>
			<option value="">— Select —</option>
			{#each OPTIONS.depressionScreen as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Understands the procedure" inputId="social-understandsProcedure">
		<Select id="social-understandsProcedure" label="Understands the procedure" bind:value={d.social.understandsProcedure}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Expectations realistic" inputId="social-expectationsRealistic">
		<Select id="social-expectationsRealistic" label="Expectations realistic" bind:value={d.social.expectationsRealistic}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Shared decision-making discussed" inputId="social-sharedDecisionMakingDiscussed">
		<Select id="social-sharedDecisionMakingDiscussed" label="Shared decision-making discussed" bind:value={d.social.sharedDecisionMakingDiscussed}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Has a carer" inputId="social-hasCarer">
		<Select id="social-hasCarer" label="Has a carer" bind:value={d.social.hasCarer}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Transport home arranged" inputId="social-transportHomeArranged">
		<Select id="social-transportHomeArranged" label="Transport home arranged" bind:value={d.social.transportHomeArranged}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Support after discharge" inputId="social-supportAfterDischarge">
		<Select id="social-supportAfterDischarge" label="Support after discharge" bind:value={d.social.supportAfterDischarge}>
			<option value="">— Select —</option>
			{#each OPTIONS.supportAfterDischarge as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Health literacy" inputId="social-healthLiteracy">
		<Select id="social-healthLiteracy" label="Health literacy" bind:value={d.social.healthLiteracy}>
			<option value="">— Select —</option>
			{#each OPTIONS.healthLiteracy as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Psychological support offered" inputId="social-psychologicalSupportOffered">
		<Select id="social-psychologicalSupportOffered" label="Psychological support offered" bind:value={d.social.psychologicalSupportOffered}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Social notes" inputId="social-socialNotes">
		<TextAreaInput id="social-socialNotes" label="Social notes" rows={2} bind:value={d.social.socialNotes} />
	</Field>
</Fieldset>
