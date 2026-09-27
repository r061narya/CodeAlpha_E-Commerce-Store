// =====================================================
// GET CURRENT USER
// =====================================================

function getCurrentUser() {
    const userData = localStorage.getItem("user");

    if (!userData) {
        window.location.href = "login.html";
        return null;
    }

    return JSON.parse(userData);
}


// =====================================================
// LOAD PROFILE
// =====================================================

async function loadProfile() {

    const currentUser = getCurrentUser();

    if (!currentUser) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/users/${currentUser.username}`
            );

        const user = await response.json();

        if (!response.ok) {
            throw new Error(
                user.message ||
                "Failed to load profile"
            );
        }


        // -------------------------------------------------
        // USER INFORMATION
        // -------------------------------------------------

        document.getElementById(
            "profileUsername"
        ).textContent = user.username;


        document.getElementById(
            "profileEmail"
        ).textContent = user.email;


        document.getElementById(
            "profileBio"
        ).textContent =
            user.bio || "No bio yet.";


        // -------------------------------------------------
        // PROFILE STATS
        // -------------------------------------------------

        document.getElementById(
            "followersCount"
        ).textContent =
            user.followers
                ? user.followers.length
                : 0;


        document.getElementById(
            "followingCount"
        ).textContent =
            user.following
                ? user.following.length
                : 0;


        // -------------------------------------------------
        // PROFILE AVATAR
        // -------------------------------------------------

        setupProfileAvatar(user);


        // -------------------------------------------------
        // EDIT BIO FIELD
        // -------------------------------------------------

        document.getElementById(
            "bioInput"
        ).value =
            user.bio || "";


        // -------------------------------------------------
        // LOAD USER POSTS
        // -------------------------------------------------

        await loadProfilePosts(
            user._id
        );

    } catch (error) {

        console.error(
            "Load profile error:",
            error
        );

        alert(
            "Cannot load profile."
        );
    }
}


// =====================================================
// PROFILE AVATAR
// =====================================================

function setupProfileAvatar(user) {

    const letter =
        document.getElementById(
            "profileAvatarLetter"
        );

    const image =
        document.getElementById(
            "profileAvatarImage"
        );


    const username =
        user.username || "User";


    letter.textContent =
        username
            .charAt(0)
            .toUpperCase();


    if (user.profilePicture) {

        image.src =
            `http://localhost:5000${user.profilePicture}`;

        image.hidden = false;

        letter.hidden = true;

    } else {

        image.hidden = true;

        letter.hidden = false;
    }
}


// =====================================================
// LOAD PROFILE POSTS
// =====================================================

async function loadProfilePosts(
    userId
) {

    const postsContainer =
        document.getElementById(
            "profilePosts"
        );


    const loading =
        document.getElementById(
            "profilePostsLoading"
        );


    try {

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


        // Remove loading message

        if (loading) {
            loading.remove();
        }


        // Filter user's posts

        const userPosts =
            posts.filter(
                post =>
                    post.user &&
                    post.user._id === userId
            );


        // Update post count

        document.getElementById(
            "postCount"
        ).textContent =
            userPosts.length;


        // No posts

        if (userPosts.length === 0) {

            postsContainer.innerHTML = `
                <div class="feed-message card">
                    <p>No posts yet.</p>
                </div>
            `;

            return;
        }


        // Display posts

        userPosts.forEach(
            post => {
                createProfilePost(
                    post,
                    postsContainer
                );
            }
        );

    } catch (error) {

        console.error(
            "Load profile posts error:",
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
// CREATE PROFILE POST
// =====================================================

function createProfilePost(
    post,
    container
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "post-card card";


    // -------------------------------------------------
    // POST CONTENT
    // -------------------------------------------------

    let imageHTML = "";


    if (post.image) {

        imageHTML = `
            <div class="post-image-container">
                <img
                    src="http://localhost:5000${post.image}"
                    alt="Post image"
                >
            </div>
        `;
    }


    article.innerHTML = `
        <div class="post-header">

            <div class="post-user">

                <div class="avatar post-avatar">
                    ${post.user.username
                        .charAt(0)
                        .toUpperCase()}
                </div>

                <div class="user-info">

                    <h3>
                        ${escapeHTML(
                            post.user.username
                        )}
                    </h3>

                    <span>
                        @${escapeHTML(
                            post.user.username
                        )}
                        ·
                        ${formatPostDate(
                            post.createdAt
                        )}
                    </span>

                </div>

            </div>

        </div>

        <div class="post-content">
            ${escapeHTML(post.content)}
        </div>

        ${imageHTML}

        <div class="post-stats">

            <span>
                ${(post.likes || []).length}
                Likes
            </span>

        </div>

        <div class="post-actions">

            <a
                href="post.html?id=${post._id}"
                class="post-action-btn"
            >
                View Post
            </a>

        </div>
    `;


    container.appendChild(
        article
    );
}


// =====================================================
// EDIT PROFILE
// =====================================================

function openEditProfile() {

    const section =
        document.getElementById(
            "editProfileSection"
        );

    section.hidden = false;

    section.scrollIntoView({
        behavior: "smooth"
    });
}


// =====================================================
// CANCEL EDIT
// =====================================================

function cancelEditProfile() {

    const section =
        document.getElementById(
            "editProfileSection"
        );

    section.hidden = true;


    // Clear selected image

    document.getElementById(
        "profileImageInput"
    ).value = "";
}


// =====================================================
// SAVE PROFILE
// =====================================================

async function saveProfile() {

    const currentUser =
        getCurrentUser();

    if (!currentUser) {
        return;
    }


    const token =
        localStorage.getItem(
            "token"
        );


    if (!token) {

        window.location.href =
            "login.html";

        return;
    }


    const bio =
        document.getElementById(
            "bioInput"
        ).value.trim();


    const imageInput =
        document.getElementById(
            "profileImageInput"
        );


    const formData =
        new FormData();


    formData.append(
        "bio",
        bio
    );


    if (
        imageInput.files &&
        imageInput.files.length > 0
    ) {

        formData.append(
            "profilePicture",
            imageInput.files[0]
        );
    }


    try {

        const response =
            await fetch(
                `${API_URL}/users/${currentUser.id}`,
                {
                    method: "PUT",

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
                "Failed to update profile."
            );

            return;
        }


        // -------------------------------------------------
        // UPDATE LOCAL STORAGE USER
        // -------------------------------------------------

        const updatedUser =
            data.user;


        localStorage.setItem(
            "user",
            JSON.stringify({
                id: updatedUser._id,
                username:
                    updatedUser.username,
                email:
                    updatedUser.email,
                profilePicture:
                    updatedUser.profilePicture,
                bio:
                    updatedUser.bio
            })
        );


        alert(
            "Profile updated successfully!"
        );


        // Hide edit section

        document.getElementById(
            "editProfileSection"
        ).hidden = true;


        // Clear file input

        imageInput.value = "";


        // Reload profile

        loadProfile();

    } catch (error) {

        console.error(
            "Update profile error:",
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

        // Load profile

        loadProfile();


        // Edit button

        const editButton =
            document.getElementById(
                "editProfileBtn"
            );


        if (editButton) {

            editButton.addEventListener(
                "click",
                openEditProfile
            );
        }


        // Save button

        const saveButton =
            document.getElementById(
                "saveProfileBtn"
            );


        if (saveButton) {

            saveButton.addEventListener(
                "click",
                saveProfile
            );
        }


        // Cancel button

        const cancelButton =
            document.getElementById(
                "cancelEditBtn"
            );


        if (cancelButton) {

            cancelButton.addEventListener(
                "click",
                cancelEditProfile
            );
        }
    }
);
