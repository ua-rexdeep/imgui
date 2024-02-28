<template>
    <div v-if="content.type == 'text'" class="py-0.5 flex gap-1" :style="{
        width: computeSize(content.width),
        textAlign: content.center ? 'center' : 'left',
        userSelect: content.userSelect == true ? 'text' : 'none',
        lineBreak: 'anywhere',
        whiteSpace: 'pre-wrap',
    }">
        <div v-html="coloredString(content.value)" />
        <div v-if="content.object" class="bg-second w-fit hover:bg-second-active" @click="CreateObjectGUI(content.object)">
            {{
                content.object.toString() }}</div>
    </div>
    <div v-else-if="content.type == 'divider'" class="h-[1px] mx-2 bg-gray-500"></div>
    <GUIFloat v-else-if="content.type == 'float'" :content="content" :gui="gui" />
    <GUIInput v-else-if="content.type == 'input'" :content="content" :gui="gui" />
    <GUIButton v-else-if="content.type == 'button'" :content="content" :gui="gui" />
    <GUICheck v-else-if="content.type == 'check'" :content="content" :gui="gui" />
    <GUIIcon v-else-if="content.type == 'icon'" :content="content" :gui="gui" />
    <GUISelect v-else-if="content.type == 'select'" :content="content" :gui="gui" />
    <GUIScrolling v-else-if="content.type == 'scrolling'" :content="content" :gui="gui" />
    <div v-else-if="content.type == 'horizontal'" class="flex gap-1 overflow-auto" :style="{
        width: computeSize(content.width),
        height: computeSize(content.height),
    }">
        <GUIContent v-for="c1 in content.content" :key="c1.id" :content="c1" :gui="gui" />
    </div>
    <div v-else-if="content.type == 'vertical'" class="flex flex-col gap-1 overflow-auto"
        :class="{ 'flex-col-reverse': content.reverseScroll == true }" :style="{
            width: computeSize(content.width),
            height: computeSize(content.height),
        }">
        <GUIContent v-for="c1 in content.reverseScroll ? [...content.content].reverse() : content.content" :key="c1.id"
            :content="c1" :gui="gui" />
    </div>
    <div v-else>UNKNOWN: {{ content.type }}</div>
</template>

<script setup>
import { GUI } from '../services/gui';
import { UseImGUI } from '../store';
import { coloredString, computeSize } from '../utils';
import GUIButton from './GUIButton.vue';
import GUICheck from './GUICheck.vue';
import GUIFloat from './GUIFloat.vue';
import GUIIcon from './GUIIcon.vue';
import GUIInput from './GUIInput.vue';
import GUIScrolling from './GUIScrolling.vue';
import GUISelect from './GUISelect.vue';

defineProps(['content', 'gui']);

const imgui = UseImGUI();

function CreateObjectGUI(obj) {
    imgui.CreateGUI('Object', {
        title: 'object',
        width: 400,
        height: (Object.keys(obj).length * 30) < GUI.MinHeight ? GUI.MinHeight : (Object.keys(obj).length * 30),
        resize: true,
        contents: [
            { type: 'text', value: JSON.stringify(obj, null, 4) }
        ]
    })
}

</script>