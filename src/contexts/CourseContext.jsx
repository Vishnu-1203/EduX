// E:\Blockchain project\EduX\src\contexts\CourseContext.js

import React, { createContext, useState } from 'react';

export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const [courseData, setCourseData] = useState(null);

  return (
    <CourseContext.Provider value={{ courseData, setCourseData }}>
      {children}
    </CourseContext.Provider>
  );
};
