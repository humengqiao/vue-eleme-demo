<template>
	<div>
		<div class="shopcart">
			<div class="content" @click="toggleList">
				<div class="content-left">
					<div class="logo-wrapper">
						<div class="logo" :class="{'highlight':totalCount>0}">
							<i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
						</div>
						<div class="num" v-show="totalCount>0">{{totalCount}}</div>
					</div>
					<div class="price" :class="{'highlight':totalPrice>0}">¥ {{totalPrice}}</div>
					<div class="desc">另需配送费¥{{deliveryPrice}}元</div>
				</div>
				<div class="content-right" @click.stop.prevent="pay">
					<div class="pay" :class="payClass">{{payDesc}}</div>
				</div>
			</div>
			<div class="ball-container">
				<transition-group name="drop" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
					<div v-for="ball in balls" v-show="ball.show" class="ball" :key="ball">
						<div class="inner"></div>
					</div>
				</transition-group>
			</div>
			<transition name="fold"> 
				<div class="shopcart-list" v-show="listShow">
					<div class="list-header">
						<h1 class="title">购物车</h1>
						<span class="empty" @click="empty">清空</span>
					</div>
					<div class="list-content" ref="listContent">
						<ul>
							<li class="food" v-for="food in selectFoods">
								<span class="name">{{food.name}}</span>
								<div class="price">
									<span>¥{{food.price*food.count}}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<cartcontrol :food="food"></cartcontrol>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</transition>
		</div>
		<transition name="fade">
			<div class="list-mask" v-show="listShow" @click="hideList"></div>
		</transition>
	</div>
</template>

<script>
	import BScroll from 'better-scroll';
	import cartcontrol from '@/components/cartcontrol/cartcontrol';

	export default {
		props:{
			deliveryPrice:{
				type:Number,
				default:0
			},
			minPrice:{
				type:Number,
				default:0
			}
		},
		components:{
			cartcontrol
		},
		data(){
			return {
				balls:[
					{
						show:false
					},
					{
						show:false
					},
					{
						show:false
					},
					{
						show:false
					},
					{
						show:false
					}
				],
				dropBall:[],
				fold:true
			}
		},
		computed:{
				selectFoods(){
					return this.$store.state.selectFoods;
				},
				totalPrice(){
					let total=0;
					this.selectFoods.forEach(food=>{
						total+=food.price*food.count;
					});
					return total;
				},
				totalCount(){
					let count=0;
					this.selectFoods.forEach(food=>{
						if(food.count>0){
							count+=food.count;
						}
					});
					return count;
				},
				payDesc(){
					if(this.totalPrice===0){
						return `¥${this.minPrice}元起送`;
					}else if(this.totalPrice<this.minPrice){
						return `还差${this.minPrice-this.totalPrice}元起送`;
					}else{
						return '去结算';
					}
				},
				payClass(){
					if(this.totalPrice<this.minPrice){
						return 'not-enough';
					}else{
						return 'enough';
					}
				},
				listShow(){
					if(!this.totalCount){
						this.fold=true;
						return false;
					}
					let show=!this.fold;
					if(show){
						if(!this.scroll){
							this.$nextTick(()=>{
								this.scroll=new BScroll(this.$refs.listContent,{
									click:true
								});
							});
						}else{
							this.scroll.refresh();
						}
					}
					return show;
				}
		},
		methods:{
			drop(el){
				for(let i=0;i<this.balls.length;i++){
					let ball=this.balls[i];
					if(!ball.show){
						ball.show=true;
						ball.el=el;
						this.dropBall.push(ball);
						return;
					}
				}
			},
			beforeEnter(el){
				let count=this.balls.length;
				while(count--){
					let ball=this.balls[count];
					if(ball.show){
						let rect=ball.el.getBoundingClientRect();
						let x=rect.left-32;
						let y=-(window.innerHeight-rect.top-22);
						el.style.display='';
						el.style.transform=`translate3d(0,${y}px,0)`;
						let inner=el.getElementsByClassName('inner')[0];
						inner.style.transform=`translate3d(${x}px,0,0)`;
					}
				}
			},
			enter(el){
				let rf=el.offsetHeight;
				this.$nextTick(()=>{
					el.style.display='';
					el.style.transform='translate3d(0,0,0)';
					let inner=el.getElementsByClassName('inner')[0];
					inner.style.transform='translate3d(0,0,0)';
				});
			},
			afterEnter(el){
				let ball=this.dropBall.shift();
				if(ball){
					ball.show=false;
					el.style.display='none';
				}
			},
			toggleList(){
				if(!this.totalCount){
					return;
				}
				this.fold=!this.fold;
			},
			empty(){
				this.$store.commit('emptySelectFoods');
			},
			hideList(){
				this.fold=true;
			},
			pay(){
				if(this.totalPrice<this.minPrice){
					return;
				}
				alert(`你确定需要支付${this.totalPrice}吗？`);
			}	
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
	@import '../../common/stylus/mixin';

	.shopcart
		position:fixed
		bottom:0
		left:0
		z-index:50
		width:100%
		height:48px
		.content
			display:flex
			background-color:#141d27
			font-size:0
			color:rgba(255,255,255,0.4)
			.content-left
				flex:1
				.logo-wrapper
					display:inline-block
					vertical-align:top
					position:relative
					top:-10px
					margin:0 18px
					padding:6px
					width:56px
					height:56px
					box-sizing:border-box
					border-radius:50%
					background-color:#141d27
					.logo
						width:100%
						height:100%
						border-radius:50%
						text-align:center
						background-color:#2b343c
						&.highlight
							background:rgb(0,160,220)
						.icon-shopping_cart
							line-height:44px
							font-size:24px
							color:#80858a
							&.highlight
								color:#fff
					.num
						position:absolute
						top:0
						right:0
						width:24px
						height:16px
						line-height:16px
						text-align:center
						border-radius:16px
						font-size:9px
						font-weight:700
						color:#fff
						background-color:rgb(240,20,20)
						box-shadow:0 4px 8px 0 rgba(0,0,0,0.4)
				.price
					display:inline-block
					margin-top:12px
					vertical-align:top
					box-sizing:border-box
					line-height:24px
					padding-right:12px
					border-right:1px solid rgba(255,255,255,0.1)
					font-size:16px
					font-weight:700
					&.highlight
						color:#fff
				.desc
					display:inline-block
					vertical-align:top
					margin:12px 0 0 12px
					line-height:24px
					font-size:10px	
			.content-right
				flex:0 0 105px
				width:105px
				.pay
					height:48px
					line-height:48px
					text-align:center
					font-size:12px
					font-weight:700
					background-color:#2b333b
					&.not-enough
						background-color:#2b333b
					&.enough
						background-color:#00b43c
						color:#fff
		.ball-container
			.ball
				position:fixed
				left:32px
				bottom:22px
				z-index:200
				&.drop-enter-active
					transition:all .4s cubic-bezier(.22,-0.49,.83,.67)
					.inner
						width:16px
						height:16px
						border-radius:50%
						background-color:rgb(0,160,220)
						transition:all .4s
		.shopcart-list
			position:absolute
			left:0
			top:0
			z-index:-1
			width:100%
			transform:translate3d(0,-100%,0)
			&.fold-enter-active,&.fold-leave-active
				transition:all .5s
			&.fold-enter
				transform:translate3d(0,0,0)	
			&.fold-leave-active
				transform:translate3d(0,100%,0)
			.list-header
				height:40px
				line-height:40px
				padding:0 18px
				background-color:#f3f5f7
				border-bottom:1px solid rgba(7,17,27,0.1)		
				.title
					float:left
					font-size:14px
					color:rgb(7,17,27)
				.empty
					float:right
					font-size:12px
					color:rgb(0,160,220)
			.list-content
				padding:0 18px
				max-height:180px
				overflow:hidden
				background-color:#fff
				.food
					position:relative
					padding:12px 0
					box-sizing:border-box
					border-1px(rgba(7,17,27,0.1))
					.name
						line-height:24px
						font-size:14px
						color:rgb(7,17,27)		
					.price
						position:absolute
						right:90px
						bottom:12px
						line-height:24px
						font-size:14px
						font-weight:700
						color:rgb(240,20,20)
					.cartcontrol-wrapper
						position:absolute
						right:0
						bottom:6px
	.list-mask
		position:fixed
		left:0
		top:0
		width:100%
		height:100%
		z-index:40
		backdrop-filter:blur(10px)
		background-color:rgba(7,17,27,0.6)				
		&.fade-enter-active,&.fade-leave-active
			transition:all .5s
		&.fade-enter,&.fade-leave-active
			opacity:0		
		&.fade-enter
			background-color:rgb(7,17,27)
</style>			