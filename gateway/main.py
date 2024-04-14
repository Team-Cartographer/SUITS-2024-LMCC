import logging
import uvicorn
from startup import create_data_endpoints

logging.basicConfig(level=logging.INFO)

if __name__ == "__main__":
    create_data_endpoints()
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=3001,
        log_level="info",
        reload=True,
    )