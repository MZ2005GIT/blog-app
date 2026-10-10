import Header from "./Header";
import Navbar from "./sidebar";
import PostCard from "./Postcard";

function App() {

    const posts = [
    {
        id: 1,
        title: "Learning React",
        excerpt: "I am learning React by rebuilding BlogSpace.",
        tags: ["react", "javascript", "web"]
    },
    {
        id: 2,
        title: "My Second Post",
        excerpt: "This is another post on my blog.",
        tags: ["coding", "learning"]
    },
    {
        id: 3,
        title: "Building BlogSpace",
        excerpt: "I am slowly converting my old JavaScript app to React.",
        tags: ["blogspace", "react"]
    }
];

    const blog = {
        id: 1,
        name: "My Blog"
    };

    return (
        <>
            <Header></Header>
            <Navbar></Navbar>
            {posts.map(post => (<PostCard
                key = {post.id}
                post = {post}
                blog = {blog}
                date="September 26, 2026"
                excerpt={post.excerpt}
            >
            </PostCard>))}
        </>
    );
}

export default App;