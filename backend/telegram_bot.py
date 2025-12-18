# ============================================
# ConvoDoc Telegram Bot
# ============================================
# 
# This bot accepts PDF files and returns converted .docx files
# Uses your existing pipeline.py - no changes needed!
#
# Setup time: ~10 minutes
# 
# SETUP STEPS:
# 1. Message @BotFather on Telegram
# 2. Send /newbot and follow prompts
# 3. Copy the API token
# 4. Paste it below in BOT_TOKEN
# 5. Run: pip install python-telegram-bot PyMuPDF python-docx
# 6. Run: python telegram_bot.py
#
# ============================================

import os
import uuid
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

# Import your existing pipeline
from pipeline import build_docx_pipeline

# ============================================
# CONFIGURATION - UPDATE THIS!
# ============================================

BOT_TOKEN = "8562047663:AAGq7BiDnbHg16L9q3yJ3jVogP4DdgTBDVk"  # Get from @BotFather

# ============================================
# LOGGING
# ============================================

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# ============================================
# BOT HANDLERS
# ============================================

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /start command."""
    welcome_message = """
👋 Welcome to ConvoDoc Bot!

I convert PDF documents to editable Word (.docx) files.

📄 **How to use:**
Just send me a PDF file and I'll convert it for you!

🌐 **Features:**
• Supports Arabic & English text
• Preserves images
• RTL text support

Send a PDF to get started!
    """
    await update.message.reply_text(welcome_message, parse_mode='Markdown')


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /help command."""
    help_text = """
📖 **ConvoDoc Bot Help**

**Commands:**
/start - Welcome message
/help - Show this help

**Usage:**
1. Send me a PDF file
2. Wait a few seconds
3. Receive your .docx file!

**Supported:**
• PDF files only
• Arabic & English text
• Embedded images
    """
    await update.message.reply_text(help_text, parse_mode='Markdown')


async def handle_document(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle incoming PDF documents."""
    document = update.message.document
    
    # Check if it's a PDF
    if not document.file_name.lower().endswith('.pdf'):
        await update.message.reply_text(
            "❌ Please send a PDF file. Other formats are not supported yet."
        )
        return
    
    # Send processing message
    processing_msg = await update.message.reply_text(
        "⏳ Processing your document... Please wait."
    )
    
    try:
        # Create temp directory
        os.makedirs("temp", exist_ok=True)
        
        # Generate unique filename
        file_id = str(uuid.uuid4())
        original_name = os.path.splitext(document.file_name)[0]
        input_path = f"temp/{file_id}_{document.file_name}"
        
        # Download the file
        file = await context.bot.get_file(document.file_id)
        await file.download_to_drive(input_path)
        
        logger.info(f"Downloaded: {input_path}")
        
        # Process with your existing pipeline
        output_path = build_docx_pipeline(
            input_path=input_path,
            output_filename=f"{file_id}_{original_name}"
        )
        
        logger.info(f"Created: {output_path}")
        
        # Send the converted file
        await update.message.reply_document(
            document=open(output_path, 'rb'),
            filename=f"{original_name}.docx",
            caption="✅ Here's your converted document!"
        )
        
        # Delete processing message
        await processing_msg.delete()
        
        # Cleanup temp files (optional - uncomment if you want auto-cleanup)
        # os.remove(input_path)
        # os.remove(output_path)
        
    except Exception as e:
        logger.error(f"Error processing document: {e}")
        await processing_msg.edit_text(
            f"❌ Error processing document: {str(e)}\n\nPlease try again."
        )


async def handle_photo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle photos - inform user to send as file."""
    await update.message.reply_text(
        "📸 I see you sent a photo!\n\n"
        "Currently I only support PDF files.\n"
        "Please send your document as a PDF file."
    )


async def handle_text(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle text messages."""
    await update.message.reply_text(
        "👋 Send me a PDF file and I'll convert it to Word (.docx)!\n\n"
        "Use /help for more information."
    )


# ============================================
# MAIN
# ============================================

def main():
    """Start the bot."""
    
    if BOT_TOKEN == "YOUR_BOT_TOKEN_HERE":
        print("❌ ERROR: Please set your BOT_TOKEN!")
        print("   1. Message @BotFather on Telegram")
        print("   2. Create a new bot with /newbot")
        print("   3. Copy the token and paste it in this file")
        return
    
    print("🚀 Starting ConvoDoc Telegram Bot...")
    
    # Create application
    application = Application.builder().token(BOT_TOKEN).build()
    
    # Add handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(MessageHandler(filters.Document.ALL, handle_document))
    application.add_handler(MessageHandler(filters.PHOTO, handle_photo))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))
    
    # Start polling
    print("✅ Bot is running! Press Ctrl+C to stop.")
    print("   Open Telegram and message your bot to test.")
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
