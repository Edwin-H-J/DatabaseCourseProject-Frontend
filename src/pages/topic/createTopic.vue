import { reactive,  } from 'vue';
<script setup lang="ts">
import { reactive,ref,onBeforeMount } from 'vue';
import type {ElForm} from 'element-plus'
import {ElMessage} from 'element-plus';
import api from '../../requests/api';
import { useRouter } from 'vue-router';
import store from '../../store/index';
const btnLoading = ref<boolean>(false)
const router = useRouter()
onBeforeMount(()=>{
    if(store.state.auth != "manager" && store.state.auth != "tutor"){
        router.push("/index")
        return
    }
})
const form = reactive({
    name:"",
	type:"",
	source:"",              
	profile:"",
	major_requirement:"", 
	student_requirement:"",
})
const formRef = ref<InstanceType<typeof ElForm>>()
const rules = reactive({
    name:[
        {
            required:true,
            message: '请输入题目名称',
            trigger: 'blur',
        }
    ],
    type:[
        {
            required:true,
            message: '请输入题目类型',
            trigger: 'blur',
        }
    ],
    source:[
        {
            required:true,
            message: '请输入题目来源',
            trigger: 'blur',
        }
    ],
    major_requirement:[
        {
            required:true,
            message: '请输入专业要求',
            trigger: 'blur',
        }
    ],
    student_requirement:[
        {
            required:true,
            message: '请输入学生要求',
            trigger: 'blur',
        }
    ],
})
const submit = (formRef:InstanceType<typeof ElForm>|undefined)=>{
    btnLoading.value = true
    formRef?.validate((valid)=>{
        if(!valid){
            ElMessage.error("资料未填写完成")
        }
        api.createTopic(form).then(res=>{
            btnLoading.value = false
            if(res.data.code === 200){
                ElMessage.success("创建成功")
                router.push("/myTopic")
            }else{
                ElMessage.error(res.data.msg)
            }
        }).catch(err=>{
            console.log(err)
            ElMessage.error("网络异常")
        })
    })

}
</script>

<template>
    <el-card>
        <el-form label-position="top" :model="form" :rules="rules" ref="formRef">
            <el-row :gutter="50">
                <el-col :span="9" :offset="3">
                    <el-form-item label="题目名称" prop="name">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="题目类型" prop="type">
                        <el-input v-model="form.type"></el-input>
                    </el-form-item>
                    <el-form-item label="课题来源" prop="source">
                        <el-input v-model="form.source"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="9">
                    <el-form-item label="专业要求" prop="major_requirement">
                        <el-input v-model="form.major_requirement"></el-input>
                    </el-form-item>
                    <el-form-item label="学生要求" prop="student_requirement">
                        <el-input v-model="form.student_requirement"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="50">
                <el-col :span="18" :offset="3">
                    <el-form-item label="内容简介" prop="profile">
                        <el-input type="textarea" :autosize="{ maxRows: 20, minRows: 10 }" v-model="form.profile"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <div class="btn">
                <el-button type="primary" :style="{width:'200px'}" :loading="btnLoading" @click="submit(formRef)">
                    提交
                </el-button>
            </div>
        </el-form>
    </el-card>
</template>

<style lang="scss">
    .btn{
        display: flex;
        justify-content: center;
    }
</style>