
import { useEffect, useState } from "react";
import { getComments, addComment } from "../services/commentApi";

function TaskComments({ taskId }) {
    const [comments, setComments] = useState([]);
    const [content, setContent] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Get comments for this task
    async function fetchComments() {
        try {
            setError("");

            const response = await getComments(taskId);
            setComments(response.comments);
        } catch (error) {
            setError(error.message);
        }
    }

    useEffect(function () {
        fetchComments();
    }, [taskId]);

    // Add a new comment
    async function handleAddComment(event) {
        event.preventDefault();

        try {
            setError("");
            setMessage("");

            await addComment(taskId, content);

            setContent("");
            setMessage("Comment added successfully!");

            fetchComments();
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div>
            <h4>Comments</h4>

            <form onSubmit={handleAddComment}>
                <textarea
                    placeholder="Write a comment..."
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    required
                />

                <button type="submit">Add Comment</button>
            </form>

            {message && <p>{message}</p>}
            {error && <p>{error}</p>}

            {comments.length === 0 ? (
                <p>No comments yet.</p>
            ) : (
                comments.map(function (comment) {
                    return (
                        <div key={comment._id}>
                            <p>{comment.content}</p>
                            <small>
                                {comment.user?.userName || "User"} -{" "}
                                {comment.createdAt?.slice(0, 10)}
                            </small>
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default TaskComments;
