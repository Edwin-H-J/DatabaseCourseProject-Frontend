

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter, useRoute,onBeforeRouteUpdate } from 'vue-router';
import store from '../store';
import api from '../requests/api';
import { ElMessage } from 'element-plus';
const info = ref(store.state)
const route = useRoute()
const router = useRouter()
await load()
async function load() {
    if (info.value.id === 0) {
        await api.checkLogin().then(res => {
            if (res.data.code === 404) {
                ElMessage.error(res.data.msg)
                router.push("/login")
            }else if (res.data.code === 200){
                store.setAuth(res.data.info.auth)
                store.setId(res.data.info.id)
            }
        })
    }
}
onMounted( () => {
    console.log(info.value)
})
const logout = ()=>{
    api.logout().then((res)=>{
        ElMessage.success("登出成功")
    }).catch(err=>{
        ElMessage.error("登出操作异常")
    }).finally(()=>{
        router.push("/login")
    })
}
const loading = ref(false)
const backup = ()=>{
      loading.value = true
      api.Backup().then((res) => {
        loading.value = false
        console.log(res)
        const content = res.data
        const blob = new Blob([content])
        const fileName = 'backup.sql'
        if ('download' in document.createElement('a')) {
          const link = document.createElement('a')
          link.download = fileName 
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          document.body.appendChild(link)
          link.click() 
          URL.revokeObjectURL(link.href) 
          document.body.removeChild(link) 
        }
      }).catch((error) => {
        console.log(error)
        loading.value = false
      })

}
</script>

<template>
    <el-container id="container">
        <!-- <el-header></el-header> -->
        <el-container>
            <el-aside class="aside">
                <el-menu router unique-opened default-active="/index" class="menu">
                    <el-menu-item index="/index">首页</el-menu-item>
                    <el-sub-menu
                        index="/topicManage"
                        v-if="info.auth === 'manager' || info.auth == 'tutor'"
                    >
                        <template #title>题目管理</template>
                        <el-menu-item-group>
                            <el-menu-item index="/createTopic">论文题目申报</el-menu-item>
                            <el-menu-item index="/myTopic">我的论文题目</el-menu-item>
                            <el-menu-item v-if="info.auth === 'manager'" index="/topicManage">论文题目认可</el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>
                    <el-sub-menu
                        index="/selectedManage"
                        v-if="info.auth !== 'admin'"
                    >
                        <template #title>论文选题</template>
                        <el-menu-item-group>
                            <el-menu-item index="/selectedTopic" v-if="info.auth === 'manager' || info.auth == 'tutor'" >选题情况</el-menu-item>
                            <el-menu-item v-if="info.auth === 'manager'" index="/selectedManage">选题认可</el-menu-item>
                            <el-menu-item index="/topicList" v-if="info.auth === 'student'">论文题目列表</el-menu-item>
                            <el-menu-item index="/mySelectedTopic" v-if="info.auth === 'student'">我的选题</el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>
                    <el-menu-item index="/process" v-if="info.auth === 'student'">
                        毕业设计进程
                    </el-menu-item>
                    <el-menu-item index="/userManage" v-if="info.auth === 'admin'">用户管理</el-menu-item>
                    <el-menu-item index="/personalInfo">个人信息</el-menu-item>
                    <div class="logout" style="margin-top: 1vh;">
                        <el-button type="danger" @click="logout()">退出登录</el-button>
                    </div>
                    <div class="logout" v-if="info.auth === 'admin'" style="margin-top: 1vh;">
                        <el-button type="danger" @click="backup()" :loading="loading">备份数据库</el-button>
                    </div>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
    
</template>

<style lang="scss">
#container {
    min-height: 100vh;
    display: flex;
    .aside {
        max-width: 200px;
        .menu {
            height: 100%;
            .menu-item {
                width: 100%;
                text-align: center;
            }
            .logout{
                justify-content: center;
                text-align: center;
            }
        }
    }
}
</style>