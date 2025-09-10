import TeacherLayout from "./layouts/TeacherLayout.jsx";
import TeacherDashboard from "./pages/Dashboard/TeacherDashboard.jsx";

<Route element={<TeacherLayout />}>
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute
        allowedRoles={["admin", "teacher", "staff", "manager"]}
        element={<TeacherDashboard />}
      />
    }
  />
</Route>
