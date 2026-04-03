<template>
    <div>
        <div class="page-title">
            宠物管理
        </div>
        <div class="pet">
            <div class="pet-container">
                <el-form label-width="70px" ref="queryFormRef" :model="queryForm" inline>
                    <el-form-item label="宠物类别" prop="petTypeId">
                        <el-select v-model="queryForm.petTypeId" placeholder="请选择" size="mini">
                            <el-option v-for="item in petTypeList" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="宠物品种" prop="varietyId">
                        <el-select v-model="queryForm.varietyId" placeholder="请选择" size="mini">
                            <el-option v-for="item in petVarietyList" :key="item.value" :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="mini" type="primary" @click="handleQuery">查询</el-button>
                        <el-button size="mini" @click="resetForm('queryForm'), getPetList()">重置</el-button>
                    </el-form-item>
                </el-form>

                <el-table :data="petList" style="width: 100%;" border>
                    <el-table-column prop="petId" label="宠物ID" align="center" width="100"
                        fixed="left"></el-table-column>
                    <el-table-column prop="petTypeName" label="宠物分类" align="center">
                        <template #default="{ row }">
                            <el-tag v-if="row.petTypeName == '猫类'" type="success">{{ row.petTypeName }}</el-tag>
                            <el-tag v-if="row.petTypeName == '犬类'">{{ row.petTypeName }}</el-tag>
                            <el-tag v-if="row.petTypeName != '犬类' && row.petTypeName != '猫类'" type="warning">{{
                                row.petTypeName }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="varietyName" label="宠物品种" align="center"></el-table-column>
                    <el-table-column prop="sex" label="性别" align="center" width="70">
                        <template #default="{ row }">
                            <i v-if="row.sex == 0" class="el-icon-female" style="color: #f290b6;"></i>
                            <i v-else class="el-icon-male" style="color: #40a9ff;"></i>
                        </template>
                    </el-table-column>
                    <el-table-column prop="age" label="年龄" align="center"></el-table-column>
                    <el-table-column prop="weight" label="体重(kg)" align="center"></el-table-column>
                    <el-table-column prop="createTime" label="收容日期" align="center"
                        show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" align="center" fixed="right">
                        <template #default="{ row }">
                            <el-button type="text" @click="showDetail(row)" size="mini">查看详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-row type="flex" justify="end" style="margin-top: 20px;" v-if="pagination">
                    <el-pagination background layout="total,prev,pager, next, sizes" :total="pagination.total"
                        :page-size="pagination.pageSize" :current-page.sync="pagination.pageNum"
                        @size-change="handleSizeChange" @current-change="getPetList">
                    </el-pagination>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
import { MessageBox } from 'element-ui';
import { query } from '@/utils/common';
import { listPet, petType, petVariety } from '../../../../api/petAdopt/pet';
export default {
    name: 'Pet',
    data() {

        return {
            //宠物列表
            petList: [],
            queryForm: {
                petTypeId: undefined,
                varietyId: undefined
            },
            // 分页
            pagination: {
                pageSize: 10,
                pageNum: 1,
                total: 0,
            },
            petTypeList: [],
            petVarietyList: []
        }
    },
    created() {
        this.getPetList()
        this.getPetTypeList()
        this.getPetVarietyList()
    },
    methods: {
        //获取宠物列表
        getPetList() {
            const query = this.queryForm || {}
            const { total, ...rest } = this.pagination
            listPet({ ...rest, ...query }).then(res => {
                console.log(res);
                this.petList = res.rows
                this.pagination.total = res.total

            })
        },
        //获取宠物类型列表
        getPetTypeList() {
            petType().then(res => {
                this.petTypeList = res.data.map(item => ({
                    label: item.petTypeName,
                    value: item.petTypeId
                }))
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
            this.getPetList()
        },
        //点击分页页数时更新pageSize
        handleSizeChange(val) {
            this.pagination.pageSize = val
            this.pagination.pageNum = 1
            this.getPetList()
        },
        //查看详情
        showDetail(row) {
            console.log(row.petId);

            this.$router.push({
                name: "PetDetail",
                params: {
                    id: row.petId
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
.pet {
    padding: 20px;
    box-sizing: border-box;

    .pet-container {
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

    .pet-img {
        width: 200px !important;
        height: 200px !important;
        margin-right: 30px;
    }
}
</style>