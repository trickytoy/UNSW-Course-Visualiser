export default function transformCourseData(courseData) {
  const nodes = [];
  const edges = [];
  const courseMap = {};

  // Function to extract course codes from condition strings, handles extra text like UOC or program names
  function extractCourseCodes(condition) {
    const courseCodes = condition.match(/COMP\d{4}/g); // Match all course codes in the condition
    return courseCodes || [];
  }

  // Function to determine the course type based on course code
  function determineCourseType(courseCode, manualType) {
    // If a manual course type is provided, use it
    if (manualType) return manualType;

    // Otherwise, infer from the course code
    if (/COMP1\d{3}/.test(courseCode)) return "Software_Fundamentals";
    if (/COMP2\d{3}/.test(courseCode)) return "Web_Development";
    if (/COMP3\d{3}/.test(courseCode)) return "Security";
    if (/COMP4\d{3}/.test(courseCode)) return "Infrastructure";
    if (/COMP5\d{3}/.test(courseCode)) return "AI";
    if (/COMP6\d{3}/.test(courseCode)) return "Database";
    if (/COMP7\d{3}/.test(courseCode)) return "Networking";
    return "Other"; // Default case
  }

  // Iterate through each course to build nodes and edges
  courseData.forEach((course) => {
    const courseId = parseInt(course.courseCode.replace("COMP", ""));
    courseMap[course.courseCode] = courseId;

    const level = Math.floor(courseId / 1000); // Determine course level (1XXX, 2XXX, etc.)
    const courseType = determineCourseType(course.courseCode, course.courseType); // Determine course type, respecting manual input

    // Add course node with type and level info
    nodes.push({
      id: courseId,
      label: course.courseCode,
      title: `${course.courseTitle}`,
      desc: course.courseDesc,
      group: level, // Group determines color-coding
      shape: "box", // Rectangle shape
      font: { color: "#FFFFFF", size: 14 },
      color: {
        background:
          level === 1 ? "#6C63FF" :
          level === 2 ? "#FFA500" :
          level === 3 ? "#FF5733" :
          level === 4 ? "#33C3FF" :
          level === 5 ? "#8E44AD" :
          level === 6 ? "#27AE60" : // Level 6: Green
          level === 9 ? "#E91E63" : // Level 9: Pink
          "#34495E", // Default for undefined levels
        border: "#3F3D56",
        highlight: { background: "#FFD369", border: "#FFC107" },
      },
      margin: 10,
      courseType: courseType, // Add course type
      courseLevel: level, // Add course level
    });

    // Process various prerequisite conditions and create edges between nodes
    const prereqPatterns = [
      /Prerequisite[s]?[:\s]?(.+)/, // Standard prerequisite pattern
      /Co-requisite[s]?[:\s]?(.+)/, // Co-requisite pattern
      /Corequisite[s]?[:\s]?(.+)/, // Corequisite pattern
      /Requirement[s]?[:\s]?(.+)/, // For other cases like "Requirements"
      /Prerequisite or Co-requisite[s]?[:\s]?(.+)/, // New pattern for "Prerequisite or Co-requisite"
    ];

    let prereqCourses = [];

    // Loop through each regex to match prerequisites and co-requisites
    prereqPatterns.forEach((pattern) => {
      const prereqMatch = course.courseCondition.match(pattern);
      if (prereqMatch) {
        const prereqString = prereqMatch[1];
        prereqCourses = prereqCourses.concat(extractCourseCodes(prereqString));
      }
    });

    // Handle cases where there are extra conditions like "and completion of 96 UOC"
    if (!prereqCourses.length) {
      const extraCourseMatch = course.courseCondition.match(/COMP\d{4}/g);
      if (extraCourseMatch) {
        prereqCourses = extraCourseMatch;
      }
    }

    // Loop through extracted prerequisites and create edges
    prereqCourses.forEach((prereq) => {
      const prereqId = courseMap[prereq] || parseInt(prereq.replace("COMP", ""));
      if (prereqId) {
        edges.push({
          from: prereqId,
          to: courseId,
          arrows: { to: { enabled: true } },
          color: { color: "#B0BEC5", highlight: "#FFC107" },
        });
      }
    });
  });

  return { nodes, edges };
}
