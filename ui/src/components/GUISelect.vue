<template>
    <div class="flex items-center border border-gray-500 bg-second hover:bg-second-active justify-between relative h-fit"
        @click.stop="" ref="selectRef" @click="showSelect = !showSelect" :style="{
            width: computeSize(content.width),
            height: computeSize(content.height),
        }">
        <div class="p-0.5 px-1 leading-none">{{ content.options.find((opt) => opt.key == content.value)?.value }}</div>
        <div class="p-0.5 px-1 bg-second-active"><i class="fa-solid fa-caret-down text-xs"></i></div>

        <Teleport to="#imgui">
            <div class="absolute top-[103%] left-0 bg-second border border-gray-500 border-t-0 w-fit z-[9999999] text-white select-none"
                :style="{ left: GetPosition().x + 'px', top: GetPosition().y + GetPosition().height + 'px', minWidth: GetPosition().width + 'px' }"
                v-if="showSelect">
                <div class="p-0.5 px-1 leading-none hover:bg-second-active" v-for="option in content.options"
                    :key="option.key" @click.stop="OnChange(option.key)">
                    {{ option.value }}
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { computeSize } from '../utils';

const props = defineProps(['gui', 'content']);
const showSelect = ref(false);
const selectRef = ref();

function GetPosition() {
    return selectRef.value.getBoundingClientRect();
}

function OnChange(key) {
    showSelect.value = false;
    props.content.value = key;
    props.gui.OnAction(props.content.id, 'change', key);
}

function OnClickOutside() {
    showSelect.value = false;
}

onMounted(() => {
    window.addEventListener('click', OnClickOutside);
})

onUnmounted(() => {
    window.removeEventListener('click', OnClickOutside);
})

</script>