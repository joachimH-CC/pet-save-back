<template>
    <div>
        <div class="page-title">
            分类管理
        </div>
        <div class="classify">
            <div class="classify-container">
                <el-form label-width="70px" ref="queryFormRef" :model="queryForm" inline>
                    <el-form-item label="分类名称" prop="petTypeName">
                        <el-input size="mini" placeholder="请输入分类名称" v-model="queryForm.petTypeName"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="mini" type="primary" @click="handleQuery">查询</el-button>
                        <el-button size="mini" @click="resetForm('queryForm'), getClassifyList()">重置</el-button>
                    </el-form-item>
                </el-form>
                <div style="display: flex;">
                    <el-button size="mini" icon="el-icon-plus" type="primary" @click="handleAdd">添加</el-button>
                </div>
                <el-table :data="classifyList" style="width: 100%;" border>
                    <el-table-column prop="petTypeId" label="分类ID" align="center" width="100"></el-table-column>
                    <el-table-column prop="petTypeName" label="分类名称" align="center"></el-table-column>
                    <el-table-column prop="introduction" label="描述" align="center" width="350"
                        show-overflow-tooltip></el-table-column>
                    <el-table-column prop="createTime" label="创建时间" align="center"
                        show-overflow-tooltip></el-table-column>
                    <el-table-column prop="petNum" label="宠物数量" align="center">
                    </el-table-column>
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
                        @size-change="handleSizeChange" @current-change="getClassifyList">
                    </el-pagination>
                </el-row>
            </div>
        </div>

        <!-- 弹窗 -->
        <el-dialog width="500px" :visible.sync="dialog.visible" title="">
            <template #title>
                <div style="text-align: center;">
                    {{ dialog.mode === 'add' ? "新建分类" : "编辑分类" }}
                </div>
            </template>
            <el-form :rules="dialog.rules" ref="dialogFormRef" :model="dialog.form" label-width="80px" size="small">
                <el-form-item label="分类名称" prop="petTypeName">
                    <el-input v-model="dialog.form.petTypeName"></el-input>
                </el-form-item>
                <el-form-item label="分类描述" prop="introduction">
                    <el-input type="textarea" v-model="dialog.form.introduction"></el-input>
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
import { addPetType, delPetType, editPetType, listPetType } from '../../../../api/petAdopt/petType';
export default {
    name: 'Classify',
    data() {
        return {
            mode: "add",
            //分类列表
            classifyList: [],
            queryForm: {
                petTypeName: undefined,
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
                    petTypeId: undefined,
                    petTypeName: undefined,
                    introduction: undefined,

                },
                rules: {
                    petTypeName: [
                        { required: true, trigger: "blur", message: "请输入分类名称" },
                    ],
                    introduction: [
                        { required: true, trigger: "blur", message: "请输入分类描述" },
                    ],
                }

            },
        }
    },
    created() {
        this.getClassifyList()
    },
    methods: {
        //获取租户列表
        getClassifyList() {
            const query = this.queryForm || {}
            const { total, ...rest } = this.pagination
            listPetType({ ...rest, ...query }).then(res => {
                console.log(res);
                console.log(this.pagination);

                this.classifyList = res.rows
                this.pagination.total = res.total

            })
        },
        //查询
        handleQuery() {
            const hasInput = query(this.queryForm)
            if (!hasInput) return this.$message.warning("请输入数据!")
            this.pagination.pageNum = 1
            this.getClassifyList()
        },
        //点击分页页数时更新pageSize
        handleSizeChange(val) {
            this.pagination.pageSize = val
            this.pagination.pageNum = 1
            this.getClassifyList()
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
            this.isEdit = true
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
                const { petTypeId, createTime, petNum, ...rest } = this.dialog.form
                try {
                    let result = {}
                    switch (this.dialog.mode) {
                        case 'add':
                            // 添加租户
                            result = await addPetType({ ...rest })
                            break;
                        case 'edit':
                            //修改租户
                            result = await editPetType({ petTypeId, ...rest })
                            break;
                    }
                    this.$message.success(result.msg)
                    this.getClassifyList()
                    this.dialog.visible = false
                    this.resetForm("dialogForm")
                } catch (error) {
                }
            })
        },
        //删除
        handleDel(row) {

            MessageBox.confirm(`是否删除租户[${row.petTypeName}]?`, "系统提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: 'warning',
            }).then((res) => {
                delPetType(row.petTypeId).then(res => {
                    this.$message.success("删除成功!")
                    if (this.pagination.total <= this.pagination.pageSize + 1) this.pagination.pageNum = 1
                    this.getClassifyList()
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
.classify {
    padding: 20px;
    box-sizing: border-box;

    .classify-container {
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