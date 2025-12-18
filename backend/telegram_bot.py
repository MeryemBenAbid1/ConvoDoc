# ============================================
# ConvoDoc Telegram Bot
# ============================================
#
# This bot accepts PDF files and returns converted .docx files
# Uses pipeline.py for conversion logic
#
# IMPORTANT:
# - Do NOT hardcode tokens in this file
# - Tokens must be set via environment variables
#
# ============================================

import os
import uuid
import logging
from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    ContextTypes,
    filters,
)

# Import your existing pipeline
from pipeline import build_docx_pipeline

# ============================================
# CONFIGURATION (ENV VARIABLES ONLY)
# ============================================

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

if not BOT_TOKEN:
    raise RuntimeError(
        "TELEGRAM_BOT_TOKEN is not set. "
        "Create a .env file or set the environment variable."
    )

# ============================================
# LOGGING
# ============================================

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)

# ============================================
# COMMAND HANDLERS
# ============================================

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "👋 Welcome to ConvoDoc Bot!\n\n"
        "I convert PDF documents to editable Word (.docx) files.\n\n"
        "📄 How to use:\n"
        "• Send me a PDF file\n"
        "• Wait a few seconds\n"
        "• Receive your Word document\n\n"
        "🌐 Features:\n"
        "• Arabic & English support\n"
        "• RTL text handling\n"
        "• Image preservation"
    )


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "📖 ConvoDoc Bot Help\n\n"
        "Commands:\n"
        "/start – Welcome message\n"
        "/help – Show this help\n\n"
        "Usage:\n"
        "Just send a PDF file and I will convert it to Word (.docx)."
    )

# ============================================
# MESSAGE HANDLERS
# ============================================

async def handle_document(update: Update, context: ContextTypes.DEFAULT_TYPE):
    document = update.message.document

    if not document.file_name.lower().endswith(".pdf"):
        await update.message.reply_text(
            "❌ Please send a PDF file. Other formats are not supported."
        )
        return

    processing_msg = await update.message.reply_text(
        "⏳ Processing your PDF... Please wait."
    )

    try:
        os.makedirs("temp", exist_ok=True)

        file_id = str(uuid.uuid4())
        original_name = os.path.splitext(document.file_name)[0]
        input_path = f"temp/{file_id}_{document.file_name}"

        file = await context.bot.get_file(document.file_id)
        await file.download_to_drive(input_path)

        logger.info(f"Downloaded: {input_path}")

        output_path = build_docx_pipeline(
            input_path=input_path,
            output_filename=f"{file_id}_{original_name}",
        )

        logger.info(f"Created: {output_path}")

        with open(output_path, "rb") as f:
            await update.message.reply_document(
                document=f,
                filename=f"{original_name}.docx",
                caption="✅ Conversion complete!",
            )

        await processing_msg.delete()

    except Exception as e:
        logger.exception("Error processing document")
        await processing_msg.edit_text(
            f"❌ Error processing document:\n{str(e)}"
        )


async def handle_photo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "📸 I only support PDF files.\n"
        "Please send your document as a PDF."
    )


async def handle_text(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "👋 Send me a PDF file and I’ll convert it to Word (.docx).\n"
        "Use /help for more info."
    )

# ============================================
# MAIN
# ============================================

def main():
    print("🚀 Starting ConvoDoc Telegram Bot...")

    application = Application.builder().token(BOT_TOKEN).build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(MessageHandler(filters.Document.ALL, handle_document))
    application.add_handler(MessageHandler(filters.PHOTO, handle_photo))
    application.add_handler(
        MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text)
    )

    print("✅ Bot is running. Press Ctrl+C to stop.")
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
