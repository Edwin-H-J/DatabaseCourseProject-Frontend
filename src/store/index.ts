import { reactive } from 'vue';
const store = {
    state:reactive({
        id:0,
        auth:'',
    }),
    setId(newID:number){
        this.state.id = newID
    },
    setAuth(newAuth:string){
        this.state.auth = newAuth
    }
}

export default store