<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import CheckboxGroup from './CheckboxGroup.svelte';

  const { Story } = defineMeta({
    title: 'Headless/CheckboxGroup',
    component: CheckboxGroup,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Checkbox Group'}}
>
  <span>Group content</span>
</Story>
