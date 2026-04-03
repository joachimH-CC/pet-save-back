<template>
    <div>
        <div class="page-title">
            标签管理
        </div>
        <div class="pet-label">
            <div class="pet-label-container">
                <el-form label-width="70px" ref="queryFormRef" :model="queryForm" inline>
                    <el-form-item label="标签名称" prop="labelName">
                        <el-input size="mini" placeholder="请输入标签名称" v-model="queryForm.labelName"></el-input>
                    </el-form-item>
                    <el-form-item label="所属分类" prop="category">
                        <el-select size="mini" placeholder="请选择所属分类" v-model="queryForm.category">
                            <el-option v-for="item in dict.type.pet_lable_type" :key="item.value"
                                :label="item.label + '标签'" :value="item.label">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="mini" type="primary" @click="handleQuery">查询</el-button>
                        <el-button size="mini" @click="resetForm('queryForm'), getLabelList()">重置</el-button>
                    </el-form-item>
                </el-form>
                <div style="display: flex;">
                    <el-button size="mini" icon="el-icon-plus" type="primary" @click="handleAdd">添加</el-button>
                </div>
                <el-table :data="labelList" style="width: 100%;" border>
                    <el-table-column prop="labelId" label="标签ID" align="center" width="100"></el-table-column>
                    <el-table-column prop="labelName" label="标签名称" align="center"></el-table-column>
                    <el-table-column prop="type" label="所属分类" align="center">
                        <template #default="{ row }">
                            <el-tag v-if="row.type == '性格'">性格标签</el-tag>
                            <el-tag v-if="row.type == '品种'" type="success">品种标签</el-tag>
                            <el-tag v-if="row.type == '来源'" type="warning">来源标签</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="创建时间" align="center"
                        show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" align="center" fixed="right">
                        <template #default="{ row }">
                            <el-button type="text" @click="handleEdit(row)" size="mini">编辑</el-button>
                            <el-button type="text" @click="handleDel(row)" size="mini">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <el-row type="flex" justify="end" style="margin-top: 20px;" v-if="pagination">
                    <el-pagination background layout="total,prev,pager, next, sizes" :total="pagination.total"
                        :page-size="pagination.pageSize" :current-page.sync="pagination.pageNum"
                        @size-change="handleSizeChange" @current-change="getLabelList">
                    </el-pagination>
                </el-row>
            </div>
        </div>

        <!-- 弹窗 -->
        <el-dialog width="400px" :visible.sync="dialog.visible" title="">
            <template #title>
                <div style="text-align: center;">
                    {{ dialog.mode === 'add' ? "新建标签" : "编辑标签" }}
                </div>
            </template>
            <el-form :rules="dialog.rules" ref="dialogFormRef" :model="dialog.form" label-width="80px" size="small">
                <el-form-item label="标签名称" prop="labelName">
                    <el-input v-model="dialog.form.labelName"></el-input>
                </el-form-item>
                <el-form-item label="所属分类" prop="type">
                    <el-select v-model="dialog.form.type" placeholder="请选择">
                        <el-option v-for="item in dict.type.pet_lable_type" :key="item.value" :label="item.label"
                            :value="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-row type="flex" justify="end">
                <el-button @click="dialog.visible = false, resetForm('dialogForm')"> 取消</el-button>
                <el-button type="primary" @click="handleSubmit">确定</el-button>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
import { MessageBox } from 'element-ui';
import { query } from '@/utils/common';
import { addPetLabel, delPetLabel, editPetLabel, listPetLabel } from '../../../../api/petAdopt/petLabel';
export default {
    name: 'petLabel',
    dicts: ["pet_lable_type"],
    data() {
        return {
            mode: "add",
            //租户列表
            labelList: [],
            queryForm: {
                labelName: undefined,
                category: undefined,
            },
            // 分页
            pagination: {
                pageSize: 10,
                pageNum: 1,
                total: 0,
            },
            //弹窗
            dialog: {
                visible: false,
                form: {
                    labelId: undefined,
                    labelName: undefined,
                    type: undefined,

                },
                rules: {
                    labelName: [
                        { required: true, trigger: "blur", message: "请输入标签名称" },
                    ],
                    type: [
                        { required: true, trigger: "blur", message: "请选择分类" },
                    ],
                }

            },
        }
    },
    created() {
        this.getLabelList()
    },
    methods: {
        //获取标签列表
        getLabelList() {
            const query = this.queryForm || {}
            const { total, ...rest } = this.pagination
            listPetLabel({ ...rest, ...query }).then(res => {
                console.log(res);
                console.log(this.pagination);

                this.labelList = res.rows
                this.pagination.total = res.total

            })
        },
        //查询
        handleQuery() {
            const hasInput = query(this.queryForm)
            if (!hasInput) return this.$message.warning("请输入数据!")
            this.pagination.pageNum = 1
            this.getLabelList()
        },
        //点击分页页数时更新pageSize
        handleSizeChange(val) {
            this.pagination.pageSize = val
            this.pagination.pageNum = 1
            this.getLabelList()
        },
        //打开弹窗
        showDetail(row) {
            this.dialog.form = { ...row }
            this.dialog.visible = true
        },
        //打开添加弹窗
        handleAdd() {
            this.dialog.visible = true
            this.dialog.mode = "add"
        },
        //修改
        handleEdit(row) {
            this.dialog.visible = true
            this.dialog.mode = "edit"
            //数据回显
            this.$nextTick(() => {
                this.dialog.form = JSON.parse(JSON.stringify(row))
            })
        },
        //提交弹窗表单
        handleSubmit() {
            this.$refs["dialogFormRef"].validate(async valid => {
                if (!valid) return
                //过滤不需要的参数
                const { labelId, ...rest } = this.dialog.form
                try {
                    let result = {}
                    switch (this.dialog.mode) {
                        case 'add':
                            result = await addPetLabel({ ...rest })
                            break;
                        case 'edit':
                            result = await editPetLabel({ labelId, ...rest })
                            break;
                    }
                    this.$message.success(result.msg)
                    this.getLabelList()
                    this.dialog.visible = false
                    this.resetForm("dialogForm")
                } catch (error) {
                }
            })
        },
        //删除
        handleDel(row) {

            MessageBox.confirm(`是否删除标签[${row.labelName}]?`, "系统提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: 'warning',
            }).then((res) => {
                delPetLabel(row.labelId).then(res => {
                    this.$message.success("删除成功!")
                    if (this.pagination.total <= this.pagination.pageSize + 1) this.pagination.pageNum = 1
                    this.getLabelList()
                })

            }).catch((err) => {
            });

        },
        // 重置
        resetForm(val) {
            this.$refs[`${val}Ref`].resetFields()
        },
    }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.el-input--small .el-input__inner {
    width: 250px;
}

.pet-label {
    padding: 20px;
    box-sizing: border-box;

    .pet-label-container {
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
}
</style>