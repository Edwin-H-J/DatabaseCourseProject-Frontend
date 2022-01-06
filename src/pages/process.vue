
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElLoading, ElMessage } from 'element-plus'
import { useRouter, useRoute } from 'vue-router';
import TaskBook from '../components/TaskBook.vue';
import api from '../requests/api';
import store from '../store/index';
import LiteratureReview from '../components/LiteratureReview.vue';
import Proposal from '../components/Proposal.vue';
import DocumentTranslation from '../components/DocumentTranslation.vue';
import MidTermReport from '../components/midTermReport.vue';
import MidTermResult from '../components/midTermResult.vue';
import Paper from '../components/Paper.vue';
import TutorReview from '../components/TutorReview.vue';
import PeerReview from '../components/peerReview.vue';
import DefendResult from '../components/DefendResult.vue';
const router = useRouter()
const route = useRoute()
const nowStatus = ref(0)
const pageStatus = ref(0)
const process = ref<{
    id: number
    process_status: number
    task_book: string,
    literature_review: string,
    proposal: string,
    document_translation: string,
    mid_term_report: string,
    mid_term_result: string,
    paper: string,
    tutor_review: string,
    peer_review: string,
    defend_result: string
}>({
    id: 0,
    process_status: 0,
    task_book: "",
    literature_review: "",
    proposal: "",
    document_translation: "",
    mid_term_report: "",
    mid_term_result: "",
    paper: "",
    tutor_review: "",
    peer_review: "",
    defend_result: "",
})
onMounted(() => {
    load()
})
const load = () => {
    let loading = ElLoading.service()
    let pid = route.query["pid"]
    if (pid != null && store.state.auth === "tutor" || store.state.auth === "manager") {
        console.log(pid)
        api.getProcess(<number><any>pid).then(res => {
            if (res.data.code === 200) {
                console.log(res.data)
                process.value = res.data.data
                nowStatus.value = res.data.data.process_status
                pageStatus.value = res.data.data.process_status
            } else {
                ElMessage.error(res.data.msg)
                router.push("/index")
            }
        }).catch(err => {
            console.log(err)
            ElMessage.error("网络异常")
            router.push("/index")
        }).finally(() => {
            loading.close()
        })
    } else {
        api.getMyProcess().then(res => {
            if (res.data.code === 200) {
                console.log(res.data)
                process.value = res.data.data
                nowStatus.value = res.data.data.process_status
                pageStatus.value = res.data.data.process_status
            } else {
                ElMessage.error(res.data.msg)
                router.push("/index")
            }
        }).catch(err => {
            console.log(err)
            ElMessage.error("网络异常")
            router.push("/index")
        }).finally(() => {
            loading.close()
        })
    }
}
const exchangeStatus = (status: number) => {
    if (status > nowStatus.value){
        ElMessage.error("论文未到该进展")
        return
    } 
    pageStatus.value = status
}
</script>

<template>
    <el-card class="top">
        <el-steps simple :active="nowStatus" finish-status="success">
            <el-step>
                <template #title>
                    <div
                        @click="exchangeStatus(0)"
                        :class="['process', nowStatus >= 0 ? 'able' : 'disable']"
                    >任务书下达</div>
                </template>
            </el-step>
            <el-step>
                <template #title>
                    <div
                        @click="exchangeStatus(1)"
                        :class="['process', nowStatus >= 1 ? 'able' : 'disable']"
                    >文献综述提交</div>
                </template>
            </el-step>
            <el-step>
                <template #title>
                    <div
                        @click="exchangeStatus(2)"
                        :class="['process', nowStatus >= 2 ? 'able' : 'disable']"
                    >开题报告提交</div>
                </template>
            </el-step>
            <el-step>
                <template #title>
                    <div
                        @click="exchangeStatus(3)"
                        :class="['process', nowStatus >= 3 ? 'able' : 'disable']"
                    >开题报告确认</div>
                </template>
            </el-step>
            <el-step>
                <template #title>
                    <div
                        @click="exchangeStatus(4)"
                        :class="['process', nowStatus >= 4 ? 'able' : 'disable']"
                    >原文翻译提交</div>
                </template>
            </el-step>
            <el-step>
                <template #title>
                    <div
                        @click="exchangeStatus(5)"
                        :class="['process', nowStatus >= 5 ? 'able' : 'disable']"
                    >中期报告提交</div>
                </template>
            </el-step>
            <el-step>
                <template #title>
                    <div
                        @click="exchangeStatus(6)"
                        :class="['process', nowStatus >= 6 ? 'able' : 'disable']"
                    >中期检查</div>
                </template>
            </el-step>
            <el-step>
                <template #title>
                    <div
                        @click="exchangeStatus(7)"
                        :class="['process', nowStatus >= 7 ? 'able' : 'disable']"
                    >论文提交</div>
                </template>
            </el-step>
            <el-step>
                <template #title>
                    <div
                        @click="exchangeStatus(8)"
                        :class="['process', nowStatus >= 8 ? 'able' : 'disable']"
                    >导师评阅</div>
                </template>
            </el-step>
            <el-step>
                <template #title>
                    <div
                        @click="exchangeStatus(9)"
                        :class="['process', nowStatus >= 9 ? 'able' : 'disable']"
                    >同行评阅</div>
                </template>
            </el-step>
            <el-step>
                <template #title>
                    <div
                        @click="exchangeStatus(10)"
                        :class="['process', nowStatus >= 10 ? 'able' : 'disable']"
                    >论文答辩</div>
                </template>
            </el-step>
        </el-steps>
    </el-card>
    <TaskBook
        v-if="pageStatus === 0"
        :status="nowStatus"
        :detail="process.task_book"
        :pid="process.id"
        @reload="load"
        :step="0"
    ></TaskBook>
    <LiteratureReview
        v-if="pageStatus === 1"
        :status="nowStatus"
        :detail="process.literature_review"
        :pid="process.id"
        @reload="load"
        :step="1"
    ></LiteratureReview>
    <Proposal
        v-if="pageStatus === 2"
        :status="nowStatus"
        :detail="process.proposal"
        :pid="process.id"
        @reload="load"
        :step="2"
    ></Proposal>
    <Proposal
        v-if="pageStatus === 3"
        :status="nowStatus"
        :detail="process.proposal"
        :pid="process.id"
        @reload="load"
        :step="3"
    ></Proposal>
    <DocumentTranslation
        v-if="pageStatus === 4"
        :status="nowStatus"
        :detail="process.document_translation"
        :pid="process.id"
        @reload="load"
        :step="4"
    ></DocumentTranslation>
    <MidTermReport
        v-if="pageStatus === 5"
        :status="nowStatus"
        :detail="process.mid_term_report"
        :pid="process.id"
        @reload="load"
        :step="5"
    ></MidTermReport>
    <MidTermResult
        v-if="pageStatus === 6"
        :status="nowStatus"
        :detail="process.mid_term_result"
        :pid="process.id"
        @reload="load"
        :step="6"
    ></MidTermResult>
    <Paper
        v-if="pageStatus === 7"
        :status="nowStatus"
        :detail="process.paper"
        :pid="process.id"
        @reload="load"
        :step="7"
    ></Paper>
    <TutorReview
        v-if="pageStatus === 8"
        :status="nowStatus"
        :detail="process.tutor_review"
        :pid="process.id"
        @reload="load"
        :step="8"
    ></TutorReview>
    <PeerReview
        v-if="pageStatus === 9"
        :status="nowStatus"
        :detail="process.peer_review"
        :pid="process.id"
        @reload="load"
        :step="9"
    ></PeerReview>
    <DefendResult
        v-if="pageStatus === 10"
        :status="nowStatus"
        :detail="process.defend_result"
        :pid="process.id"
        @reload="load"
        :step="10"
    ></DefendResult>
</template>

<style lang="scss">
.top {
    margin-bottom: 1vh;
    .able:hover{
        cursor:pointer;
    }
    .disable:hover{
        cursor:not-allowed;
    }
}
</style>