const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:6868';

// Cờ để ngăn chặn nhiều yêu cầu làm mới token đồng thời
let isRefreshing = false;
// Hàng đợi chứa các yêu cầu API bị lỗi 401 trong khi đang làm mới token
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

let authLogoutHandler = () => {
  console.error("Logout handler not initialized. Redirecting manually.");
  localStorage.clear();
  window.location.href = '/login';
};

export const initializeApi = (logoutHandler) => {
  authLogoutHandler = logoutHandler;
};

export const apiFetch = async (url, options = {}) => {
  const originalRequest = { url, options };
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    if (isRefreshing) {
      // Nếu đang có một yêu cầu làm mới token, đưa yêu cầu hiện tại vào hàng đợi
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(newToken => {
        // Khi có token mới, thực hiện lại yêu cầu ban đầu
        const newHeaders = { ...originalRequest.options.headers, 'Authorization': `Bearer ${newToken}` };
        return apiFetch(originalRequest.url, { ...originalRequest.options, headers: newHeaders });
      });
    }

    isRefreshing = true;
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      authLogoutHandler();
      return Promise.reject(new Error('Session expired. No refresh token.'));
    }

    try {
      const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      const refreshData = await refreshResponse.json();

      if (!refreshResponse.ok || refreshData.status !== 'success') {
        throw new Error('Could not refresh token.');
      }

      // Lưu token mới
      localStorage.setItem('token', refreshData.token);
      if (refreshData.refresh_token) {
        localStorage.setItem('refresh_token', refreshData.refresh_token);
      }
      
      // Thông báo cho ứng dụng biết token đã được cập nhật
      window.dispatchEvent(new Event("auth-token-refreshed"));
      processQueue(null, refreshData.token);

      // Thực hiện lại yêu cầu ban đầu với token mới
      const newHeaders = { ...originalRequest.options.headers, 'Authorization': `Bearer ${refreshData.token}` };
      return apiFetch(originalRequest.url, { ...originalRequest.options, headers: newHeaders });

    } catch (error) {
      processQueue(error, null);
      authLogoutHandler(); // Nếu làm mới thất bại, đăng xuất
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }

  return response;
};