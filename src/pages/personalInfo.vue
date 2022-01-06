<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import store from '../store/index';
import type { ElForm } from 'element-plus';
import { ElMessage } from 'element-plus';
import api from '../requests/api';
import { useRoute,useRouter } from 'vue-router';

const userform = ref({
    Id: 0,
    Username: "",
    Password: "",
    Auth: "",
    Confirm: "",
})
const btnLoading = ref(false)
const userFormRef = ref<InstanceType<typeof ElForm>>()
const studentFormRef = ref<InstanceType<typeof ElForm>>()
const tutorFormRef = ref<InstanceType<typeof ElForm>>()
const modifyPasswordMode = ref(false)
const modifyinfoMode = ref(false)
const auth = ref("")
const self = ref(false)
const route = useRoute()
const router = useRouter()
const uid = ref(0)
async function load() {
    if (route.query["uid"] != undefined) {
    self.value = false
    uid.value = <any>route.query["uid"]
} else if(route.query["sid"] != undefined){
    self.value = false
    await api.LookupUserId(<any>route.query["sid"],undefined).then( res=>{
        if(res.data.code === 200){
            uid.value = res.data.id
        }else{
            ElMessage.error("访问非法")
            router.push("/index")
        }
    })
}
else if(route.query["tid"] != undefined){
    self.value = false
    await api.LookupUserId(undefined,<any>route.query["tid"]).then( res=>{
        if(res.data.code === 200){
            uid.value = res.data.id
        }else{
            ElMessage.error("访问非法")
            router.push("/index")
        }
    })
}
else {
    self.value = true
}
api.LookupPersonalInfo(uid.value).then(res => {
    if (res.data.code === 200) {
        userform.value = res.data.user
        auth.value = res.data.user.Auth
        if (auth.value === "student") {
            studentForm.value = res.data.info
        } else if (auth.value === "tutor" || auth.value === "manager") {
            tutorForm.value = res.data.info
            let date = <string>res.data.info.birthday
            date.replaceAll("-", "/")
            tutorForm.value.birthday = new Date(Date.parse(date.replaceAll("-", "/")))
        }
    }
})
    
}
onMounted(()=>{
    load()
})

const submit = () => {
    if (modifyinfoMode.value) {
        if (auth.value === "tutor" || auth.value === "manager") {
            tutorFormRef.value?.validate((vail) => {
                
                if (!vail) {
                    ElMessage.error("信息表未填写完成")
                    return;
                }
                btnLoading.value = true
                api.modifyTutorInfo({...tutorForm.value,birthday:tutorForm.value.birthday.toLocaleDateString().replaceAll("\\","-")}).then(res=>{
                    btnLoading.value = false
                    if(res.data.code === 200){
                        btnLoading.value = true
                        ElMessage.success("提交成功")
                        modifyinfoMode.value = false
                    }else{
                        ElMessage.error(res.data.msg)
                    }
                }).catch(err=>{
                    ElMessage.error("网络连接异常")
                    console.log(err)
                }).finally(()=>{
                    btnLoading.value = false
                })
            })
        } else if (auth.value === "student") {
            studentFormRef.value?.validate((vail) => {
                if (!vail) {
                    ElMessage.error("信息表未填写完成")
                    return;
                }
                btnLoading.value = true
                api.modifyStudentInfo(studentForm.value).then(res=>{
                    btnLoading.value = false
                    if(res.data.code === 200){
                        ElMessage.success("提交成功")
                        modifyinfoMode.value = false
                    }else{
                        ElMessage.error(res.data.msg)
                    }
                }).catch(err=>{
                    ElMessage.error("网络连接异常")
                    console.log(err)
                }).finally(()=>{
                    btnLoading.value = false
                })
            })
        }
    } else if (modifyPasswordMode.value) {
        console.log("mod")
        userFormRef.value?.validate((vail)=>{
            if (!vail) {
                    ElMessage.error("信息表未填写完成")
                    return;
                }
                btnLoading.value = true
                api.modifyPassword(userform.value.Id,userform.value.Password).then(res=>{
                    btnLoading.value = false
                    if(res.data.code === 200){
                        ElMessage.success("提交成功")
                        modifyPasswordMode.value = false
                    }else{
                        ElMessage.error(res.data.msg)
                    }
                }).catch(err=>{
                    ElMessage.error("网络连接异常")
                    console.log(err)
                }).finally(()=>{
                    btnLoading.value = false
                })
        })
    }


}


const studentForm = ref({
    id: "",
    name: "",
    sex: "",
    major: "",
    class: "",
    phoneNumber: "",
    Email: "",
    remark: "",
})
const tutorForm = ref({
    id: "",
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
    Password: [
        {
            required: true,
            message: "请输入密码",
            trigger: "blur",
        }
    ],
    Confirm: [
        {
            required: true,
            message: "请再次输入密码",
            trigger: "blur",
        },
        {
            validator(rule: any, value: any, callback: any) {
                if (value == "") {
                    callback(new Error('请再次输入密码'))
                } else if (value != userform.value.Password) {
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

</script>


<template>
    <el-card header="账户信息" style="margin-bottom: 2vh;">
        <el-form :model="userform" :rules="userFormRules" label-width="auto" ref="userFormRef">
            <el-row justify="space-around" style="width: 100%;">
                <el-col :span="4">
                    <el-form-item label="用户名" prop="Username">
                        <el-input v-model="userform.Username" :readonly="true"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="角色" prop="Auth">
                        <el-select v-model="userform.Auth" clearable :disabled="true">
                            <el-option :key="1" label="学生" value="student"></el-option>
                            <el-option :key="2" label="导师" value="tutor"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col v-if="modifyPasswordMode" :span="4">
                    <el-form-item label="密码" prop="Password">
                        <el-input type="password" v-model="userform.Password"></el-input>
                    </el-form-item>
                </el-col>
                <el-col v-if="modifyPasswordMode" :span="4">
                    <el-form-item label="确认密码" prop="Confirm">
                        <el-input type="password" v-model="userform.Confirm"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-card>
    <el-card header="个人信息" v-if="auth === 'student'">
        <el-form
            :model="studentForm"
            class="infoForm"
            label-position="top"
            :rules="studentFormRules"
            ref="studentFormRef"
        >
            <el-row justify="space-around" style="width: 100%;">
                <el-col :span="4">
                    <el-form-item label="姓名" prop="name" required>
                        <el-input v-model="studentForm.name" :readonly="!modifyinfoMode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="性别" prop="sex" required>
                        <el-select v-model="studentForm.sex" clearable :disabled="!modifyinfoMode">
                            <el-option :key="1" label="男" value="male"></el-option>
                            <el-option :key="2" label="女" value="female"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="专业" prop="major" required>
                        <el-input v-model="studentForm.major" :readonly="!modifyinfoMode"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row justify="space-around" style="width: 100%;">
                <el-col :span="4">
                    <el-form-item label="班级" prop="class" required>
                        <el-input v-model="studentForm.class" :readonly="!modifyinfoMode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="手机号" prop="phoneNumber" required>
                        <el-input v-model="studentForm.phoneNumber" :readonly="!modifyinfoMode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="邮箱" prop="Email" required>
                        <el-input v-model="studentForm.Email" :readonly="!modifyinfoMode"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row style="width: 100%;" justify="center">
                <el-col :span="20">
                    <el-form-item label="备注" prop="remark">
                        <el-input
                            type="textarea"
                            :row="2"
                            v-model="studentForm.remark"
                            :readonly="!modifyinfoMode"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-card>
    <el-card header="个人信息" v-if="auth === 'tutor' || auth === 'manager'">
        <el-form
            :model="tutorForm"
            class="infoForm"
            :rules="tutorFormRules"
            label-position="top"
            ref="tutorFormRef"
        >
            <el-row justify="space-around" style="width: 100%;">
                <el-col :span="4">
                    <el-form-item label="姓名" prop="name" required>
                        <el-input v-model="tutorForm.name" :readonly="!modifyinfoMode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="性别" prop="sex" required>
                        <el-select v-model="tutorForm.sex" clearable :disabled="!modifyinfoMode">
                            <el-option :key="1" label="男" value="male"></el-option>
                            <el-option :key="2" label="女" value="female"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row justify="space-around" style="width: 100%;">
                <el-col :span="4">
                    <el-form-item label="出生日期" prop="birthday" required>
                        <el-date-picker
                            v-model="tutorForm.birthday"
                            editable
                            :disabled="!modifyinfoMode"
                        ></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="教育背景" prop="EducationalBackground" required>
                        <el-input
                            v-model="tutorForm.EducationalBackground"
                            :readonly="!modifyinfoMode"
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row justify="space-around" style="width: 100%;">
                <el-col :span="4">
                    <el-form-item label="职称" prop="title" required>
                        <el-input v-model="tutorForm.title" :readonly="!modifyinfoMode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="研究方向" prop="ResearchDirection" required>
                        <el-input v-model="tutorForm.ResearchDirection" :readonly="!modifyinfoMode"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row justify="space-around" style="width: 100%;">
                <el-col :span="4">
                    <el-form-item label="手机号" prop="PhoneNumber">
                        <el-input v-model="tutorForm.PhoneNumber" :readonly="!modifyinfoMode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="邮箱" prop="Email" required>
                        <el-input v-model="tutorForm.Email" :readonly="!modifyinfoMode"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-card>
    <el-card v-if="self">
        <div class="btngrop" v-if="(!modifyinfoMode && !modifyPasswordMode)">
            <el-button @click="modifyPasswordMode = true">修改密码</el-button>
            <el-button @click="modifyinfoMode = true" v-if="store.state.auth != 'admin'">修改个人信息</el-button>
        </div>
        <div v-else class="btngrop">
            <el-button @click="submit()" :loading="btnLoading">提交</el-button>
        </div>
    </el-card>
</template>

<style>
.btngrop {
    display: flex;
    justify-content: space-around;
}
</style>