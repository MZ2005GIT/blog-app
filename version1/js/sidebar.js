document.addEventListener("DOMContentLoaded", () =>{
    loadSidebar();
})

async function loadSidebar() {

    const sidebarContainer =
        document.getElementById("sidebarContainer");


    console.log("Container:", sidebarContainer);


    try {

        const response =
            await fetch("components/sidebar.html");


        console.log("Response:", response);

        console.log("Status:", response.status);


        const sidebarHTML =
            await response.text();


        console.log("HTML:", sidebarHTML);


        sidebarContainer.innerHTML =
            sidebarHTML;


    } catch (error) {

        console.error("ERROR:", error);

    }

    updateSidebar();

}

function updateSidebar() {
    const navigation = document.getElementById("sidebarNavigation")
    const auth = document.getElementById("sidebarAuth")

    if (!navigation || !auth) {

        console.error(
            "Sidebar navigation elements not found."
        );

        return;
    }

    navigation.innerHTML = "";

    auth.innerHTML = "";

    const state = getUserState();

    navigation.innerHTML = `

        <a href="index.html">

            <span class="nav-icon">
                ⌂
            </span>

            <span class="nav-text">
                Home
            </span>

        </a>


        <a href="discover.html">

            <span class="nav-icon">
                ⌕
            </span>

            <span class="nav-text">
                Discover
            </span>

        </a>


        <a href="contact.html">

            <span class="nav-icon">
                ✉
            </span>

            <span class="nav-text">
                Contact
            </span>

        </a>

    `;

    if (state === "loggedOut") {

        auth.innerHTML = `

            <a href="login.html">

                <span class="nav-icon">
                    🔐
                </span>

                <span class="nav-text">
                    Login
                </span>

            </a>


            <a href="register.html">

                <span class="nav-icon">
                    ✦
                </span>

                <span class="nav-text">
                    Create Account
                </span>

            </a>

        `;
    }

    else if (state === "loggedInNoBlog") {

        navigation.innerHTML += `

            <a href="feed.html">

                <span class="nav-icon">
                    ✎
                </span>

                <span class="nav-text">
                    Feed
                </span>

            </a>
            
            <a href="create-blog.html">

                <span class="nav-icon">
                    ✎
                </span>

                <span class="nav-text">
                    Create Blog
                </span>

            </a>

        `;


        addSignOutButton(auth);

    }

    else if (state === "loggedInWithBlog") {

        navigation.innerHTML += `

            <a href="feed.html">

                <span class="nav-icon">
                    ✎
                </span>

                <span class="nav-text">
                    Feed
                </span>

            </a>

            <a href="dashboard.html">

                <span class="nav-icon">
                    ▦
                </span>

                <span class="nav-text">
                    Dashboard
                </span>

            </a>
            

            <a href="write-post.html">

                <span class="nav-icon">
                    ✎
                </span>

                <span class="nav-text">
                    Write Post
                </span>

            </a>


            <a href="subscribers.html">

                <span class="nav-icon">
                    ♧
                </span>

                <span class="nav-text">
                    Subscribers
                </span>

            </a>


            <a href="settings.html">

                <span class="nav-icon">
                    ⚙
                </span>

                <span class="nav-text">
                    Settings
                </span>

            </a>

        `;


        addSignOutButton(auth);

    }

}

function addSignOutButton(auth) {

    auth.innerHTML = `

        <a href="#" id="logoutButton">

            <span class="nav-icon">
                ⇥
            </span>

            <span class="nav-text">
                Sign Out
            </span>

        </a>

    `;

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    logoutButton.addEventListener(
        "click",
        (event) => {

            event.preventDefault();


            // Remove login state

            localStorage.removeItem(
                "isLoggedIn"
            );

            localStorage.removeItem(
                "hasBlog"
            );


            // Return to home

            window.location.href =
                "index.html";

        }
    );

}