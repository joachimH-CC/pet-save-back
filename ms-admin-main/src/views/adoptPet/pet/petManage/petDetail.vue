<template>
    <div>
        <div class="page-title">
            宠物详情
        </div>
        <div class="pet-detail">
            <div class="pet-detail-container">
                <el-row type="flex" justify="space-between">
                    <div class="pet-img">
                        <el-image :src="form.petPicture" style="width: 200px;height: 200px;" fit="cover"></el-image>
                    </div>

                    <el-descriptions title="基础信息" :column="3" style="flex:1">
                        <el-descriptions-item label="宠物ID">{{ form.petId }}</el-descriptions-item>
                        <el-descriptions-item label="宠物品种">{{ form.varietyName }}</el-descriptions-item>
                        <el-descriptions-item label="分类">
                            <el-tag size="mini"> {{ form.petTypeName }}</el-tag></el-descriptions-item>
                        <el-descriptions-item label="性别">
                            <div v-if="form.sex == 1">雄性</div>
                            <div v-else>雌性</div>
                        </el-descriptions-item>
                        <el-descriptions-item label="体重"> {{ form.weight }}kg</el-descriptions-item>
                        <el-descriptions-item label="救助日期">{{ form.rescueTime }}</el-descriptions-item>
                        <el-descriptions-item label="标签">
                            <el-tag size="mini" style="margin:0 5px;" v-for="(item, index) in form.personalityLabels"
                                :key="index">
                                {{ item }}</el-tag></el-descriptions-item>
                    </el-descriptions>

                </el-row>

                <el-divider></el-divider>
                <el-descriptions title="健康护理" :column="2">
                    <el-descriptions-item label="驱虫次数">{{ form.dewormNum }}</el-descriptions-item>
                    <el-descriptions-item label="疫苗次数">{{ form.vaccineNum }}</el-descriptions-item>
                    <el-descriptions-item label="绝育情况">
                        <div v-if="form.sterilizationStatus == 1">已绝育</div>
                        <div v-else>未绝育</div>
                    </el-descriptions-item>
                    <el-descriptions-item label="毛发颜色">{{ form.coatColor }}</el-descriptions-item>
                </el-descriptions>
                <el-divider></el-divider>
                <el-descriptions title="宠物描述" :column="1" :colon="false">
                    <el-descriptions-item>{{ form.description }}</el-descriptions-item>
                </el-descriptions>
                <el-divider></el-divider>
                <el-descriptions title="领养须知" :column="1" :colon="false">
                    <el-descriptions-item label="">{{ form.adoptionNotice }}</el-descriptions-item>

                </el-descriptions>
                <el-divider></el-divider>
                <el-descriptions title="救助故事" :column="1" :colon="false">
                    <el-descriptions-item label="">{{ form.rescueStory }}</el-descriptions-item>

                </el-descriptions>

                <el-divider></el-divider>
                <el-row type="flex" justify="center" style="margin-top: 30px;">
                    <el-button @click="returnPage">返回</el-button>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import { petDetail } from '../../../../api/petAdopt/pet';


export default {
    name: "PetDetail",
    data() {
        return {
            baseUrl: process.env.VUE_APP_BASE_API || '/',
            form: {
                petId: undefined,//合同编号
                petPicture: undefined,
                petTypeName: undefined,
                varietyName: undefined,
                sex: undefined,
                age: undefined,
                weight: undefined,
                createTime: undefined,//发布时间
                rescueTime: undefined,
                personalityLabels: undefined,
                description: undefined,
                vaccineNum: undefined,//疫苗
                dewormNum: undefined,//驱虫
                sterilizationStatus: undefined,//绝育情况
                coatColor: undefined,//毛发颜色
                rescueStory: undefined,
                adoptionNotice: undefined,
            }
        }
    },
    mounted() {
        const data = this.$route.params
        console.log(data);
        if (data.id) {
            this.getPetDetail(data.id)
        }
    },
    computed: {
    },
    methods: {
        getPetDetail(id) {
            petDetail(id).then(res => {
                console.log(res);
                this.$nextTick(() => {
                    this.form = JSON.parse(JSON.stringify(res.data))
                })
            })
        },
        //回到合同管理页面
        returnPage() {
            this.$router.push("/pet/petManage")
        },
    }
}
</script>

<style lang="scss" scoped>
.pet-detail {
    padding: 20px;
    box-sizing: border-box;

    .pet-detail-container {
        padding: 20px;
        background-color: white;

        .el-descriptions {
            padding: 10px 70px;
            color: rgb(148, 148, 148);

        }


    }
}
</style>