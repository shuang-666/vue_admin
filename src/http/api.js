import request from "./requset";

/**
 * 登录接口
 */

export function login(data) {
  console.log("接口", data);
  return request({
    url: "login",
    method: "POST",
    data
  });
}

// 获取用户的数据
export function getUserList(params) {
  return request({
    url: "users",
    mathod: "GET",
    params
  });
}

//提交用户的数据
export function add(data) {
  return request({
    url: "users",
    method: "POST",
    data
  });
}

// 删除某个用户
export function deleteData(userId) {
  return request({
    url: `users/${userId}`,
    method: "DELETE"
  });
}

// 编辑用户的信息
export function updataData(userId, data) {
  return request({
    url: `users/${userId}`,
    method: "PUT",
    data
  });
}

// 更改用户信息
export function statusData(userId, status) {
  return request({
    url: `users/${userId}/state/${status}`,
    method: "PUT"
  });
}

// 用户角色列表
export function getUserRoleList() {
  return request({
    url: "roles",
    method: "GET"
  });
}

// 修改用户角色
export function getUserRoleLEdit(id, data) {
  return request({
    url: `users/${id}/role`,
    method: "PUT",
    data
  });
}

// 查询用户的角色
export function getUserRoleLData(id) {
  return request({
    url: `roles/${id}`,
    method: "GET"
  });
}

// 添加一个角色列表
export function getRoleData(data) {
  return request({
    url: "roles",
    method: "POST",
    data
  });
}

// 删除角色
export function roleDeleteData(userId) {
  return request({
    url: `roles/${userId}`,
    method: "DELETE"
  });
}

// 编辑修改后的角色
export function getUpdataData(roleId, data) {
  return request({
    url: `roles/${roleId}`,
    method: "PUT",
    data
  });
}

// 权限列表的所有的数据
export function getRightsList() {
  return request({
    url: "rights/list",
    method: "GET"
  });
}

// 角色列表（tree）的所有的数据
export function getRightsListTree() {
  return request({
    url: "rights/tree ",
    method: "GET"
  });
}

// 角色列表的删除角色权限
export function roleDeleteRights(roleId, rightId) {
  return request({
    url: `roles/${roleId}/rights/${rightId}`,
    method: "DELETE"
  });
}

// 更新角色列表的角色授权
export function updataRights(roleId, data) {
  return request({
    url: `roles/${roleId}/rights`,
    method: "POST",
    data
  });
}

// 获取所有的商品列表
export function getGoodsList(params) {
  return request({
    url: "goods",
    method: "GET",
    params
  });
}

// 删除商品
export function getGoodsDelete(id) {
  return request({
    url: `goods/${id}`,
    method: "DELETE"
  });
}

// 获取所有的分类的数据
export function getClassify(params) {
  return request({
    url: "categories",
    method: "GET",
    params
  });
}

// 添加所有的分类的数据
export function getAddClassify(data) {
  return request({
    url: "categories",
    method: "POST",
    data
  });
}

// 编辑所有的分类的数据
export function getEditClassify(id) {
  return request({
    url: `categories/${id}`,
    method: "GET"
  });
}

// 编辑确定所有的分类的数据
export function getEditClassifyConfrim(id, data) {
  return request({
    url: `categories/${id}`,
    method: "PUT",
    data
  });
}


// 删除所有的分类的数据
export function getEditClassifyDelete(id) {
  return request({
    url: `categories/${id}`,
    method: "DELETE"
  });
}

// 获取所有的分类的静态和动态数据
export function getGoodsCate(cateId, type = "many") {
  return request({
    url: `categories/${cateId}/attributes`,
    method: "GET",
    params: {
      sel: type
    }
  });
}

// 添加的分类的静态和动态数据
export function getAddGoodsCate(cateId, data) {
  return request({
    url: `categories/${cateId}/attributes`,
    method: "POST",
    data
  });
}

// 查询编辑的分类的数据
export function getClassifyLook(id, attrId, params) {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    method: "GET",
    params
  })
}

// 确定编辑的分类的数据
export function getClassifyConfrim(id, attrId, data) {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    method: "PUT",
    data
  })
}

// 删除编辑的分类的数据
export function getClassifyDelete(id, attrid) {
  return request({
    url: `categories/${id}/attributes/${attrid}`,
    method: "DELETE"
  })
}
// 添加商品
export function getAddClick(data) {
  return request({
    url: "goods",
    method: "POST",
    data
  });
}

// 订单的所有数据
export function getOrder(params) {
  return request({
    url: "orders",
    method: "GET",
    params
  });
}

// 查看物流信息
export function getSeeOrder(id) {
  return request({
    url: `/kuaidi/${id}`,
    method: "GET"
  });
}
// 使用echarts图标来完善数据报表
export function getReports() {
  return request({
    url: "reports/type/1",
    method: "GET"
  });
}