
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
        ElMessage.error("不可提交空中期报告结果")
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
        api.TutorSetProcessProp(pid.value, 7, "mid_term_result", detail.value).then(res => {
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
    <el-card v-if="store.state.auth === 'student' && props.status == props.step">正在等待中期报告结果</el-card>
    <el-card v-else>
        <el-input
            type="textarea"
            v-model="detail"
            :autosize="{ minRows: 20, maxRows: 40 }"
            :readonly="props.status != props.step || (store.state.auth != 'tutor' && store.state.auth != 'manager')"
        ></el-input>
        <div v-if="props.status == props.step" class="btn">
            <el-button type="primary" @click="submit()" :loading="btnLoading">提交中期报告结果</el-button>
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