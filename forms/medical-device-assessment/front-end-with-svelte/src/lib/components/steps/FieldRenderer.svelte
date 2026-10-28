<script lang="ts">
  // FieldRenderer -- renders one declarative field from config/steps.ts.
  // Hidden questions (the field's `show` predicate) are not rendered but keep
  // their stored value in the store, so every engine field stays reachable.
  import {
    DateInput,
    EmailInput,
    RadioGroup,
    RadioInput,
    TelInput,
    TextAreaInput,
    TextInput
  } from '@lilydesignsystem/svelte-headless';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import { YN } from '#lib/config/steps.js';
  import { fieldId, getPath, setPath } from '#lib/engine/paths.js';
  import type { FieldDef } from '#lib/engine/types.js';
  import { assessment } from '#lib/stores/assessment.svelte.js';

  let { field }: { field: FieldDef } = $props();

  const id = $derived(fieldId(field.path));
  const visible = $derived(field.show ? field.show(assessment.data, assessment.result) : true);
  const error = $derived(assessment.errors.find((e) => e.id === id)?.message);
  const hintId = $derived(field.hint ? `${id}-hint` : undefined);

  function get(): string {
    return (getPath(assessment.data, field.path) as string | null) ?? '';
  }
  function set(v: string) {
    setPath(assessment.data, field.path, field.type === 'date' && v === '' ? null : v);
  }
  const blank = $derived(field.blankLabel === undefined ? 'Select...' : field.blankLabel);
</script>

{#if visible}
  {#if field.type === 'yn'}
    <div class="field" data-path={field.path}>
      <span class="label" id={`${id}-label`}>{field.label}</span>
      {#if field.hint}<p class="hint" id={hintId}>{field.hint}</p>{/if}
      <RadioGroup label={field.label} aria-describedby={hintId}>
        {#each YN as o (o.value)}
          <label for={`${id}-${o.value}`}>
            <RadioInput
              id={`${id}-${o.value}`}
              name={id}
              label={`${field.label}: ${o.label}`}
              value={o.value}
              checked={get() === o.value}
              onchange={() => set(o.value)}
            />
            <span>{o.label}</span>
          </label>
        {/each}
      </RadioGroup>
    </div>
  {:else}
    <Field
      label={field.label}
      description={field.hint}
      inputId={id}
      required={field.required}
      {error}
      data-path={field.path}
    >
      {#if field.type === 'select'}
        <Select
          {id}
          label={field.label}
          aria-describedby={hintId}
          aria-invalid={error ? 'true' : undefined}
          bind:value={get, set}
        >
          {#if blank !== null}<option value="">{blank}</option>{/if}
          {#each field.options ?? [] as o (o.value)}
            <option value={o.value}>{o.label}</option>
          {/each}
        </Select>
      {:else if field.type === 'textarea'}
        <TextAreaInput
          {id}
          label={field.label}
          rows={3}
          aria-describedby={hintId}
          aria-invalid={error ? 'true' : undefined}
          bind:value={get, set}
        />
      {:else if field.type === 'email'}
        <EmailInput {id} label={field.label} aria-describedby={hintId} bind:value={get, set} />
      {:else if field.type === 'tel'}
        <TelInput {id} label={field.label} aria-describedby={hintId} bind:value={get, set} />
      {:else if field.type === 'date'}
        <DateInput {id} label={field.label} aria-describedby={hintId} bind:value={get, set} />
      {:else}
        <TextInput {id} label={field.label} aria-describedby={hintId} bind:value={get, set} />
      {/if}
    </Field>
  {/if}
{/if}
