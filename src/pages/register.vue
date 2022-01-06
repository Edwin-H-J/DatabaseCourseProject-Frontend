
<script setup lang="ts">
import { reactive, ref, renderSlot } from 'vue';
import api from '../requests/api';
import type { ElForm } from 'element-plus';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
const router = useRouter()
const userFormRef = ref<InstanceType<typeof ElForm>>()
const studentFormRef = ref<InstanceType<typeof ElForm>>()
const tutorFormRef = ref<InstanceType<typeof ElForm>>()
const userform = reactive({
    username: "",
    password: "",
    auth: "",
    confirm: "",
})
const studentForm = reactive({
    name: "",
    sex: "",
    major: "",
    class: "",
    phoneNumber: "",
    Email: "",
    remark: "",
})
const tutorForm = reactive({
    name: "",
    sex: "",
    birthday: new Date(),
    EducationalBackground: "",
    title: "",
    ResearchDirection: "",
    PhoneNumber: "",
    Email: "",
})
const userFormRules = reactive({
    username: [
        {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
        }
    ],
    password: [
        {
            required: true,
            message: "请输入密码",
            trigger: "blur",
        }
    ],
    confirm: [
        {
            required: true,
            message: "请再次输入密码",
            trigger: "blur",
        },
        {
            validator(rule: any, value: any, callback: any) {
                if (value == "") {
                    callback(new Error('请再次输入密码'))
                } else if (value != userform.password) {
                    callback(new Error('两次输入密码不相同'))
                } else {
                    callback()
                }
            },
            trigger: "blur",
        }
    ]
})
const studentFormRules = {
    name: [
        {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
        }
    ],
    sex: [
        {
            required: true,
            message: "请输入班级",
            trigger: "blur",
        }
    ],
    major: [
        {
            required: true,
            message: "请输入专业",
            trigger: "blur",
        }
    ],
    class: [
        {
            required: true,
            message: "请输入班级",
            trigger: "blur",
        }
    ],
    phoneNumber: [
        {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
        },
        {
            min: 11,
            max: 11,
            message: "手机号长度不正确",
            trigger: "blur",
        },
        {
            validator(rule: any, value: any, callback: any) {
                const reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
                if (value == "") {
                    callback(new Error('请输入手机号码'))
                } else if (!reg_tel.test(value)) {
                    callback(new Error('请输入正确的手机号码'))
                } else {
                    callback()
                }

            },
            trigger: "blur",

        }
    ],
    Email: [
        {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
        },
        {
            validator(rule: any, value: any, callback: any) {
                const reg_mail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9]+)+$/
                if (value == "") {
                    callback(new Error('请输入邮箱'))
                } else if (!reg_mail.test(value)) {
                    callback(new Error('请输入正确的邮箱'))
                } else {
                    callback()
                }
            },
            trigger: "blur",
        }
    ]

}
const tutorFormRules = {
    name: [
        {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
        }
    ],
    sex: [
        {
            required: true,
            message: "请输入班级",
            trigger: "blur",
        }
    ],
    PhoneNumber: [
        {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
        },
        {
            min: 11,
            max: 11,
            message: "手机号长度不正确",
            trigger: "blur",
        },
        {
            validator(rule: any, value: any, callback: any) {
                const reg_tel = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
                console.log(reg_tel.test(value))
                if (value == "") {
                    callback(new Error('请输入手机号码'))
                } else if (!reg_tel.test(value)) {
                    callback(new Error('请输入正确的手机号码'))
                } else {
                    callback()
                }
            },
            trigger: "blur",

        }
    ],
    Email: [
        {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
        },
        {
            validator(rule: any, value: any, callback: any) {
                const reg_mail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9]+)+$/
                if (value == "") {
                    callback(new Error('请输入邮箱'))
                } else if (!reg_mail.test(value)) {
                    callback(new Error('请输入正确的邮箱'))
                } else {
                    callback()
                }
            },
            trigger: "blur",
        }
    ],

}
const btnLoading = ref(false)
const register = (userFormRef: InstanceType<typeof ElForm> | undefined, studentFormRef: InstanceType<typeof ElForm> | undefined, tutorFormRef: InstanceType<typeof ElForm> | undefined) => {
    btnLoading.value = true
    userFormRef?.validate((vaild1) => {
        if (!vaild1) {
            ElMessage.error("注册表未填写完成")
            return;
        }
        if (userform.auth === "student") {
            studentFormRef?.validate((vaild2) => {
                if (!vaild2) {
                    ElMessage.error("信息表未填写完成")
                    return;
                }
                console.log(userform,studentForm)
                api.register(userform,studentForm).then(res=>{
                    btnLoading.value = false
                    if(res.data.code === 200){
                        btnLoading.value = true
                        ElMessage.success("注册成功,请等待管理员审核")

                        setTimeout(()=>{
                            router.push("/login")
                        },1000) 
                    }else{
                        ElMessage.error(res.data.msg)
                    }
                }).catch(err=>{
                    ElMessage.error("网络连接异常")
                    console.log(err)
                })
            })
        } else if (userform.auth === "tutor") {
            tutorFormRef?.validate((vaild2) => {
                if (!vaild2) {
                    ElMessage.error("信息表未填写完成")
                    return;
                }
                let tutorFormCp = {...tutorForm,birthday:tutorForm.birthday.toLocaleDateString().replaceAll("\\","-")}
                console.log(userform,tutorFormCp)
                api.register(userform,tutorFormCp).then(res=>{
                    btnLoading.value = false
                    if(res.data.code === 200){
                        btnLoading.value = true
                        ElMessage.success("注册成功,请等待管理员审核")
                        setTimeout(()=>{
                            router.push("/login")
                        },1000) 
                    }else{
                        ElMessage.error(res.data.msg)
                    }
                }).catch(err=>{
                    btnLoading.value = false
                    ElMessage.error("网络连接异常")
                    console.log(err)
                })
            })
        }
    })
}
</script>

<template>
    <div id="main">
        <el-card class="card">
            <template #header>
                <div :style="{ display: 'flex', justifyContent: 'center' }">注册</div>
            </template>
            <el-form
                :model="userform"
                :rules="userFormRules"
                label-width="auto"
                label-position="top"
                ref="userFormRef"
            >
                <el-form-item label="用户名" prop="username" required>
                    <el-input v-model="userform.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password" required>
                    <el-input type="password" v-model="userform.password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirm" required>
                    <el-input type="password" v-model="userform.confirm"></el-input>
                </el-form-item>
                <el-form-item label="角色" prop="auth" required>
                    <el-select v-model="userform.auth" clearable>
                        <el-option :key="1" label="学生" value="student"></el-option>
                        <el-option :key="2" label="导师" value="tutor"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-divider></el-divider>
            <el-form
                v-if="userform.auth === 'student'"
                :model="studentForm"
                class="infoForm"
                label-position="top"
                :rules="studentFormRules"
                ref="studentFormRef"
            >
                <el-form-item label="姓名" prop="name" required>
                    <el-input v-model="studentForm.name"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex" required>
                    <el-select v-model="studentForm.sex" clearable>
                        <el-option :key="1" label="男" value="male"></el-option>
                        <el-option :key="2" label="女" value="female"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="专业" prop="major" required>
                    <el-input v-model="studentForm.major"></el-input>
                </el-form-item>
                <el-form-item label="班级" prop="class" required>
                    <el-input v-model="studentForm.class"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phoneNumber" required>
                    <el-input v-model="studentForm.phoneNumber"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="Email" required>
                    <el-input v-model="studentForm.Email"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="textarea" :row="2" v-model="studentForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <el-form
                v-else-if="userform.auth === 'tutor'"
                :model="tutorForm"
                class="infoForm"
                :rules="tutorFormRules"
                label-position="top"
                ref="tutorFormRef"
            >
                <el-form-item label="姓名" prop="name" required>
                    <el-input v-model="tutorForm.name"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex" required>
                    <el-select v-model="tutorForm.sex" clearable>
                        <el-option :key="1" label="男" value="male"></el-option>
                        <el-option :key="2" label="女" value="female"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="出生日期" prop="birthday" required>
                    <el-date-picker v-model="tutorForm.birthday" editable></el-date-picker>
                </el-form-item>
                <el-form-item label="教育背景" prop="EducationalBackground" required>
                    <el-input v-model="tutorForm.EducationalBackground"></el-input>
                </el-form-item>
                <el-form-item label="职称" prop="title" required>
                    <el-input v-model="tutorForm.title"></el-input>
                </el-form-item>
                <el-form-item label="研究方向" prop="ResearchDirection" required>
                    <el-input v-model="tutorForm.ResearchDirection"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="PhoneNumber">
                    <el-input v-model="tutorForm.PhoneNumber"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="Email" required>
                    <el-input v-model="tutorForm.Email"></el-input>
                </el-form-item>
            </el-form>
            <div class="btnWrapper">
                <el-button
                    class="btn"
                    type="primary"
                    :loading="btnLoading"
                    @click="register(userFormRef, studentFormRef, tutorFormRef)"
                >注册</el-button>
            </div>
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
        width: 30vw;
        min-width: 400px;
        .btnWrapper {
            display: flex;
            justify-content: center;
            .btn {
                min-width: 50%;
            }
        }
    }
}
</style>