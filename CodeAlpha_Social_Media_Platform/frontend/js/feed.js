
// =====================================================
// LOAD CURRENT USER
// =====================================================

function loadCurrentUser() {
    const userData = localStorage.getItem("user");

    if (!userData) {
        window.location.href = "login.html";
        return null;
    }

    const user = JSON.parse(userData);

    const usernameElement =
        document.getElementById("currentUsername");

    const handleElement =
        document.getElementById("currentUserHandle");

    const avatarElement =
        document.getElementById("currentUserAvatar");

    if (usernameElement) {
        usernameElement.textContent =
            user.username;
    }

    if (handleElement) {
        handleElement.textContent =
            `@${user.username}`;
    }

    if (avatarElement) {
        avatarElement.textContent =
            user.username
                .charAt(0)
                .toUpperCase();
    }

    return user;
}


// =====================================================
// LOAD POSTS
// =====================================================

async function loadPosts() {
    const feed =
        document.getElementById("feed");

    const loading =
        document.getElementById("feedLoading");

    try {
        const response =
            await fetch(`${API_URL}/posts`);

        const posts =
            await response.json();

        if (!response.ok) {
            throw new Error(
                posts.message ||
                "Failed to load posts"
            );
        }

        if (loading) {
            loading.remove();
        }

        if (posts.length === 0) {
            feed.innerHTML = `
                <div class="feed-message card">
                    <p>No posts yet.</p>
                </div>
            `;

            return;
        }

        posts.forEach(post => {
            createPostElement(post);
        });

    } catch (error) {
        console.error(
            "Load posts error:",
            error
        );

        if (loading) {
            loading.innerHTML = `
                <p>
                    Failed to load posts.
                </p>
            `;
        }
    }
}


// =====================================================
// CREATE POST ELEMENT
// =====================================================

function createPostElement(post) {

    const template =
        document.getElementById("postTemplate");

    const feed =
        document.getElementById("feed");

    const postElement =
        template.content
            .cloneNode(true);

    const article =
        postElement.querySelector(
            ".post-card"
        );

    const avatar =
        postElement.querySelector(
            "[data-user-avatar]"
        );

    const username =
        postElement.querySelector(
            "[data-username]"
        );

    const postTime =
        postElement.querySelector(
            "[data-post-time]"
        );

    const content =
        postElement.querySelector(
            "[data-post-content]"
        );

    const imageContainer =
        postElement.querySelector(
            "[data-post-image-container]"
        );

    const image =
        postElement.querySelector(
            "[data-post-image]"
        );

    const likeCount =
        postElement.querySelector(
            "[data-like-count]"
        );

    const commentCount =
        postElement.querySelector(
            "[data-comment-count]"
        );

    const likeButton =
        postElement.querySelector(
            "[data-like-btn]"
        );

    const commentLink =
        postElement.querySelector(
            "[data-comment-link]"
        );


    // -------------------------------------------------
    // POST ID
    // -------------------------------------------------

    article.dataset.postId =
        post._id;


    // -------------------------------------------------
    // USER INFORMATION
    // -------------------------------------------------

    const postUser =
        post.user || {};

    const postUsername =
        postUser.username || "User";

    username.textContent =
        postUsername;

    avatar.textContent =
        postUsername
            .charAt(0)
            .toUpperCase();


    // -------------------------------------------------
    // POST CONTENT
    // -------------------------------------------------

    content.textContent =
        post.content;


    // -------------------------------------------------
    // POST TIME
    // -------------------------------------------------

    postTime.textContent =
        `@${postUsername} · ${formatPostDate(
            post.createdAt
        )}`;


    // -------------------------------------------------
    // POST IMAGE
    // -------------------------------------------------

    if (post.image) {

        imageContainer.hidden =
            false;

        image.src =
            `http://localhost:5000${post.image}`;

    }


    // -------------------------------------------------
    // LIKE COUNT
    // -------------------------------------------------

    const likes =
        post.likes || [];

    likeCount.textContent =
        `${likes.length} Likes`;


    // -------------------------------------------------
    // COMMENT LINK
    // -------------------------------------------------

    commentCount.textContent =
        "Comments";

    commentLink.href =
        `post.html?id=${post._id}`;


    // -------------------------------------------------
    // LIKE BUTTON
    // -------------------------------------------------

    likeButton.addEventListener(
        "click",
        () => likePost(
            post._id,
            likeCount,
            likeButton
        )
    );


    feed.appendChild(
        postElement
    );
}


// =====================================================
// CREATE NEW POST
// =====================================================

async function createPost() {

    const token =
        localStorage.getItem("token");

    if (!token) {
        window.location.href =
            "login.html";

        return;
    }

    const contentInput =
        document.getElementById(
            "postInput"
        );

    const imageInput =
        document.getElementById(
            "imageInput"
        );

    const content =
        contentInput.value.trim();

    if (!content) {
        alert(
            "Please write something before posting."
        );

        return;
    }


    const formData =
        new FormData();

    formData.append(
        "content",
        content
    );


    if (
        imageInput.files &&
        imageInput.files.length > 0
    ) {

        formData.append(
            "image",
            imageInput.files[0]
        );

    }


    try {

        const response =
            await fetch(
                `${API_URL}/posts`,
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    },

                    body: formData
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to create post."
            );

            return;
        }


        alert(
            "Post created successfully!"
        );


        // Clear input

        contentInput.value = "";

        imageInput.value = "";


        // Hide image preview

        const imagePreview =
            document.getElementById(
                "imagePreview"
            );

        imagePreview.hidden =
            true;


        // Reload feed

        const feed =
            document.getElementById(
                "feed"
            );

        feed.innerHTML = "";


        loadPosts();

    } catch (error) {

        console.error(
            "Create post error:",
            error
        );

        alert(
            "Cannot connect to server."
        );
    }
}


// =====================================================
// LIKE / UNLIKE POST
// =====================================================

async function likePost(
    postId,
    likeCountElement,
    likeButton
) {

    const token =
        localStorage.getItem("token");

    if (!token) {

        alert(
            "Please login first."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/posts/${postId}/like`,
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to like post."
            );

            return;
        }


        likeCountElement.textContent =
            `${data.likes} Likes`;


        if (
            data.message ===
            "Post liked"
        ) {

            likeButton.textContent =
                "Unlike";

        } else {

            likeButton.textContent =
                "Like";
        }

    } catch (error) {

        console.error(
            "Like post error:",
            error
        );

        alert(
            "Cannot connect to server."
        );
    }
}


// =====================================================
// IMAGE PREVIEW
// =====================================================

function setupImagePreview() {

    const imageInput =
        document.getElementById(
            "imageInput"
        );

    const imagePreview =
        document.getElementById(
            "imagePreview"
        );

    const previewImage =
        document.getElementById(
            "previewImage"
        );

    const removeImageBtn =
        document.getElementById(
            "removeImageBtn"
        );


    imageInput.addEventListener(
        "change",
        () => {

            const file =
                imageInput.files[0];

            if (!file) {

                imagePreview.hidden =
                    true;

                return;
            }


            const imageURL =
                URL.createObjectURL(
                    file
                );

            previewImage.src =
                imageURL;

            imagePreview.hidden =
                false;
        }
    );


    removeImageBtn.addEventListener(
        "click",
        () => {

            imageInput.value =
                "";

            previewImage.src =
                "";

            imagePreview.hidden =
                true;
        }
    );
}


// =====================================================
// DATE FORMAT
// =====================================================

function formatPostDate(
    dateString
) {

    const date =
        new Date(dateString);

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


// =====================================================
// PAGE INITIALIZATION
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const user =
            loadCurrentUser();

        if (!user) {
            return;
        }


        const createPostBtn =
            document.getElementById(
                "createPostBtn"
            );


        if (createPostBtn) {

            createPostBtn.addEventListener(
                "click",
                createPost
            );
        }


        setupImagePreview();

        loadPosts();
    }
);