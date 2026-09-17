document.addEventListener("DOMContentLoaded", () => {
    handlePostWindow();
    const postForm = document.getElementById("postForm");
    
    if (postForm) {
        postForm.addEventListener("submit", handlePostForm);
    }

})

function handlePostWindow() {
    if (getUserState() === "loggedOut") {
        window.location.href = "register.html";
        return;
    }

    if (getUserState() === "loggedInNoBlog") {
        window.location.href = "create-blog.html";
        return;
    }
}

function handlePostForm(event) {
    event.preventDefault();

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

    const title = document.getElementById("postTitle").value.trim();

    const content = document.getElementById("postContent").value.trim();

    const selectedTags = Array.from(document.querySelectorAll('input[type="checkbox"][name="tags"]:checked')).map(tagCheckbox => tagCheckbox.value);

    const customTagsString = document.getElementById("customTags").value.trim();

    const customTags = customTagsString? customTagsString.split(",").map(tag => tag.trim().toLowerCase()).filter(tag => tag !== "") : [];
    
    const tags = [...selectedTags, ...customTags];

    const posts = getPosts();

    const newPost = {
        id : getNextPostId(),
        blogId : currentBlog.id,
        title : title,
        content : content,
        tags : tags,
        createdAt : new Date().toISOString()
    }

    posts.push(newPost);

    localStorage.setItem("posts", JSON.stringify(posts));

    alert("Post published successfully!");

    window.location.href =
        "dashboard.html";

}

function getNextPostId() {
    const posts = getPosts();

    if (posts.length === 0) {
        return 1;
    }

    return posts[posts.length - 1].id + 1;
}