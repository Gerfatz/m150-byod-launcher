<template>
    <v-app>
<!--        <v-app-bar app-->
<!--                   color="primary"-->
<!--                   dark-->
<!--        >-->
<!--            <v-toolbar-title>BYOD Launcher</v-toolbar-title>-->

<!--        </v-app-bar>-->

        <v-content>
            <v-container>
                <router-view/>
            </v-container>
        </v-content>

    </v-app>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Component from "vue-class-component";

    @Component
    export default class App extends Vue {
        
    }
</script>

<style lang="scss">

    .v-application p.overline {
        margin-bottom: 0;
    }
    
    .editable-content {
        cursor: pointer;
        
        .v-icon.v-icon {
            vertical-align: middle;
        }
    }
</style>