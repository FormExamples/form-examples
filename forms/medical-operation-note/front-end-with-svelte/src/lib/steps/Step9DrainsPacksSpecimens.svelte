<script lang="ts">
  import { store } from '#lib/state.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import TextInput from '#lib/components/ui/TextInput.svelte';
  import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import Select from '#lib/components/ui/Select.svelte';
</script>

<Fieldset legend="Step 9 — Drains, packs and specimens">
  <div class="field-grid">
    <Field label="Drains placed (type / site / output target / removal plan)" class="field-span-2">
      <TextAreaInput
        label="Drains placed"
        rows={3}
        bind:value={store.data.drainsPacksSpecimens.drainsPlaced}
      />
    </Field>
    <Field label="Packs left in situ (count + removal-by)">
      <TextInput
        label="Packs left in situ"
        bind:value={store.data.drainsPacksSpecimens.packsLeftInSitu}
      />
    </Field>
    <Field label="Packs removal-by date">
      <DateInput
        label="Packs removal-by date"
        bind:value={store.data.drainsPacksSpecimens.packsRemovalByDate}
      />
    </Field>
    <Field label="Urinary catheter">
      <Select label="Urinary catheter" bind:value={store.data.drainsPacksSpecimens.urinaryCatheter}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="NG tube">
      <Select label="NG tube" bind:value={store.data.drainsPacksSpecimens.ngTube}>
        <option value="">—</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </Select>
    </Field>
    <Field label="Specimens sent (label / container / fixative)" class="field-span-2">
      <TextAreaInput
        label="Specimens sent"
        rows={3}
        bind:value={store.data.drainsPacksSpecimens.specimensSent}
      />
    </Field>
    <Field label="Pathology destination">
      <TextInput
        label="Pathology destination"
        bind:value={store.data.drainsPacksSpecimens.specimensPathologyDestination}
      />
    </Field>
    <Field label="Specimens urgent">
      <Select
        label="Specimens urgent"
        bind:value={store.data.drainsPacksSpecimens.specimensUrgent}
      >
        <option value="">—</option>
        <option value="yes">Urgent</option>
        <option value="no">Routine</option>
      </Select>
    </Field>
  </div>
</Fieldset>
