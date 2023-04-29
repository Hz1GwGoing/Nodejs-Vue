let tedious = require('tedious')

exports.execSql = function (sql, successCallback, failCallback) {
    // 1. 连接数据库
    // a. 配置
    let config = {
        server: "localhost", // 数据库所在的机器的IP或域名
        options: {
            database: 'BlogSystem', // 数据库名
            encrypt: false,// 不使用加密
            rowCollectionOnRequestCompletion: true// 要返回数据
        },
        authentication: {
            type: "default",
            options: {
                userName: "sa",// 登录名
                password: "123456",// 密码
            }
        }
    }
    // b. 创建Connection对象
    let connnnnnnn = new tedious.Connection(config)
    // c. 绑定事件，为了知道到底有木有连接成功
    connnnnnnn.on('connect', err => {
        if (err) {
            failCallback(err)
            return
        }
        // resp.send('连接成功')// 目的分步测试
        // 2. 执行sql语句
        // 2.1 准备SQL语句
        // let sql = 'select * from articles'
        // 2.2 创建Request对象
        let request = new tedious.Request(sql, (err, rowCount, rows) => {
            if (err) {
                failCallback(err)
                return
            }
            successCallback(rowCount, rows)

        })
        // 2.3 执行
        connnnnnnn.execSql(request)
    })
    // d. 执行连接（不要忘了）
    connnnnnnn.connect()
}