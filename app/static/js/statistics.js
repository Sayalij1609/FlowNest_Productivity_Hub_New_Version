// =============================
// FlowNest — Statistics Charts
// =============================
// Requires Chart.js loaded via CDN and data globals
// (taskStatusData, weeklyData, monthlyData, categoryData, habitData)
// defined in the template before this script loads.

// Theme-aware chart defaults
const chartTextColor = getComputedStyle(document.documentElement)
  .getPropertyValue('--text-secondary').trim() || '#94a3b8';
const chartGridColor = 'rgba(148, 163, 184, 0.1)';

Chart.defaults.color = chartTextColor;
Chart.defaults.borderColor = chartGridColor;
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.padding = 16;

// =============================
// Task Status — Doughnut
// =============================
const taskCtx = document.getElementById("taskStatusChart");
if (taskCtx && typeof taskStatusData !== 'undefined') {
    new Chart(taskCtx, {
        type: "doughnut",
        data: {
            labels: ["Completed", "Pending", "Archived"],
            datasets: [{
                data: [
                    taskStatusData.completed,
                    taskStatusData.pending,
                    taskStatusData.archived
                ],
                backgroundColor: ["#22c55e", "#f59e0b", "#6b7280"],
                borderWidth: 0,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: { position: "bottom" }
            }
        }
    });
}

// =============================
// Weekly Productivity — Line
// =============================
const weeklyCtx = document.getElementById("weeklyChart");
if (weeklyCtx && typeof weeklyData !== 'undefined') {
    new Chart(weeklyCtx, {
        type: "line",
        data: {
            labels: weeklyData.labels,
            datasets: [{
                label: "Completed Tasks",
                data: weeklyData.values,
                borderColor: "#6366f1",
                backgroundColor: "rgba(99, 102, 241, 0.1)",
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointBackgroundColor: "#6366f1",
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 },
                    grid: { color: chartGridColor }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

// =============================
// Monthly Productivity — Bar
// =============================
const monthlyCtx = document.getElementById("monthlyChart");
if (monthlyCtx && typeof monthlyData !== 'undefined') {
    new Chart(monthlyCtx, {
        type: "bar",
        data: {
            labels: monthlyData.labels,
            datasets: [{
                label: "Completed Tasks",
                data: monthlyData.values,
                backgroundColor: "rgba(99, 102, 241, 0.6)",
                borderColor: "#6366f1",
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { precision: 0 },
                    grid: { color: chartGridColor }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

// =============================
// Category Distribution — Doughnut
// =============================
const categoryCtx = document.getElementById("categoryChart");
if (categoryCtx && typeof categoryData !== 'undefined') {
    new Chart(categoryCtx, {
        type: "doughnut",
        data: {
            labels: categoryData.labels,
            datasets: [{
                data: categoryData.values,
                backgroundColor: [
                    "#6366f1", "#06b6d4", "#22c55e",
                    "#f59e0b", "#ef4444", "#a855f7",
                    "#ec4899", "#6b7280"
                ],
                borderWidth: 0,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: { position: "bottom" }
            }
        }
    });
}

// =============================
// Habit Completion — Horizontal Bar
// =============================
const habitCtx = document.getElementById("habitChart");
if (habitCtx && typeof habitData !== 'undefined') {
    new Chart(habitCtx, {
        type: "bar",
        data: {
            labels: habitData.labels,
            datasets: [{
                label: "Completion Rate (%)",
                data: habitData.values,
                backgroundColor: "rgba(6, 182, 212, 0.6)",
                borderColor: "#06b6d4",
                borderWidth: 1,
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            indexAxis: "y",
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: chartGridColor }
                },
                y: {
                    grid: { display: false }
                }
            }
        }
    });
}