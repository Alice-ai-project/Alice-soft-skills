export class StatsView {
    constructor() {
        this.statsSection = document.getElementById('stats-view');
    }

    updateStatsUI(stats) {
        if (!stats) return;
        
        // Update stats values if elements exist
        const totalCourses = document.getElementById('stat-total-courses');
        const completedCourses = document.getElementById('stat-completed-courses');
        const avgScore = document.getElementById('stat-avg-score');

        if (totalCourses) totalCourses.textContent = stats.total || 0;
        if (completedCourses) completedCourses.textContent = stats.completed || 0;
        if (avgScore) avgScore.textContent = `${stats.avg_score || 0}%`;

        // Update progress fills if any
        const completeFill = document.getElementById('stat-completed-fill');
        if (completeFill && stats.total > 0) {
            const pct = Math.round(((stats.completed || 0) / stats.total) * 100);
            completeFill.style.width = `${pct}%`;
        }
    }
}
