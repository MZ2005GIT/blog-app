import { useState } from "react";

function PostCard(props) {
    const [rm, setRM] = useState(0)
    return (
            <div className="post-content">

                <div className="post-meta">

                    <div className="posted-blog-name">

                        <a
                            href={`blog.html?id=${props.blog.id}`}
                            class="blog-title"
                        >
                            {props.blog.name}
                        </a>

                    </div>


                    <span>
                        {props.post.createdAt}
                    </span>

                </div>


                <div>

                    <h3 className="post-title">
                        {props.post.title}
                    </h3>


                    <p>
                        {props.post.content}
                    </p>


                    <a
                        href={`post.html?id=${props.post.id}`}
                        className="read-more"
                    >
                        Read More
                    </a>

                    <button
                        onClick = {() => setRM(rm + 1)}
                    >
                        rm : {rm}
                    </button>


                    <div className="post-tags">

                        {props.post.tags
                            .map(
                                tag =>
                                    <span key={tag}>#{tag}</span>
                            )
                        }

                    </div>

                </div>

            </div>
    );
}

export default PostCard;