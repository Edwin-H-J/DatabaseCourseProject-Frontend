
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../requests/api';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
const router = useRouter()
const mySelect = ref({
    "Tid": 0,
    "Sid": 0,
    "TutorCheck": 0,
    "ManagerCheck": 0,
    "Published": 0,
    "ProcessId": 0,
    "Topic": null,
    "Student": null
})
onMounted(() => {
    api.getMySelected().then(res => {
        if (res.data.code === 200) {
            mySelect.value = res.data.data
            api.getTopicById(mySelect.value.Tid).then(res => {
                if (res.data.code === 200) {
                    tutorForm.value = res.data.data.Tutor
                    Topicform.value = res.data.data
                } else {
                    ElMessage.warning("选题详细信息获取错误")
                }
            })
        } else {
            ElMessage.warning("您尚未选题")
            router.push("/index")
        }
    }).catch(err => {
        console.log(err)
        ElMessage.error("网络错误")
        router.push("/index")
    })
})

const tutorForm = ref({
    "Id": 1,
    "Name": "",
    "Sex": "",
    "Birthday": "",
    "EducationalBackground": "",
    "Title": "",
    "ResearchDirection": "",
    "PhoneNumber": "",
    "Email": ""
})
const Topicform = ref({
    "Id": 0,
    "Name": "",
    "Type": "",
    "Source": "",
    "Profile": "",
    "MajorRequirement": "",
    "StudentRequirement": "",
    "Passed": 0,
    "Published": 1
})
const cancel = ()=>{
    api.cancelSelectTopic().then(res => {
        if (res.data.code === 200) {
            ElMessage.success(res.data.msg)
            router.push("/index")
        } else {
            ElMessage.error(res.data.msg)
        }
    }).catch(err => {
        ElMessage.error("网络异常")
        console.log(err)
    })
}
</script>

<template>
    <el-card header="题目状态">
        <el-row justify="space-around">
            <el-col :span="4">您的选题状态:</el-col>
            <el-col :span="4">
                导师审核:
                <el-tag type="warning" v-if="mySelect.TutorCheck == 0">未审核</el-tag>
                <el-tag type="success" v-else-if="mySelect.TutorCheck == 1">审核通过</el-tag>
                <el-tag type="danger" v-else-if="mySelect.TutorCheck == 2">审核不通过</el-tag>
            </el-col>
            <el-col :span="4">
                系主任审核:
                <el-tag type="warning" v-if="mySelect.ManagerCheck == 0">未审核</el-tag>
                <el-tag type="success" v-else-if="mySelect.ManagerCheck == 1">审核通过</el-tag>
                <el-tag type="danger" v-else-if="mySelect.ManagerCheck == 2">审核不通过</el-tag>
            </el-col>
            <el-col :span="4"><el-button type="danger" @click="cancel()">取消选题</el-button></el-col>
        </el-row>
    </el-card>
    <el-card header="论文题目">
        <el-form label-position="top" :model="Topicform" ref="formRef">
            <el-row :gutter="50">
                <el-col :span="9" :offset="3">
                    <el-form-item label="题目名称" prop="name">
                        <el-input v-model="Topicform.Name" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="题目类型" prop="type">
                        <el-input v-model="Topicform.Type" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="课题来源" prop="source">
                        <el-input v-model="Topicform.Source" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="9">
                    <el-form-item label="专业要求" prop="major_requirement">
                        <el-input v-model="Topicform.MajorRequirement" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="学生要求" prop="student_requirement">
                        <el-input v-model="Topicform.StudentRequirement" readonly></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="50">
                <el-col :span="18" :offset="3">
                    <el-form-item label="内容简介" prop="profile">
                        <el-input
                            type="textarea"
                            :autosize="{ maxRows: 20, minRows: 10 }"
                            v-model="Topicform.Profile"
                            readonly
                        ></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-card>
    <el-card header="导师信息">
        <el-form :model="tutorForm" class="infoForm" label-position="top" ref="tutorFormRef">
            <el-row justify="space-around" style="width: 100%;">
                <el-col :span="4">
                    <el-form-item label="姓名" prop="name">
                        <el-input v-model="tutorForm.Name" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="性别" prop="sex">
                        <el-select v-model="tutorForm.Sex" clearable disabled>
                            <el-option :key="1" label="男" value="male"></el-option>
                            <el-option :key="2" label="女" value="female"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row justify="space-around" style="width: 100%;">
                <el-col :span="4">
                    <el-form-item label="出生日期" prop="birthday">
                        <el-date-picker v-model="tutorForm.Birthday" disabled></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="教育背景" prop="EducationalBackground" required>
                        <el-input v-model="tutorForm.EducationalBackground" readonly></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row justify="space-around" style="width: 100%;">
                <el-col :span="4">
                    <el-form-item label="职称" prop="title">
                        <el-input v-model="tutorForm.Title" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="研究方向" prop="ResearchDirection" required>
                        <el-input v-model="tutorForm.ResearchDirection" readonly></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row justify="space-around" style="width: 100%;">
                <el-col :span="4">
                    <el-form-item label="手机号" prop="PhoneNumber">
                        <el-input v-model="tutorForm.PhoneNumber" readonly></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="邮箱" prop="Email" required>
                        <el-input v-model="tutorForm.Email" readonly></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </el-card>
</template>