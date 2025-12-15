from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid

from pipeline import build_docx_pipeline

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],  # Next.js ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/process", response_class=FileResponse)
async def process_document(file: UploadFile = File(...)):
    try:
        os.makedirs("temp", exist_ok=True)

        file_id = str(uuid.uuid4())
        input_path = f"temp/{file_id}_{file.filename}"

        # Save uploaded file
        with open(input_path, "wb") as f:
            content = await file.read()
            f.write(content)

        # Extract original name without extension
        original_name = os.path.splitext(file.filename)[0]
        if not original_name:
            original_name = "converted"

        # Process the file
        output_path = build_docx_pipeline(
            input_path=input_path,
            output_filename=original_name
        )

        # Check if output file exists
        if not os.path.exists(output_path):
            raise HTTPException(
                status_code=500,
                detail="Failed to generate output file"
            )

        return FileResponse(
            path=output_path,
            filename=f"{original_name}.docx",
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing document: {str(e)}"
        )


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok", "message": "Backend is running"}
