<template>
    <div class="edit-test">
        <div class="page-title">
            编辑测试
        </div>
        <div class="edit-test-container">
            <el-form :rules="rules" ref="formRef" :model="form" label-width="90px" size="small" inline>
                <el-form-item label="测试标题" prop="title">
                    <el-input v-model="form.title" placeholder="请输入测试标题">
                    </el-input>
                </el-form-item>
                <el-form-item label="测试难度" prop="testDifficulty">
                    <el-select v-model="form.testDifficulty" placeholder="请选择" size="mini">
                        <el-option v-for="item in dict.type.test_level_type" :key="item.value" :label="item.label"
                            :value="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="knowledgeType">
                    <el-select v-model="form.knowledgeType" placeholder="请选择课程状态">
                        <el-option key="4" label="草稿" value="4"></el-option>
                        <el-option key="2" label="已发布" value="2"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>

            <div class="question-list">
                <div class="question-card" v-for="(q, qi) in questions" :key="qi">
                    <div class="question-header">
                        <label>题目 {{ qi + 1 }}</label>
                        <div class="ops">
                            <el-button size="mini" icon="el-icon-delete-solid" type="primary"
                                @click="removeQuestion(qi)" :disabled="questions.length <= 1">删除</el-button>
                        </div>
                    </div>
                    <el-input class="input-question" v-model="q.stem" placeholder="在此输入题目"></el-input>
                    <div class="options">
                        <div class="option" v-for="(opt, oi) in q.optionList" :key="oi">
                            <label>选项 {{ String.fromCharCode(65 + oi) }}</label>
                            <el-input placeholder="请输入选项" v-model="q.optionList[oi]"></el-input>
                        </div>
                    </div>
                    <div style="margin: 10px 0;">
                        <label>答案</label>
                        <el-select v-if="q.type != 1" v-model="q.answer" placeholder="请选择正确答案"
                            style="width: 200px; margin-left: 10px;">
                            <el-option v-for="(opt, oi) in q.optionList" :key="oi" :label="String.fromCharCode(65 + oi)"
                                :value="String.fromCharCode(65 + oi)">
                            </el-option>
                        </el-select>
                        <el-input v-if="q.type == 1" v-model="q.answer" placeholder="请输入正确答案"
                            style="width: 200px; margin-left: 10px;"></el-input>
                        <span v-if="q.type == 1" style="font-size: 14px;color: #666;">(多选题答案请用","分开)</span>
                    </div>
                    <div style="margin: 20px 0;">
                        <div style="margin-bottom: 10px;">
                            <label>答案解析</label>
                        </div>
                        <el-input v-model="q.analysis" placeholder="请输入答案解析" type="textarea"
                            style=" margin-left: 10px;"></el-input>
                    </div>
                </div>
            </div>
            <div style="display: flex;margin-top: 20px;" v-if="questions.length < maxQuestions">
                <el-button size="mini" type="primary" plain icon="el-icon-plus" @click="addQuestion('single')"
                    :disabled="questions.length >= maxQuestions">单选</el-button>
                <el-button size="mini" icon="el-icon-plus" plain type="primary" @click="addQuestion('multiple')"
                    :disabled="questions.length >= maxQuestions">多选</el-button>
                <el-button size="mini" icon="el-icon-plus" plain type="primary" @click="addQuestion('judge')"
                    :disabled="questions.length >= maxQuestions">判断</el-button>
                <span class="hint">提示：至少添加1道题目，最多添加{{ maxQuestions }}道题目</span>
            </div>
            <el-row type="flex" justify="center" style="margin-top: 30px;">
                <el-button type="primary" @click="submitAll">提交</el-button>
                <el-button icon="el-icon-caret-left" @click="closeEdit">关闭</el-button>
            </el-row>
        </div>
    </div>
</template>

<script>
import { addTest, detailTest, editTest } from '@/api/petAdopt/test'

export default {
    name: 'editTest',
    dicts: ["test_level_type"],
    data() {
        return {
            mode: 'add',
            isAddTest: false,
            maxQuestions: 15,
            questions: [

            ],
            mode: 'add',
            form: {
                knowledgeId: undefined,
                title: undefined,
                knowledgeType: undefined,
                testDifficulty: undefined,
                msTopicInsertList: []
            },
            rules: {
                title: [
                    { required: true, trigger: "blur", message: "请输入标题" },
                ],
                testDifficulty: [
                    { required: true, trigger: "blur", message: "请选择类型" },
                ],
                knowledgeType: [
                    { required: true, trigger: "blur", message: "请选择状态" },
                ],


            },
        }
    },
    mounted() {
        const data = this.$route.params
        if (data.mode == "edit") {
            this.mode = 'edit'
            this.getTestDetal(data.id)
        }
        console.log(data) // 输出: 123
    },
    methods: {
        getTestDetal(id) {
            detailTest(id).then(res => {
                console.log(res);
                const { title, knowledgeType, testDifficulty } = res.data
                this.form.title = title
                this.form.knowledgeType = knowledgeType
                this.form.testDifficulty = testDifficulty
                this.form.knowledgeId = id
                this.questions = res.data.topicList.map(item => {
                    return {
                        stem: item.stem,
                        optionList: JSON.parse(item.options).map(opt => opt.value),
                        analysis: item.analysis,
                        answer: item.answer,
                        type: item.type,
                        topicId: item.topicId
                    }
                })
            })
        },
        addQuestion(type) {
            if (this.questions.length >= this.maxQuestions) return;
            if (this.questions.length > 0) {
                const valid = this.validateQuestion(this.questions[this.questions.length - 1])
                if (!valid.isValid) return this.$message.warning(valid.message)

            }

            switch (type) {
                case 'single':
                    this.questions.push({ stem: '', optionList: ['', '', '', ''], analysis: '', answer: '', type: 0, topicId: '' });
                    break;
                case 'multiple':
                    this.questions.push({ stem: '', optionList: ['', '', '', ''], analysis: '', answer: '', type: 1, topicId: '' });
                    break;
                case 'judge':
                    this.questions.push({ stem: '', optionList: ['正确', '错误'], analysis: '', answer: '', type: 2, topicId: '' });
                    break;
            }

        },
        removeQuestion(index) {
            if (this.questions.length <= 1) return;
            this.questions.splice(index, 1);
        },
        // 验证单个题目对象是否完整
        validateQuestion(question) {
            const { stem, optionList, analysis, answer } = question;

            // 验证题干不能为空
            if (!stem || stem.trim() === '') {
                return { isValid: false, message: '题干不能为空' };
            }

            // 验证选项列表
            if (!Array.isArray(optionList) || optionList.length === 0) {
                return { isValid: false, message: '选项列表不能为空' };
            }

            // 验证每个选项都不能为空
            const emptyOption = optionList.some(option => !option || option.trim() === '');
            if (emptyOption) {
                return { isValid: false, message: '选项都不能为空' };
            }

            // 验证答案
            if (!answer || answer.trim() === '') {
                return { isValid: false, message: '答案不能为空' };
            }

            // 验证答案
            if (!analysis || analysis.trim() === '') {
                return { isValid: false, message: '答案解析不能为空' };
            }

            return { isValid: true, message: '验证通过' };
        },
        submitAll() {
            if (this.questions.length < 1) {
                return this.$message.warning('请至少添加一道题目!')


            }
            this.form.msTopicInsertList = this.questions
            console.log('提交的题目数组：', this.form);
            this.$refs["formRef"].validate(async valid => {
                if (!valid) return
                //过滤不需要的参数
                const { knowledgeId, ...rest } = this.form
                try {
                    let result = {}
                    switch (this.mode) {
                        case 'add':
                            // 添加测试
                            result = await addTest({ ...rest })
                            break;
                        case 'edit':
                            //修改测试
                            result = await editTest({ knowledgeId, ...rest })
                            break;

                    }
                    this.$message.success(result.msg)
                    this.resetForm("form")
                    this.$router.replace("/knowledge/test")
                } catch (error) {
                }

            })

        },
        closeEdit() {
            this.resetForm("form")
            this.$router.replace("/knowledge/test")
        },
        // 重置
        resetForm(val) {
            this.$refs[`${val}Ref`].resetFields()
        },
    }
}
</script>

<style lang="scss">
.edit-test {
    padding: 20px;
    box-sizing: border-box;

    .el-textarea__inner {
        width: 100% !important;
    }

    .edit-test-container {
        padding: 20px;
        background-color: white;

        .hint {
            margin: 0 10px;
        }

        .title {
            margin: 5px 0;
        }

        .controls {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
        }

        .question-list {
            margin-top: 10px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .question-card {
            padding: 12px;
            border: 1px solid #e6e6e6;
            border-radius: 6px;
            background: #fff;

            .question-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;



            }


            label {
                margin: 6px;
                font-size: 13px;
                color: #444;
            }

            .options {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 8px;

                .option {
                    display: flex;
                    flex-direction: column;



                    // input {
                    //     padding: 6px;
                    //     border: 1px solid #d9d9d9;
                    //     border-radius: 4px;
                    // }
                }
            }
        }

        .hint {
            margin-top: 14px;
            color: #888;
            font-size: 13px;
        }

        .submit-btn {
            background: #409eff;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
        }
    }
}
</style>
