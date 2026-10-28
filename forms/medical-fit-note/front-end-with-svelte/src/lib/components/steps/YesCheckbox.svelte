<script lang="ts">
  // A checkbox bound to a 'yes' / '' engine field.
  let {
    id,
    label,
    value = $bindable('')
  }: {
    id: string;
    label: string;
    value?: string;
  } = $props();
</script>

<div class="bool-field">
  <input
    type="checkbox"
    class="checkbox-input"
    {id}
    name={id}
    checked={value === 'yes'}
    onchange={(e) => (value = e.currentTarget.checked ? 'yes' : '')}
  />
  <label for={id}>{label}</label>
</div>
