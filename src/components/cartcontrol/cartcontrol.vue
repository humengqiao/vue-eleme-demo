<template>
	<div class="cartcontrol">
		<transition name="move">
			<div class="cart-decrease" v-show="foodCount>0" @click.stop.prevent="decreaseCart">
				<span class="inner icon-remove_circle_outline"></span>
			</div>
		</transition>	
		<div class="cart-count" v-show="foodCount>0">{{foodCount}}</div>
		<div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
	</div>
</template>

<script>
	import Vue from 'vue'; 

	export default {
		props:{
			food:{
				type:Object
			}
		},
		methods:{
			addCart(event){
				if(!event._constructed){
					return;
				}
				let {name,price,oldPrice,description,info,icon,image}=this.food;
				this.$store.commit('addCart',{
					name,
					price,
					oldPrice,
					description,
					info,
					icon,
					image
				});
				this.$root.eventHub.$emit('cart.add',event.target);
			},
			decreaseCart(event){
				if(!event._constructed){
					return;
				}
				let name=this.food.name;
				this.$store.commit('decreaseCart',{
					name
				});
			}
		},
		computed:{
			foodCount(){
				let selectFoods=this.$store.state.selectFoods;
				let count=0;
				selectFoods.forEach(food=>{
					if(food.name===this.food.name){
						count=food.count
					}
				});
				return count;
			}
		}
	}
</script>

<style lang="stylus" type="stylesheet/stylus">
	.cartcontrol
		font-size:0
		.cart-decrease
			display:inline-block
			padding:6px
			&.move-enter,&.move-leave-active
				opacity:0
				transform:translate3d(24px,0,0)
				.inner
					transform:rotate(180deg)
			&.move-enter-active,&.move-leave-active
				transition:all .4s linear			
			.inner
				display:inline-block
				line-height:24px
				font-size:24px
				color:rgb(0,160,220)
				transition:all .4s linear
				transform:rotate(0deg)	
		.cart-count
			display:inline-block
			vartical-align:top
			width:12px
			padding-top:6px
			line-height:24px
			text-align:center
			font-size:10px
			color:rgb(147,153,159)
		.cart-add
			display:inline-block
			padding:6px
			line-height:24px
			font-size:24px
			color:rgb(0,160,220)
			
</style>