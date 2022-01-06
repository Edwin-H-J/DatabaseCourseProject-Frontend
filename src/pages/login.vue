<script setup lang="ts">
import { reactive, ref, toRaw } from 'vue';
import type { ElForm } from 'element-plus'
import { ElMessage } from 'element-plus';
import api from '../requests/api';
import store from '../store/index';
import { useRouter } from 'vue-router';
const FormRef = ref<InstanceType<typeof ElForm>>()
const form = reactive({
    username: "",
    password: "",
})
const router = useRouter()
const btn = ref(false)
const login = (formInstance: InstanceType<typeof ElForm> | undefined) => {
    formInstance?.validate((valid) => {
        if (!valid) {
            return false
        }
        btn.value = true
        api.login(form.username,form.password).then((res)=>{
            btn.value = false
            console.log(res)
            if(res.data.code === 200){
                ElMessage.success("登录成功")
                store.setAuth(res.data.info.auth)
                store.setId(res.data.info.id)
                router.push("/index")
            }else{
                ElMessage.error(res.data.msg)
            }
            
        }).catch(err=>{
            btn.value = false
            ElMessage.error("网络异常")
            console.log(err)
        })

    })
}

const rules = reactive({
    username: [
        {
            required: true,
            message: '请输入用户名',
            trigger: 'blur',
        }
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
            trigger: 'blur',
        }
    ]
})
</script>

<template>
    <div id="main">
        <el-card class="card">
            <template #header>
                <div :style="{display:'flex',justifyContent: 'center'}">
                    登录
                </div>
            </template>
            <el-form
                label-width="90px"
                label-position="left"
                hide-required-asterisk
                :model="form"
                :rules="rules"
                ref="FormRef"
            >
                <el-form-item label="用户名" required prop="username">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" required prop="password">
                    <el-input type="password" v-model="form.password" show-password></el-input>
                </el-form-item>
                <div class="log-but">
                    <el-button class="btn" type="primary" @click="login(FormRef)" :loading="btn">登录</el-button>
                    <el-button class="btn" @click="router.push('/register')">注册</el-button>
                </div>
            </el-form>
        </el-card>
    </div>
</template>

<style lang="scss">
#main {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    .card {
        min-width: 300px;
        .log-but {
            display: flex;
            justify-content: center;
            .btn {
                margin: 0 20px;
                min-width: 120px;
            }
        }
    }
}
</style>