<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SelectWithExtras from './SelectWithExtras.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SelectWithExtras',
    component: SelectWithExtras,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Select With Extras'}}
>
  <option value="1">Option 1</option><option value="2">Option 2</option>
</Story>
