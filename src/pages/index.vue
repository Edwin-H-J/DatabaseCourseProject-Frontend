<script setup lang="ts">
import store from '../store'
import api from '../requests/api';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import ProcessStatus from '../components/ProcessStatus.vue';
const baseInfo = ref({
    name: "",
    title: "",
    selected: false,
    TutorCheck: 0,
    ManagerCheck: 0,
    toPublishedSelectsed:0,
    Published: 0,
    Passed: 0,
    process: -1,
})
await api.LookupBaseInfo().then(res => {
    if (res.data.code === 200) {
        console.log(res.data)
        baseInfo.value.name = res.data.student?.Name || res.data.tutor?.Name || "管理员"
        baseInfo.value.title = "student" in res.data ? "同学" : ("tutor" in res.data ? "老师" : "")
        if ("selecteds" in res.data) {
            for (let s of res.data.selecteds) {
                if (s.TutorCheck === 0) {
                    baseInfo.value.TutorCheck++
                }
            }
        }
        if ("ConfirmTopics" in res.data) {
            for (let t of res.data.ConfirmTopics) {
                if (t.Published === 0) {
                    baseInfo.value.Published++
                    baseInfo.value.Passed++
                }
            }
        }
        if ("ConfirmSelects" in res.data) {
            for (let s of res.data.ConfirmSelects) {
                if (s.TutorCheck === 1 && s.ManagerCheck === 0) {
                    baseInfo.value.ManagerCheck++
                }
                if(s.TutorCheck === 1 && s.ManagerCheck === 1 && s.Published===0){
                    baseInfo.value.toPublishedSelectsed++
                }
            }
        }
        if ("process" in res.data) baseInfo.value.process = res.data.process
        if ("selected" in res.data) {
            baseInfo.value.selected = true
            baseInfo.value.TutorCheck = res.data.selected.TutorCheck
            baseInfo.value.ManagerCheck = res.data.selected.ManagerCheck
        }

    } else {
        ElMessage.error(res.data.msg)
    }
}).catch(err => {
    console.log(err)
    ElMessage.error("网络异常")
}).finally(() => {
})
</script>

<template>
    <el-card>
        <template #header>
            <span v-if="new Date().getHours() >= 6 && new Date().getHours() < 11">早上好</span>
            <span v-else-if="new Date().getHours() >= 11 && new Date().getHours() < 13">中午好</span>
            <span v-else-if="new Date().getHours() >= 13 && new Date().getHours() < 17">下午好</span>
            <span v-else-if="new Date().getHours() >= 17 && new Date().getHours() < 19">傍晚好</span>
            <span v-else-if="new Date().getHours() >= 19 && new Date().getHours() < 24">晚上好</span>
            <span v-else-if="new Date().getHours() >= 0 && new Date().getHours() < 6">晚上好</span>
            ,
            {{ baseInfo.name }}
            {{ baseInfo.title }}
        </template>
        <template #default>
            <div v-if="store.state.auth === 'student'">
                <div v-if="baseInfo.selected">
                    您的选题状态:
                    <div>
                        导师审核:
                        <el-tag type="warning" v-if="baseInfo.TutorCheck == 0">未审核</el-tag>
                        <el-tag type="success" v-else-if="baseInfo.TutorCheck == 1">审核通过</el-tag>
                        <el-tag v-else-if="baseInfo.TutorCheck === 2" type="danger">审核未通过</el-tag>
                    </div>
                    <div>
                        系主任审核:
                        <el-tag type="warning" v-if="baseInfo.ManagerCheck == 0">未审核</el-tag>
                        <el-tag type="success" v-else-if="baseInfo.ManagerCheck == 1">审核通过</el-tag>
                        <el-tag v-else-if="baseInfo.TutorCheck === 2" type="danger">审核未通过</el-tag>
                    </div>
                    <div>
                        毕业设计进程:
                        <ProcessStatus :status="baseInfo.process"></ProcessStatus>
                    </div>
                </div>
                <div v-else>您尚未选题</div>
            </div>
            <div v-else-if="store.state.auth === 'tutor' || store.state.auth === 'manager'">
                <div v-if="baseInfo.Passed!=0">您有{{baseInfo.Passed}}个题目待审核</div>
                <div v-if="baseInfo.Published!=0">您有{{baseInfo.Published}}个题目待发布</div>
                <div v-if="baseInfo.TutorCheck!=0">您有{{baseInfo.TutorCheck}}个选题待审核</div>
                <div v-if="baseInfo.ManagerCheck!=0">您有{{baseInfo.ManagerCheck}}个选题待最终审核</div>
                <div v-if="baseInfo.toPublishedSelectsed!=0">您有{{baseInfo.toPublishedSelectsed}}个题目待发布</div>
            </div>
            <div v-else-if="store.state.auth === 'admin'"></div>
        </template>
    </el-card>
</template>

<style>
</style>