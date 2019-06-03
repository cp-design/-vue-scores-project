<template>
    <div class="wrapper">
        <template v-if="layout =='left'">
            <header-bar v-once>
                <p slot="logo" style="float: left;">
                    <img src="~sysStatic/images/pamp2.png" alt="" style="height:30px;width:auto;vertical-align:middle;">
                </p>
                <p slot="logo">
                    <span style="font-size:12px;text-align:center;margin-left:50px;">成绩分析管理平台</span>
                </p>
            </header-bar>
            <nav-bar :layout="layout"></nav-bar>
            
        </template>
        <template v-if="layout == 'top'">
            <header-bar>
                <p slot="logo" style="float: left;">
                    <img src="~sysStatic/images/pamp2.png" alt="" style="height:30px;width:auto;vertical-align:middle;">
                </p>
                <p slot="logo">
                    <span style="font-size:12px;text-align:center;margin-left:50px;">成绩分析管理平台</span>
                </p>
                <template slot="topnav">
                    <nav-bar :layout="layout"></nav-bar>
                </template>
            </header-bar>
        </template>
        <div class="sys-content" :class="layout">
            <tag-nav></tag-nav>
            <keep-alive :include="tagNavList">
                <router-view></router-view>
            </keep-alive>
        </div>
    </div>
</template>

<script>
import HeaderBar from './HeaderBar'
import NavBar from './NavBar'
import TagNav from './TagNav'

export default {
    computed: {
        layout(){
            return this.$store.state.navbarPosition
        },
        tagNavList(){
            return this.$store.state.tagNav.cachedPageName
        }
    },
    components:{
        HeaderBar,
        NavBar,
        TagNav
    }
}
</script>