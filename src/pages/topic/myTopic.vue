<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeMount } from 'vue';
import api from '../../requests/api';
import { ElMessage } from 'element-plus';
import store from '../../store/index';
import { useRouter } from 'vue-router';
const topics = ref([])
const loading = ref(true)
const router = useRouter()
onBeforeMount(() => {
    if (store.state.auth != "manager" && store.state.auth != "tutor") {
        router.push("/index")
        return
    }
    api.getMyTopic().then(res => {
        if (res.data.code === 200) {
            loading.value = false
            topics.value = res.data.topics
        } else {
            ElMessage.error(res.data.msg)
        }
    }).catch(err => {
        console.log(err)
        ElMessage.error("网络异常")
    })
})
</script>

<template>
    <el-card style="width: 100%;height: 100%;">
        <el-table :data="topics" style="width: 100%;height: 100%;" v-loading="loading">
            <el-table-column fixed prop="Id" label="题目编号" />
            <el-table-column fixed prop="Name" label="题目名称" />
            <el-table-column prop="Type" label="题目类型" />
            <el-table-column prop="Source" label="课题来源" />
            <el-table-column prop="Profile" label="内容简介" />
            <el-table-column prop="MajorRequirement" label="专业要求" />
            <el-table-column prop="StudentRequirement" label="学生要求" />
            <el-table-column prop="Passed" label="审核状态">
                <template #default="{ row, column, $index }">
                    <el-tag v-if="row.Passed === 1" type="success">已审核</el-tag>
                    <el-tag v-else-if="row.Passed === 0" type="info">未审核</el-tag>
                    <el-tag v-else-if="row.Passed === 2" type="danger">审核未通过</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="Published" label="发布状态">
                <template #default="{ row, column, $index }">
                    <el-tag v-if="row.Published === 1" type="success">已发布</el-tag>
                    <el-tag v-else-if="row.Published === 0" type="info">未发布</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="Published" label="修改题目">
                <template #default="{ row, column, $index }">
                    <el-button type="primary" @click="router.push('/modifyTopic?tid='+row.Id)" :disabled="row.Passed === 1">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<style lang="scss">
</style>