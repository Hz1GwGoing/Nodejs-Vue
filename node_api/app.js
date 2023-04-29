// 导入模块
let express = require('express')
let execSql = require('./dbHelper').execSql
var bodyParser = require('body-parser')

// 创建express应用
let app = express()

// 使用中间件
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// 中间件
app.use((req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Origin', '*')
    resp.setHeader('Access-Control-Allow-Headers', 'content-type')
    resp.setHeader('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE,OPTIONS')
    resp.setHeader('Allow', 'POST,GET,PUT,DELETE,OPTIONS')
    next()
})


// 添加路由
app.get('/', (req, resp) => {
    resp.send('考试顺利')
})

// 1. 获取文章列表（考试内容）
app.get('/articles', (req, resp) => {
    // 请完善代码，实现获取文章列表功能，必须正确实现分类名称

    // 1. 准备sql语句
    let sql = `select articles.*,name 
                from articles 
                join categories 
                on articles.category_id = categories.id 
                where is_deleted = 'false'`
    // 2. 执行sql语句
    execSql(sql, (rowCount, rows) => {
        // 执行成功
        // 理解rows的数据结构
        // 转换数据结构
        let result = []
        rows.forEach(row => {
            let blog = {}
            row.forEach(column => {
                // 某一行某一列的列名
                // column.metadata.colName
                // 某一行某一列的值
                // column.value
                blog[column.metadata.colName] = column.value
            });
            result.push(blog)
        })
        resp.send(result)
    }, err => {
        // 执行失败
        console.log(err)
        resp.send('服务器错误')
    })

})

// 2. 添加文章
app.post('/article', (req, resp) => {
    // 请完善代码，实现添加文章的功能
    // 1. 准备sql语句
    let sql = `insert into articles(title,content,category_id,is_top,views,likes,is_deleted,created_at)
                values('${req.body.title}','${req.body.content}','${req.body.category_id}','${req.body.is_top}','${req.body.views}','${req.body.likes}','false',GETDATE())`
    console.log(sql)
    // 2. 执行sql语句
    execSql(sql, (rowCount, rows) => {
        if (rowCount == 1) {
            resp.send('添加成功')
        } else {
            resp.send('添加失败')
        }
    }, err => {
        console.log(err)
        resp.send('服务器错误')
    })
})

// 3. 获取分类列表
app.get('/categories', (req, resp) => { 
    // 请完善代码，实现获取分类列表的功能
    // 1. 准备sql语句
    let sql = `select * from categories`

    // 2. 执行sql语句
    execSql(sql, (rowCount, rows) => {
        // 执行成功
        // 理解rows的数据结构
        // 转换数据结构
        let result = []
        rows.forEach(row => {
            let blog = {}
            row.forEach(column => {
                // 某一行某一列的列名
                // column.metadata.colName
                // 某一行某一列的值
                // column.value
                blog[column.metadata.colName] = column.value
            });
            result.push(blog)
        })
        resp.send(result)
    }, err => {
        // 执行失败
        console.log(err)
        resp.send('服务器错误')
    })
})

// 4. 删除文章
app.delete('/article/:id', (req, resp) => {
    // 请完善代码，实现删除文章的功能，使用软删除
    // 1. 准备sql语句
    let sql = `update articles set is_deleted = 'true' where id =${req.params.id}`
    // 2. 执行sql语句
    execSql(sql, (rowCount, rows) => {
        if (rowCount == 1) {
            resp.send('删除成功')
        } else {
            resp.send('删除失败')
        }
    }, err => {
        console.log(err)
        resp.send('服务器错误')
    })
})


// 启动应用
app.listen(80, () => {
    console.log('http://127.0.0.1/articles')
})