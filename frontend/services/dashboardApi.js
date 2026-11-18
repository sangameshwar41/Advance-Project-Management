
import request from "./api";

// Get dashboard information
export async function getDashboard() {
    return await request("/dashboard");
}
