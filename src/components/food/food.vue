<template>
	<transition name="move">
		<div v-show="showFlag" class="food" ref="food">
			<div class="food-content">
				<div class="image-header">
					<img :src="food.image">
					<div class="back" @click="hide">
						<i class="icon-arrow_lift"></i>
					</div>
				</div>
				<div class="content">
					<h1 class="title">{{food.name}}</h1>
					<div class="detail">
						<span class="sell-count">月售{{food.sellCount}}份</span>
						<span class="rating">好评率{{food.rating}}%</span>
					</div>
					<div class="price">
						<span class="now">¥{{food.price}}</span><span v-if="food.oldPrice" class="old">¥{{food.oldPrice}}</span>
					</div>
					<div class="cartcontrol-wrapper">
						<cartcontrol :food="food"></cartcontrol>
					</div>
					<transition name="fade">
						<div @click.stop.prevent="addFirst($event)" v-show="foodCount===0" class="buy">加入购物车</div>
					</transition>
				</div>
				<split v-if="food.info"></split>
				<div class="info" v-if="food.info">
					<h1 class="title">商品信息</h1>
					<p class="text">{{food.info}}</p>
				</div>
				<split></split>
				<div class="rating">
					<h1 class="title">商品评价</h1>
					<ratingselect :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
					<div class="rating-wrapper">
						<ul v-if="food.ratings&&food.ratings.length">
							<li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
								<div class="user">
									<span class="name">{{rating.username}}</span>
									<img :src="rating.avatar" class="avatar" width="12" height="12">
								</div>
								<div class="time">{{rating.rateTime | formatDate}}</div>
								<p class="text">
									<span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
								</p>
							</li>
						</ul>
						<div class="no-rating" v-else>暂无评价</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	import cartcontrol from '@/components/cartcontrol/cartcontrol';
	import split from '@/components/split/split';
	import ratingselect from '@/components/ratingselect/ratingselect';
	import BScroll from 'better-scroll';
	import {formatDate} from '@/common/js/date.js';

	const POSITIVE=0;
	const NEGATIVE=1;
	const ALL=2;

	export default {
		props:{
			food:{
				type:Object
			}
		},
		data(){
			return {
				showFlag:false,
				selectType:ALL,
				onlyContent:false,
				desc:{
					all:'全部',
					positive:'推荐',
					negative:'吐槽'
				}
			}
		},
		mounted(){
			this.$root.eventHub.$on('ratingtype.select',(type)=>{
				this.selectType=type;
				this.$nextTick(()=>{
					this.scroll.refresh();
				});
			});
			this.$root.eventHub.$on('content.toggle',(onlyContent)=>{
				this.onlyContent=onlyContent;
				this.$nextTick(()=>{
					this.scroll.refresh();
				});
			})
		},
		components:{
			cartcontrol,
			split,
			ratingselect
		},
		methods:{
			show(){
				this.showFlag=true;
				this.selectType=ALL;
				this.onlyContent=false;
				this.$nextTick(()=>{
					if(!this.scroll){
						this.scroll=new BScroll(this.$refs.food,{
							click:true
						});
					}else{
						this.scroll.refresh();
					}
				});
			},
			hide(){
				this.showFlag=false;
			},
			addFirst(event){
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
			needShow(rateType,text){
				if(this.onlyContent&&!text){
					return false;
				}
				if(this.selectType===ALL){
					return true;
				}else{
					return rateType===this.selectType;
				}
			}
		},
		computed:{
			foodCount(){
				let selectFood=this.$store.state.selectFoods;
				let index=-1;
				for(let i=0;i<selectFood.length;i++){
					if(this.food.name===selectFood[i].name){
						index=i;
						break;
					}
				}
				if(index!==-1){
					return selectFood[index].count;
				}
				return 0;
			}
		},
		filters:{
			formatDate(timestamp){
				let date=new Date(timestamp);
				return formatDate(date,'yyyy-MM-dd hh:mm');
			}
		}
	}
</script>

<style lang="stylus" type="text/stylus">
	@import '../../common/stylus/mixin';
	
	.food
		position:fixed
		left:0
		top:0
		bottom:48px
		z-index:30
		width:100%
		background-color:#fff
		&.move-enter-active,&.move-leave-active
			transition:all .2s linear
		&.move-enter,&.move-leave-active
			transform:translate3d(100%,0,0)
		.image-header
			position:relative
			width:100%
			height:0
			padding-top:100%
			img
				position:absolute
				top:0
				left:0
				width:100%
				height:100%
			.back
				position:absolute
				top:10px
				left:0
				.icon-arrow_lift
					display:block
					padding:10px
					font-size:20px
					color:#fff
		.content
			position:relative
			padding:18px
			.title
				line-height:14px
				margin-bottom:8px
				font-size:14px
				font-weight:700
				color:rgb(7,17,27)
			.detail
				margin-bottom:18px
				line-height:10px
				height:10px
				font-size:0
				.sell-count,.rating
					font-size:10px
					color:rgb(147,153,159)
				.sell-count
					margin-right:12px
			.price
				font-weight:700
				line-height:24px		
				.now
					margin-right:8px
					font-size:14px
					color:rgb(240,20,20)
				.old
					text-decoration:line-through
					font-size:10px
					color:rgb(147,153,159)
			.cartcontrol-wrapper
				position:absolute
				right:12px
				bottom:12px
			.buy
				position:absolute
				right:18px
				bottom:18px
				z-index:10
				height:24px
				line-height:24px
				padding:0 12px
				box-sizing:border-box
				font-size:10px
				border-radius:12px
				color:#fff
				background-color:rgb(0,160,220)
				&.fade-enter-active,&.fade-leave-active
					transition:all .2s
				&.fade-enter,&.fade-leave-active
					opacity:0						
		.info
			padding:18px
			.title
				line-height:14px
				margin-bottom:6px
				font-size:14px
				color:rgb(7,17,27)
			.text
				line-height:24px
				padding:0 8px
				font-size:12px
				color:rgb(77,85,93)
		.rating
			padding-top:18px
			.title
				line-height:14px
				margin-left:18px
				font-size:14px
				color:rgb(7,17,27)
			.rating-wrapper
				padding:0 18px
				.rating-item
					position:relative
					padding:16px 0
					border-1px(rgba(7,17,27,0.1))
					.user
						position:absolute
						right:0
						top:16px
						line-height:12px
						font-size:0
						.name
							display:inline-block
							margin-right:6px
							vertical-align:top
							font-size:10px
							color:rgb(147,153,159)
						.avatar
							border-radius:50%
					.time
						margin-bottom:6px
						line-height:12px
						font-size:10px
						color:rgb(147,153,159)
					.text
						line-height:16px
						font-size:12px
						color:rgb(7,17,27)
						.icon-thumb_up,.icon-thumb_down
							margin-right:4px
							line-height:16px
							font-size:12px
						.icon-thumb_up
							color:rgb(0,160,220)
						.icon-thumb_down
							color:rgb(147,153,159)
				.no-rating
					padding:16px 0
					font-size:12px
					color:rgb(147,153,159)			
</style>