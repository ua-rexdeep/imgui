<template>
    <div class="relative" :style="{
        width: computeSize(content.width),
        height: computeSize(content.height),
    }" @click="SetFocused(true)">
        <input type="text" class="w-full h-full" :placeholder="content.placeholder" :disabled="content.disabled"
            :value="value" @input="OnInput" @blur="SetFocused(false)" ref="inputRef">
        <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-second"
            v-if="content.override != null" v-show="!isFocused">
            {{ GetOverride() }}
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { computeSize } from '../utils';

const value = ref('');
const props = defineProps(['gui', 'content']);
const isFocused = ref(false);
const inputRef = ref();

value.value = props.content.value;
watch(() => props.content.value, (n) => value.value = n);
watch(() => props.content.value, (n) => console.warn(n));

function SetFocused(state) {
    isFocused.value = state;
    console.log('SetFocused', state)
    if (state) inputRef.value.focus();
}

let timeoutId;
function OnInput({ target }) {
    console.log("IN", value.value, target.value)
    value.value = target.value;

    if (props.content.onEnter == true) return;

    if (props.content.debounce) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            props.gui.OnAction(props.content.id, 'input', target.value);
        }, props.content.debounce);
    } else {
        props.gui.OnAction(props.content.id, 'input', target.value);
    }
}

function OnKeyDown({ key }) {
    if (props.content.onEnter == true && key === 'Enter') {
        props.gui.OnAction(props.content.id, 'enter', value.value);
    }
}

function GetOverride() {
    if (props.content.override) return props.content.override.replace('%', value.value);
    else return value.value;
}

onMounted(() => {
    window.addEventListener('keydown', OnKeyDown);
})

onUnmounted(() => {
    window.removeEventListener('keydown', OnKeyDown);
})

</script>