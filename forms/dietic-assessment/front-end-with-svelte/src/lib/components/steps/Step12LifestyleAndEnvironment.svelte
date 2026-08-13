<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS } from '$lib/config/options';
	import { assessmentStore } from '$lib/stores/assessment.svelte';

	const d = assessmentStore.data;
</script>

<Fieldset legend="12. Lifestyle and Environment">
	<p class="hint">Work pattern, cooking skills and facilities, food budget, and shopping access. A plan the patient cannot shop for, store, or cook is not a plan.</p>

	<Field label="Living situation" inputId="environment-livingSituation">
		<Select id="environment-livingSituation" label="Living situation" bind:value={d.environment.livingSituation}>
			<option value="">— Select —</option>
			{#each OPTIONS.livingSituation as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Who does the shopping" inputId="environment-whoShops">
		<Select id="environment-whoShops" label="Who does the shopping" bind:value={d.environment.whoShops}>
			<option value="">— Select —</option>
			{#each OPTIONS.whoShops as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Who cooks" inputId="environment-whoCooks">
		<Select id="environment-whoCooks" label="Who cooks" bind:value={d.environment.whoCooks}>
			<option value="">— Select —</option>
			{#each OPTIONS.whoCooks as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Cooking skills" inputId="environment-cookingSkills">
		<Select id="environment-cookingSkills" label="Cooking skills" bind:value={d.environment.cookingSkills}>
			<option value="">— Select —</option>
			{#each OPTIONS.cookingSkills as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Cooking confidence (0–10)" inputId="environment-cookingConfidence0To10">
		<NumberInput id="environment-cookingConfidence0To10" label="Cooking confidence (0–10)" min={0} max={10} bind:value={d.environment.cookingConfidence0To10} />
	</Field>
	<Field label="Cooker" inputId="environment-hasCooker">
		<Select id="environment-hasCooker" label="Cooker" bind:value={d.environment.hasCooker}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Fridge" inputId="environment-hasFridge">
		<Select id="environment-hasFridge" label="Fridge" bind:value={d.environment.hasFridge}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Freezer" inputId="environment-hasFreezer">
		<Select id="environment-hasFreezer" label="Freezer" bind:value={d.environment.hasFreezer}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Microwave" inputId="environment-hasMicrowave">
		<Select id="environment-hasMicrowave" label="Microwave" bind:value={d.environment.hasMicrowave}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Weekly food budget" inputId="environment-foodBudgetPerWeek">
		<NumberInput id="environment-foodBudgetPerWeek" label="Weekly food budget" min={0} max={10000} step="0.01" bind:value={d.environment.foodBudgetPerWeek} />
	</Field>
	<Field label="Worried food would run out" inputId="environment-worriedFoodWouldRunOut">
		<Select id="environment-worriedFoodWouldRunOut" label="Worried food would run out" bind:value={d.environment.worriedFoodWouldRunOut}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Skipped meals for money" inputId="environment-skippedMealsForMoney">
		<Select id="environment-skippedMealsForMoney" label="Skipped meals for money" bind:value={d.environment.skippedMealsForMoney}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Uses a food bank" inputId="environment-usesFoodBank">
		<Select id="environment-usesFoodBank" label="Uses a food bank" bind:value={d.environment.usesFoodBank}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Access to shops" inputId="environment-accessToShops">
		<Select id="environment-accessToShops" label="Access to shops" bind:value={d.environment.accessToShops}>
			<option value="">— Select —</option>
			{#each OPTIONS.accessToShops as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Has transport" inputId="environment-hasTransport">
		<Select id="environment-hasTransport" label="Has transport" bind:value={d.environment.hasTransport}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Work pattern" inputId="environment-workPattern">
		<Select id="environment-workPattern" label="Work pattern" bind:value={d.environment.workPattern}>
			<option value="">— Select —</option>
			{#each OPTIONS.workPattern as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Meal support" inputId="environment-mealSupport">
		<Select id="environment-mealSupport" label="Meal support" bind:value={d.environment.mealSupport}>
			<option value="">— Select —</option>
			{#each OPTIONS.mealSupport as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Social support" inputId="environment-socialSupport">
		<Select id="environment-socialSupport" label="Social support" bind:value={d.environment.socialSupport}>
			<option value="">— Select —</option>
			{#each OPTIONS.socialSupport as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Environment notes" inputId="environment-environmentNotes">
		<TextAreaInput id="environment-environmentNotes" label="Environment notes" rows={2} bind:value={d.environment.environmentNotes} />
	</Field>
</Fieldset>
