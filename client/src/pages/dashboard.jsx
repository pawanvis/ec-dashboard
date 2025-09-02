import React, { useState, useEffect } from 'react';
import { Bar, Pie, Line, Doughnut, PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
} from 'chart.js';
import { 
  FiUsers, 
  FiFileText, 
  FiMessageSquare, 
  FiDownload, 
  FiGlobe, 
  FiEdit, 
  FiCalendar, 
  FiTrendingUp, 
  FiMap, 
  FiAward,
  FiChevronRight,
  FiFile,
  FiUser,
  FiClock,
  FiBell
} from 'react-icons/fi';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale
);

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [applications, setApplications] = useState([]);
  const [counselling, setCounselling] = useState([]);
  const [brochures, setBrochures] = useState([]);
  const [partnerCounseling, setPartnerCounseling] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoints = [
          'students',
          'applications',
          'counselling',
          'brochure',
          'partner-counseling',
          'blogs',
          'events'
        ];

        const responses = await Promise.all(
          endpoints.map(endpoint => fetch(`https://api.ec-businessschool.in/api/${endpoint}`))
        );

        const data = await Promise.all(responses.map(res => res.json()));

        setStudents(data[0]);
        setApplications(data[1]);
        setCounselling(data[2]);
        setBrochures(data[3]);
        setPartnerCounseling(data[4]);
        setBlogs(data[5]);
        setEvents(data[6]);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
        ></motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 text-lg font-medium text-gray-700"
        >
          Loading dashboard...
        </motion.p>
      </div>
    </div>
  );

  const getDailyCounts = data => {
    if (!Array.isArray(data)) return {};
    return data.reduce((acc, item) => {
      const date = new Date(item.createdAt || item.blog_date || item.event_date).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
  };

  // Chart Data
  const genderData = {
    labels: ['Male', 'Female', 'Other'],
    datasets: [{
      label: 'Students by Gender',
      data: [
        students.filter(s => s.gender === 'Male').length,
        students.filter(s => s.gender === 'Female').length,
        students.filter(s => !['Male', 'Female'].includes(s.gender)).length
      ],
      backgroundColor: ['#3B82F6', '#EC4899', '#10B981'],
      borderWidth: 0,
      borderRadius: 4
    }]
  };

  const applicationStatusData = {
    labels: [...new Set(applications.map(a => a.status))],
    datasets: [{
      label: 'Applications by Status',
      data: [...new Set(applications.map(a => a.status))].map(
        status => applications.filter(a => a.status === status).length
      ),
      backgroundColor: '#6366F1',
      borderWidth: 0,
      borderRadius: 4
    }]
  };

  const counsellingDaily = getDailyCounts(counselling);
  const brochureDaily = getDailyCounts(brochures);
  const partnerDaily = getDailyCounts(partnerCounseling);

  const submissionTrendsData = {
    labels: Object.keys(counsellingDaily).sort(),
    datasets: [
      {
        label: 'Counselling Requests',
        data: Object.keys(counsellingDaily).sort().map(date => counsellingDaily[date]),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        borderWidth: 2,
        fill: true
      },
      {
        label: 'Brochure Requests',
        data: Object.keys(brochureDaily).sort().map(date => brochureDaily[date]),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        borderWidth: 2,
        fill: true
      },
      {
        label: 'Partner Counseling',
        data: Object.keys(partnerDaily).sort().map(date => partnerDaily[date]),
        borderColor: '#EC4899',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        tension: 0.3,
        borderWidth: 2,
        fill: true
      }
    ]
  };

  const courseInterestData = {
    labels: brochures.length
      ? [...new Set(brochures.map(b => b.courseInterest || 'Unknown'))]
      : ['No data'],
    datasets: [{
      label: 'Course Interest',
      data: brochures.length
        ? [...new Set(brochures.map(b => b.courseInterest || 'Unknown'))].map(
            course => brochures.filter(b => (b.courseInterest || 'Unknown') === course).length
          )
        : [1],
      backgroundColor: ['#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#6366F1'],
      borderWidth: 0
    }]
  };

  const studentRegionData = {
    labels: students.length
      ? [...new Set(students.map(s => s.region || 'Unknown'))].slice(0, 5)
      : ['No data'],
    datasets: [{
      label: 'Students by Region',
      data: students.length
        ? [...new Set(students.map(s => s.region || 'Unknown'))].slice(0, 5).map(
            region => students.filter(s => (s.region || 'Unknown') === region).length
          )
        : [1],
      backgroundColor: ['#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#6366F1'],
      borderWidth: 0
    }]
  };

  const eventAttendanceData = {
    labels: events.map(event => event.name),
    datasets: [{
      label: 'Event Attendance',
      data: events.map(event => event.attendance || 0),
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderColor: '#3B82F6',
      borderWidth: 1
    }]
  };

  const blogPerformanceData = {
    labels: blogs.map(blog => blog.title.substring(0, 15) + '...'),
    datasets: [{
      label: 'Blog Views',
      data: blogs.map(blog => blog.views || 0),
      backgroundColor: 'rgba(99, 102, 241, 0.7)',
      borderColor: '#6366F1',
      borderWidth: 1
    }]
  };

  const applicationSourcesData = {
    labels: ['Website', 'Social Media', 'Referral', 'Email', 'Other'],
    datasets: [{
      label: 'Application Sources',
      data: [45, 25, 15, 10, 5],
      backgroundColor: ['#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#6366F1'],
      borderWidth: 0
    }]
  };

  // Mini chart data for summary cards
  const getMiniChartData = (value, max) => {
    return {
      labels: [''],
      datasets: [{
        data: [value, max - value],
        backgroundColor: ['currentColor', 'transparent'],
        borderWidth: 0,
        cutout: '80%'
      }]
    };
  };

  const summaryCards = [
    { 
      title: 'Total Students', 
      value: students.length, 
      color: 'text-blue-600', 
      bg: 'bg-blue-50',
      icon: <FiUsers className="text-xl" />,
      chart: getMiniChartData(students.length, 1000)
    },
    { 
      title: 'Total Applications', 
      value: applications.length, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      icon: <FiFileText className="text-xl" />,
      chart: getMiniChartData(applications.length, 500)
    },
    { 
      title: 'Counselling', 
      value: counselling.length, 
      color: 'text-pink-600', 
      bg: 'bg-pink-50',
      icon: <FiMessageSquare className="text-xl" />,
      chart: getMiniChartData(counselling.length, 200)
    },
    { 
      title: 'Brochures', 
      value: brochures.length, 
      color: 'text-amber-600', 
      bg: 'bg-amber-50',
      icon: <FiDownload className="text-xl" />,
      chart: getMiniChartData(brochures.length, 300)
    },
    { 
      title: 'Partner Counseling', 
      value: partnerCounseling.length, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      icon: <FiGlobe className="text-xl" />,
      chart: getMiniChartData(partnerCounseling.length, 150)
    },
    { 
      title: 'Blog Posts', 
      value: blogs.length, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50',
      icon: <FiEdit className="text-xl" />,
      chart: getMiniChartData(blogs.length, 100)
    },
    { 
      title: 'Events', 
      value: events.length, 
      color: 'text-purple-600', 
      bg: 'bg-purple-50',
      icon: <FiCalendar className="text-xl" />,
      chart: getMiniChartData(events.length, 50)
    },
    { 
      title: 'Conversion Rate', 
      value: '68%', 
      color: 'text-green-600', 
      bg: 'bg-green-50',
      icon: <FiTrendingUp className="text-xl" />,
      chart: getMiniChartData(68, 100)
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className='mb-5'>
        <h1 class="text-lg font-medium text-gray-800 dark:text-white ">Admin Dashboard</h1>
        <p class="text-gray-600 mt-1">Welcome back! Here's an overview of your data.</p>
      </div>

      {/* Summary Cards with Mini Charts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {summaryCards.map((card, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3, delay: i * 0.1 }}
            className={`${card.bg} rounded-lg shadow-sm p-5 hover:shadow-md transition-all duration-300 border border-gray-100`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className={`text-2xl font-semibold mt-1 ${card.color}`}>{card.value}</p>
              </div>
              <div className={`${card.color} p-2 rounded-md`}>
                {card.icon}
              </div>
            </div>
            
            {/* Mini Doughnut Chart */}
            <div className="mt-3 h-16 relative">
              <div className="absolute right-0 -top-2 w-16 h-16">
                <Doughnut 
                  data={card.chart} 
                  options={{
                    cutout: '70%',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: { enabled: false }
                    }
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        {/* Applications by Status */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Applications by Status</h2>
            <div className="text-sm text-gray-500">Last 30 days</div>
          </div>
          <div className="h-72">
            <Bar 
              data={applicationStatusData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      drawBorder: false,
                      color: 'rgba(0, 0, 0, 0.05)'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }} 
            />
          </div>
        </motion.div>

        {/* Students by Gender */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Students by Gender</h2>
            <div className="text-sm text-gray-500">Total: {students.length}</div>
          </div>
          <div className="h-72">
            <Pie 
              data={genderData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      usePointStyle: true,
                      padding: 15,
                      font: {
                        family: 'Inter, sans-serif'
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </motion.div>
      </div>

      {/* Second Row of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        {/* Students by Region */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiMap className="mr-2 text-blue-500" /> Students by Region
            </h2>
          </div>
          <div className="h-64">
            <PolarArea 
              data={studentRegionData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      usePointStyle: true,
                      padding: 15,
                      font: {
                        family: 'Inter, sans-serif'
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </motion.div>

        {/* Course Interest */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Course Interest</h2>
          </div>
          <div className="h-64">
            <Doughnut 
              data={courseInterestData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      usePointStyle: true,
                      padding: 15,
                      font: {
                        family: 'Inter, sans-serif'
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </motion.div>

        {/* Application Sources */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm p-6 border border-gray-100"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Application Sources</h2>
          </div>
          <div className="h-64">
            <Pie 
              data={applicationSourcesData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: {
                      usePointStyle: true,
                      padding: 15,
                      font: {
                        family: 'Inter, sans-serif'
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </motion.div>
      </div>

      {/* Full Width Chart */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3, delay: 0.7 }}
        className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 mb-5"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Daily Submission Trends</h2>
          <div className="text-sm text-gray-500">Last 30 days</div>
        </div>
        <div className="h-80">
          <Line 
            data={submissionTrendsData} 
            options={{ 
              responsive: true, 
              maintainAspectRatio: false,
              interaction: {
                mode: 'index',
                intersect: false
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    drawBorder: false,
                    color: 'rgba(0, 0, 0, 0.05)'
                  }
                },
                x: {
                  grid: {
                    drawBorder: false
                  }
                }
              },
              plugins: {
                tooltip: {
                  mode: 'index',
                  intersect: false,
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  titleFont: {
                    family: 'Inter, sans-serif'
                  },
                  bodyFont: {
                    family: 'Inter, sans-serif'
                  }
                }
              }
            }} 
          />
        </div>
      </motion.div>

      {/* Recent Activity - Premium Design */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3, delay: 0.8 }}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 overflow-hidden"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
            <p className="text-sm text-gray-500">Latest updates and actions</p>
          </div>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
            View All <FiChevronRight className="ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Recent Students with Avatars */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                <FiUsers className="text-lg" />
              </div>
              <h3 className="font-semibold text-gray-800">New Students</h3>
            </div>
            <ul className="space-y-3">
              {students.slice(0, 4).map((student, idx) => (
                <motion.li 
                  key={idx}
                  whileHover={{ x: 5 }}
                  className="flex items-center p-3 bg-white rounded-lg shadow-xs hover:shadow-sm transition-all"
                >
                  <div className={`relative mr-3 ${idx < 3 ? '' : 'opacity-60'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${student.gender === 'Female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                      {student.name.charAt(0)}
                    </div>
                    {idx < 2 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-100 border-2 border-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className={`font-medium ${idx < 3 ? 'text-gray-800' : 'text-gray-600'}`}>
                      {student.name}
                    </p>
                    <p className="text-xs text-gray-500">{student.programApplied}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Recent Applications with Status */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">
                <FiFileText className="text-lg" />
              </div>
              <h3 className="font-semibold text-gray-800">Applications</h3>
            </div>
            <ul className="space-y-3">
              {applications.slice(0, 4).map((app, idx) => (
                <motion.li 
                  key={idx}
                  whileHover={{ x: 5 }}
                  className="flex items-center p-3 bg-white rounded-lg shadow-xs hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3">
                    <FiFile className="text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-800 truncate">{app.name}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ml-2 ${
                        app.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : app.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{app.program || 'No program specified'}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-400">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Recent Counselling Sessions */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="bg-amber-100 text-amber-600 p-2 rounded-lg mr-3">
                <FiMessageSquare className="text-lg" />
              </div>
              <h3 className="font-semibold text-gray-800">Counselling</h3>
            </div>
            <ul className="space-y-3">
              {counselling.slice(0, 4).map((session, idx) => (
                <motion.li 
                  key={idx}
                  whileHover={{ x: 5 }}
                  className="flex items-center p-3 bg-white rounded-lg shadow-xs hover:shadow-sm transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3">
                    <FiUser className="text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800">{session.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        {session.interestedCourse || 'No course specified'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        session.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    <div className="flex items-center mt-1">
                      <FiClock className="text-xs text-gray-400 mr-1" />
                      <span className="text-xs text-gray-400">
                        {new Date(session.date).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* System Notifications */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-lg">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                <FiBell className="text-lg" />
              </div>
              <h3 className="font-semibold text-gray-800">Notifications</h3>
            </div>
            <ul className="space-y-3">
              <motion.li 
                whileHover={{ x: 5 }}
                className="flex items-start p-3 bg-white rounded-lg shadow-xs hover:shadow-sm transition-all"
              >
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3 mt-1">
                  <FiDownload className="text-sm" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">New brochure download</p>
                  <p className="text-xs text-gray-500 mt-1">MBA Brochure was downloaded 24 times today</p>
                  <span className="text-xs text-gray-400 mt-1 flex items-center">
                    <FiClock className="mr-1" /> 2 hours ago
                  </span>
                </div>
              </motion.li>
              
              <motion.li 
                whileHover={{ x: 5 }}
                className="flex items-start p-3 bg-white rounded-lg shadow-xs hover:shadow-sm transition-all"
              >
                <div className="bg-amber-100 text-amber-600 p-2 rounded-lg mr-3 mt-1">
                  <FiCalendar className="text-sm" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Upcoming event</p>
                  <p className="text-xs text-gray-500 mt-1">"Study Abroad Fair" starts tomorrow</p>
                  <span className="text-xs text-gray-400 mt-1 flex items-center">
                    <FiClock className="mr-1" /> 1 day ago
                  </span>
                </div>
              </motion.li>
              
              <motion.li 
                whileHover={{ x: 5 }}
                className="flex items-start p-3 bg-white rounded-lg shadow-xs hover:shadow-sm transition-all"
              >
                <div className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3 mt-1">
                  <FiTrendingUp className="text-sm" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Performance update</p>
                  <p className="text-xs text-gray-500 mt-1">Conversion rate increased by 12% this week</p>
                  <span className="text-xs text-gray-400 mt-1 flex items-center">
                    <FiClock className="mr-1" /> 3 days ago
                  </span>
                </div>
              </motion.li>
            </ul>
          </div>
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-500">Today's Applications</p>
              <p className="text-xl font-bold text-blue-600">24</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Pending Counselling</p>
              <p className="text-xl font-bold text-amber-600">8</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Upcoming Events</p>
              <p className="text-xl font-bold text-purple-600">3</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">New Messages</p>
              <p className="text-xl font-bold text-green-600">12</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;