
<script setup lang="ts">
import store from '../store/index';
import { ref, reactive, onMounted, watchEffect } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import api from '../requests/api';
import { useRouter } from 'vue-router';
const emit = defineEmits(['reload'])
const router = useRouter()
const props = defineProps<{
    pid: number
    status: number,
    detail: string,
    step:number
}>()
const btnLoading = ref(false)
const pid = ref(0)
const detail = ref("")
watchEffect(()=>{
    detail.value = props.detail
    pid.value = props.pid
})
const submit = () => {
    if (detail.value === "") {
        ElMessage.error("不可提交空文献综述")
    }
    btnLoading.value = true
    ElMessageBox.confirm(
        "提交后不可修改，请注意",
        "Warning",
        {
            confirmButtonText: '提交',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        api.StudentSetProcessProp(pid.value, 3, "proposal", detail.value).then(res => {
            if (res.data.code === 200) {
                console.log(res.data)
                emit("reload")
            } else {
                ElMessage.error(res.data.msg)
            }
        }).catch(err => {
            console.log(err)
            ElMessage.error("网络异常")
        }).finally(() => {
            btnLoading.value = false
        })
    }).catch(()=>{
        btnLoading.value = false
    })

}
const confirm = () => {
    btnLoading.value = true
    ElMessageBox.confirm(
        "确认后不可修改，请注意",
        "Warning",
        {
            confirmButtonText: '提交',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        api.SetProcessStatus(pid.value, 4).then(res => {
            if (res.data.code === 200) {
                console.log(res.data)
                emit("reload")
            } else {
                ElMessage.error(res.data.msg)
            }
        }).catch(err => {
            console.log(err)
            ElMessage.error("网络异常")
        }).finally(() => {
            btnLoading.value = false
        })
    }).catch(()=>{
        btnLoading.value = false
    })

}
</script>

<template>
    <el-card v-if="(store.state.auth === 'tutor'||store.state.auth === 'manager')  && props.status == 2">正在等待开题报告提交</el-card>
    <el-card v-else-if="(store.state.auth === 'student')  && props.status == 3">正在等待导师确认开题报告</el-card>
    <el-card v-if="props.step == 3&&props.status > 3">开题报告已确认</el-card>
    <el-card v-else>
        <el-input
            type="textarea"
            v-model="detail"
            :autosize="{ minRows: 20, maxRows: 40 }"
            :readonly="props.status != props.step || (store.state.auth != 'student')"
        ></el-input>
        <div v-if="props.status == 2 && props.step == 2" class="btn">
            <el-button type="primary" @click="submit()" :loading="btnLoading">提交开题报告</el-button>
        </div>
        <div v-if="props.status == 3 && props.step == 3" class="btn">
            <el-button type="primary" @click="confirm()" :loading="btnLoading">确认开题报告</el-button>
        </div>
    </el-card>
</template>

<style lang="scss">
.btn {
    margin-top: 1vh;
    width: 100%;
    display: flex;
    justify-content: center;
}
</style>