<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeMount } from 'vue';
import api from '../../requests/api';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import store from '../../store/index';
interface BtnLoading {
    passed: boolean,
    published: boolean,
}
const loading = ref(true)
const btnLoading = ref<Array<BtnLoading>>([])
const topics = ref<Array<any>>([])
const router = useRouter()
onBeforeMount(() => {
    if (store.state.auth != "manager" && store.state.auth != "tutor") {
        router.push("/index")
        return
    }
    api.getTutorConfirmSelected().then(res => {
        if (res.data.code === 200) {
            console.log(res.data)
            loading.value = false
            topics.value = res.data.data
        } else {
            ElMessage.error(res.data.msg)
        }
    }).catch(err => {
        console.log(err)
        ElMessage.error("网络异常")
    })
})
const setConfirmStatus = (tid: number, sid: number, status: number, index: number) => {
    api.tutorConfirm(tid, sid, status).then(res => {
        if (res.data.code === 200) {
            ElMessage.success("操作成功")
            topics.value[index].TutorCheck = status
        } else {
            ElMessage.error(res.data.msg)
        }
    }).catch(err => {
        ElMessage.error("网络异常")
    }).finally(() => {
    })
}

</script>

<template>
    <el-card style="width: 100%;height: 100%;">
        <el-table :data="topics" style="width: 100%;height: 100%;" v-loading="loading">
            <el-table-column fixed prop="Topic.Name" label="题目名称" />
            <el-table-column prop="Student.Name" label="学生姓名" >
                <template #default="{ row, column, $index }">
                    <router-link :to="`/personalInfo?sid=${row.Student.Id}`">{{row.Student.Name}}</router-link>
                </template>
            </el-table-column>
            <el-table-column prop="TutorCheck" label="导师审核状态">
                <template #default="{ row, column, $index }">
                    <el-tag v-if="row.TutorCheck === 1" type="success">已审核</el-tag>
                    <el-tag v-else-if="row.TutorCheck === 0" type="info">未审核</el-tag>
                    <el-tag v-else-if="row.TutorCheck === 2" type="danger">审核未通过</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="ManagerCheck" label="系主任审核状态">
                <template #default="{ row, column, $index }">
                    <el-tag v-if="row.ManagerCheck === 1" type="success">已审核</el-tag>
                    <el-tag v-else-if="row.ManagerCheck === 0" type="info">未审核</el-tag>
                    <el-tag v-else-if="row.ManagerCheck === 2" type="danger">审核未通过</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="Published" label="发布状态">
                <template #default="{ row, column, $index }">
                    <el-tag v-if="row.Published === 1" type="success">已发布</el-tag>
                    <el-tag v-else-if="row.Published === 0" type="info">未发布</el-tag>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="审核操作" align="center">
                <template #default="{ row, column, $index }">
                    <el-button
                        v-if="row.TutorCheck === 0|| row.TutorCheck === 2"
                        round
                        size="mini"
                        type="success"
                        plain
                        @click="setConfirmStatus(row.Tid, row.Sid, 1, $index)"
                    >通过</el-button>
                    <el-button
                        v-if="row.TutorCheck === 1 || row.TutorCheck === 0"
                        round
                        size="mini"
                        type="success"
                        plain
                        @click="setConfirmStatus(row.Tid, row.Sid, 2, $index)"
                    >不通过</el-button>
                </template>
            </el-table-column>
            <el-table-column label="查看进程">
                <template #default="{ row, column, $index }">
                    <el-button
                        :disabled="row.ProcessId == 0 || row.ProcessId == null"
                        round
                        size="mini"
                        plain
                        @click="router.push(`/process?pid=${row.ProcessId}`)"
                    >查看进程</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<style lang="scss">
</style>