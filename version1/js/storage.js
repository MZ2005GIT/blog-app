document.addEventListener("DOMContentLoaded", () => {

    initializeStorage();

});

function initializeStorage() {

    if (!localStorage.getItem("users")) {
        localStorage.setItem("users", JSON.stringify([]));
    }

    if (!localStorage.getItem("blogs")) {
        localStorage.setItem("blogs", JSON.stringify([]));
    }

    if (!localStorage.getItem("posts")) {
        localStorage.setItem("posts", JSON.stringify([]));
    }

    if (!localStorage.getItem("comments")) {
        localStorage.setItem("comments", JSON.stringify([]));
    }

    if (!localStorage.getItem("subscriptions")) {
        localStorage.setItem("subscriptions", JSON.stringify([]));
    }

}