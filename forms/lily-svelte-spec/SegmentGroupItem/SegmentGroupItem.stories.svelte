<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import SegmentGroupItem from './SegmentGroupItem.svelte';

  const { Story } = defineMeta({
    title: 'Headless/SegmentGroupItem',
    component: SegmentGroupItem,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
>
  <span>Segment</span>
</Story>
