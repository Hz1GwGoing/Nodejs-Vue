<template>
  <el-button type="primary" @click="visible = true">添加</el-button>
  <br><br>

  <el-table :data="articles">
    <el-table-column prop="id" label="id"></el-table-column>
    <el-table-column prop="title" label="标题"></el-table-column>
    <el-table-column prop="content" label="内容"></el-table-column>
    <el-table-column prop="name" label="分类"></el-table-column>
    <el-table-column prop="views" label="浏览量"></el-table-column>
    <el-table-column prop="likes" label="点赞数"></el-table-column>
    <el-table-column label="是否置顶">
      <template #default="scope">
        {{ scope.row.is_top ? '是' : '否' }}
      </template>
    </el-table-column>
    <el-table-column prop="created_at" label="创建时间"></el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button type="danger" @click="delArticle(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog title="添加文章" v-model="visible">

    <el-form label-width="100px" :model="formModel" :rules="rules" ref="eForm">
      <el-form-item label="标题" prop="title">
        <el-input v-model="formModel.title"> </el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input v-model="formModel.content" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="分类" prop="category_id">
        <el-select v-model="formModel.category_id">
          <el-option v-for="item in categories" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="浏览量">
        <el-input-number v-model="formModel.views"></el-input-number>
      </el-form-item>
      <el-form-item label="点赞数">
        <el-input-number v-model="formModel.likes"></el-input-number>
      </el-form-item>
      <el-form-item label="是否置顶">
        <el-switch v-model="formModel.is_top"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="insertArticle">创建</el-button>
        <el-button type="info" @click="visible = false">取消</el-button>
      </el-form-item>

    </el-form>

  </el-dialog>
</template>

<script setup>
// 导入reactive、ref函数
import { reactive, ref } from 'vue'
// 导入axios
import axios from 'axios'
// 响应式状态：用于绑定列表
let articles = reactive([])
// 响应式状态：用于控制弹窗的显示隐藏
let visible = ref(false)
// 响应式状态：用于绑定el-form表单
let formModel = reactive({
  title: '',
  content: '',
  category_id: '',
  views: 0,
  likes: 0,
  is_top: false
})
// 响应式状态：用于绑定分类下拉列表
let categories = reactive([])
// 响应式状态：用于设定校验规则
let rules = reactive({
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' }
  ],
  category_id: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ]
})
// 响应式状态：对应到el-form组件，对el-form组件的引用
let eForm = ref(null)

// 方法：获取文章列表
function getArticles() {
  axios.get('http://127.0.0.1/articles')
    .then(res => {
      articles.splice(0)
      res.data.forEach(article => {
        articles.push(article)
      });
    })
    .catch(err => {
      console.log(err)
      alert('服务器错误')
    })
}
// 方法：删除文章
function delArticle(id) {
  axios.delete(`http://127.0.0.1/article/${id}`)
    .then(res => {
      alert(res.data)
      if (res.data == '删除成功') {
        getArticles()
      }
    })
    .catch(err => {
      console.log(err)
      alert('服务器错误')
    })
}

// 方法：获取分类
function getCategories() {
  axios.get('http://127.0.0.1/categories')
    .then(res => {
      res.data.forEach(el => {
        categories.push(el)
      })
    })
}

// 方法：添加文章
function insertArticle() {
  eForm.value.validate(isValid => {
    if (isValid) {
      axios.post('http://127.0.0.1/article', formModel)
        .then(res => {
          alert(res.data)
          if (res.data == '添加成功') {
            // 关闭弹窗
            visible.value = false

            // 重新获取列表数据，相当于刷新列表
            getArticles()
          }
        })
    }
  })
}

// 调用
getArticles()
getCategories()

</script>