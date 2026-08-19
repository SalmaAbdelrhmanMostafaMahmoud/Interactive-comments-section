const mainComment = document.getElementById('main-comment');
const overLay = document.querySelector('.model-overlay');
let data;
async function fetchComments() {
    try {
        const saved = localStorage.getItem('commentsData');
        if (saved) {
            data = JSON.parse(saved);
        } else {
            const res = await fetch('data.json');
            data = await res.json();
            savedData()
        }
        displayCurrentComment();
        displayReplies();
    } catch (error) {
        console.log(error)
    }
}
function savedData() {
    localStorage.setItem('commentsData', JSON.stringify(data));
}
function renderComments(comment) {
    const { id, user, createdAt, content, score } = comment
    return `<div data-id="${id}" class="comment-card">         
    <div class="flx-design">
                <div class="increment-decrement-replies" aria-label="increment or decrement number of replies">
                    <img src="images/icon-plus.svg" alt="plus sign" class="plus-replies">
                    <span class="number-of-inc-dec-replies" aria-label="number of replies">${score}</span>
                    <img src="images/icon-minus.svg" alt="minus sign" class="minus-replies">
                </div>
                <div class="main-comment">
                    <div class="comment-owner">
                        <div class="comment-owner-details">
                            <img src="${user.image.png}" alt="picture of comments owner" class="img-of-comment">
                            <h2 class="comment-owner-name">${user.username}</h2>
                            <span class="date-of-comment">${createdAt}</span>
                            <div class="reply-on-comments">
                            <img src="images/icon-reply.svg" alt="reply sign" class="reply-sign">
                            <span class="reply">Reply</span>
                        </div>
                        </div>
                        <p class="content-of-comment">${content}</p>
                    </div>
                </div>
            </div>
            </div>
            <div class="reply-section" data-parent-id="${id}"></div> `;

}
function displayCurrentComment() {
    mainComment.innerHTML = '';
    data.comments.forEach(comment => {
        mainComment.innerHTML += renderComments(comment)
    })
}
function renderReplies(reply, currentUser , parentUsername) {
    const { id, user, createdAt, content, score, replyingTo } = reply;
    const taggedUser = replyingTo || parentUsername;
    const isOwner = user.username === currentUser;
    return ` <div  data-id="${id}" class="comment-card replies-pattern">          
<div class="flx-design">
                <div class="increment-decrement-replies" aria-label="increment or decrement number of replies">
                    <img src="images/icon-plus.svg" alt="plus sign" class="plus-replies">
                    <span class="number-of-inc-dec-replies" aria-label="number of replies">${score}</span>
                    <img src="images/icon-minus.svg" alt="minus sign" class="minus-replies">
                </div>
                <div class="replies-on-main-comment">
                    <div class="${isOwner ? 'comment-owner' : 'comment-owner-replies'}">
                        <div class="${isOwner ? 'comment-owner-details' : 'comment-owner-replies-details'}">
                            <img src="${user.image.png}" alt="picture of comment owner" class="${isOwner ? 'img-of-user' : 'img-of-comment'}">
                            <h2 class="${isOwner ? 'comment-user-name' : 'comment-owner-name'}">${user.username}</h2>
                            ${isOwner ? '<span class="tag-of-user">you</span>' : ''}
                            <span class="${isOwner ? 'date-of-comment-user' : 'date-of-comment'}">${createdAt}</span>${isOwner ? `
                        <div class="user-reply-on-comments">
                            <img src="images/icon-delete.svg" alt="delete icon" class="delete-icon">
                            <span class="delete">Delete</span>
                            <img src="images/icon-edit.svg" alt="edit icon" class="edit-icon">
                            <span class="edit">Edit</span>
                        </div>` : `
                        <div class="reply-on-comments">
                            <img src="images/icon-reply.svg" alt="reply sign" class="reply-sign">
                            <span class="reply">Reply</span>
                        </div>`}
                        </div>
                         <p class="content-of-comment"><span class="tag-span">@${taggedUser} </span>${content}</p>
                    </div>
                </div>
            </div>
            </div> ` ;
}
function displayReplies() {
    data.comments.forEach(comment => {
        const repliesOnComment = document.querySelector(`.reply-section[data-parent-id="${comment.id}"]`);
        if (!repliesOnComment) return;
        repliesOnComment.innerHTML = ``;
        if (comment.replies && comment.replies.length > 0) {
            comment.replies.forEach(reply => {
                repliesOnComment.innerHTML += renderReplies(reply, data.currentUser.username , comment.user.username)

            })
        }
    })
}
let commentIdTODelete = null;
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('plus-replies')) {
        const commentId = e.target.closest('[data-id]').dataset.id;
        updateScore(commentId, 'plus', e)
    }
    if (e.target.classList.contains('minus-replies')) {
        const commentId = e.target.closest('[data-id]').dataset.id;
        updateScore(commentId, 'minus', e)
    }
    if (e.target.classList.contains('delete-icon') || e.target.classList.contains('delete')) {
        const commentCard = e.target.closest('[data-id]');
        if (commentCard) {
            commentIdTODelete = commentCard.dataset.id
        }
        overLay.style.display = 'flex';
        overLay.style.justifyContent = 'center';
        overLay.style.alignItems = 'center';
        document.body.classList.add('no-scroll');
    }
    if (e.target.classList.contains('del-btn')) {
        if (commentIdTODelete) {
            overLay.style.display = 'none';
            document.body.classList.remove('no-scroll');
            deleteComment(commentIdTODelete)
        }
    }
    if (e.target.classList.contains('cancel-btn')) {
        overLay.style.display = 'none';
        document.body.classList.remove('no-scroll');
    }
    if (e.target.classList.contains('edit-icon') || e.target.classList.contains('edit')) {
        openEditMode(e)
    }
    if (e.target.classList.contains('reply-sign') || e.target.classList.contains('reply')) {
        replyOnComment(e)
    }
})
function updateScore(id, action, e) {
    let targetObjScore = null;
    data.comments.forEach(comment => {
        if (String(comment.id) === String(id)) {
            if (action === 'plus') comment.score++;
            if (action === 'minus' && comment.score > 0) comment.score--;
            targetObjScore = comment;
        }
        if (comment.replies && comment.replies.length > 0) {
            comment.replies.forEach(reply => {
                if (String(reply.id) === String(id)) {
                    if (action === 'plus') reply.score++;
                    if (action === 'minus' && reply.score > 0) reply.score--;
                    targetObjScore = reply;
                }

            })
        }

    })
    if (targetObjScore) {
        const clickedElement = e.target.closest('[data-id]');
        const spanElement = clickedElement.querySelector('.number-of-inc-dec-replies');
        if (spanElement) {
            spanElement.textContent = targetObjScore.score;
        }
        savedData()
    }
}
function deleteComment(id) {
    data.comments = data.comments.filter(comment => {
        if (String(comment.id) === String(id)) {
            return comment.user.username !== data.currentUser.username;
        }
        return true;
    });
    data.comments.forEach(comment => {
        if (comment.replies && comment.replies.length > 0) {
            comment.replies = comment.replies.filter(reply => {
                if (String(reply.id) === String(id)) {
                    return reply.user.username !== data.currentUser.username
                }
                return true
            })
        }
    })
    displayCurrentComment();
    displayReplies();
    savedData()
}
const sendBtn = document.getElementById('send-btn');
const inputComment = document.querySelector('.comment-input')
sendBtn.addEventListener('click', () => {
    const commentText = inputComment.value.trim()
    if (commentText === "") {
        return
    }
    addNewComment( commentText)
})
function addNewComment(comment) {
    const newComment = {
        id: Date.now(),
        content: comment,
        createdAt: "Just now",
        score: 0,
        user: {
            image: {
                png: "images/image-juliusomo.png",
            },
            username: "juliusomo"
        },
        replies: []
    }
    data.comments.push(newComment);
    displayCurrentComment();
    displayReplies();
    inputComment.value = "";
    savedData()
}
function openEditMode(e) {
    const commentCard = e.target.closest('[data-id]');
    const commentId = commentCard.dataset.id;
    const commentP = commentCard.querySelector('.content-of-comment');
    const tagP = commentP.querySelector('.tag-span');
    const commentText = tagP ? commentP.textContent.replace(tagP.textContent, '').trim() : commentP.textContent.trim();
    const inputEditedComment = document.createElement('textarea');
    inputEditedComment.className = 'edit-comment';
    inputEditedComment.value = commentText;
    commentP.replaceWith(inputEditedComment)
    const deletedIcon = commentCard.querySelector('.delete-icon');
    const editedIcon = commentCard.querySelector('.edit-icon');
    const deletedSpan = commentCard.querySelector('.delete');
    const editedSpan = commentCard.querySelector('.edit');
    if (deletedIcon) { deletedIcon.style.pointerEvents = 'none'; deletedIcon.style.opacity = '0.5'; }
    if (editedIcon) { editedIcon.style.pointerEvents = 'none'; editedIcon.style.opacity = '0.5'; }
    if (deletedSpan) { deletedSpan.style.pointerEvents = 'none'; deletedSpan.style.opacity = '0.5'; }
    if (editedSpan) { editedSpan.style.pointerEvents = 'none'; editedSpan.style.opacity = '0.5'; };
    const editedBtn = document.createElement('button');
    editedBtn.className = 'edit-button';
    editedBtn.textContent = 'UPDATE';
    commentCard.appendChild(editedBtn);
    editedBtn.addEventListener('click', () => {
        const updatedText = inputEditedComment.value;
        editComment(commentId, updatedText)
    })
}
function editComment(id, editInput) {
    data.comments.forEach(comment => {
        if (String(comment.id) === String(id)) {
            comment.content = editInput
        }
        if (comment.replies && comment.replies.length > 0) {
            comment.replies.forEach(reply => {
                if (String(reply.id) === String(id)) {
                    reply.content = editInput
                }
            })

        }
    })
    displayCurrentComment();
    displayReplies();
    savedData()
}
function replyOnComment(e) {
    const commentCard = e.target.closest('[data-id]');
    const commentId = commentCard.dataset.id;
    const existingInput = document.querySelector('.reply-input-container');
    if(existingInput){
existingInput.remove()
    }
    let targetUserName = "";
    data.comments.forEach(comment => {
        if (String(comment.id) === String(commentId)) {
            targetUserName = comment.user.username
        }
        if (comment.replies) {
            comment.replies.forEach(reply => {
                if (String(reply.id) === String(commentId)) {
                    targetUserName = reply.user.username
                }
            })
        }
    })
    const inputReplyComment = document.createElement('div');
    inputReplyComment.className = 'reply-input-container';
    inputReplyComment.innerHTML = `         
    <section class="input" aria-labelledby="add-comment">
            <form action="#" id="add-comment-reply">
        <img src="images/image-juliusomo.png" alt="picture of comments owner" class="img-of-user">
        <input placeholder="@ ${targetUserName}...." class="comment-reply">
        <button type="button" id="reply-btn">REPLY</button>
            </form>
    </section>`;
    commentCard.after(inputReplyComment)
const valueOfReply = inputReplyComment.querySelector('.comment-reply');
const replyBtn = inputReplyComment.querySelector('#reply-btn');
    replyBtn.addEventListener('click', () => {
        const replyText = valueOfReply.value;
        if (replyText.trim() !== "") {
            newReply( replyText, targetUserName, commentId)
            inputReplyComment.remove()
        }
    })
}
function newReply( replycomment, targetedComment, mainCommentId) {
    const reply = {
        id: Date.now(),
        content: replycomment,
        createdAt: "Just now",
        score: 0,
        replyingTo: targetedComment,
        "user": {
            "image": {
                "png": "images/image-juliusomo.png"
            },
            "username": "juliusomo"
        }
    }
    data.comments.forEach(comment => {
        if (String(comment.id) === String(mainCommentId) || comment.replies && comment.replies.some(r => String(r.id) === String(mainCommentId))) {
            if (!comment.replies) comment.replies = []
            comment.replies.push(reply)
        }
    })
    displayCurrentComment();
    displayReplies();
    savedData()
}
console.log(localStorage);
fetchComments()