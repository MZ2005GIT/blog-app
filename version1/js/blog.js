document.addEventListener("DOMContentLoaded", () => {

    loadBlog();

});

function getBlogId() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return Number(
        params.get("id")
    );

}

function loadBlog() {

    const blogId = getBlogId();

    const blogs = getBlogs();

    const blog =
        blogs.find(
            blog => blog.id === blogId
        );


    if (!blog) {

        alert("Blog not found.");

        window.location.href =
            "index.html";

        return;

    }

    if (getUserState() !== "loggedOut") {
        const currentUserId = getCurrentUserId();

        const userBlog = blogs.find(blog => blog.userId === currentUserId);

        if (!userBlog || blogId !== currentUserId) {
            const blogHeader = document.getElementById("blogHeader");

            const subscribeButtonDiv = document.createElement("div");

            if (subscriptionExists(currentUserId, blogId)) {
                subscribeButtonDiv.innerHTML = `
                <button id="subscribedButton" class="primary-button">
                Subscribed
                </button>
            `;
            } else {
                subscribeButtonDiv.innerHTML = `
                <button id="subscribeButton" class="primary-button">
                Subscribe
                </button>
            `;
            }
            
            blogHeader.appendChild(subscribeButtonDiv);

            const subscribeButton = document.getElementById("subscribeButton");
    
            if (subscribeButton) {
                subscribeButton.addEventListener("click", () => subscribeToBlog(currentUserId, blogId, subscribeButton));
            }
        }

    }

    displayBlog(blog);

    loadBlogPosts(blog);    

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

function displayBlog(blog) {

    document.getElementById("blogName").textContent =
        blog.name;

    document.getElementById("blogBio").textContent =
        blog.description;

}

function loadBlogPosts(blog) {

    const posts = getPosts();

    const blogPosts =
        posts.filter(
            post => post.blogId === blog.id
        );


    const container =
        document.getElementById(
            "blogPostsContainer"
        );


    container.innerHTML = "";


    if (blogPosts.length === 0) {

        container.innerHTML = `
            <li class="no-posts">
                <p>
                    This blog hasn't published
                    any posts yet.
                </p>
            </li>
        `;

        return;

    }


    blogPosts.forEach(post => {

        const postElement =
            document.createElement("li");


        postElement.classList.add(
            "my-blog-post-card"
        );


        postElement.innerHTML = `

            <div class="post-content">

                <div class="post-meta">
<div class="posted-blog-name">
                    <a
                        href="blog.html?id=${blog.id}"
                        class="blog-title"
                    >
                        ${blog.name}
                    </a>
                    </div>
                    <span>
                        ${formatPostDate(
                            post.createdAt
                        )}
                    </span>

                </div>


                <h3 class="post-title">
                    ${post.title}
                </h3>


                <div>

                    <p>
                        ${getExcerpt(
                            post.content
                        )}
                    </p>


                    <a
                        href="post.html?id=${post.id}"
                        class="read-more"
                    >
                        Read More
                    </a>


                    <div class="post-tags">

                        ${post.tags
                            .map(
                                tag =>
                                    `<span>#${tag}</span>`
                            )
                            .join(" ")}

                    </div>

                </div>

            </div>

        `;


        container.appendChild(
            postElement
        );

    });

    loadBlogStats(blog, blogPosts)

}


function loadBlogStats(currentBlog, myPosts) {

    const comments = JSON.parse(localStorage.getItem("comments")) || [];

    const subscriptions = JSON.parse(localStorage.getItem("subscriptions")) || [];

    const myPostsIds = myPosts.map(post => post.id);

    const myComments = comments.filter(comment => myPostsIds.includes(comment.postId));

    const mySubs = subscriptions.filter(sub => sub.blogId === currentBlog.id);

    document.getElementById("statPosts").textContent = myPosts.length;

    document.getElementById("statSubscribers").textContent = mySubs.length;

    document.getElementById("statComments").textContent = myComments.length;
}
