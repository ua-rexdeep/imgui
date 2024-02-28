<template>
    <div class="overflow-x-hidden overflow-y-scroll flex flex-col border border-gray-500 h-fit"
        :class="{ 'flex-1': !content.width }" :style="{
            width: computeSize(content.width),
            height: computeSize(content.height),
        }">
        <div class="p-0.5" :class="{
            ['bg-second-active']: option.key == content.value,
        }" v-for="option in content.options" @click="OnOptionClick(option.key)">{{ option.value }}</div>
    </div>
</template>

<script setup>
import { computeSize } from '../utils';

const props = defineProps(['content', 'gui']);

function OnOptionClick(key) {
    props.content.value = key;
    props.gui.OnAction(props.content.id, 'select', key);
}

</script>