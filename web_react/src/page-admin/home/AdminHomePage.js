import React, { useEffect, useRef, useState } from "react";
import styles from "./Dashboard.css";
import { request } from "../../util/request";
function AdminHomePage() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [enrolls, setEnrolls] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    // getListCourses();
    getListEnrolls();
    getListUsers();
    getListStudents();
    getListTeachers();
    getListClassrooms();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:8085/api/category");
        const data = await response.json();
        setCourses(data.list);
      } catch (error) {
        console.error("Error fetching the courses:", error);
      }
    };

    fetchCourses();
  }, []);
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredCourses = courses.filter((course) =>
    course.Name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const getListCourses = async () => {
    const res = await request("category", "get", {});
    if (res) {
      setCourses(res.list);
      console.log({ res });
    }
  };

  const getListEnrolls = async () => {
    const resenroll = await request("student_register", "get");
    if (resenroll) {
      setEnrolls(resenroll.list);
      console.log({ resenroll });
    }
  };

  const getListClassrooms = async () => {
    const resclass = await request("classroom", "get", {});
    if (resclass) {
      setClassrooms(resclass.list);
      console.log({ resclass });
    }
  };

  const getListTeachers = async () => {
    const resteacher = await request("teacher", "get", {});
    if (resteacher) {
      setTeachers(resteacher.list);
      console.log({ resteacher });
    }
  };
  const getListStudents = async () => {
    const resstu = await request("student", "get", {});
    if (resstu) {
      setStudents(resstu.list);
      console.log({ resstu });
    }
  };

  const getListUsers = async () => {
    const resuser = await request("users", "get", {});
    if (resuser) {
      setUsers(resuser.list);
      console.log({ resuser });
    }
  };

  return (
    <div className="dashboard-overview">
      <h1>Dashboard Overview</h1>
      <div className="sales-analysis">
        <h2>Analysis</h2>
        <div className="metrics-container">
          <MetricCircle value={81} label="Enrollment" />
          <MetricCircle value={22} label="Course Growth" />
          <MetricCircle value={62} label="Total users" />
        </div>
      </div>
      <div className="stats-grid">
        <StatCard title="Courses" value={enrolls?.length} icon="📚" />
        <StatCard title="Classrooms" value={classrooms?.length} icon="🏫" />
        <StatCard title="Enrollments" value={enrolls?.length} icon="📝" />
        <StatCard title="Teachers" value={teachers?.length} icon="👨‍🏫" />
        <StatCard title="Students" value={students?.length} icon="🎓" />
        <StatCard title="Total Users" value={users?.length} icon="👥" />
      </div>
      <div className={`${styles} dashboard-content`}>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for category..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div className="courses-grid">
          {filteredCourses.length == 0 ? (
            <div className="course-card">No category available</div>
          ) : (
            filteredCourses.map((course) => (
              <div key={course.Id} className="course-card">
                <img
                  src={
                    course.Image ||
                    "https://ditrppro.com/images/defaultcourse.jpg"
                  }
                  alt={course.Name}
                />
                <h3>{course.Name}</h3>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <h2>{value}</h2>
        <p>{title}</p>
      </div>
    </div>
  );
};

const MetricCircle = ({ value, label }) => {
  const circumference = 2 * Math.PI * 45; // 45 is the radius
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="metric-circle">
      <svg width="120" height="120" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          stroke="#2a2e37"
          strokeWidth="10"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          stroke="#3498db"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dy=".3em"
          className="percentage"
        >
          {value}%
        </text>
      </svg>
      <p className="label">{label}</p>
    </div>
  );
};

export default AdminHomePage;
