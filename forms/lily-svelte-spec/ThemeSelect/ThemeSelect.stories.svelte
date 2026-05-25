<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ThemeSelect from './ThemeSelect.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ThemeSelect',
    component: ThemeSelect,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Theme Select'}}
>
  <option value="1">Option 1</option><option value="2">Option 2</option>
</Story>
