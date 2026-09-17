document.addEventListener("DOMContentLoaded", () =>{
    loadDiscovery();
})


function loadDiscovery() {
    const posts = getPosts();
    const blogs = getBlogs();

    displayPosts(posts, blogs);

    setupTagFiltering(posts, blogs);
}


function setupTagFiltering(posts, blogs) {
    const tagButtons = document.querySelectorAll(".tag-button");

    tagButtons.forEach(button => {
        button.addEventListener("click", () => {
            const selectedTag= button.dataset.tag;

            filterPosts(selectedTag, posts, blogs);

            tagButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");
        })
    })
}

function filterPosts(selectedTag, posts, blogs) {

    const container =
        document.getElementById(
            "discoverPostsContainer"
        );


    container.innerHTML = "";

    let filteredPosts;

    if (selectedTag === "all") {

        filteredPosts = [...posts];

    } else {
        filteredPosts = posts.filter(post => post.tags.includes(selectedTag));
    }

    filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    displayPosts(filteredPosts, blogs);
}

function displayPosts(posts, blogs) {

    const container =
        document.getElementById(
            "discoverPostsContainer"
        );


    container.innerHTML = "";
        
    if (posts.length === 0) {
        container.innerHTML = `
            <li class = "discover-post-card"> 
                <p>Nothing has been published yet under this tag.</p>
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