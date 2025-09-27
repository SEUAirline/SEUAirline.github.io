// 模拟API层，使用localStorage存储数据
const MockAPI = {
  // 加载机场数据
  async loadAirports() {
    const response = await fetch('../data/airports.json');
    return await response.json();
  },

  // 加载航班数据
  async loadFlights() {
    const response = await fetch('../data/flights.json');
    return await response.json();
  },

  // 搜索航班
  async searchFlights(departure, arrival, date) {
    const flights = await this.loadFlights();
    return flights.filter(flight => 
      flight.departureAirport === departure && 
      flight.arrivalAirport === arrival &&
      flight.date === date
    );
  },

  // 根据航班号获取航班详情
  async getFlightByNumber(flightNo) {
    const flights = await this.loadFlights();
    return flights.find(flight => flight.flightNo === flightNo);
  },

  // 用户登录
  login(username, password) {
    // 模拟登录逻辑
    if (username && password) {
      const user = {
        id: Date.now(),
        username: username,
        email: `${username}@example.com`,
        role: 'user',
        vipLevel: 1,
        points: 1000
      };
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', 'mock-token-' + Date.now());
      return { success: true, user };
    }
    return { success: false, message: '用户名或密码错误' };
  },

  // 管理员登录
  adminLogin(username, password) {
    if (username === 'admin' && password === 'admin123') {
      const admin = {
        id: 1,
        username: 'admin',
        role: 'admin',
        permissions: ['all']
      };
      localStorage.setItem('user', JSON.stringify(admin));
      localStorage.setItem('token', 'admin-token-' + Date.now());
      return { success: true, user: admin };
    }
    return { success: false, message: '管理员用户名或密码错误' };
  },

  // 用户注册
  register(userData) {
    const newUser = {
      id: Date.now(),
      ...userData,
      vipLevel: 0,
      points: 0
    };
    // 存储用户数据
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, user: newUser };
  },

  // 获取当前登录用户
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // 用户登出
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('currentAdmin');
    sessionStorage.removeItem('adminToken');
  },

  // 验证管理员token
  validateAdminToken(token) {
    // 在实际应用中，这里应该有更复杂的token验证逻辑
    // 这里简单模拟验证，检查token是否存在并且是否以admin-token-开头
    return token && typeof token === 'string' && token.startsWith('admin-token-');
  },

  // 创建订单
  createOrder(orderData) {
    const order = {
      id: 'ORD' + Date.now(),
      ...orderData,
      status: 'pending',
      createTime: new Date().toISOString(),
      totalAmount: orderData.passengers.length * orderData.price
    };
    // 存储订单
    let orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    return { success: true, order };
  },

  // 获取用户订单
  getUserOrders() {
    const user = this.getCurrentUser();
    if (!user) return [];
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    return orders.filter(order => order.userId === user.id);
  },

  // 根据订单号查询订单
  getOrderByNumber(orderNo) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    return orders.find(order => order.id === orderNo);
  },

  // 支付订单
  payOrder(orderId, paymentMethod) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
      orders[orderIndex].status = 'paid';
      orders[orderIndex].paymentMethod = paymentMethod;
      orders[orderIndex].payTime = new Date().toISOString();
      localStorage.setItem('orders', JSON.stringify(orders));
      return { success: true };
    }
    return { success: false, message: '订单不存在' };
  },

  // 获取所有用户（管理员功能）
  getAllUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
  },

  // 获取所有订单（管理员功能）
  getAllOrders() {
    return JSON.parse(localStorage.getItem('orders') || '[]');
  }
};

// 导出API对象
if (typeof module !== 'undefined') {
  module.exports = MockAPI;
} else {
  window.MockAPI = MockAPI;
}