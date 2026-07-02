<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import IconList from './IconList.svelte';

  const { Story } = defineMeta({
    title: 'Headless/IconList',
    component: IconList,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{ label: 'Features' }}
>
  <li>First feature</li>
  <li>Second feature</li>
</Story>
