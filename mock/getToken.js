/**
 * 用 @ 来标识占位符。占位符引用 Mock.Radnom 中的方法，通过对相应的方法生成随机数据
 */
var data = {
    'token': '@guid'
}

export default [{
    path: '/getToken',
    data: data
}]