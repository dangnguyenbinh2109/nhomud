from src.domain.models.icourse_repository import ICourseRepository
from src.domain.models.course import Course
from src.infrastructure.databases import Base
from src.domain.models.todo import Todo
from typing import List, Optional
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from src.config import Config
from sqlalchemy import Column, Integer, String, DateTime
from src.infrastructure.databases import Base
from dotenv import load_dotenv
from src.utils.env_loader import load_env
load_env()
load_dotenv()

class CourseRepository(ICourseRepository):
    def __init__(self):
        self._courses = []
        self._id_counter = 1

    def add(self, course: Course) -> Course:
        course.id = self._id_counter
        self._id_counter += 1
        self._todos.append(course)
        return course

    def get_by_id(self, course_id: int) -> Optional[Course]:
        for course in self._courses:
            if course.id == course_id:
                return course
        return None

    def list(self) -> List[Course]:
        return self._courses

    def update(self, course: Course) -> Course:
        for idx, t in enumerate(self._courses):
            if t.id == course.id:
                self._courses[idx] = course
                return course
        raise ValueError('course not found')

    def delete(self, course_id: int) -> None:
        self._courses = [t for t in self._courses if t.id != course_id] 

