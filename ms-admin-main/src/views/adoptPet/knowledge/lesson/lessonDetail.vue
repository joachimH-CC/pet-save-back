<template>
    <div>
        <div class="page-title">
            课程详情
        </div>
        <div class="lesson-detail">
            <div class="lesson-detail-container">
                <el-descriptions title="基础信息" :column="1">
                    <el-descriptions-item label="课程ID">{{ form.knowledgeId }}</el-descriptions-item>
                    <el-descriptions-item label="课程类型">
                        <el-tag size="mini">{{ getClassTypeLabel(form.knowledgeType) }}</el-tag>
                    </el-descriptions-item>
                    <!-- <el-descriptions-item label="发布时间">{{ form.createdTime }}</el-descriptions-item> -->
                    <el-descriptions-item label="课程标题">{{ form.title }}</el-descriptions-item>
                    <el-descriptions-item label="课程介绍">{{ form.content }}</el-descriptions-item>
                </el-descriptions>
                <el-divider></el-divider>
                <div class="lesson-content">
                    <video :src="form.classVideo" controls width="640" height="360"></video>
                </div>

                <el-divider></el-divider>
                <el-row type="flex" justify="center" style="margin-top: 30px;">
                    <el-button @click="returnPage">返回</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import { detailLesson } from '../../../../api/petAdopt/lesson';


export default {
    name: "lessonDetail",
    dicts: ["pet_class_type"],
    data() {
        return {
            baseUrl: process.env.VUE_APP_BASE_API || '/',
            form: {
                adoptId: 1001,//合同编号
                lessontype: '科普文章',
                createdTime: "2020-10-12",
                author: undefined,
                title: "这是标题"

            }
        }
    },
    watch: {
        // 监听路由变化
        $route(to, from) {
            const data = to.params;
            console.log(data);
            if (data.id) {
                this.getLessonDtl(data.id);
            }
        }
    },
    mounted() {
        const data = this.$route.params
        console.log(data);
        if (data.id) {
            this.getLessonDtl(data.id)
        }
    },
    computed: {
    },
    methods: {
        getLessonDtl(id) {
            detailLesson(id).then(res => {
                console.log(res);
                this.$nextTick(() => {
                    this.form = { ...res.data }
                })

            })
        },
        getClassTypeLabel(value) {
            const type = this.dict.type.pet_class_type.find(item => item.value === value);
            return type ? type.label : '';
        },
        //回到合同管理页面
        returnPage() {
            this.$router.push("/knowledge/lesson");
        },
    }
}
</script>

<style lang="scss" scoped>
.lesson-detail {
    padding: 20px;
    box-sizing: border-box;

    .lesson-detail-container {
        padding: 20px;
        background-color: white;

        .el-descriptions {
            padding: 10px 70px;
            color: rgb(148, 148, 148);

        }

        .lesson-content {
            padding: 10px 70px;

            video {
                border-radius: 10px;
            }
        }

    }
}
</style>