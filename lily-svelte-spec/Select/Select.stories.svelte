<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Select from './Select.svelte';

  const { Story } = defineMeta({
    title: 'Headless/Select',
    component: Select,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Select'}}
>
  <option value="1">Option 1</option><option value="2">Option 2</option>
</Story>
