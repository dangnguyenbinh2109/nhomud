import StaffDashboard from "../../layouts/StaffDashboard";
import QuestionBankManagement from "../../layouts/QuestionBankManagement";
import LessonPlanManagement from "../../layouts/LessonPlanManagement";
import PromptTemplateManagement from "../../layouts/PromptTemplateManagement";

export const staffRoutes = [
  {
    path: "dashboard",
    element: <StaffDashboard />,
  },
  {
    path: "question-bank",
    element: <QuestionBankManagement />,
  },
  {
    path: "lesson-plans",
    element: <LessonPlanManagement />,
  },
  {
    path: "prompt-templates",
    element: <PromptTemplateManagement />,
  },
];