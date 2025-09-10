import React from "react";
import { Outlet } from "react-router-dom";
import TeacherHeader from "../components/Teacher/Header";

const TeacherLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherHeader />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-[100px] pb-8">
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherLayout;

