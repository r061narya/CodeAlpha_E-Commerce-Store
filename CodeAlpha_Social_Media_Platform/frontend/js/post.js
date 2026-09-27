// =====================================================
// GET POST ID FROM URL
// =====================================================

function getPostId() {
    const params = new URLSearchParams(
        window.location.search
    );

    return params.get("id");
}


// =====================================================
// GET CURRENT USER
// =====================================================

function getCurrentUser() {
    const userData =
        localStorage.getItem("user");

    if (!userData) {
        window.location.href = "login.html";
        return null;
    }

    return JSON.parse(userData);
}


// =====================================================
// LOAD SINGLE POST
// =====================================================

async function loadPost() {

    const postId = getPostId();

    const loading =
        document.getElementById("postLoading");

    const postContent =
        document.getElementById("postContent");


    if (!postId) {

        loading.innerHTML = `
            <p>
                Post not found.
            </p>
        `;

        return;
    }


    try {

        /*
         * Our backend currently has:
         * GET /api/posts
         *
         * It does not have:
         * GET /api/posts/:id
         *
         * So we get all posts and find
         * the required post here.
         */

        const response =
            await fetch(
                `${API_URL}/posts`
            );


        const posts =
            await response.json();


        if (!response.ok) {

            throw new Error(
                posts.message ||
                "Failed to load posts"
            );
        }


        const post =
            posts.find(
                item =>
                    item._id === postId
            );


        if (!post) {

            loading.innerHTML = `
                <p>
                    Post not found.
                </p>
            `;

            return;
        }


        // Show post

        displayPost(post);


        loading.hidden = true;

        postContent.hidden = false;


    } catch (error) {

        console.error(
            "Load post error:",
            error
        );

        loading.innerHTML = `
            <p>
                Failed to load post.
            </p>
        `;
    }
}


// =====================================================
// DISPLAY POST
// =====================================================

function displayPost(post) {

    const user =
        post.user || {};


    const username =
        user.username || "User";


    // -------------------------------------------------
    // AUTHOR
    // -------------------------------------------------

    const authorName =
        document.getElementById(
            "postAuthorName"
        );


    const authorAvatar =
        document.getElementById(
            "postAuthorAvatar"
        );


    const createdAt =
        document.getElementById(
            "postCreatedAt"
        );


    authorName.textContent =
        username;


    authorAvatar.textContent =
        username
            .charAt(0)
            .toUpperCase();


    createdAt.textContent =
        `@${username} · ${formatPostDate(
            post.createdAt
        )}`;


    // -------------------------------------------------
    // CONTENT
    // -------------------------------------------------

    document.getElementById(
        "singlePostText"
    ).textContent =
        post.content;


    // -------------------------------------------------
    // IMAGE
    // -------------------------------------------------

    const imageContainer =
        document.getElementById(
            "singlePostImageContainer"
        );


    const image =
        document.getElementById(
            "singlePostImage"
        );


    if (post.image) {

        image.src =
            `http://localhost:5000${post.image}`;

        imageContainer.hidden =
            false;

    } else {

        imageContainer.hidden =
            true;
    }


    // -------------------------------------------------
    // LIKES
    // -------------------------------------------------

    const likes =
        post.likes || [];


    document.getElementById(
        "singlePostLikes"
    ).textContent =
        `${likes.length} Likes`;


    // -------------------------------------------------
    // LIKE BUTTON
    // -------------------------------------------------

    const likeButton =
        document.getElementById(
            "singlePostLikeBtn"
        );


    const currentUser =
        getCurrentUser();


    if (currentUser) {

        const alreadyLiked =
            likes.some(
                id =>
                    id.toString() ===
                    currentUser.id.toString()
            );


        likeButton.textContent =
            alreadyLiked
                ? "Unlike"
                : "Like";
    }


    likeButton.onclick =
        () => likePost(
            post._id
        );
}


// =====================================================
// LIKE / UNLIKE POST
// =====================================================

async function likePost(
    postId
) {

    const token =
        localStorage.getItem(
            "token"
        );


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


        document.getElementById(
            "singlePostLikes"
        ).textContent =
            `${data.likes} Likes`;


        const likeButton =
            document.getElementById(
                "singlePostLikeBtn"
            );


        likeButton.textContent =
            data.message === "Post liked"
                ? "Unlike"
                : "Like";


    } catch (error) {

        console.error(
            "Like error:",
            error
        );

        alert(
            "Cannot connect to server."
        );
    }
}


// =====================================================
// LOAD COMMENTS
// =====================================================

async function loadComments() {

    const postId =
        getPostId();


    const commentsList =
        document.getElementById(
            "commentsList"
        );


    const loading =
        document.getElementById(
            "commentsLoading"
        );


    if (!postId) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/posts/${postId}/comments`
            );


        const comments =
            await response.json();


        if (!response.ok) {

            throw new Error(
                comments.message ||
                "Failed to load comments"
            );
        }


        if (loading) {
            loading.remove();
        }


        if (comments.length === 0) {

            commentsList.innerHTML = `
                <div class="feed-message">
                    <p>
                        No comments yet.
                    </p>
                </div>
            `;

            return;
        }


        comments.forEach(
            comment => {

                createCommentElement(
                    comment,
                    commentsList
                );
            }
        );


    } catch (error) {

        console.error(
            "Load comments error:",
            error
        );


        if (loading) {

            loading.innerHTML = `
                <p>
                    Failed to load comments.
                </p>
            `;
        }
    }
}


// =====================================================
// CREATE COMMENT ELEMENT
// =====================================================

function createCommentElement(
    comment,
    container
) {

    const user =
        comment.user || {};


    const username =
        user.username || "User";


    const commentElement =
        document.createElement(
            "div"
        );


    commentElement.className =
        "comment-item";


    commentElement.innerHTML = `
        <div class="comment-user">

            <div class="avatar">
                ${username
                    .charAt(0)
                    .toUpperCase()}
            </div>

            <div class="user-info">

                <h3>
                    ${escapeHTML(username)}
                </h3>

                <span>
                    ${formatPostDate(
                        comment.createdAt
                    )}
                </span>

            </div>

        </div>

        <p class="comment-text">
            ${escapeHTML(comment.text)}
        </p>
    `;


    container.appendChild(
        commentElement
    );
}


// =====================================================
// ADD COMMENT
// =====================================================

async function addComment(
    event
) {

    event.preventDefault();


    const token =
        localStorage.getItem(
            "token"
        );


    if (!token) {

        alert(
            "Please login first."
        );

        return;
    }


    const postId =
        getPostId();


    const input =
        document.getElementById(
            "commentInput"
        );


    const text =
        input.value.trim();


    if (!text) {

        alert(
            "Please write a comment."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/posts/${postId}/comments`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        text: text
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Failed to add comment."
            );

            return;
        }


        input.value = "";


        const commentsList =
            document.getElementById(
                "commentsList"
            );


        // Remove "No comments yet" message

        commentsList
            .querySelectorAll(
                ".feed-message"
            )
            .forEach(
                element =>
                    element.remove()
            );


        createCommentElement(
            data.comment,
            commentsList
        );


    } catch (error) {

        console.error(
            "Add comment error:",
            error
        );

        alert(
            "Cannot connect to server."
        );
    }
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
// ESCAPE HTML
// =====================================================

function escapeHTML(
    text
) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text || "";


    return div.innerHTML;
}


// =====================================================
// PAGE INITIALIZATION
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        getCurrentUser();

        loadPost();

        loadComments();


        const commentForm =
            document.getElementById(
                "commentForm"
            );


        if (commentForm) {

            commentForm.addEventListener(
                "submit",
                addComment
            );
        }
    }
);