<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const s = assessment.data.appeal;
</script>

<Fieldset legend="Step 7 of 8 — Assessment appeal basics">
  <p class="hint">
    An exemption lowers the taxable value; it does not contest the assessed value. Appeals have
    their own, shorter deadlines.
  </p>

  <Field
    label="Do you also want guidance on appealing the assessed value?"
    inputId="appeal-appealRequested"
  >
    <Select
      id="appeal-appealRequested"
      label="Do you also want guidance on appealing the assessed value?"
      bind:value={s.appealRequested}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>

  {#if s.appealRequested === 'yes'}
    <Field label="Date on the notice of assessed value" inputId="appeal-noticeOfValueDate">
      <DateInput
        id="appeal-noticeOfValueDate"
        label="Date on the notice of assessed value"
        bind:value={s.noticeOfValueDate}
      />
    </Field>
  {/if}

  {#if s.appealRequested === 'yes'}
    <Field label="Have you already filed an appeal?" inputId="appeal-appealFiled">
      <Select
        id="appeal-appealFiled"
        label="Have you already filed an appeal?"
        bind:value={s.appealFiled}
      >
        <option value="">— Select —</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
  {/if}
</Fieldset>
