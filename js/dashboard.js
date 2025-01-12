// Dashboard script
document.addEventListener("DOMContentLoaded", () => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!loggedInUser) {
        // Redirect to login if not logged in
        window.location.href = "index.html";
    } else {
        // Populate dashboard
        document.getElementById("courseName").textContent = loggedInUser.course;
        document.getElementById("progress").textContent = `${loggedInUser.progress.lessonsCompleted} / ${loggedInUser.progress.totalLessons}`;
    }

    // Logout functionality
    document.getElementById("logout").addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        window.location.href = "index.html";
    });
});
