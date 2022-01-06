<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeMount } from 'vue';
import api from '../../requests/api';
import { ElMessage } from 'element-plus';
const topics = ref([])
const selectTopicId = ref(0)
const loading = ref(true)
onBeforeMount(() => {
    api.getPublishedTopic().then(res => {
        if (res.data.code === 200) {
            loading.value = false
            topics.value = res.data.data
        } else {
            ElMessage.error(res.data.msg)
        }
    }).catch(err => {
        ElMessage.error("网络异常")
        console.log(err)
    })
    api.getMySelected().then(res => {
        if (res.data.code === 200) {
            selectTopicId.value = res.data.data.Tid
        } else {
            selectTopicId.value = 0
        }
    }).catch(err => {
        ElMessage.error("网络异常")
        console.log(err)
    })
})
const Select = (tid:number)=>{
    api.selectTopic(tid).then(res => {
        if (res.data.code === 200) {
            ElMessage.success(res.data.msg)
            selectTopicId.value = tid
        } else {
            ElMessage.error(res.data.msg)
        }
    }).catch(err => {
        ElMessage.error("网络异常")
        console.log(err)
    })
}
const cancel = ()=>{
    api.cancelSelectTopic().then(res => {
        if (res.data.code === 200) {
            ElMessage.success(res.data.msg)
            selectTopicId.value = 0
        } else {
            ElMessage.error(res.data.msg)
        }
    }).catch(err => {
        ElMessage.error("网络异常")
        console.log(err)
    })
}
</script>

<template>
    <el-card>
        <el-table :data="topics" style="width: 100%;height: 100%;" v-loading="loading">
            <el-table-column fixed prop="Id" label="题目编号"></el-table-column>
            <el-table-column fixed prop="Name" label="题目名称"></el-table-column>
            <el-table-column label="导师姓名">
                <template #default="{ row, column, $index }">
                    <router-link :to="`/personalInfo?tid=${row.Tutor.Id}`">{{row.Tutor.Name}}</router-link>
                </template>
            </el-table-column>
            <el-table-column prop="Type" label="题目类型"></el-table-column>
            <el-table-column prop="Source" label="课题来源"></el-table-column>
            <el-table-column prop="Profile" label="内容简介"></el-table-column>
            <el-table-column prop="MajorRequirement" label="专业要求"></el-table-column>
            <el-table-column prop="StudentRequirement" label="学生要求"></el-table-column>
            <el-table-column fixed="right" label="选题" align="center">
                <template #default="{ row, column, $index }">
                    <el-button
                        v-if="selectTopicId != row.Id"
                        round
                        size="mini"
                        type="success"
                        :disabled="selectTopicId != row.Id && selectTopicId != 0"
                        plain
                        @click="Select(row.Id)"
                    >选题</el-button>
                    <el-button
                        v-else
                        @click="cancel()"
                        round
                        size="mini"
                        type="danger"
                        plain
                        :disabled="selectTopicId != row.Id"
                    >取消选题</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<style lang="scss">
</style>