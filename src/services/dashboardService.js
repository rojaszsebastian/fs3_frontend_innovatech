import api from "../api/dashboardApi";

export const getDashboardSummary = async () => {

    const response = await api.get("/dashboard/summary");

    return response.data;
};