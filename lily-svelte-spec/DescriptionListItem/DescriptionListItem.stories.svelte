<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import DescriptionListItem from './DescriptionListItem.svelte';

  const { Story } = defineMeta({
    title: 'Headless/DescriptionListItem',
    component: DescriptionListItem,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'DescriptionListItem'}}
>
  <span>DescriptionListItem</span>
</Story>
