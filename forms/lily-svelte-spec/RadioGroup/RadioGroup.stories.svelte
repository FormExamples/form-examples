<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import RadioGroup from './RadioGroup.svelte';

  const { Story } = defineMeta({
    title: 'Headless/RadioGroup',
    component: RadioGroup,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Radio Group'}}
>
  <span>Group content</span>
</Story>
