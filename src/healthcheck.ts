if (process.env.HEALTH_CHECK_URL) {
    const url = process.env.HEALTH_CHECK_URL;
    const interval = Number(process.env.HEALTH_CHECK_INTERVAL) || 300;
    
    const push = async () => {
        try {
            await fetch(url);

        } catch (error) {
            console.error("Health check failed:", error);
        }
    };
    setTimeout(() => {
        push()
        console.log("Healthcheck initialized.");
    }, 5000);
    setInterval(push, interval * 1000);
    
}
