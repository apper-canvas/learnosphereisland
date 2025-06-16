import Home from '@/components/pages/Home'
import Courses from '@/components/pages/Courses'
import CourseDetail from '@/components/pages/CourseDetail'
import LessonViewer from '@/components/pages/LessonViewer'
import MyLearning from '@/components/pages/MyLearning'
import Progress from '@/components/pages/Progress'
import Onboarding from '@/components/pages/Onboarding'

export const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/onboarding',
    element: <Onboarding />,
  },
  {
    path: '/courses',
    element: <Courses />,
  },
  {
    path: '/courses/:courseId',
    element: <CourseDetail />,
  },
  {
    path: '/courses/:courseId/lessons/:lessonId',
    element: <LessonViewer />,
  },
  {
    path: '/my-learning',
    element: <MyLearning />,
  },
  {
    path: '/progress',
    element: <Progress />,
  },
]