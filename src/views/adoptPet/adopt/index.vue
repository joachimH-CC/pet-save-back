<template>
    <div>
        <div class="page-title">
            领养管理
        </div>
        <div class="adopt">
            <div class="adopt-container">
                <el-form label-width="70px" ref="queryFormRef" :model="queryForm" inline>
                    <el-form-item label="申请人" prop="realName">
                        <el-input size="mini" placeholder="请输入申请人名称" v-model="queryForm.realName"></el-input>
                    </el-form-item>
                    <el-form-item label="宠物品种" prop="varietyName">
                        <el-select v-model="queryForm.varietyName" placeholder="请选择" size="mini">
                            <el-option v-for="item in petVarietyList" :key="item.value" :label="item.label"
                                :value="item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="申请状态" prop="reviewStatus">
                        <el-select v-model="queryForm.reviewStatus" placeholder="请选择" size="mini">
                            <el-option v-for="item in dict.type.pet_apply_status" :key="item.value + item.label"
                                :label="(item.label === 'AI审核' || item.label === '人工审核') ? (item.label + '拒绝') : item.label"
                                :value="item.value + item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="mini" type="primary" @click="handleQuery">查询</el-button>
                        <el-button size="mini" @click="resetForm('queryForm'), getAdoptList()">重置</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="adoptList" style="width: 100%;" border>
                    <el-table-column prop="applyId" label="申请ID" align="center" width="100"></el-table-column>
                    <el-table-column prop="varietyName" label="宠物品种" align="center">
                        <template #default="{ row }">
                            <div>{{ row.varietyName + "(" + row.petId + ")" }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="realName" label="申请人" align="center"></el-table-column>
                    <el-table-column prop="createBy" label="处理人电话" align="center"></el-table-column>
                    <el-table-column prop="createTime" label="注册时间" align="center"
                        show-overflow-tooltip></el-table-column>
                    <el-table-column prop="reviewStatus" label="申请状态" align="center">
                        <template #default="{ row }">
                            <el-tag v-if="row.reviewStatus == 0" type="primary">待审核</el-tag>
                            <el-tag v-if="row.reviewStatus == 1" type="success">已通过</el-tag>
                            <el-tag size="mini" v-if="row.reviewStatus == 'AI审核' || row.reviewStatus == '人工审核'"
                                type="danger">{{ row.reviewStatus + '拒绝' }}</el-tag>
                            <el-tag v-if="row.reviewStatus == 3" type="info">已取消</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" fixed="right" width="120">
                        <template #default="{ row }">
                            <el-button type="text" @click="showDetail(row)" size="mini">查看详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-row type="flex" justify="end" style="margin-top: 20px;" v-if="pagination">
                    <el-pagination background layout="total,prev,pager, next, sizes" :total="pagination.total"
                        :page-size="pagination.pageSize" :current-page.sync="pagination.pageNum"
                        @size-change="handleSizeChange" @current-change="getAdoptList">
                    </el-pagination>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import { MessageBox } from 'element-ui';
import { query } from '@/utils/common';
import { listPetApply } from '../../../api/petAdopt/petAdopt';
import { petVariety } from '../../../api/petAdopt/pet';
export default {
    name: 'Adopt',
    dicts: ["pet_apply_status"],
    data() {

        return {
            adoptList: [],
            queryForm: {
                realName: undefined,
                varietyName: undefined,
                reviewStatus: undefined,
                reviewProcessName: undefined
            },
            // 分页
            pagination: {
                pageSize: 10,
                pageNum: 1,
                total: 0,
            },
            petVarietyList: []
        }
    },
    created() {
        this.getAdoptList()
        this.getPetVarietyList()
    },
    methods: {
        //获取租户列表
        getAdoptList() {
            // 使用 queryForm 的浅拷贝避免直接修改表单模型
            const rawQuery = this.queryForm || {}
            const query = { ...rawQuery }

            // 处理 reviewStatus 规则：
            // - 如果是类似 "2人工审核" 或 "2AI审核"，将 reviewStatus 设置为 "2"，
            //   并把后缀文字赋值给 reviewProcessName
            // - 否则只保留数字部分作为 reviewStatus（例如 "1"、"3" 等）
            if (query.reviewStatus !== undefined && query.reviewStatus !== null) {
                const rs = String(query.reviewStatus)
                // 如果以数字开头并后面还有文字
                const match = rs.match(/^(\d+)(.*)$/)
                if (match) {
                    const num = match[1]
                    const suffix = match[2] ? match[2].trim() : ''
                    query.reviewStatus = num
                    if (num === '2' && suffix) {
                        // 将后缀赋给 reviewProcessName
                        query.reviewProcessName = suffix
                    } else {
                        // 当不是 2 时，不需要 reviewProcessName
                        delete query.reviewProcessName
                    }
                }
            }

            console.log(query);

            const { total, ...rest } = this.pagination
            listPetApply({ ...rest, ...query }).then(res => {
                console.log(res);
                this.adoptList = res.rows
                this.pagination.total = res.total

            })
        },
        //获取宠物品种列表
        getPetVarietyList() {
            petVariety({ type: "品种" }).then(res => {
                this.petVarietyList = res.data.map(item => ({
                    label: item.labelName,
                    value: item.labelId
                }))
            })
        },
        //查询
        handleQuery() {
            const hasInput = query(this.queryForm)
            if (!hasInput) return this.$message.warning("请输入数据!")
            this.pagination.pageNum = 1
            this.getAdoptList()
        },
        //点击分页页数时更新pageSize
        handleSizeChange(val) {
            this.pagination.pageSize = val
            this.pagination.pageNum = 1
            this.getAdoptList()
        },
        //页面跳转
        showDetail(row) {
            this.$router.push({
                name: "AdoptDetail",
                params: {
                    id: row.applyId
                }
            })
        },
        // 重置
        resetForm(val) {
            this.$refs[`${val}Ref`].resetFields()
        },
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.adopt {
    padding: 20px;
    box-sizing: border-box;

    .adopt-container {
        padding: 20px;
        background-color: white;

        .el-table {
            margin-top: 20px;
        }
    }

    .el-dialog__body {
        padding: 10px 70px 40px 30px !important;
    }

    .el-dialog__header {
        border-bottom: 1px solid #d1d2d2;
    }

    .el-form-item {
        margin-right: 50px;
    }
}
</style>