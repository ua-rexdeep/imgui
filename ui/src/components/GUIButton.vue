<template>
    <button :class="{
        ['btnstyle-' + content.style]: content.style != null,
    }" :style="{
    width: computeSize(content.width),
    height: computeSize(content.height),
}" :disabled="content.disabled" @click="OnClick">{{ content.text }}</button>
</template>

<script setup>
import { computeSize } from '../utils';

const props = defineProps(['gui', 'content']);

function OnClick() {
    if (props.content.disabled) return;
    props.gui.OnAction(props.content.id, 'click');
}
</script>