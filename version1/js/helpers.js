
function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function getBlogs() {
    return JSON.parse(localStorage.getItem("blogs")) || [];
}

function getCurrentUserId() {
    return Number(localStorage.getItem("currentUserId"));
}

function getUserState() {

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {

        return "loggedOut";

    }

    const currentUserId = getCurrentUserId();

    const users = JSON.parse(localStorage.getItem("users"));

    const currentUser = users.find(user => user.id === currentUserId);

    if (!currentUser.hasBlog) {

        return "loggedInNoBlog";

    }

    return "loggedInWithBlog";

}

function getPosts() {
    return JSON.parse(localStorage.getItem("posts")) || [];
}
function formatPostDate(date) {
    return new Date(date).toLocaleDateString("en-US", {year:"numeric", month:"long", day:"2-digit"});
}

function getExcerpt(content) {
    const maxLength = 150;

    if (content.length <= maxLength) {
        return content;
    }

    return content.substring(0, maxLength) + "...";
}

function getSubscriptions() {
    return JSON.parse(localStorage.getItem("subscriptions")) || [];
}