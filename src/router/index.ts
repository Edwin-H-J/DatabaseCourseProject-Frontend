import login from "../pages/login.vue"
import register from '../pages/register.vue'
import personalInfo from '../pages/personalInfo.vue'
import index from '../pages/index.vue'
import base from '../pages/base.vue'
import createTopic from '../pages/topic/createTopic.vue'
import myTopic from '../pages/topic/myTopic.vue'
import topicManage from '../pages/topic/topicManage.vue'
import topicList from "../pages/topicSelect/topicList.vue"
import selectedTopic from "../pages/topicSelect/selectedTopic.vue"
import mySelectedTopic from "../pages/topicSelect/mySelectedTopic.vue"
import SelectedManage from "../pages/topicSelect/selectedManage.vue"
import process from "../pages/process.vue"
import userManage from "../pages/userManage.vue"
import modifyTopic from '../pages/topic/modifyTopic.vue'
const routes = [
    {
        path: "/",
        redirect:"/login",
        component:base,
        children:[
            {
                path:"/index",
                component:index
            },
            {
                path:"/personalInfo",
                component:personalInfo
            },
            {
                path:"/createTopic",
                component:createTopic
            },
            {
                path:"/myTopic",
                component:myTopic
            },
            {
                path:"/topicManage",
                component:topicManage
            },
            {
                path:"/topicList",
                component:topicList
            },
            {
                path:"/selectedTopic",
                component:selectedTopic
            },
            {
                path:"/mySelectedTopic",
                component:mySelectedTopic
            },
            {
                path:"/selectedManage",
                component:SelectedManage
            },
            {
                path:"/process",
                component:process
            },
            {
                path:"/userManage",
                component:userManage
            },
            {
                path:"/modifyTopic",
                component:modifyTopic
            }
        ]
    },
    {
        path: "/login",
        component:login
    },
    {
        path: "/register",
        component:register
    }
]

export default routes