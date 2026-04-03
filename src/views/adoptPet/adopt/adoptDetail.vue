<template>
    <div>
        <div class="page-title">
            领养详情
        </div>
        <div class="adopt-detail">
            <div class="adopt-detail-container">
                <el-row type="flex" justify="space-between">
                    <!-- <div class="pet-img">
                        <el-image :src="form.petImg" style="width: 200px;height: 200px;" fit="cover"></el-image>
                    </div> -->

                    <el-descriptions title="基础信息" :column="3" style="flex:1">
                        <el-descriptions-item label="申请ID">{{ form.applyId }}</el-descriptions-item>
                        <el-descriptions-item label="宠物品种">{{ form.varietyName }}</el-descriptions-item>
                        <el-descriptions-item label="宠物分类">
                            <el-tag size="mini"> {{ form.petTypeName }}</el-tag></el-descriptions-item>
                        <el-descriptions-item label="申请人">{{ form.realName }}</el-descriptions-item>
                        <el-descriptions-item label="处理人"> {{ form.createBy }}</el-descriptions-item>
                        <el-descriptions-item label="联系方式"> {{ form.phonenumber }}</el-descriptions-item>
                        <el-descriptions-item label="申请日期">{{ form.createTime }}</el-descriptions-item>
                        <el-descriptions-item label="当前状态">
                            <el-tag size="mini" v-if="form.reviewStatus == 0" type="warning">待审核</el-tag>
                            <el-tag size="mini" v-if="form.reviewStatus == 1" type="success">已通过</el-tag>
                            <el-tag size="mini" v-if="form.reviewStatus == 'AI审核' || form.reviewStatus == '人工审核'"
                                type="danger">{{ form.reviewStatus + '拒绝' }}</el-tag>
                            <el-tag size="mini" v-if="form.reviewStatus == 3" type="info">已取消</el-tag>
                        </el-descriptions-item>
                    </el-descriptions>

                </el-row>

                <el-divider></el-divider>
                <div style="margin: 30px; ">
                    <h3><i class="el-icon-s-operation" style="color: #409eff;"></i>领养流程跟踪</h3>
                </div>
                <el-timeline>
                    <el-timeline-item :timestamp="item.createTime" placement="top" type="primary"
                        v-for="(item, index) in reviewList" :key="index">
                        <el-card>
                            <h3>{{ item.processName }}</h3>
                            <!-- <p>系统AI自动审核申请人资质,评估结果:</p> -->
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
                <el-divider></el-divider>
                <el-row type="flex" justify="center" style="margin-top: 30px;">
                    <el-button @click="returnPage">返回</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import { petApplyDetail, petApplyReview } from '../../../api/petAdopt/petAdopt';


export default {
    name: "adoptDetail",
    data() {
        return {
            baseUrl: process.env.VUE_APP_BASE_API || '/',
            form: {
                applyId: undefined,//合同编号
                // petImg:undefined,
                varietyName: undefined,
                petTypeName: undefined,
                realName: undefined,
                createBy: undefined,
                phonenumber: undefined,
                createTime: undefined,
                reviewStatus: undefined,
                result: undefined,
            },
            reviewList: [],
        }
    },
    mounted() {
        const data = this.$route.params
        console.log(data);
        if (data.id) {
            this.getPetDetail(data.id)
            this.getApplyReview(data.id)
        }
    },
    computed: {
    },
    methods: {
        getPetDetail(id) {
            petApplyDetail(id).then(res => {
                console.log(res);
                this.$nextTick(() => {
                    this.form = JSON.parse(JSON.stringify(res.data))
                })
            })
        },
        getApplyReview(id) {
            petApplyReview(id).then(res => {
                console.log(res);
                this.reviewList = res.data
            })
        },
        //回到合同管理页面
        returnPage() {
            this.$router.push("/adopt")
        },
    }
}
</script>

<style lang="scss" scoped>
.adopt-detail {
    padding: 20px;
    box-sizing: border-box;

    .adopt-detail-container {
        padding: 20px;
        background-color: white;

        .el-descriptions {
            padding: 10px 70px;
            color: rgb(148, 148, 148);

        }

        .el-timeline {
            margin: 20px 100px 0 20px;
        }

    }
}
</style>