document.addEventListener("DOMContentLoaded", () => {

    loadPost();

    const form = document.getElementById("commentForm");


    form.addEventListener("submit", setUpCommentForm);

});

function useParams() {
    const params = new URLSearchParams(window.location.search);

    const postId = Number(params.get("id"));

    return postId;
}

function loadPost() {

    const postId = useParams();
    const posts = getPosts();

    const post = posts.find(post => post.id === postId);

    if (!post) {

        alert("Post not found.");

        window.location.href = "index.html";

        return;

    }

    const blogs = getBlogs();

    const blog = blogs.find(blog => blog.id === post.blogId);

    if (!blog) {

        alert("Blog not found.");

        return;

    }

    displayPost(post, blog);
    loadComments(postId);

}

function displayPost(post, blog) {
    const container = document.getElementById("postContainer");

    container.innerHTML = `
<div class="post-header">
        <div class="post-page-meta">

            <span>
                ${formatPostDate(post.createdAt)}
            </span>

            <a
                href="blog.html?id=${blog.id}"
                class="blog-title"
            >
                ${blog.name}
            </a>

        </div>


        <h1 class="post-title">
            ${post.title}
        </h1>
</div>

        <div class="post-body">

            <p>
                ${post.content}
            </p>

        </div>


        <div class="post-tags">

            ${post.tags.map(tag => `<span>#${tag}</span>`).join(" ")}

        </div>


        <div id="postActions" class="post-actions">
        </div>

    `;

    setupPostAction(post, blog);

}

function setupPostAction(post,blog) {
    const currentUserId = getCurrentUserId();
    
    const actions = document.getElementById("postActions");

    if (!currentUserId) {
        actions.innerHTML = `
            <a href="login.html" class="primary-button">
                Log in to Subscribe
            </a>
        `
        return;
    }

    const users = getUsers();
    const currentUser = users.find(user => user.id === currentUserId);

    if (!currentUser) {
        actions.innerHTML = `
            <a href="login.html" class="primary-button">
                Log in to Subscribe
            </a>
        `;
        return;
    }

    if (blog.userId === currentUserId) {
            actions.innerHTML = `
            <button id="deletePostButton" class="danger-button">
                Delete Post
            </button>
        `;
    } else if (!subscriptionExists(currentUserId, blog.id)) {
        actions.innerHTML = `
            <button id="subscribeButton" class="primary-button">
                Subscribe
            </button>
        `;
    } else {
        actions.innerHTML = `
            <button id="subscribedButton" class="primary-button" disabled>
                Subscribed
            </button>
        `;
    }

    const subscribeButton = document.getElementById("subscribeButton");
    
    if (subscribeButton) {
        subscribeButton.addEventListener("click", () => subscribeToBlog(currentUserId, blog.id, subscribeButton));
    }

    const deleteButton = document.getElementById("deletePostButton"); 
    
    if (deleteButton) {
        deleteButton.addEventListener("click", () => deletePost(currentUserId, blog, post));
    }
}

function subscriptionExists(userId, blogId) {
    return getSubscriptions().some(sub => sub.blogId === blogId && sub.userId === userId);
}

function subscribeToBlog(userId, blogId, subscribeButton) {
    const subscriptions = getSubscriptions();

    const subscription = {
        userId: userId,
        blogId: blogId
    }

    subscriptions.push(subscription);

    localStorage.setItem("subscriptions", JSON.stringify(subscriptions));

    subscribeButton.textContent =
    "Subscribed";

    subscribeButton.disabled =
    true;
    
} 

function deletePost(currentUserId, blog, postToDelete) {
    if (currentUserId !== blog.userId) return;
    if (blog.id !== postToDelete.blogId) return;
    
    const confirmed = confirm("Are you sure you want to delete this post?");

    if (!confirmed) return;

    const comments = JSON.parse(localStorage.getItem("comments")) || [];

    const updatedComments = comments.filter(comment => comment.postId !== postToDelete.id);

    localStorage.setItem("comments", JSON.stringify(updatedComments));

    const posts = getPosts();

    const updatedPosts = posts.filter(post => post.id !== postToDelete.id);

    localStorage.setItem("posts", JSON.stringify(updatedPosts));

    alert("Post deleted.");

    window.location.href = "dashboard.html";

}

function loadComments(postId) {

    const comments =
        JSON.parse(
            localStorage.getItem("comments")
        ) || [];


    const postComments =
        comments.filter(
            comment =>
                comment.postId === postId
        );


    const container =
        document.getElementById(
            "commentsContainer"
        );


    container.innerHTML = "";


    if (postComments.length === 0) {

        container.innerHTML = `
            <p class="no-comments">
                No comments yet. Be the first!
            </p>
        `;

        return;

    }

    postComments.forEach(comment => {
        const commentElement = document.createElement("div");
        commentElement.classList.add("comment");
        commentElement.innerHTML = `
            <div class="comment-meta">

                <strong>
                    ${getUsers().find(user => user.id === comment.userId).username}
                </strong>

                <span>
                    ${formatPostDate(
                        comment.createdAt
                    )}
                </span>

            </div>


            <p>
                ${comment.text}
            </p>
        `;
       container.appendChild(commentElement); 
    });

}

function setUpCommentForm(event) {
    event.preventDefault();
    const form = event.target;
    const currentUserId = getCurrentUserId();
    const users = getUsers();
    const currentUser = users.find(user => user.id === currentUserId);
    const postId = useParams();

    if (!currentUser) {
        alert("You must be logged in to comment.");
        window.location.href = "login.html";
        return;
    }

    const text = document.getElementById("commentText").value.trim();

    if (!text) return;

    const comments = JSON.parse(localStorage.getItem("comments")) || [];

    const newComment = {

        id: getNextCommentID(comments),

        postId: postId,

        userId: currentUserId,

        text: text,

        createdAt: new Date().toISOString()

    };

    comments.push(newComment);

    localStorage.setItem("comments", JSON.stringify(comments));

    form.reset();

    loadComments(postId);
}

function getNextCommentID(comments) {

    if (comments.length === 0) return 1;

    return comments[comments.length - 1].id + 1;

}