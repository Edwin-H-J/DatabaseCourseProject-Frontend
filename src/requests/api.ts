import { axios } from "./http";
import qs from "qs"
interface tutorInfo {
    name:string
    sex:string
    birthday:string
    EducationalBackground:string
    title:string
    ResearchDirection:string
    PhoneNumber:string
    Email:string
}
interface studentInfo {
    name:string
    sex:string
    major:string
    class:string
    phoneNumber:string
    Email:string
    remark:string
}
interface registerInfo{
    username:string
    password:string
    auth:string
}
interface TopicInfo{                 
	name:string
	type:string
	source:string              
	profile:string
	major_requirement:string 
	student_requirement:string 
}
const api = {
    login(username:string,password:string){
        return axios.post("/login",qs.stringify({username,password}),{headers:{'content-type': 'application/x-www-form-urlencoded'}})
    },
    register(registerInfo:registerInfo,pInfo:tutorInfo|studentInfo){
        return axios.post("/register",qs.stringify({...registerInfo,...pInfo}),{headers:{'content-type': 'application/x-www-form-urlencoded'}})
    },
    checkLogin(){
        return axios.get("/checkLogin")
    },
    logout(){
        return axios.get("/logout")
    },
    getTopicById(tid:number){
        return axios.get(`/getTopic?tid=${tid}`)
    },
    createTopic(topicInfo:TopicInfo){
        return axios.post("/Topic",qs.stringify({...topicInfo}),{headers:{'content-type': 'application/x-www-form-urlencoded'}})
    },
    getMyTopic(){
        return axios.get("/myTopicList")
    },
    getAllTopic(){
        return axios.get("/AllTopic")
    },
    getPublishedTopic(){
        return axios.get("/Topic")
    },
    setTopicPublishedStatus(id:number,status:number){
        return axios.post("/setTopicPublishedStatus",qs.stringify({id,status}),{headers:{'content-type': 'application/x-www-form-urlencoded'}})
    },
    setTopicPassedStatus(id:number,status:number){
        return axios.post("/setTopicPassedStatus",qs.stringify({id,status}),{headers:{'content-type': 'application/x-www-form-urlencoded'}})
    },
    selectTopic(tid:number){
        return axios.post("/selectTopicHandler",qs.stringify({tid}),{headers:{'content-type': 'application/x-www-form-urlencoded'}})
    },
    cancelSelectTopic(){
        return axios.post("/cancelSelectTopicHandler")
    },
    getMySelected(){
        return axios.get("/getMySelected")
    },
    getTutorConfirmSelected(){
        return axios.get("/GetTutorConfirmSelected")
    },
    getAllTutorConfirmSelected(){
        return axios.get("/GetAllTutorConfirmSelected")
    },
    tutorConfirm(tid:number,sid:number,status:number){
        return axios.post("/tutorConfirm",qs.stringify({tid,sid,status}),{headers:{'content-type': 'application/x-www-form-urlencoded'}})
    },
    managerConfirm(tid:number,sid:number,status:number){
        return axios.post("/managerConfirm",qs.stringify({tid,sid,status}),{headers:{'content-type': 'application/x-www-form-urlencoded'}})
    },
    publishSelected(tid:number,sid:number){
        return axios.post("/publishSelected",qs.stringify({tid,sid}),{headers:{'content-type': 'application/x-www-form-urlencoded'}})
    },
    getMyProcess(){
        return axios.get("/GetMyProcess")
    },
    getProcess(pid:number){
        return axios.get(`/GetProcess?pid=${pid}`)
    },
    TutorSetProcessProp(pid:number,status:number,prop:string,detail:string){
        return axios.post("/TutorSetProcessProp",qs.stringify({pid,status,prop,detail}),{headers:{'content-type': 'application/x-www-form-urlencoded'}})
    },
    StudentSetProcessProp(pid:number,status:number,prop:string,detail:string){
        return axios.post("/StudentSetProcessProp",qs.stringify({pid,status,prop,detail}),{headers:{'content-type': 'application/x-www-form-urlencoded'}})
    },
    SetProcessStatus(pid:number,status:number){
        return axios.post("/SetProcessStatus",qs.stringify({pid,status}),{headers:{'content-type': 'application/x-www-form-urlencoded'}})
    },
    LookupBaseInfo(){
        return axios.get("/LookupBaseInfo")
    },
    LookupPersonalInfo(uid:number|undefined){
        if(uid&&uid!=0){
            return axios.get("/LookUpPersonalInfo?uid="+uid)
        }else{
            return axios.get("/LookUpPersonalInfo")
        }
    },
    modifyStudentInfo(pInfo:any){
        return axios.post("/modifyStudentInfo",qs.stringify({...pInfo}),{headers:{'content-type': 'application/x-www-form-urlencoded'}})
    },
    modifyTutorInfo(pInfo:any){
        return axios.post("/modifyTutorInfo",qs.stringify({...pInfo}),{headers:{'content-type': 'application/x-www-form-urlencoded'}})
    },
    modifyPassword(uid:number,password:string){
        return axios.post("/ModifyPassword",qs.stringify({uid,password}),{headers:{'content-type': 'application/x-www-form-urlencoded'}})
    },
    GetUserList(){
        return axios.get("/GetUserList")
    },
    SetUserStatus(uid:number,status:number){
        return axios.post("/SetUserStatus",qs.stringify({uid,status}),{headers:{'content-type': 'application/x-www-form-urlencoded'}})
    },
    ModifyTopicHandler(tid:number,topicInfo:TopicInfo){
        return axios.post("/ModifyTopicHandler",qs.stringify({tid,...topicInfo}),{headers:{'content-type': 'application/x-www-form-urlencoded'}})
    },
    Backup(){
        return axios.get("/Backup",{responseType:"blob"})
    },
    SetUserAuth(uid:number,status:number){
        return axios.post("/SetTutorAuth",qs.stringify({uid,status}),{headers:{'content-type': 'application/x-www-form-urlencoded'}})
    },
    LookupUserId(sid?:number,tid?:number){
        if(sid){
            return axios.get("/LookupUserId?sid="+sid)
        }else{
            return axios.get("/LookupUserId?tid="+tid)
        }
    }
}

export default api 