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
    api.getAllTopic().then(res => {
        if (res.data.code === 200) {
            console.log(res.data)
            loading.value = false
            topics.value = res.data.data
            for (let i in res.data.data) {
                btnLoading.value?.push({
                    passed: false,
                    published: false,
                })
            }
        } else {
            ElMessage.error(res.data.msg)
        }
    }).catch(err => {
        console.log(err)
        ElMessage.error("网络异常")
    })
})
const setPassedStatus = async (id: number, status: number, index: number) => {
    if (status == 2 && topics.value[index].Published == 1) {
        await ElMessageBox.confirm("驳回审核同时会取消已发布的题目，是否继续", "提示", {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: 'warning'
        }).then(() => {
            btnLoading.value[index].passed = true
            setPublishedStatus(id, 0, index)
        }).catch(() => {
            ElMessage({
                type: 'info',
                message: '操作取消',
            })
        })
    }
    api.setTopicPassedStatus(id, status).then(res => {
        if (res.data.code === 200) {
            ElMessage.success("操作成功")
            topics.value[index].Passed = status
        } else {
            ElMessage.error(res.data.msg)
        }
    }).catch(err => {
        ElMessage.error("网络异常")
    }).finally(() => {
        btnLoading.value[index].passed = false
    })

}
const setPublishedStatus = (id: number, status: number, index: number) => {
    if (status == 1 && topics.value[index].Passed != 1) {
        ElMessage.error("此题目未审核通过，不可发布")
        return
    }
    btnLoading.value[index].published = true
    api.setTopicPublishedStatus(id, status).then(res => {
        if (res.data.code === 200) {
            ElMessage.success("操作成功")
            topics.value[index].Published = status
        } else {
            ElMessage.error(res.data.msg)
        }
    }).catch(err => {
        ElMessage.error("网络异常")
    }).finally(() => {
        btnLoading.value[index].published = false
    })
}
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
            <el-table-column label="导师姓名">
                <template #default="{ row, column, $index }">
                    <router-link :to="`/personalInfo?tid=${row.Tutor.Id}`">{{row.Tutor.Name}}</router-link>
                </template>
            </el-table-column>
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
            <el-table-column fixed="right" label="审核操作" align="center">
                <template #default="{ row, column, $index }">
                    <el-button
                        v-if="row.Passed === 0 || row.Passed === 2"
                        round
                        size="mini"
                        type="success"
                        plain
                        @click="setPassedStatus(row.Id, 1, $index)"
                        :loading="btnLoading[$index].passed"
                    >通过</el-button>
                    <el-button
                        v-if="row.Passed === 0 || row.Passed === 1"
                        round
                        size="mini"
                        type="danger"
                        plain
                        @click="setPassedStatus(row.Id, 2, $index)"
                        :loading="btnLoading[$index].passed"
                    >驳回</el-button>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="发布操作" align="center">
                <template #default="{ row, column, $index }">
                    <el-button
                        v-if="row.Published === 0"
                        round
                        size="mini"
                        type="success"
                        plain
                        @click="setPublishedStatus(row.Id, 1, $index)"
                        :loading="btnLoading[$index].published"
                    >发布</el-button>
                    <el-button
                        v-if="row.Published === 1"
                        round
                        size="mini"
                        type="danger"
                        plain
                        @click="setPublishedStatus(row.Id, 0, $index)"
                        :loading="btnLoading[$index].published"
                    >取消发布</el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<style lang="scss">
</style>