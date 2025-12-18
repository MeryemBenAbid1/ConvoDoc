# ============================================
# ConvoDoc Discord Bot
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
import discord
from discord.ext import commands

# Import your existing pipeline
from pipeline import build_docx_pipeline

# ============================================
# CONFIGURATION (ENV VARIABLES ONLY)
# ============================================

BOT_TOKEN = os.getenv("DISCORD_BOT_TOKEN")

if not BOT_TOKEN:
    raise RuntimeError(
        "DISCORD_BOT_TOKEN is not set. "
        "Create a .env file or set the environment variable."
    )

# ============================================
# BOT SETUP
# ============================================

intents = discord.Intents.default()
intents.message_content = True

bot = commands.Bot(command_prefix="!", intents=intents)

# ============================================
# EVENTS
# ============================================

@bot.event
async def on_ready():
    print(f"✅ Bot is online as {bot.user}")
    print(f"   Servers: {len(bot.guilds)}")
    print("   Ready to convert documents!")

    await bot.change_presence(
        activity=discord.Activity(
            type=discord.ActivityType.watching,
            name="for PDF files | !help"
        )
    )


@bot.event
async def on_message(message):
    if message.author == bot.user:
        return

    if message.attachments:
        for attachment in message.attachments:
            if attachment.filename.lower().endswith(".pdf"):
                await process_pdf(message, attachment)
                return

    await bot.process_commands(message)

# ============================================
# COMMANDS
# ============================================

@bot.command(name="convert")
async def convert_command(ctx):
    embed = discord.Embed(
        title="📄 ConvoDoc - PDF to Word Converter",
        description="Upload a PDF file and receive an editable Word document.",
        color=discord.Color.blue()
    )

    embed.add_field(
        name="How to use",
        value="Simply upload a PDF file in this channel.",
        inline=False
    )

    embed.add_field(
        name="Features",
        value="• Arabic & English support\n• RTL handling\n• Image preservation",
        inline=False
    )

    await ctx.send(embed=embed)


@bot.command(name="ping")
async def ping(ctx):
    latency = round(bot.latency * 1000)
    await ctx.send(f"🏓 Pong! {latency}ms")

# ============================================
# PDF PROCESSING
# ============================================

async def process_pdf(message, attachment):
    processing_msg = await message.reply("⏳ Processing your PDF...")

    try:
        os.makedirs("temp", exist_ok=True)

        file_id = str(uuid.uuid4())
        original_name = os.path.splitext(attachment.filename)[0]
        input_path = f"temp/{file_id}_{attachment.filename}"

        await attachment.save(input_path)

        output_path = build_docx_pipeline(
            input_path=input_path,
            output_filename=f"{file_id}_{original_name}"
        )

        file_size_mb = os.path.getsize(output_path) / (1024 * 1024)

        if file_size_mb > 8:
            await processing_msg.edit(
                content="⚠️ Converted file exceeds Discord's 8MB limit."
            )
            return

        await message.reply(
            content="✅ Conversion complete!",
            file=discord.File(output_path, filename=f"{original_name}.docx")
        )

        await processing_msg.delete()

    except Exception as e:
        await processing_msg.edit(
            content=f"❌ Error processing document:\n`{str(e)}`"
        )

# ============================================
# CUSTOM HELP
# ============================================

bot.remove_command("help")

@bot.command(name="help")
async def help_command(ctx):
    embed = discord.Embed(
        title="📖 ConvoDoc Help",
        color=discord.Color.green()
    )

    embed.add_field(
        name="📄 Convert PDF",
        value="Upload a PDF file directly.",
        inline=False
    )

    embed.add_field(
        name="Commands",
        value="`!convert` – info\n`!ping` – bot status\n`!help` – help",
        inline=False
    )

    await ctx.send(embed=embed)

# ============================================
# MAIN
# ============================================

def main():
    print("🚀 Starting ConvoDoc Discord Bot...")
    bot.run(BOT_TOKEN)

if __name__ == "__main__":
    main()
