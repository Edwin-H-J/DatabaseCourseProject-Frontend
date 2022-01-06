<script setup lang="ts">
import {defineProps} from "vue"
const props = defineProps<{
    status:number
}>()
function ProcessTranslate(status:number){
    switch(status){
        case(-1):return "未开始进程"
        case(0):return "任务书下达阶段";
        case(1):return "文献综述提交阶段";
        case(2):return "开题报告提交阶段";
        case(3):return "开题报告确认阶段";
        case(4):return "原文翻译提交阶段";
        case(5):return "中期报告提交阶段";
        case(6):return "中期检查阶段";
        case(7):return "论文提交阶段";
        case(8):return "导师评阅阶段";
        case(9):return "同行评阅阶段";
        case(10):return "论文答辩阶段";
        case(11):return "毕业设计完成";
    }
}
function tagType(status:number){
    switch(status){
        case(-1):return "info"
        case(11):return "success";
        default: return "warning"
    }

}
</script>

<template>
    <el-tag :type="tagType(props.status)">
        {{ProcessTranslate(props.status)}}
    </el-tag>
</template>