<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeMount } from 'vue';
import api from '../requests/api';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';
import store from '../store/index';
interface BtnLoading {
    passed: boolean,
    published: boolean,
}
const loading = ref(true)
const btnLoading = ref<Array<BtnLoading>>([])
const users = ref<Array<{
            Id:number
            Username:string
            Auth:string
            InfoId:number
            Available:number
        }>>([])
const router = useRouter()
onBeforeMount(() => {
    if (store.state.auth != "admin") {
        router.push("/index")
        return
    }
    api.GetUserList().then(res => {
        if (res.data.code === 200) {
            console.log(res.data)
            loading.value = false
            users.value = res.data.data
        } else {
            ElMessage.error(res.data.msg)
        }
    }).catch(err => {
        console.log(err)
        ElMessage.error("网络异常")
    })
})
const setPassedStatus = async (id: number, status: number, index: number) => {
    api.SetUserStatus(id,status).then(res=>{
    if (res.data.code === 200) {
            loading.value = false
            users.value[index].Available = status
            ElMessage.success(res.data.msg)
        } else {
            ElMessage.error(res.data.msg)
        }
    }).catch(err => {
        console.log(err)
        ElMessage.error("网络异常")
    })
}
const setTutorAuth = async (id: number, status: number, index: number) => {
    api.SetUserAuth(id,status).then(res=>{
    if (res.data.code === 200) {
            loading.value = false
            if (status === 1)
                users.value[index].Auth = "manager"
                else{
                    users.value[index].Auth = "tutor"
                }
            ElMessage.success(res.data.msg)
        } else {
            ElMessage.error(res.data.msg)
        }
    }).catch(err => {
        console.log(err)
        ElMessage.error("网络异常")
    })
}
const setPassword = (Id: number) => {
    ElMessageBox.prompt('请输入新的密码', 'Tip', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        inputValidator(value): boolean | string {
            if (value != "")
                return true
            else return "密码不能为空"
        }
    })
        .then(({ value }) => {
            api.modifyPassword(Id, value).then(res => {
                if (res.data.code === 200) {
                    ElMessage({
                        type: 'success',
                        message: `修改成功`,
                    })
                } else {
                    ElMessage.error(res.data.msg)
                }
            }).catch(err => {
                console.log(err)
                ElMessage.error("网络异常")
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: 'Input canceled',
            })
        })
}
</script>

<template>
    <el-card style="width: 100%;height: 100%;">
        <el-table :data="users" style="width: 100%;height: 100%;" v-loading="loading">
            <el-table-column fixed prop="Id" label="用户ID" align="center" />
            <el-table-column fixed prop="Username" label="用户名" align="center" >
                <template #default="{ row, column, $index }">
                    <router-link :to="`/personalInfo?sid=${row.InfoId}`" v-if="row.Auth==='student'">{{row.Username}}</router-link>
                    <router-link :to="`/personalInfo?tid=${row.InfoId}`" v-else-if="row.Auth==='manager'||row.Auth==='tutor'">{{row.Username}}</router-link>
                    <div v-else>{{row.Username}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="Auth" label="身份" align="center">
                <template #default="{ row, column, $index }">
                    <el-tag v-if="row.Auth === 'student'" type="success">学生</el-tag>
                    <el-tag v-if="row.Auth === 'tutor'">导师</el-tag>
                    <el-tag v-if="row.Auth === 'manager'" type="warning">系主任</el-tag>
                    <el-tag v-if="row.Auth === 'admin'" type="danger">管理员</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="InfoId" label="身份ID" align="center" />
            <el-table-column prop="Available" label="状态" align="center">
                <template #default="{ row, column, $index }">
                    <el-tag v-if="row.Available === 0" type="danger">未启用</el-tag>
                    <el-tag v-if="row.Available === 1" type="success">正常</el-tag>
                    <el-tag v-if="row.Available === 2" type="info">禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="审核操作" align="center">
                <template #default="{ row, column, $index }">
                    <el-button
                        v-if="row.Available === 0 || row.Available === 2"
                        round
                        size="mini"
                        type="success"
                        plain
                        @click="setPassedStatus(row.Id, 1, $index)"
                    >通过</el-button>
                    <el-button
                        v-if="row.Available === 0 || row.Available === 1"
                        round
                        size="mini"
                        type="danger"
                        plain
                        @click="setPassedStatus(row.Id, 2, $index)"
                    >禁用</el-button>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center">
                <template #default="{ row, column, $index }">
                    <el-button
                        round
                        size="mini"
                        type="success"
                        plain
                        @click="setPassword(row.Id)"
                    >修改密码</el-button>
                    <span v-if="row.Auth === 'tutor'|| row.Auth === 'manager'">
                    <el-button
                        round
                        size="mini"
                        type="success"
                        v-if="row.Auth === 'tutor'"
                        plain
                        @click="setTutorAuth(row.Id,1,$index)"
                    >提升为系主任</el-button>
                    <el-button
                        round
                        size="mini"
                        type="success"
                        v-else
                        plain
                        @click="setTutorAuth(row.Id,0,$index)"
                    >降级为导师</el-button>
                    </span>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<style lang="scss">
</style>