document.addEventListener("DOMContentLoaded", () =>{
    handleFeedWindow();
    loadFeed();
})

function handleFeedWindow() {
    if (getUserState() === "loggedOut") {
        window.location.href = "register.html";
        return;
    }
}

function loadFeed() {
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
    
    const posts = getPosts();

    filterPosts(currentUserId, posts)
}

function filterPosts(currentUserId, posts) {

    const subscriptions = getSubscriptions();

    const userSubscriptions = subscriptions.filter(sub => sub.userId === currentUserId).map(sub => sub.blogId);

    const container =
        document.getElementById("feedPostsContainer"        );

    container.innerHTML = "";

    const filteredPosts = posts.filter(post => userSubscriptions.includes(post.blogId)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));;
        
    displayPosts(filteredPosts);
}

function displayPosts(posts) {

    const blogs = getBlogs();

    const container =
        document.getElementById(
            "feedPostsContainer"
        );

    container.innerHTML = "";

    if (posts.length === 0) {
        container.innerHTML = `
            <li class = "discover-post-card"> 
                <p>Nothing has been published yet by blogs you follow.</p>
            </li>
        `
    return;
    }

    posts.forEach(post => {

        const postElement =
            document.createElement("li");

        postElement.classList.add("discover-post-card");

        const blog =
            blogs.find(
                blog => blog.id === post.blogId
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


                <div>

                    <h3 class="post-title">
                        ${post.title}
                    </h3>


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


        container.appendChild(postElement);

    });

}