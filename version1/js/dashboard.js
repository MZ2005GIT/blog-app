document.addEventListener("DOMContentLoaded", () => {
    handleDashboardWindow();
    loadDashboard();
})

function handleDashboardWindow() {
    if (getUserState() === "loggedOut") {
        window.location.href = "register.html";
        return;
    }

    if (getUserState() === "loggedInNoBlog") {
        window.location.href = "create-blog.html";
        return;
    }
}

function loadDashboard(params) {

    const currentUserId = getCurrentUserId();

    if (!currentUserId) {
        window.location.href = "login.html";
        return;
    }

    const users = JSON.parse(localStorage.getItem("users"));

    const currentUser = users.find(user => user.id === currentUserId);
    
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }

    if (!currentUser.hasBlog) {
        window.location.href = "create-blog.html";
        return;
    }

    const blogs = getBlogs();

    const currentBlog = blogs.find(blog => blog.userId === currentUserId);

    if (!currentBlog) {
        window.location.href = "create-blog.html";
        return;
    }

    document.getElementById("blogName").textContent = currentBlog.name;
    document.getElementById("blogBio").textContent = currentBlog.description;

    const posts = getPosts();
    const myPosts = posts.filter(post => post.id === currentBlog.id);

    loadDashboardStats(currentBlog, myPosts);
    loadDashboardPosts(currentBlog, myPosts);
}

function loadDashboardStats(currentBlog, myPosts) {

    const comments = JSON.parse(localStorage.getItem("comments")) || [];

    const subscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [];

    const myPostsIds = myPosts.map(post => post.id);

    const myComments = comments.filter(comment => myPostsIds.includes(comment.postId));

    const mySubs = subscriptions.filter(sub => sub.blogId === currentBlog.id);

    document.getElementById("statPosts").textContent = myPosts.length;

    document.getElementById("statSubscribers").textContent = mySubs.length;

    document.getElementById("statComments").textContent = myComments.length;
}

function loadDashboardPosts(currentBlog, myPosts) {

    const container = document.getElementById("myBlogPostsContainer");

    container.innerHTML = "";

    if (myPosts.length === 0) {
        container.innerHTML = `
            <li class = "my-blog-post-card"> 
                <p>You haven't published anything yet.</p>
                <a href = "write-post.html">Write your first post</a>
            </li>
        `
    return;
    }

    myPosts.forEach(post => {
        const postElement = document.createElement("li");
        postElement.classList.add("my-blog-post-card");

        postElement.innerHTML = `
<div class="post-content">
    <div class="post-meta">

    <div class="posted-blog-name">
                    <a
                        href="blog.html?id=${currentBlog.id}"
                        class="blog-title"
                    >
                        ${currentBlog.name}
                    </a>
                    </div>
        <span>
            ${formatPostDate(post.createdAt)}
        </span>
    </div>

    <div>
    <h3 class="post-title">
            ${post.title}
        </h3>
        <p>
            ${getExcerpt(post.content)}
        </p>
        <a href="post.html?id=${post.id}" class="read-more">Read More</a>
        <div class="post-tags">
            ${post.tags.map(tag => `<span>${tag}</span>`).join(" ")}
        </div>
    </div>
</div>
        `;
        container.appendChild(postElement);
    });
}

