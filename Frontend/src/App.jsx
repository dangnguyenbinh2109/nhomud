import React, { useEffect } from 'react';
import AppRouter from './router/AppRouter';
import { useAuth } from './context/AuthContext';
import { initializeApi } from './utils/api';
import { Toaster } from 'react-hot-toast';

function App() {
  const { logout } = useAuth();

  useEffect(() => {
    // Khởi tạo trình xử lý đăng xuất toàn cục cho các lệnh gọi API
    initializeApi(logout);
  }, [logout]);

  return (
      <>
        <AppRouter/>
        <Toaster position="top-right" reverseOrder={false} />
      </>
  )
}

export default App
