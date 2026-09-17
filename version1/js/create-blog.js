document.addEventListener("DOMContentLoaded", () => {
    handleCreateWindow();
    const createBlogForm = document.getElementById("createBlogForm");
    
    if (createBlogForm) {
        createBlogForm.addEventListener("submit", handleCreateBlog);
    }

})

function handleCreateWindow() {
    if (getUserState() === "loggedOut") {
        window.location.href = "register.html";
        return;
    }

    if (getUserState() === "loggedInWithBlog") {
        window.location.href = "dashboard.html";
        return;
    }
}

function handleCreateBlog(event) {
    event.preventDefault();

    if (localStorage.getItem("isLoggedIn") !== "true") {
        alert("You must be logged in to create a blog.");
        return;
    }

    const users = getUsers();

    const currentUserId = getCurrentUserId();

    const currentUser = users.find(user => user.id === currentUserId);

    if (!currentUser) {
        alert("Something went wrong.");
        localStorage.setItem("isLoggedIn", "false");
        window.location.href = "login.html";
        return;
    }

    if (currentUser.hasBlog) {
        alert("You already have a blog");
        window.location.href = "dashboard.html";
        return;
    }

    const blogName = document.getElementById("blogName").value.trim();

    const blogs = getBlogs();

    if (blogs.find( blog => blog.name === blogName)) {
        alert("A blog with the same name exists.");
        return;
    }

    const blogDescription = document.getElementById("blogDescription").value.trim();

    const newBlog = {
        id: getNextBlogId(),
        userId: getCurrentUserId(),
        name: blogName,
        description: blogDescription,
        createdAt: new Date().toISOString()
    };

    blogs.push(newBlog);

    localStorage.setItem("blogs", JSON.stringify(blogs));

    currentUser.hasBlog = true;

    saveUsers(users);

    alert("Blog created successfully!");

    window.location.href = "dashboard.html";
    return;

}

function getNextBlogId() {
    const blogs = getBlogs();

    if (blogs.length === 0) return 1;

    return blogs[blogs.length - 1].id + 1;
}

