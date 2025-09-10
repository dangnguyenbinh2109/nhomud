import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true); // Thêm trạng thái loading
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    
    setUser(null);
    setToken(null);
    
    navigate('/login', { replace: true });
  }, [navigate]);

  useEffect(() => {
    // Khởi tạo trạng thái từ localStorage (hỗ trợ cả luồng login ngoài Context)
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (storedToken) setToken(storedToken);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Fallback: dựng user từ các key rời mà service khác đã set
        const role = localStorage.getItem('role');
        const username = localStorage.getItem('username');
        const user_id = localStorage.getItem('user_id');
        if (role || username || user_id) {
          setUser({
            role: role || undefined,
            username: username || undefined,
            user_id: user_id ? Number(user_id) : undefined,
          });
        }
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Đồng bộ khi token/user thay đổi ở nơi khác (service/login khác, refresh token, logout)
    const handleAuthUpdated = () => {
      const t = localStorage.getItem('token');
      setToken(t);
      // đồng bộ user (ưu tiên object, fallback role/username/user_id)
      const u = localStorage.getItem('user');
      if (u) {
        try { setUser(JSON.parse(u)); } catch { setUser(null); }
      } else {
        const role = localStorage.getItem('role');
        const username = localStorage.getItem('username');
        const user_id = localStorage.getItem('user_id');
        if (role || username || user_id) {
          setUser({
            role: role || undefined,
            username: username || undefined,
            user_id: user_id ? Number(user_id) : undefined,
          });
        } else {
          setUser(null);
        }
      }
    };
    window.addEventListener('auth-token-refreshed', handleAuthUpdated);
    window.addEventListener('auth-updated', handleAuthUpdated);
    window.addEventListener('auth-logout', handleAuthUpdated);
    return () => {
      window.removeEventListener('auth-token-refreshed', handleAuthUpdated);
      window.removeEventListener('auth-updated', handleAuthUpdated);
      window.removeEventListener('auth-logout', handleAuthUpdated);
    };
  }, []);

  const login = (loginData) => {
    // Khi đăng nhập, ta chắc chắn có đủ dữ liệu
    setLoading(true);
    localStorage.setItem('token', loginData.token);
    localStorage.setItem('refresh_token', loginData.refresh_token);
    localStorage.setItem('user', JSON.stringify(loginData.user));
    localStorage.setItem('role', loginData.user.role);
    
    setToken(loginData.token);
    setUser(loginData.user);
    setLoading(false);
  };

  const value = { user, token, loading, login, logout, isAuthenticated: !!token };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
