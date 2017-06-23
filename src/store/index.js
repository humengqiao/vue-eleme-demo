import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const state={
	selectFoods:[]
}

const store=new Vuex.Store({
	state,
	mutations:{
		addCart(state,data){
			let index=-1;
			let selectFoods=state.selectFoods;
			for(let i=0;i<selectFoods.length;i++){
				if(data.name===selectFoods[i].name){
					index=i;
					break;
				}
			}
			if(index!==-1){
				state.selectFoods[index].count++;
				console.log(state.selectFoods[index].count);
			}else{
				Object.assign(data,data,{count:1});
				state.selectFoods.push(data);
			}
		},
		decreaseCart(state,data){
			let index=-1;
			let selectFoods=state.selectFoods;
			for(let i=0;i<selectFoods.length;i++){
				if(data.name===selectFoods[i].name){
					index=i;
					break;
				}
			}
			if(index!==-1){
				if(state.selectFoods[index].count===1){
					state.selectFoods.splice(index,1);
				}else{
					state.selectFoods[index].count--;
				}
			}
		},
		emptySelectFoods(state){
			state.selectFoods=[];
		}
	}
});

export default store;