import TeacherDashboard from "../../pages/Dashboard/TeacherDashboard";
import LessonPlanManagement from "../../pages/Teacher/LessonPlanManagement";
import ExamCreation from "../../pages/Teacher/ExamCreation";
import OcrGrading from "../../pages/Teacher/OcrGrading";
import ResourceManagement from "../../pages/Teacher/ResourceManagement";

export const teacherRoutes = [
  {
    path: "dashboard",
    element: <TeacherDashboard />,
  },
  {
    path: "lesson-plans",
    element: <LessonPlanManagement />,
  },
  {
    path: "create-exam",
    element: <ExamCreation />,
  },
  {
    path: "ocr-grading",
    element: <OcrGrading />,
  },
  {
    path: "resources",
    element: <ResourceManagement />,
  },
];