<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS } from '$lib/config/options';
	import { assessmentStore } from '$lib/stores/assessment.svelte';

	const d = assessmentStore.data;
</script>

<Fieldset legend="10. Preferences, Allergies and Cultural Requirements">
	<p class="hint">What the patient can eat, will eat, and must not eat. A care plan that ignores any of these will not be followed.</p>

	<Field label="Food allergy" inputId="preferences-hasFoodAllergy">
		<Select id="preferences-hasFoodAllergy" label="Food allergy" bind:value={d.preferences.hasFoodAllergy}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Food intolerance" inputId="preferences-hasFoodIntolerance">
		<Select id="preferences-hasFoodIntolerance" label="Food intolerance" bind:value={d.preferences.hasFoodIntolerance}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Allergen and reaction" inputId="preferences-foodAllergyDetail">
		<TextInput id="preferences-foodAllergyDetail" label="Allergen and reaction"
			placeholder="For example, peanut — urticaria and wheeze" bind:value={d.preferences.foodAllergyDetail} />
	</Field>
	<Field label="Reaction severity" inputId="preferences-allergySeverity">
		<Select id="preferences-allergySeverity" label="Reaction severity" bind:value={d.preferences.allergySeverity}>
			<option value="">— Select —</option>
			{#each OPTIONS.allergySeverity as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Foods avoided" inputId="preferences-foodsAvoided">
		<TextAreaInput id="preferences-foodsAvoided" label="Foods avoided" rows={2} bind:value={d.preferences.foodsAvoided} />
	</Field>
	<Field label="Reason for avoidance" inputId="preferences-avoidanceReason">
		<Select id="preferences-avoidanceReason" label="Reason for avoidance" bind:value={d.preferences.avoidanceReason}>
			<option value="">— Select —</option>
			{#each OPTIONS.avoidanceReason as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Dislikes" inputId="preferences-dislikes">
		<TextAreaInput id="preferences-dislikes" label="Dislikes" rows={2} bind:value={d.preferences.dislikes} />
	</Field>
	<Field label="Therapeutic diet in place" inputId="preferences-therapeuticDiet">
		<Select id="preferences-therapeuticDiet" label="Therapeutic diet in place" bind:value={d.preferences.therapeuticDiet}>
			<option value="">— Select —</option>
			{#each OPTIONS.therapeuticDiet as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Dietary pattern" inputId="preferences-dietaryPattern">
		<Select id="preferences-dietaryPattern" label="Dietary pattern" bind:value={d.preferences.dietaryPattern}>
			<option value="">— Select —</option>
			{#each OPTIONS.dietaryPattern as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Religious or cultural requirements" inputId="preferences-religiousOrCulturalRequirement">
		<TextInput id="preferences-religiousOrCulturalRequirement" label="Religious or cultural requirements" bind:value={d.preferences.religiousOrCulturalRequirement} />
	</Field>
	<Field label="Fasting practices" inputId="preferences-fastingPractice">
		<TextInput id="preferences-fastingPractice" label="Fasting practices"
			placeholder="For example, Ramadan" bind:value={d.preferences.fastingPractice} />
	</Field>
	<Field label="Texture-modified diet" inputId="preferences-textureModifiedDiet">
		<Select id="preferences-textureModifiedDiet" label="Texture-modified diet" bind:value={d.preferences.textureModifiedDiet}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="IDDSI food level" inputId="preferences-textureModifiedIddsiLevel">
		<Select id="preferences-textureModifiedIddsiLevel" label="IDDSI food level" bind:value={d.preferences.textureModifiedIddsiLevel}>
			<option value="">— Select —</option>
			{#each OPTIONS.iddsiFood as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Preferences notes" inputId="preferences-preferencesNotes">
		<TextAreaInput id="preferences-preferencesNotes" label="Preferences notes" rows={2} bind:value={d.preferences.preferencesNotes} />
	</Field>
</Fieldset>
