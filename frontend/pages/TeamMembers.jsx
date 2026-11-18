
import { useEffect, useState } from "react";
import { getUsers } from "../services/userApi";

function TeamMembers() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    useEffect(function () {
        async function fetchUsers() {
            try {
                const response = await getUsers();
                setUsers(response.users);
            } catch (error) {
                setError(error.message);
            }
        }

        fetchUsers();
    }, []);

    return (
        <div className="team-members-page">
            <h1>Team Members</h1>

            {error && (
                <p className="error-message">{error}</p>
            )}

            {users.length === 0 ? (
                <p>No team members found.</p>
            ) : (
                <div className="team-members-list">
                    {users.map(function (user) {
                        return (
                            <div
                                className="team-member-card"
                                key={user._id}
                            >
                                <h3>{user.userName}</h3>

                                <p>
                                    <strong>Email:</strong> {user.email}
                                </p>

                                <p>
                                    <strong>Role:</strong> {user.role}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default TeamMembers;
